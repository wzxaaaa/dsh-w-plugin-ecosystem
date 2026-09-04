/** Pure settings transformations shared by the browser UI and tests. */

export const THINKING_LEVELS = Object.freeze([
  'off', 'minimal', 'low', 'medium', 'high', 'xhigh', 'max',
])

export const THINKING_FORMATS = Object.freeze([
  'openai',
  'deepseek',
  'openrouter',
  'together',
  'baseten',
  'zai',
  'qwen',
  'chat-template',
  'qwen-chat-template',
  'string-thinking',
  'ant-ling',
])

const preset = (
  id,
  label,
  description,
  format,
  supportsReasoningEffort,
  efforts,
  supportsDeveloperRole = false,
) => Object.freeze({
  id,
  label,
  description,
  format,
  supportsReasoningEffort,
  supportsDeveloperRole,
  efforts: Object.freeze({ ...efforts }),
})

export const PRESETS = Object.freeze([
  preset('openai', 'OpenAI reasoning_effort', '只发送顶层 reasoning_effort，适用于 OpenAI Chat Completions 兼容中转。', '', true, {
    off: 'none', minimal: 'minimal', low: 'low', medium: 'medium', high: 'high', xhigh: 'xhigh', max: 'max',
  }),
  preset('deepseek', 'DeepSeek thinking', '发送 thinking.type enabled/disabled；强度由模型或中转站决定。', 'deepseek', false, {
    off: null, high: 'high',
  }),
  preset('openrouter', 'OpenRouter reasoning', '发送 reasoning: { effort }。', 'openrouter', false, {
    off: 'none', low: 'low', medium: 'medium', high: 'high', xhigh: 'xhigh',
  }),
  preset('qwen', 'Qwen enable_thinking', '发送 enable_thinking，并可选发送 reasoning_effort。', 'qwen', false, {
    off: null, high: 'high',
  }),
  preset('zai', 'Z.ai / GLM thinking', '发送 thinking.type enabled/disabled。', 'zai', false, {
    off: null, high: 'high',
  }),
  preset('together', 'Together reasoning.enabled', '发送 reasoning: { enabled }。', 'together', false, {
    off: null, high: 'high',
  }),
  preset('string-thinking', '字符串 thinking', '发送 thinking: "<值>"，适合使用字符串开关的中转。', 'string-thinking', false, {
    off: 'off', low: 'low', medium: 'medium', high: 'high',
  }),
  preset('anthropic', 'Anthropic 原生推理', '保留 Anthropic Messages 的原生 thinking 处理，只声明可选强度。', '', null, {
    off: null, low: 'low', medium: 'medium', high: 'high', max: 'max',
  }, null),
  preset('passthrough', '仅 reasoning_effort', '不指定 thinking 方言，只声明顶层 reasoning_effort。', '', true, {
    off: 'none', low: 'low', medium: 'medium', high: 'high',
  }),
])

const MANAGED_COMPAT = Object.freeze([
  'thinkingFormat', 'supportsReasoningEffort', 'supportsDeveloperRole',
])

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function record(value) {
  return isRecord(value) ? value : {}
}

function clone(value) {
  return value === undefined ? undefined : structuredClone(value)
}

export function providerProfile(layer, provider) {
  return record(record(record(layer).providers)[provider])
}

/**
 * Infer a wire dialect from the configured API surface, never from the model
 * brand. A relay can expose DeepSeek, Qwen, GLM, or Grok model ids through an
 * ordinary OpenAI Chat Completions endpoint whose only reasoning control is
 * reasoning_effort.
 */
export function inferPreset(provider, profile) {
  const providerId = String(provider ?? '').toLowerCase()
  const api = String(record(profile).api ?? '').toLowerCase()
  const baseURL = String(record(profile).baseURL ?? '').toLowerCase()
  const route = `${providerId} ${baseURL}`
  if (api === 'anthropic-messages') return 'anthropic'
  if (route.includes('openrouter')) return 'openrouter'
  if (route.includes('together')) return 'together'
  if (providerId === 'zai' || route.includes('zhipu') || route.includes('bigmodel') || route.includes('z.ai')) return 'zai'
  if (providerId === 'qwen' || route.includes('dashscope') || route.includes('aliyuncs')) return 'qwen'
  if (providerId === 'deepseek' || baseURL.includes('api.deepseek.com')) return 'deepseek'
  return 'openai'
}

function modelEntry(profile, model) {
  const models = Array.isArray(profile.models) ? profile.models : []
  const index = models.findIndex(entry => record(entry).id === model)
  if (index >= 0) return { kind: 'models', index, value: record(models[index]) }
  const override = record(record(profile.modelOverrides)[model])
  return { kind: 'override', value: override }
}

export function readModelConfiguration(namespace, provider, model) {
  const profile = providerProfile(record(namespace).value, provider)
  const located = modelEntry(profile, model)
  const value = located.value
  const compat = record(value.compat)
  const rawEfforts = value.reasoningEfforts
  const mode = rawEfforts === false
    ? 'disabled'
    : isRecord(rawEfforts) && Object.keys(rawEfforts).length > 0
      ? 'enabled'
      : 'inherit'
  const efforts = {}
  if (isRecord(rawEfforts)) {
    for (const level of THINKING_LEVELS) {
      const wire = rawEfforts[level]
      if (wire === null || typeof wire === 'string') efforts[level] = wire
    }
  }
  return {
    mode,
    efforts,
    format: typeof compat.thinkingFormat === 'string' ? compat.thinkingFormat : '',
    supportsReasoningEffort: typeof compat.supportsReasoningEffort === 'boolean'
      ? compat.supportsReasoningEffort
      : null,
    supportsDeveloperRole: typeof compat.supportsDeveloperRole === 'boolean'
      ? compat.supportsDeveloperRole
      : null,
    defaultEffort: typeof profile.reasoning === 'string' ? profile.reasoning : '',
    location: located.kind,
  }
}

export function validateDraft(draft) {
  if (!['inherit', 'disabled', 'enabled'].includes(draft.mode)) return '未知的能力模式。'
  if (draft.mode !== 'enabled') return undefined
  const entries = THINKING_LEVELS.flatMap(level => Object.hasOwn(record(draft.efforts), level)
    ? [[level, draft.efforts[level]]]
    : [])
  if (!entries.some(([level]) => level !== 'off')) return '至少启用一个非 off 的推理强度。'
  for (const [level, wire] of entries) {
    if (wire === null && level === 'off') continue
    if (typeof wire !== 'string' || wire.trim().length === 0) return `${level} 需要填写中转站接收的值。`
  }
  if (draft.format && !THINKING_FORMATS.includes(draft.format)) return '未知的推理协议。'
  if (draft.defaultEffort && !entries.some(([level]) => level === draft.defaultEffort)) {
    return '默认强度必须是当前模型已启用的强度。'
  }
  return undefined
}

function configuredModel(previous, draft) {
  const next = clone(previous) ?? {}
  const compat = { ...record(next.compat) }
  if (draft.mode === 'inherit') {
    delete next.reasoningEfforts
    for (const field of MANAGED_COMPAT) delete compat[field]
  } else if (draft.mode === 'disabled') {
    next.reasoningEfforts = false
    for (const field of MANAGED_COMPAT) delete compat[field]
  } else {
    next.reasoningEfforts = Object.fromEntries(THINKING_LEVELS.flatMap((level) => {
      if (!Object.hasOwn(record(draft.efforts), level)) return []
      const value = draft.efforts[level]
      return [[level, typeof value === 'string' ? value.trim() : value]]
    }))
    if (draft.format) compat.thinkingFormat = draft.format
    else delete compat.thinkingFormat
    if (typeof draft.supportsReasoningEffort === 'boolean') {
      compat.supportsReasoningEffort = draft.supportsReasoningEffort
    } else {
      delete compat.supportsReasoningEffort
    }
    if (typeof draft.supportsDeveloperRole === 'boolean') {
      compat.supportsDeveloperRole = draft.supportsDeveloperRole
    } else {
      delete compat.supportsDeveloperRole
    }
  }
  if (Object.keys(compat).length > 0) next.compat = compat
  else delete next.compat
  return next
}

/**
 * Build path-addressed writes against the official llm-pi-ai namespace.
 * Array-backed declared models are replaced as one preserved array because
 * the settings path protocol intentionally accepts object keys only.
 */
export function buildSettingsOps(namespace, provider, model, draft) {
  const failure = validateDraft(draft)
  if (failure) throw new Error(failure)
  if (typeof provider !== 'string' || provider.length === 0) throw new Error('请选择提供方。')
  if (typeof model !== 'string' || model.length === 0) throw new Error('请选择或填写模型 ID。')

  const valueProfile = providerProfile(record(namespace).value, provider)
  const userProfile = providerProfile(record(namespace).user, provider)
  const base = ['providers', provider]
  const valueLocation = modelEntry(valueProfile, model)
  const userLocation = modelEntry(userProfile, model)
  const operations = []

  if (valueLocation.kind === 'models') {
    const source = Array.isArray(userProfile.models) && userLocation.kind === 'models'
      ? clone(userProfile.models)
      : clone(valueProfile.models)
    if (!Array.isArray(source)) throw new Error('当前提供方的模型列表不可编辑。')
    const index = source.findIndex(entry => record(entry).id === model)
    if (index < 0) throw new Error(`模型 ${model} 不在当前提供方的显式模型列表中。`)
    source[index] = configuredModel(record(source[index]), draft)
    operations.push({ op: 'set', path: [...base, 'models'], value: source })
  } else {
    const target = [...base, 'modelOverrides', model]
    const previous = userLocation.kind === 'override' && Object.keys(userLocation.value).length > 0
      ? userLocation.value
      : valueLocation.value
    const next = configuredModel(previous, draft)
    if (draft.mode === 'inherit' && Object.keys(next).length === 0) {
      operations.push({ op: 'unset', path: target })
    } else {
      operations.push({ op: 'set', path: target, value: next })
    }
  }

  if (draft.defaultEffort === undefined) return operations
  if (draft.defaultEffort === '') operations.push({ op: 'unset', path: [...base, 'reasoning'] })
  else operations.push({ op: 'set', path: [...base, 'reasoning'], value: draft.defaultEffort })
  return operations
}

export function presetDraft(id) {
  const found = PRESETS.find(entry => entry.id === id)
  if (!found) throw new Error(`unknown reasoning preset: ${id}`)
  return {
    mode: 'enabled',
    format: found.format,
    supportsReasoningEffort: found.supportsReasoningEffort,
    supportsDeveloperRole: found.supportsDeveloperRole,
    efforts: { ...found.efforts },
  }
}
