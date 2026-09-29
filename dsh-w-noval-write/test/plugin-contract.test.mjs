import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'

const host = await readFile(new URL('../index.js', import.meta.url), 'utf8')
const client = await readFile(new URL('../client.js', import.meta.url), 'utf8')

test('registers /write through the host command registry', () => {
  assert.match(host, /scope\.commands\.register\(\{/)
  assert.match(host, /name: 'write'/)
  assert.match(host, /hint: '\[<写作任务>\|edit <写作任务>\|clear\]'/)
  assert.match(host, /join\(this\.root, 'session-links\.json'\)/)
  assert.match(host, /writeAtomic\(this\.writeLinksPath, nextStore\)/)
  assert.match(host, /Remote\('getLink'\)/)
  assert.match(host, /submitWriteFollowup/)
  assert.doesNotMatch(host, /noval-write\/change/)
  assert.doesNotMatch(host, /sessionProjections/)
  assert.doesNotMatch(host, /setEnabled|enabled:/)
})

test('registers its client event through the alpha.4 uiConversation service', () => {
  assert.match(client, /var inject = \["slots", "locale", "remote", "uiConversation"\]/)
  assert.match(client, /ctx\.uiConversation\.events\.register\(writeCommandInputDefinition\)/)
  assert.doesNotMatch(client, /conversationEvents/)
})

test('mounts the exact right-sidebar rail, card, and page protocol', () => {
  assert.match(client, /ctx\.slots\.inject\("right-sidebar\.rail"/)
  assert.match(client, /ctx\.slots\.inject\("right-sidebar\.card"/)
  assert.match(client, /ctx\.slots\.inject\("right-sidebar\.page"/)
  assert.match(client, /owner\.activeId === "noval-write"/)
  assert.match(client, /props\.useSessions/)
  assert.match(client, /props\.useWorkspaces/)
  assert.match(client, /conversation\.input\.dock/)
  assert.match(client, /descriptor\("getLink"/)
  assert.match(client, /loadLink: function/)
  assert.doesNotMatch(client, /useProjection\("novalWrite"\)/)
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
  assert.match(client, /function OutlineTab/)
  assert.match(client, /tab_outline: "大纲"/)
  assert.match(client, /discardConfirm/)
})

test('declares the knowledge-base integration without embedding its store', () => {
  assert.match(host, /ctx\.inject\(\['knowledgeBase'\]/)
  assert.match(host, /setMode\('writing'\)/)
  assert.doesNotMatch(host, /KnowledgeStore/)
})

test('stores each novel in its own workspace folder, binds conversations, and exposes free model data tools', () => {
  assert.match(host, /join\(this\.workspaceRecord\(String\(handle\)\)\.path, NOVEL_DIR, NOVEL_STATE_FILE\)/)
  assert.match(host, /join\(this\.root, 'session-novels\.json'\)/)
  assert.match(host, /code = 'NOVEL_NOT_BOUND'/)
  for (const method of ['listNovels', 'getBinding', 'bindNovel', 'unbindNovel', 'createNovel']) assert.match(host, new RegExp(`Remote\\('${method}'\\)`))
  for (const name of ['novel_schema', 'novel_read', 'novel_save_chapter', 'novel_patch', 'novel_character_patch', 'novel_relationship_patch', 'novel_outline_read', 'novel_volume_upsert', 'novel_chapter_upsert', 'novel_chapter_remove', 'novel_chapter_reorder', 'novel_threads', 'novel_thread_upsert', 'novel_thread_remove', 'novel_write', 'novel_advance']) {
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
  assert.match(host, /if \(keepsThreads\) project\.threads = current\.project\.threads/)
  assert.match(host, /mutationRoundGuard\.check/)
  assert.match(host, /mutationRoundGuard\.record/)
  assert.match(host, /saveWorkspaceManuscript/)
  assert.match(host, /verified: true/)
  assert.match(host, /noFileWritten: true/)
  assert.doesNotMatch(host, /project: \{ type: 'json'/)
})

test('the panel never calls a native dialog, which strands keyboard focus in Electron on Windows', () => {
  assert.doesNotMatch(client, /window\.(confirm|alert|prompt)\(\s*[^)\s]/)
})

test('registers chapter search and the progression tools, and ships the search module', async () => {
  const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'))
  assert.ok(manifest.files.includes('noval-search-core.js'))
  for (const name of ['novel_search', 'novel_progression_read', 'novel_progression_templates', 'novel_progression_record', 'novel_progression_remove']) {
    assert.match(host, new RegExp(`name: '${name}'`))
  }
  assert.match(host, /import \{ searchManuscripts \} from '\.\/noval-search-core\.js'/)
  // Progression templates are shared by every book and live in the plugin's
  // own data folder, never in the hot-reloaded profile patch.
  assert.match(host, /join\(this\.root, 'progression-templates\.json'\)/)
  for (const method of ['getProgressionTemplates', 'saveProgressionTemplate', 'deleteProgressionTemplate', 'restoreProgressionTemplates']) {
    assert.match(host, new RegExp(`Remote\\('${method}'\\)`))
    assert.match(client, new RegExp(`descriptor\\("${method}"`))
  }
  // Complete rewrites and panel saves that omit progression keep the ledger.
  assert.match(host, /const keepsProgression = !Object\.hasOwn\(args\.project, 'progression'\)/)
  assert.match(host, /const keepsProgression = !Object\.hasOwn\(input, 'progression'\)/)
  assert.match(client, /tab_progression: "体系"/)
})
