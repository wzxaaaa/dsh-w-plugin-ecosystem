import { normalizeDialoguePreset } from './dialogue-preset-core.js'

export const PERSONA_TEMPLATE_LIBRARY_VERSION = 1
export const MAX_PERSONA_TEMPLATES = 100

export function defaultPersonaTemplateLibrary() {
  return { version: PERSONA_TEMPLATE_LIBRARY_VERSION, templates: [] }
}

function requiredText(value, field, maxLength) {
  if (typeof value !== 'string') throw new Error(`persona template ${field} must be a string`)
  const result = value.trim()
  if (!result) throw new Error(`persona template ${field} must not be empty`)
  if (result.length > maxLength) throw new Error(`persona template ${field} exceeds ${maxLength} characters`)
  return result
}

export function normalizePersonaTemplate(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('persona template must be an object')
  if (typeof value.persona !== 'string') throw new Error('persona template persona must be a string')
  return {
    id: requiredText(value.id, 'id', 160),
    name: requiredText(value.name, 'name', 80),
    persona: value.persona,
    dialoguePreset: normalizeDialoguePreset(value.dialoguePreset),
    createdAt: requiredText(value.createdAt, 'createdAt', 80),
    updatedAt: requiredText(value.updatedAt, 'updatedAt', 80),
  }
}

export function normalizePersonaTemplateLibrary(value) {
  if (value === undefined || value === null) return defaultPersonaTemplateLibrary()
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('persona template library must be an object')
  if (value.version !== PERSONA_TEMPLATE_LIBRARY_VERSION) throw new Error(`unsupported persona template library version: ${String(value.version)}`)
  if (!Array.isArray(value.templates)) throw new Error('persona template library templates must be an array')
  if (value.templates.length > MAX_PERSONA_TEMPLATES) throw new Error(`persona template library exceeds ${MAX_PERSONA_TEMPLATES} templates`)
  const templates = value.templates.map(normalizePersonaTemplate)
  const ids = new Set()
  const names = new Set()
  for (const template of templates) {
    const normalizedName = template.name.toLocaleLowerCase()
    if (ids.has(template.id)) throw new Error(`duplicate persona template id: ${template.id}`)
    if (names.has(normalizedName)) throw new Error(`duplicate persona template name: ${template.name}`)
    ids.add(template.id)
    names.add(normalizedName)
  }
  return { version: PERSONA_TEMPLATE_LIBRARY_VERSION, templates }
}

export function savePersonaTemplate(libraryValue, input, options = {}) {
  const library = normalizePersonaTemplateLibrary(libraryValue)
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('persona template input must be an object')
  if (typeof input.persona !== 'string') throw new Error('persona template persona must be a string')
  const name = requiredText(input.name, 'name', 80)
  const id = typeof input.id === 'string' && input.id.trim() ? input.id.trim() : requiredText(options.id, 'id', 160)
  const now = requiredText(options.now, 'updatedAt', 80)
  const existingIndex = library.templates.findIndex(template => template.id === id)
  const duplicate = library.templates.find(template => template.id !== id && template.name.toLocaleLowerCase() === name.toLocaleLowerCase())
  if (duplicate) throw new Error(`persona template name already exists: ${name}`)
  if (existingIndex === -1 && library.templates.length >= MAX_PERSONA_TEMPLATES) {
    throw new Error(`persona template library exceeds ${MAX_PERSONA_TEMPLATES} templates`)
  }
  const template = normalizePersonaTemplate({
    id,
    name,
    persona: input.persona,
    dialoguePreset: input.dialoguePreset,
    createdAt: existingIndex === -1 ? now : library.templates[existingIndex].createdAt,
    updatedAt: now,
  })
  const templates = library.templates.slice()
  if (existingIndex === -1) templates.push(template)
  else templates[existingIndex] = template
  return { library: { version: PERSONA_TEMPLATE_LIBRARY_VERSION, templates }, template }
}

export function deletePersonaTemplate(libraryValue, id) {
  const library = normalizePersonaTemplateLibrary(libraryValue)
  const key = requiredText(id, 'id', 160)
  const templates = library.templates.filter(template => template.id !== key)
  if (templates.length === library.templates.length) throw new Error(`unknown persona template: ${key}`)
  return { version: PERSONA_TEMPLATE_LIBRARY_VERSION, templates }
}

export function personaTemplateMatches(templateValue, persona, dialoguePreset) {
  const template = normalizePersonaTemplate(templateValue)
  if (typeof persona !== 'string' || template.persona !== persona) return false
  return JSON.stringify(template.dialoguePreset) === JSON.stringify(normalizeDialoguePreset(dialoguePreset))
}

export function matchingPersonaTemplateId(libraryValue, persona, dialoguePreset) {
  const library = normalizePersonaTemplateLibrary(libraryValue)
  return library.templates.find(template => personaTemplateMatches(template, persona, dialoguePreset))?.id ?? null
}
