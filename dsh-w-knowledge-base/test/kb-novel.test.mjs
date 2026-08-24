import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  buildImportDrafts,
  isNovelChapterLine,
  scanNovelChapters,
  sectionOrigin,
  splitDocument,
} from '../kb-ingest.js'

const NOVEL = [
  '本书由某某网站转载，仅供学习。',
  '',
  '第一章 觉醒',
  '',
  '林风睁开眼，窗外的雨还在下。',
  '',
  '第二章 出发',
  '',
  '天亮时，他已经走出了城门。',
  '',
  '第三章 相遇',
  '',
  '她站在桥头，回头看了他一眼。',
  '',
].join('\n')

test('isNovelChapterLine matches Chinese numbered, named, and Latin chapter lines', () => {
  assert.equal(isNovelChapterLine('第一章 觉醒'), true)
  assert.equal(isNovelChapterLine('第十二回'), true)
  assert.equal(isNovelChapterLine('第3章：反击'), true)
  assert.equal(isNovelChapterLine('楔子'), true)
  assert.equal(isNovelChapterLine('番外一 后日谈'), true)
  assert.equal(isNovelChapterLine('Chapter 7'), true)
  // A sentence that merely mentions a chapter is not a heading.
  assert.equal(isNovelChapterLine('他翻到第一章，发现里面夹着一封信，信里写满了往事和无法说出口的秘密。'), false)
  assert.equal(isNovelChapterLine('普通的一行正文。'), false)
})

test('scanNovelChapters finds every chapter line with its position', () => {
  const chapters = scanNovelChapters(NOVEL.split('\n'))
  assert.deepEqual(chapters.map((c) => c.text), ['第一章 觉醒', '第二章 出发', '第三章 相遇'])
})

test('splitDocument cuts a plain-text novel on its chapters', () => {
  const split = splitDocument({ name: '剑客行.txt', text: NOVEL })
  assert.equal(split.docTitle, '剑客行')
  assert.equal(split.docSlug, '剑客行')
  // three chapters; the short transcription banner folds into the first chapter
  // rather than becoming its own note.
  assert.equal(split.sections.length, 3)
  assert.ok(split.sections.every((s) => s.kind === 'chapter'))
  assert.equal(split.sections[0].heading, '第一章 觉醒')
  assert.ok(split.sections[0].body.includes('本书由某某网站转载'), 'banner folds into chapter one')
  assert.ok(split.sections[0].body.includes('林风睁开眼'))
  assert.equal(split.sections[2].heading, '第三章 相遇')
})

test('novel drafts carry the book slug and re-feed to the same origins', () => {
  const built = buildImportDrafts({ name: '剑客行.txt', text: NOVEL, tags: ['武侠'] })
  assert.equal(built.drafts.length, 3)
  assert.equal(built.drafts[0].title, '剑客行 · 第一章 觉醒')
  for (const draft of built.drafts) assert.deepEqual(draft.tags, ['import', '剑客行', '武侠'])
  const rebuilt = buildImportDrafts({ name: '剑客行.txt', text: NOVEL, tags: ['其它'] })
  assert.deepEqual(rebuilt.drafts.map((d) => d.origin), built.drafts.map((d) => d.origin))
})

test('a single chapter marker is not enough to override size splitting', () => {
  const doc = '第一章 只有一章\n\n' + 'word '.repeat(50)
  const split = splitDocument({ name: 'x.txt', text: doc, targetChars: 400 })
  // fewer than MIN_NOVEL_CHAPTERS chapters: falls back to the segment path
  assert.ok(split.sections.every((s) => s.kind !== 'chapter'))
})

test('an oversized chapter is cut into numbered parts with distinct origins', () => {
  const long = '第一章 长章\n\n' + Array.from({ length: 8 }, (_, i) => '第' + i + '段。' + '字'.repeat(60)).join('\n\n')
    + '\n\n第二章 短章\n\n收尾。'
  const split = splitDocument({ name: '书.txt', text: long, targetChars: 300 })
  const origins = split.sections.map((s, i) => sectionOrigin('书', s, i))
  assert.equal(new Set(origins).size, origins.length, 'origins stay unique across chapter parts')
  const ch1Parts = split.sections.filter((s) => s.heading === '第一章 长章')
  assert.ok(ch1Parts.length > 1, 'the long chapter split into parts')
})
