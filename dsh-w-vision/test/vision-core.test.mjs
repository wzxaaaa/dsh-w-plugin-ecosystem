import assert from 'node:assert/strict'
import test from 'node:test'

import {
  buildUploadVisionContent,
  chatCompletionsEndpoint,
  extractVisionText,
  normalizeUploadBatch,
} from '../vision-core.js'

const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).toString('base64')

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
