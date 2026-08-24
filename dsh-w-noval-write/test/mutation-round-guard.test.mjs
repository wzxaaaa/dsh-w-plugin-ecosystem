import assert from 'node:assert/strict'
import { test } from 'node:test'
import { NovelMutationRoundGuard, currentTurnNumber } from '../noval-mutation-guard.js'

function turnEvent(turn) {
  return { type: 'turn/start', data: { turn } }
}

test('reads the current Harness model turn from session events', () => {
  const agent = { session: { events: [turnEvent(3), { type: 'step/start', data: { turn: 3 } }, turnEvent(4)] } }
  assert.equal(currentTurnNumber(agent), 4)
  assert.equal(currentTurnNumber({}), undefined)
})

test('blocks write and advance from oscillating in one model turn', () => {
  const guard = new NovelMutationRoundGuard()
  const agent = { session: { events: [turnEvent(7)] } }

  assert.deepEqual(guard.check(agent, 'novel_write'), { allowed: true })
  guard.record(agent, 'novel_write')

  const repeatedWrite = guard.check(agent, 'novel_write')
  const alternatingAdvance = guard.check(agent, 'novel_advance')
  assert.equal(repeatedWrite.allowed, false)
  assert.equal(alternatingAdvance.allowed, false)
  assert.equal(alternatingAdvance.previousOperation, 'novel_write')
  assert.match(alternatingAdvance.reason, /retry loop/)
})

test('allows a fresh destructive mutation on the next model turn', () => {
  const guard = new NovelMutationRoundGuard()
  const agent = { session: { events: [turnEvent(10)] } }
  guard.record(agent, 'novel_advance')
  assert.equal(guard.check(agent, 'novel_write').allowed, false)

  agent.session.events.push(turnEvent(11))
  assert.deepEqual(guard.check(agent, 'novel_write'), { allowed: true })
})
