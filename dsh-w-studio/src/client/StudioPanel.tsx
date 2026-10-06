/** Studio workspace: company switcher, team roster, project work, and public handoffs. */
import { useState } from 'react'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type { StudioState, StudioWorkspace } from '../types.ts'
import type { StudioController } from './controller.ts'
import { HandoffTimeline } from './HandoffTimeline.tsx'
import { MeetingRoom } from './MeetingRoom.tsx'
import { Busy } from './parts.tsx'
import { ProjectBar } from './ProjectView.tsx'
import { ProjectDialog } from './ProjectDialog.tsx'
import { TaskBoard } from './TaskBoard.tsx'
import { TeamView } from './TeamView.tsx'
import { projectStats, usePending, type Command, type T } from './ui.ts'
import css from './Studio.module.css'

/** Callbacks and bare source privately owned by the plugin registration. */
export interface StudioInjected {
  hooks: { studio: StudioController }
  command: StudioController['command']
  refresh: StudioController['refresh']
  checkHealth: StudioController['checkHealth']
  pickDirectory: () => Promise<string | null>
}
/** Four-share props assembled by the slot renderer. */
export type StudioPanelProps = PropsRuntime<'main'> & InjectFace<StudioInjected> & PropsLocale<'wStudio'>
type Tab = 'employees' | 'tasks' | 'meetings' | 'messages'

/** A company workspace that renders public handoffs rather than native transcripts. */
export function StudioPanel({ useStudio, command, refresh, checkHealth, pickDirectory, t }: StudioPanelProps) {
  const view = useStudio(snapshot => snapshot)
  const state = view.state
  const [chosenTab, setTab] = useState<Tab | null>(null)
  const [projectId, setProjectId] = useState<string | null>(null)
  const [taskId, setTaskId] = useState<string | null>(null)
  const [workspaceForm, setWorkspaceForm] = useState(false)
  const [projectForm, setProjectForm] = useState(false)
  const workspace = state?.workspaces.find(value => value.id === state.activeWorkspaceId)
  const projects = state?.projects.filter(value => value.workspaceId === workspace?.id) ?? []
  const project = projects.find(value => value.id === projectId) ?? projects.at(-1)
  const tab: Tab = chosenTab ?? (projects.length ? 'tasks' : 'employees')
  const projectTasks = state && project ? state.tasks.filter(task => task.projectId === project.id) : []
  const stats = projectStats(projectTasks)
  const handoffCount = state && project ? state.messages.filter(value => value.projectId === project.id).length : 0
  const openMeetings = state?.meetings.filter(value => value.workspaceId === workspace?.id && value.status !== 'closed').length ?? 0
  const counts: Record<Tab, string> = { employees: String(state?.employees.length ?? 0), tasks: projectTasks.length ? `${stats.completed}/${stats.active}` : '0', meetings: String(openMeetings), messages: String(handoffCount) }
  return <main className={css.studio}>
    <header className={css.topbar}>
      <div className={css.brand}>
        <h1>{t('title')}</h1>
        <p>{t('subtitle')}</p>
      </div>
      {state && <WorkspaceSwitcher state={state} workspace={workspace} busy={view.busy} t={t} command={command} formOpen={workspaceForm || !workspace}
        onToggleForm={() => { setWorkspaceForm(value => !value) }} onChanged={() => { setProjectId(null); setTaskId(null) }} />}
    </header>
    {state && (workspaceForm || !workspace) && <WorkspaceForm t={t} busy={view.busy} error={view.error} command={command} pickDirectory={pickDirectory} first={!state.workspaces.length}
      onDone={() => { setWorkspaceForm(false); setProjectId(null); setTaskId(null) }} onCancel={workspace ? () => { setWorkspaceForm(false) } : undefined} />}
    <nav className={css.tabs} aria-label={t('title')}>
      <div className={css.tabList}>
        {(['tasks', 'meetings', 'employees', 'messages'] as const).map(name => <button key={name} className={css.tab} aria-current={tab === name ? 'page' : undefined} onClick={() => { setTab(name) }}>
          {t(name === 'tasks' ? 'projectsTab' : name === 'meetings' ? 'meetingsTab' : name)}<span className={css.count}>{counts[name]}</span>
        </button>)}
      </div>
      {workspace && <button className={css.primary} aria-label={t('newProject')} onClick={() => { setProjectForm(true) }}><span aria-hidden="true">+</span><span className={css.wideLabel}>{t('newProject')}</span></button>}
    </nav>
    {view.error && <div className={css.banner} role="alert"><span>{view.error}</span><button className={css.ghost} onClick={() => { void refresh() }}>{t('refresh')}</button></div>}
    {!state ? <div className={css.emptyState}>{view.error ? <p>{t('connectionError')}</p> : <p><span className={css.spinner} aria-hidden="true" /> {t('checking')}</p>}</div>
      : tab === 'employees' ? <TeamView state={state} view={view} t={t} command={command} checkHealth={checkHealth} />
        : !workspace ? <div className={css.emptyState}><strong>{t('workspaceFirst')}</strong><p>{t('workspaceHelp')}</p></div>
          : tab === 'meetings' ? <MeetingRoom key={`meetings-${workspace.id}`} state={state} workspace={workspace} busy={view.busy} error={view.error} t={t} command={command}
            onOpenProject={(id) => { setProjectId(id); setTaskId(null); setTab('tasks') }} />
          : !project ? <div className={css.emptyState}>
            <strong>{t('noProjectsTitle')}</strong><p>{t('noProjects')}</p>
            <button className={css.primary} onClick={() => { setProjectForm(true) }}>{t('newProject')}</button>
          </div>
            : <>
              <ProjectBar key={`bar-${project.id}`} state={state} projects={projects} project={project} busy={view.busy} t={t} command={command} onSelect={(id) => { setProjectId(id); setTaskId(null) }} />
              {tab === 'tasks'
                ? <TaskBoard key={`tasks-${project.id}`} state={state} progress={view.progress} project={project} busy={view.busy} error={view.error} t={t} command={command} selected={taskId} onSelect={setTaskId} />
                : <HandoffTimeline key={`handoffs-${project.id}`} state={state} project={project} busy={view.busy} error={view.error} t={t} command={command} onOpenTask={(id) => { setTaskId(id); setTab('tasks') }} />}
            </>}
    {state && workspace && <ProjectDialog open={projectForm} state={state} workspace={workspace} busy={view.busy} error={view.error} t={t} command={command}
      onClose={() => { setProjectForm(false) }} onCreated={() => { setProjectForm(false); setProjectId(null); setTaskId(null); setTab('tasks') }} />}
  </main>
}

interface WorkspaceSwitcherProps {
  state: StudioState
  workspace: StudioWorkspace | undefined
  busy: boolean
  t: T
  command: Command
  formOpen: boolean
  onToggleForm: () => void
  onChanged: () => void
}
/** Current company workspace with its shared directory always visible. */
function WorkspaceSwitcher({ state, workspace, busy, t, command, formOpen, onToggleForm, onChanged }: WorkspaceSwitcherProps) {
  return <div className={css.workspace}>
    <label className={css.workspacePicker}>
      <span>{t('companyWorkspace')}</span>
      <select aria-label={t('companyWorkspace')} value={workspace?.id ?? ''} disabled={busy || !state.workspaces.length} onChange={(event) => { void command('selectWorkspace', { id: event.target.value }); onChanged() }}>
        {!workspace && <option value="">{t('workspaceFirst')}</option>}
        {state.workspaces.map(value => <option key={value.id} value={value.id}>{value.name}</option>)}
      </select>
      {workspace && <small className={css.mono} title={workspace.path}>{workspace.path}</small>}
    </label>
    {!!state.workspaces.length && <button className={css.ghost} aria-expanded={formOpen} onClick={onToggleForm}>{t('addWorkspace')}</button>}
  </div>
}

interface WorkspaceFormProps {
  t: T
  busy: boolean
  error: string
  first: boolean
  command: Command
  pickDirectory: () => Promise<string | null>
  onDone: () => void
  onCancel: (() => void) | undefined
}
/** Register an existing directory as a company workspace using DSH's directory picker. */
function WorkspaceForm({ t, busy, error, first, command, pickDirectory, onDone, onCancel }: WorkspaceFormProps) {
  const [draft, setDraft] = useState({ name: '', path: '' })
  const [pickError, setPickError] = useState('')
  const [failed, setFailed] = useState(false)
  const { pending, run } = usePending()
  return <section className={css.workspaceForm} aria-label={t('addWorkspace')}>
    <div>
      <h2>{t(first ? 'welcomeTitle' : 'addWorkspace')}</h2>
      <p className={css.muted}>{t('workspaceHelp')}</p>
    </div>
    <form onSubmit={(event) => {
      event.preventDefault()
      void run('create', () => command('createWorkspace', draft)).then((ok) => {
        setFailed(!ok)
        if (ok) { setDraft({ name: '', path: '' }); onDone() }
      })
    }}>
      <div className={css.fieldPair}>
        <label className={css.field}><span>{t('companyName')}</span><input required value={draft.name} onChange={(event) => { setDraft({ ...draft, name: event.target.value }) }} /></label>
        <label className={css.field}><span>{t('companyDirectory')}</span>
          <span className={css.inputWithButton}>
            <input required className={css.mono} value={draft.path} onChange={(event) => { setDraft({ ...draft, path: event.target.value }) }} />
            <button type="button" onClick={() => {
              setPickError('')
              void pickDirectory().then((path) => { if (path) setDraft(value => ({ ...value, path })) })
                .catch((caught: unknown) => { setPickError(caught instanceof Error ? caught.message : t('failure')) })
            }}>{t('browseDirectory')}</button>
          </span>
        </label>
      </div>
      {(pickError || failed) && <p className={css.formStatus} data-state="error" role="alert">{pickError || error || t('failure')}</p>}
      <div className={css.actions}>
        <button className={css.primary} disabled={busy}><Busy on={pending === 'create'} />{t('useWorkspace')}</button>
        {onCancel && <button type="button" className={css.ghost} onClick={onCancel}>{t('cancelAction')}</button>}
      </div>
    </form>
  </section>
}
