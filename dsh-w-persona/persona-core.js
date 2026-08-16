export const PROMPT_ROW_ID = 'system-prompt'
export const PERSONA_SECTION = 'deployment:persona'

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
    delete config.persona
    if (Object.keys(config).length > 0) preserved.config = config
    else delete preserved.config
    if (Object.keys(preserved).some(key => key !== 'id')) {
      targetIndex = next.length
      next.push(preserved)
    }
  }
  if (text !== defaultText) {
    if (targetIndex === -1) {
      next.push({ id: PROMPT_ROW_ID, config: { persona: text } })
    } else {
      const target = next[targetIndex]
      next[targetIndex] = { ...target, config: { ...(target.config || {}), persona: text } }
    }
  }
  return next
}

export function patchPersonaAssembly(assembly, customPersona) {
  if (customPersona === null || !assembly || !Array.isArray(assembly.sections)) {
    return {
      assembly,
      status: { applied: false, hadSection: false, inserted: false, minimal: false, removedSections: [] },
    }
  }

  const source = assembly.sections
  const existingIndex = source.findIndex(section => section?.name === PERSONA_SECTION)
  const hadSection = existingIndex >= 0
  let personaIndex
  let persona

  if (hadSection) {
    personaIndex = existingIndex
    persona = { ...source[existingIndex], text: customPersona }
  } else {
    const routerIndex = source.findIndex(section => section?.name === 'router-persona')
    const identityIndex = source.findIndex(section => section?.name === 'harness:identity')
    personaIndex = (routerIndex >= 0 ? routerIndex : identityIndex) + 1
    persona = { name: PERSONA_SECTION, text: customPersona }
  }

  // Keep everything before Persona, including router-persona when it is
  // present. Remove every prompt section after Persona. The separately
  // transported tools/contexts/variables metadata remains untouched.
  const keptBefore = source
    .slice(0, personaIndex)
    .filter(section => section?.name !== PERSONA_SECTION)
  const removedSections = source
    .slice(personaIndex + (hadSection ? 1 : 0))
    .map(section => section?.name)
    .filter(name => typeof name === 'string')

  return {
    assembly: { ...assembly, sections: [...keptBefore, persona] },
    status: {
      applied: true,
      hadSection,
      inserted: !hadSection,
      minimal: true,
      removedSections,
    },
  }
}
