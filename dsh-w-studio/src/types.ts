/** Persisted Studio records. Native transcripts and reasoning never enter these records. */
import type { Branded } from '@deepseek-ai/dsh-brand'

/** Employee identity minted by Studio. */
export type StudioEmployeeId = Branded<'StudioEmployeeId'>
/** Project identity minted by Studio. */
export type StudioProjectId = Branded<'StudioProjectId'>
/** Task identity minted by Studio. */
export type StudioTaskId = Branded<'StudioTaskId'>
/** Public handoff identity minted by Studio. */
export type StudioMessageId = Branded<'StudioMessageId'>
/** Immutable result file identity minted by Studio. */
export type StudioArtifactId = Branded<'StudioArtifactId'>
/** Company workspace identity owned by Studio. */
export type StudioWorkspaceId = Branded<'StudioWorkspaceId'>
/** Meeting identity minted by Studio. */
export type StudioMeetingId = Branded<'StudioMeetingId'>
/** Session identity returned by a native executor. */
export type StudioNativeSessionId = Branded<'StudioNativeSessionId'>
/** Executors available to employees. */
export type Engine = 'codex' | 'claude' | 'harness' | 'compatible'
/** Native permission choices translated explicitly by each executor. */
export type Permission = 'read-only' | 'workspace-write' | 'full-access'
/** Shared company folder; selecting it does not create or modify a Git repository. */
export interface StudioWorkspace {
  id: StudioWorkspaceId
  name: string
  path: string
  createdAt: string
}
/** Public execution identity; the session transcript remains native and private. */
export interface StudioNativeSession {
  id: StudioNativeSessionId
  engine: Engine
  cwd: string
  attempt: number
  continued: boolean
}
/** Employees own their models, responsibilities, and native settings. */
export interface Employee {
  id: StudioEmployeeId
  name: string
  role: string
  responsibilities: string
  engine: Engine
  model: string
  effort: string
  permission: Permission
  cwd: string
  enabled: boolean
  baseURL: string
  apiKeyEnv: string
  thinkingFormat: 'none' | 'deepseek' | 'zai'
  contextWindow: number
  maxTokens: number
}
/** A company objective and its workspace. Pausing prevents new task starts. */
export interface Project {
  id: StudioProjectId
  workspaceId: StudioWorkspaceId
  name: string
  objective: string
  cwd: string
  status: 'paused' | 'running' | 'review' | 'completed'
  acceptanceCriteria: string
  sessionMode: 'employee-project' | 'new-task'
  createdAt: string
}
/** Task state survives reload; interrupted work requires an explicit retry.
 * waiting: the employee paused for something only the user can do; the reply resumes the same native session.
 */
export interface Task {
  id: StudioTaskId
  projectId: StudioProjectId
  employeeId: StudioEmployeeId
  title: string
  instruction: string
  dependsOn: StudioTaskId[]
  outputFiles: string[]
  status: 'pending' | 'running' | 'waiting' | 'completed' | 'failed' | 'cancelled' | 'interrupted'
  attempt: number
  result: string
  error: string
  startedAt: string
  finishedAt: string
  /** Exact public assignment sent for the most recent attempt. */
  assignment: string
  nativeSessions: StudioNativeSession[]
  reviewStatus: 'pending' | 'accepted' | 'superseded'
  /** What the employee needs the user to do while the task is waiting. */
  question: string
  /** User reply not yet delivered; the next attempt continues the waiting session with it. */
  reply: string
}
/** A human-readable message; native reasoning and tool events are excluded. */
export interface Handoff {
  id: StudioMessageId
  projectId: StudioProjectId
  taskId: StudioTaskId | null
  from: StudioEmployeeId | 'user'
  to: StudioEmployeeId | 'team'
  message: string
  createdAt: string
}
/** Result bytes are copied outside the working tree before publication. */
export interface Artifact {
  id: StudioArtifactId
  projectId: StudioProjectId
  taskId: StudioTaskId
  name: string
  size: number
  sha256: string
}
/** One spoken turn in a meeting; employee turns carry their native session identity. */
export interface MeetingMessage {
  id: StudioMessageId
  from: StudioEmployeeId | 'user'
  message: string
  /** Attendees asked to speak next. */
  mentions: StudioEmployeeId[]
  createdAt: string
  nativeSession: StudioNativeSession | null
}
/** Host-drafted, user-editable meeting outcome that can become a project. */
export interface MeetingMinutes {
  summary: string
  decisions: string[]
  projectName: string
  objective: string
  acceptanceCriteria: string
  /** Ordered assignments; the created project runs them as a dependency chain. */
  tasks: { employeeId: StudioEmployeeId; title: string; instruction: string }[]
}
/** Group discussion between the user (as client) and invited employees.
 * open: discussing; drafting: host writing minutes; review: minutes await the user; closed: ended.
 */
export interface Meeting {
  id: StudioMeetingId
  workspaceId: StudioWorkspaceId
  title: string
  agenda: string
  hostId: StudioEmployeeId
  attendeeIds: StudioEmployeeId[]
  status: 'open' | 'drafting' | 'review' | 'closed'
  /** Attendees waiting to speak, in order. */
  queue: StudioEmployeeId[]
  /** Attendee whose native turn is running. */
  speaking: StudioEmployeeId | null
  error: string
  messages: MeetingMessage[]
  minutes: MeetingMinutes | null
  /** Project the minutes created or extended. */
  projectId: StudioProjectId | null
  /** Project this meeting is about; null for a new product or unrelated discussion. */
  topicProjectId: StudioProjectId | null
  createdAt: string
}
/** Template identity minted by Studio or the browser editor. */
export type StudioTemplateId = Branded<'StudioTemplateId'>
/** Employee settings a template creates; directory and enablement belong to the company roster. */
export type TemplateMember = Omit<Employee, 'id' | 'cwd' | 'enabled'>
/** Editable team definition. Applying it replaces the roster instead of appending to it. */
export interface TeamTemplate {
  id: StudioTemplateId
  name: string
  description: string
  members: TemplateMember[]
  createdAt: string
}
/** Studio's versioned local document; public HTTP responses use the same records. */
export interface StudioState {
  version: 6
  revision: number
  workspaces: StudioWorkspace[]
  activeWorkspaceId: StudioWorkspaceId | null
  employees: Employee[]
  projects: Project[]
  tasks: Task[]
  messages: Handoff[]
  artifacts: Artifact[]
  meetings: Meeting[]
  templates: TeamTemplate[]
}
/** Explicit deployment limits and executable argv prefixes. */
export interface StudioConfig {
  /** Absolute directory for the public journal, immutable artifacts, and private employee homes. */
  storageRoot: string
  /** Local Claude Code executable and optional fixed argv prefix. */
  claudeCommand: string[]
  /** Local Codex executable and optional fixed argv prefix. */
  codexCommand: string[]
  /** Built dsh CLI entry used to launch isolated SDK-profile employees. */
  dshBin: string
  /** Maximum simultaneous employee operations across distinct working directories. */
  maxParallel: number
  /** Maximum tasks admitted to one project. */
  maxTasksPerProject: number
  /** Maximum UTF-8 bytes in an assignment or complete final handoff. */
  maxTextBytes: number
  /** Maximum aggregate bytes published by one task, including its final report. */
  maxArtifactBytes: number
  /** Maximum streamed command request bytes before JSON decoding. */
  maxRequestBytes: number
  /** Maximum wall-clock duration of one employee operation before cancellation. */
  taskTimeoutMs: number
  /** Grace period forwarded to native subprocess and SDK teardown. */
  disposeGraceMs: number
  /** Interval supplied to the browser for refreshing the public journal. */
  pollIntervalMs: number
  /** How long a native run may linger after reporting its final answer before Studio ends it. */
  completionGraceMs: number
}
/** Only the final human message and explicitly named files cross executor ownership. */
export interface EmployeeResult {
  message: string
  files: string[]
  handoffs: { employeeId: StudioEmployeeId; message: string }[]
  /** Non-empty when the employee stopped to ask the user for something it cannot do itself. */
  needsUser: string
}
/** An executor receives a committed assignment and returns a final handoff. */
export interface StudioExecutor {
  /** Execute one persisted public assignment without returning private protocol events.
   * @param employee - Employee-specific native configuration.
   * @param project - Project objective and default working directory.
   * @param task - Committed task and its exact assignment.
   * @param signal - Cancellation owned by Studio.
   * @param execution - Employee-private continuation and public identity recorder.
   * @returns Final report, result paths, and addressed colleague messages.
   */
  run(employee: Employee, project: Project, task: Task, signal: AbortSignal, execution: StudioExecution): Promise<EmployeeResult>
}
/** One attempt's private continuation selection and awaited metadata commit. */
export interface StudioExecution {
  resumeSessionId: StudioNativeSessionId | null
  /** Latest human-readable progress line from the native run; transient and never persisted. */
  progress?(text: string): void
  /** Record only the native identity, never its stream or transcript.
   * @param id - Identity returned by the executor.
   * @returns Completion of the durable metadata update.
   */
  recordSession(id: StudioNativeSessionId): Promise<void>
}
/** Host health results contain versions and presence, never credentials. */
export interface StudioHealth {
  codex: { available: boolean; version: string }
  claude: { available: boolean; version: string }
  harness: { available: boolean; version: string }
}
/** Provider-owned model identities and supported effort values. */
export interface StudioModel {
  id: string
  name: string
  efforts: string[]
  /** Harness-advertised image input; null when native discovery does not publish it. */
  imageInput: boolean | null
}
/** Native picker entries and the active Harness model directory. */
export interface StudioCatalog {
  codex: StudioModel[]
  claude: StudioModel[]
  claudeError: string
  harness: StudioModel[]
}
