const EMPTY_PRESET = Object.freeze({
  enabled: false,
  user1: '',
  assistant1: '',
  user2: '',
  assistant2: '',
})

export const DIALOGUE_PRESET_FIELDS = Object.freeze([
  'user1',
  'assistant1',
  'user2',
  'assistant2',
])

export function defaultDialoguePreset() {
  return { ...EMPTY_PRESET }
}

export function normalizeDialoguePreset(value) {
  if (value === undefined || value === null) return defaultDialoguePreset()
  if (typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('dialogue preset must be an object')
  }

  const preset = { enabled: value.enabled === true }
  for (const field of DIALOGUE_PRESET_FIELDS) {
    const text = value[field] ?? ''
    if (typeof text !== 'string') throw new Error(`dialogue preset ${field} must be a string`)
    preset[field] = text
  }
  return preset
}

export function hasCompleteDialoguePreset(preset) {
  return preset.enabled === true
    && DIALOGUE_PRESET_FIELDS.every(field => preset[field].trim().length > 0)
}

export function dialoguePresetTurns(preset) {
  if (!hasCompleteDialoguePreset(preset)) return []
  return [
    { role: 'user', text: preset.user1 },
    { role: 'assistant', text: preset.assistant1 },
    { role: 'user', text: preset.user2 },
    { role: 'assistant', text: preset.assistant2 },
  ]
}
