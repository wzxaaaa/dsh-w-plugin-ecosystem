/** Dependency board, task editing, and immutable deliverable downloads. */
import { useEffect, useRef, useState } from 'react'
import type { StudioEmployeeId, Project, StudioState, Task } from '../types.ts'
import type { StudioProgress } from './controller.ts'
import { TaskDetail } from './TaskDetail.tsx'
import { Avatar, Busy, ReviewStatus, TaskStatus } from './parts.tsx'
import { employeeOf, projectStats, revisionOf, taskPhase, usePending, waitingOn, type Command, type T, type TaskPhase } from './ui.ts'
import css from './Studio.module.css'

/** Data and callbacks supplied by the Studio panel. */
export interface TaskBoardProps {
  state: StudioState
  /** Latest interim message of each running task. */
  progress: StudioProgress
  project: Project
  busy: boolean
  error: string
  t: T
  command: Command
  /** Selected task id, owned by the panel so the handoff timeline can jump here. */
  selected: string | null
  onSelect: (id: string) => void
}
type Filter = 'all' | 'needsYou' | 'active' | 'waiting' | 'done' | 'attention'
const filters: Record<Filter, readonly TaskPhase[]> = {
  all: [], needsYou: ['waiting'], active: ['running'], waiting: ['pending', 'blocked'], done: ['completed'], attention: ['failed', 'interrupted', 'cancelled'],
}
/** Draft for creating or editing a pending task. */
interface TaskDraft {
  id: string | null
  employeeId: string
  title: string
  instruction: string
  dependsOn: string[]
  files: string
}

/** Show explicit task status alongside dependency readiness and final output. */
export function TaskBoard({ state, progress, project, busy, error, t, command, selected, onSelect }: TaskBoardProps) {
  const tasks = state.tasks.filter(task => task.projectId === project.id)
  const [filter, setFilter] = useState<Filter>('all')
  const [draft, setDraft] = useState<TaskDraft | null>(null)
  const detail = useRef<HTMLDivElement>(null)
  const task = tasks.find(value => value.id === selected) ?? tasks[0]
  const stats = projectStats(tasks)
  const counts: Record<Filter, number> = { all: stats.total, needsYou: stats.needsYou, active: stats.running, waiting: stats.ready + stats.blocked, done: stats.completed, attention: stats.attention }
  const shown = filter === 'all' ? tasks : tasks.filter(value => filters[filter].includes(taskPhase(value, tasks)))
  const edit = (value?: Task): void => {
    setDraft({ id: value?.id ?? null, employeeId: value?.employeeId ?? state.employees.find(employee => employee.enabled)?.id ?? '',
      title: value?.title ?? '', instruction: value?.instruction ?? '', dependsOn: value?.dependsOn ?? [], files: value?.outputFiles.join('\n') ?? '' })
    reveal()
  }
  const reveal = (): void => {
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 1100px)').matches) {
      requestAnimationFrame(() => { detail.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }) })
    }
  }
  const select = (id: string): void => { onSelect(id); setDraft(null); reveal() }
  return <div className={css.workArea}>
    <section className={css.listPane} aria-label={t('tasks')}>
      <div className={css.paneHead}>
        <div><h2>{t('tasks')}</h2><p className={css.muted}>{t('taskSummary', { done: stats.completed, total: stats.active })}</p></div>
        <button className={css.primary} disabled={busy} onClick={() => { edit() }}>{t('addTask')}</button>
      </div>
      <div className={css.filterRow} role="group" aria-label={t('filterTasks')}>
        {(Object.keys(filters) as Filter[]).filter(key => key !== 'needsYou' || counts.needsYou).map(key => <button key={key} className={css.filter} aria-pressed={filter === key} onClick={() => { setFilter(key) }} data-tone={key}>
          {t(`filter_${key}` as const)}<span>{counts[key]}</span>
        </button>)}
      </div>
      <ol className={css.pipeline}>
        {shown.map((value) => {
          const phase = taskPhase(value, tasks)
          const owner = employeeOf(state.employees, value.employeeId)
          const waiting = phase === 'blocked' ? waitingOn(value, tasks) : []
          const original = revisionOf(value, tasks)
          return <li key={value.id} data-status={phase}>
            <button className={css.taskItem} aria-current={task?.id === value.id ? 'true' : undefined} onClick={() => { select(value.id) }}>
              <span className={css.step}>{tasks.indexOf(value) + 1}</span>
              <span className={css.taskMain}>
                <strong>{value.title}</strong>
                <span className={css.taskOwner}><Avatar id={value.employeeId} name={owner?.name} size="sm" />{owner?.name ?? t('unknownEmployee')}{owner?.role && <small> · {owner.role}</small>}</span>
                {!!waiting.length && <small className={css.reason}>{t('waitingFor', { names: waiting.map(dependency => `#${tasks.indexOf(dependency) + 1}`).join('、') })}</small>}
                {phase === 'running' && progress[value.id] && <small className={css.reason} data-kind="progress">{progress[value.id]?.text}</small>}
                {phase === 'waiting' && <small className={css.reason} data-kind="needsYou">{value.question}</small>}
                {original && <small className={css.reason} data-kind="revision">{t('revisionOfShort', { step: tasks.indexOf(original) + 1 })}</small>}
              </span>
              <span className={css.taskBadges}><TaskStatus phase={phase} t={t} /><ReviewStatus task={value} t={t} /></span>
            </button>
          </li>
        })}
      </ol>
      {!tasks.length && <div className={css.emptyState}><strong>{t('noTasks')}</strong><p>{t('noTasksHelp')}</p></div>}
      {!!tasks.length && !shown.length && <p className={css.emptyInline}>{t('noFilteredTasks')}</p>}
    </section>
    <div className={css.detailPane} ref={detail}>
      {draft ? <TaskForm draft={draft} setDraft={setDraft} tasks={tasks} state={state} project={project} busy={busy} error={error} t={t} command={command} />
        : task ? <TaskDetail key={task.id} task={task} tasks={tasks} state={state} progress={progress[task.id]} project={project} busy={busy} t={t} command={command} onSelect={select} onEdit={() => { edit(task) }} />
          : <div className={css.emptyState}><p>{t('selectTask')}</p></div>}
    </div>
  </div>
}

interface TaskFormProps {
  draft: TaskDraft
  setDraft: (draft: TaskDraft | null) => void
  tasks: Task[]
  state: StudioState
  project: Project
  busy: boolean
  error: string
  t: T
  command: Command
}
/** Create a task or edit a pending one; dependencies stay inside this project. */
function TaskForm({ draft, setDraft, tasks, state, project, busy, error, t, command }: TaskFormProps) {
  const { pending, run } = usePending()
  const [failed, setFailed] = useState(false)
  const first = useRef<HTMLSelectElement>(null)
  useEffect(() => { first.current?.focus() }, [draft.id])
  return <form className={css.editorCard} onSubmit={(event) => {
    event.preventDefault()
    const input = { projectId: project.id, employeeId: draft.employeeId as StudioEmployeeId,
      title: draft.title, instruction: draft.instruction,
      dependsOn: draft.dependsOn, outputFiles: draft.files.split('\n').map(name => name.trim()).filter(Boolean) }
    void run('save', () => command(draft.id ? 'editTask' : 'createTask', draft.id ? { id: draft.id, task: input } : input)).then((ok) => {
      setFailed(!ok)
      if (ok) setDraft(null)
    })
  }}>
    <header className={css.detailHead}><h2>{t(draft.id ? 'editTask' : 'addTask')}</h2></header>
    <label className={css.field}><span>{t('assignee')}</span><select ref={first} required value={draft.employeeId} onChange={(event) => { setDraft({ ...draft, employeeId: event.target.value }) }}>
      {state.employees.filter(employee => employee.enabled || employee.id === draft.employeeId).map(employee => <option key={employee.id} value={employee.id}>
        {employee.name}{employee.role && ` · ${employee.role}`}
      </option>)}
    </select></label>
    <label className={css.field}><span>{t('taskTitle')}</span><input required value={draft.title} onChange={(event) => { setDraft({ ...draft, title: event.target.value }) }} /></label>
    <label className={css.field}><span>{t('instruction')}</span><textarea required rows={6} value={draft.instruction} onChange={(event) => { setDraft({ ...draft, instruction: event.target.value }) }} /></label>
    <fieldset className={css.checkList}><legend>{t('dependencies')}</legend>
      {tasks.filter(value => value.id !== draft.id).map(value => <label key={value.id}>
        <input type="checkbox" checked={draft.dependsOn.includes(value.id)} onChange={(event) => { setDraft({ ...draft, dependsOn: event.target.checked ? [...draft.dependsOn, value.id] : draft.dependsOn.filter(id => id !== value.id) }) }} />
        <span><b>#{tasks.indexOf(value) + 1}</b> {value.title}</span>
      </label>)}
      {tasks.length <= (draft.id ? 1 : 0) && <p className={css.muted}>{t('noDependencies')}</p>}
    </fieldset>
    <label className={css.field}><span>{t('files')}</span><textarea className={css.mono} rows={3} value={draft.files} onChange={(event) => { setDraft({ ...draft, files: event.target.value }) }} /></label>
    <footer className={css.formFooter}>
      <div className={css.actions}>
        <button className={css.primary} disabled={busy}><Busy on={pending === 'save'} />{t(pending === 'save' ? 'saving' : 'save')}</button>
        <button type="button" className={css.ghost} onClick={() => { setDraft(null) }}>{t('close')}</button>
      </div>
      {failed && <p className={css.formStatus} data-state="error" role="alert">{error || t('failure')}</p>}
    </footer>
  </form>
}
