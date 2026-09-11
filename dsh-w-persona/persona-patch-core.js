const PROMPT_ROW_ID = 'system-prompt'
const CURRENT_PERSONA_FIELD = 'personaPrefix'
const LEGACY_PERSONA_FIELD = 'persona'
const PERSONA_SECTIONS = new Set(['deployment:persona-prefix', 'deployment:persona'])

/** Read either the current Harness field or the pre-alpha.4 spelling. */
export function personaFromConfig(config) {
  if (config == null || typeof config !== 'object' || Array.isArray(config)) return undefined
  for (const field of [CURRENT_PERSONA_FIELD, LEGACY_PERSONA_FIELD]) {
    if (!Object.prototype.hasOwnProperty.call(config, field)) continue
    if (typeof config[field] !== 'string') throw new Error(`system-prompt config.${field} must be a string`)
    return config[field]
  }
  return undefined
}

/** Rewrite the persona slot without disturbing the Harness-owned sections around it. */
export function rewritePersonaAssembly(assembly, text) {
  if (!assembly || !Array.isArray(assembly.sections)) return assembly
  return {
    ...assembly,
    sections: assembly.sections.map(section =>
      PERSONA_SECTIONS.has(section.name) ? { ...section, text } : section),
  }
}

export function updatePersonaPatch(data, text, defaultText) {
  const next = []
  let targetIndex = -1
  for (const row of data) {
    if (!row || row.id !== PROMPT_ROW_ID) {
      next.push(row)
      continue
    }
    const preserved = { ...row }
    if (preserved.config != null && (typeof preserved.config !== 'object' || Array.isArray(preserved.config))) {
      throw new Error('system-prompt config must be an object; refusing to overwrite it')
    }
    const config = preserved.config ? { ...preserved.config } : {}
    // Migrate old profile patches while preserving every unrelated setting.
    delete config[LEGACY_PERSONA_FIELD]
    delete config[CURRENT_PERSONA_FIELD]
    if (Object.keys(config).length > 0) preserved.config = config
    else delete preserved.config
    if (Object.keys(preserved).some(key => key !== 'id')) {
      targetIndex = next.length
      next.push(preserved)
    }
  }
  if (text !== defaultText) {
    if (targetIndex === -1) {
      next.push({ id: PROMPT_ROW_ID, config: { [CURRENT_PERSONA_FIELD]: text } })
    } else {
      const target = next[targetIndex]
      next[targetIndex] = { ...target, config: { ...(target.config || {}), [CURRENT_PERSONA_FIELD]: text } }
    }
  }
  return next
}
