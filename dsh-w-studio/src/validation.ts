/** JSON validation for HTTP commands and persisted Studio data. */
import { isAbsolute, normalize, relative } from 'node:path'
import { randomUUID } from 'node:crypto'
import type { Employee, StudioEmployeeId, StudioState, StudioWorkspaceId, TemplateMember } from './types.ts'
import { defaultTemplates } from './templates.ts'

import { minutesSchema, nativeSessionSchema, parseFields, stateSchema, stateV1Schema, stateV2Schema, stateV3Schema, stateV4Schema, stateV5Schema } from './schema.ts'
export { employeeSchema } from './schema.ts'

/** Parse a disk document without admitting unsupported generations.
 * @param input - Decoded disk JSON.
 * @returns Validated Studio state.
 */
export function parseState(input: unknown): StudioState {
  const state = parseFields(stateSchema, input) as StudioState
  const identities = <T extends { id: string }>(values: T[]): Map<string, T> => {
    const map = new Map(values.map(value => [value.id, value]))
    if (map.size !== values.length) throw new Error('Studio data contains duplicate identities')
    return map
  }
  const employees = identities(state.employees)
  const workspaces = identities(state.workspaces)
  if (state.activeWorkspaceId !== null && !workspaces.has(state.activeWorkspaceId)) throw new Error('Active company workspace is missing')
  for (const workspace of workspaces.values()) if (!isAbsolute(workspace.path)) throw new Error('Stored company directory must be absolute')
  const projects = identities(state.projects)
  const tasks = identities(state.tasks)
  identities(state.messages)
  identities(state.artifacts)
  for (const employee of employees.values()) validateEmployee(employee)
  for (const project of projects.values()) {
    const workspace = workspaces.get(project.workspaceId)
    if (!workspace || !isAbsolute(project.cwd) || !withinDirectory(workspace.path, project.cwd)) throw new Error('Stored project must belong to its company directory')
  }
  const visited = new Set<string>()
  const pending = new Set<string>()
  const visit = (id: string): void => {
    if (visited.has(id)) return
    if (pending.has(id)) throw new Error('Stored task dependencies contain a cycle')
    const task = tasks.get(id)
    if (!task || !employees.has(task.employeeId) || !projects.has(task.projectId)) throw new Error('Stored task refers to a missing employee or project')
    pending.add(id)
    for (const dependency of task.dependsOn) {
      if (tasks.get(dependency)?.projectId !== task.projectId) throw new Error('Stored dependency belongs to a different project or is missing')
      visit(dependency)
    }
    for (const name of task.outputFiles) outputName(name)
    for (const session of task.nativeSessions) {
      if (!isAbsolute(session.cwd) || session.attempt > task.attempt) throw new Error('Stored native session metadata is invalid')
    }
    pending.delete(id)
    visited.add(id)
  }
  for (const id of tasks.keys()) visit(id)
  for (const message of state.messages) {
    if (!projects.has(message.projectId) || message.from !== 'user' && !employees.has(message.from)
      || message.to !== 'team' && !employees.has(message.to)
      || message.taskId !== null && tasks.get(message.taskId)?.projectId !== message.projectId) throw new Error('Stored message refers to a missing participant or task')
  }
  for (const file of state.artifacts) {
    if (tasks.get(file.taskId)?.projectId !== file.projectId || !/^[a-f0-9]{64}$/.test(file.sha256)) throw new Error('Stored artifact metadata is invalid')
    outputName(file.name)
  }
  identities(state.meetings)
  for (const meeting of state.meetings) {
    const people = new Set(meeting.attendeeIds)
    if (!workspaces.has(meeting.workspaceId) || !people.has(meeting.hostId) || people.size !== meeting.attendeeIds.length
      || meeting.attendeeIds.some(id => !employees.has(id)) || meeting.queue.some(id => !people.has(id))
      || meeting.speaking !== null && !people.has(meeting.speaking)
      || meeting.projectId !== null && !projects.has(meeting.projectId)
      || meeting.topicProjectId !== null && projects.get(meeting.topicProjectId)?.workspaceId !== meeting.workspaceId) throw new Error('Stored meeting refers to a missing participant, workspace, or project')
    identities(meeting.messages)
    for (const message of meeting.messages) {
      if (message.from !== 'user' && !employees.has(message.from) || message.mentions.some(id => !employees.has(id))) throw new Error('Stored meeting message refers to a missing employee')
      if (message.nativeSession) {
        parseFields(nativeSessionSchema, message.nativeSession)
        if (!isAbsolute(message.nativeSession.cwd)) throw new Error('Stored native session metadata is invalid')
      }
    }
    if (meeting.minutes) {
      parseFields(minutesSchema, meeting.minutes)
      if (meeting.minutes.tasks.some(task => !employees.has(task.employeeId))) throw new Error('Stored meeting minutes refer to a missing employee')
    }
  }
  identities(state.templates)
  for (const template of state.templates) {
    if (!template.name.trim() || !template.members.length) throw new Error('Stored team template needs a name and members')
    for (const member of template.members) validateMember(member)
  }
  return state
}

/** Read the frozen v2 document into the current journal; meetings start empty.
 * @param input - Decoded v2 JSON.
 * @returns Current state.
 */
export function migrateStateV2(input: unknown): StudioState {
  return migrateStateV3({ ...parseFields(stateV2Schema, input), version: 3, meetings: [] })
}

/** Read the frozen v3 document into the current journal, seeding the built-in teams as editable templates.
 * @param input - Decoded v3 JSON.
 * @returns Current state.
 */
export function migrateStateV3(input: unknown): StudioState {
  return migrateStateV4({ ...parseFields(stateV3Schema, input), version: 4, templates: defaultTemplates() })
}

/** Read the frozen v4 document into the current journal; no task is waiting for the user yet.
 * @param input - Decoded v4 JSON.
 * @returns Current state.
 */
export function migrateStateV4(input: unknown): StudioState {
  const old = parseFields(stateV4Schema, input)
  return migrateStateV5({ ...old, version: 5, tasks: old.tasks.map(task => ({ ...task, question: '', reply: '' })) })
}

/** Read the frozen v5 document into the current journal; earlier meetings are not tied to a project.
 * @param input - Decoded v5 JSON.
 * @returns Current state.
 */
export function migrateStateV5(input: unknown): StudioState {
  const old = parseFields(stateV5Schema, input)
  return parseState({ ...old, version: 6, meetings: old.meetings.map(meeting => ({ ...meeting, topicProjectId: null })) })
}

/** Read the frozen predecessor into a separate current journal without changing it.
 * @param input - Decoded v1 JSON.
 * @returns Current state preserving employees, tasks, messages, and artifacts.
 */
export function migrateStateV1(input: unknown): StudioState {
  const old = parseFields(stateV1Schema, input)
  const workspaces: StudioState['workspaces'] = []
  const projects = old.projects.map((project) => {
    let workspace = workspaces.find(value => value.path === project.cwd)
    if (!workspace) {
      workspace = { id: randomUUID() as StudioWorkspaceId, name: project.name, path: project.cwd, createdAt: project.createdAt }
      workspaces.push(workspace)
    }
    return { ...project, workspaceId: workspace.id, acceptanceCriteria: '', sessionMode: 'new-task' as const }
  })
  return migrateStateV2({ ...old, version: 2, workspaces, activeWorkspaceId: workspaces.at(-1)?.id ?? null,
    projects, tasks: old.tasks.map(task => ({ ...task, nativeSessions: [], reviewStatus: task.status === 'completed' ? 'accepted' : 'pending' })) })
}

/** Test whether a resolved directory remains inside its company workspace.
 * @param root - Absolute company directory.
 * @param path - Absolute candidate directory.
 * @returns Whether the candidate is the root or a descendant.
 */
export function withinDirectory(root: string, path: string): boolean {
  const rel = relative(root, path)
  return rel !== '..' && !rel.startsWith(`..${process.platform === 'win32' ? '\\' : '/'}`) && !isAbsolute(rel)
}

/** Validate native options at the editable employee boundary.
 * @param employee - Employee parsed from JSON.
 */
export function validateEmployee(employee: Employee): void {
  if (!employee.name.trim() || !employee.role.trim()) throw new Error('Employee name and role are required')
  if (employee.cwd && !isAbsolute(employee.cwd)) throw new Error('Employee working directory must be absolute')
  if (employee.apiKeyEnv && !/^[A-Za-z_][A-Za-z0-9_]*$/.test(employee.apiKeyEnv)) throw new Error('Credential reference must be an environment variable name')
  const efforts: Record<Employee['engine'], readonly string[]> = {
    codex: ['', 'none', 'minimal', 'low', 'medium', 'high', 'xhigh', 'max', 'ultra'],
    claude: ['', 'low', 'medium', 'high', 'xhigh', 'max'],
    harness: ['', 'off', 'low', 'high', 'max'],
    compatible: ['', 'minimal', 'low', 'medium', 'high', 'xhigh'],
  }
  if (!efforts[employee.engine].includes(employee.effort)) throw new Error(`Unsupported ${employee.engine} effort: ${employee.effort}`)
  if (employee.engine === 'compatible') {
    const url = new URL(employee.baseURL)
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) throw new Error('Provider URL must use HTTP(S) without embedded credentials')
    if (!employee.model || !employee.apiKeyEnv) throw new Error('Compatible providers require a model and credential reference')
  }
}

/** Validate a template member with the same native-option rules as an employee.
 * @param member - Template member parsed from JSON.
 */
export function validateMember(member: TemplateMember): void {
  validateEmployee({ ...member, id: 'template-member' as StudioEmployeeId, cwd: '', enabled: true })
}

/** Reject paths that could export private files outside the project.
 * @param name - Project-relative output name.
 * @returns Normalized relative path.
 */
export function outputName(name: string): string {
  if (!name || isAbsolute(name) || name.includes('\0') || name.includes(':')) throw new Error('Output files must be project-relative paths')
  const segments = name.replaceAll('\\', '/').split('/')
  if (segments.some(segment => ['..', '.git', '.codex', '.claude', '.claude.json', '.dsh',
    '.credentials.yaml', '.deepseek-harness'].includes(segment.toLowerCase())
    || segment.toLowerCase().startsWith('.env'))) throw new Error('Private files and parent paths cannot be shared as results')
  return normalize(name)
}
