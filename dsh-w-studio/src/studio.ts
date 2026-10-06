/** Durable company roster, dependency scheduler, and public result journal. */
import { randomUUID, createHash } from 'node:crypto'
import { mkdir, readFile, writeFile, realpath, stat, unlink } from 'node:fs/promises'
import { createReadStream } from 'node:fs'
import { join, resolve, relative, isAbsolute } from 'node:path'
import z from '@deepseek-ai/schemastery'
import { writeFileAtomic } from '@deepseek-ai/dsh-atomic-write'
import type { Artifact, StudioArtifactId, Employee, StudioEmployeeId, EmployeeResult, StudioMessageId, Project, StudioProjectId, StudioConfig, StudioExecutor, StudioState, Task, StudioTaskId, StudioWorkspaceId, StudioNativeSessionId, Meeting, MeetingMinutes, StudioMeetingId, StudioNativeSession, StudioTemplateId, TeamTemplate } from './types.ts'
import { employeeSchema, outputName, parseState, migrateStateV1, migrateStateV2, migrateStateV3, migrateStateV4, validateEmployee, validateMember, withinDirectory } from './validation.ts'
import { exportProject } from './workspace.ts'
import { ResumeUnsupportedError } from './executor.ts'
import { minutesSchema, parseFields, templateSchema } from './schema.ts'
import { defaultTemplates } from './templates.ts'
import { hasHistory, planTemplate } from './roster.ts'

const commandSchema = z.object({
  action: z.string().required(), expectedRevision: z.natural().required(),
  input: z.any().required(),
})
const projectInput = z.object({ name: z.string().min(1).max(500).required(), objective: z.string().min(1).max(100_000).required(),
  cwd: z.string().required(), workspaceId: z.string().required(), acceptanceCriteria: z.string().max(100_000).required(),
  sessionMode: z.union(['employee-project', 'new-task'] as const).required(), employeeIds: z.array(z.string()).required() })
const taskInput = z.object({ projectId: z.string().required(), employeeId: z.string().required(),
  title: z.string().min(1).max(500).required(), instruction: z.string().min(1).max(100_000).required(),
  dependsOn: z.array(z.string()).required(), outputFiles: z.array(z.string()).required() })
const answerInput = z.object({ id: z.string().required(), reply: z.string().min(1).max(100_000).required() })
const messageInput = z.object({ projectId: z.string().required(), to: z.string().required(),
  message: z.string().min(1).max(100_000).required() })
const meetingFields = { title: z.string().min(1).max(500).required(), agenda: z.string().max(100_000).required(),
  hostId: z.string().required(), attendeeIds: z.array(z.string()).required() }
const meetingMessageInput = z.object({ id: z.string().required(), message: z.string().min(1).max(100_000).required(),
  mentions: z.array(z.string()).required() })
/** Tells the employee when it may pause for the user instead of guessing or working around the gap. */
const needsUserRule = '只有遇到必须由甲方本人完成、你无法自行完成或绕过的事（例如操作真机或硬件、登录或提供账号与密钥、付费、需要甲方拍板的决定）时，才停下并在 needsUser 中写清需要甲方做什么、做完后怎样回复你；此时 message 简述已完成的进展，files 和 handoffs 留空。甲方回复后你会在同一会话中继续。其他情况 needsUser 必须为 ""。'
/** Employee turns allowed after one client message before the floor returns to the client. */
const meetingChainLimit = 6
/** Meeting actions validate against the live meeting (status, attendees, active turn) instead of the observed revision,
 * because background speaker turns advance the revision between every browser poll. */
const liveCheckedActions = new Set(['createMeeting', 'updateMeeting', 'meetingMessage', 'stopMeeting', 'draftMinutes',
  'saveMinutes', 'resumeMeeting', 'reviewMinutes', 'meetingProject', 'closeMeeting'])

function identity(input: unknown): string {
  const schema = z.object({ id: z.string().min(1).required() })
  return (z.resolve(input, schema, {})[0] as ReturnType<typeof schema>).id
}
function freshState(): StudioState {
  return { version: 5, revision: 0, workspaces: [], activeWorkspaceId: null,
    employees: [], projects: [], tasks: [], messages: [], artifacts: [], meetings: [], templates: defaultTemplates() }
}
function within(root: string, path: string): boolean {
  const rel = relative(root, path)
  return rel !== '..' && !rel.startsWith(`..${process.platform === 'win32' ? '\\' : '/'}`) && !isAbsolute(rel)
}

/** Owner of the persisted company and all live employee operations. */
export class Studio {
  private state = freshState()
  private serial: Promise<unknown> = Promise.resolve()
  private readonly active = new Map<StudioTaskId, {
    controller: AbortController
    done: Promise<void>
    cwd: string
    employeeId: StudioEmployeeId
  }>()
  private readonly meetingRuns = new Map<StudioMeetingId, { controller: AbortController; done: Promise<void> }>()
  /** Latest progress line of each running task; transient, so it never advances the revision. */
  private readonly live = new Map<StudioTaskId, { text: string; at: string }>()
  /** Engines whose installed runtime refused to continue a session; their tasks start fresh until the host restarts. */
  private readonly freshOnly = new Set<Employee['engine']>()
  private closing = false
  private constructor(private readonly config: StudioConfig, private readonly executor: StudioExecutor) {}

  /** Open one local Studio and mark interrupted work without silently restarting it.
   * @param config - Persistence and scheduling configuration.
   * @param executor - Native execution provider.
   * @returns Ready Studio.
   */
  static async open(config: StudioConfig, executor: StudioExecutor): Promise<Studio> {
    const studio = new Studio(config, executor)
    await mkdir(config.storageRoot, { recursive: true, mode: 0o700 })
    const read = async (name: string): Promise<unknown> => {
      try { return JSON.parse(await readFile(join(config.storageRoot, name), 'utf8')) }
      catch (error) {
        if (error instanceof Error && 'code' in error && error.code === 'ENOENT') return undefined
        throw error
      }
    }
    // Predecessor journals are read once into the current file and left byte-for-byte unchanged.
    const journals: [string, (input: unknown) => StudioState][] = [['studio.v5.json', parseState], ['studio.v4.json', migrateStateV4], ['studio.v3.json', migrateStateV3],
      ['studio.v2.json', migrateStateV2], ['studio.v1.json', migrateStateV1]]
    for (const [name, load] of journals) {
      const content = await read(name)
      if (content === undefined) continue
      studio.state = load(content)
      break
    }
    for (const task of studio.state.tasks) {
      if (task.status === 'running') {
        task.status = 'interrupted'
        task.error = 'Host stopped before the employee completed. Retry explicitly; existing file changes remain.'
        task.finishedAt = new Date().toISOString()
      }
    }
    for (const project of studio.state.projects) if (project.status === 'running') project.status = 'paused'
    for (const meeting of studio.state.meetings) {
      if (meeting.speaking !== null || meeting.status === 'drafting') {
        meeting.error = 'Host stopped during a meeting turn. Send a message or draft the minutes again.'
        meeting.speaking = null
        if (meeting.status === 'drafting') meeting.status = 'open'
      }
      meeting.queue = []
    }
    await studio.persist()
    return studio
  }

  /** Read a detached company snapshot.
   * @returns Public records only.
   */
  snapshot(): StudioState { return structuredClone(this.state) }

  /** Read the latest progress line of each running task.
   * @returns Task id to the employee's most recent interim message.
   */
  progress(): Record<string, { text: string; at: string }> { return Object.fromEntries(this.live) }

  private enqueue<T>(action: () => Promise<T>): Promise<T> {
    const next = this.serial.then(action)
    // The caller receives the rejection; later commands still need the queue.
    this.serial = next.catch(() => {})
    return next
  }
  private async persist(): Promise<void> {
    const path = join(this.config.storageRoot, 'studio.v5.json')
    await writeFileAtomic(path, `${JSON.stringify(this.state, null, 2)}\n`, { mode: 0o600, dirMode: 0o700 })
  }
  private async commit(): Promise<void> {
    this.state.revision += 1
    await this.persist()
  }
  private employee(id: string): Employee {
    const employee = this.state.employees.find(value => value.id === id)
    if (!employee) throw new Error('Employee does not exist')
    return employee
  }
  private project(id: string): Project {
    const project = this.state.projects.find(value => value.id === id)
    if (!project) throw new Error('Project does not exist')
    return project
  }
  private template(id: string): TeamTemplate {
    const template = this.state.templates.find(value => value.id === id)
    if (!template) throw new Error('Team template does not exist')
    return template
  }
  private meeting(id: string): Meeting {
    const meeting = this.state.meetings.find(value => value.id === id)
    if (!meeting) throw new Error('Meeting does not exist')
    return meeting
  }
  private task(id: string): Task {
    const task = this.state.tasks.find(value => value.id === id)
    if (!task) throw new Error('Task does not exist')
    return task
  }
  private appendTask(project: Project, employee: Employee, title: string, instruction: string,
    dependsOn: StudioTaskId[], outputFiles: string[]): Task {
    if (this.state.tasks.filter(task => task.projectId === project.id).length >= this.config.maxTasksPerProject) throw new Error('Project task limit reached')
    const task: Task = { id: randomUUID() as StudioTaskId, projectId: project.id, employeeId: employee.id, title, instruction,
      dependsOn, outputFiles: outputFiles.map(outputName), status: 'pending', attempt: 0,
      result: '', error: '', assignment: '', startedAt: '', finishedAt: '', nativeSessions: [], reviewStatus: 'pending',
      question: '', reply: '' }
    this.state.tasks.push(task)
    return task
  }

  /** Apply one revision-checked UI command and persist before scheduling.
   * @param raw - Parsed request JSON validated here.
   * @returns Committed public snapshot.
   */
  command(raw: unknown): Promise<StudioState> {
    return this.enqueue(async () => {
      if (this.closing) throw new Error('Studio is stopping')
      const command = parseFields(commandSchema, raw) as { action: string; expectedRevision: number; input: unknown }
      if (command.expectedRevision !== this.state.revision && !liveCheckedActions.has(command.action)) throw new Error('Studio changed; refresh and retry your edit')
      const before = this.snapshot()
      try {
        switch (command.action) {
          case 'createWorkspace': {
            const input = parseFields(z.object({ name: z.string().min(1).max(500).required(), path: z.string().required() }), command.input)
            if (!isAbsolute(input.path) || !(await stat(input.path)).isDirectory()) throw new Error('Company workspace must be an existing absolute directory')
            const path = await realpath(input.path)
            const existing = this.state.workspaces.find(value => value.path === path)
            if (existing) this.state.activeWorkspaceId = existing.id
            else {
              const workspace = { id: randomUUID() as StudioWorkspaceId, name: input.name, path, createdAt: new Date().toISOString() }
              this.state.workspaces.push(workspace)
              this.state.activeWorkspaceId = workspace.id
            }
            break
          }
          case 'selectWorkspace': {
            const id = identity(command.input)
            const workspace = this.state.workspaces.find(value => value.id === id)
            if (!workspace) throw new Error('Company workspace does not exist')
            this.state.activeWorkspaceId = workspace.id
            break
          }
          case 'applyTemplate': {
            const template = this.template(identity(command.input))
            const plan = planTemplate(this.state, template)
            const affected = new Set([...plan.remove, ...plan.disable].map(employee => employee.id))
            if ([...this.active.values()].some(run => affected.has(run.employeeId)) || this.state.meetings.some(meeting => meeting.speaking !== null && affected.has(meeting.speaking))) {
              throw new Error('Stop running tasks and meeting turns of employees leaving the team first')
            }
            const removed = new Set(plan.remove.map(employee => employee.id))
            this.state.employees = this.state.employees.filter(employee => !removed.has(employee.id))
            for (const employee of this.state.employees) {
              if (plan.disable.some(value => value.id === employee.id)) employee.enabled = false
              if (plan.keep.some(value => value.id === employee.id)) employee.enabled = true
            }
            for (const meeting of this.state.meetings) meeting.queue = meeting.queue.filter(id => !affected.has(id))
            this.state.employees.push(...plan.add.map(member => ({ ...member, id: randomUUID() as StudioEmployeeId, cwd: '', enabled: true })))
            break
          }
          case 'saveTemplate': {
            const input = parseFields(templateSchema, command.input)
            if (!input.name.trim() || !input.members.length) throw new Error('A team template needs a name and at least one member')
            if (input.members.length > 50) throw new Error('A team template can have at most 50 members')
            for (const member of input.members) validateMember(member)
            const existing = this.state.templates.find(value => value.id === input.id)
            if (existing) Object.assign(existing, { name: input.name, description: input.description, members: input.members })
            else this.state.templates.push({ ...input, id: input.id as StudioTemplateId, createdAt: new Date().toISOString() })
            break
          }
          case 'deleteTemplate': {
            const id = identity(command.input)
            this.template(id)
            this.state.templates = this.state.templates.filter(value => value.id !== id)
            break
          }
          case 'deleteEmployees': {
            const ids = [...new Set(parseFields(z.object({ ids: z.array(z.string()).required() }), command.input).ids)]
            for (const id of ids) {
              this.employee(id)
              if (hasHistory(this.state, id)) throw new Error('Employees with task or meeting history can be disabled but cannot be deleted')
            }
            this.state.employees = this.state.employees.filter(employee => !ids.includes(employee.id))
            break
          }
          case 'saveEmployee': {
            const parsed = parseFields(employeeSchema, command.input) as Employee
            validateEmployee(parsed)
            if (parsed.cwd) {
              if (!(await stat(parsed.cwd)).isDirectory()) throw new Error('Employee working directory must exist')
              parsed.cwd = await realpath(parsed.cwd)
            }
            if ([...this.active.values()].some(run => run.employeeId === parsed.id)) throw new Error('Stop the employee task before changing its settings')
            if (this.state.meetings.some(meeting => meeting.speaking === parsed.id)) throw new Error('Wait until the employee finishes speaking before changing its settings')
            const index = this.state.employees.findIndex(employee => employee.id === parsed.id)
            if (index < 0) this.state.employees.push(parsed)
            else this.state.employees[index] = parsed
            break
          }
          case 'deleteEmployee': {
            const id = identity(command.input)
            this.employee(id)
            if (this.state.tasks.some(task => task.employeeId === id)) throw new Error('An employee with task history can be disabled but cannot be deleted')
            if (this.state.meetings.some(meeting => meeting.attendeeIds.includes(id as StudioEmployeeId) || meeting.messages.some(message => message.from === id)
              || meeting.minutes?.tasks.some(task => task.employeeId === id))) throw new Error('An employee with meeting history can be disabled but cannot be deleted')
            this.state.employees = this.state.employees.filter(employee => employee.id !== id)
            break
          }
          case 'createProject': {
            const input = parseFields(projectInput, command.input)
            const employees = [...new Set(input.employeeIds)].map(id => this.employee(id))
            await this.newProject(input, employees.map(employee => ({ employee, title: `${employee.role} · ${input.name}`,
              instruction: `完成你的岗位负责的工作，使用已交接的文档和结果。目标：${input.objective}` })))
            break
          }
          case 'createMeeting': {
            const input = parseFields(z.object({ ...meetingFields, workspaceId: z.string().required() }), command.input)
            const workspace = this.state.workspaces.find(value => value.id === input.workspaceId)
            if (!workspace) throw new Error('Select a company workspace first')
            this.state.meetings.push({ id: randomUUID() as StudioMeetingId, workspaceId: workspace.id, title: input.title, agenda: input.agenda,
              hostId: input.hostId as StudioEmployeeId, attendeeIds: this.attendees(input.hostId, input.attendeeIds), status: 'open',
              queue: [], speaking: null, error: '', messages: [], minutes: null, projectId: null, createdAt: new Date().toISOString() })
            break
          }
          case 'updateMeeting': {
            const input = parseFields(z.object({ ...meetingFields, id: z.string().required() }), command.input)
            const meeting = this.meeting(input.id)
            if (meeting.status === 'closed') throw new Error('The meeting has ended')
            const attendees = this.attendees(input.hostId, input.attendeeIds)
            if (meeting.speaking && !attendees.includes(meeting.speaking)) throw new Error('Wait until the current speaker finishes')
            Object.assign(meeting, { title: input.title, agenda: input.agenda, hostId: input.hostId, attendeeIds: attendees,
              queue: meeting.queue.filter(id => attendees.includes(id)) })
            break
          }
          case 'meetingMessage': {
            const input = parseFields(meetingMessageInput, command.input)
            const meeting = this.meeting(input.id)
            if (meeting.status !== 'open') throw new Error('The meeting is not open for discussion')
            const mentions = [...new Set(input.mentions)] as StudioEmployeeId[]
            if (mentions.some(id => !meeting.attendeeIds.includes(id))) throw new Error('Mention only meeting attendees')
            meeting.messages.push({ id: randomUUID() as StudioMessageId, from: 'user', message: input.message, mentions,
              createdAt: new Date().toISOString(), nativeSession: null })
            // Without mentions the host answers, even if the host is mid-turn: that turn did not see this message.
            meeting.queue = [...new Set([...meeting.queue, ...mentions.length ? mentions : [meeting.hostId]])]
            meeting.error = ''
            break
          }
          case 'stopMeeting': {
            const meeting = this.meeting(identity(command.input))
            meeting.queue = []
            this.meetingRuns.get(meeting.id)?.controller.abort(new Error('Stopped by user'))
            break
          }
          case 'draftMinutes': {
            const meeting = this.meeting(identity(command.input))
            // An ended meeting can still produce minutes until it has created a project.
            if (meeting.projectId !== null) throw new Error('This meeting already created a project')
            if (meeting.status === 'drafting') throw new Error('The minutes are already being drafted')
            if (this.meetingRuns.has(meeting.id)) throw new Error('Wait for the current speaker or stop the turn first')
            if (!meeting.messages.length) throw new Error('Discuss something before drafting minutes')
            meeting.status = 'drafting'; meeting.queue = []; meeting.error = ''
            break
          }
          case 'saveMinutes': {
            const input = parseFields(z.object({ id: z.string().required(), minutes: minutesSchema.required() }), command.input)
            const meeting = this.meeting(input.id)
            if (meeting.status !== 'review') throw new Error('Minutes can be edited only while awaiting confirmation')
            for (const task of input.minutes.tasks) this.employee(task.employeeId)
            meeting.minutes = input.minutes as MeetingMinutes
            meeting.error = ''
            break
          }
          case 'resumeMeeting': {
            const meeting = this.meeting(identity(command.input))
            if (meeting.status !== 'review' && !(meeting.status === 'closed' && meeting.projectId === null)) {
              throw new Error('Only meetings awaiting minutes confirmation or ended without a project can resume')
            }
            meeting.status = 'open'; meeting.error = ''
            break
          }
          case 'reviewMinutes': {
            // Reopen existing minutes of an ended meeting for editing without drafting them again.
            const meeting = this.meeting(identity(command.input))
            if (meeting.status !== 'closed' || meeting.projectId !== null || !meeting.minutes) throw new Error('Only ended meetings with minutes and no project can reopen their minutes')
            meeting.status = 'review'
            break
          }
          case 'meetingProject': {
            // projectId names an existing project of this company to extend; empty creates a new project.
            // replacePending stops that project's never-started tasks so the minutes' concrete tasks take their place.
            const input = parseFields(z.object({ id: z.string().required(), minutes: minutesSchema.required(), cwd: z.string().required(),
              sessionMode: z.union(['employee-project', 'new-task'] as const).required(), projectId: z.string().required(),
              replacePending: z.boolean().required() }), command.input)
            const meeting = this.meeting(input.id)
            if (meeting.status !== 'review') throw new Error('Confirm the meeting minutes first')
            const minutes = input.minutes as MeetingMinutes
            if (!minutes.tasks.length || minutes.tasks.some(task => !task.title.trim() || !task.instruction.trim())) throw new Error('Minutes need at least one complete task')
            const assignments = minutes.tasks.map(task => ({ employee: this.employee(task.employeeId), title: task.title, instruction: task.instruction }))
            let project: Project
            if (input.projectId) {
              project = this.project(input.projectId)
              if (project.workspaceId !== meeting.workspaceId) throw new Error('Add the minutes to a project of this company workspace')
              if (assignments.some(value => !value.employee.enabled)) throw new Error('Select at least one enabled employee')
              if (input.replacePending) {
                const replaced = new Set(this.state.tasks.filter(task => task.projectId === project.id && task.status === 'pending' && task.attempt === 0).map(task => task.id))
                const finishedAt = new Date().toISOString()
                for (const task of this.state.tasks) {
                  if (replaced.has(task.id)) Object.assign(task, { status: 'cancelled', finishedAt, error: `由会议「${meeting.title}」的纪要任务替换` })
                  else if (task.status === 'pending') task.dependsOn = task.dependsOn.filter(id => !replaced.has(id))
                }
              }
              this.chainTasks(project, assignments)
              // Accepted or reviewed work is reopened for the new tasks; the user starts it explicitly.
              if (project.status === 'completed' || project.status === 'review') project.status = 'paused'
            } else {
              if (!minutes.projectName.trim() || !minutes.objective.trim()) throw new Error('Minutes need a project name and objective')
              project = await this.newProject({ name: minutes.projectName, objective: minutes.objective, cwd: input.cwd,
                workspaceId: meeting.workspaceId, acceptanceCriteria: minutes.acceptanceCriteria, sessionMode: input.sessionMode }, assignments)
            }
            // The minutes reach every project employee through the existing team-message channel; an extended project
            // keeps its own objective, so this round's goal and acceptance criteria travel with the minutes.
            this.state.messages.push({ id: randomUUID() as StudioMessageId, projectId: project.id, taskId: null, from: 'user', to: 'team',
              message: [`会议纪要：${meeting.title}`, minutes.summary, ...minutes.decisions.map(value => `- ${value}`),
                ...input.projectId && minutes.objective.trim() ? [`本轮目标：${minutes.objective}`] : [],
                ...input.projectId && minutes.acceptanceCriteria.trim() ? [`本轮验收标准：${minutes.acceptanceCriteria}`] : []].filter(Boolean).join('\n'),
              createdAt: new Date().toISOString() })
            Object.assign(meeting, { minutes, status: 'closed', projectId: project.id, queue: [], error: '' })
            break
          }
          case 'closeMeeting': {
            const meeting = this.meeting(identity(command.input))
            meeting.status = 'closed'; meeting.queue = []
            this.meetingRuns.get(meeting.id)?.controller.abort(new Error('Meeting ended'))
            break
          }
          case 'createTask': {
            const input = parseFields(taskInput, command.input)
            const project = this.project(input.projectId)
            const dependencies = [...new Set(input.dependsOn)].map(id => this.task(id))
            if (dependencies.some(task => task.projectId !== project.id)) throw new Error('Task dependencies must belong to this project')
            const employee = this.employee(input.employeeId)
            if (!employee.enabled) throw new Error('Employee is disabled')
            this.appendTask(project, employee, input.title, input.instruction, dependencies.map(task => task.id), input.outputFiles)
            if (project.status === 'completed') project.status = 'paused'
            break
          }
          case 'editTask': {
            const input = parseFields(z.object({ id: z.string().required(), task: taskInput.required() }), command.input)
            const task = this.task(input.id)
            if (task.status !== 'pending') throw new Error('Only pending tasks can be edited')
            if (input.task.projectId !== task.projectId) throw new Error('Tasks cannot move between projects')
            this.employee(input.task.employeeId)
            const dependencies = [...new Set(input.task.dependsOn)].map(id => this.task(id))
            const reaches = (id: StudioTaskId, visited = new Set<StudioTaskId>()): boolean => {
              if (id === task.id) return true
              if (visited.has(id)) return false
              visited.add(id)
              return this.task(id).dependsOn.some(next => reaches(next, visited))
            }
            if (dependencies.some(dependency => dependency.projectId !== task.projectId || reaches(dependency.id))) throw new Error('Task dependencies must be in this project and cannot form a cycle')
            // Another employee starts fresh instead of continuing a previous employee's failed session.
            if (input.task.employeeId !== task.employeeId) task.error = ''
            Object.assign(task, { employeeId: input.task.employeeId, title: input.task.title, instruction: input.task.instruction,
              dependsOn: dependencies.map(dependency => dependency.id), outputFiles: input.task.outputFiles.map(outputName) })
            break
          }
          case 'startProject': {
            const project = this.project(identity(command.input))
            if (!this.state.tasks.some(task => task.projectId === project.id && task.status === 'pending')) throw new Error('Project has no pending tasks')
            project.status = 'running'
            break
          }
          case 'acceptProject': {
            const project = this.project(identity(command.input))
            const tasks = this.state.tasks.filter(task => task.projectId === project.id)
            if (!tasks.length || tasks.some(task => task.status !== 'completed')) throw new Error('Every task must complete before project acceptance')
            for (const task of tasks) if (task.reviewStatus === 'pending') task.reviewStatus = 'accepted'
            project.status = 'completed'
            break
          }
          case 'requestChanges': {
            const input = parseFields(z.object({ id: z.string().required(),
              instruction: z.string().min(1).max(100_000).required() }), command.input)
            const original = this.task(input.id)
            const project = this.project(original.projectId)
            if (original.status !== 'completed' || original.reviewStatus === 'superseded') {
              throw new Error('Select a completed task awaiting review')
            }
            if ([...this.active.keys()].some(id => this.task(id).projectId === project.id)) throw new Error('Stop the project before requesting changes')
            const repair = this.appendTask(project, this.employee(original.employeeId), original.title,
              input.instruction, [original.id], [...original.outputFiles])
            for (const task of this.state.tasks) {
              if (task.status === 'pending' && task.id !== repair.id) task.dependsOn = task.dependsOn.map(id => id === original.id ? repair.id : id)
            }
            original.reviewStatus = 'superseded'
            project.status = 'paused'
            this.state.messages.push({ id: randomUUID() as StudioMessageId, projectId: project.id, taskId: repair.id,
              from: 'user', to: original.employeeId, message: input.instruction, createdAt: new Date().toISOString() })
            break
          }
          case 'exportProject': {
            const project = this.project(identity(command.input))
            await exportProject(this.state, project, this.config.storageRoot)
            break
          }
          case 'pauseProject': this.project(identity(command.input)).status = 'paused'; break
          case 'stopProject': {
            const project = this.project(identity(command.input))
            project.status = 'paused'
            for (const task of this.state.tasks) if (task.projectId === project.id) this.active.get(task.id)?.controller.abort(new Error('Stopped by user'))
            break
          }
          case 'retryTask': {
            const task = this.task(identity(command.input))
            if (!['failed', 'cancelled', 'interrupted'].includes(task.status)) throw new Error('Only failed, cancelled, or interrupted tasks can be retried')
            // The failure reason stays until the next attempt starts: that attempt continues the failed session with it.
            task.status = 'pending'; task.result = ''
            if (this.project(task.projectId).status === 'completed') this.project(task.projectId).status = 'paused'
            break
          }
          case 'cancelTask': {
            const task = this.task(identity(command.input))
            if (task.status === 'running') this.active.get(task.id)?.controller.abort(new Error('Stopped by user'))
            else if (task.status === 'pending' || task.status === 'waiting') {
              task.status = 'cancelled'; task.reply = ''; task.finishedAt = new Date().toISOString()
            } else throw new Error('Task is not pending, running, or waiting')
            break
          }
          case 'answerTask': {
            const input = parseFields(answerInput, command.input)
            const task = this.task(input.id)
            if (task.status !== 'waiting') throw new Error('The employee is not waiting for you on this task')
            task.status = 'pending'; task.reply = input.reply; task.error = ''
            this.state.messages.push({ id: randomUUID() as StudioMessageId, projectId: task.projectId, taskId: task.id,
              from: 'user', to: task.employeeId, message: input.reply, createdAt: new Date().toISOString() })
            break
          }
          case 'message': {
            const input = parseFields(messageInput, command.input)
            const project = this.project(input.projectId)
            if (input.to !== 'team') this.employee(input.to)
            this.state.messages.push({ id: randomUUID() as StudioMessageId, projectId: project.id, taskId: null,
              from: 'user', to: input.to as StudioEmployeeId | 'team', message: input.message, createdAt: new Date().toISOString() })
            break
          }
          default: throw new Error(`Unknown Studio action: ${command.action}`)
        }
        await this.commit()
      } catch (error) { this.state = before; throw error }
      this.schedule()
      this.scheduleMeetings()
      return this.snapshot()
    })
  }

  private attendees(hostId: string, ids: string[]): StudioEmployeeId[] {
    const attendees = [...new Set([hostId, ...ids])].map(id => this.employee(id))
    if (attendees.some(employee => !employee.enabled)) throw new Error('Invite only enabled employees')
    return attendees.map(employee => employee.id)
  }

  /** Validate directory and team, then append a paused project whose tasks form a sequential chain. */
  private async newProject(input: { name: string; objective: string; cwd: string; workspaceId: string; acceptanceCriteria: string; sessionMode: Project['sessionMode'] },
    assignments: { employee: Employee; title: string; instruction: string }[]): Promise<Project> {
    const workspace = this.state.workspaces.find(value => value.id === input.workspaceId)
    if (!workspace) throw new Error('Select a company workspace first')
    const directory = input.cwd || workspace.path
    if (!isAbsolute(directory) || !(await stat(directory)).isDirectory()) throw new Error('Project working directory must be an existing absolute directory')
    const cwd = await realpath(directory)
    if (!withinDirectory(workspace.path, cwd)) throw new Error('Project directory must stay inside the company workspace')
    if (!assignments.length || assignments.some(value => !value.employee.enabled)) throw new Error('Select at least one enabled employee')
    if (assignments.length > this.config.maxTasksPerProject) throw new Error('Team exceeds the project task limit')
    const project: Project = { id: randomUUID() as StudioProjectId, name: input.name, objective: input.objective,
      cwd, workspaceId: workspace.id, acceptanceCriteria: input.acceptanceCriteria, sessionMode: input.sessionMode,
      status: 'paused', createdAt: new Date().toISOString() }
    this.state.projects.push(project)
    this.chainTasks(project, assignments)
    return project
  }

  /** Append assignments to a project as a sequential chain; writers get a report file to deliver. */
  private chainTasks(project: Project, assignments: { employee: Employee; title: string; instruction: string }[]): void {
    if (this.state.tasks.filter(task => task.projectId === project.id).length + assignments.length > this.config.maxTasksPerProject) throw new Error('Project task limit reached')
    let previous: Task | undefined
    for (const { employee, title, instruction } of assignments) {
      const task = this.appendTask(project, employee, title, instruction, previous ? [previous.id] : [], [])
      if (employee.permission !== 'read-only') task.outputFiles = [`.studio-deliverables/${task.id}.md`]
      previous = task
    }
  }

  private meetingPrompt(meeting: Meeting, employee: Employee, drafting: boolean): string {
    const name = (id: string): string => id === 'user' ? '甲方（用户）' : this.state.employees.find(value => value.id === id)?.name ?? id
    const header = [
      `你是软件公司的员工 ${employee.name}，岗位：${employee.role}。职责：${employee.responsibilities}`,
      `你正在参加会议「${meeting.title}」。${meeting.hostId === employee.id ? '你是本次会议主持人：引导讨论，澄清甲方需求，必要时点名合适的同事发言。' : `主持人是 ${name(meeting.hostId)}。`}`,
      `会议议题：${meeting.agenda || '（未填写，按讨论内容推进）'}`,
      '甲方（用户）是提出需求的客户。会议只讨论，不写代码，不修改任何文件。',
      `参会者：${JSON.stringify(meeting.attendeeIds.map(id => ({ employeeId: id, name: name(id), role: this.employee(id).role, host: id === meeting.hostId })))}`,
      this.companyBrief(meeting.workspaceId, Math.floor(this.config.maxTextBytes / 4)),
    ].filter(Boolean).join('\n\n')
    const instruction = drafting ? [
      '讨论已结束。请作为主持人整理会议纪要，供甲方确认后直接建立项目。',
      '仅返回 JSON：{"message":"<纪要 JSON 字符串>","files":[],"handoffs":[]}。message 必须是一个 JSON 字符串，结构为：',
      '{"summary":"会议结论概述","decisions":["已确定的需求或决定"],"projectName":"项目名称","objective":"项目目标","acceptanceCriteria":"逐条验收标准","tasks":[{"employeeId":"参会者真实 employeeId","title":"任务标题","instruction":"具体任务安排"}]}',
      'tasks 按交付顺序排列，每项交给最合适的参会者。不得包含推理过程。',
    ].join('\n') : [
      '现在轮到你发言。请以你的岗位视角，像会议中那样简洁地口头发言：回应最新的问题，提出需要甲方澄清的问题、风险、估算或建议。',
      '仅返回 JSON：{"message":"你的发言","files":[],"handoffs":[{"employeeId":"需要接着发言的参会同事 employeeId","message":"想请他回答的问题"}]}。不需要别人接话时 handoffs 为 []。不得包含推理过程、思考日志或工具调用轨迹。',
    ].join('\n')
    // Keep the newest discussion when the transcript exceeds the assignment budget.
    const budget = this.config.maxTextBytes - Buffer.byteLength(header) - Buffer.byteLength(instruction) - 1024
    const transcript: { speaker: string; message: string }[] = []
    let used = 0
    for (const message of [...meeting.messages].reverse()) {
      const entry = { speaker: name(message.from), message: message.message }
      const bytes = Buffer.byteLength(JSON.stringify(entry))
      if (used + bytes > budget) break
      transcript.unshift(entry)
      used += bytes
    }
    if (!transcript.length && meeting.messages.length) throw new Error('The latest meeting message exceeds the configured text limit')
    const omitted = meeting.messages.length - transcript.length
    return [header, `会议记录（按时间顺序${omitted ? `，省略最早的 ${omitted} 条` : ''}）：${JSON.stringify(transcript)}`, instruction].join('\n\n')
  }

  private scheduleMeetings(): void {
    if (this.closing) return
    for (const meeting of this.state.meetings) {
      if (this.meetingRuns.has(meeting.id)) continue
      if (meeting.status !== 'drafting' && !(meeting.status === 'open' && meeting.queue.length)) continue
      const controller = new AbortController()
      const run = { controller, done: Promise.resolve() }
      this.meetingRuns.set(meeting.id, run)
      run.done = this.meetingTurn(meeting.id, controller).finally(() => {
        this.meetingRuns.delete(meeting.id)
        this.scheduleMeetings()
      })
      // meetingTurn contains and persists speaker failures; a persistence failure stays host-local.
      void run.done.catch((error: unknown) => {
        console.error('Studio could not persist a meeting turn:', error instanceof Error ? error.message : 'unknown error')
      })
    }
  }

  /** Run one speaker, or the host's minutes, through the employee's own engine: read-only, in the company directory. */
  private async meetingTurn(id: StudioMeetingId, controller: AbortController): Promise<void> {
    let timedOut = false
    const timeout = setTimeout(() => { timedOut = true; controller.abort(new Error('Meeting turn timeout reached')) }, this.config.taskTimeoutMs)
    try {
      const prepared = await this.enqueue(async () => {
        const meeting = this.meeting(id)
        const drafting = meeting.status === 'drafting'
        const speaker = drafting ? meeting.hostId : meeting.queue[0]
        if (!speaker || controller.signal.aborted || this.closing) return null
        const employee = this.employee(speaker)
        const workspace = this.state.workspaces.find(value => value.id === meeting.workspaceId)
        if (!workspace) throw new Error('Company workspace does not exist')
        const cwd = await realpath(workspace.path)
        const prompt = this.meetingPrompt(meeting, employee, drafting)
        if (!drafting) meeting.queue.shift()
        meeting.speaking = speaker; meeting.error = ''
        await this.commit()
        return { meeting: structuredClone(meeting), employee: structuredClone(employee), cwd, drafting, prompt }
      })
      if (!prepared) return
      const { meeting, employee, cwd, drafting, prompt } = prepared
      let session: StudioNativeSession | null = null
      try {
        const project: Project = { id: meeting.id as string as StudioProjectId, workspaceId: meeting.workspaceId, name: `会议 · ${meeting.title}`,
          objective: meeting.agenda, cwd, status: 'running', acceptanceCriteria: '', sessionMode: 'new-task', createdAt: meeting.createdAt }
        const task: Task = { id: randomUUID() as StudioTaskId, projectId: project.id, employeeId: employee.id, title: meeting.title,
          instruction: prompt, dependsOn: [], outputFiles: [], status: 'running', attempt: 1, result: '', error: '',
          startedAt: new Date().toISOString(), finishedAt: '', assignment: prompt, nativeSessions: [], reviewStatus: 'pending', question: '', reply: '' }
        // Meetings are discussion only: force read-only and the company directory whatever the employee's task settings are.
        const result = await this.executor.run({ ...employee, permission: 'read-only', cwd: '' }, project, task, controller.signal, {
          resumeSessionId: null,
          recordSession: (sessionId: StudioNativeSessionId) => {
            if (!/^[A-Za-z0-9][A-Za-z0-9_-]{0,99}$/.test(sessionId)) return Promise.reject(new Error('Native session identity is invalid'))
            session = { id: sessionId, engine: employee.engine, cwd, attempt: 1, continued: false }
            return Promise.resolve()
          },
        })
        controller.signal.throwIfAborted()
        await this.enqueue(async () => {
          const live = this.meeting(id)
          const createdAt = new Date().toISOString()
          live.speaking = null
          if (drafting) {
            const { minutes, parsed } = parseMinutes(result.message, live)
            live.minutes = minutes
            live.status = 'review'
            live.error = parsed ? '' : 'The host did not return structured minutes. The original text is kept; add the project details and tasks before creating the project.'
            live.messages.push({ id: randomUUID() as StudioMessageId, from: employee.id, message: minutes.summary, mentions: [], createdAt, nativeSession: session })
          } else {
            const sinceUser = live.messages.length - 1 - live.messages.findLastIndex(message => message.from === 'user')
            const mentions = [...new Set(result.handoffs.map(handoff => handoff.employeeId))]
              .filter(value => value !== employee.id && live.attendeeIds.includes(value))
            live.messages.push({ id: randomUUID() as StudioMessageId, from: employee.id, message: result.message, mentions, createdAt, nativeSession: session })
            if (live.status === 'open' && sinceUser + 1 < meetingChainLimit) live.queue = [...new Set([...live.queue, ...mentions])]
          }
          await this.commit()
        })
      } catch (error) {
        await this.enqueue(async () => {
          const live = this.state.meetings.find(value => value.id === id)
          if (!live) return
          live.speaking = null
          live.queue = []
          if (live.status === 'drafting') live.status = 'open'
          live.error = timedOut ? 'Meeting turn timeout reached' : controller.signal.aborted ? `${employee.name} was stopped`
            : `${employee.name}: ${error instanceof Error ? error.message : 'meeting turn failed'}`
          await this.commit()
        })
      }
    } finally { clearTimeout(timeout) }
  }

  /** Company work so meetings and tasks start from what exists instead of asking the user where it is.
   * The focused project comes first, then the newest others; lines are cut short and the brief stops at the byte budget.
   * @param workspaceId - Company whose projects are summarized.
   * @param budget - Maximum UTF-8 bytes of the returned section.
   * @param focus - Project of the current task, and its tasks already described in full by the caller.
   * @returns The brief, or an empty string when there is nothing to report or no room.
   */
  private companyBrief(workspaceId: StudioWorkspaceId, budget: number, focus?: { projectId: StudioProjectId; skip: ReadonlySet<string> }): string {
    const clip = (text: string, max: number): string => {
      const value = text.replace(/\s+/g, ' ').trim()
      return value.length > max ? `${value.slice(0, max)}…` : value
    }
    const projectStatus: Record<Project['status'], string> = { paused: '已暂停', running: '进行中', review: '待验收', completed: '已验收' }
    const taskStatus: Record<Task['status'], string> = { pending: '未开始', running: '进行中', waiting: '等甲方处理', completed: '已完成',
      failed: '失败', cancelled: '已停止', interrupted: '中断' }
    const role = (task: Task): string => this.state.employees.find(value => value.id === task.employeeId)?.role ?? ''
    const head = '公司已有项目（需要细节时到对应目录查阅文件，不必再问甲方在哪里）：'
    const lines: string[] = []
    let used = Buffer.byteLength(head)
    const add = (line: string): boolean => {
      const bytes = Buffer.byteLength(line) + 1
      if (used + bytes > budget) return false
      lines.push(line); used += bytes
      return true
    }
    const others = this.state.projects.filter(value => value.workspaceId === workspaceId && value.id !== focus?.projectId).reverse()
    const ordered = [...this.state.projects.filter(value => value.id === focus?.projectId), ...others]
    let omitted = false
    for (const project of ordered) {
      const current = project.id === focus?.projectId
      const tasks = this.state.tasks.filter(task => task.projectId === project.id && !focus?.skip.has(task.id))
      const done = tasks.filter(task => task.status === 'completed' && task.reviewStatus !== 'superseded')
      const open = tasks.filter(task => task.status !== 'completed' && task.status !== 'cancelled')
      if (current && !done.length && !open.length) continue
      const label = current ? `- 本项目「${project.name}」的其他任务：` : `- 项目「${project.name}」（${projectStatus[project.status]}；目录 ${project.cwd}）目标：${clip(project.objective, 200)}`
      if (!add(label)) { omitted = true; break }
      for (const task of [...done].reverse()) {
        const files = task.outputFiles.length ? `；交付文件：${task.outputFiles.join('、')}` : ''
        if (!add(`  - 已完成：${task.title}（${role(task)}）：${clip(task.result, 160)}${files}`)) { omitted = true; break }
      }
      if (omitted) break
      if (open.length && !add(`  - 未完成：${clip(open.map(task => `${task.title}（${role(task)}·${taskStatus[task.status]}）`).join('；'), 400)}`)) { omitted = true; break }
    }
    if (!lines.length) return ''
    const tail = '  （更早的内容已省略）'
    return [head, ...lines, ...omitted && Buffer.byteLength(tail) + used <= budget ? [tail] : []].join('\n')
  }

  private assignment(employee: Employee, project: Project, task: Task): string {
    const dependencies = task.dependsOn.map(id => this.task(id))
    const messages = this.state.messages.filter(message => message.projectId === project.id
      && (message.to === employee.id || message.to === 'team')
      && (message.taskId === null || message.to === employee.id))
    const artifacts = this.state.artifacts.filter(file => dependencies.some(dependency => dependency.id === file.taskId))
    const prompt = [
      `你是软件公司的员工 ${employee.name}，岗位：${employee.role}。职责：${employee.responsibilities}`,
      `项目：${project.name}\n项目目标：${project.objective}\n验收标准：${project.acceptanceCriteria}\n工作目录：${employee.cwd || project.cwd}`,
      `领导安排的任务：${task.title}\n${task.instruction}`,
      ...task.reply ? [`你上次暂停此任务，请甲方处理：${task.question}\n甲方回复：${task.reply}\n请据此继续。`] : [],
      `团队成员：${JSON.stringify(this.state.employees.filter(value => value.enabled).map(value => ({ employeeId: value.id, name: value.name, role: value.role })))}`,
      `已完成的前置任务：${JSON.stringify(dependencies.map(value => ({ title: value.title, message: value.result })))}`,
      `人类对话与交接：${JSON.stringify(messages.map(value => ({ from: value.from, message: value.message })))}`,
      `前置任务的结果文件（可读取）：${JSON.stringify(artifacts.map(file => ({ name: file.name, path: join(this.config.storageRoot, 'artifacts', file.id), sha256: file.sha256 })))}`,
      `请交付这些项目相对路径的文件：${JSON.stringify(task.outputFiles)}。必要时创建父目录。只交付与任务有关的结果，不导出任何工具的私有会话、凭据或思考过程。`,
      '完成后仅返回 JSON：{"message":"给领导或同事的最终工作汇报，说明结果、验证和剩余问题", "files":["已完成的项目相对路径"], "handoffs":[{"employeeId":"接收者的真实员工 id", "message":"给同事的任务安排或结果说明"}], "needsUser":""}。没有交接时 handoffs 为 []。不得包含推理过程、思考日志或工具调用轨迹。',
      needsUserRule,
    ].join('\n\n')
    if (Buffer.byteLength(prompt) > this.config.maxTextBytes) throw new Error('Assignment exceeds the configured text limit; reduce the task or its dependencies')
    const room = Math.min(Math.floor(this.config.maxTextBytes / 4), this.config.maxTextBytes - Buffer.byteLength(prompt) - 2)
    const brief = this.companyBrief(project.workspaceId, room, { projectId: project.id, skip: new Set([task.id, ...task.dependsOn]) })
    return brief ? `${prompt}\n\n${brief}` : prompt
  }

  /** Prompt that continues a waiting native session with the user's reply. */
  private continuation(task: Task): string {
    return [`你之前暂停任务「${task.title}」，请甲方处理：${task.question}`, `甲方回复：${task.reply}`,
      '请在此基础上继续完成原任务。完成后仍按原来的 JSON 格式返回；如果还需要甲方处理，再次填写 needsUser。', needsUserRule].join('\n\n')
  }

  /** Prompt that continues a failed or interrupted native session; the working tree keeps everything already done. */
  private recovery(task: Task): string {
    return [`你上次执行任务「${task.title}」时中断了，原因：${task.error}`,
      '工作目录中已完成的改动都还在。请先检查当前进度，不要重做已经完成的工作，继续完成原任务。完成后按原来的 JSON 格式返回最终结果。', needsUserRule].join('\n\n')
  }

  private schedule(): void {
    if (this.closing) return
    for (const task of this.state.tasks) {
      if (this.active.size >= this.config.maxParallel) break
      const project = this.project(task.projectId)
      if (project.status !== 'running' || task.status !== 'pending' || this.active.has(task.id)) continue
      const employee = this.employee(task.employeeId)
      const cwd = resolve(employee.cwd || project.cwd)
      if (!employee.enabled || [...this.active.values()].some(run => run.cwd === cwd || run.employeeId === employee.id)) continue
      if (!task.dependsOn.every(id => this.task(id).status === 'completed')) continue
      const controller = new AbortController()
      const run = { controller, done: Promise.resolve(), cwd, employeeId: employee.id }
      this.active.set(task.id, run)
      run.done = this.execute(task.id, controller).finally(() => {
        this.active.delete(task.id)
        this.schedule()
      })
      // execute contains and persists employee failures; a persistence failure stays host-local.
      void run.done.catch((error: unknown) => {
        console.error('Studio could not persist task settlement:', error instanceof Error ? error.message : 'unknown error')
      })
    }
  }

  private async execute(id: StudioTaskId, controller: AbortController): Promise<void> {
    let timedOut = false
    let captured: Artifact[] = []
    const timeout = setTimeout(() => { timedOut = true; controller.abort(new Error('Task timeout reached')) }, this.config.taskTimeoutMs)
    try {
      const prepared = await this.enqueue(async () => {
        const task = this.task(id)
        const employee = this.employee(task.employeeId)
        const project = this.project(task.projectId)
        if (controller.signal.aborted || this.closing || task.status !== 'pending' || project.status !== 'running') throw new Error('Task start was cancelled')
        const workspace = this.state.workspaces.find(value => value.id === project.workspaceId)
        if (!workspace) throw new Error('Company workspace does not exist')
        const cwd = await realpath(employee.cwd || project.cwd)
        if (!withinDirectory(await realpath(workspace.path), cwd)) throw new Error('Employee directory must stay inside the company workspace')
        // A reply continues the session that asked for it, and a retry continues the session that failed, so finished work is not redone.
        // Without a continuable session, the full assignment carries the reply as a message.
        const resumed = (task.reply || task.error) && !this.freshOnly.has(employee.engine)
          ? task.nativeSessions.findLast(value => value.engine === employee.engine && value.cwd === (employee.cwd || project.cwd)) : undefined
        // Kept for a fresh restart if the runtime refuses the continuation; an oversized one only matters when no session can continue.
        const full = resumed ? (() => { try { return this.assignment(employee, project, task) } catch { return '' } })() : this.assignment(employee, project, task)
        task.assignment = resumed ? task.reply ? this.continuation(task) : this.recovery(task) : full
        task.status = 'running'; task.attempt += 1; task.startedAt = new Date().toISOString(); task.finishedAt = ''
        task.question = ''; task.reply = ''; task.error = ''
        await this.commit()
        return structuredClone({ task, employee, project, resumed, full })
      })
      const { task, employee, project, resumed, full } = prepared
      const prior = this.freshOnly.has(employee.engine) ? undefined : resumed ?? (project.sessionMode === 'employee-project' ? this.state.tasks
        .filter(value => value.projectId === project.id && value.employeeId === employee.id && value.status === 'completed')
        .flatMap(value => value.nativeSessions)
        .findLast(value => value.engine === employee.engine && value.cwd === (employee.cwd || project.cwd)) : undefined)
      const run = (assignment: string, resume: StudioNativeSession | undefined): Promise<EmployeeResult> =>
        this.executor.run(employee, project, { ...task, assignment }, controller.signal, {
          resumeSessionId: resume?.id ?? null,
          progress: (text: string) => { this.live.set(id, { text, at: new Date().toISOString() }) },
          recordSession: (sessionId: StudioNativeSessionId) => this.enqueue(async () => {
            if (!/^[A-Za-z0-9][A-Za-z0-9_-]{0,99}$/.test(sessionId)) throw new Error('Native session identity is invalid')
            const live = this.task(id)
            if (!live.nativeSessions.some(value => value.id === sessionId && value.attempt === live.attempt)) {
              live.nativeSessions.push({ id: sessionId, engine: employee.engine, cwd: employee.cwd || project.cwd,
                attempt: live.attempt, continued: resume?.id === sessionId })
              await this.commit()
            }
          }),
        })
      const result = await run(task.assignment, prior).catch(async (error: unknown) => {
        if (!(error instanceof ResumeUnsupportedError) || !prior || !full) throw error
        // The refusal happens before any work, so the same attempt starts over in a fresh session with the complete assignment.
        this.freshOnly.add(error.engine)
        await this.enqueue(async () => {
          this.task(id).assignment = full
          await this.commit()
        })
        return run(full, undefined)
      })
      controller.signal.throwIfAborted()
      if (result.needsUser) {
        await this.enqueue(async () => {
          const live = this.task(id)
          // The interim report stays visible beside the question; completion replaces it.
          live.status = 'waiting'; live.question = result.needsUser; live.result = result.message; live.finishedAt = new Date().toISOString()
          await this.commit()
        })
        return
      }
      for (const handoff of result.handoffs) this.employee(handoff.employeeId)
      const artifacts = await this.capture(employee, project, task, result)
      captured = artifacts
      controller.signal.throwIfAborted()
      await this.enqueue(async () => {
        const before = this.snapshot()
        try {
          const live = this.task(id)
          live.status = 'completed'; live.result = result.message; live.finishedAt = new Date().toISOString()
          this.state.artifacts.push(...artifacts)
          const createdAt = new Date().toISOString()
          this.state.messages.push({ id: randomUUID() as StudioMessageId, projectId: project.id, taskId: id,
            from: employee.id, to: 'team', message: result.message, createdAt },
          ...result.handoffs.map(handoff => ({ id: randomUUID() as StudioMessageId, projectId: project.id, taskId: id,
            from: employee.id, to: handoff.employeeId, message: handoff.message, createdAt })))
          if (this.state.tasks.filter(value => value.projectId === project.id).every(value => value.status === 'completed')) this.project(project.id).status = 'review'
          await this.commit()
        } catch (error) { this.state = before; throw error }
      })
    } catch (error) {
      await Promise.all(captured.filter(file => !this.state.artifacts.some(value => value.id === file.id))
        .map(file => unlink(join(this.config.storageRoot, 'artifacts', file.id))))
      await this.enqueue(async () => {
        const task = this.task(id)
        task.status = controller.signal.aborted && !timedOut ? 'cancelled' : 'failed'
        task.error = timedOut ? 'Task timeout reached' : controller.signal.aborted ? 'Stopped by user or host shutdown' : error instanceof Error ? error.message : 'Employee task failed'
        task.finishedAt = new Date().toISOString()
        await this.commit()
      })
    } finally {
      clearTimeout(timeout)
      this.live.delete(id)
    }
  }

  private async capture(employee: Employee, project: Project, task: Task, result: EmployeeResult): Promise<Artifact[]> {
    const root = await realpath(employee.cwd || project.cwd)
    const privateRoot = await realpath(this.config.storageRoot)
    const artifactRoot = join(this.config.storageRoot, 'artifacts')
    await mkdir(artifactRoot, { recursive: true, mode: 0o700 })
    const artifacts: Artifact[] = []
    let remainingBytes = this.config.maxArtifactBytes
    const publish = async (name: string, bytes: Buffer): Promise<void> => {
      if (bytes.length > remainingBytes) throw new Error(`Task result files exceed the configured limit: ${name}`)
      const id = randomUUID() as StudioArtifactId
      await writeFile(join(artifactRoot, id), bytes, { flag: 'wx', mode: 0o600 })
      artifacts.push({ id, taskId: task.id, projectId: project.id, name, size: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') })
      remainingBytes -= bytes.length
    }
    try {
      await publish('handoff.md', Buffer.from(result.message))
      const names = [...new Set([...task.outputFiles, ...result.files].map(outputName))]
      for (const name of names) {
        const path = await realpath(join(root, name))
        if (!within(root, path)) throw new Error(`Result file resolves outside the employee workspace: ${name}`)
        if (within(privateRoot, path)) throw new Error('Studio private storage cannot be shared as an employee result')
        outputName(relative(root, path))
        const info = await stat(path)
        if (!info.isFile() || info.size > this.config.maxArtifactBytes) throw new Error(`Result must be a file within the configured size limit: ${name}`)
        const chunks: Buffer[] = []
        let bytes = 0
        for await (const chunk of createReadStream(path)) {
          const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk as string)
          bytes += buffer.length
          if (bytes > remainingBytes) throw new Error(`Task result files exceed the configured limit: ${name}`)
          chunks.push(buffer)
        }
        await publish(name, Buffer.concat(chunks))
      }
      return artifacts
    } catch (error) {
      await Promise.all(artifacts.map(file => unlink(join(artifactRoot, file.id))))
      throw error
    }
  }

  /** Read an immutable published result file by its registered identity.
   * @param id - Artifact id supplied by the UI.
   * @returns File metadata and bytes.
   */
  async artifact(id: string): Promise<{ artifact: Artifact; bytes: Buffer }> {
    const artifact = this.state.artifacts.find(file => file.id === id)
    if (!artifact) throw new Error('Result file does not exist')
    const bytes = await readFile(join(this.config.storageRoot, 'artifacts', artifact.id))
    if (createHash('sha256').update(bytes).digest('hex') !== artifact.sha256) throw new Error('Stored result file hash does not match')
    return { artifact: structuredClone(artifact), bytes }
  }

  /** Stop scheduling, cancel employees, and await complete executor teardown.
   * @returns Settlement after every owned run stops.
   */
  async close(): Promise<void> {
    this.closing = true
    const runs = [...this.active.values(), ...this.meetingRuns.values()]
    for (const run of runs) run.controller.abort(new Error('Host shutdown'))
    await Promise.allSettled(runs.map(run => run.done))
    await this.serial
  }
}

/** Admit host minutes; unstructured text is kept as the summary for the user to complete.
 * @param text - Host's final message.
 * @param meeting - Meeting whose attendees may receive tasks.
 * @returns Minutes and whether the structured form was accepted.
 */
export function parseMinutes(text: string, meeting: Meeting): { minutes: MeetingMinutes; parsed: boolean } {
  const fallback: MeetingMinutes = { summary: text.slice(0, 100_000), decisions: [], projectName: meeting.title.slice(0, 500),
    objective: meeting.agenda, acceptanceCriteria: '', tasks: [] }
  let raw: unknown
  try { raw = JSON.parse(text.replace(/^```(?:json)?\s*|\s*```$/g, '')) }
  catch { return { minutes: fallback, parsed: false } }
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return { minutes: fallback, parsed: false }
  const value = raw as Record<string, unknown>
  const string = (key: string, max: number): string => {
    const field = value[key]
    return typeof field === 'string' ? field.slice(0, max) : ''
  }
  const tasks = Array.isArray(value.tasks) ? value.tasks.flatMap((item: unknown) => {
    if (typeof item !== 'object' || item === null) return []
    const task = item as Record<string, unknown>
    if (typeof task.employeeId !== 'string' || !meeting.attendeeIds.includes(task.employeeId as StudioEmployeeId)
      || typeof task.title !== 'string' || typeof task.instruction !== 'string' || !task.title.trim()) return []
    return [{ employeeId: task.employeeId as StudioEmployeeId, title: task.title.slice(0, 500), instruction: task.instruction.slice(0, 100_000) }]
  }) : []
  const summary = string('summary', 100_000)
  if (!summary && !tasks.length) return { minutes: fallback, parsed: false }
  return { parsed: true, minutes: { summary, tasks,
    decisions: Array.isArray(value.decisions) ? value.decisions.filter((item): item is string => typeof item === 'string').map(item => item.slice(0, 100_000)) : [],
    projectName: string('projectName', 500) || fallback.projectName, objective: string('objective', 100_000) || fallback.objective,
    acceptanceCriteria: string('acceptanceCriteria', 100_000) } }
}
