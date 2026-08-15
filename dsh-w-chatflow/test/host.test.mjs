import assert from 'node:assert/strict'
import test from 'node:test'
import {
  buildConfigTag, buildStyleTag, injectConfig, injectStyle, normalizeIntrinsicSize,
} from '../host-core.js'

test('normalizes the intrinsic row height', () => {
  assert.equal(normalizeIntrinsicSize(12), 40)
  assert.equal(normalizeIntrinsicSize(4200), 4000)
  assert.equal(normalizeIntrinsicSize('320.4'), 320)
  assert.equal(normalizeIntrinsicSize('nope'), 260)
})

test('injects idempotent style and client configuration tags', () => {
  const style = buildStyleTag(320)
  const config = buildConfigTag({ enabled: true, optimizeStreaming: true })
  const once = injectStyle(injectConfig('<html><head></head><body></body></html>', config), style)
  const twice = injectStyle(injectConfig(once, config), style)
  assert.equal(twice, once)
  assert.match(once, /content-visibility: auto/)
  assert.match(once, /window\.__DSH_W_CHATFLOW__=\{"enabled":true,"optimizeStreaming":true\}/)
})

test('configuration is explicit when optimizations are disabled', () => {
  const tag = buildConfigTag({ enabled: false, optimizeStreaming: false })
  assert.match(tag, /\{"enabled":false,"optimizeStreaming":false\}/)
})
