import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { normalizeManuscriptFilename, saveWorkspaceManuscript } from '../noval-file-core.js'

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
