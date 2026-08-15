import assert from 'node:assert/strict'
import test from 'node:test'

let captured
globalThis.window = {
  __ModuleLoader__: {
    load(handoff) { captured = handoff },
  },
}
await import(`../client.js?test=${Date.now()}`)
const plugin = captured.factory(() => { throw new Error('unexpected require') })

function event(seq, chunk) {
  return { event: { type: 'assistant/chunk', seq, time: seq * 10, data: { turn: 1, step: 1, chunk } } }
}

function definition() {
  let originalCalls = 0
  const value = {
    kind: 'assistant-step',
    start() {},
    update(context, match) {
      originalCalls += 1
      if (match.event.type === 'assistant/message') {
        return { ...context.state, blocks: [{ kind: 'text', text: 'final' }], hidden: false }
      }
      if (match.event.data.chunk.type === 'usage') {
        return { ...context.state, usage: match.event.data.chunk.usage }
      }
      return context.state
    },
    publication() {},
    buildLocationData() {},
    buildViewNode() {},
  }
  return { value, calls: () => originalCalls }
}

test('folds streamed reasoning without calling the original accumulated-text path', () => {
  const fixture = definition()
  const installed = plugin.installAssistantPatch(fixture.value)
  assert.equal(installed.applied, true)
  let state = {
    turn: 1, step: 1, blocks: [], hidden: false,
    firstVisibleSeq: undefined, firstVisibleTime: undefined, firstTokenTime: undefined,
  }
  state = fixture.value.update({ state }, event(1, { type: 'block-start', index: 0, blockType: 'reasoning' }))
  state = fixture.value.update({ state }, event(2, { type: 'reasoning-delta', index: 0, text: ' ' }))
  assert.equal(state.firstVisibleSeq, undefined)
  state = fixture.value.update({ state }, event(3, { type: 'reasoning-delta', index: 0, text: 'think' }))
  state = fixture.value.update({ state }, event(4, { type: 'reasoning-delta', index: 0, text: ' again' }))
  assert.equal(state.blocks[0].text, ' think again')
  assert.equal(state.firstVisibleSeq, 3)
  assert.equal(state.firstVisibleTime, 30)
  assert.equal(state.firstTokenTime, 20)
  assert.equal(fixture.calls(), 0)
})

test('tracks visibility per block when a block is replaced', () => {
  const fixture = definition()
  plugin.installAssistantPatch(fixture.value)
  let state = {
    turn: 1, step: 1, blocks: [], hidden: true,
    firstVisibleSeq: undefined, firstVisibleTime: undefined, firstTokenTime: undefined,
  }
  state = fixture.value.update({ state }, event(1, { type: 'text-delta', index: 0, text: 'hello' }))
  state = fixture.value.update({ state }, event(2, {
    type: 'block-end', index: 0, block: { type: 'text', text: '' },
  }))
  assert.equal(state.blocks[0].text, '')
  assert.equal(state.hidden, false)
})

test('preserves usage/final handling and restores the exact original update', () => {
  const fixture = definition()
  const original = fixture.value.update
  const installed = plugin.installAssistantPatch(fixture.value)
  let state = { turn: 1, step: 1, blocks: [], hidden: false }
  state = fixture.value.update({ state }, event(1, { type: 'usage', usage: { outputTokens: 7 } }))
  assert.deepEqual(state.usage, { outputTokens: 7 })
  state = fixture.value.update({ state }, {
    event: { type: 'assistant/message', seq: 2, time: 20, data: { turn: 1, step: 1 } },
  })
  assert.equal(state.blocks[0].text, 'final')
  assert.equal(fixture.calls(), 2)
  installed.dispose()
  assert.equal(fixture.value.update, original)
  installed.dispose()
})

test('fails closed for incompatible or already patched definitions', () => {
  assert.equal(plugin.installAssistantPatch({ kind: 'assistant-step' }).reason, 'incompatible-definition')
  const fixture = definition()
  const first = plugin.installAssistantPatch(fixture.value)
  assert.equal(plugin.installAssistantPatch(fixture.value).reason, 'already-patched')
  first.dispose()
})

test('reverts to the original implementation after an incompatible runtime state', () => {
  const fixture = definition()
  const original = fixture.value.update
  plugin.installAssistantPatch(fixture.value)
  const warn = console.warn
  console.warn = () => {}
  try {
    const state = { hidden: false }
    assert.equal(fixture.value.update({ state }, event(1, {
      type: 'reasoning-delta', index: 0, text: 'x',
    })), state)
  } finally {
    console.warn = warn
  }
  assert.equal(fixture.value.update, original)
  assert.equal(fixture.calls(), 1)
})

test('processes 100,000 reasoning deltas without accumulated-text rescans', () => {
  const fixture = definition()
  plugin.installAssistantPatch(fixture.value)
  let state = {
    turn: 1, step: 1, blocks: [], hidden: false,
    firstVisibleSeq: undefined, firstVisibleTime: undefined, firstTokenTime: undefined,
  }
  state = fixture.value.update({ state }, event(1, {
    type: 'block-start', index: 0, blockType: 'reasoning',
  }))
  const started = performance.now()
  for (let index = 0; index < 100_000; index += 1) {
    state = fixture.value.update({ state }, event(index + 2, {
      type: 'reasoning-delta', index: 0, text: 'x',
    }))
  }
  const elapsed = performance.now() - started
  assert.equal(state.blocks[0].text.length, 100_000)
  assert.ok(elapsed < 2_000, `100,000 chunks took ${elapsed.toFixed(1)}ms`)
})

test('applies through the registry service and restores on plugin disposal', () => {
  const fixture = definition()
  let cleanup
  globalThis.__DSH_W_CHATFLOW__ = { enabled: true, optimizeStreaming: true }
  plugin.apply({
    conversationEvents: {
      entries: () => [fixture.value],
      subscribe: () => () => {},
    },
    effect(effect) { cleanup = effect() },
  })
  assert.notEqual(fixture.value.update.name, 'update')
  cleanup()
  assert.equal(fixture.value.update.name, 'update')
  delete globalThis.__DSH_W_CHATFLOW__
})
