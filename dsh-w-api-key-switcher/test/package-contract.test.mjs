import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'))
const host = await readFile(new URL('../index.js', import.meta.url), 'utf8')
const client = await readFile(new URL('../client.js', import.meta.url), 'utf8')

test('publishes one host service and one provider-card client extension', () => {
  assert.equal(manifest.name, 'dsh-w-api-key-switcher')
  assert.equal(manifest.dsh.bundle.patch, './cordis.patch.yml')
  assert.ok(manifest.dsh.client.inject.includes('@deepseek-ai/dsh-client-ui-settings-models'))
  assert.match(host, /super\(ctx, 'apiKeySwitcher'\)/u)
  assert.match(client, /settings\.models\.provider-card/u)
  assert.match(client, /"llm-pi-ai", "llm-deepseek"/u)
  assert.match(client, /key: settingsNs/u)
  assert.match(host, /DEEPSEEK_PROVIDER = 'deepseek-official'/u)
  assert.match(host, /DEEPSEEK_DEFAULT_REF = 'DEEPSEEK_API_KEY'/u)
})

test('never returns stored secret fields in the client projection', () => {
  assert.doesNotMatch(client, /\.apiKey\b[^\n]*entry/u)
  assert.match(host, /projectVault\(vault, resolved\?\.value/u)
})

test('edit form submits a replacement secret only when entered', () => {
  assert.match(client, /if \(edit\.apiKey\.trim\(\)\) payload\.apiKey = edit\.apiKey/u)
  assert.match(client, /value: edit\.apiKey/u)
  assert.match(host, /await this\.ctx\.credentials\.set\(ref, updatedEntry\.apiKey\)/u)
})
