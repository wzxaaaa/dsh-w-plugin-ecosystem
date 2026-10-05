/** Small presentational atoms reused across Studio views. */
import type { ReactNode } from 'react'
import type { Engine, Project, Task } from '../types.ts'
import { initial, tone, type T, type TaskPhase } from './ui.ts'
import css from './Studio.module.css'

/** Round initial badge with a stable per-identity tone. */
export function Avatar({ id, name, size = 'md' }: { id: string; name: string | undefined; size?: 'sm' | 'md' | 'lg' }) {
  return <span className={css.avatar} data-tone={tone(id)} data-size={size} aria-hidden="true">{initial(name)}</span>
}
/** Task phase pill; review state is shown only for completed tasks. */
export function TaskStatus({ phase, t }: { phase: TaskPhase; t: T }) {
  return <span className={css.badge} data-status={phase}><i aria-hidden="true" />{t(phase)}</span>
}
/** Result review pill; meaningful only after completion. */
export function ReviewStatus({ task, t }: { task: Task; t: T }) {
  if (task.status !== 'completed') return null
  const key = task.reviewStatus === 'superseded' ? 'superseded' : task.reviewStatus === 'accepted' ? 'accepted' : 'awaitingReview'
  return <span className={css.badge} data-review={task.reviewStatus}>{t(key)}</span>
}
/** Project lifecycle pill. */
export function ProjectStatus({ status, t }: { status: Project['status']; t: T }) {
  return <span className={css.badge} data-project={status}><i aria-hidden="true" />{t(status === 'paused' ? 'projectPaused' : status === 'running' ? 'projectRunning' : status === 'review' ? 'review' : 'projectCompleted')}</span>
}
/** Execution engine label with its own color. */
export function EngineTag({ engine, t }: { engine: Engine; t: T }) {
  return <span className={css.engineTag} data-engine={engine}>{t(engine)}</span>
}
/** Titled block with an optional trailing action. */
export function Section({ title, action, children, className }: { title: ReactNode; action?: ReactNode; children: ReactNode; className?: string }) {
  return <section className={`${css.block} ${className ?? ''}`}>
    <header className={css.blockHead}><h3>{title}</h3>{action}</header>
    {children}
  </section>
}
/** Spinner shown inside the button whose command is running. */
export function Busy({ on }: { on: boolean }) {
  return on ? <span className={css.spinner} aria-hidden="true" /> : null
}
