import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import {
  DEFAULT_PINNED_CHARS,
  MAX_PINNED,
  PINNED_CONTEXT_ORDER,
  movePinned,
  normalizePinned,
  pinnedPromptText,
  planPinned,
  setPinned,
} from '../kb-pinned.js'
import { BANNED_CONTEXT_ORDER } from '../kb-writing.js'

const note = (id, body, title = `标题${id}`) => ({ id, title, body })

test('pin lists are cleaned, de-duplicated and bounded', () => {
  assert.deepEqual(normalizePinned(null), { version: 1, ids: [] })
  assert.deepEqual(normalizePinned({ ids: [' a ', 'a', '', 3, 'b'] }), { version: 1, ids: ['a', 'b'] })
  const many = normalizePinned({ ids: Array.from({ length: MAX_PINNED + 5 }, (_, i) => `n${i}`) })
  assert.equal(many.ids.length, MAX_PINNED)
})

test('pinning appends, unpinning removes, and the order can be changed', () => {
  let list = setPinned(null, 'a', true)
  list = setPinned(list, 'b', true)
  list = setPinned(list, 'c', true)
  assert.deepEqual(list.ids, ['a', 'b', 'c'])
  assert.deepEqual(setPinned(list, 'b', true).ids, ['a', 'b', 'c'], 'pinning twice keeps the position')
  list = movePinned(list, 'c', -1)
  assert.deepEqual(list.ids, ['a', 'c', 'b'])
  assert.deepEqual(movePinned(list, 'a', -1).ids, ['a', 'c', 'b'], 'the first stays first')
  assert.deepEqual(movePinned(list, 'a', 5).ids, ['c', 'a', 'b'], 'one step at a time')
  assert.deepEqual(setPinned(list, 'c', false).ids, ['a', 'b'])
  assert.throws(() => movePinned(list, 'z', 1), /is not pinned/)
  assert.throws(() => setPinned(list, ' ', true), /must not be empty/)
  const full = normalizePinned({ ids: Array.from({ length: MAX_PINNED }, (_, i) => `n${i}`) })
  assert.throws(() => setPinned(full, 'extra', true), /at most/)
})

test('notes are injected whole in pin order; what does not fit is listed for kb_read', () => {
  const notes = [note('a', '甲'.repeat(60)), note('b', '乙'.repeat(50)), note('c', '丙'.repeat(30))]
  const plan = planPinned(notes, 100)
  assert.deepEqual(plan.included.map(item => item.id), ['a', 'c'], 'a later short note still fits after a long one is skipped')
  assert.deepEqual(plan.deferred.map(item => item.id), ['b'])
  assert.equal(plan.used, 90)
  const text = pinnedPromptText(notes, { budget: 100, corpusName: '仙凡' })
  assert.match(text, /^# 置顶笔记「仙凡」（写作前必读）/)
  assert.match(text, /动笔、检索素材之前先读完并遵守/)
  assert.ok(text.indexOf('## 1. 标题a（a）') < text.indexOf('## 2. 标题c（c）'))
  assert.ok(text.includes('甲'.repeat(60)), 'bodies are injected whole')
  assert.ok(!text.includes('乙'.repeat(50)), 'an over-budget body is not cut in half')
  assert.match(text, /动笔前必须先用 kb_read 按顺序读完这些笔记：\n- 标题b（b）/)
})

test('nothing pinned means nothing injected', () => {
  assert.equal(pinnedPromptText([]), '')
  assert.equal(pinnedPromptText(undefined), '')
  assert.equal(planPinned([note('a', 'x')]).budget, DEFAULT_PINNED_CHARS)
})

test('pins are read before the style index and only in writing mode', async () => {
  assert.ok(PINNED_CONTEXT_ORDER < 500, 'before the style index (order 500)')
  assert.ok(PINNED_CONTEXT_ORDER < BANNED_CONTEXT_ORDER)
  const host = await readFile(new URL('../index.js', import.meta.url), 'utf8')
  const client = await readFile(new URL('../client.js', import.meta.url), 'utf8')
  const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'))
  assert.ok(manifest.files.includes('kb-pinned.js'))
  assert.match(host, /name: 'dsh-w-knowledge-base:pinned', order: PINNED_CONTEXT_ORDER/)
  assert.match(host, /if \(scope\.mode !== 'writing'\) return ''/)
  assert.match(host, /pinned notes are only available in writing mode/)
  for (const method of ['getPinned', 'setPinned', 'movePinned']) {
    assert.match(host, new RegExp(`Remote\\('${method}'\\)`))
    assert.match(client, new RegExp(`descriptor\\("${method}"`))
  }
  assert.match(client, /workMode === "writing" && canPin \? function \(\) \{ togglePin\(selected\); \}/)
})
