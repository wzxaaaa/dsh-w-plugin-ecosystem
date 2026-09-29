import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const host = await readFile(new URL('../index.js', import.meta.url), 'utf8')
const client = await readFile(new URL('../client.js', import.meta.url), 'utf8')
const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'))

test('host and client agree on the Remote protocol', () => {
  assert.match(host, /super\(ctx, 'deslopWriter'\)/)
  for (const method of ['getState', 'saveConfig', 'previewScan']) {
    assert.match(host, new RegExp(`Remote\\('${method}'\\)`))
    assert.match(client, new RegExp(`descriptor\\("${method}"`))
  }
  assert.match(client, /id: "dsh-w-deslop#deslopWriter\/"/)
  assert.match(client, /key: "dsh-w-deslop"/)
})

test('every entry point is gated on the novel plugin and a /write link', () => {
  assert.match(host, /ctx\.inject\(\['novalWriter', 'systemPrompt'\]/)
  assert.match(host, /ctx\.inject\(\['novalWriter', 'commands'\]/)
  assert.match(host, /writer\.linkForAgent\(agent\)/)
  assert.match(host, /writer\.novelForAgentSync\(agent\)/)
  assert.match(host, /DESLOP_INACTIVE/)
  // The release effect must compare against the captured instance: by cleanup
  // time scope.novalWriter is already undefined and the reference would go stale.
  assert.match(host, /const writer = scope\.novalWriter/)
  assert.match(host, /if \(this\.novalWriter === writer\) this\.novalWriter = undefined/)
  assert.equal(manifest.peerDependenciesMeta['dsh-w-noval-write'].optional, true)
})

test('settings never touch the hot-reloaded profile patch', () => {
  assert.doesNotMatch(host, /cordis\.patch\.yml['"]/)
  assert.match(host, /\.dsh-w-deslop\.json/)
})

test('manifest ships every runtime file and exports package.json', () => {
  for (const file of ['index.js', 'client.js', 'deslop-core.js', 'cordis.patch.yml']) assert.ok(manifest.files.includes(file), file)
  assert.equal(manifest.exports['./package.json'], './package.json')
  assert.equal(manifest.dsh.bundle.patch, './cordis.patch.yml')
})
