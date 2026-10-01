import assert from 'node:assert/strict'
import { test } from 'node:test'
import { assertChapterWordCount, chapterWordRequirement, parseChapterWordTarget, projectPrompt, validateChapterWordCount } from '../noval-write-core.js'

test('bare chapter targets are minimums with no invented upper bound', () => {
  for (const [raw, expected] of [['3000字', 3000], ['3000', 3000], ['3千', 3000], ['三千字', 3000], ['两千五百字', 2500], ['1.5万字', 15000], ['一万五千字', 15000], ['3,000字', 3000], ['每章目标字数：3000字', 3000]]) {
    assert.deepEqual(parseChapterWordTarget(raw), { raw, minWords: expected, maxWords: null }, raw)
  }
  assert.equal(assertChapterWordCount({ id: 'c1', targetWords: '3000字' }, 3000).ok, true)
  assert.equal(assertChapterWordCount({ id: 'c1', targetWords: '3000字' }, 50000).ok, true)
})

test('ranges and explicit bounds support common Chinese word targets', () => {
  for (const [raw, minWords, maxWords] of [
    ['3000-4000字', 3000, 4000], ['3000～4000字', 3000, 4000], ['3-4千字', 3000, 4000], ['三千至四千字', 3000, 4000], ['1.5-2万字', 15000, 20000],
    ['至少3千字', 3000, null], ['不少于3000字', 3000, null], ['3000字以上', 3000, null], ['≥3000字', 3000, null],
    ['最多4000字', null, 4000], ['不超过1.5万字', null, 15000], ['4000字以内', null, 4000], ['4000字以下', null, 4000],
    ['至少3000字，最多4000字', 3000, 4000],
  ]) assert.deepEqual(parseChapterWordTarget(raw), { raw, minWords, maxWords }, raw)
})

test('Chinese positional digits and omitted-unit shorthand cannot lower the intended target', () => {
  for (const [raw, expected] of [
    ['二〇二六字', 2026], ['二零二六字', 2026], ['三〇〇〇字', 3000],
    ['三千五字', 3500], ['一万五字', 15000], ['两万三字', 23000], ['一千二百三字', 1230],
    ['三千零五字', 3005], ['一万零五字', 10005], ['一千二百零三字', 1203], ['三十六字', 36],
  ]) {
    assert.deepEqual(parseChapterWordTarget(raw), { raw, minWords: expected, maxWords: null }, raw)
    assert.throws(() => assertChapterWordCount({ id: 'c', targetWords: raw }, expected - 1), error => error.code === 'NOVEL_CHAPTER_WORD_COUNT', raw)
    assert.equal(assertChapterWordCount({ id: 'c', targetWords: raw }, expected).ok, true, raw)
  }
  assert.throws(() => assertChapterWordCount({ id: 'c', targetWords: '二〇二六字' }, 6), error => error.minWords === 2026)
  for (const raw of ['三三千字', '一百百字', '一万万字']) assert.throws(() => parseChapterWordTarget(raw), error => error.code === 'INVALID_NOVEL_WORD_TARGET', raw)
})

test('mixed absolute and abbreviated ranges do not multiply the absolute lower bound', () => {
  for (const [raw, minWords, maxWords] of [
    ['3000-4千字', 3000, 4000], ['15000-2万字', 15000, 20000], ['3000-2万字', 3000, 20000], ['300-4千字', 300, 4000],
    ['3-4千字', 3000, 4000], ['1.5-2万字', 15000, 20000], ['10000-2万字', 10000, 20000],
  ]) {
    assert.deepEqual(parseChapterWordTarget(raw), { raw, minWords, maxWords }, raw)
    assert.equal(assertChapterWordCount({ id: 'c', targetWords: raw }, minWords).ok, true, raw)
    assert.throws(() => assertChapterWordCount({ id: 'c', targetWords: raw }, maxWords + 1), error => error.code === 'NOVEL_CHAPTER_WORD_COUNT', raw)
  }
  assert.throws(() => parseChapterWordTarget('4-3千字'), error => error.code === 'INVALID_NOVEL_WORD_TARGET')
})

test('per-chapter validation rejects only counts outside the explicit bounds', () => {
  const chapter = { id: 'c1', targetWords: '3000-4000字' }
  for (const words of [3000, 3500, 4000]) assert.equal(assertChapterWordCount(chapter, words).ok, true)
  assert.throws(() => assertChapterWordCount(chapter, 2999), error => error.code === 'NOVEL_CHAPTER_WORD_COUNT' && error.missingWords === 1 && error.actualWords === 2999 && error.wordRequirement.chapterId === 'c1' && error.retryable === true)
  assert.throws(() => assertChapterWordCount(chapter, 4001), error => error.code === 'NOVEL_CHAPTER_WORD_COUNT' && error.excessWords === 1 && error.maxWords === 4000)
  assert.equal(assertChapterWordCount({ targetWords: '最多4000字' }, 1000).ok, true)
  assert.deepEqual(validateChapterWordCount({ id: 'c1', targetWords: '3000字' }, 2000), { ok: false, chapterId: 'c1', rule: '3000字', actualWords: 2000, minWords: 3000, maxWords: null, missingWords: 1000, excessWords: 0 })
})

test('no chapter target means no whole-book fallback; malformed nonempty rules fail explicitly', () => {
  assert.equal(parseChapterWordTarget(''), null)
  assert.equal(chapterWordRequirement({ targetWords: '' }, { targetWords: '100万字' }), null)
  assert.equal(assertChapterWordCount({ id: 'c1', targetWords: '' }, 100).ok, true)
  for (const value of ['abc', '根据剧情', '4000-3000字', '0字', '1.5字', '至少3000字，最多2000字']) {
    assert.throws(() => assertChapterWordCount({ id: 'c1', targetWords: value }, 100), error => error.code === 'INVALID_NOVEL_WORD_TARGET' && error.wordRequirement.chapterId === 'c1' && error.wordRequirement.actualWords === 100, value)
  }
  assert.throws(() => validateChapterWordCount({ targetWords: '3000字' }, NaN), /nonnegative integer/)
})

test('the writing protocol requires reading detailed chapter outlines and counted retries', () => {
  const prompt = projectPrompt({ title: '书', targetWords: '100万字', volumes: [{ id: 'v1', chapters: [{ id: 'c1', targetWords: '3000字', summary: '细纲' }] }] })
  assert.match(prompt, /Before drafting, novel_outline_read the chapter detailed outline/)
  assert.match(prompt, /never use whole-book targetWords as a per-chapter fallback/)
  assert.match(prompt, /novel_save_chapter requires a chapter_id/)
  assert.match(prompt, /expand\/revise prose and retry until it passes/)
  const bounded = projectPrompt({ notes: '字'.repeat(10000), threads: [{ id: 't', title: '伏笔' }], progression: { systems: [{ id: 's', name: '修为', tiers: [{ name: '入门' }] }] } }, 2000)
  assert.ok(bounded.length <= 2000, `including both ledger protocols: ${bounded.length}`)
  assert.match(bounded, /novel_save_chapter requires a chapter_id/)
})
