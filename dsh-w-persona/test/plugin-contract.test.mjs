import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { personaFromConfig, rewritePersonaAssembly, updatePersonaPatch } from '../persona-patch-core.js'

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
    { id: 'system-prompt', config: { promptMaxChars: 1000, persona: 'old', personaSuffix: 'suffix' } },
  ]
  assert.deepEqual(updatePersonaPatch(rows, 'new', 'default'), [
    { id: 'other', config: { enabled: true } },
    { id: 'system-prompt', config: { promptMaxChars: 1000, personaSuffix: 'suffix', personaPrefix: 'new' } },
  ])
  assert.deepEqual(updatePersonaPatch(rows, 'default', 'default'), [
    { id: 'other', config: { enabled: true } },
    { id: 'system-prompt', config: { promptMaxChars: 1000, personaSuffix: 'suffix' } },
  ])
})

test('reads current personaPrefix first and accepts legacy persona patches', () => {
  assert.equal(personaFromConfig({ personaPrefix: 'current', persona: 'legacy' }), 'current')
  assert.equal(personaFromConfig({ persona: 'legacy' }), 'legacy')
  assert.equal(personaFromConfig({}), undefined)
  assert.throws(() => personaFromConfig({ personaPrefix: false }), /personaPrefix must be a string/)
})

test('host rewrites both current and legacy assembled persona section names', () => {
  const assembly = {
    sections: [
      { name: 'harness:identity', text: 'identity' },
      { name: 'deployment:persona-prefix', text: 'current default' },
      { name: 'deployment:persona', text: 'legacy default' },
      { name: 'tool:test', text: 'tool guidance' },
    ],
    contexts: [], tools: [], variables: {},
  }
  assert.deepEqual(rewritePersonaAssembly(assembly, 'custom').sections, [
    { name: 'harness:identity', text: 'identity' },
    { name: 'deployment:persona-prefix', text: 'custom' },
    { name: 'deployment:persona', text: 'custom' },
    { name: 'tool:test', text: 'tool guidance' },
  ])
  assert.match(host, /rewritePersonaAssembly\(assembled, custom\)/)
})
