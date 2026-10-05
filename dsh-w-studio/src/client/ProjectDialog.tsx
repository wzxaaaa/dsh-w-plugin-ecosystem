/** Modal project intake: goal, acceptance, directory, session mode, and participating employees. */
import { useEffect, useId, useRef, useState } from 'react'
import type { StudioState, StudioWorkspace } from '../types.ts'
import { Avatar, Busy, EngineTag } from './parts.tsx'
import { usePending, type Command, type T } from './ui.ts'
import css from './Studio.module.css'

/** Intake target and completion callbacks. */
export interface ProjectDialogProps {
  open: boolean
  state: StudioState
  workspace: StudioWorkspace
  busy: boolean
  error: string
  t: T
  command: Command
  onClose: () => void
  onCreated: () => void
}
const empty = { name: '', cwd: '', objective: '', acceptanceCriteria: '', sessionMode: 'employee-project' as 'employee-project' | 'new-task', employeeIds: null as string[] | null }

/** Native modal dialog: Escape closes it and focus stays inside while open; the draft survives closing. */
export function ProjectDialog({ open, state, workspace, busy, error, t, command, onClose, onCreated }: ProjectDialogProps) {
  const dialog = useRef<HTMLDialogElement>(null)
  const id = useId()
  const [draft, setDraft] = useState(empty)
  const [failed, setFailed] = useState(false)
  const { pending, run } = usePending()
  useEffect(() => {
    const node = dialog.current
    if (!node) return
    if (open && !node.open) node.showModal()
    if (!open && node.open) node.close()
  }, [open])
  const enabled = state.employees.filter(employee => employee.enabled)
  const chosen = draft.employeeIds ?? enabled.map(employee => employee.id)
  const team = enabled.filter(employee => chosen.includes(employee.id))
  return <dialog ref={dialog} className={css.dialog} aria-labelledby={`${id}-title`} onClose={onClose}>
    <form method="dialog" className={css.dialogForm} onSubmit={(event) => {
      event.preventDefault()
      void run('create', () => command('createProject', { ...draft, workspaceId: workspace.id, employeeIds: team.map(employee => employee.id) })).then((ok) => {
        setFailed(!ok)
        if (ok) { setDraft(empty); onCreated() }
      })
    }}>
      <header className={css.dialogHead}>
        <div><h2 id={`${id}-title`}>{t('projectSettings')}</h2><p className={css.muted}>{t('projectIn', { name: workspace.name })}</p></div>
        <button type="button" className={css.iconButton} aria-label={t('close')} onClick={onClose}>×</button>
      </header>
      <div className={css.dialogBody}>
        <label className={css.field}><span>{t('projectName')}</span><input required value={draft.name} onChange={(event) => { setDraft({ ...draft, name: event.target.value }) }} /></label>
        <label className={css.field}><span>{t('objective')}</span><textarea required rows={3} placeholder={t('objectivePlaceholder')} value={draft.objective} onChange={(event) => { setDraft({ ...draft, objective: event.target.value }) }} /></label>
        <label className={css.field}><span>{t('acceptanceCriteria')}</span><textarea rows={3} placeholder={t('criteriaPlaceholder')} value={draft.acceptanceCriteria} onChange={(event) => { setDraft({ ...draft, acceptanceCriteria: event.target.value }) }} /></label>
        <label className={css.field}><span>{t('projectDirectory')}</span><input className={css.mono} placeholder={workspace.path} value={draft.cwd} onChange={(event) => { setDraft({ ...draft, cwd: event.target.value }) }} />
          <small className={css.muted}>{t('projectDirectoryHelp')}</small></label>
        <fieldset className={css.optionCards}>
          <legend>{t('sessionMode')}</legend>
          {(['employee-project', 'new-task'] as const).map(mode => <label key={mode}>
            <input type="radio" name={`${id}-session`} checked={draft.sessionMode === mode} onChange={() => { setDraft({ ...draft, sessionMode: mode }) }} />
            <span><strong>{t(mode === 'employee-project' ? 'employeeSession' : 'freshSession')}</strong><small>{t(mode === 'employee-project' ? 'employeeSessionHelp' : 'freshSessionHelp')}</small></span>
          </label>)}
        </fieldset>
        <fieldset className={css.teamPicker}>
          <legend>{t('selectTeam')} <small>· {t('selectedCount', { count: team.length })}</small></legend>
          {enabled.map(employee => {
            const order = team.findIndex(value => value.id === employee.id)
            return <label key={employee.id} data-checked={order >= 0}>
              <input type="checkbox" checked={order >= 0} onChange={(event) => {
                setDraft({ ...draft, employeeIds: event.target.checked ? [...chosen, employee.id] : chosen.filter(value => value !== employee.id) })
              }} />
              <span className={css.order}>{order >= 0 ? order + 1 : ''}</span>
              <Avatar id={employee.id} name={employee.name} size="sm" />
              <span className={css.rosterText}><strong>{employee.name}</strong><small>{employee.role || t('noRole')}</small></span>
              <EngineTag engine={employee.engine} t={t} />
            </label>
          })}
          {!enabled.length && <p className={css.inlineError}>{t('noEnabledEmployees')}</p>}
        </fieldset>
        <p className={css.hint}>{t('roleTask')} {t('nativeSessionHelp')}</p>
      </div>
      <footer className={css.dialogFoot}>
        {failed && <p className={css.formStatus} data-state="error" role="alert">{error || t('failure')}</p>}
        <button type="button" className={css.ghost} onClick={onClose}>{t('cancelAction')}</button>
        <button type="submit" className={css.primary} disabled={busy || !team.length}><Busy on={pending === 'create'} />{t('createProject')}</button>
      </footer>
    </form>
  </dialog>
}
