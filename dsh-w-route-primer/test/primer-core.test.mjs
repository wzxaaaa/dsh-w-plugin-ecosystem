import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

import {
  EDITOR_PACKAGE,
  MODULE_MARKER,
  PRESET_MARKER,
  ROUTER_BOOTSTRAP_FILE,
  managedModuleSource,
  managedPresetComposition,
  managedPresetMetadata,
} from '../primer-core.js'

test('managed preset preserves Standard and mounts editor plus scoped router once', async () => {
  const path = 'E:/deepseek-harness/apps/cli/config/agent-presets/standard/agent.cordis.yml'
  const standard = await readFile(path, 'utf8')
  const managed = managedPresetComposition(standard)
  assert.ok(managed.startsWith(PRESET_MARKER))
  assert.ok(managed.includes(standard.trimEnd()))
  assert.match(managed, /@deepseek-ai\/dsh-tool-fs/)
  assert.match(managed, /@deepseek-ai\/dsh-tool-subagent/)
  assert.match(managed, /@deepseek-ai\/dsh-tool-web/)
  assert.equal(managed.split(EDITOR_PACKAGE).length - 1, 1)
  assert.equal(managed.split(ROUTER_BOOTSTRAP_FILE).length - 1, 1)

  const alreadyMounted = managedPresetComposition(
    `${standard}\n- id: editor\n  name: '${EDITOR_PACKAGE}'\n- id: router\n  name: ./${ROUTER_BOOTSTRAP_FILE}\n`,
  )
  assert.equal(alreadyMounted.split(EDITOR_PACKAGE).length - 1, 1)
  assert.equal(alreadyMounted.split(ROUTER_BOOTSTRAP_FILE).length - 1, 1)
})

test('managed router modules use a JavaScript-safe ownership marker', () => {
  const managed = managedModuleSource('export const value = 1\n')
  assert.ok(managed.startsWith(MODULE_MARKER))
  assert.match(managed, /export const value = 1/)
  assert.throws(() => managedModuleSource('  '), /empty/)
})

test('preset metadata describes routing-suite alignment and w-persona', () => {
  const metadata = managedPresetMetadata()
  assert.ok(metadata.startsWith(PRESET_MARKER))
  assert.match(metadata, /name: 路由预热模式/)
  assert.match(metadata, /近场引导/)
  assert.match(metadata, /w-persona/)
  assert.match(metadata, /order: 2\.5/)
})
