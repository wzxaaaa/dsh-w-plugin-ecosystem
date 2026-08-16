import assert from 'node:assert/strict'
import test from 'node:test'

import {
  buildLocalImageVisionContent,
  buildUploadVisionContent,
  chatCompletionsEndpoint,
  extractVisionText,
  imageMediaTypeForPath,
  normalizeLocalImage,
  normalizeUploadBatch,
} from '../vision-core.js'

const pngBytes = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
const png = pngBytes.toString('base64')

test('normalizes a strict image upload batch', () => {
  const value = normalizeUploadBatch({
    prompt: 'What is shown?',
    images: [{ mediaType: 'image/png', data: png, name: 'C:\\temp\\sample.png' }],
  })
  assert.equal(value.prompt, 'What is shown?')
  assert.equal(value.images.length, 1)
  assert.equal(value.images[0].name, 'sample.png')
  assert.equal(value.totalBytes, 8)
})

test('rejects mismatched media types and malformed base64', () => {
  assert.throws(() => normalizeUploadBatch({
    images: [{ mediaType: 'image/jpeg', data: png }],
  }), /does not match/)
  assert.throws(() => normalizeUploadBatch({
    images: [{ mediaType: 'image/png', data: 'not base64' }],
  }), /base64|invalid/)
  assert.throws(() => normalizeUploadBatch({
    images: [{ mediaType: 'image/png', data: 'iVB=Rw==' }],
  }), /strict base64/)
})

test('validates a maximum-size upload without recursive regular-expression overflow', () => {
  const bytes = Buffer.alloc(5 * 1024 * 1024)
  pngBytes.copy(bytes)
  const value = normalizeUploadBatch({
    images: [{ mediaType: 'image/png', data: bytes.toString('base64'), name: 'maximum.png' }],
  })
  assert.equal(value.images[0].bytes, bytes.length)
  assert.equal(value.totalBytes, bytes.length)
})

test('builds one labeled image part per upload', () => {
  const batch = normalizeUploadBatch({
    prompt: 'Read this',
    images: [{ mediaType: 'image/png', data: png, name: 'sample.png' }],
  })
  const content = buildUploadVisionContent(batch)
  assert.equal(content.length, 3)
  assert.match(content[0].text, /Read this/)
  assert.match(content[1].text, /Image 1/)
  assert.match(content[2].image_url.url, /^data:image\/png;base64,/)
})

test('normalizes local PNG, JPEG, WebP, and GIF files', () => {
  const fixtures = [
    ['shot.png', pngBytes, 'image/png'],
    ['shot.jpg', Buffer.from([0xff, 0xd8, 0xff]), 'image/jpeg'],
    ['shot.webp', Buffer.from('RIFF1234WEBP', 'ascii'), 'image/webp'],
    ['shot.gif', Buffer.from('GIF89a', 'ascii'), 'image/gif'],
  ]
  for (const [filePath, bytes, mediaType] of fixtures) {
    const image = normalizeLocalImage({ filePath, bytes, question: 'Inspect rendering' })
    assert.equal(image.mediaType, mediaType)
    assert.equal(image.bytes, bytes.length)
    assert.equal(image.name, filePath)
  }
})

test('builds local image content with the visual question and data URL', () => {
  const image = normalizeLocalImage({
    filePath: 'C:\\shots\\scene.png',
    bytes: pngBytes,
    question: 'Is the page still loading?',
  })
  const content = buildLocalImageVisionContent(image)
  assert.equal(content.length, 2)
  assert.match(content[0].text, /Is the page still loading/)
  assert.match(content[0].text, /scene.png/)
  assert.match(content[1].image_url.url, /^data:image\/png;base64,/)
})

test('recognizes supported local image extensions case-insensitively', () => {
  assert.equal(imageMediaTypeForPath('C:\\temp\\SHOT.PNG'), 'image/png')
  assert.equal(imageMediaTypeForPath('/tmp/photo.jpeg'), 'image/jpeg')
  assert.equal(imageMediaTypeForPath('plain.txt'), undefined)
})

test('rejects local extension mismatches, empty files, and oversized images', () => {
  assert.throws(() => normalizeLocalImage({ filePath: 'wrong.jpg', bytes: pngBytes }), /extension declares/)
  assert.throws(() => normalizeLocalImage({ filePath: 'empty.png', bytes: Buffer.alloc(0) }), /empty/)
  assert.throws(() => normalizeLocalImage({
    filePath: 'large.png',
    bytes: Buffer.alloc(5 * 1024 * 1024 + 1),
  }), /5 MB/)
  assert.throws(() => normalizeLocalImage({
    filePath: 'image.bmp',
    bytes: Buffer.from([0x42, 0x4d]),
  }), /only accepts/)
})

test('accepts string and array response content', () => {
  assert.equal(extractVisionText({
    choices: [{ message: { content: '  description  ' } }],
  }), 'description')
  assert.equal(extractVisionText({
    choices: [{ message: { content: [{ type: 'text', text: 'one' }, { type: 'text', text: 'two' }] } }],
  }), 'one\ntwo')
})

test('normalizes common base URL forms', () => {
  assert.equal(chatCompletionsEndpoint('https://example.test'), 'https://example.test/v1/chat/completions')
  assert.equal(chatCompletionsEndpoint('https://example.test/v1/'), 'https://example.test/v1/chat/completions')
  assert.equal(chatCompletionsEndpoint('https://example.test/v1/chat/completions'), 'https://example.test/v1/chat/completions')
})
