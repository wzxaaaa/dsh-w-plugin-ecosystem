import assert from 'node:assert/strict'
import { test } from 'node:test'
import iconv from 'iconv-lite'
import { detectAndDecode, looksUtf8, normalizeEncoding } from '../kb-encoding.js'

const CN = '第一章 觉醒\n\n林风睁开眼，窗外的雨还在下。他握紧了手中的剑，心里清楚今夜必有一战。'

test('normalizeEncoding folds the GB family onto gb18030 and names UTF variants', () => {
  assert.equal(normalizeEncoding('GB2312'), 'gb18030')
  assert.equal(normalizeEncoding('GBK'), 'gb18030')
  assert.equal(normalizeEncoding('GB18030'), 'gb18030')
  assert.equal(normalizeEncoding('Big5'), 'big5')
  assert.equal(normalizeEncoding('UTF-8'), 'utf-8')
  assert.equal(normalizeEncoding('ascii'), 'utf-8')
  assert.equal(normalizeEncoding(''), 'utf-8')
})

test('looksUtf8 accepts valid UTF-8 and rejects raw GBK bytes', () => {
  assert.equal(looksUtf8(Buffer.from(CN, 'utf8')), true)
  assert.equal(looksUtf8(iconv.encode(CN, 'gb18030')), false)
})

test('detectAndDecode reads a plain UTF-8 buffer unchanged', () => {
  const result = detectAndDecode(Buffer.from(CN, 'utf8'))
  assert.equal(result.encoding, 'utf-8')
  assert.equal(result.text, CN)
})

test('detectAndDecode strips a UTF-8 BOM', () => {
  const result = detectAndDecode(Buffer.concat([Buffer.from([0xef, 0xbb, 0xbf]), Buffer.from(CN, 'utf8')]))
  assert.equal(result.encoding, 'utf-8')
  assert.equal(result.text, CN)
})

test('detectAndDecode recovers a GBK/GB18030 novel from mojibake', () => {
  const gbk = iconv.encode(CN, 'gb18030')
  const result = detectAndDecode(gbk)
  assert.equal(result.encoding, 'gb18030')
  assert.equal(result.text, CN, 'the round-trip must reproduce the original Chinese text')
})

test('detectAndDecode honours a UTF-16LE BOM', () => {
  const buffer = Buffer.concat([Buffer.from([0xff, 0xfe]), iconv.encode(CN, 'utf-16le')])
  const result = detectAndDecode(buffer)
  assert.equal(result.encoding, 'utf-16le')
  assert.equal(result.text, CN)
})

test('detectAndDecode tolerates empty and non-buffer input', () => {
  assert.deepEqual(detectAndDecode(Buffer.alloc(0)), { text: '', encoding: 'utf-8' })
  assert.deepEqual(detectAndDecode('already a string'), { text: 'already a string', encoding: 'utf-8' })
})
