/** Studio workspace: roster, tasks, project intake, and public employee messages. */
import { useState } from 'react'
import { randomUUID } from '@deepseek-ai/dsh-util-crypto'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type { Employee, StudioEmployeeId } from '../types.ts'
import type { StudioController } from './controller.ts'
import { EmployeeEditor } from './EmployeeEditor.tsx'
import { TaskBoard } from './TaskBoard.tsx'
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

/** A company workspace that renders public handoffs rather than native transcripts. */
export function StudioPanel({ useStudio, command, refresh, checkHealth, pickDirectory, t }: StudioPanelProps) {
  const view = useStudio(snapshot => snapshot)
  const state = view.state
  const [tab, setTab] = useState<'employees' | 'tasks' | 'messages'>('employees')
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null)
  const [newEmployee, setNewEmployee] = useState<Employee | null>(null)
  const [projectId, setProjectId] = useState<string | null>(null)
  const [projectDraft, setProjectDraft] = useState({ name: '', cwd: '', objective: '', employeeIds: null as string[] | null })
  const [projectForm, setProjectForm] = useState(false)
  const [message, setMessage] = useState('')
  const [recipient, setRecipient] = useState('team')
  const [workspaceDraft, setWorkspaceDraft] = useState({ name: '', path: '' })
  const [workspaceError, setWorkspaceError] = useState('')
  const [workspaceForm, setWorkspaceForm] = useState(false)
  const [acceptanceCriteria, setAcceptanceCriteria] = useState('')
  const [sessionMode, setSessionMode] = useState<'employee-project' | 'new-task'>('employee-project')
  const workspace = state?.workspaces.find(value => value.id === state.activeWorkspaceId)
  const projects = state?.projects.filter(value => value.workspaceId === workspace?.id) ?? []
  const employee = newEmployee ?? state?.employees.find(value => value.id === selectedEmployee) ?? state?.employees[0]
  const project = projects.find(value => value.id === projectId) ?? projects.at(-1)
  const draftEmployee = (): void => {
    const id = randomUUID() as StudioEmployeeId
    setNewEmployee({ id, name: t('newEmployee'), role: '', responsibilities: '', engine: 'codex', model: '', effort: '',
      permission: 'workspace-write', cwd: '', enabled: true, baseURL: '', apiKeyEnv: '', thinkingFormat: 'none', contextWindow: 262144, maxTokens: 32768 })
    setSelectedEmployee(id)
  }
  return <main className={css.studio}>
    <header className={css.header}>
      <div><h1>{t('title')}</h1><p>{t('subtitle')}</p></div>
      <div className={css.actions}>{(['lean', 'full'] as const).map(kind => <button disabled={view.busy} key={kind} onClick={() => { void command('template', { kind }) }}>{t(kind)}</button>)}</div>
    </header>
    <nav className={css.tabs} aria-label={t('title')}>{(['employees', 'tasks', 'messages'] as const).map(name => <button key={name} className={tab === name ? css.activeTab : ''} aria-current={tab === name ? 'page' : undefined} onClick={() =>{  setTab(name) }}>{t(name)}</button>)}</nav>
    {view.error && <div className={css.error} role="alert">{view.error}<button onClick={() => { void refresh() }}>{t('refresh')}</button></div>}
    {state ? <>
      <section className={css.projectIntake}>
        <div className={css.projectToolbar}><label>{t('companyWorkspace')}<select aria-label={t('companyWorkspace')} value={workspace?.id ?? ''} onChange={(event) => { void command('selectWorkspace', { id: event.target.value }); setProjectId(null) }}>
          {!workspace && <option value="">{t('workspaceFirst')}</option>}
          {state.workspaces.map(value => <option key={value.id} value={value.id}>{value.name} · {value.path}</option>)}
        </select></label><button onClick={() => { setWorkspaceForm(value => !value) }}>{t('addWorkspace')}</button></div>
        <p className={css.hint}>{t('workspaceHelp')}</p>
        {(workspaceForm || !workspace) && <form onSubmit={(event) => { event.preventDefault(); void command('createWorkspace', workspaceDraft).then((ok) => { if (ok) { setWorkspaceForm(false); setWorkspaceDraft({ name: '', path: '' }); setProjectId(null) } }) }}>
          <div className={css.intakeFields}><label>{t('companyName')}<input required value={workspaceDraft.name} onChange={(event) => { setWorkspaceDraft({ ...workspaceDraft, name: event.target.value }) }} /></label>
            <label>{t('companyDirectory')}<input required value={workspaceDraft.path} onChange={(event) => { setWorkspaceDraft({ ...workspaceDraft, path: event.target.value }) }} /></label></div>
          <div className={css.actions}><button type="button" onClick={() => { void pickDirectory().then((path) => { if (path) setWorkspaceDraft(value => ({ ...value, path })); setWorkspaceError('') }).catch((error: unknown) => { setWorkspaceError(error instanceof Error ? error.message : t('failure')) }) }}>{t('browseDirectory')}</button><button className={css.primary} disabled={view.busy}>{t('useWorkspace')}</button></div>
          {workspaceError && <p className={css.error} role="alert">{workspaceError}</p>}
        </form>}
      </section>
      {tab === 'employees' && <div className={css.split}>
        <section className={css.list}>
          <div className={css.sectionHeading}><button className={css.primary} onClick={draftEmployee}>{t('addEmployee')}</button><button onClick={() => { void checkHealth() }}>{t('health')}</button></div>
          {view.health && <div className={css.health}>{(['codex', 'claude', 'harness'] as const).map(engine => <span key={engine} title={view.health?.[engine].version} data-available={view.health?.[engine].available}>{t(engine)} · {t(view.health?.[engine].available ? 'available' : 'unavailable')}</span>)}</div>}
          <div className={css.tableHead}><span>{t('name')}</span><span>{t('role')}</span><span>{t('model')}</span><span>{t('edit')}</span></div>
          {state.employees.map((value, index) => <div className={`${css.employeeRow} ${employee?.id === value.id ? css.selectedRow : ''}`} key={value.id}>
            <div className={css.employeeName}>
              <span className={css.avatar} data-color={index % 4}>{value.name.slice(0, 1)}</span><strong>{value.name}</strong>
            </div>
            <span>{value.role}</span><span className={css.engineName}>{t(value.engine)}<small>{value.model || t('nativeDefault')}</small></span>
            <button onClick={() => { setNewEmployee(null); setSelectedEmployee(value.id) }} disabled={view.busy}>{t('edit')}</button>
          </div>)}
          {!state.employees.length && <p className={css.empty}>{t('noEmployees')}</p>}
          <p className={css.privacy}>{t('noReasoning')}</p>
        </section>
        {employee && <EmployeeEditor key={employee.id} employee={employee} catalog={view.catalog} busy={view.busy} t={t}
          save={async (value) => { const ok = await command('saveEmployee', value); if (ok) { setNewEmployee(null); setSelectedEmployee(value.id) } return ok }}
          remove={async (id) => { if (newEmployee?.id === id) { setNewEmployee(null); setSelectedEmployee(null); return true } return command('deleteEmployee', { id }) }} />}
      </div>}
      {tab !== 'employees' && <>
        <div className={css.projectToolbar}><label>{t('project')}<select aria-label={t('project')} value={project?.id ?? ''} onChange={(event) =>{  setProjectId(event.target.value) }}>
          {!projects.length && <option value="">{t('selectProject')}</option>}
          {projects.map(value => <option key={value.id} value={value.id}>{value.name} · {t(value.status)}</option>)}
        </select></label><div className={css.actions}>
          {project && <>{project.status === 'paused' && <button className={css.primary} disabled={view.busy} onClick={() => { void command('startProject', { id: project.id }) }}>{t('start')}</button>}
            {project.status === 'review' && <button className={css.primary} disabled={view.busy} onClick={() => { void command('acceptProject', { id: project.id }) }}>{t('acceptProject')}</button>}
            <button disabled={view.busy} onClick={() => { void command('exportProject', { id: project.id }) }}>{t('exportProject')}</button>
            {project.status === 'running' && <button disabled={view.busy} onClick={() => { void command('pauseProject', { id: project.id }) }}>{t('pause')}</button>}
            <button className={css.danger} disabled={view.busy} onClick={() => { void command('stopProject', { id: project.id }) }}>{t('stop')}</button></>}
          <button onClick={() =>{  setProjectForm(value => !value) }}>{t('createProject')}</button>
        </div></div>
        {project ? tab === 'tasks' ? <TaskBoard key={project.id} state={state} project={project} busy={view.busy} t={t} command={command} /> : <section className={css.messages}>
          <h2>{t('messages')}</h2><p className={css.hint}>{t('noReasoning')}</p>
          {state.messages.filter(value => value.projectId === project.id).map(value => <article key={value.id} className={css.messageRow}>
            <div><strong>{value.from === 'user' ? t('user') : state.employees.find(employee => employee.id === value.from)?.name}</strong><span>{t('handoffTo')} {value.to === 'team' ? t('everyone') : state.employees.find(employee => employee.id === value.to)?.name}</span><time>{new Date(value.createdAt).toLocaleString()}</time></div>
            <pre className={css.report}>{value.message}</pre>
          </article>)}
          {!state.messages.some(value => value.projectId === project.id) && <p className={css.empty}>{t('noMessages')}</p>}
          <form className={css.messageForm} onSubmit={(event) => { event.preventDefault(); void command('message', { projectId: project.id, to: recipient, message }).then((ok) => { if (ok) setMessage('') }) }}>
            <label>{t('to')}<select value={recipient} onChange={(event) =>{  setRecipient(event.target.value) }}><option value="team">{t('everyone')}</option>{state.employees.map(employee => <option key={employee.id} value={employee.id}>{employee.name}</option>)}</select></label>
            <textarea aria-label={t('message')} placeholder={t('message')} required rows={3} value={message} onChange={(event) =>{  setMessage(event.target.value) }} />
            <button className={css.primary} disabled={view.busy}>{t('send')}</button>
          </form>
        </section> : <p className={css.empty}>{t('noProjects')}</p>}
      </>}
      {workspace && (tab === 'employees' || projectForm || !projects.length) && <section className={css.projectIntake}>
        <h2>{t('projectSettings')}</h2>
        <form onSubmit={(event) => {
          event.preventDefault()
          const employeeIds = projectDraft.employeeIds ?? state.employees.filter(employee => employee.enabled).map(employee => employee.id)
          void command('createProject', { ...projectDraft, workspaceId: workspace.id, acceptanceCriteria, sessionMode, employeeIds }).then((ok) => { if (ok) { setTab('tasks'); setProjectForm(false); setProjectId(null) } })
        }}>
          <div className={css.intakeFields}><label>{t('projectName')}<input required value={projectDraft.name} onChange={(event) =>{  setProjectDraft({ ...projectDraft, name: event.target.value }) }} /></label>
            <label>{t('projectDirectory')}<input placeholder={workspace.path} value={projectDraft.cwd} onChange={(event) =>{  setProjectDraft({ ...projectDraft, cwd: event.target.value }) }} /></label></div>
          <label className={css.stackedField}>{t('acceptanceCriteria')}<textarea rows={3} value={acceptanceCriteria} onChange={(event) => { setAcceptanceCriteria(event.target.value) }} /></label>
          <label className={css.stackedField}>{t('sessionMode')}<select aria-label={t('sessionMode')} value={sessionMode} onChange={(event) => { setSessionMode(event.target.value as typeof sessionMode) }}><option value="employee-project">{t('employeeSession')}</option><option value="new-task">{t('freshSession')}</option></select></label>
          <p className={css.hint}>{t('nativeSessionHelp')}</p>
          <fieldset className={css.teamSelection}><legend>{t('selectTeam')}</legend>{state.employees.filter(employee => employee.enabled).map(employee => <label key={employee.id} className={css.check}>
            <input type="checkbox" checked={projectDraft.employeeIds === null || projectDraft.employeeIds.includes(employee.id)} onChange={(event) => {
              const current = projectDraft.employeeIds ?? state.employees.filter(value => value.enabled).map(value => value.id)
              setProjectDraft({ ...projectDraft, employeeIds: event.target.checked
                ? [...current, employee.id] : current.filter(id => id !== employee.id) })
            }} />{employee.name}
          </label>)}</fieldset>
          <div className={css.objectiveRow}><label>{t('objective')}<textarea required placeholder={t('objectivePlaceholder')} rows={2} value={projectDraft.objective} onChange={(event) =>{  setProjectDraft({ ...projectDraft, objective: event.target.value }) }} /></label>
            <button className={css.primary} disabled={view.busy || !state.employees.some(employee => employee.enabled)}>{t('createProject')}</button></div>
          <p className={css.hint}>{t('roleTask')}</p>
        </form>
      </section>}
    </> : <p className={css.empty}>{t(view.error ? 'connectionError' : 'checking')}</p>}
  </main>
}
