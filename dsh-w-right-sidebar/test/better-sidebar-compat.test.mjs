import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'

const client = await readFile(new URL('../client.js', import.meta.url), 'utf8')
const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'))

test('ships the 0.19 native-sidebar bridge without applying legacy panel CSS', () => {
  assert.equal(manifest.version, '0.8.1')
  assert.match(client, /features\.indexOf\("fileIcons"\)/)
  assert.match(client, /ctx\.get\("sidebarRight"\)/)
  assert.match(client, /sidebar\.isExpanded\(\)/)
  assert.match(client, /sidebar\.toggleExpanded\(\)/)
  assert.match(client, /tab\.id === "editor"/)
  assert.match(client, /service\.openTab\(\{ type: nativeDescriptor\.id/)
  assert.doesNotMatch(client, /body\[data-dshwrs-better-bridge\] \[data-dsh-better-sidebar\] \[data-dsh-panel\]/)
})

test('retains the 0.18 legacy bridge behind a legacy-only selector', () => {
  assert.match(client, /data-dshwrs-better-mode=legacy/)
  assert.match(client, /\[data-dsh-toggle-cluster\]/)
  assert.match(client, /betterPanelToggle/)
})
