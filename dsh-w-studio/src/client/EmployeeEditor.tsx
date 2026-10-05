/** Employee configuration form with native model and effort controls. */
import { useState } from 'react'
import type { Translate } from '@deepseek-ai/dsh-client-ui-slots'
import type { Employee, Engine, Permission, StudioCatalog } from '../types.ts'
import type { StudioKey } from './locales.ts'
import css from './Studio.module.css'

/** Local editor props; company data and actions come from its owning panel. */
export interface EmployeeEditorProps {
  employee: Employee
  catalog: StudioCatalog | null
  busy: boolean
  t: Translate<StudioKey>
  save: (employee: Employee) => Promise<boolean>
  remove: (id: Employee['id']) => Promise<boolean>
}
const efforts: Record<Engine, readonly string[]> = {
  claude: ['', 'low', 'medium', 'high', 'xhigh', 'max'],
  codex: ['', 'low', 'medium', 'high', 'xhigh', 'max', 'ultra'],
  harness: ['', 'off', 'low', 'high', 'max'],
  compatible: ['', 'minimal', 'low', 'medium', 'high', 'xhigh'],
}

/** Edit one employee without copying its native transcript into the form. */
export function EmployeeEditor({ employee, catalog, busy, t, save, remove }: EmployeeEditorProps) {
  const [draft, setDraft] = useState(employee)
  const [customModel, setCustomModel] = useState(false)
  const change = <K extends keyof Employee>(key: K, value: Employee[K]): void =>{  setDraft(previous => ({ ...previous, [key]: value })) }
  const models = draft.engine === 'compatible' ? undefined : catalog?.[draft.engine === 'claude' ? 'claude' : draft.engine === 'codex' ? 'codex' : 'harness']
  const selectedModel = models?.find(model => model.id === draft.model)
  const isCustomModel = customModel || draft.engine === 'compatible' || (!!draft.model && !selectedModel)
  const effortOptions = selectedModel?.efforts.length ? ['', ...selectedModel.efforts] : efforts[draft.engine]
  const field = (key: 'name' | 'role' | 'model' | 'cwd' | 'baseURL' | 'apiKeyEnv', placeholder = '') => <label className={css.field}>
    <span>{t(key)}</span><input value={draft[key]} placeholder={placeholder} onChange={(event) =>{  change(key, event.target.value) }} />
  </label>
  return <form className={css.editor} onSubmit={(event) => { event.preventDefault(); void save(draft) }}>
    <h2>{t('employeeSettings')}</h2>
    {field('name')}{field('role')}
    <label className={css.field}><span>{t('responsibilities')}</span><textarea rows={3} value={draft.responsibilities} onChange={(event) =>{  change('responsibilities', event.target.value) }} /></label>
    <label className={css.field}><span>{t('engine')}</span><select aria-label={t('engine')} value={draft.engine} onChange={(event) => {
      const engine = event.target.value as Engine
      setCustomModel(false)
      setDraft(previous => ({ ...previous, engine, model: engine === 'claude' ? 'sonnet' : '', effort: '', thinkingFormat: engine === 'compatible' ? 'zai' : 'none' }))
    }}>{(['codex', 'claude', 'harness', 'compatible'] as const).map(engine => <option value={engine} key={engine}>{t(engine)}</option>)}</select></label>
    {draft.engine !== 'compatible' && <label className={css.field}><span>{t('model')}</span><select aria-label={t('model')} value={isCustomModel ? '__custom__' : draft.model} onChange={(event) => {
      const custom = event.target.value === '__custom__'
      setCustomModel(custom)
      if (!custom) setDraft({ ...draft, model: event.target.value, effort: '' })
    }}>
      <option value="">{t('nativeDefault')}</option>
      {models?.filter(model => model.id !== '').map(model => <option key={model.id} value={model.id}>{model.name} · {model.id}{model.imageInput ? ` · ${t('imageInput')}` : ''}</option>)}
      <option value="__custom__">{t('customModel')}</option>
    </select></label>}
    {isCustomModel && <label className={css.field}><span>{t('modelId')}</span><input aria-label={t('modelId')} value={draft.model} placeholder={t('modelIdPlaceholder')} onChange={(event) => {
      setDraft({ ...draft, model: event.target.value, effort: '' })
    }} /></label>}
    {draft.engine === 'claude' && catalog?.claudeError && <p role="alert" className={css.error}>{catalog.claudeError}</p>}
    <label className={css.field}><span>{t('effort')}</span><select aria-label={t('effort')} value={draft.effort} onChange={(event) =>{  change('effort', event.target.value) }}>
      {effortOptions.map(effort => <option value={effort} key={effort}>{effort || t('nativeDefault')}</option>)}
    </select></label>
    {field('cwd', t('unassignedCwd'))}
    <label className={css.field}><span>{t('permission')}</span><select aria-label={t('permission')} value={draft.permission} onChange={(event) =>{  change('permission', event.target.value as Permission) }}>
      <option value="read-only">{t('readOnly')}</option><option value="workspace-write">{t('workspaceWrite')}</option><option value="full-access">{t('fullAccess')}</option>
    </select></label>
    {draft.engine === 'compatible' && <>
      {field('baseURL')}{field('apiKeyEnv')}
      <label className={css.field}><span>{t('thinkingFormat')}</span><select aria-label={t('thinkingFormat')} value={draft.thinkingFormat} onChange={(event) =>{  change('thinkingFormat', event.target.value as Employee['thinkingFormat']) }}>
        <option value="none">{t('protocolNone')}</option><option value="zai">{t('zai')}</option><option value="deepseek">{t('deepseekProtocol')}</option>
      </select></label>
    </>}
    {(draft.engine === 'compatible' || draft.engine === 'harness') && <div className={css.numericFields}>
      {(['contextWindow', 'maxTokens'] as const).map(key => <label key={key}><span>{t(key)}</span><input type="number" min={key === 'contextWindow' ? 1024 : 1} value={draft[key]} onChange={(event) =>{  change(key, Number(event.target.value)) }} /></label>)}
    </div>}
    <label className={css.check}><input type="checkbox" checked={draft.enabled} onChange={(event) =>{  change('enabled', event.target.checked) }} />{t('enabled')}</label>
    <p className={css.hint}>{t(draft.engine === 'compatible' ? 'providerHelp' : 'nativeHelp')}</p>
    <div className={css.actions}><button type="submit" className={css.primary} disabled={busy}>{t(busy ? 'saving' : 'save')}</button>
      <button type="button" className={css.danger} disabled={busy} onClick={() => { void remove(draft.id) }}>{t('delete')}</button></div>
  </form>
}
