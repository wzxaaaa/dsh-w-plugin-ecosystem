import test from 'node:test'
import assert from 'node:assert/strict'
import {
  defaultPersonaTemplateLibrary,
  deletePersonaTemplate,
  matchingPersonaTemplateId,
  normalizePersonaTemplateLibrary,
  personaTemplateMatches,
  savePersonaTemplate,
} from '../persona-template-core.js'

const preset = { enabled: true, user1: 'u1', assistant1: 'a1', user2: 'u2', assistant2: 'a2' }

test('creates, updates, matches, and deletes a complete persona template', () => {
  const created = savePersonaTemplate(defaultPersonaTemplateLibrary(), {
    name: '侦探', persona: '保持冷静。', dialoguePreset: preset,
  }, { id: 'template-1', now: '2026-08-25T00:00:00.000Z' })
  assert.equal(created.template.name, '侦探')
  assert.equal(personaTemplateMatches(created.template, '保持冷静。', preset), true)
  assert.equal(matchingPersonaTemplateId(created.library, '保持冷静。', preset), 'template-1')

  const updated = savePersonaTemplate(created.library, {
    id: 'template-1', name: '硬汉侦探', persona: '使用短句。', dialoguePreset: { enabled: false },
  }, { now: '2026-08-25T01:00:00.000Z' })
  assert.equal(updated.library.templates.length, 1)
  assert.equal(updated.template.createdAt, '2026-08-25T00:00:00.000Z')
  assert.equal(updated.template.updatedAt, '2026-08-25T01:00:00.000Z')
  assert.equal(deletePersonaTemplate(updated.library, 'template-1').templates.length, 0)
})

test('normalization rejects unsupported, duplicate, and malformed libraries', () => {
  assert.throws(() => normalizePersonaTemplateLibrary({ version: 2, templates: [] }), /unsupported/)
  const one = savePersonaTemplate(null, { name: 'A', persona: '', dialoguePreset: {} }, { id: 'a', now: 'now' }).library
  assert.throws(() => savePersonaTemplate(one, { name: 'a', persona: '', dialoguePreset: {} }, { id: 'b', now: 'later' }), /already exists/)
  assert.throws(() => deletePersonaTemplate(one, 'missing'), /unknown/)
})
