import assert from 'node:assert/strict'
import { mkdtemp, readdir, rm, writeFile, mkdir } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import {
  DEFAULT_CORPUS_DIR,
  addCorpus,
  corpusDir,
  normalizeRegistry,
  normalizeScopeRequest,
  removeCorpus,
  setActiveCorpus,
  updateCorpus,
} from '../kb-corpora.js'
import { KnowledgeStore } from '../kb-store.js'

const NOW = Date.parse('2026-09-29T00:00:00Z')

test('a missing or broken registry keeps the original corpus as the default', () => {
  const empty = normalizeRegistry(null, NOW)
  assert.equal(empty.active, 'default')
  assert.deepEqual(empty.corpora.map(entry => [entry.id, entry.dir]), [['default', DEFAULT_CORPUS_DIR]])

  const messy = normalizeRegistry({
    active: 'ghost',
    corpora: [
      { id: 'c1', name: '都市', dir: '../../escape' },
      { id: 'c1', name: '重复' },
      { id: 'Bad Id', name: 'x' },
      null,
    ],
  }, NOW)
  assert.deepEqual(messy.corpora.map(entry => entry.id), ['default', 'c1'])
  assert.equal(messy.corpora[1].dir, 'corpora/c1', 'directories are derived, never trusted from the file')
  assert.equal(messy.active, 'default', 'an unknown active id falls back')
  assert.equal(corpusDir('default'), 'style-corpus')
})

test('corpora can be added, renamed, activated, and removed with guards', () => {
  let registry = normalizeRegistry(null, NOW)
  registry = updateCorpus(registry, 'default', { name: '成人', adult: true, description: '十八禁参考' })
  assert.deepEqual([registry.corpora[0].name, registry.corpora[0].adult], ['成人', true])

  const added = addCorpus(registry, { name: '都市', description: '正常向' }, { now: NOW, random: () => 0.5 })
  registry = added.registry
  assert.match(added.entry.id, /^c[a-z0-9]+$/)
  assert.equal(added.entry.dir, 'corpora/' + added.entry.id)
  assert.equal(added.entry.adult, false)

  assert.throws(() => addCorpus(registry, { name: '都市' }), error => error.code === 'KB_CORPUS_NAME_TAKEN')
  assert.throws(() => addCorpus(registry, { name: '  ' }), error => error.code === 'KB_CORPUS_NAME_REQUIRED')
  assert.throws(() => updateCorpus(registry, added.entry.id, { name: '成人' }), error => error.code === 'KB_CORPUS_NAME_TAKEN')
  assert.throws(() => updateCorpus(registry, 'nope', { name: 'x' }), error => error.code === 'KB_CORPUS_UNKNOWN')

  registry = setActiveCorpus(registry, added.entry.id)
  assert.equal(registry.active, added.entry.id)
  registry = removeCorpus(registry, added.entry.id)
  assert.equal(registry.active, 'default', 'removing the active corpus falls back')
  assert.throws(() => removeCorpus(registry, 'default'), error => error.code === 'KB_CORPUS_LAST')
})

test('scope requests from other plugins normalize to write-with, write-without, or no opinion', () => {
  assert.equal(normalizeScopeRequest(null), null)
  assert.deepEqual(normalizeScopeRequest({ writing: false }), { writing: false, corpusId: null })
  assert.deepEqual(normalizeScopeRequest({ corpusId: 'none' }), { writing: false, corpusId: null })
  assert.deepEqual(normalizeScopeRequest({ corpusId: ' c1 ', source: 'novel' }), { writing: true, corpusId: 'c1', source: 'novel' })
  assert.deepEqual(normalizeScopeRequest({ corpusId: '' }), { writing: true, corpusId: null, source: '' })
})

async function writeNote(dir, file, id, tags) {
  await mkdir(join(dir, 'notes'), { recursive: true })
  await writeFile(join(dir, 'notes', file), `---\nid: ${id}\ntitle: ${id}\ntags: ${tags.join(", ")}\n---\n\n正文 ${id}\n`)
}

test('moving a source book relocates only its notes and never overwrites the target', async t => {
  const root = await mkdtemp(join(tmpdir(), 'kb-corpora-move-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  const adult = new KnowledgeStore({ root: join(root, 'a') })
  const urban = new KnowledgeStore({ root: join(root, 'b') })
  await writeNote(adult.root, 'n1.md', 'n1', ['import', '书甲'])
  await writeNote(adult.root, 'n2.md', 'n2', ['import', '书甲'])
  await writeNote(adult.root, 'n3.md', 'n3', ['import', '书乙'])
  await writeNote(urban.root, 'n2.md', 'u2', ['摘抄'])
  await adult.sync({ force: true })
  await urban.sync({ force: true })

  const outcome = await adult.moveTaggedTo(urban, '书甲')
  assert.deepEqual(outcome, { moved: 2, renamed: 1 })
  assert.deepEqual(adult.notes().map(note => note.id), ['n3'])
  assert.deepEqual(urban.notes().map(note => note.id).sort(), ['n1', 'n2', 'u2'])
  assert.deepEqual((await readdir(join(urban.root, 'notes'))).sort(), ['n1.md', 'n2-moved.md', 'n2.md'])
  assert.deepEqual(await adult.moveTaggedTo(urban, '不存在'), { moved: 0, renamed: 0 })
  await assert.rejects(adult.moveTaggedTo(adult, '书乙'), error => error.code === 'KB_MOVE_TARGET')
})
