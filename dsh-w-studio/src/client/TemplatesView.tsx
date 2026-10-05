/** Editable team templates. Applying one replaces the roster after a previewed confirmation. */
import { useState } from 'react'
import { randomUUID } from '@deepseek-ai/dsh-util-crypto'
import type { Employee, StudioEmployeeId, StudioState, StudioTemplateId, TeamTemplate, TemplateMember } from '../types.ts'
import { planTemplate, toMember } from '../roster.ts'
import type { StudioView } from './controller.ts'
import { EmployeeEditor } from './EmployeeEditor.tsx'
import { Avatar, Busy, EngineTag } from './parts.tsx'
import { usePending, type Command, type T } from './ui.ts'
import css from './Studio.module.css'

/** Templates plus the actions that change them or the roster. */
export interface TemplatesViewProps {
  state: StudioState
  view: StudioView
  t: T
  command: Command
  /** Return to the roster, e.g. after applying a template. */
  onDone: () => void
}

/** Template list beside the selected template's editor. */
export function TemplatesView({ state, view, t, command, onDone }: TemplatesViewProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [draft, setDraft] = useState<TeamTemplate | null>(null)
  const template = draft ?? state.templates.find(value => value.id === selected) ?? state.templates[0]
  const create = (members: TemplateMember[], name: string): void => {
    const id = randomUUID() as StudioTemplateId
    setDraft({ id, name, description: '', members, createdAt: '' })
    setSelected(id)
  }
  const blank = (): TemplateMember => toMember({ id: '' as StudioEmployeeId, name: t('newMember'), role: '', responsibilities: '', engine: 'codex', model: '', effort: '',
    permission: 'workspace-write', cwd: '', enabled: true, baseURL: '', apiKeyEnv: '', thinkingFormat: 'none', contextWindow: 262144, maxTokens: 32768 })
  return <div className={css.workArea}>
    <section className={css.listPane} aria-label={t('templates')}>
      <div className={css.paneHead}>
        <div><h2>{t('templates')}</h2><p className={css.muted}>{t('templatesHelp')}</p></div>
        <button className={css.ghost} onClick={onDone}>{t('backToRoster')}</button>
      </div>
      <div className={css.actions}>
        <button className={css.primary} disabled={!!draft} onClick={() => { create([blank()], t('newTemplate')) }}>{t('newTemplate')}</button>
        <button disabled={!!draft || !state.employees.some(employee => employee.enabled)} onClick={() => {
          create(state.employees.filter(employee => employee.enabled).map(toMember), t('myTeam'))
        }}>{t('saveTeamAsTemplate')}</button>
      </div>
      <ul className={css.roster} style={{ marginTop: 12 }}>
        {draft && <li><button className={css.meetingItem} aria-current="true">
          <span className={css.meetingItemHead}><strong>{draft.name}</strong><span className={css.badge}>{t('unsavedTemplate')}</span></span>
          <small>{t('memberCount', { count: draft.members.length })}</small>
        </button></li>}
        {state.templates.map(value => <li key={value.id}><button className={css.meetingItem} aria-current={!draft && template?.id === value.id ? 'true' : undefined}
          onClick={() => { setDraft(null); setSelected(value.id) }}>
          <span className={css.meetingItemHead}><strong>{value.name}</strong><small>{t('memberCount', { count: value.members.length })}</small></span>
          <span className={css.avatarStack}>{value.members.slice(0, 10).map((member, index) => <Avatar key={index} id={`${value.id}-${index}`} name={member.name} size="sm" />)}</span>
          {value.description && <small>{value.description}</small>}
        </button></li>)}
      </ul>
      {!state.templates.length && !draft && <div className={css.emptyState}><p>{t('noTemplates')}</p></div>}
    </section>
    <div className={css.detailPane}>
      {template ? <TemplateEditor key={template.id} template={template} isNew={draft?.id === template.id} state={state} view={view} t={t} command={command} blank={blank}
        onSaved={() => { setDraft(null) }} onDiscard={() => { setDraft(null); setSelected(null) }} onApplied={onDone} />
        : <div className={css.emptyState}><p>{t('selectTemplate')}</p></div>}
    </div>
  </div>
}

interface TemplateEditorProps {
  template: TeamTemplate
  isNew: boolean
  state: StudioState
  view: StudioView
  t: T
  command: Command
  blank: () => TemplateMember
  onSaved: () => void
  onDiscard: () => void
  onApplied: () => void
}
/** Name, description, ordered members (edited with the employee editor), save, delete, and apply. */
function TemplateEditor({ template, isNew, state, view, t, command, blank, onSaved, onDiscard, onApplied }: TemplateEditorProps) {
  const [draft, setDraft] = useState(template)
  const [editing, setEditing] = useState<number | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [applying, setApplying] = useState(false)
  const [outcome, setOutcome] = useState<'idle' | 'saved' | 'failed'>('idle')
  const { pending, run } = usePending()
  // createdAt is assigned by the Host on first save and is not user-editable.
  const dirty = isNew || JSON.stringify({ ...draft, createdAt: '' }) !== JSON.stringify({ ...template, createdAt: '' })
  const update = (patch: Partial<TeamTemplate>): void => { setOutcome('idle'); setDraft({ ...draft, ...patch }) }
  const move = (index: number, offset: number): void => {
    const members = [...draft.members]
    const [member] = members.splice(index, 1)
    if (member) members.splice(index + offset, 0, member)
    update({ members })
    setEditing(null)
  }
  const asEmployee = (member: TemplateMember, index: number): Employee => ({ ...member, id: `${draft.id}-member-${index}` as StudioEmployeeId, cwd: '', enabled: true })
  const valid = !!draft.name.trim() && draft.members.length > 0 && draft.members.every(member => member.name.trim() && member.role.trim())
  const plan = applying ? planTemplate(state, template) : null
  return <div className={css.editorCard}>
    <header className={css.detailHead}><div>
      <h2>{draft.name || t('newTemplate')}</h2>
      <p className={css.muted}>{t('memberCount', { count: draft.members.length })}{isNew && ` · ${t('unsavedTemplate')}`}</p>
    </div></header>
    <div className={css.fieldPair}>
      <label className={css.field}><span>{t('templateName')}</span><input required value={draft.name} onChange={(event) => { update({ name: event.target.value }) }} /></label>
      <label className={css.field}><span>{t('templateDescription')}</span><input value={draft.description} onChange={(event) => { update({ description: event.target.value }) }} /></label>
    </div>

    <fieldset className={css.minutesTasks}>
      <legend>{t('templateMembers')}</legend>
      {draft.members.map((member, index) => <div key={index} className={css.memberRow} aria-current={editing === index ? 'true' : undefined}>
        <span className={css.step}>{index + 1}</span>
        <button type="button" className={css.memberMain} onClick={() => { setEditing(editing === index ? null : index) }} aria-expanded={editing === index}>
          <Avatar id={`${draft.id}-${index}`} name={member.name} size="sm" />
          <span className={css.rosterText}><strong>{member.name || t('newMember')}</strong><small>{member.role || t('noRole')}</small></span>
          <span className={css.rosterMeta}><EngineTag engine={member.engine} t={t} /><small className={css.mono}>{member.model || t('nativeDefault')}{member.effort && ` · ${member.effort}`}</small></span>
        </button>
        <span className={css.minutesTaskActions}>
          <button type="button" className={css.ghost} aria-label={t('moveUp')} disabled={index === 0} onClick={() => { move(index, -1) }}>↑</button>
          <button type="button" className={css.ghost} aria-label={t('moveDown')} disabled={index === draft.members.length - 1} onClick={() => { move(index, 1) }}>↓</button>
        </span>
      </div>)}
      {editing !== null && draft.members[editing] && <div className={css.memberEditor}>
        <EmployeeEditor key={`${draft.id}-${editing}-${draft.members.length}`} variant="member" employee={asEmployee(draft.members[editing], editing)} catalog={view.catalog}
          busy={false} isNew={false} error="" t={t}
          save={(employee) => {
            if (!employee.name.trim() || !employee.role.trim()) return Promise.resolve(false)
            update({ members: draft.members.map((value, position) => position === editing ? toMember(employee) : value) })
            return Promise.resolve(true)
          }}
          remove={() => {
            update({ members: draft.members.filter((_, position) => position !== editing) })
            setEditing(null)
            return Promise.resolve(true)
          }} />
      </div>}
      <button type="button" className={css.ghost} onClick={() => { update({ members: [...draft.members, blank()] }); setEditing(draft.members.length) }}>+ {t('addMember')}</button>
    </fieldset>

    {plan && <section className={css.applyPlan} aria-label={t('applyTitle')}>
      <h3>{t('applyTitle')} · {template.name}</h3>
      {!plan.add.length && !plan.remove.length && !plan.disable.length
        ? <p className={css.muted}>{t('applyNoChange')}</p>
        : <dl className={css.facts}>
          {([['applyKeep', plan.keep.map(value => value.name)], ['applyAdd', plan.add.map(value => value.name)],
            ['applyRemove', plan.remove.map(value => value.name)], ['applyDisable', plan.disable.map(value => value.name)]] as const)
            .filter(([, names]) => names.length).map(([key, names]) => <div key={key} className={css.planRow} data-kind={key}>
              <dt>{t(key)} · {names.length}</dt><dd>{names.join('、')}</dd>
            </div>)}
        </dl>}
      <div className={css.actions}>
        <button className={plan.remove.length ? css.dangerSolid : css.primary} disabled={view.busy} onClick={() => {
          void run('apply', () => command('applyTemplate', { id: template.id })).then((ok) => { if (ok) onApplied(); else setOutcome('failed') })
        }}><Busy on={pending === 'apply'} />{t('confirmApply')}</button>
        <button className={css.ghost} onClick={() => { setApplying(false) }}>{t('cancelAction')}</button>
      </div>
    </section>}

    <footer className={css.formFooter}>
      <div className={css.actions}>
        <button className={css.primary} disabled={view.busy || !dirty || !valid} onClick={() => {
          void run('save', () => command('saveTemplate', draft)).then((ok) => { setOutcome(ok ? 'saved' : 'failed'); if (ok) onSaved() })
        }}><Busy on={pending === 'save'} />{t('saveTemplate')}</button>
        {!isNew && <button disabled={view.busy || dirty} title={dirty ? t('saveBeforeApply') : undefined} onClick={() => { setApplying(true) }}>{t('applyTemplate')}</button>}
        {isNew ? <button className={css.ghost} onClick={onDiscard}>{t('cancelAction')}</button>
          : confirmDelete
            ? <><button className={css.dangerSolid} disabled={view.busy} onClick={() => {
              void run('delete', () => command('deleteTemplate', { id: template.id })).then((ok) => { if (ok) onDiscard(); else setOutcome('failed') })
            }}>{t('confirmDelete')}</button><button className={css.ghost} onClick={() => { setConfirmDelete(false) }}>{t('cancelAction')}</button></>
            : <button className={css.ghostDanger} disabled={view.busy} onClick={() => { setConfirmDelete(true) }}>{t('deleteTemplate')}</button>}
      </div>
      <p className={css.formStatus} role="status" data-state={outcome === 'failed' ? 'error' : outcome === 'saved' && !dirty ? 'ok' : 'idle'}>
        {outcome === 'failed' ? view.error || t('failure') : outcome === 'saved' && !dirty ? t('templateSaved') : !valid ? t('templateIncomplete') : dirty && !isNew ? t('unsaved') : ''}
      </p>
    </footer>
  </div>
}
