import assert from 'node:assert/strict'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { defaultState } from '../noval-write-core.js'
import {
  createNovelFolder,
  findNovel,
  migrateLegacyProject,
  normalizeBindingStore,
  novelHandle,
  parseNovelHandle,
  sanitizeFolderName,
  scanNovels,
  uniqueFolderName,
} from '../noval-library.js'

function tempWorkspace(t) {
  const root = mkdtempSync(join(tmpdir(), 'novel-library-'))
  t.after(() => rmSync(root, { recursive: true, force: true }))
  return root
}

test('folder names are safe on every platform and never collide', t => {
  assert.equal(sanitizeFolderName('长夜:灯火/续?'), '长夜 灯火 续')
  assert.equal(sanitizeFolderName('长夜：灯火'), '长夜：灯火', 'full-width punctuation is valid on Windows')
  assert.equal(sanitizeFolderName('  ..hidden. '), 'hidden')
  assert.equal(sanitizeFolderName('CON'), '未命名小说')
  assert.equal(sanitizeFolderName(''), '未命名小说')
  const root = tempWorkspace(t)
  mkdirSync(join(root, '长夜'))
  assert.equal(uniqueFolderName(root, '长夜'), '长夜 2')
  assert.equal(uniqueFolderName(root, '别的书'), '别的书')
})

test('handles round-trip and reject values that do not name a novel', () => {
  assert.deepEqual(parseNovelHandle(novelHandle('ws#1', 'n1')), { workspaceId: 'ws#1', novelId: 'n1' })
  assert.throws(() => parseNovelHandle('ws1'), error => error.code === 'NOVEL_HANDLE_INVALID')
  assert.throws(() => parseNovelHandle('ws1#'), error => error.code === 'NOVEL_HANDLE_INVALID')
})

test('new novels get their own folder and stay findable after a rename', t => {
  const root = tempWorkspace(t)
  const state = defaultState(0)
  state.project.title = '长夜灯火'
  const first = createNovelFolder(root, { title: '长夜灯火' }, state)
  const second = createNovelFolder(root, { title: '长夜灯火' }, defaultState(0))
  assert.equal(first.folder, '长夜灯火')
  assert.equal(second.folder, '长夜灯火 2', 'a second book with the same title gets a new folder')
  assert.equal(JSON.parse(readFileSync(join(first.dir, '.novel', 'project.json'), 'utf8')).project.title, '长夜灯火')
  mkdirSync(join(root, '普通文件夹'))
  mkdirSync(join(root, '.git'))
  assert.deepEqual(scanNovels(root).map(novel => novel.folder), ['长夜灯火', '长夜灯火 2'])

  renameSync(first.dir, join(root, '改名后的书'))
  const found = findNovel(root, first.id, '长夜灯火')
  assert.equal(found.folder, '改名后的书', 'the id in .novel/novel.json survives a rename in the explorer')
  assert.equal(findNovel(root, 'missing'), null)
})

test('a legacy workspace project becomes the first novel folder with its history and chapters', t => {
  const root = tempWorkspace(t)
  const workspace = join(root, 'workspace')
  const legacy = join(root, 'legacy')
  mkdirSync(join(legacy, 'history'), { recursive: true })
  mkdirSync(workspace)
  const state = defaultState(0)
  state.revision = 7
  state.project.title = '旧书'
  state.project.volumes = [{ id: 'v1', title: '卷一', status: 'planned', summary: '', customFields: {}, chapters: [
    { id: 'c1', manuscriptFile: '第1章.md' },
    { id: 'c2', manuscriptFile: '第2章.md' },
    { id: 'c3', manuscriptFile: '不存在.md' },
  ] }]
  writeFileSync(join(legacy, 'project.json'), JSON.stringify(state))
  writeFileSync(join(legacy, 'history', 'index.json'), '{"version":1,"entries":[]}')
  writeFileSync(join(legacy, 'history', 'r7.json'), '{"revision":7}')
  writeFileSync(join(workspace, '第1章.md'), '正文一')
  writeFileSync(join(workspace, '第2章.md'), '正文二')
  writeFileSync(join(workspace, '无关笔记.md'), '不动')

  const result = migrateLegacyProject({ legacyDir: legacy, workspacePath: workspace, state })
  assert.equal(result.novel.folder, '旧书')
  assert.deepEqual(result.moved, ['第1章.md', '第2章.md'])
  assert.equal(readFileSync(join(workspace, '旧书', '第1章.md'), 'utf8'), '正文一')
  assert.equal(existsSync(join(workspace, '无关笔记.md')), true, 'unlinked files stay put')
  assert.equal(JSON.parse(readFileSync(join(workspace, '旧书', '.novel', 'project.json'), 'utf8')).revision, 7)
  assert.equal(existsSync(join(workspace, '旧书', '.novel', 'history', 'index.json')), true, 'history copies into a folder with a Chinese name')
  assert.equal(readFileSync(join(workspace, '旧书', '.novel', 'history', 'r7.json'), 'utf8'), '{"revision":7}')
  assert.equal(existsSync(join(legacy, 'project.json')), false)
  assert.equal(existsSync(join(legacy, 'project.json.migrated')), true, 'the legacy file is kept as a backup')
})

test('migration leaves a chapter in place when the target name is taken', t => {
  const root = tempWorkspace(t)
  const workspace = join(root, 'workspace')
  const legacy = join(root, 'legacy')
  mkdirSync(legacy, { recursive: true })
  mkdirSync(join(workspace, '书', '.novel'), { recursive: true })
  const state = defaultState(0)
  state.project.title = '书'
  state.project.volumes = [{ id: 'v1', chapters: [{ id: 'c1', manuscriptFile: 'a.md' }] }]
  writeFileSync(join(legacy, 'project.json'), JSON.stringify(state))
  writeFileSync(join(workspace, 'a.md'), 'root copy')
  const result = migrateLegacyProject({ legacyDir: legacy, workspacePath: workspace, state })
  assert.equal(result.novel.folder, '书 2', 'an existing folder is not reused')
  assert.deepEqual(result.moved, ['a.md'])
})

test('the binding table keeps only complete session bindings', () => {
  const store = normalizeBindingStore({ bindings: {
    s1: { workspaceId: 'w', novelId: 'n', folder: '书' },
    s2: { workspaceId: 'w' },
    ' ': { workspaceId: 'w', novelId: 'n' },
    s3: null,
  } })
  assert.deepEqual(Object.keys(store.bindings), ['s1'])
  assert.equal(store.bindings.s1.folder, '书')
  assert.deepEqual(normalizeBindingStore(null), { version: 1, bindings: {} })
})
