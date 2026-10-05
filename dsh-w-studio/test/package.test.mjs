/** Verify shipped names, browser registration, and archive-facing entry declarations. */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { runInNewContext } from 'node:vm'
import { createRequire } from 'node:module'
import { join, resolve } from 'node:path'

const root = new URL('../', import.meta.url)
test('publishes one consistently named W-series plugin and bundle row', async () => {
  const manifest = JSON.parse(await readFile(new URL('package.json', root), 'utf8'))
  assert.equal(manifest.name, 'dsh-w-studio')
  assert.equal(manifest.exports['./client'], './client.js')
  assert.equal(manifest.dsh.bundle.patch, './cordis.patch.yml')
  assert.equal(manifest.dsh.client.platform, 'web')
  assert.ok(manifest.dsh.client.inject.includes('@deepseek-ai/dsh-client-ui-slots'))
  assert.match(await readFile(new URL('cordis.patch.yml', root), 'utf8'), /id: dsh-w-studio\s+name: dsh-w-studio/u)
  assert.ok(!JSON.stringify(manifest).includes('workspace:'))
})
test('loads the browser factory under its published module identity', async () => {
  let contribution
  runInNewContext(await readFile(new URL('client.js', root), 'utf8'), { window: { __ModuleLoader__: { load(value) { contribution = value } } } })
  assert.equal(contribution.id, 'dsh-w-studio')
  const harnessRoot = resolve(process.env.DSH_HARNESS_SOURCE || '../../../deepseek-harness')
  const dependencyRequire = createRequire(join(harnessRoot, 'packages/experimental/studio/package.json'))
  const plugin = contribution.factory(dependencyRequire)
  assert.equal(typeof plugin.apply, 'function')
  assert.ok(plugin.inject.includes('slots'))
  assert.ok(plugin.inject.includes('uiWorkspace'))
})
