import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import vm from 'node:vm'

test('desktop startup never requests denied video permission or opens a browser; explicit start uses the local bridge', async t => {
  const source = await readFile(new URL('../client.js', import.meta.url), 'utf8')
  let definition, section, pollTimer, opened = [], creates = 0, stops = 0, mediaRequests = 0
  let bridgeState = { cameraReady: false, connectedClients: 0, readyClients: 0 }
  const cleanup = []
  const document = { querySelector: () => null, createElement: () => ({ dataset: {}, play: async () => {}, remove() {} }), head: { appendChild() {} } }
  const window = {
    __ModuleLoader__: { load: value => { definition = value } },
    location: { protocol: 'dsh-app:' }, crypto: { randomUUID: () => 'desktop-camera' },
    localStorage: { getItem: () => null, setItem() {} },
    setTimeout: fn => { pollTimer = fn; return 1 }, clearTimeout() {},
    open: url => opened.push(url),
  }
  vm.runInNewContext(source, { window, document, navigator: { language: 'zh-CN', mediaDevices: { enumerateDevices: async () => [], getUserMedia: async () => { mediaRequests++; throw new Error('Permission denied') } } }, console })
  const plugin = definition.factory(() => ({}))
  const ok = value => ({ ok: true, value })
  const remote = {
    poll: async () => ok({ request: null, state: bridgeState }),
    createBrowserBridge: async () => { creates++; return ok({ url: 'http://127.0.0.1:12345/#test' }) },
    stopBrowserBridge: async () => { stops++; return ok({ stopped: true }) },
  }
  await plugin.apply({
    remote: { $mount: async () => () => {} }, get: () => remote,
    sessions: { list: { getSnapshot: () => ({ byId: {} }) } },
    locale: { register: () => () => {}, bind: () => k => k },
    effect: fn => { const disposer = fn(); if (typeof disposer === 'function') cleanup.push(disposer) },
    slots: { inject: (_name, fn) => fn(), register: options => { section = options; return () => {} } },
  })
  t.after(() => cleanup.reverse().forEach(dispose => dispose()))
  const runtime = section.inject().runtime
  await Promise.resolve()
  assert.equal(mediaRequests, 0); assert.equal(creates, 0); assert.equal(opened.length, 0)
  await runtime.start()
  assert.equal(mediaRequests, 0); assert.equal(creates, 1); assert.equal(stops, 1)
  assert.deepEqual(opened, ['http://127.0.0.1:12345/#test'])
  assert.equal(runtime.snapshot().status, 'waiting')
  bridgeState = { cameraReady: true, connectedClients: 1, readyClients: 1, deviceLabel: 'Browser camera' }
  await pollTimer()
  assert.equal(runtime.snapshot().status, 'ready')
  assert.equal(runtime.snapshot().deviceLabel, 'Browser camera')
  runtime.stop(); await Promise.resolve()
  assert.equal(stops, 2)
  assert.equal(runtime.snapshot().status, 'stopped')
})
