import assert from 'node:assert/strict'
import test from 'node:test'

import {
  CaptureBroker,
  decodedBase64Bytes,
  normalizeCapturePayload,
  normalizePollInput,
} from '../camera-watch-core.js'

const ONE_PIXEL_JPEG = '/9j/2Q=='

test('normalizes browser presence and capture payloads', () => {
  assert.deepEqual(normalizePollInput({ clientId: ' tab-1 ', ready: true, deviceLabel: ' cam ' }), {
    clientId: 'tab-1',
    ready: true,
    deviceLabel: 'cam',
    error: '',
  })
  const capture = normalizeCapturePayload({
    data: ONE_PIXEL_JPEG,
    mediaType: 'image/jpeg',
    width: 1,
    height: 1,
    capturedAt: '2026-09-12T00:00:00.000Z',
  })
  assert.equal(capture.mediaType, 'image/jpeg')
  assert.deepEqual(decodedBase64Bytes(capture.data), Buffer.from([0xff, 0xd8, 0xff, 0xd9]))
  assert.throws(() => normalizeCapturePayload({ data: 'not base64!', width: 1, height: 1 }), /canonical base64/)
})

test('rejects capture requests when no ready browser page exists', async () => {
  const broker = new CaptureBroker()
  await assert.rejects(() => broker.request('homework'), /没有可用的摄像头页面/)
  broker.dispose()
})

test('routes one explicit request to a ready client and accepts its frame', async () => {
  const broker = new CaptureBroker({ timeoutMs: 1000 })
  broker.poll({ clientId: 'tab-1', ready: true, deviceLabel: 'USB Camera' })
  const resultPromise = broker.request('is the user writing?')
  const polled = broker.poll({ clientId: 'tab-1', ready: true, deviceLabel: 'USB Camera' })
  assert.equal(polled.request.question, 'is the user writing?')
  assert.deepEqual(broker.submit({
    clientId: 'tab-1',
    requestId: polled.request.id,
    payload: {
      data: ONE_PIXEL_JPEG,
      mediaType: 'image/jpeg',
      width: 1,
      height: 1,
      capturedAt: '2026-09-12T00:00:00.000Z',
      deviceLabel: 'USB Camera',
    },
  }), { accepted: true })
  const result = await resultPromise
  assert.equal(result.deviceLabel, 'USB Camera')
  assert.equal(broker.state().pendingCaptures, 0)
  broker.dispose()
})

test('only the client that claimed a request may settle it', async () => {
  const broker = new CaptureBroker({ timeoutMs: 1000 })
  broker.poll({ clientId: 'tab-a', ready: true })
  broker.poll({ clientId: 'tab-b', ready: true })
  const resultPromise = broker.request('check')
  const claim = broker.poll({ clientId: 'tab-a', ready: true })
  assert.equal(broker.submit({
    clientId: 'tab-b', requestId: claim.request.id,
    payload: { data: ONE_PIXEL_JPEG, width: 1, height: 1 },
  }).accepted, false)
  broker.fail({ clientId: 'tab-a', requestId: claim.request.id, message: 'camera busy' })
  await assert.rejects(() => resultPromise, /camera busy/)
  broker.dispose()
})
