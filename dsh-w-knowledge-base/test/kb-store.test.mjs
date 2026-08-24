import assert from 'node:assert/strict'
import { test } from 'node:test'
import { mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { KnowledgeStore } from '../kb-store.js'

const START = Date.parse('2026-09-01T12:00:00.000Z')
const DAY = 86400000

async function makeStore(overrides = {}) {
  const root = await mkdtemp(join(tmpdir(), 'dsh-w-kb-'))
  let clock = START
  let seed = 0.11
  const store = new KnowledgeStore({
    root,
    displayRoot: '$DSH_HOME/knowledge-base',
    syncIntervalMs: 0,
    now: () => clock,
    random: () => {
      seed = (seed + 0.137) % 1
      return seed
    },
    ...overrides,
  })
  return {
    root,
    store,
    tick(ms) {
      clock += ms
    },
    async cleanup() {
      await rm(root, { recursive: true, force: true })
    },
  }
}

test('save writes one readable Markdown file and indexes it', async (t) => {
  const kb = await makeStore()
  t.after(() => kb.cleanup())
  const created = await kb.store.save({
    title: 'pnpm pack pitfalls',
    content: 'Remove before add, otherwise the old tarball stays installed.',
    tags: ['dsh', 'Packaging'],
    source: 'session-1',
    workspace: 'E:\\demo',
  })
  assert.equal(created.action, 'created')
  assert.match(created.note.id, /^kb-20260901-120000-/)
  const files = await readdir(join(kb.root, 'notes'))
  assert.deepEqual(files, [created.note.file])
  const text = await readFile(join(kb.root, 'notes', created.note.file), 'utf8')
  assert.ok(text.startsWith('---\n'), text)
  assert.ok(text.includes('tags: dsh, Packaging'))
  assert.ok(text.includes('workspace: E:\\demo'))
  assert.ok(text.trimEnd().endsWith('installed.'))
  const stats = await kb.store.stats()
  assert.equal(stats.total, 1)
  assert.equal(stats.displayRoot, '$DSH_HOME/knowledge-base')
  assert.deepEqual(stats.tags.map((entry) => entry.tag).sort(), ['Packaging', 'dsh'])
  assert.deepEqual(stats.warnings, [])
})

test('a second note with the same title is refused until it is explicitly allowed', async (t) => {
  const kb = await makeStore()
  t.after(() => kb.cleanup())
  const first = await kb.store.save({ title: 'Same title', content: 'one' })
  await assert.rejects(() => kb.store.save({ title: 'same TITLE', content: 'two' }), (error) => {
    assert.equal(error.code, 'KB_DUPLICATE_TITLE')
    assert.ok(error.message.includes(first.note.id), error.message)
    return true
  })
  const second = await kb.store.save({ title: 'Same title', content: 'two', allowDuplicateTitle: true })
  assert.notEqual(second.note.id, first.note.id)
  assert.equal((await kb.store.stats()).total, 2)
})

test('updating by id keeps created, renames the file, and appends on demand', async (t) => {
  const kb = await makeStore()
  t.after(() => kb.cleanup())
  const created = await kb.store.save({ title: 'First title', content: 'body one', tags: ['a'] })
  kb.tick(DAY)
  const renamed = await kb.store.save({ id: created.note.id, title: 'Second title', tags: ['a', 'b'] })
  assert.equal(renamed.action, 'updated')
  assert.equal(renamed.note.created, created.note.created)
  assert.notEqual(renamed.note.updated, created.note.updated)
  assert.equal(renamed.note.body, 'body one', 'a title-only update keeps the body')
  assert.deepEqual(renamed.note.tags, ['a', 'b'])
  const files = await readdir(join(kb.root, 'notes'))
  assert.deepEqual(files, [renamed.note.file])
  assert.notEqual(renamed.note.file, created.note.file)
  kb.tick(DAY)
  const appended = await kb.store.save({ id: created.note.id, content: 'body two', mode: 'append' })
  assert.equal(appended.note.body, 'body one\n\nbody two')
  kb.tick(DAY)
  const replaced = await kb.store.save({ id: created.note.id, content: 'only this' })
  assert.equal(replaced.note.body, 'only this')
  assert.equal((await kb.store.stats()).total, 1)
})

test('the write surface fails loud on unusable requests', async (t) => {
  const kb = await makeStore({ maxNoteChars: 40 })
  t.after(() => kb.cleanup())
  await assert.rejects(() => kb.store.save({ content: 'no title' }), /title is required/)
  await assert.rejects(() => kb.store.save({ title: 'no content' }), /content is required/)
  await assert.rejects(() => kb.store.save({ id: 'kb-nope', content: 'x' }), (error) => {
    assert.equal(error.code, 'KB_UNKNOWN_ID')
    return true
  })
  const created = await kb.store.save({ title: 'small', content: 'fits' })
  await assert.rejects(() => kb.store.save({ id: created.note.id }), (error) => {
    assert.equal(error.code, 'KB_EMPTY_UPDATE')
    return true
  })
  await assert.rejects(() => kb.store.save({ title: 'big', content: 'x'.repeat(41) }), (error) => {
    assert.equal(error.code, 'KB_NOTE_TOO_LARGE')
    assert.ok(error.message.includes('41'), error.message)
    return true
  })
})

test('search ranks, list pages and filters, and facets count tags', async (t) => {
  const kb = await makeStore()
  t.after(() => kb.cleanup())
  await kb.store.save({ title: 'Typert codec must be strict', content: 'passthrough schema', tags: ['dsh', 'typert'] })
  kb.tick(DAY)
  await kb.store.save({ title: '插件打包踩坑', content: '先 remove 再 add', tags: ['dsh'] })
  kb.tick(DAY)
  await kb.store.save({ title: 'Windows sandbox notes', content: 'ConstrainedLanguage mode blocks .NET statics', tags: ['windows'] })
  const strict = await kb.store.search({ query: 'strict codec' })
  assert.equal(strict.results[0].note.title, 'Typert codec must be strict')
  assert.equal(strict.total, 3)
  const chinese = await kb.store.search({ query: '打包' })
  assert.equal(chinese.results.length, 1)
  assert.equal(chinese.results[0].note.title, '插件打包踩坑')
  const listed = await kb.store.list({ tag: 'dsh' })
  assert.equal(listed.total, 2)
  assert.deepEqual(listed.notes.map((note) => note.title), ['插件打包踩坑', 'Typert codec must be strict'])
  const paged = await kb.store.list({ limit: 1, offset: 1, sort: 'title', order: 'asc' })
  assert.equal(paged.total, 3)
  assert.equal(paged.notes.length, 1)
  assert.equal(paged.notes[0].title, 'Windows sandbox notes')
  assert.deepEqual(listed.tags.map((entry) => entry.tag + ':' + entry.count), ['dsh:2', 'typert:1', 'windows:1'])
})

test('files edited outside the plugin are picked up, and vanished files drop out', async (t) => {
  const kb = await makeStore()
  t.after(() => kb.cleanup())
  const created = await kb.store.save({ title: 'Managed note', content: 'original body' })
  await writeFile(join(kb.root, 'notes', 'hand-written.md'), '# Dropped in by hand\n\nno front matter at all\n', 'utf8')
  await kb.store.sync({ force: true })
  const byHand = kb.store.get('hand-written')
  assert.ok(byHand !== null, 'a hand-written file is addressable by its file name')
  assert.equal(byHand.title, 'Dropped in by hand')
  assert.equal((await kb.store.stats()).total, 2)
  await writeFile(join(kb.root, 'notes', created.note.file), '---\nid: ' + created.note.id + '\ntitle: Edited outside\ntags: manual\n---\n\nrewritten body, clearly a different length\n', 'utf8')
  await kb.store.sync({ force: true })
  const reread = kb.store.get(created.note.id)
  assert.equal(reread.title, 'Edited outside')
  assert.deepEqual(reread.tags, ['manual'])
  assert.equal(reread.body, 'rewritten body, clearly a different length')
  await rm(join(kb.root, 'notes', 'hand-written.md'))
  await kb.store.sync({ force: true })
  assert.equal(kb.store.get('hand-written'), null)
  assert.equal((await kb.store.stats()).total, 1)
})

test('duplicate ids in two files are reported instead of silently shadowed', async (t) => {
  const kb = await makeStore()
  t.after(() => kb.cleanup())
  const created = await kb.store.save({ title: 'Original', content: 'one' })
  await writeFile(join(kb.root, 'notes', 'copy.md'), '---\nid: ' + created.note.id + '\ntitle: Copy\n---\n\ntwo\n', 'utf8')
  await kb.store.sync({ force: true })
  const stats = await kb.store.stats()
  assert.equal(stats.total, 2)
  assert.equal(stats.warnings.length, 1)
  assert.ok(stats.warnings[0].includes('duplicate note id'), stats.warnings[0])
})

test('remove trashes by default and unlinks on demand', async (t) => {
  const kb = await makeStore()
  t.after(() => kb.cleanup())
  const soft = await kb.store.save({ title: 'Retire me', content: 'stale advice' })
  const trashed = await kb.store.remove(soft.note.id)
  assert.equal(trashed.mode, 'trash')
  assert.equal(kb.store.get(soft.note.id), null)
  const trash = await readdir(join(kb.root, '.trash'))
  assert.equal(trash.length, 1)
  assert.ok(trash[0].endsWith(soft.note.file), trash[0])
  assert.deepEqual(await readdir(join(kb.root, 'notes')), [])
  const hard = await kb.store.save({ title: 'Burn me', content: 'wrong' })
  const burned = await kb.store.remove(hard.note.id, { hard: true })
  assert.equal(burned.mode, 'permanent')
  assert.equal((await readdir(join(kb.root, '.trash'))).length, 1)
  await assert.rejects(() => kb.store.remove('kb-missing'), (error) => {
    assert.equal(error.code, 'KB_UNKNOWN_ID')
    return true
  })
})

test('the prompt index stays inside its budget and says what is hidden', async (t) => {
  const kb = await makeStore()
  t.after(() => kb.cleanup())
  assert.match(kb.store.indexSnapshot(), /^Knowledge base \(dsh-w-knowledge-base\) at \$DSH_HOME\/knowledge-base: empty\./)
  for (let index = 0; index < 5; index += 1) {
    await kb.store.save({ title: 'Note number ' + index, content: 'body ' + index, tags: ['bulk'] })
    kb.tick(DAY)
  }
  const full = kb.store.indexSnapshot()
  assert.ok(full.includes('5 notes'), full)
  assert.equal(full.split('\n').length, 6)
  assert.ok(full.includes('[bulk]'), full)
  const capped = kb.store.indexSnapshot({ maxNotes: 2 })
  assert.ok(capped.includes('(+3 more notes'), capped)
  const tiny = kb.store.indexSnapshot({ maxChars: 120 })
  assert.ok(tiny.length < 260, String(tiny.length))
  assert.ok(tiny.includes('more note'), tiny)
})

test('concurrent saves are serialized into distinct notes', async (t) => {
  const kb = await makeStore()
  t.after(() => kb.cleanup())
  const outcomes = await Promise.all([
    kb.store.save({ title: 'first', content: 'a' }),
    kb.store.save({ title: 'second', content: 'b' }),
    kb.store.save({ title: 'third', content: 'c' }),
  ])
  const ids = new Set(outcomes.map((outcome) => outcome.note.id))
  assert.equal(ids.size, 3)
  assert.equal((await kb.store.stats()).total, 3)
  assert.equal((await readdir(join(kb.root, 'notes'))).length, 3)
})

test('an absent root is not an error, it is an empty knowledge base', async (t) => {
  const kb = await makeStore()
  t.after(() => kb.cleanup())
  await rm(kb.root, { recursive: true, force: true })
  const stats = await kb.store.stats()
  assert.equal(stats.total, 0)
  assert.deepEqual((await kb.store.list()).notes, [])
  assert.equal((await kb.store.search({ query: 'anything' })).matched, 0)
  const created = await kb.store.save({ title: 'recreated', content: 'the root is made on demand' })
  assert.equal(created.action, 'created')
})
