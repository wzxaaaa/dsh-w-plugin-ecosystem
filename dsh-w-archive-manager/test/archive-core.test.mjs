import assert from 'node:assert/strict'
import test from 'node:test'
import {
  RETENTION_MS, clearTombstones, isDue, markDeleteRequested, markPurged,
  normalizeState, publicItems, reconcileEntries,
} from '../archive-core.js'

test('normalizes persisted state without trusting malformed fields', () => {
  const state = normalizeState({
    entries: { a: { archivedAt: 10 }, b: null, '': { archivedAt: 5 } },
    tombstones: { c: { purgedAt: 20 } },
  }, 100)
  assert.deepEqual(state.entries, { a: { archivedAt: 10 }, b: { archivedAt: 100 } })
  assert.deepEqual(state.tombstones, { c: { purgedAt: 20 } })
})

test('reconciles only known archived sessions and preserves their first timestamp', () => {
  const state = normalizeState({ entries: { kept: { archivedAt: 10 }, gone: { archivedAt: 20 } } }, 100)
  const next = reconcileEntries(state, ['kept', 'fresh', 'ghost'], ['kept', 'fresh'], 200)
  assert.deepEqual(next.entries, { kept: { archivedAt: 10 }, fresh: { archivedAt: 200 } })
})

test('30-day retention and explicit deletion share the same due predicate', () => {
  assert.equal(isDue({ archivedAt: 1_000 }, 1_000 + RETENTION_MS - 1), false)
  assert.equal(isDue({ archivedAt: 1_000 }, 1_000 + RETENTION_MS), true)
  assert.equal(isDue({ archivedAt: 1_000, deleteRequestedAt: 2_000 }, 2_000), true)
})

test('scheduled and purged sessions disappear from the public list', () => {
  let state = normalizeState({ entries: { a: { archivedAt: 10 }, b: { archivedAt: 20 } } }, 100)
  state = markDeleteRequested(state, 'a', 30)
  assert.deepEqual(publicItems(state), [{ sessionId: 'b', archivedAt: 20 }])
  state = markPurged(state, 'a', 40)
  assert.deepEqual(state.tombstones, { a: { purgedAt: 40 } })
  state = clearTombstones(state, ['a'])
  assert.deepEqual(state.tombstones, {})
})
