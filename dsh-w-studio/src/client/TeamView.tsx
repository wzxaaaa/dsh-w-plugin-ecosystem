/** Company roster with search, bulk cleanup, team templates, and the selected employee's editor. */
import { useState } from 'react'
import { randomUUID } from '@deepseek-ai/dsh-util-crypto'
import type { Employee, StudioEmployeeId, StudioState } from '../types.ts'
import { hasHistory, redundantEmployees } from '../roster.ts'
import type { StudioView } from './controller.ts'
import { EmployeeEditor } from './EmployeeEditor.tsx'
import { Avatar, Busy, EngineTag } from './parts.tsx'
import { TemplatesView } from './TemplatesView.tsx'
import { usePending, type Command, type T } from './ui.ts'
import css from './Studio.module.css'

/** Roster data and actions supplied by the panel. */
export interface TeamViewProps {
  state: StudioState
  view: StudioView
  t: T
  command: Command
  checkHealth: () => Promise<void>
}

/** Employees are company-wide; projects choose from this roster. */
export function TeamView({ state, view, t, command, checkHealth }: TeamViewProps) {
  const [mode, setMode] = useState<'roster' | 'templates'>('roster')
  const [selected, setSelected] = useState<string | null>(null)
  const [draft, setDraft] = useState<Employee | null>(null)
  const [query, setQuery] = useState('')
  const [checking, setChecking] = useState(false)
  const [bulk, setBulk] = useState(false)
  const [picked, setPicked] = useState<string[]>([])
  const [confirmBulk, setConfirmBulk] = useState(false)
  const [bulkFailed, setBulkFailed] = useState(false)
  const { pending, run } = usePending()
  if (mode === 'templates') return <TemplatesView state={state} view={view} t={t} command={command} onDone={() => { setMode('roster') }} />
  const employee = draft ?? state.employees.find(value => value.id === selected) ?? state.employees[0]
  const needle = query.trim().toLowerCase()
  const shown = needle ? state.employees.filter(value => `${value.name} ${value.role} ${value.model} ${t(value.engine)}`.toLowerCase().includes(needle)) : state.employees
  const enabled = state.employees.filter(value => value.enabled).length
  const redundant = redundantEmployees(state)
  const chosen = picked.filter(id => state.employees.some(value => value.id === id))
  const addEmployee = (): void => {
    const id = randomUUID() as StudioEmployeeId
    setDraft({ id, name: t('newEmployee'), role: '', responsibilities: '', engine: 'codex', model: '', effort: '',
      permission: 'workspace-write', cwd: '', enabled: true, baseURL: '', apiKeyEnv: '', thinkingFormat: 'none', contextWindow: 262144, maxTokens: 32768 })
    setSelected(id)
  }
  const exitBulk = (): void => { setBulk(false); setPicked([]); setConfirmBulk(false); setBulkFailed(false) }
  return <div className={css.workArea}>
    <section className={css.listPane} aria-label={t('employees')}>
      <div className={css.paneHead}>
        <div><h2>{t('employees')}</h2><p className={css.muted}>{t('rosterSummary', { total: state.employees.length, enabled })}</p></div>
        <button className={css.primary} onClick={addEmployee} disabled={!!draft || bulk}>{t('addEmployee')}</button>
      </div>
      <div className={css.toolRow}>
        <input type="search" aria-label={t('searchEmployees')} placeholder={t('searchEmployees')} value={query} onChange={(event) => { setQuery(event.target.value) }} />
        <button onClick={() => { exitBulk(); setDraft(null); setMode('templates') }}>{t('templates')}</button>
      </div>
      <div className={css.healthRow}>
        <button className={css.ghost} disabled={checking} onClick={() => { setChecking(true); void checkHealth().finally(() => { setChecking(false) }) }}><Busy on={checking} />{t('health')}</button>
        {!bulk && <button className={css.ghost} disabled={!!draft || !state.employees.length} onClick={() => { setBulk(true) }}>{t('bulkManage')}{!!redundant.length && <span className={css.count}>{redundant.length}</span>}</button>}
        {view.health && (['codex', 'claude', 'harness'] as const).map(engine => <span key={engine} className={css.healthChip} title={view.health?.[engine].version} data-available={view.health?.[engine].available}>
          <i aria-hidden="true" />{t(engine)} · {t(view.health?.[engine].available ? 'available' : 'unavailable')}
        </span>)}
      </div>
      {bulk && <div className={css.bulkBar} role="region" aria-label={t('bulkManage')}>
        <p>{t('bulkHelp')}</p>
        <div className={css.actions}>
          <button className={css.ghost} disabled={!redundant.length} title={t('redundantHelp')} onClick={() => { setPicked(redundant.map(value => value.id)); setConfirmBulk(false) }}>{t('selectRedundant', { count: redundant.length })}</button>
          {confirmBulk
            ? <button className={css.dangerSolid} disabled={view.busy} onClick={() => {
              void run('bulk', () => command('deleteEmployees', { ids: chosen })).then((ok) => { setBulkFailed(!ok); if (ok) { exitBulk(); setSelected(null) } })
            }}><Busy on={pending === 'bulk'} />{t('confirmBulkDelete', { count: chosen.length })}</button>
            : <button className={css.ghostDanger} disabled={!chosen.length} onClick={() => { setConfirmBulk(true) }}>{t('deleteSelected', { count: chosen.length })}</button>}
          <button className={css.ghost} onClick={exitBulk}>{t('exitBulk')}</button>
        </div>
        {bulkFailed && <p className={css.inlineError} role="alert">{view.error || t('failure')}</p>}
      </div>}
      <ul className={css.roster}>
        {draft && <li><button className={css.rosterItem} aria-current="true" onClick={() => { setSelected(draft.id) }}>
          <Avatar id={draft.id} name={draft.name} /><span className={css.rosterText}><strong>{draft.name}</strong><small>{t('unsavedEmployee')}</small></span>
        </button></li>}
        {shown.map((value) => {
          const locked = bulk && hasHistory(state, value.id)
          const body = <>
            <Avatar id={value.id} name={value.name} />
            <span className={css.rosterText}>
              <strong>{value.name}{!value.enabled && <em className={css.offTag}>{t('disabled')}</em>}</strong>
              <small>{value.role || t('noRole')}{locked && ` · ${t('historyLocked')}`}</small>
            </span>
            <span className={css.rosterMeta}>
              <EngineTag engine={value.engine} t={t} />
              <small className={css.mono} title={value.model}>{value.model || t('nativeDefault')}{value.effort && ` · ${value.effort}`}</small>
            </span>
          </>
          return <li key={value.id}>{bulk
            ? <label className={css.rosterItem} data-disabled={!value.enabled} data-bulk="true" data-locked={locked}>
              <input type="checkbox" disabled={locked} checked={chosen.includes(value.id)} onChange={(event) => {
                setConfirmBulk(false)
                setPicked(event.target.checked ? [...chosen, value.id] : chosen.filter(id => id !== value.id))
              }} />{body}
            </label>
            : <button className={css.rosterItem} data-disabled={!value.enabled} aria-current={!draft && employee?.id === value.id ? 'true' : undefined}
              onClick={() => { setDraft(null); setSelected(value.id) }}>{body}</button>}</li>
        })}
      </ul>
      {!state.employees.length && !draft && <div className={css.emptyState}>
        <strong>{t('noEmployeesTitle')}</strong><p>{t('noEmployees')}</p>
        <button onClick={() => { setMode('templates') }}>{t('templates')}</button>
      </div>}
      {!!state.employees.length && !shown.length && <p className={css.emptyInline}>{t('noEmployeeMatch')}</p>}
      <p className={css.footnote}>{t('noReasoning')}</p>
    </section>
    <div className={css.detailPane}>
      {employee ? <EmployeeEditor key={employee.id} employee={employee} isNew={draft?.id === employee.id} catalog={view.catalog} busy={view.busy} error={view.error} t={t}
        save={async (value) => { const ok = await command('saveEmployee', value); if (ok) { setDraft(null); setSelected(value.id) } return ok }}
        remove={async (id) => {
          if (draft?.id === id) { setDraft(null); setSelected(null); return true }
          const ok = await command('deleteEmployee', { id })
          if (ok) setSelected(null)
          return ok
        }} /> : <div className={css.emptyState}><p>{t('selectEmployee')}</p></div>}
    </div>
  </div>
}
