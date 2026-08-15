import assert from 'node:assert/strict'
import test from 'node:test'

let registration
globalThis.window = {
  __ModuleLoader__: {
    load(value) {
      registration = value
    },
  },
}
globalThis.btoa ??= value => Buffer.from(value, 'binary').toString('base64')

await import(`../client.js?test=${Date.now()}`)
const plugin = registration.factory()

function file(bytes, name = 'sample.png', type = 'image/png') {
  return {
    name,
    type,
    async arrayBuffer() {
      return Uint8Array.from(bytes).buffer
    },
  }
}

function harness(remoteResult) {
  const calls = []
  const notices = []
  const released = []
  const effects = []
  const attachment = {
    id: 'draft-1',
    file: file([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  }
  const original = async function (session, text, imageIds, mode) {
    calls.push({ session, text, imageIds, mode })
  }
  const conversation = {
    sendSession: original,
    draftImages(ids) {
      return ids.length === 1 ? [attachment] : []
    },
    releaseDraftImages(value) {
      released.push(...value)
    },
    input: {
      for() {
        return {
          notify(level, text) {
            notices.push({ level, text })
          },
        }
      },
    },
  }
  const remoteCalls = []
  const ctx = {
    remote: {
      async $mount() {
        return () => {}
      },
    },
    sessions: {
      scope() {
        return {}
      },
    },
    get(name) {
      if (name === 'conversation') return conversation
      if (name === 'remote.vision') {
        return {
          async analyzeUploads(input) {
            remoteCalls.push(input)
            return remoteResult
          },
        }
      }
      return undefined
    },
    effect(factory) {
      const disposer = factory()
      if (typeof disposer === 'function') effects.push(disposer)
    },
  }
  return { attachment, calls, conversation, effects, notices, original, released, remoteCalls, ctx }
}

test('text-only sends pass through untouched', async () => {
  const h = harness({ ok: true, value: { text: 'unused', count: 1 } })
  await plugin.apply(h.ctx)
  const session = { sessionId: 's1' }
  await h.conversation.sendSession(session, 'hello', [], 'queue')
  assert.equal(h.remoteCalls.length, 0)
  assert.deepEqual(h.calls, [{ session, text: 'hello', imageIds: [], mode: 'queue' }])
  assert.equal(h.released.length, 0)
})

test('images are analyzed and the primary model receives text only', async () => {
  const h = harness({ ok: true, value: { text: 'Image 1: a warning banner.', count: 1 } })
  await plugin.apply(h.ctx)
  const session = { sessionId: 's1' }
  await h.conversation.sendSession(session, 'What is shown?', ['draft-1'], 'queue')
  assert.equal(h.remoteCalls.length, 1)
  assert.equal(h.remoteCalls[0].prompt, 'What is shown?')
  assert.equal(h.remoteCalls[0].images[0].mediaType, 'image/png')
  assert.equal(h.calls.length, 1)
  assert.deepEqual(h.calls[0].imageIds, [])
  assert.match(h.calls[0].text, /What is shown\?/)
  assert.match(h.calls[0].text, /a warning banner/)
  assert.equal(h.released.length, 1)
})

test('vision failures notify the scoped composer and retain draft images', async () => {
  const h = harness({ ok: false, error: { code: 'missing-service' } })
  await plugin.apply(h.ctx)
  await assert.rejects(
    h.conversation.sendSession({ sessionId: 's1' }, 'inspect', ['draft-1'], 'queue'),
    /analyzeUploads failed/,
  )
  assert.equal(h.calls.length, 0)
  assert.equal(h.released.length, 0)
  assert.equal(h.notices.length, 1)
  assert.equal(h.notices[0].level, 'error')
  assert.match(h.notices[0].text, /图片识别失败/)
})

test('plugin cleanup restores the original sendSession method', async () => {
  const h = harness({ ok: true, value: { text: 'ok', count: 1 } })
  await plugin.apply(h.ctx)
  assert.notEqual(h.conversation.sendSession, h.original)
  for (const dispose of h.effects.reverse()) dispose()
  assert.equal(h.conversation.sendSession, h.original)
})
