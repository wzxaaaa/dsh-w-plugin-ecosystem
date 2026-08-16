import test from 'node:test'
import assert from 'node:assert/strict'
import { findRefreshTarget, textBlocks } from '../refresh-core.js'

const assistant = (messageId, seq, turn) => ({ kind: 'assistant', messageId, seq, turn })
const user = (seq, text) => ({ kind: 'user', seq, content: [{ type: 'text', text }] })

test('selects the nearest user prompt and previous completed turn cut', () => {
  const result = findRefreshTarget({
    nodes: [user(2, 'old'), assistant('a1', 4, 1), user(7, 'target'), assistant('a2', 9, 2)],
    turnEnds: new Map([[1, 5], [2, 10]]),
  }, 'a2')
  assert.equal(result.ok, true)
  assert.equal(result.cutSeq, 5)
  assert.equal(result.userSeq, 7)
  assert.deepEqual(textBlocks(result.content), ['target'])
})

test('first-turn target has no cut and can use a blank session', () => {
  const result = findRefreshTarget({
    nodes: [user(2, 'first'), assistant('a1', 4, 1)],
    turnEnds: new Map([[1, 5]]),
  }, 'a1')
  assert.equal(result.ok, true)
  assert.equal(result.cutSeq, undefined)
})

test('ignores later user messages when locating the prompt for an assistant', () => {
  const result = findRefreshTarget({
    nodes: [user(2, 'first'), user(3, 'second'), assistant('a1', 4, 1)],
    turnEnds: new Map(),
  }, 'a1')
  assert.equal(result.ok, true)
  assert.equal(result.userSeq, 3)
})

test('returns a safe reason when the target is outside the loaded window', () => {
  assert.deepEqual(findRefreshTarget({ nodes: [], turnEnds: new Map() }, 'missing'), {
    ok: false,
    reason: 'message-not-visible',
  })
})

test('supports a steering message as the replay source', () => {
  const result = findRefreshTarget({
    nodes: [
      { kind: 'steering', seq: 5, content: [{ type: 'text', text: 'continue' }] },
      assistant('a2', 8, 2),
    ],
    turnEnds: new Map([[1, 3]]),
  }, 'a2')
  assert.equal(result.ok, true)
  assert.equal(result.userSeq, 5)
})
