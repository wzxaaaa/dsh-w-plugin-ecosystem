/** Pure view derivations shared by Studio components; every value comes from the public Host state. */
import { useState } from 'react'
import type { Translate } from '@deepseek-ai/dsh-client-ui-slots'
import type { Artifact, Employee, Handoff, StudioNativeSession, Task } from '../types.ts'
import type { StudioKey } from './locales.ts'

/** Localizer shared by every Studio component. */
export type T = Translate<StudioKey>
/** Command submitter owned by the controller. */
export type Command = (action: string, input: unknown) => Promise<boolean>
/** Display phase: a pending task whose dependencies are unfinished is shown as blocked. */
export type TaskPhase = Task['status'] | 'blocked'

/** Dependencies of a task that have not completed yet.
 * @param task - Task being displayed.
 * @param tasks - Tasks of the same project.
 * @returns Unfinished dependency tasks in declaration order.
 */
export function waitingOn(task: Task, tasks: readonly Task[]): Task[] {
  return task.dependsOn.map(id => tasks.find(value => value.id === id)).filter((value): value is Task => !!value && value.status !== 'completed')
}
/** Real scheduling phase for badges and filters.
 * @param task - Task being displayed.
 * @param tasks - Tasks of the same project.
 * @returns Host status, or blocked for pending work waiting on dependencies.
 */
export function taskPhase(task: Task, tasks: readonly Task[]): TaskPhase {
  return task.status === 'pending' && waitingOn(task, tasks).length ? 'blocked' : task.status
}
/** Original task a revision was created from; mirrors Host `requestChanges`.
 * @param task - Possible revision task.
 * @param tasks - Tasks of the same project.
 * @returns The superseded original, if this task is its revision.
 */
export function revisionOf(task: Task, tasks: readonly Task[]): Task | undefined {
  return task.dependsOn.map(id => tasks.find(value => value.id === id))
    .find(value => value?.reviewStatus === 'superseded' && value.employeeId === task.employeeId && value.title === task.title)
}
/** Revision tasks created for a superseded result.
 * @param task - Possibly superseded task.
 * @param tasks - Tasks of the same project.
 * @returns Revision tasks pointing back at it.
 */
export function revisionsFor(task: Task, tasks: readonly Task[]): Task[] {
  return task.reviewStatus === 'superseded' ? tasks.filter(value => revisionOf(value, tasks)?.id === task.id) : []
}
/** The user's change request recorded with a revision task.
 * @param revision - Revision task.
 * @param messages - Public handoffs.
 * @returns The user message attached to the revision.
 */
export function changeRequest(revision: Task, messages: readonly Handoff[]): Handoff | undefined {
  return messages.find(message => message.taskId === revision.id && message.from === 'user')
}
/** Per-status counts for project summaries and list filters.
 * @param tasks - Tasks of one project.
 * @returns Counts derived from real task records.
 */
export function projectStats(tasks: readonly Task[]) {
  const phases = tasks.map(task => taskPhase(task, tasks))
  const count = (...values: TaskPhase[]): number => phases.filter(phase => values.includes(phase)).length
  const active = tasks.filter(task => task.status !== 'cancelled').length
  return { total: tasks.length, active, completed: count('completed'), running: count('running'), ready: count('pending'),
    blocked: count('blocked'), needsYou: count('waiting'), attention: count('failed', 'interrupted'),
    review: tasks.filter(task => task.status === 'completed' && task.reviewStatus === 'pending').length }
}
/** Stable avatar tone from an identity, so colors survive reordering.
 * @param id - Record identity.
 * @returns Tone index 0–5.
 */
export function tone(id: string): number {
  let hash = 0
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return hash % 6
}
/** First visible character of a display name.
 * @param name - Display name.
 * @returns Avatar glyph.
 */
export function initial(name: string | undefined): string {
  return [...(name?.trim() || '?')][0]?.toUpperCase() ?? '?'
}
/** Resolve an employee by id.
 * @param employees - Company roster.
 * @param id - Employee id or a special sender.
 * @returns Employee record when present.
 */
export function employeeOf(employees: readonly Employee[], id: string): Employee | undefined {
  return employees.find(value => value.id === id)
}
/** Coarse result-file category for icons and previews. */
export type FileKind = 'image' | 'document' | 'web' | 'code' | 'data' | 'other'
const kinds: Record<string, FileKind> = {
  png: 'image', jpg: 'image', jpeg: 'image', gif: 'image', webp: 'image', svg: 'image', bmp: 'image',
  md: 'document', markdown: 'document', txt: 'document', rst: 'document', pdf: 'document', docx: 'document',
  html: 'web', htm: 'web', css: 'web',
  json: 'data', csv: 'data', yml: 'data', yaml: 'data', toml: 'data', xml: 'data',
  ts: 'code', tsx: 'code', js: 'code', jsx: 'code', mjs: 'code', cjs: 'code', py: 'code', go: 'code', rs: 'code', java: 'code',
  kt: 'code', swift: 'code', c: 'code', h: 'code', cpp: 'code', cs: 'code', rb: 'code', php: 'code', sh: 'code', ps1: 'code', sql: 'code', vue: 'code',
}
/** Classify a result file by extension.
 * @param name - Recorded relative file name.
 * @returns File category.
 */
export function fileKind(name: string): FileKind {
  return kinds[name.split('.').at(-1)?.toLowerCase() ?? ''] ?? 'other'
}
const imageTypes: Record<string, string> = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp', svg: 'image/svg+xml', bmp: 'image/bmp' }
/** MIME type for an image result so the browser can render a downloaded blob.
 * @param name - Result file name.
 * @returns Image MIME type, or empty for non-images.
 */
export function imageType(name: string): string {
  return imageTypes[name.split('.').at(-1)?.toLowerCase() ?? ''] ?? ''
}
/** Whether a file can be shown as text.
 * @param artifact - Recorded result.
 * @returns True for small text-like files.
 */
export function previewableText(artifact: Artifact): boolean {
  const kind = fileKind(artifact.name)
  return artifact.size <= 512 * 1024 && (kind === 'code' || kind === 'data' || kind === 'web' || (kind === 'document' && !/\.(pdf|docx)$/i.test(artifact.name)))
}
/** Download URL of a recorded result.
 * @param artifact - Recorded result.
 * @returns Same-origin API URL.
 */
export function artifactUrl(artifact: Artifact): string {
  return `/api/studio/artifact?id=${encodeURIComponent(artifact.id)}`
}
/** Human-readable byte size.
 * @param bytes - Size in bytes.
 * @returns Short size label.
 */
export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(bytes < 10 * 1024 ? 1 : 0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}
/** Localized timestamp, empty for unset Host times.
 * @param iso - ISO time or empty string.
 * @returns Display time.
 */
export function formatTime(iso: string): string {
  if (!iso) return ''
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? iso : date.toLocaleString(undefined, { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}
/** Native command that resumes a recorded employee session.
 * @param session - Recorded native identity.
 * @returns Shell command or the bare id for SDK sessions.
 */
export function resumeCommand(session: StudioNativeSession): string {
  return session.engine === 'claude' ? `claude --resume ${session.id}` : session.engine === 'codex' ? `codex resume ${session.id}` : session.id
}
/** Track which button started the in-flight command so only it shows progress.
 * @returns Pending key and a runner that sets it around one command.
 */
export function usePending() {
  const [pending, setPending] = useState<string | null>(null)
  const run = async (key: string, action: () => Promise<boolean>): Promise<boolean> => {
    setPending(key)
    try { return await action() }
    finally { setPending(null) }
  }
  return { pending, run }
}
