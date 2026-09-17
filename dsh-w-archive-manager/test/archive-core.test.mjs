import assert from 'node:assert/strict'
import test from 'node:test'
import {
  RETENTION_MS, clearTombstones, completeLegacyRecovery, extractSessionHeader,
  indexSessionHeaders, isDue, legacyRecoveryIds, markDeleteRequested, markPurged,
  normalizeState, publicItems, reconcileEntries,
} from '../archive-core.js'

test('normalizes persisted state without trusting malformed fields', () => {
  const state = normalizeState({
    entries: { a: { archivedAt: 10 }, b: null, '': { archivedAt: 5 } },
    tombstones: { c: { purgedAt: 20 } },
  }, 100)
  assert.deepEqual(state, {
    version: 2,
    entries: { a: { archivedAt: 10 }, b: { archivedAt: 100 } },
    tombstones: { c: { purgedAt: 20 } },
    legacyRecoveryCompleted: false,
  })
})

test('reconciles authoritative archive ids without pruning temporarily unlisted sessions', () => {
  const state = normalizeState({ entries: { kept: { archivedAt: 10 }, gone: { archivedAt: 20 } } }, 100)
  const next = reconcileEntries(state, ['kept', 'fresh', 'unlisted'], 200)
  assert.deepEqual(next.entries, {
    kept: { archivedAt: 10 },
    fresh: { archivedAt: 200 },
    unlisted: { archivedAt: 200 },
  })
})

test('keeps pending deletion evidence even if the old bug removed the archive marker', () => {
  let state = normalizeState({ entries: { pending: { archivedAt: 10 } } }, 100)
  state = markDeleteRequested(state, 'pending', 30)
  const next = reconcileEntries(state, [], 200)
  assert.deepEqual(next.entries, { pending: { archivedAt: 10, deleteRequestedAt: 30 } })
})

test('v1 recovery re-adds entry ids once and then records completion', () => {
  const state = normalizeState({ version: 1, entries: { lost: { archivedAt: 10 } } }, 100)
  assert.deepEqual(legacyRecoveryIds(state, []), ['lost'])
  const completed = completeLegacyRecovery(state)
  assert.equal(completed.legacyRecoveryCompleted, true)
  assert.deepEqual(legacyRecoveryIds(completed, []), [])
})

test('indexes both legacy headers and modern persistence snapshots', () => {
  const legacy = { id: 'legacy', cwd: 'C:/legacy' }
  const modernHeader = { id: 'modern', cwd: 'C:/modern' }
  const headers = indexSessionHeaders([legacy, { header: modernHeader, revision: 'r1' }])
  assert.equal(headers.get('legacy'), legacy)
  assert.equal(headers.get('modern'), modernHeader)
  assert.equal(extractSessionHeader({ header: modernHeader }), modernHeader)
})

test('rejects malformed or duplicate persistence listings instead of treating them as empty', () => {
  assert.throws(() => indexSessionHeaders([{ revision: 'missing-header' }]), /valid header id/u)
  assert.throws(() => indexSessionHeaders([{ id: 'same' }, { header: { id: 'same' } }]), /duplicate id/u)
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
