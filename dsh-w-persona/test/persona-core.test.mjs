import assert from 'node:assert/strict'
import test from 'node:test'

import {
  PERSONA_SECTION,
  patchPersonaAssembly,
  updatePersonaPatch,
} from '../persona-core.js'

test('adds a persona override while preserving unrelated patch rows', () => {
  const original = [
    { id: 'other', disabled: true },
    { id: 'system-prompt', config: { includeHarnessIdentity: false }, note: 'keep' },
  ]
  assert.deepEqual(updatePersonaPatch(original, 'custom', 'default'), [
    { id: 'other', disabled: true },
    { id: 'system-prompt', config: { includeHarnessIdentity: false, persona: 'custom' }, note: 'keep' },
  ])
})

test('removes only the persona override when resetting to the default', () => {
  const original = [
    { id: 'system-prompt', config: { includeHarnessIdentity: false, persona: 'custom' } },
  ]
  assert.deepEqual(updatePersonaPatch(original, 'default', 'default'), [
    { id: 'system-prompt', config: { includeHarnessIdentity: false } },
  ])
})

test('drops an otherwise empty system-prompt patch row on reset', () => {
  assert.deepEqual(
    updatePersonaPatch([{ id: 'system-prompt', config: { persona: 'custom' } }], 'default', 'default'),
    [],
  )
})

test('refuses to overwrite an invalid system-prompt config shape', () => {
  assert.throws(
    () => updatePersonaPatch([{ id: 'system-prompt', config: [] }], 'custom', 'default'),
    /config must be an object/u,
  )
})

test('replaces Persona and removes only sections after it', () => {
  const input = {
    sections: [
      { name: 'router-persona', text: 'router' },
      { name: PERSONA_SECTION, text: 'preset' },
      { name: 'tools:guidance', text: 'tools' },
      { name: 'later:rules', text: 'later' },
    ],
    contexts: [],
    tools: [],
    variables: {},
  }
  const result = patchPersonaAssembly(input, 'custom')
  assert.deepEqual(result.status, {
    applied: true,
    hadSection: true,
    inserted: false,
    minimal: true,
    removedSections: ['tools:guidance', 'later:rules'],
  })
  assert.deepEqual(result.assembly.sections, [
    { name: 'router-persona', text: 'router' },
    { name: PERSONA_SECTION, text: 'custom' },
  ])
  assert.equal(input.sections[1].text, 'preset')
})

test('inserts Persona after router-persona and removes only what follows it', () => {
  const input = {
    sections: [
      { name: 'router-persona', text: 'router' },
      { name: 'tools:guidance', text: 'tools' },
    ],
  }
  const result = patchPersonaAssembly(input, 'custom')
  assert.deepEqual(result.assembly.sections, [
    { name: 'router-persona', text: 'router' },
    { name: PERSONA_SECTION, text: 'custom' },
  ])
  assert.deepEqual(result.status.removedSections, ['tools:guidance'])
})

test('inserts Persona after harness identity when no router exists', () => {
  const input = {
    sections: [
      { name: 'harness:identity', text: 'identity' },
      { name: 'tools:guidance', text: 'tools' },
    ],
  }
  const result = patchPersonaAssembly(input, 'custom')
  assert.deepEqual(result.assembly.sections, [
    { name: 'harness:identity', text: 'identity' },
    { name: PERSONA_SECTION, text: 'custom' },
  ])
})

test('inserts Persona first when no preferred anchor exists', () => {
  const input = { sections: [{ name: 'tools:guidance', text: 'tools' }] }
  const result = patchPersonaAssembly(input, 'custom')
  assert.deepEqual(result.assembly.sections, [{ name: PERSONA_SECTION, text: 'custom' }])
})

test('preserves non-section assembly metadata while truncating prompt sections', () => {
  const input = {
    sections: [
      { name: 'router-persona', text: 'router' },
      { name: PERSONA_SECTION, text: 'first', source: 'keep' },
      { name: 'tools:guidance', text: 'tools' },
    ],
    contexts: [{ name: 'runtime', text: 'context' }],
    tools: [{ name: 'pwsh' }],
    variables: { model: 'test' },
  }
  const result = patchPersonaAssembly(input, 'custom')
  assert.deepEqual(result.assembly.sections, [
    { name: 'router-persona', text: 'router' },
    { name: PERSONA_SECTION, text: 'custom', source: 'keep' },
  ])
  assert.deepEqual(result.assembly.contexts, input.contexts)
  assert.deepEqual(result.assembly.tools, input.tools)
  assert.deepEqual(result.assembly.variables, input.variables)
})

test('leaves the assembly unchanged when no override is active', () => {
  const input = { sections: [{ name: 'harness:identity', text: 'identity' }] }
  const result = patchPersonaAssembly(input, null)
  assert.equal(result.assembly, input)
  assert.deepEqual(result.status, {
    applied: false,
    hadSection: false,
    inserted: false,
    minimal: false,
    removedSections: [],
  })
})
