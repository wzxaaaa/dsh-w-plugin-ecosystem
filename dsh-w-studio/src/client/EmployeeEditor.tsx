/** Employee configuration form with native model and effort controls. */
import { useId, useState } from 'react'
import type { Employee, Engine, Permission, StudioCatalog, StudioModel } from '../types.ts'
import { Avatar, Busy } from './parts.tsx'
import type { T } from './ui.ts'
import css from './Studio.module.css'

/** Local editor props; company data and actions come from its owning panel. */
export interface EmployeeEditorProps {
  employee: Employee
  catalog: StudioCatalog | null
  busy: boolean
  /** Whether this employee is a new, unsaved draft. */
  isNew: boolean
  /** Latest command diagnostic, shown after a failed save or delete. */
  error: string
  t: T
  save: (employee: Employee) => Promise<boolean>
  remove: (id: Employee['id']) => Promise<boolean>
  /** Template members have no working directory or enablement and are saved with their template. */
  variant?: 'employee' | 'member'
}
const efforts: Record<Engine, readonly string[]> = {
  claude: ['', 'low', 'medium', 'high', 'xhigh', 'max'],
  codex: ['', 'low', 'medium', 'high', 'xhigh', 'max', 'ultra'],
  harness: ['', 'off', 'low', 'high', 'max'],
  compatible: ['', 'minimal', 'low', 'medium', 'high', 'xhigh'],
}
const engines = ['codex', 'claude', 'harness', 'compatible'] as const

/** Edit one employee without copying its native transcript into the form. */
export function EmployeeEditor({ employee, catalog, busy, isNew, error, t, save, remove, variant = 'employee' }: EmployeeEditorProps) {
  const member = variant === 'member'
  const [draft, setDraft] = useState(employee)
  const [customModel, setCustomModel] = useState(false)
  const [outcome, setOutcome] = useState<'idle' | 'saving' | 'saved' | 'failed' | 'deleting'>('idle')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const id = useId()
  const change = <K extends keyof Employee>(key: K, value: Employee[K]): void => {
    setOutcome('idle')
    setDraft(previous => ({ ...previous, [key]: value }))
  }
  const models = draft.engine === 'compatible' ? undefined : catalog?.[draft.engine === 'claude' ? 'claude' : draft.engine === 'codex' ? 'codex' : 'harness']
  const selectedModel = models?.find(model => model.id === draft.model)
  const isCustomModel = customModel || draft.engine === 'compatible' || (!!draft.model && !selectedModel)
  const effortOptions = selectedModel?.efforts.length ? ['', ...selectedModel.efforts] : efforts[draft.engine]
  const dirty = isNew || JSON.stringify(draft) !== JSON.stringify(employee)
  const text = (key: 'name' | 'role' | 'cwd' | 'baseURL' | 'apiKeyEnv', placeholder = '', required = false) => <label className={css.field}>
    <span>{t(key)}</span><input required={required} value={draft[key]} placeholder={placeholder} onChange={(event) => { change(key, event.target.value) }} />
  </label>
  const pickModel = (model: string): void => {
    setOutcome('idle')
    setDraft(previous => ({ ...previous, model, effort: '' }))
  }
  return <form className={css.editorCard} aria-labelledby={`${id}-title`} onSubmit={(event) => {
    event.preventDefault()
    setOutcome('saving')
    void save(draft).then((ok) => { setOutcome(ok ? 'saved' : 'failed') })
  }}>
    <header className={css.editorHead}>
      <Avatar id={draft.id} name={draft.name} size="lg" />
      <div>
        <h2 id={`${id}-title`}>{draft.name || t('newEmployee')}</h2>
        <p>{draft.role || t('noRole')}{!member && !draft.enabled && <> · {t('disabled')}</>}{member && <> · {t('templateMember')}</>}</p>
      </div>
    </header>

    <fieldset className={css.formGroup}>
      <legend>{t('profile')}</legend>
      <div className={css.fieldPair}>{text('name', '', true)}{text('role')}</div>
      <label className={css.field}><span>{t('responsibilities')}</span><textarea rows={3} value={draft.responsibilities} onChange={(event) => { change('responsibilities', event.target.value) }} /></label>
      {!member && <label className={css.switch}><input type="checkbox" checked={draft.enabled} onChange={(event) => { change('enabled', event.target.checked) }} /><span>{t('enabled')}</span></label>}
    </fieldset>

    <fieldset className={css.formGroup}>
      <legend>{t('execution')}</legend>
      <div className={css.segmented} role="radiogroup" aria-label={t('engine')}>
        {engines.map(engine => <label key={engine} data-engine={engine}>
          <input type="radio" name={`${id}-engine`} value={engine} checked={draft.engine === engine} onChange={() => {
            setCustomModel(false)
            setOutcome('idle')
            setDraft(previous => ({ ...previous, engine, model: engine === 'claude' ? 'sonnet' : '', effort: '', thinkingFormat: engine === 'compatible' ? 'zai' : 'none' }))
          }} /><span>{t(engine)}</span>
        </label>)}
      </div>
      {draft.engine !== 'compatible' && <ModelPicker t={t} name={`${id}-model`} models={models} value={draft.model} custom={isCustomModel}
        loadError={draft.engine === 'claude' ? catalog?.claudeError ?? '' : ''}
        onPick={(model) => { setCustomModel(false); pickModel(model) }} onCustom={() => { setCustomModel(true); setOutcome('idle') }} />}
      {isCustomModel && <label className={css.field}><span>{t('modelId')}</span><input aria-label={t('modelId')} className={css.mono} value={draft.model} placeholder={t('modelIdPlaceholder')} onChange={(event) => { pickModel(event.target.value) }} /></label>}
      <div className={css.field}>
        <span id={`${id}-effort`}>{t('effort')}{selectedModel && <small> · {selectedModel.name}</small>}</span>
        <div className={css.chips} role="radiogroup" aria-labelledby={`${id}-effort`}>
          {effortOptions.map(effort => <label key={effort || 'default'} className={css.chip}>
            <input type="radio" name={`${id}-effort`} checked={draft.effort === effort} onChange={() => { change('effort', effort) }} />
            <span>{effort || t('nativeDefault')}</span>
          </label>)}
        </div>
      </div>
      <p className={css.hint}>{t(draft.engine === 'compatible' ? 'providerHelp' : 'nativeHelp')}</p>
      {draft.engine === 'compatible' && <>
        <div className={css.fieldPair}>{text('baseURL')}{text('apiKeyEnv')}</div>
        <label className={css.field}><span>{t('thinkingFormat')}</span><select aria-label={t('thinkingFormat')} value={draft.thinkingFormat} onChange={(event) => { change('thinkingFormat', event.target.value as Employee['thinkingFormat']) }}>
          <option value="none">{t('protocolNone')}</option><option value="zai">{t('zai')}</option><option value="deepseek">{t('deepseekProtocol')}</option>
        </select></label>
      </>}
      {(draft.engine === 'compatible' || draft.engine === 'harness') && <div className={css.fieldPair}>
        {(['contextWindow', 'maxTokens'] as const).map(key => <label key={key} className={css.field}><span>{t(key)}</span><input type="number" min={key === 'contextWindow' ? 1024 : 1} value={draft[key]} onChange={(event) => { change(key, Number(event.target.value)) }} /></label>)}
      </div>}
    </fieldset>

    <fieldset className={css.formGroup}>
      <legend>{t(member ? 'permission' : 'workplace')}</legend>
      {!member && text('cwd', t('unassignedCwd'))}
      <label className={css.field}><span>{t('permission')}</span><select aria-label={t('permission')} value={draft.permission} onChange={(event) => { change('permission', event.target.value as Permission) }}>
        <option value="read-only">{t('readOnly')}</option><option value="workspace-write">{t('workspaceWrite')}</option><option value="full-access">{t('fullAccess')}</option>
      </select></label>
    </fieldset>

    <footer className={css.formFooter}>
      <div className={css.actions}>
        <button type="submit" className={css.primary} disabled={busy || !dirty}><Busy on={outcome === 'saving'} />{t(outcome === 'saving' ? 'saving' : member ? 'updateMember' : 'save')}</button>
        {confirmDelete
          ? <><button type="button" className={css.dangerSolid} disabled={busy} onClick={() => {
            setOutcome('deleting')
            void remove(draft.id).then((ok) => { setConfirmDelete(false); setOutcome(ok ? 'idle' : 'failed') })
          }}>{t('confirmDelete')}</button><button type="button" className={css.ghost} onClick={() => { setConfirmDelete(false) }}>{t('cancelAction')}</button></>
          : <button type="button" className={css.ghostDanger} disabled={busy} onClick={() => { setConfirmDelete(true) }}>{t(member ? 'removeMember' : isNew ? 'discard' : 'delete')}</button>}
      </div>
      <p className={css.formStatus} role="status" data-state={outcome === 'failed' ? 'error' : outcome === 'saved' && !dirty ? 'ok' : 'idle'}>
        {outcome === 'failed' ? error || t('failure') : outcome === 'saved' && !dirty ? t(member ? 'memberUpdated' : 'settingsSaved') : dirty && !isNew ? t('unsaved') : ''}
      </p>
    </footer>
  </form>
}

interface ModelPickerProps {
  t: T
  name: string
  models: StudioModel[] | undefined
  value: string
  custom: boolean
  loadError: string
  onPick: (model: string) => void
  onCustom: () => void
}
/** Searchable radio list showing the complete native catalog plus inherit and custom entries. */
function ModelPicker({ t, name, models, value, custom, loadError, onPick, onCustom }: ModelPickerProps) {
  const [query, setQuery] = useState('')
  const list = models?.filter(model => model.id !== '') ?? []
  const needle = query.trim().toLowerCase()
  const shown = needle ? list.filter(model => `${model.name} ${model.id}`.toLowerCase().includes(needle)) : list
  return <fieldset className={css.modelPicker}>
    <legend>{t('model')}{models && <small> · {t('modelCount', { count: list.length })}</small>}</legend>
    {loadError && <p role="alert" className={css.inlineError}>{loadError}</p>}
    {list.length > 5 && <input type="search" className={css.modelSearch} aria-label={t('searchModels')} placeholder={t('searchModels')} value={query} onChange={(event) => { setQuery(event.target.value) }} />}
    <div className={css.modelList}>
      {!needle && <label className={css.modelOption}>
        <input type="radio" name={name} checked={!custom && value === ''} onChange={() => { onPick('') }} />
        <span><strong>{t('nativeDefault')}</strong><small>{t('nativeDefaultHelp')}</small></span>
      </label>}
      {models === undefined && !loadError && <p className={css.muted}>{t('loadingModels')}</p>}
      {shown.map(model => <label key={model.id} className={css.modelOption}>
        <input type="radio" name={name} checked={!custom && value === model.id} onChange={() => { onPick(model.id) }} />
        <span>
          <strong>{model.name}</strong>
          <small className={css.mono}>{model.id}</small>
          <span className={css.modelTags}>
            {model.imageInput && <em>{t('imageInput')}</em>}
            {!!model.efforts.length && <em>{t('effortCount', { count: model.efforts.length })}</em>}
          </span>
        </span>
      </label>)}
      {needle && !shown.length && <p className={css.muted}>{t('noModelMatch')}</p>}
      <label className={css.modelOption}>
        <input type="radio" name={name} checked={custom} onChange={onCustom} />
        <span><strong>{t('customModel')}</strong><small>{t('customModelHelp')}</small></span>
      </label>
    </div>
  </fieldset>
}
