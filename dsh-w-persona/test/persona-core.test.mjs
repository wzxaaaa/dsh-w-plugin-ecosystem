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

test('replaces an existing deployment persona section', () => {
  const input = {
    sections: [
      { name: 'harness:identity', text: 'identity' },
      { name: PERSONA_SECTION, text: 'preset' },
      { name: 'tool:read', text: 'read' },
    ],
    contexts: [],
    tools: [],
    variables: {},
  }
  const result = patchPersonaAssembly(input, 'custom')
  assert.deepEqual(result.status, { applied: true, hadSection: true, inserted: false })
  assert.equal(result.assembly.sections[1].text, 'custom')
  assert.equal(input.sections[1].text, 'preset')
})

test('inserts a missing deployment persona immediately after the harness identity', () => {
  const input = {
    sections: [
      { name: 'harness:identity', text: 'identity' },
      { name: 'tool:read', text: 'read' },
    ],
  }
  const result = patchPersonaAssembly(input, 'custom')
  assert.deepEqual(result.status, { applied: true, hadSection: false, inserted: true })
  assert.deepEqual(result.assembly.sections.map(section => section.name), [
    'harness:identity',
    PERSONA_SECTION,
    'tool:read',
  ])
})

test('inserts a missing deployment persona at the start when no harness identity exists', () => {
  const input = { sections: [{ name: 'tool:read', text: 'read' }] }
  const result = patchPersonaAssembly(input, 'custom')
  assert.deepEqual(result.assembly.sections.map(section => section.name), [
    PERSONA_SECTION,
    'tool:read',
  ])
  assert.deepEqual(result.status, { applied: true, hadSection: false, inserted: true })
})

test('leaves the assembly unchanged when no override is active', () => {
  const input = { sections: [{ name: 'harness:identity', text: 'identity' }] }
  const result = patchPersonaAssembly(input, null)
  assert.equal(result.assembly, input)
  assert.deepEqual(result.status, { applied: false, hadSection: false, inserted: false })
})
