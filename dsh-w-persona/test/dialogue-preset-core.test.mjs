import test from 'node:test'
import assert from 'node:assert/strict'
import {
  defaultDialoguePreset,
  dialoguePresetTurns,
  hasCompleteDialoguePreset,
  normalizeDialoguePreset,
} from '../dialogue-preset-core.js'

test('normalizes absent and partial values to the stable persisted shape', () => {
  assert.deepEqual(normalizeDialoguePreset(), defaultDialoguePreset())
  assert.deepEqual(normalizeDialoguePreset({ enabled: true, user1: 'hello' }), {
    enabled: true,
    user1: 'hello',
    assistant1: '',
    user2: '',
    assistant2: '',
  })
})

test('rejects non-string preset fields', () => {
  assert.throws(
    () => normalizeDialoguePreset({ user1: 1 }),
    /dialogue preset user1 must be a string/,
  )
})

test('only complete enabled presets produce two role-correct turns', () => {
  const preset = {
    enabled: true,
    user1: 'u1',
    assistant1: 'a1',
    user2: 'u2',
    assistant2: 'a2',
  }
  assert.equal(hasCompleteDialoguePreset(preset), true)
  assert.deepEqual(dialoguePresetTurns(preset), [
    { role: 'user', text: 'u1' },
    { role: 'assistant', text: 'a1' },
    { role: 'user', text: 'u2' },
    { role: 'assistant', text: 'a2' },
  ])
})

test('disabled or incomplete presets are inert', () => {
  const preset = normalizeDialoguePreset({ enabled: true, user1: 'u1' })
  assert.equal(hasCompleteDialoguePreset(preset), false)
  assert.deepEqual(dialoguePresetTurns(preset), [])
  assert.deepEqual(dialoguePresetTurns({ ...preset, enabled: false }), [])
})
