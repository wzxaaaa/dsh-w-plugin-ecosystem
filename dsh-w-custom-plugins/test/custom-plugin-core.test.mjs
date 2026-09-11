import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'

import { compareSemver, isCustomModule } from '../custom-plugin-core.js'

const host = await readFile(new URL('../index.js', import.meta.url), 'utf8')
const client = await readFile(new URL('../client.js', import.meta.url), 'utf8')

test('lists third-party package plugins', () => {
  assert.equal(isCustomModule('dsh-w-route-primer'), true)
  assert.equal(isCustomModule('@community/plugin'), true)
})

test('hides shipped, builtin, and internal filesystem modules', () => {
  assert.equal(isCustomModule('@deepseek-ai/dsh-tools'), false)
  assert.equal(isCustomModule('cordis:group'), false)
  assert.equal(isCustomModule('./route-primer-bootstrap.mjs'), false)
  assert.equal(isCustomModule('../shared/bootstrap.mjs'), false)
  assert.equal(isCustomModule('file:///tmp/bootstrap.mjs'), false)
  assert.equal(isCustomModule('C:\\plugins\\bootstrap.mjs'), false)
})

test('compares stable and prerelease plugin versions without downgrading', () => {
  assert.equal(compareSemver('0.3.2', '0.3.1'), 1)
  assert.equal(compareSemver('0.3.2', '0.3.2'), 0)
  assert.equal(compareSemver('0.4.0-alpha.1', '0.4.0-alpha.2'), -1)
  assert.equal(compareSemver('0.4.0', '0.4.0-alpha.9'), 1)
  assert.equal(compareSemver('not-semver', '1.0.0'), undefined)
})

test('publishes the per-card online update protocol on host and client', () => {
  assert.match(host, /Remote\('requestUpdate'\)/)
  assert.match(host, /raw\.githubusercontent\.com\/wzxaaaa\/dsh-w-plugin-ecosystem\/main/)
  assert.match(host, /registry\.npmjs\.org/)
  assert.match(host, /installArchive/)
  assert.match(client, /descriptor\("requestUpdate"/)
  assert.match(client, /dshwcp-update/)
  assert.match(client, /restartRequired/)
})
