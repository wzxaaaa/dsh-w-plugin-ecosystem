import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  DEFAULT_BANNED_PHRASES,
  MAX_BANNED_PHRASES,
  bannedPromptText,
  formatBannedList,
  normalizeMode,
  parseBannedList,
  styleIndexText,
  writingGuidanceText,
} from '../kb-writing.js'

test('normalizeMode only accepts the two known modes', () => {
  assert.equal(normalizeMode('writing'), 'writing')
  assert.equal(normalizeMode('assistant'), 'assistant')
  assert.equal(normalizeMode('nonsense'), 'assistant')
  assert.equal(normalizeMode(undefined), 'assistant')
})

test('writingGuidanceText names the corpus and switches its banned-list line', () => {
  const withList = writingGuidanceText('$DSH_HOME/knowledge-base/style-corpus', true)
  assert.ok(withList.includes('写作模式'))
  assert.ok(withList.includes('$DSH_HOME/knowledge-base/style-corpus'))
  assert.ok(withList.includes('kb_search'))
  assert.ok(withList.includes('禁用套路表'))
  const withoutList = writingGuidanceText('X', false)
  assert.ok(withoutList.includes('可以维护一张禁用套路表'))
})

test('parseBannedList drops comments, blanks, and duplicates and bounds length', () => {
  const text = '# a comment\n五味杂陈\n\n  嘴角勾起  \n五味杂陈\n# another\n'
  assert.deepEqual(parseBannedList(text), ['五味杂陈', '嘴角勾起'])
  const many = Array.from({ length: MAX_BANNED_PHRASES + 50 }, (_, i) => 'p' + i).join('\n')
  assert.equal(parseBannedList(many).length, MAX_BANNED_PHRASES)
  assert.deepEqual(parseBannedList(''), [])
})

test('formatBannedList round-trips through parseBannedList', () => {
  const text = formatBannedList(['五味杂陈', '五味杂陈', '嘴角勾起'])
  assert.ok(text.startsWith('# 禁用套路表'))
  assert.deepEqual(parseBannedList(text), ['五味杂陈', '嘴角勾起'])
  // The shipped defaults are themselves a clean, de-duplicated list.
  assert.deepEqual(parseBannedList(formatBannedList([...DEFAULT_BANNED_PHRASES])), [...DEFAULT_BANNED_PHRASES])
})

test('bannedPromptText renders the list or nothing', () => {
  assert.equal(bannedPromptText([]), '')
  const text = bannedPromptText(['五味杂陈', '嘴角勾起'])
  assert.ok(text.includes('禁用套路表'))
  assert.ok(text.includes('· 五味杂陈'))
  assert.ok(text.includes('· 嘴角勾起'))
})

test('styleIndexText advertises an empty vs a populated corpus', () => {
  assert.ok(styleIndexText('ROOT', 0, []).includes('还是空的'))
  const text = styleIndexText('ROOT', 120, [
    { tag: 'import', count: 120 },
    { tag: '剑客行', count: 80 },
    { tag: '边城', count: 40 },
  ])
  assert.ok(text.includes('120 段'))
  assert.ok(text.includes('剑客行(80)'))
  assert.ok(!text.includes('import(120)'), 'the import tag is not a source book')
  assert.ok(text.includes('kb_search'))
})
