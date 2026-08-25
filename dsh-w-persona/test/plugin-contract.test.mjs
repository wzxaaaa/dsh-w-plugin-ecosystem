import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { updatePersonaPatch } from '../persona-patch-core.js'

const host = await readFile(new URL('../index.js', import.meta.url), 'utf8')
const client = await readFile(new URL('../client.js', import.meta.url), 'utf8')

test('registers a complete host and client template protocol', () => {
  for (const method of ['saveConfiguration', 'saveTemplate', 'deleteTemplate', 'applyTemplate']) {
    assert.match(host, new RegExp(`Remote\\('${method}'\\)`))
    assert.match(client, new RegExp(`descriptor\\("${method}"`))
  }
  assert.match(host, /\.dsh-w-persona-templates\.json/)
  assert.match(host, /matchingPersonaTemplateId/)
  assert.match(client, /templateSaveNew/)
  assert.match(client, /templateOverwrite/)
  assert.match(client, /templateApply/)
  assert.match(client, /templateDelete/)
  assert.doesNotMatch(client, /Promise\.all\(\[save\(/)
})

test('persona patch updates preserve unrelated profile rows and config', () => {
  const rows = [
    { id: 'other', config: { enabled: true } },
    { id: 'system-prompt', config: { promptMaxChars: 1000, persona: 'old' } },
  ]
  assert.deepEqual(updatePersonaPatch(rows, 'new', 'default'), [
    { id: 'other', config: { enabled: true } },
    { id: 'system-prompt', config: { promptMaxChars: 1000, persona: 'new' } },
  ])
  assert.deepEqual(updatePersonaPatch(rows, 'default', 'default'), [
    { id: 'other', config: { enabled: true } },
    { id: 'system-prompt', config: { promptMaxChars: 1000 } },
  ])
})
