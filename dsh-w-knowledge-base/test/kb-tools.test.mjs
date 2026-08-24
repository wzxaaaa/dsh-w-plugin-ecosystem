import assert from 'node:assert/strict'
import { test } from 'node:test'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { KnowledgeStore } from '../kb-store.js'
import { TOOL_NAMES, boundText, buildToolSpecs, provenanceOf, summaryOf } from '../kb-tools.js'

const EXEC = { agent: { session: { header: { id: 'session-42', cwd: 'E:\\deepseek-workspace\\demo' } } } }

async function makeTools() {
  const root = await mkdtemp(join(tmpdir(), 'dsh-w-kb-tools-'))
  let clock = Date.parse('2026-09-01T12:00:00.000Z')
  let seed = 0.31
  const store = new KnowledgeStore({
    root,
    displayRoot: '$DSH_HOME/knowledge-base',
    syncIntervalMs: 0,
    now: () => clock,
    random: () => {
      seed = (seed + 0.211) % 1
      return seed
    },
  })
  const specs = buildToolSpecs({ store })
  const byName = new Map(specs.map((spec) => [spec.name, spec]))
  return {
    root,
    store,
    specs,
    tool(name) {
      const spec = byName.get(name)
      assert.ok(spec !== undefined, 'unknown tool ' + name)
      return spec
    },
    async call(name, args, exec) {
      const spec = byName.get(name)
      const value = await spec.execute(args, exec)
      return { value, text: spec.output.render(args, value).map((block) => block.text).join('\n') }
    },
    tick(ms) {
      clock += ms
    },
    async cleanup() {
      await rm(root, { recursive: true, force: true })
    },
  }
}

test('every spec is shaped the way defineTool expects', async (t) => {
  const kb = await makeTools()
  t.after(() => kb.cleanup())
  assert.deepEqual(kb.specs.map((spec) => spec.name), [...TOOL_NAMES])
  for (const spec of kb.specs) {
    assert.ok(spec.description.length > 80, spec.name + ' needs a description the model can act on')
    assert.equal(typeof spec.parameters, 'object')
    assert.equal(spec.output.schema.type, 'object')
    assert.equal(spec.output.schema.additionalProperties, false)
    assert.equal(typeof spec.output.render, 'function')
    assert.equal(typeof spec.execute, 'function')
    assert.ok(Number.isFinite(spec.timeoutMs) && spec.timeoutMs > 0)
  }
  assert.equal(kb.tool('kb_search').isConcurrencySafe(), true)
  assert.equal(kb.tool('kb_read').isConcurrencySafe(), true)
  assert.equal(kb.tool('kb_list').isConcurrencySafe(), true)
  assert.equal(kb.tool('kb_save').isConcurrencySafe, undefined, 'a write must never join a parallel group')
  assert.equal(kb.tool('kb_delete').isConcurrencySafe, undefined)
  assert.equal(kb.tool('kb_import').isConcurrencySafe, undefined, 'an import writes, so it must not join a parallel group')
  assert.equal(kb.tool('kb_import').timeoutMs, 60000)
})

test('kb_save records the calling session and renders what it wrote', async (t) => {
  const kb = await makeTools()
  t.after(() => kb.cleanup())
  const saved = await kb.call('kb_save', {
    title: 'Remove before add',
    content: 'pnpm keeps a same-version file: tarball, so remove the plugin first.',
    tags: ['dsh', 'packaging'],
  }, EXEC)
  assert.equal(saved.value.action, 'created')
  assert.equal(saved.value.total, 1)
  assert.match(saved.value.path, /^notes\/kb-20260901-120000-.+__remove-before-add\.md$/)
  assert.ok(saved.text.includes('Created note ' + saved.value.id), saved.text)
  assert.ok(saved.text.includes('tags: dsh, packaging'), saved.text)
  assert.ok(saved.text.includes('holds 1 note.'), saved.text)
  const text = await readFile(join(kb.root, saved.value.path), 'utf8')
  assert.ok(text.includes('source: session:session-42'), text)
  assert.ok(text.includes('workspace: E:\\deepseek-workspace\\demo'), text)
  const updated = await kb.call('kb_save', { id: saved.value.id, content: 'Also bump the version.', mode: 'append' }, EXEC)
  assert.equal(updated.value.action, 'updated')
  assert.equal(updated.value.total, 1)
  assert.ok(updated.text.startsWith('Updated note '), updated.text)
})

test('kb_search reports hits, misses, and an empty base differently', async (t) => {
  const kb = await makeTools()
  t.after(() => kb.cleanup())
  const empty = await kb.call('kb_search', { query: 'anything' }, EXEC)
  assert.equal(empty.value.searched, 0)
  assert.ok(empty.text.includes('knowledge base is empty'), empty.text)
  await kb.call('kb_save', { title: 'Typert codec must be strict', content: 'Use a passthrough strict schema.', tags: ['typert'] }, EXEC)
  kb.tick(86400000)
  await kb.call('kb_save', { title: '插件打包踩坑', content: '先 remove 再 add。', tags: ['dsh'] }, EXEC)
  const hit = await kb.call('kb_search', { query: 'strict codec' }, EXEC)
  assert.equal(hit.value.matched, 1)
  assert.equal(hit.value.searched, 2)
  assert.equal(hit.value.results[0].title, 'Typert codec must be strict')
  assert.ok(hit.value.results[0].score > 0)
  assert.ok(hit.text.includes('1 of 2 notes match "strict codec"'), hit.text)
  assert.ok(hit.text.includes('Open a note with kb_read.'), hit.text)
  const cjk = await kb.call('kb_search', { query: '打包' }, EXEC)
  assert.deepEqual(cjk.value.results.map((entry) => entry.title), ['插件打包踩坑'])
  const miss = await kb.call('kb_search', { query: 'kubernetes ingress' }, EXEC)
  assert.equal(miss.value.results.length, 0)
  assert.ok(miss.text.includes('No note matches'), miss.text)
  const filtered = await kb.call('kb_search', { query: 'remove', tags: ['typert'] }, EXEC)
  assert.equal(filtered.value.results.length, 0)
})

test('kb_read opens notes, reports unknown ids, and honours maxChars', async (t) => {
  const kb = await makeTools()
  t.after(() => kb.cleanup())
  const saved = await kb.call('kb_save', { title: 'Long note', content: 'x'.repeat(2000), tags: ['bulk'] }, EXEC)
  const read = await kb.call('kb_read', { id: saved.value.id, ids: ['kb-missing'], maxChars: 500 }, EXEC)
  assert.equal(read.value.notes.length, 1)
  assert.equal(read.value.notes[0].content.length, 500)
  assert.equal(read.value.notes[0].truncated, true)
  assert.equal(read.value.notes[0].source, 'session:session-42')
  assert.deepEqual(read.value.missing, ['kb-missing'])
  assert.ok(read.text.includes('body cut by maxChars'), read.text)
  assert.ok(read.text.includes('No note exists for: kb-missing'), read.text)
  await assert.rejects(() => kb.call('kb_read', {}, EXEC), /needs id or ids/)
  await assert.rejects(
    () => kb.call('kb_read', { ids: Array.from({ length: 11 }, (_, index) => 'kb-' + index) }, EXEC),
    /at most 10 notes/,
  )
})

test('kb_list pages, previews, and facets, and says something useful when empty', async (t) => {
  const kb = await makeTools()
  t.after(() => kb.cleanup())
  const empty = await kb.call('kb_list', {}, EXEC)
  assert.equal(empty.value.total, 0)
  assert.equal(empty.value.root, '$DSH_HOME/knowledge-base')
  assert.ok(empty.text.includes('is empty'), empty.text)
  for (let index = 0; index < 3; index += 1) {
    await kb.call('kb_save', { title: 'Note ' + index, content: '# Heading ' + index + '\n\nbody', tags: index === 0 ? ['a'] : ['a', 'b'] }, EXEC)
    kb.tick(3600000)
  }
  const page = await kb.call('kb_list', { limit: 2 }, EXEC)
  assert.equal(page.value.total, 3)
  assert.equal(page.value.notes.length, 2)
  assert.equal(page.value.notes[0].preview, 'Heading 2')
  assert.deepEqual(page.value.tags.map((entry) => entry.tag + ':' + entry.count), ['a:3', 'b:2'])
  assert.ok(page.text.includes('showing 1-2'), page.text)
  assert.ok(page.text.includes('(1 more; call kb_list with offset 2.)'), page.text)
  const tagged = await kb.call('kb_list', { tag: 'b' }, EXEC)
  assert.equal(tagged.value.total, 2)
  const unknownTag = await kb.call('kb_list', { tag: 'nope' }, EXEC)
  assert.ok(unknownTag.text.includes('No note carries the tag "nope"'), unknownTag.text)
})

test('kb_delete trashes by default and reports what remains', async (t) => {
  const kb = await makeTools()
  t.after(() => kb.cleanup())
  const first = await kb.call('kb_save', { title: 'Stale advice', content: 'wrong now' }, EXEC)
  await kb.call('kb_save', { title: 'Still true', content: 'keep me' }, EXEC)
  const deleted = await kb.call('kb_delete', { id: first.value.id }, EXEC)
  assert.equal(deleted.value.mode, 'trash')
  assert.equal(deleted.value.total, 1)
  assert.match(deleted.value.path, /^\.trash\//)
  assert.ok(deleted.text.includes('recoverable at .trash/'), deleted.text)
  assert.ok(deleted.text.includes('1 note remain'), deleted.text)
  await assert.rejects(() => kb.call('kb_delete', { id: first.value.id }, EXEC), /unknown note id/)
})

test('the small helpers behave without an execution context', () => {
  assert.deepEqual(provenanceOf(undefined), { source: '', workspace: '' })
  assert.deepEqual(provenanceOf({ agent: { session: { header: {} } } }), { source: '', workspace: '' })
  assert.deepEqual(provenanceOf(EXEC), { source: 'session:session-42', workspace: 'E:\\deepseek-workspace\\demo' })
  assert.deepEqual(boundText('abcdef', 3), { text: 'abc', truncated: true })
  assert.deepEqual(boundText('abc', 0), { text: 'abc', truncated: false })
  assert.deepEqual(
    summaryOf({ id: 'a', title: 'b', tags: ['c'], created: 'x', updated: 'y', chars: 3, body: 'ignored' }),
    { id: 'a', title: 'b', tags: ['c'], created: 'x', updated: 'y', chars: 3 },
  )
})
