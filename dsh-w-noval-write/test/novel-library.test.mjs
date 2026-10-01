import assert from 'node:assert/strict'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, renameSync, rmdirSync, rmSync, unlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { isAbsolute, join, relative, resolve } from 'node:path'
import { spawn } from 'node:child_process'
import { randomUUID } from 'node:crypto'
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
  t.after(() => {
    const local = relative(resolve(tmpdir()), resolve(root))
    assert.ok(local && !isAbsolute(local) && local !== '..' && !local.startsWith(`..${process.platform === 'win32' ? '\\' : '/'}`))
    rmSync(root, { recursive: true, force: true })
  })
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

function legacyFixture(t, blockedSecond = false) {
  const root = tempWorkspace(t)
  const workspacePath = join(root, 'workspace')
  const legacyDir = join(root, 'legacy')
  mkdirSync(workspacePath)
  mkdirSync(join(legacyDir, 'history'), { recursive: true })
  const state = defaultState(0)
  state.revision = 7
  state.project.title = '旧书'
  state.project.volumes = [{ id: 'v1', chapters: [
    { id: 'c1', manuscriptFile: 'first.md' },
    { id: 'c2', manuscriptFile: 'second.md' },
  ] }]
  writeFileSync(join(legacyDir, 'project.json'), JSON.stringify(state))
  writeFileSync(join(legacyDir, 'history', 'r6.json'), '{"revision":6}')
  writeFileSync(join(workspacePath, 'first.md'), 'FIRST')
  if (blockedSecond) mkdirSync(join(workspacePath, 'second.md'))
  else writeFileSync(join(workspacePath, 'second.md'), 'SECOND')
  return { workspacePath, legacyDir, state }
}

test('a failed migration keeps all sources and resumes the same complete book', t => {
  const input = legacyFixture(t, true)
  assert.throws(() => migrateLegacyProject(input), error => ['EISDIR', 'EPERM', 'EACCES'].includes(error.code))
  const journal = JSON.parse(readFileSync(join(input.legacyDir, 'migration.json'), 'utf8'))
  const pendingBook = join(input.workspacePath, journal.folder)
  assert.equal(readFileSync(join(input.workspacePath, 'first.md'), 'utf8'), 'FIRST', 'the original survives a later copy failure')
  assert.equal(readFileSync(join(pendingBook, 'first.md'), 'utf8'), 'FIRST')
  assert.equal(readFileSync(join(input.legacyDir, 'history', 'r6.json'), 'utf8'), '{"revision":6}')
  assert.equal(existsSync(join(input.legacyDir, 'project.json')), true)
  assert.equal(existsSync(join(input.legacyDir, 'migrated.json')), false)
  assert.deepEqual(scanNovels(input.workspacePath), [], 'a partial book is not selectable')

  rmdirSync(join(input.workspacePath, 'second.md'))
  writeFileSync(join(input.workspacePath, 'second.md'), 'SECOND')
  const result = migrateLegacyProject(input)
  assert.equal(result.novel.folder, journal.folder, 'retry reuses its reserved folder')
  assert.equal(result.novel.id, journal.novelId)
  assert.equal(readFileSync(join(result.novel.dir, 'first.md'), 'utf8'), 'FIRST')
  assert.equal(readFileSync(join(result.novel.dir, 'second.md'), 'utf8'), 'SECOND')
  assert.equal(readFileSync(join(result.novel.dir, '.novel', 'history', 'r6.json'), 'utf8'), '{"revision":6}')
  assert.deepEqual(scanNovels(input.workspacePath).map(book => book.id), [journal.novelId])
  assert.equal(existsSync(join(input.legacyDir, 'project.json')), false)
  assert.equal(existsSync(join(input.legacyDir, 'project.json.migrated')), true)
  assert.equal(readFileSync(join(input.workspacePath, 'first.md'), 'utf8'), 'FIRST', 'source manuscripts remain available as backups')
  assert.equal(readFileSync(join(input.legacyDir, 'history', 'r6.json'), 'utf8'), '{"revision":6}')
})

test('retry preserves a changed destination instead of overwriting it or splitting the book', t => {
  const input = legacyFixture(t, true)
  assert.throws(() => migrateLegacyProject(input))
  const journal = JSON.parse(readFileSync(join(input.legacyDir, 'migration.json'), 'utf8'))
  const destination = join(input.workspacePath, journal.folder, 'first.md')
  writeFileSync(destination, 'external edited copy')
  rmdirSync(join(input.workspacePath, 'second.md'))
  writeFileSync(join(input.workspacePath, 'second.md'), 'SECOND')
  assert.throws(() => migrateLegacyProject(input), error => error.code === 'NOVEL_COPY_CONFLICT')
  assert.equal(readFileSync(destination, 'utf8'), 'external edited copy')
  assert.equal(readFileSync(join(input.workspacePath, 'first.md'), 'utf8'), 'FIRST')
  assert.equal(existsSync(join(input.workspacePath, `${journal.folder} 2`)), false)
  assert.equal(existsSync(join(input.legacyDir, 'project.json')), true)
})

test('migration reservations accept collision suffixes on maximum-length book names', t => {
  const input = legacyFixture(t)
  input.state.project.title = '长'.repeat(60)
  writeFileSync(join(input.legacyDir, 'project.json'), JSON.stringify(input.state))
  mkdirSync(join(input.workspacePath, input.state.project.title))
  const result = migrateLegacyProject(input)
  assert.equal(result.novel.folder, `${input.state.project.title} 2`)
  assert.equal(scanNovels(input.workspacePath).length, 1)
})

function ownerCrashFixture(t) {
  const input = legacyFixture(t, true)
  assert.throws(() => migrateLegacyProject(input))
  const journalPath = join(input.legacyDir, 'migration.json')
  const journal = JSON.parse(readFileSync(journalPath, 'utf8'))
  const novelDirectory = join(input.workspacePath, journal.folder, '.novel')
  unlinkSync(join(novelDirectory, 'migration.json'))
  unlinkSync(join(input.workspacePath, journal.folder, 'first.md'))
  for (const file of journal.files) delete file.sha256
  writeFileSync(journalPath, JSON.stringify(journal))
  rmdirSync(join(input.workspacePath, 'second.md'))
  writeFileSync(join(input.workspacePath, 'second.md'), 'SECOND')
  return { input, journal, journalPath, novelDirectory }
}

test('a crash during an empty or partial reserved owner write resumes the same novel', async t => {
  for (const [label, content] of [['empty', ''], ['partial', '{"version":1,']]) {
    await t.test(label, t => {
      const { input, journal, novelDirectory } = ownerCrashFixture(t)
      const temporary = join(novelDirectory, `migration.json.${journal.reservationToken}.tmp`)
      writeFileSync(temporary, content)
      const result = migrateLegacyProject(input)
      assert.equal(result.novel.id, journal.novelId)
      assert.equal(result.novel.folder, journal.folder)
      assert.equal(readFileSync(join(result.novel.dir, 'first.md'), 'utf8'), 'FIRST')
      assert.equal(readFileSync(join(result.novel.dir, 'second.md'), 'utf8'), 'SECOND')
      assert.equal(readFileSync(join(result.novel.dir, '.novel', 'history', 'r6.json'), 'utf8'), '{"revision":6}')
      assert.equal(scanNovels(input.workspacePath).length, 1)
      assert.equal(existsSync(temporary), false)
    })
  }
})

test('legacy journals recover only complete temporary owners naming their exact reserved novel', t => {
  const { input, journal, journalPath, novelDirectory } = ownerCrashFixture(t)
  delete journal.reservationToken
  writeFileSync(journalPath, JSON.stringify(journal))
  const temporary = join(novelDirectory, `migration.json.12345.${randomUUID()}.tmp`)
  writeFileSync(temporary, JSON.stringify({ version: 1, novelId: journal.novelId }))
  assert.equal(migrateLegacyProject(input).novel.id, journal.novelId)
  assert.equal(scanNovels(input.workspacePath).length, 1)
})

test('owner recovery refuses another book, extra metadata, or unrelated files in the reservation', async t => {
  for (const label of ['another book', 'extra metadata', 'unrelated file']) {
    await t.test(label, t => {
      const { input, journal, novelDirectory } = ownerCrashFixture(t)
      const filename = label === 'unrelated file' ? 'unrelated.txt' : `migration.json.${journal.reservationToken}.tmp`
      const content = label === 'another book'
        ? JSON.stringify({ version: 1, novelId: 'another-book-id' })
        : label === 'extra metadata'
          ? JSON.stringify({ version: 1, novelId: journal.novelId, unrelated: true })
          : 'unrelated data'
      const path = join(novelDirectory, filename)
      writeFileSync(path, content)
      assert.throws(() => migrateLegacyProject(input), error => error.code === 'NOVEL_MIGRATION_CONFLICT')
      assert.equal(readFileSync(path, 'utf8'), content)
      assert.equal(readFileSync(join(input.workspacePath, 'first.md'), 'utf8'), 'FIRST')
      assert.equal(existsSync(join(input.legacyDir, 'project.json')), true)
      assert.deepEqual(scanNovels(input.workspacePath), [])
    })
  }
})

test('Windows temporarily locked manuscripts resume without stranding the first chapter or history', { skip: process.platform !== 'win32' }, async t => {
  const input = legacyFixture(t)
  const filename = join(input.workspacePath, 'second.md').replaceAll("'", "''")
  const script = `$stream=[System.IO.File]::Open('${filename}',[System.IO.FileMode]::Open,[System.IO.FileAccess]::Read,[System.IO.FileShare]::None); Write-Output 'LOCKED'; Start-Sleep -Seconds 30; $stream.Dispose()`
  const child = spawn(join(process.env.SystemRoot || 'C:\\Windows', 'System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe'),
    ['-NoLogo', '-NoProfile', '-NonInteractive', '-EncodedCommand', Buffer.from(script, 'utf16le').toString('base64')], { windowsHide: true })
  let exited = false
  const exit = new Promise(resolve => child.once('exit', () => { exited = true; resolve() }))
  try {
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('the test file-lock helper did not become ready')), 5000)
      child.stdout.on('data', data => { if (String(data).includes('LOCKED')) { clearTimeout(timer); resolve() } })
      child.once('error', error => { clearTimeout(timer); reject(error) })
      child.once('exit', () => { clearTimeout(timer); reject(new Error('the test file-lock helper exited early')) })
    })
    assert.throws(() => migrateLegacyProject(input), error => ['EBUSY', 'EACCES', 'EPERM'].includes(error.code))
    const journal = JSON.parse(readFileSync(join(input.legacyDir, 'migration.json'), 'utf8'))
    assert.equal(readFileSync(join(input.workspacePath, 'first.md'), 'utf8'), 'FIRST')
    assert.equal(readFileSync(join(input.legacyDir, 'history', 'r6.json'), 'utf8'), '{"revision":6}')
    assert.deepEqual(scanNovels(input.workspacePath), [])
    child.kill()
    await exit
    const result = migrateLegacyProject(input)
    assert.equal(result.novel.id, journal.novelId)
    assert.equal(readFileSync(join(result.novel.dir, 'first.md'), 'utf8'), 'FIRST')
    assert.equal(readFileSync(join(result.novel.dir, 'second.md'), 'utf8'), 'SECOND')
    assert.equal(readFileSync(join(result.novel.dir, '.novel', 'history', 'r6.json'), 'utf8'), '{"revision":6}')
    assert.equal(scanNovels(input.workspacePath).length, 1)
  } finally {
    if (!exited) { child.kill(); await exit }
  }
})
