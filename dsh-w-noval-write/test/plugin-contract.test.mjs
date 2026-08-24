import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'

const host = await readFile(new URL('../index.js', import.meta.url), 'utf8')
const client = await readFile(new URL('../client.js', import.meta.url), 'utf8')

test('registers /write through the host command registry', () => {
  assert.match(host, /scope\.commands\.register\(\{/)
  assert.match(host, /name: 'write'/)
  assert.match(host, /hint: '\[<写作任务>\|edit <写作任务>\|clear\]'/)
  assert.match(host, /agent\.session\.append\('noval-write\/change'/)
  assert.match(host, /key: 'novalWrite'/)
  assert.match(host, /submitWriteFollowup/)
  assert.doesNotMatch(host, /setEnabled|enabled:/)
})

test('mounts the exact right-sidebar rail, card, and page protocol', () => {
  assert.match(client, /ctx\.slots\.inject\("right-sidebar\.rail"/)
  assert.match(client, /ctx\.slots\.inject\("right-sidebar\.card"/)
  assert.match(client, /ctx\.slots\.inject\("right-sidebar\.page"/)
  assert.match(client, /owner\.activeId === "noval-write"/)
  assert.match(client, /props\.useSessions/)
  assert.match(client, /props\.useWorkspaces/)
  assert.match(client, /conversation\.input\.dock/)
  assert.match(client, /useProjection\("novalWrite"\)/)
  assert.match(client, /noval-write-command-input/)
  assert.doesNotMatch(client, /setEnabled|modeOff|modeOn/)
})

test('offers workspace framework import, export, and confirmed reset settings', () => {
  for (const method of ['exportProject', 'importProject', 'resetProject']) {
    assert.match(host, new RegExp(`Remote\\('${method}'\\)`))
    assert.match(client, new RegExp(`descriptor\\("${method}"`))
  }
  assert.match(client, /tab_settings: "设置"/)
  assert.match(client, /function SettingsTab/)
  assert.match(client, /clearConfirmAction/)
  assert.match(client, /accept: "\.json,application\/json"/)
  assert.match(client, /container:novel-panel \/ inline-size/)
  assert.match(client, /@container novel-panel \(max-width:430px\)/)
  assert.match(client, /function SettingIcon/)
})

test('declares the knowledge-base integration without embedding its store', () => {
  assert.match(host, /ctx\.inject\(\['knowledgeBase'\]/)
  assert.match(host, /setMode\('writing'\)/)
  assert.doesNotMatch(host, /KnowledgeStore/)
})

test('stores one project per Harness workspace and exposes free model data tools', () => {
  assert.match(host, /join\(this\.root, 'workspaces', String\(workspaceId\), 'project\.json'\)/)
  for (const name of ['novel_schema', 'novel_read', 'novel_save_chapter', 'novel_patch', 'novel_write', 'novel_advance']) {
    assert.match(host, new RegExp(`name: '${name}'`))
  }
  assert.match(host, /project: projectToolSchema\(\{ partial: false, required: true \}\)/)
  assert.match(host, /patch: projectToolSchema\(\{ partial: true, required: true \}\)/)
  assert.match(host, /expected_revision: \{ type: 'integer', required: true/)
  assert.match(host, /assertProjectShape\(args\?\.project, \{ partial: false \}\)/)
  assert.match(host, /finalizeContent: mutationFailureContent\('project'\)/)
  assert.match(host, /noDataWritten: true/)
  assert.match(host, /contract: novelToolContract\(\)/)
  assert.match(host, /changed: false, stop: true/)
  assert.match(host, /concludeStoppedMutation/)
  assert.match(host, /replace_progress/)
  assert.match(host, /project\.progress = current\.project\.progress/)
  assert.match(host, /mutationRoundGuard\.check/)
  assert.match(host, /mutationRoundGuard\.record/)
  assert.match(host, /saveWorkspaceManuscript/)
  assert.match(host, /verified: true/)
  assert.match(host, /noFileWritten: true/)
  assert.doesNotMatch(host, /project: \{ type: 'json'/)
})
