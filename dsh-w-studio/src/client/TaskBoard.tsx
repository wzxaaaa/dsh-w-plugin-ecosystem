/** Dependency board, task editing, and immutable deliverable downloads. */
import { useState } from 'react'
import type { Translate } from '@deepseek-ai/dsh-client-ui-slots'
import type { StudioEmployeeId, Project, StudioState, Task } from '../types.ts'
import type { StudioKey } from './locales.ts'
import css from './Studio.module.css'

/** Data and callbacks supplied by the Studio panel. */
export interface TaskBoardProps {
  state: StudioState
  project: Project
  busy: boolean
  t: Translate<StudioKey>
  command: (action: string, input: unknown) => Promise<boolean>
}

/** Show explicit task status alongside dependency readiness and final output. */
export function TaskBoard({ state, project, busy, t, command }: TaskBoardProps) {
  const tasks = state.tasks.filter(task => task.projectId === project.id)
  const [selected, setSelected] = useState<string | null>(tasks[0]?.id ?? null)
  const [draft, setDraft] = useState<{
    id: string | null
    employeeId: string
    title: string
    instruction: string
    dependsOn: string[]
    files: string
  } | null>(null)
  const task = tasks.find(value => value.id === selected)
  const [changes, setChanges] = useState('')
  const edit = (value?: Task): void =>{  setDraft({ id: value?.id ?? null, employeeId: value?.employeeId ?? state.employees.find(employee => employee.enabled)?.id ?? '',
    title: value?.title ?? '', instruction: value?.instruction ?? '', dependsOn: value?.dependsOn ?? [], files: value?.outputFiles.join('\n') ?? '' }) }
  return <div className={css.split}>
    <section className={css.list}>
      <p className={css.hint}>{project.objective}</p>
      {project.acceptanceCriteria && <p className={css.hint}>{t('acceptanceCriteria')}: {project.acceptanceCriteria}</p>}
      <p className={css.hint}>{t('exportLocation', { path: `.studio/projects/${project.id}/` })}</p>
      <div className={css.sectionHeading}><h2>{t('tasks')}</h2><button className={css.primary} disabled={busy} onClick={() =>{  edit() }}>{t('addTask')}</button></div>
      {tasks.map(value => <button key={value.id} className={`${css.taskRow} ${selected === value.id ? css.selectedRow : ''}`} onClick={() => { setSelected(value.id); setDraft(null) }}>
        <span><strong>{value.title}</strong><small>{state.employees.find(employee => employee.id === value.employeeId)?.name}
          {value.reviewStatus === 'superseded' && <> · {t('superseded')}</>}</small></span>
        <span className={css.status} data-status={value.status}>{t(value.status === 'pending' && !value.dependsOn.every(id => tasks.find(dependency => dependency.id === id)?.status === 'completed') ? 'blocked' : value.status)}</span>
      </button>)}
      {!tasks.length && <p className={css.empty}>{t('noTasks')}</p>}
    </section>
    <section className={css.editor}>
      {draft ? <form onSubmit={(event) => {
        event.preventDefault()
        const input = { projectId: project.id, employeeId: draft.employeeId as StudioEmployeeId,
          title: draft.title, instruction: draft.instruction,
          dependsOn: draft.dependsOn, outputFiles: draft.files.split('\n').map(name => name.trim()).filter(Boolean) }
        void command(draft.id ? 'editTask' : 'createTask', draft.id ? { id: draft.id, task: input } : input).then((ok) => { if (ok) setDraft(null) })
      }}>
        <h2>{t(draft.id ? 'edit' : 'addTask')}</h2>
        <label className={css.stackedField}>{t('employees')}<select required value={draft.employeeId} onChange={(event) =>{  setDraft({ ...draft, employeeId: event.target.value }) }}>
          {state.employees.filter(employee => employee.enabled).map(employee => <option key={employee.id} value={employee.id}>
            {employee.name} · {employee.role}
          </option>)}
        </select></label>
        <label className={css.stackedField}>{t('taskTitle')}<input required value={draft.title} onChange={(event) =>{  setDraft({ ...draft, title: event.target.value }) }} /></label>
        <label className={css.stackedField}>{t('instruction')}<textarea required rows={5} value={draft.instruction} onChange={(event) =>{  setDraft({ ...draft, instruction: event.target.value }) }} /></label>
        <fieldset className={css.checklist}><legend>{t('dependencies')}</legend>{tasks.filter(value => value.id !== draft.id).map(value => <label key={value.id} className={css.check}>
          <input type="checkbox" checked={draft.dependsOn.includes(value.id)} onChange={(event) =>{  setDraft({ ...draft, dependsOn: event.target.checked ? [...draft.dependsOn, value.id] : draft.dependsOn.filter(id => id !== value.id) }) }} />{value.title}
        </label>)}</fieldset>
        <label className={css.stackedField}>{t('files')}<textarea rows={3} value={draft.files} onChange={(event) =>{  setDraft({ ...draft, files: event.target.value }) }} /></label>
        <div className={css.actions}><button className={css.primary} disabled={busy}>{t('save')}</button><button type="button" onClick={() =>{  setDraft(null) }}>{t('close')}</button></div>
      </form> : task ? <>
        <h2>{t('lastResult')}</h2><h3>{task.title}</h3><p className={css.hint}>{t('attempt')}: {task.attempt}</p>
        <div className={css.actions}>
          {task.status === 'pending' && <button onClick={() =>{  edit(task) }}>{t('edit')}</button>}
          {['failed', 'cancelled', 'interrupted'].includes(task.status) && <button disabled={busy} onClick={() => { void command('retryTask', { id: task.id }) }}>{t('retry')}</button>}
          {['pending', 'running'].includes(task.status) && <button className={css.danger} disabled={busy} onClick={() => { void command('cancelTask', { id: task.id }) }}>{t('cancel')}</button>}
        </div>
        {task.error && <p role="alert" className={css.error}>{task.error}</p>}
        {task.status === 'completed' && task.reviewStatus !== 'superseded' && <form onSubmit={(event) => { event.preventDefault(); void command('requestChanges', { id: task.id, instruction: changes }).then((ok) => { if (ok) setChanges('') }) }}>
          <label className={css.stackedField}>{t('changeInstruction')}<textarea required rows={3} value={changes} onChange={(event) => { setChanges(event.target.value) }} /></label><button disabled={busy || project.status === 'running'}>{t('requestChanges')}</button>
        </form>}
        {task.status === 'completed' && <p className={css.hint}>{t(task.reviewStatus === 'superseded' ? 'superseded' : task.reviewStatus === 'accepted' ? 'accepted' : 'awaitingReview')}</p>}
        {!!task.nativeSessions.length && <details><summary>{t('nativeSessions')}</summary><p className={css.hint}>{t('nativeSessionHelp')}</p>{task.nativeSessions.map(session => <div key={`${session.id}-${session.attempt}`}><strong>{t(session.engine)} · {t(session.continued ? 'continuedSession' : 'newSession')}</strong><pre className={css.report}>{session.engine === 'claude' ? `claude --resume ${session.id}` : session.engine === 'codex' ? `codex resume ${session.id}` : session.id}</pre><p className={css.hint}>{session.cwd}</p></div>)}</details>}
        <h3>{t('result')}</h3><pre className={css.report}>{task.result || t('noResult')}</pre>
        <h3>{t('artifacts')}</h3><ul className={css.fileList}>{state.artifacts.filter(file => file.taskId === task.id).map(file => <li key={file.id}>
          <a href={`/api/studio/artifact?id=${encodeURIComponent(file.id)}`} download>{file.name}</a><small>{t('fileMetadata', { size: Math.ceil(file.size / 1024), hash: file.sha256.slice(0, 12) })}</small>
        </li>)}</ul>
        <details><summary>{t('assignment')}</summary><pre className={css.report}>{task.assignment || task.instruction}</pre></details>
      </> : <p className={css.empty}>{t('noTasks')}</p>}
    </section>
  </div>
}
