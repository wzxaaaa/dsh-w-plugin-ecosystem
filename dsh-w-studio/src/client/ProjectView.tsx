/** Project switcher, state-appropriate actions, and a summary of goal, criteria, team, and progress. */
import { useState } from 'react'
import type { Project, StudioState } from '../types.ts'
import { Avatar, Busy, ProjectStatus } from './parts.tsx'
import { employeeOf, projectStats, usePending, type Command, type T } from './ui.ts'
import css from './Studio.module.css'

/** Current project plus selection callbacks owned by the panel. */
export interface ProjectBarProps {
  state: StudioState
  projects: Project[]
  project: Project
  busy: boolean
  t: T
  command: Command
  onSelect: (id: string) => void
}

/** Header showing which project is open and only the actions its status allows. */
export function ProjectBar({ state, projects, project, busy, t, command, onSelect }: ProjectBarProps) {
  const { pending, run } = usePending()
  const [exported, setExported] = useState('')
  const tasks = state.tasks.filter(task => task.projectId === project.id)
  const stats = projectStats(tasks)
  const workspace = state.workspaces.find(value => value.id === project.workspaceId)
  const anyRunning = tasks.some(task => task.status === 'running')
  const team = [...new Set(tasks.map(task => task.employeeId))].map(id => ({ id, employee: employeeOf(state.employees, id) }))
  const percent = stats.active ? Math.round(stats.completed / stats.active * 100) : 0
  const act = (key: string, action: string) => (): void => { void run(key, () => command(action, { id: project.id })) }
  const separator = workspace?.path.includes('\\') ? '\\' : '/'
  const exportPath = workspace ? [workspace.path.replace(/[\\/]+$/, ''), '.studio', 'projects', project.id].join(separator) : ''
  return <section className={css.projectBar} aria-label={t('project')}>
    <div className={css.projectTop}>
      <label className={css.projectPicker}>
        <span className={css.srOnly}>{t('project')}</span>
        <select aria-label={t('project')} value={project.id} onChange={(event) => { setExported(''); onSelect(event.target.value) }}>
          {projects.map(value => <option key={value.id} value={value.id}>{value.name}</option>)}
        </select>
      </label>
      <ProjectStatus status={project.status} t={t} />
      <div className={`${css.actions} ${css.projectActions}`}>
        {project.status === 'paused' && <button className={css.primary} disabled={busy || !stats.ready} title={stats.ready ? undefined : t('noReadyTasks')} onClick={act('start', 'startProject')}><Busy on={pending === 'start'} />{t('start')}</button>}
        {project.status === 'review' && <button className={css.primary} disabled={busy} onClick={act('accept', 'acceptProject')}><Busy on={pending === 'accept'} />{t('acceptProject')}</button>}
        {project.status === 'running' && <button disabled={busy} onClick={act('pause', 'pauseProject')}><Busy on={pending === 'pause'} />{t('pause')}</button>}
        {(project.status === 'running' || anyRunning) && <button className={css.ghostDanger} disabled={busy} onClick={act('stop', 'stopProject')}><Busy on={pending === 'stop'} />{t('stop')}</button>}
        <button className={project.status === 'completed' ? css.primary : css.ghost} disabled={busy} onClick={() => {
          void run('export', () => command('exportProject', { id: project.id })).then((ok) => { setExported(ok ? exportPath : '') })
        }}><Busy on={pending === 'export'} />{t('exportProject')}</button>
      </div>
    </div>
    {exported && <div className={css.success} role="status"><strong>{t('exported')}</strong><code>{exported}</code><button className={css.ghost} onClick={() => { setExported('') }}>{t('close')}</button></div>}
    {project.status === 'review' && <div className={css.notice} data-tone="review"><strong>{t('reviewReady')}</strong><p>{t('reviewReadyHelp')}</p></div>}
    <div className={css.summaryGrid}>
      <div className={css.summaryMain}>
        <h3>{t('objective')}</h3>
        <p className={css.objective}>{project.objective}</p>
        {project.acceptanceCriteria && <><h3>{t('acceptanceCriteria')}</h3><p className={css.criteria}>{project.acceptanceCriteria}</p></>}
      </div>
      <div className={css.summarySide}>
        <div className={css.progress}>
          <div className={css.progressHead}><span>{t('progress')}</span><strong>{t('taskSummary', { done: stats.completed, total: stats.active })}</strong></div>
          <div className={css.bar} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} aria-label={t('progress')}><span style={{ width: `${percent}%` }} /></div>
          <dl className={css.statList}>
            <div data-tone="running"><dt>{t('running')}</dt><dd>{stats.running}</dd></div>
            <div data-tone="waiting"><dt>{t('filter_waiting')}</dt><dd>{stats.ready + stats.blocked}</dd></div>
            <div data-tone="review"><dt>{t('awaitingReview')}</dt><dd>{stats.review}</dd></div>
            <div data-tone="attention"><dt>{t('filter_attention')}</dt><dd>{stats.attention}</dd></div>
          </dl>
        </div>
        <div className={css.teamStrip}>
          <span className={css.muted}>{t('team')}</span>
          <ul>{team.map(({ id, employee }) => <li key={id} title={`${employee?.name ?? ''}${employee?.role ? ` · ${employee.role}` : ''}`}><Avatar id={id} name={employee?.name} size="sm" /><span>{employee?.name ?? t('unknownEmployee')}</span></li>)}</ul>
        </div>
        <p className={css.metaLine}><span>{t(project.sessionMode === 'employee-project' ? 'employeeSession' : 'freshSession')}</span></p>
        <p className={`${css.metaLine} ${css.mono}`} title={project.cwd}>{project.cwd}</p>
      </div>
    </div>
  </section>
}
