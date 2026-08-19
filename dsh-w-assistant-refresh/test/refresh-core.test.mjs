import test from 'node:test'
import assert from 'node:assert/strict'
import {
  chatRowKey,
  collectSessionHideKeys,
  locateRegenerationTarget,
  replacementHideKeys,
  triggerHideKey,
} from '../refresh-core.js'

const user = (seq, id, text, source = { kind: 'user' }) => ({
  type: 'user/message', seq, data: { id, role: 'user', content: [{ type: 'text', text }], source },
})
const assistant = (seq, id, text) => ({
  type: 'assistant/message', seq, data: {
    turn: 1, step: 1,
    message: { id, role: 'assistant', content: [{ type: 'text', text }], source: { kind: 'model' } },
  },
})

test('replaces the selected prompt through the current visible tail', () => {
  const events = [
    user(0, 'u1', 'first'), assistant(1, 'a1', 'one'),
    user(2, 'u2', 'second'), assistant(3, 'a2', 'two'),
  ]
  const result = locateRegenerationTarget(events, [0, 1, 2, 3], 'a1')
  assert.equal(result.ok, true)
  assert.equal(result.startSeq, 0)
  assert.equal(result.endSeq, 3)
  assert.deepEqual(result.sourceEventSeqs, [0, 1, 2, 3])
  assert.equal(result.message.content[0].text, 'first')
})

test('skips injected context and selects the nearest human prompt', () => {
  const events = [
    user(0, 'u1', 'question'),
    user(1, 'ctx', 'context', { kind: 'plugin', plugin: 'fixture' }),
    assistant(2, 'a1', 'answer'),
  ]
  const result = locateRegenerationTarget(events, [0, 1, 2], 'a1')
  assert.equal(result.ok, true)
  assert.equal(result.startSeq, 0)
})

test('rejects an assistant answer outside the visible surface', () => {
  const events = [user(0, 'u1', 'question'), assistant(1, 'a1', 'answer')]
  assert.deepEqual(locateRegenerationTarget(events, [0], 'a1'), {
    ok: false,
    reason: 'assistant-message-not-visible',
  })
})

test('rejects a reply with no visible human prompt', () => {
  const events = [
    user(0, 'ctx', 'context', { kind: 'plugin', plugin: 'fixture' }),
    assistant(1, 'a1', 'answer'),
  ]
  assert.deepEqual(locateRegenerationTarget(events, [0, 1], 'a1'), {
    ok: false,
    reason: 'user-message-not-visible',
  })
})

// ---- hide-key helpers ----

const evUser = (seq, id, source = { kind: 'user' }) => ({
  type: 'user/message', seq, data: { id, role: 'user', content: [{ type: 'text', text: 'q' }], source },
})
const evAssistant = (seq, turn, step, messageId) => ({
  type: 'assistant/message', seq, data: {
    turn, step,
    message: { id: messageId, role: 'assistant', content: [{ type: 'text', text: 'a' }], source: { kind: 'model' } },
  },
})
const evTool = (seq, turn, step, callId) => ({
  type: 'tool/result', seq, data: {
    turn, step,
    message: { role: 'tool', source: { callId }, content: [] },
  },
})
const ownedReplacement = (seq, start, end, shadowed, id = 'replay') => ({
  type: 'user/message', seq, surfaceOp: { op: 'replace', start, end },
  sourceEventSeqs: shadowed,
  data: { id, role: 'user', content: [{ type: 'text', text: 'q' }], source: { kind: 'user' } },
})
const triggerEvent = (seq, id) => ({
  type: 'user/message', seq, surfaceOp: 'append',
  data: {
    id, role: 'user', content: [{ type: 'text', text: 'trigger' }],
    source: {
      kind: 'plugin',
      plugin: 'dsh-w-assistant-refresh',
      form: 'notice',
      summary: 'dsh-w-assistant-refresh/internal-regenerate',
    },
  },
})

test('chatRowKey mirrors the client conversation context key format', () => {
  assert.equal(chatRowKey('input-message', 'u1'), '13:input-messageu1')
  assert.equal(chatRowKey('assistant-step', '1:1'), '14:assistant-step1:1')
  assert.equal(chatRowKey('turn-tail', '1'), '9:turn-tail1')
  assert.equal(triggerHideKey('t1'), '13:input-messaget1')
})

test('replacementHideKeys keeps the leading question row and hides the rest', () => {
  const events = [
    evUser(0, 'u1'),
    evAssistant(1, 1, 1, 'a1'),
    evTool(2, 1, 2, 'c1'),
    evUser(3, 'u2'),
    evAssistant(4, 2, 1, 'a2'),
  ]
  const keys = replacementHideKeys(events, ownedReplacement(5, 0, 4, [0, 1, 2, 3, 4])).sort()
  assert.deepEqual(keys, [
    '10:turn-error1', '10:turn-error2',
    '13:input-messageu2',
    '14:assistant-step1:1', '14:assistant-step2:1',
    '15:turn-max-tokens1', '15:turn-max-tokens2',
    '9:tool-callc1', '9:turn-tail1', '9:turn-tail2',
  ].sort())
  // the leading question row u1 stays visible
  assert.ok(!keys.includes('13:input-messageu1'))
})

test('replacementHideKeys ignores non-owned replacements (compaction)', () => {
  const events = [evUser(0, 'u1'), evAssistant(1, 1, 1, 'a1')]
  const compaction = {
    type: 'user/message', seq: 2, surfaceOp: { op: 'replace', start: 0, end: 1 },
    sourceEventSeqs: [0, 1],
    data: {
      id: 'cp', role: 'user', content: [],
      source: { kind: 'plugin', plugin: 'compact', form: 'snapshot', sections: [] },
    },
  }
  assert.deepEqual(replacementHideKeys(events, compaction), [])
})

test('collectSessionHideKeys gathers trigger rows, replacement rows and retry notices', () => {
  const events = [
    triggerEvent(0, 't1'),
    evUser(1, 'u1'),
    evAssistant(2, 1, 1, 'a1'),
    { type: 'llm/retry', seq: 3, data: { turn: 1, step: 1, retryId: 'r1', retry: 1 } },
    ownedReplacement(4, 1, 2, [1, 2]),
  ]
  const keys = collectSessionHideKeys(events).sort()
  assert.deepEqual(keys, [
    '10:turn-error1', '11:model-retryr1', '13:input-messaget1',
    '14:assistant-step1:1', '15:turn-max-tokens1', '9:turn-tail1',
  ].sort())
})
