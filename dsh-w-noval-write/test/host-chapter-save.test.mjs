import assert from 'node:assert/strict'
import { readFile, writeFile, access, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { test } from 'node:test'
import { defaultProject, removeChapter, normalizeWriteLinkStore } from '../noval-write-core.js'
import { saveWorkspaceManuscript } from '../noval-file-core.js'
import { hostFixture } from './helpers/host-fixture.mjs'

const project = targetWords => ({ ...defaultProject(), volumes: [{ id: 'v', chapters: [{ id: 'c', title: 'Chapter', targetWords }] }] })
const args = overrides => ({ filename: 'chapter.md', volume_id: 'v', chapter_id: 'c', content: '正文', ...overrides })

test('invalid chapter status is rejected before an existing manuscript changes', async t => {
  const f = await hostFixture(t)
  await f.setProject(project(''))
  const file = join(f.book.path, 'chapter.md')
  await writeFile(file, 'original prose')
  await assert.rejects(f.execute(args({ content: 'replacement', overwrite: true, chapter_status: 'x'.repeat(241) })), /240/)
  assert.equal(await readFile(file, 'utf8'), 'original prose')
})

test('failed project commit rolls back both new and overwritten prose', async t => {
  const f = await hostFixture(t)
  await f.setProject(project(''))
  const file = join(f.book.path, 'chapter.md')
  const previous = f.service.stateForWorkspace(f.handle).revision
  const rename = f.context.rename
  f.context.rename = async (from, to) => {
    if (to === f.service.statePath(f.handle)) throw Object.assign(new Error('fixture project write failed'), { code: 'EACCES' })
    return rename(from, to)
  }
  let failure
  await assert.rejects(f.execute(args()), error => { failure = error; return error.code === 'EACCES' })
  await assert.rejects(access(file), error => error.code === 'ENOENT')
  assert.equal(failure.fileWritten, false)
  const reply = JSON.parse(f.tool.finalizeContent({}, { isError: true, error: failure })[0].text)
  assert.equal(reply.noFileWritten, true)
  await writeFile(file, 'original prose')
  await assert.rejects(f.execute(args({ overwrite: true })), /fixture project write failed/)
  assert.equal(await readFile(file, 'utf8'), 'original prose')
  assert.equal(f.service.stateForWorkspace(f.handle).revision, previous)
})

test('chapter file and outline changes share the same per-book queue', async t => {
  const f = await hostFixture(t)
  await f.setProject(project(''))
  let release, written
  const blocked = new Promise(resolve => { release = resolve })
  const reached = new Promise(resolve => { written = resolve })
  f.context.saveWorkspaceManuscript = async (...input) => { written(); await blocked; return saveWorkspaceManuscript(...input) }
  const saving = f.execute(args())
  await reached
  let removed = false
  const removal = f.service.mutateAs({ actor: 'user', operation: 'delete' }, f.handle, undefined, current => {
    removed = true
    return { ...current, project: removeChapter(current.project, 'v', 'c') }
  })
  await new Promise(resolve => setImmediate(resolve))
  assert.equal(removed, false)
  release()
  const saved = await saving
  assert.equal(saved.verified, true)
  assert.equal(saved.linked.chapterId, 'c')
  await removal
  assert.equal(removed, true)
})

test('partial-write receipt preserves an external edit and identifies the original backup', async t => {
  const f = await hostFixture(t)
  await f.setProject(project(''))
  const file = join(f.book.path, 'chapter.md')
  await writeFile(file, 'original prose')
  const rename = f.context.rename
  f.context.rename = async (from, to) => {
    if (to === f.service.statePath(f.handle)) {
      await writeFile(file, 'external editor revision')
      throw new Error('fixture project commit failed')
    }
    return rename(from, to)
  }
  let failure
  await assert.rejects(f.execute(args({ overwrite: true })), error => { failure = error; return /commit failed/.test(error.message) })
  assert.equal(await readFile(file, 'utf8'), 'external editor revision')
  const receipt = JSON.parse(f.tool.finalizeContent({}, { isError: true, error: failure })[0].text)
  assert.equal(receipt.noFileWritten, false)
  assert.equal(receipt.fileWritten, true)
  assert.equal(receipt.path, file)
  assert.equal(await readFile(receipt.backupPath, 'utf8'), 'original prose')
})

test('chapter word minimum and ranges reject nonconforming prose before writing', async t => {
  const f = await hostFixture(t)
  await f.setProject(project('3000字'))
  let failure
  await assert.rejects(f.execute(args({ content: '字'.repeat(2999) })), error => { failure = error; return error.code === 'NOVEL_CHAPTER_WORD_COUNT' })
  await assert.rejects(access(join(f.book.path, 'chapter.md')), error => error.code === 'ENOENT')
  assert.equal(failure.wordRequirement.actualWords, 2999)
  assert.equal(failure.wordRequirement.missingWords, 1)
  const receipt = JSON.parse(f.tool.finalizeContent({}, { isError: true, error: failure })[0].text)
  assert.equal(receipt.noFileWritten, true)
  assert.equal(receipt.wordRequirement.minWords, 3000)
  const saved = await f.execute(args({ content: '字'.repeat(3100) }))
  assert.equal(saved.words, 3100)
  assert.equal(saved.wordRequirement.minWords, 3000)
  await f.setProject(project('3000—4000字'))
  await assert.rejects(f.execute(args({ content: '字'.repeat(4001), overwrite: true })), error => error.code === 'NOVEL_CHAPTER_WORD_COUNT')
  assert.equal((await readFile(join(f.book.path, 'chapter.md'), 'utf8')).length, 3100)
  assert.equal((await f.execute(args({ content: '字'.repeat(3500), overwrite: true }))).words, 3500)
})

test('omitting chapter id or using an invalid target cannot bypass word constraints', async t => {
  const f = await hostFixture(t)
  await f.setProject(project('3千字'))
  await assert.rejects(f.execute({ filename: 'chapter.md', content: '短文' }), error => error.code === 'NOVEL_CHAPTER_REQUIRED')
  await f.setProject(project('很长很长'))
  await assert.rejects(f.execute(args()), error => error.code === 'INVALID_NOVEL_WORD_TARGET')
  await assert.rejects(access(join(f.book.path, 'chapter.md')), error => error.code === 'ENOENT')
})

test('full-book target does not become a per-chapter minimum', async t => {
  const f = await hostFixture(t)
  await f.setProject({ ...project(''), targetWords: '100万' })
  assert.equal((await f.execute(args())).verified, true)
})

test('an outline revision conflict rejects prose before it changes', async t => {
  const f = await hostFixture(t)
  await f.setProject(project(''))
  await assert.rejects(f.execute(args({ expected_revision: 0 })), /project changed/)
  await assert.rejects(access(join(f.book.path, 'chapter.md')), error => error.code === 'ENOENT')
})

test('completed legacy migration repairs bindings when the old project was already renamed', async t => {
  const f = await hostFixture(t)
  const legacy = join(f.service.root, 'workspaces', 'w')
  await mkdir(legacy, { recursive: true })
  await writeFile(join(legacy, 'migrated.json'), JSON.stringify({ novelId: f.book.novelId, folder: f.book.folder }))
  f.service.bindings = { version: 1, bindings: {} }
  f.service.writeLinks = normalizeWriteLinkStore({ version: 1, links: { s: { revision: 1, objective: 'Continue', workspaceId: 'w', workspaceTitle: 'Workspace', updatedAt: Date.now() } } })
  f.service.migrationChecked.clear()
  f.service.ensureMigrated(f.workspace)
  assert.equal(f.service.bindings.bindings.s.novelId, f.book.novelId)
})
