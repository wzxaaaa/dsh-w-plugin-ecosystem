import test from 'node:test'
import assert from 'node:assert/strict'
import {
  appendMemory,
  clampLewdness,
  defaultState,
  formatMemoryTime,
  normalizeState,
  toView,
  validateAvatarRows,
  HEART_PATH,
  WHALE_GIRL_ROWS,
} from '../whale-tail-core.js'

test('avatar grid is a valid 24x24 palette grid', () => {
  assert.equal(validateAvatarRows(), true)
  assert.equal(WHALE_GIRL_ROWS.length, 24)
  for (const row of WHALE_GIRL_ROWS) assert.equal(row.length, 24)
})

test('heart path is a non-empty SVG path string', () => {
  assert.equal(typeof HEART_PATH, 'string')
  assert.ok(HEART_PATH.length > 20)
  assert.ok(HEART_PATH.startsWith('M'))
})

test('clampLewdness clamps and rounds into 0..100', () => {
  assert.equal(clampLewdness(-10), 0)
  assert.equal(clampLewdness(0), 0)
  assert.equal(clampLewdness(42.4), 42)
  assert.equal(clampLewdness(42.6), 43)
  assert.equal(clampLewdness(100), 100)
  assert.equal(clampLewdness(999), 100)
  assert.equal(clampLewdness('87'), 87)
  assert.equal(clampLewdness(undefined), 0)
  assert.equal(clampLewdness(null), 0)
  assert.equal(clampLewdness('abc'), 0)
})

test('defaultState is empty', () => {
  const state = defaultState(1234)
  assert.deepEqual(state, { lewdness: 0, memories: [], updatedAt: 1234 })
})

test('normalizeState tolerates junk input', () => {
  assert.deepEqual(normalizeState(undefined, 5), { lewdness: 0, memories: [], updatedAt: 5 })
  assert.deepEqual(normalizeState(null, 5), { lewdness: 0, memories: [], updatedAt: 5 })
  assert.deepEqual(normalizeState('x', 5), { lewdness: 0, memories: [], updatedAt: 5 })
  assert.deepEqual(normalizeState([], 5), { lewdness: 0, memories: [], updatedAt: 5 })
  const state = normalizeState({ lewdness: 500, memories: [{ text: 'hi' }, { text: 1 }, null] }, 10)
  assert.equal(state.lewdness, 100)
  assert.equal(state.memories.length, 1)
  assert.equal(state.memories[0].text, 'hi')
  assert.equal(normalizeState({ updatedAt: 0 }, 10).updatedAt, 0)
  assert.equal(normalizeState({ updatedAt: 'later' }, 10).updatedAt, 10)
})

test('appendMemory prepends newest first and caps transcript length', () => {
  let state = defaultState(0)
  state = appendMemory(state, 'first', 1000)
  state = appendMemory(state, 'second', 2000)
  assert.equal(state.memories.length, 2)
  assert.equal(state.memories[0].text, 'second')
  assert.equal(state.memories[0].at, 2000)
  assert.equal(state.memories[1].text, 'first')
  assert.equal(state.updatedAt, 2000)

  let big = defaultState(0)
  for (let i = 0; i < 600; i++) big = appendMemory(big, `m${i}`, i * 1000)
  assert.equal(big.memories.length, 512)
  assert.equal(big.memories[0].text, 'm599')
})

test('appendMemory rejects empty text', () => {
  assert.throws(() => appendMemory(defaultState(0), '   ', 1), /non-empty/)
  assert.throws(() => appendMemory(defaultState(0), 0, 1))
})

test('appendMemory truncates very long text', () => {
  const state = appendMemory(defaultState(0), 'x'.repeat(5000), 1)
  assert.equal(state.memories[0].text.length, 2000)
})

test('toView projects a client-safe shape', () => {
  const state = appendMemory(defaultState(0), 'hello', 1000)
  const view = toView(state, 1000)
  assert.equal(typeof view.lewdness, 'number')
  assert.equal(view.memories.length, 1)
  assert.equal(view.memories[0].text, 'hello')
  assert.equal(typeof view.memories[0].timeLabel, 'string')
})

test('formatMemoryTime renders relative labels', () => {
  const now = 1_000_000
  assert.equal(formatMemoryTime(now - 30_000, now), '刚刚')
  assert.equal(formatMemoryTime(now - 120_000, now), '2 分钟前')
  assert.equal(formatMemoryTime(now - 7200_000, now), '2 小时前')
  assert.equal(formatMemoryTime(now - 5 * 86400_000, now), '5 天前')
  assert.equal(formatMemoryTime(now, now), '刚刚')
  assert.equal(formatMemoryTime(NaN, now), '')
})
