import assert from 'node:assert/strict'
import { test } from 'node:test'
import { normalizeSearchOptions, searchManuscripts } from '../noval-search-core.js'

const chapter = (index, id, number, title, volumeTitle = '卷一') => ({ index, id, volumeId: 'v1', volumeTitle, number, title })

// File names deliberately sort differently from the outline order.
const files = [
  { filename: 'b_入门.md', chapter: chapter(0, 'c1', '1', '入门'), text: '林默背着青玄剑上山。\n守门弟子没拦他。' },
  { filename: 'a_试剑.md', chapter: chapter(1, 'c2', '2', '试剑'), text: '﻿赵乾拔剑。\n青玄剑出鞘，林默退了一步。\n他把青玄剑插回鞘里。' },
  { filename: '笔记.md', chapter: null, text: '青玄剑的来历：待定。' },
  { filename: 'c_下山.md', chapter: chapter(2, 'c3', '3', '下山'), text: '苏晚问：“你的剑呢？”\n林默没说话。' },
]

test('hits follow the outline, unlinked files come last, with chapter labels and highlights', () => {
  const result = searchManuscripts(files, { query: '青玄剑' })
  assert.deepEqual(result.hits.map(hit => [hit.chapter, hit.line]), [['#1 入门', 1], ['#2 试剑', 2], ['#2 试剑', 3], ['', 1]])
  assert.equal(result.hits[0].excerpt, '林默背着【青玄剑】上山。')
  assert.equal(result.hits[0].chapterId, 'c1')
  assert.equal(result.hits[0].volume, '卷一')
  assert.equal(result.hits[3].filename, '笔记.md')
  assert.equal(result.totalHits, 4)
  assert.deepEqual(result.first, { filename: 'b_入门.md', chapter: '#1 入门', line: 1 })
  assert.deepEqual(result.last, { filename: '笔记.md', chapter: '', line: 1 })
  assert.deepEqual(result.perChapter.map(entry => [entry.chapter || entry.filename, entry.matches]), [['#1 入门', 1], ['#2 试剑', 2], ['笔记.md', 1]])
})

test('desc order shows the most recent mention first', () => {
  const result = searchManuscripts(files.filter(file => file.chapter), { query: '青玄剑', order: 'desc', maxResults: 1 })
  assert.deepEqual(result.hits.map(hit => [hit.chapter, hit.line]), [['#2 试剑', 3]])
  assert.equal(result.truncated, true)
})

test('desc order keeps unlinked notes after the newest linked manuscript', () => {
  const result = searchManuscripts(files, { query: '青玄剑', order: 'desc' })
  assert.deepEqual(result.hits.map(hit => [hit.chapterId, hit.line]), [['c2', 3], ['c2', 2], ['c1', 1], ['', 1]])
  const latest = searchManuscripts(files, { query: '青玄剑', order: 'desc', maxResults: 1 })
  assert.equal(latest.hits[0].chapterId, 'c2')
  assert.equal(latest.hits[0].line, 3)
  const notes = searchManuscripts([{ filename: 'b.md', chapter: null, text: '目标' }, { filename: 'a.md', chapter: null, text: '目标' }], { query: '目标', order: 'desc' })
  assert.deepEqual(notes.hits.map(hit => hit.filename), ['a.md', 'b.md'])
})

test('a chapter range searches only linked chapters inside it', () => {
  const result = searchManuscripts(files, { query: '林默', fromIndex: 1, toIndex: 2 })
  assert.deepEqual(result.hits.map(hit => hit.chapterId), ['c2', 'c3'])
  assert.equal(result.searchedFiles, 2)
})

test('any and all match modes', () => {
  const any = searchManuscripts(files, { query: '赵乾 苏晚', match: 'any' })
  assert.deepEqual(any.hits.map(hit => hit.chapterId), ['c2', 'c3'])
  const all = searchManuscripts(files, { query: '青玄剑 林默', match: 'all' })
  assert.deepEqual(all.hits.map(hit => [hit.chapterId, hit.line]), [['c1', 1], ['c2', 2]])
  assert.equal(all.hits[1].excerpt, '【青玄剑】出鞘，【林默】退了一步。')
})

test('matching ignores latin case unless asked, and context is clipped to the line', () => {
  const english = [{ filename: 'e.md', chapter: null, text: 'The Sword of Dawn.\nA sword again.' }]
  assert.equal(searchManuscripts(english, { query: 'sword' }).totalHits, 2)
  assert.equal(searchManuscripts(english, { query: 'sword', caseSensitive: true }).totalHits, 1)
  const long = [{ filename: 'l.md', chapter: null, text: `${'甲'.repeat(100)}目标${'乙'.repeat(100)}` }]
  const hit = searchManuscripts(long, { query: '目标', contextChars: 10 }).hits[0]
  assert.equal(hit.excerpt, `…${'甲'.repeat(10)}【目标】${'乙'.repeat(10)}…`)
})

test('no hits and invalid options', () => {
  assert.equal(searchManuscripts(files, { query: '不存在的词' }).totalHits, 0)
  assert.throws(() => normalizeSearchOptions({ query: '  ' }), /must not be empty/)
  assert.throws(() => normalizeSearchOptions({ query: 'x'.repeat(201) }), /longer than 200/)
  assert.throws(() => normalizeSearchOptions({ query: 'a b c d e f g h i', match: 'any' }), /at most 8 terms/)
  const options = normalizeSearchOptions({ query: '剑', match: 'weird', order: 'x', maxResults: 999, contextChars: 1 })
  assert.deepEqual([options.match, options.order, options.maxResults, options.contextChars], ['phrase', 'asc', 200, 10])
})
