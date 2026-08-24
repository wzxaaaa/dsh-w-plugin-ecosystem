import assert from 'node:assert/strict'
import { test } from 'node:test'
import { buildSnippet, compileQuery, countOccurrences, queryTokens, recencyFactor, searchNotes, tokenize } from '../kb-search.js'

const NOW = Date.parse('2026-09-10T00:00:00.000Z')

function note(id, title, tags, body, updatedIso) {
  const updatedMs = Date.parse(updatedIso)
  return { id, title, tags, body, updatedMs, createdMs: updatedMs, updated: updatedIso, chars: body.length }
}

const NOTES = [
  note('a', 'DSH plugin packaging', ['dsh', 'packaging'], 'Always run remove before add, otherwise pnpm keeps the old tarball.', '2026-09-09T00:00:00.000Z'),
  note('b', 'Typert codec must be strict', ['dsh', 'typert'], 'The client mount rejects src-json codecs; use a passthrough strict schema.', '2026-09-01T00:00:00.000Z'),
  note('c', '插件打包踩坑', ['dsh'], '先 remove 再 add，否则 pnpm 不会重新解包同版本 tarball。', '2026-08-20T00:00:00.000Z'),
]

test('tokenize splits ASCII words and expands CJK runs into bigrams', () => {
  assert.deepEqual(tokenize('DSH plugin, packaging!'), ['dsh', 'plugin', 'packaging'])
  assert.deepEqual(tokenize('插件打包'), ['插件', '件打', '打包'])
  assert.deepEqual(tokenize('包'), ['包'])
  assert.deepEqual(tokenize('a a a'), ['a'])
  assert.deepEqual(tokenize(undefined), [])
})

test('countOccurrences counts non-overlapping hits', () => {
  assert.equal(countOccurrences('aaaa', 'aa'), 2)
  assert.equal(countOccurrences('abc', 'z'), 0)
  assert.equal(countOccurrences('abc', ''), 0)
})

test('recencyFactor halves each half-life and floors at an unknown date', () => {
  assert.equal(recencyFactor(NOW, NOW), 1)
  assert.ok(Math.abs(recencyFactor(NOW - 21 * 86400000, NOW) - 0.5) < 1e-9)
  assert.equal(recencyFactor(0, NOW), 0)
})

test('a title match outranks a body-only match', () => {
  const outcome = searchNotes(NOTES, { query: 'packaging', now: NOW })
  assert.equal(outcome.matched, 1)
  assert.equal(outcome.results[0].id, 'a')
  assert.ok(outcome.results[0].score > 0)
})

test('search finds Chinese notes through bigrams', () => {
  const outcome = searchNotes(NOTES, { query: '打包', now: NOW })
  assert.deepEqual(outcome.results.map((entry) => entry.id), ['c'])
})

test('unmatched queries return nothing, and the tag filter is an AND', () => {
  assert.equal(searchNotes(NOTES, { query: 'kubernetes', now: NOW }).matched, 0)
  const tagged = searchNotes(NOTES, { query: 'remove', tags: ['typert'], now: NOW })
  assert.equal(tagged.matched, 0)
  const both = searchNotes(NOTES, { query: 'remove', tags: ['dsh'], now: NOW })
  assert.deepEqual(both.results.map((entry) => entry.id), ['a', 'c'], 'both dsh notes mention remove; the fresher one ranks first')
})

test('an empty query degenerates to most recently updated first', () => {
  const outcome = searchNotes(NOTES, { query: '', now: NOW })
  assert.deepEqual(outcome.results.map((entry) => entry.id), ['a', 'b', 'c'])
  assert.equal(outcome.matched, 3)
})

test('limit truncates the ranked list without changing the match count', () => {
  const outcome = searchNotes(NOTES, { query: 'remove', now: NOW, limit: 1 })
  assert.equal(outcome.results.length, 1)
  assert.equal(outcome.matched, 2)
})

test('snippets centre on the match and mark both cuts', () => {
  const query = compileQuery('tarball', NOW)
  const snippet = buildSnippet('x'.repeat(400) + ' tarball ' + 'y'.repeat(400), query, 80)
  assert.ok(snippet.startsWith('…'), snippet)
  assert.ok(snippet.endsWith('…'), snippet)
  assert.ok(snippet.includes('tarball'), snippet)
  assert.equal(buildSnippet('', query), '')
})

test('queryTokens is bounded', () => {
  const many = Array.from({ length: 60 }, (_, index) => 'w' + index).join(' ')
  assert.equal(queryTokens(many).length, 24)
})
