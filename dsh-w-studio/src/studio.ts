/** Durable company roster, dependency scheduler, and public result journal. */
import { randomUUID, createHash } from 'node:crypto'
import { mkdir, readFile, writeFile, realpath, stat, unlink } from 'node:fs/promises'
import { createReadStream } from 'node:fs'
import { join, resolve, relative, isAbsolute } from 'node:path'
import z from '@deepseek-ai/schemastery'
import { writeFileAtomic } from '@deepseek-ai/dsh-atomic-write'
import type { Artifact, StudioArtifactId, Employee, StudioEmployeeId, EmployeeResult, StudioMessageId, Project, StudioProjectId, StudioConfig, StudioExecutor, StudioState, Task, StudioTaskId, StudioWorkspaceId, StudioNativeSessionId } from './types.ts'
import { employeeSchema, outputName, parseState, migrateStateV1, validateEmployee, withinDirectory } from './validation.ts'
import { exportProject } from './workspace.ts'
import { parseFields } from './schema.ts'
import { teamTemplate } from './templates.ts'

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
const messageInput = z.object({ projectId: z.string().required(), to: z.string().required(),
  message: z.string().min(1).max(100_000).required() })

function identity(input: unknown): string {
  const schema = z.object({ id: z.string().min(1).required() })
  return (z.resolve(input, schema, {})[0] as ReturnType<typeof schema>).id
}
function freshState(): StudioState {
  return { version: 2, revision: 0, workspaces: [], activeWorkspaceId: null,
    employees: [], projects: [], tasks: [], messages: [], artifacts: [] }
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
    let content: string | undefined
    try { content = await readFile(join(config.storageRoot, 'studio.v2.json'), 'utf8') }
    catch (error) { if (!(error instanceof Error && 'code' in error && error.code === 'ENOENT')) throw error }
    if (content !== undefined) studio.state = parseState(JSON.parse(content))
    else {
      try { content = await readFile(join(config.storageRoot, 'studio.v1.json'), 'utf8') }
      catch (error) { if (!(error instanceof Error && 'code' in error && error.code === 'ENOENT')) throw error }
      if (content !== undefined) studio.state = migrateStateV1(JSON.parse(content))
    }
    for (const task of studio.state.tasks) {
      if (task.status === 'running') {
        task.status = 'interrupted'
        task.error = 'Host stopped before the employee completed. Retry explicitly; existing file changes remain.'
        task.finishedAt = new Date().toISOString()
      }
    }
    for (const project of studio.state.projects) if (project.status === 'running') project.status = 'paused'
    await studio.persist()
    return studio
  }

  /** Read a detached company snapshot.
   * @returns Public records only.
   */
  snapshot(): StudioState { return structuredClone(this.state) }

  private enqueue<T>(action: () => Promise<T>): Promise<T> {
    const next = this.serial.then(action)
    // The caller receives the rejection; later commands still need the queue.
    this.serial = next.catch(() => {})
    return next
  }
  private async persist(): Promise<void> {
    const path = join(this.config.storageRoot, 'studio.v2.json')
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
      result: '', error: '', assignment: '', startedAt: '', finishedAt: '', nativeSessions: [], reviewStatus: 'pending' }
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
      if (command.expectedRevision !== this.state.revision) throw new Error('Studio changed; refresh and retry your edit')
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
          case 'template': {
            const kind = parseFields(z.object({ kind: z.union(['lean', 'full'] as const).required() }), command.input).kind
            this.state.employees.push(...teamTemplate(kind))
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
            const index = this.state.employees.findIndex(employee => employee.id === parsed.id)
            if (index < 0) this.state.employees.push(parsed)
            else this.state.employees[index] = parsed
            break
          }
          case 'deleteEmployee': {
            const id = identity(command.input)
            this.employee(id)
            if (this.state.tasks.some(task => task.employeeId === id)) throw new Error('An employee with task history can be disabled but cannot be deleted')
            this.state.employees = this.state.employees.filter(employee => employee.id !== id)
            break
          }
          case 'createProject': {
            const input = parseFields(projectInput, command.input)
            const workspace = this.state.workspaces.find(value => value.id === input.workspaceId)
            if (!workspace) throw new Error('Select a company workspace first')
            const directory = input.cwd || workspace.path
            if (!isAbsolute(directory) || !(await stat(directory)).isDirectory()) throw new Error('Project working directory must be an existing absolute directory')
            const cwd = await realpath(directory)
            if (!withinDirectory(workspace.path, cwd)) throw new Error('Project directory must stay inside the company workspace')
            const employees = [...new Set(input.employeeIds)].map(id => this.employee(id))
            if (!employees.length || employees.some(employee => !employee.enabled)) throw new Error('Select at least one enabled employee')
            if (employees.length > this.config.maxTasksPerProject) throw new Error('Team exceeds the project task limit')
            const project: Project = { id: randomUUID() as StudioProjectId, name: input.name, objective: input.objective,
              cwd, workspaceId: workspace.id, acceptanceCriteria: input.acceptanceCriteria, sessionMode: input.sessionMode,
              status: 'paused', createdAt: new Date().toISOString() }
            this.state.projects.push(project)
            let previous: Task | undefined
            for (const employee of employees) {
              const task = this.appendTask(project, employee, `${employee.role} · ${input.name}`,
                `完成你的岗位负责的工作，使用已交接的文档和结果。目标：${input.objective}`, previous ? [previous.id] : [], [])
              if (employee.permission !== 'read-only') task.outputFiles = [`.studio-deliverables/${task.id}.md`]
              previous = task
            }
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
            task.status = 'pending'; task.error = ''; task.result = ''
            if (this.project(task.projectId).status === 'completed') this.project(task.projectId).status = 'paused'
            break
          }
          case 'cancelTask': {
            const task = this.task(identity(command.input))
            if (task.status === 'running') this.active.get(task.id)?.controller.abort(new Error('Stopped by user'))
            else if (task.status === 'pending') { task.status = 'cancelled'; task.finishedAt = new Date().toISOString() }
            else throw new Error('Task is not pending or running')
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
      return this.snapshot()
    })
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
      `团队成员：${JSON.stringify(this.state.employees.filter(value => value.enabled).map(value => ({ employeeId: value.id, name: value.name, role: value.role })))}`,
      `已完成的前置任务：${JSON.stringify(dependencies.map(value => ({ title: value.title, message: value.result })))}`,
      `人类对话与交接：${JSON.stringify(messages.map(value => ({ from: value.from, message: value.message })))}`,
      `前置任务的结果文件（可读取）：${JSON.stringify(artifacts.map(file => ({ name: file.name, path: join(this.config.storageRoot, 'artifacts', file.id), sha256: file.sha256 })))}`,
      `请交付这些项目相对路径的文件：${JSON.stringify(task.outputFiles)}。必要时创建父目录。只交付与任务有关的结果，不导出任何工具的私有会话、凭据或思考过程。`,
      '完成后仅返回 JSON：{"message":"给领导或同事的最终工作汇报，说明结果、验证和剩余问题", "files":["已完成的项目相对路径"], "handoffs":[{"employeeId":"接收者的真实员工 id", "message":"给同事的任务安排或结果说明"}]}。没有交接时 handoffs 为 []。不得包含推理过程、思考日志或工具调用轨迹。',
    ].join('\n\n')
    if (Buffer.byteLength(prompt) > this.config.maxTextBytes) throw new Error('Assignment exceeds the configured text limit; reduce the task or its dependencies')
    return prompt
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
      const { task, employee, project } = await this.enqueue(async () => {
        const task = this.task(id)
        const employee = this.employee(task.employeeId)
        const project = this.project(task.projectId)
        if (controller.signal.aborted || this.closing || task.status !== 'pending' || project.status !== 'running') throw new Error('Task start was cancelled')
        const workspace = this.state.workspaces.find(value => value.id === project.workspaceId)
        if (!workspace) throw new Error('Company workspace does not exist')
        const cwd = await realpath(employee.cwd || project.cwd)
        if (!withinDirectory(await realpath(workspace.path), cwd)) throw new Error('Employee directory must stay inside the company workspace')
        task.assignment = this.assignment(employee, project, task)
        task.status = 'running'; task.attempt += 1; task.startedAt = new Date().toISOString(); task.finishedAt = ''
        await this.commit()
        return structuredClone({ task, employee, project })
      })
      const prior = project.sessionMode === 'employee-project' ? this.state.tasks
        .filter(value => value.projectId === project.id && value.employeeId === employee.id && value.status === 'completed')
        .flatMap(value => value.nativeSessions)
        .findLast(value => value.engine === employee.engine && value.cwd === (employee.cwd || project.cwd)) : undefined
      const result = await this.executor.run(employee, project, task, controller.signal, {
        resumeSessionId: prior?.id ?? null,
        recordSession: (sessionId: StudioNativeSessionId) => this.enqueue(async () => {
          if (!/^[A-Za-z0-9][A-Za-z0-9_-]{0,99}$/.test(sessionId)) throw new Error('Native session identity is invalid')
          const live = this.task(id)
          if (!live.nativeSessions.some(value => value.id === sessionId && value.attempt === live.attempt)) {
            live.nativeSessions.push({ id: sessionId, engine: employee.engine, cwd: employee.cwd || project.cwd,
              attempt: live.attempt, continued: prior?.id === sessionId })
            await this.commit()
          }
        }),
      })
      controller.signal.throwIfAborted()
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
    } finally { clearTimeout(timeout) }
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
    for (const run of this.active.values()) run.controller.abort(new Error('Host shutdown'))
    await Promise.allSettled([...this.active.values()].map(run => run.done))
    await this.serial
  }
}
