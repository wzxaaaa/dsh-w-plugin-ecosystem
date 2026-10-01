import assert from 'node:assert/strict'
import { mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { isAbsolute, join, relative, resolve } from 'node:path'
import { test } from 'node:test'
import { normalizeManuscriptFilename, saveWorkspaceManuscript } from '../noval-file-core.js'

async function temporaryBook(t) {
  const root = await mkdtemp(join(tmpdir(), 'dsh-noval-transaction-'))
  t.after(async () => {
    const local = relative(resolve(tmpdir()), resolve(root))
    assert.ok(local && !isAbsolute(local) && local !== '..' && !local.startsWith(`..${process.platform === 'win32' ? '\\' : '/'}`))
    await rm(root, { recursive: true, force: true })
  })
  return root
}

test('normalizes safe manuscript filenames and rejects paths', () => {
  assert.equal(normalizeManuscriptFilename('第一章'), '第一章.md')
  assert.equal(normalizeManuscriptFilename('第一章.txt'), '第一章.txt')
  for (const value of ['../chapter.md', 'chapters/chapter.md', 'C:\\chapter.md', 'CON.md', 'con.backup.md', 'bad?.md']) {
    assert.throws(() => normalizeManuscriptFilename(value), /filename|reserved/)
  }
})

test('atomically writes and verifies a workspace manuscript', async t => {
  const root = await mkdtemp(join(tmpdir(), 'dsh-noval-file-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  const content = '# 第一章\n\n这是经过落盘验证的正文。\n'

  const created = await saveWorkspaceManuscript(root, { filename: '第一章.md', content })
  assert.equal(created.created, true)
  assert.equal(created.changed, true)
  assert.equal(created.verified, true)
  assert.equal(created.path, join(root, '第一章.md'))
  assert.equal(await readFile(created.path, 'utf8'), content)
  assert.match(created.sha256, /^[a-f0-9]{64}$/)

  const unchanged = await saveWorkspaceManuscript(root, { filename: '第一章.md', content })
  assert.equal(unchanged.changed, false)
  assert.equal(unchanged.verified, true)
})

test('requires explicit overwrite for a different existing manuscript', async t => {
  const root = await mkdtemp(join(tmpdir(), 'dsh-noval-overwrite-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  await saveWorkspaceManuscript(root, { filename: 'chapter.md', content: 'version one' })

  await assert.rejects(
    saveWorkspaceManuscript(root, { filename: 'chapter.md', content: 'version two' }),
    error => error?.code === 'NOVEL_FILE_EXISTS',
  )
  const overwritten = await saveWorkspaceManuscript(root, { filename: 'chapter.md', content: 'version two', overwrite: true })
  assert.equal(overwritten.overwritten, true)
  assert.equal(await readFile(overwritten.path, 'utf8'), 'version two')
})

test('concurrent creation never replaces a manuscript without overwrite permission', async t => {
  const root = await temporaryBook(t)
  const result = await Promise.allSettled([
    saveWorkspaceManuscript(root, { filename: 'same.md', content: 'AAAAA' }),
    saveWorkspaceManuscript(root, { filename: 'same.md', content: 'B'.repeat(1_900_000) }),
  ])
  const saved = result.filter(value => value.status === 'fulfilled')
  const rejected = result.filter(value => value.status === 'rejected')
  assert.equal(saved.length, 1)
  assert.equal(rejected.length, 1)
  assert.equal(rejected[0].reason.code, 'NOVEL_FILE_EXISTS')
  assert.equal(saved[0].value.created, true)
  assert.equal((await readFile(join(root, 'same.md'), 'utf8')).length, saved[0].value.characters)
})

test('Windows case aliases share the manuscript transaction queue', { skip: process.platform !== 'win32' }, async t => {
  const root = await temporaryBook(t)
  const result = await Promise.allSettled([
    saveWorkspaceManuscript(root, { filename: 'chapter.md', content: 'first' }),
    saveWorkspaceManuscript(root.toUpperCase(), { filename: 'CHAPTER.MD', content: 'second' }),
  ])
  assert.equal(result.filter(value => value.status === 'fulfilled').length, 1)
  assert.equal(result.find(value => value.status === 'rejected').reason.code, 'NOVEL_FILE_EXISTS')
})

test('a failed linked-project commit removes its newly created manuscript', async t => {
  const root = await temporaryBook(t)
  await assert.rejects(saveWorkspaceManuscript(root, { filename: 'chapter.md', content: 'new prose' }, {
    onSaved: saved => {
      assert.equal(saved.verified, true)
      throw new Error('project commit failed')
    },
  }), error => error.message === 'project commit failed' && error.fileWritten === false && error.noFileWritten === true && error.partialWrite === false)
  assert.deepEqual(await readdir(root), [])
})

test('a failed linked-project commit restores the original overwritten manuscript', async t => {
  const root = await temporaryBook(t)
  await writeFile(join(root, 'chapter.md'), 'original prose')
  await assert.rejects(saveWorkspaceManuscript(root, { filename: 'chapter.md', content: 'replacement prose', overwrite: true }, {
    onSaved: async () => {
      const backup = (await readdir(root)).find(filename => filename.endsWith('.bak'))
      assert.ok(backup, 'the original is backed up before the linked-project commit starts')
      assert.equal(await readFile(join(root, backup), 'utf8'), 'original prose')
      throw new Error('project commit failed')
    },
  }), error => error.fileWritten === false && error.noFileWritten === true)
  assert.equal(await readFile(join(root, 'chapter.md'), 'utf8'), 'original prose')
  assert.deepEqual(await readdir(root), ['chapter.md'])
})

test('the filename stays locked until linked commit failure has rolled back', async t => {
  const root = await temporaryBook(t)
  let entered
  const started = new Promise(resolve => { entered = resolve })
  let release
  const blocked = new Promise(resolve => { release = resolve })
  const first = saveWorkspaceManuscript(root, { filename: 'chapter.md', content: 'first' }, {
    onSaved: async () => { entered(); await blocked; throw new Error('rejected first project') },
  })
  const rejectedFirst = assert.rejects(first, /rejected first project/)
  await started
  const second = saveWorkspaceManuscript(root, { filename: 'chapter.md', content: 'second' })
  await new Promise(resolve => setTimeout(resolve, 30))
  assert.equal(await readFile(join(root, 'chapter.md'), 'utf8'), 'first')
  release()
  await rejectedFirst
  const result = await second
  assert.equal(result.created, true)
  assert.equal(await readFile(join(root, 'chapter.md'), 'utf8'), 'second')
})

test('rollback preserves an external edit and exposes a verified original backup', async t => {
  const root = await temporaryBook(t)
  const path = join(root, 'chapter.md')
  await writeFile(path, 'original prose')
  let failure
  await assert.rejects(saveWorkspaceManuscript(root, { filename: 'chapter.md', content: 'replacement prose', overwrite: true }, {
    onSaved: async () => { await writeFile(path, 'external editor prose'); throw new Error('project commit failed') },
  }), error => {
    failure = error
    return error.fileWritten === true && error.noFileWritten === false && error.partialWrite === true && error.path === path && typeof error.backupPath === 'string'
  })
  assert.equal(await readFile(path, 'utf8'), 'external editor prose')
  assert.equal(await readFile(failure.backupPath, 'utf8'), 'original prose')
})

test('an unchanged manuscript can commit its link without risking rollback of existing prose', async t => {
  const root = await temporaryBook(t)
  const path = join(root, 'chapter.md')
  await writeFile(path, 'same prose')
  await assert.rejects(saveWorkspaceManuscript(root, { filename: 'chapter.md', content: 'same prose' }, {
    onSaved: saved => { assert.equal(saved.changed, false); throw new Error('link commit failed') },
  }), error => error.fileWritten === false)
  assert.equal(await readFile(path, 'utf8'), 'same prose')
  assert.deepEqual(await readdir(root), ['chapter.md'])
})
