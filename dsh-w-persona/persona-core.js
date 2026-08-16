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
      status: { applied: false, hadSection: false, inserted: false },
    }
  }

  const hadSection = assembly.sections.some(section => section?.name === PERSONA_SECTION)
  if (hadSection) {
    return {
      assembly: {
        ...assembly,
        sections: assembly.sections.map(section =>
          section?.name === PERSONA_SECTION ? { ...section, text: customPersona } : section,
        ),
      },
      status: { applied: true, hadSection: true, inserted: false },
    }
  }

  const sections = [...assembly.sections]
  const identityIndex = sections.findIndex(section => section?.name === 'harness:identity')
  sections.splice(identityIndex >= 0 ? identityIndex + 1 : 0, 0, {
    name: PERSONA_SECTION,
    text: customPersona,
  })
  return {
    assembly: { ...assembly, sections },
    status: { applied: true, hadSection: false, inserted: true },
  }
}
