import { normalizeDialoguePreset, dialoguePresetTurns } from './dialogue-preset-core.js'

export function normalizePersonaSettings(value = {}) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) throw new Error('persona settings must be an object')
  const settings = { applyMode: value.applyMode ?? 'immediate', textMode: value.textMode ?? 'template' }
  if (!['immediate', 'new-conversations'].includes(settings.applyMode)) throw new Error('invalid persona applyMode')
  if (!['template', 'plain'].includes(settings.textMode)) throw new Error('invalid persona textMode')
  for (const field of ['characterName', 'userName', 'suffix']) {
    settings[field] = value[field] ?? ''
    if (typeof settings[field] !== 'string') throw new Error(`persona ${field} must be a string`)
  }
  return settings
}

const VARIABLES = new Set(['char', 'user', 'model', 'provider', 'cwd'])
export function validatePersonaVariables(texts, settings) {
  if (settings.textMode === 'plain') return
  for (const text of texts) {
    for (const match of text.matchAll(/\{\{([^{}]*)\}\}/g)) {
      const key = match[1].trim()
      if (!VARIABLES.has(key)) throw new Error(`不支持的变量 {{${key}}}。可用：{{char}}、{{user}}、{{model}}、{{provider}}、{{cwd}}；或选择普通文本。`)
      if (key === 'char' && !settings.characterName.trim()) throw new Error('使用 {{char}} 前请填写角色名。')
      if (key === 'user' && !settings.userName.trim()) throw new Error('使用 {{user}} 前请填写用户称呼。')
    }
  }
}

export function renderPersonaText(text, settings, variables = {}) {
  if (settings.textMode === 'plain') return text
  const values = { ...variables, char: settings.characterName, user: settings.userName }
  // A callback replacement keeps $&, braces, and variable-looking names literal.
  return text.replace(/\{\{([^{}]*)\}\}/g, (_match, raw) => {
    const key = raw.trim()
    if (!VARIABLES.has(key) || typeof values[key] !== 'string') throw new Error(`人设变量 {{${key}}} 在当前请求中不可用。`)
    return values[key]
  })
}

export function configurationTexts(config) {
  return [config.persona ?? '', config.settings.suffix, ...dialoguePresetTurns(config.dialoguePreset).map(turn => turn.text)]
}

/** Snapshot the entire configuration, never a new persona paired with old examples. */
export function sessionConfiguration(sessions, id, current) {
  const key = String(id)
  if (current.settings.applyMode === 'immediate' || !sessions.has(key)) sessions.set(key, structuredClone(current))
  return sessions.get(key)
}

export function renderConfiguration(config, variables) {
  const facts = [config.settings.characterName ? `角色名 / Character name: ${config.settings.characterName}` : '',
    config.settings.userName ? `用户称呼 / User name: ${config.settings.userName}` : ''].filter(Boolean).join('\n')
  const suffix = renderPersonaText(config.settings.suffix, config.settings, variables)
  return {
    ...config,
    persona: config.persona === null ? null : renderPersonaText(config.persona, config.settings, variables),
    suffix: [facts, suffix].filter(Boolean).join('\n\n'),
    turns: dialoguePresetTurns(config.dialoguePreset).map(turn => ({ ...turn, text: renderPersonaText(turn.text, config.settings, variables) })),
  }
}

const BODY_OPEN = '<w-persona>'
const STYLE_OPEN = '<w-persona-style>'
export function personaBody(text) { return `${BODY_OPEN}\n${text}\n</w-persona>` }
export function personaStyle(text) { return `${STYLE_OPEN}\n${text}\n</w-persona-style>` }

/** Final request fallback also supports Harness complete-prompt modes. */
export function enforceRequestPersona(messages, rendered, originalPrefix) {
  const body = rendered.persona === null ? '' : personaBody(rendered.persona)
  const style = rendered.suffix ? personaStyle(rendered.suffix) : ''
  if (!body && !style) return { messages, route: 'default', matched: false }
  let index = -1
  for (let i = 0; i < messages.length; i++) if (messages[i].role === 'system') index = i
  if (index < 0) throw new Error('人设未注入：请求缺少 System 消息，请检查当前模型适配器。')
  const message = messages[index]
  if (message.content.some(block => block.type !== 'text')) throw new Error('人设未注入：System 包含不支持的非文本内容。')
  const text = message.content.map(block => block.text).join('')
  if ((!body || text.includes(body)) && (!style || text.includes(style))) return { messages, route: 'assembly', matched: true }
  // Complete mode restores exactly the original prefix after the waterfall.
  // Replace that fixed persona; otherwise keep all Harness-owned instructions.
  let nextText = body && text === originalPrefix ? body : text
  if (body && !nextText.includes(body)) nextText += '\n\n' + body
  if (style && !nextText.includes(style)) nextText += '\n\n' + style
  const next = messages.slice()
  next[index] = { ...message, content: [{ type: 'text', text: nextText }] }
  return { messages: next, route: text === originalPrefix ? 'complete-fallback' : 'request-fallback', matched: true }
}

/** Preserve leading system/developer messages and every later system update. */
export function insertDialogueExamples(messages, prefix) {
  if (!prefix.length) return messages
  let index = 0
  while (index < messages.length && ['system', 'developer'].includes(messages[index].role)) index++
  return [...messages.slice(0, index), ...prefix, ...messages.slice(index)]
}

export function normalizeConfiguration(persona, dialoguePreset, settings) {
  const config = { persona, dialoguePreset: normalizeDialoguePreset(dialoguePreset), settings: normalizePersonaSettings(settings) }
  validatePersonaVariables(configurationTexts(config), config.settings)
  return config
}
