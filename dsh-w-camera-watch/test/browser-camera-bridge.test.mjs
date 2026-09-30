import test from 'node:test'
import assert from 'node:assert/strict'
import { request } from 'node:http'
import { CaptureBroker } from '../camera-watch-core.js'
import { createBrowserCameraBridge } from '../browser-camera-bridge.js'

async function setup(t) {
  const broker = new CaptureBroker(), bridge = await createBrowserCameraBridge(broker)
  t.after(() => { bridge.close(); broker.dispose() })
  const url = new URL(bridge.url), authorization = `Bearer ${url.hash.slice(1)}`
  async function api(method, input, headers = {}) {
    return fetch(url.origin + '/api/' + method, { method: 'POST', headers: { authorization, 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(input) })
  }
  return { broker, bridge, url, api }
}
test('serves a camera-only local page and rejects missing tokens and foreign origins', async t => {
  const { url, api } = await setup(t)
  const page = await fetch(url.origin)
  assert.equal(page.status, 200)
  assert.match(page.headers.get('permissions-policy'), /microphone=\(\)/)
  assert.match(page.headers.get('content-security-policy'), /frame-ancestors 'none'/)
  assert.match(await page.text(), /启动并授权/)
  assert.equal((await api('poll', {}, { authorization: '' })).status, 401)
  assert.equal((await api('poll', {}, { origin: 'https://example.com' })).status, 403)
  const status = await new Promise((resolve, reject) => {
    const req = request(url, { headers: { Host: 'attacker.test' } }, res => { res.resume(); resolve(res.statusCode) })
    req.on('error', reject); req.end()
  })
  assert.equal(status, 403)
  assert.equal((await api('poll', [], {})).status, 400)
  assert.equal((await api('poll', {}, { 'Content-Type': 'text/plain' })).status, 415)
  assert.equal((await api('submit', { payload: 'x'.repeat(8_100_001) })).status, 413)
})
test('routes snapshots to the existing broker and prevents client identity spoofing', async t => {
  const { broker, api } = await setup(t)
  const value = await (await api('poll', { ready: true, deviceLabel: 'Test camera', clientId: 'spoofed' })).json()
  assert.equal(value.state.cameraReady, true)
  assert.equal(broker.clients.has('spoofed'), false)
  const capture = broker.request('Test capture')
  const { request: claim } = await (await api('poll', { ready: true })).json()
  const payload = { data: 'dGVzdA==', mediaType: 'image/jpeg', width: 10, height: 10 }
  assert.equal((await (await api('submit', { requestId: claim.id, payload, clientId: 'spoofed' })).json()).accepted, true)
  assert.equal((await capture).data, payload.data)
  await api('disconnect', {})
  assert.equal(broker.state().cameraReady, false)
})
test('closing the bridge immediately rejects a claimed capture and disconnects its client', async t => {
  const { broker, bridge, api } = await setup(t)
  await api('poll', { ready: true })
  const captured = broker.request()
  const rejected = assert.rejects(captured, /已断开/)
  await api('poll', { ready: true })
  bridge.close()
  await rejected
  assert.equal(broker.state().connectedClients, 0)
})
