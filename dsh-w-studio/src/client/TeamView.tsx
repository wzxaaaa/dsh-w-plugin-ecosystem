/** Company roster with search, engine identity, templates, and the selected employee's editor. */
import { useState } from 'react'
import { randomUUID } from '@deepseek-ai/dsh-util-crypto'
import type { Employee, StudioEmployeeId, StudioState } from '../types.ts'
import type { StudioView } from './controller.ts'
import { EmployeeEditor } from './EmployeeEditor.tsx'
import { Avatar, Busy, EngineTag } from './parts.tsx'
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
  const [selected, setSelected] = useState<string | null>(null)
  const [draft, setDraft] = useState<Employee | null>(null)
  const [query, setQuery] = useState('')
  const [checking, setChecking] = useState(false)
  const { pending, run } = usePending()
  const employee = draft ?? state.employees.find(value => value.id === selected) ?? state.employees[0]
  const needle = query.trim().toLowerCase()
  const shown = needle ? state.employees.filter(value => `${value.name} ${value.role} ${value.model} ${t(value.engine)}`.toLowerCase().includes(needle)) : state.employees
  const enabled = state.employees.filter(value => value.enabled).length
  const addEmployee = (): void => {
    const id = randomUUID() as StudioEmployeeId
    setDraft({ id, name: t('newEmployee'), role: '', responsibilities: '', engine: 'codex', model: '', effort: '',
      permission: 'workspace-write', cwd: '', enabled: true, baseURL: '', apiKeyEnv: '', thinkingFormat: 'none', contextWindow: 262144, maxTokens: 32768 })
    setSelected(id)
  }
  return <div className={css.workArea}>
    <section className={css.listPane} aria-label={t('employees')}>
      <div className={css.paneHead}>
        <div><h2>{t('employees')}</h2><p className={css.muted}>{t('rosterSummary', { total: state.employees.length, enabled })}</p></div>
        <button className={css.primary} onClick={addEmployee} disabled={!!draft}>{t('addEmployee')}</button>
      </div>
      <div className={css.toolRow}>
        <input type="search" aria-label={t('searchEmployees')} placeholder={t('searchEmployees')} value={query} onChange={(event) => { setQuery(event.target.value) }} />
        <details className={css.menu}>
          <summary>{t('templates')}</summary>
          <div className={css.menuBody}>
            {(['lean', 'full'] as const).map(kind => <button key={kind} disabled={view.busy} onClick={(event) => {
              (event.currentTarget.closest('details') as HTMLDetailsElement | null)?.removeAttribute('open')
              void run(kind, () => command('template', { kind }))
            }}><Busy on={pending === kind} /><strong>{t(kind)}</strong><small>{t(kind === 'lean' ? 'leanRoles' : 'fullRoles')}</small></button>)}
            <p className={css.muted}>{t('templateHelp')}</p>
          </div>
        </details>
      </div>
      <div className={css.healthRow}>
        <button className={css.ghost} disabled={checking} onClick={() => { setChecking(true); void checkHealth().finally(() => { setChecking(false) }) }}><Busy on={checking} />{t('health')}</button>
        {view.health && (['codex', 'claude', 'harness'] as const).map(engine => <span key={engine} className={css.healthChip} title={view.health?.[engine].version} data-available={view.health?.[engine].available}>
          <i aria-hidden="true" />{t(engine)} · {t(view.health?.[engine].available ? 'available' : 'unavailable')}
        </span>)}
      </div>
      <ul className={css.roster}>
        {draft && <li><button className={css.rosterItem} aria-current="true" onClick={() => { setSelected(draft.id) }}>
          <Avatar id={draft.id} name={draft.name} /><span className={css.rosterText}><strong>{draft.name}</strong><small>{t('unsavedEmployee')}</small></span>
        </button></li>}
        {shown.map(value => <li key={value.id}><button className={css.rosterItem} data-disabled={!value.enabled} aria-current={!draft && employee?.id === value.id ? 'true' : undefined}
          onClick={() => { setDraft(null); setSelected(value.id) }}>
          <Avatar id={value.id} name={value.name} />
          <span className={css.rosterText}>
            <strong>{value.name}{!value.enabled && <em className={css.offTag}>{t('disabled')}</em>}</strong>
            <small>{value.role || t('noRole')}</small>
          </span>
          <span className={css.rosterMeta}>
            <EngineTag engine={value.engine} t={t} />
            <small className={css.mono} title={value.model}>{value.model || t('nativeDefault')}{value.effort && ` · ${value.effort}`}</small>
          </span>
        </button></li>)}
      </ul>
      {!state.employees.length && !draft && <div className={css.emptyState}><strong>{t('noEmployeesTitle')}</strong><p>{t('noEmployees')}</p></div>}
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
