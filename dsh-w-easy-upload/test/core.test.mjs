import assert from 'node:assert/strict'
import test from 'node:test'
import {
  buildModelText,
  normalizeSubmitInput,
  replacePendingUploads,
  uploadMetadata,
} from '../easy-upload-core.js'

const pngData = Buffer.from([0x89, 0x50, 0x4e, 0x47]).toString('base64')

test('normalizeSubmitInput validates image count, base64, and aggregate bytes', () => {
  const input = {
    sessionId: 'session-1',
    mode: 'queue',
    text: 'read this',
    visionText: 'OCR result',
    images: [{ mediaType: 'image/png', data: pngData }],
  }
  const normalized = normalizeSubmitInput(input, {
    maxImagesPerMessage: 2,
    maxImageBytes: 10,
    maxMessageImageBytes: 10,
  })
  assert.equal(normalized.sessionId, 'session-1')
  assert.equal(normalized.images.length, 1)
  assert.deepEqual([...normalized.images[0].data], [0x89, 0x50, 0x4e, 0x47])

  assert.throws(
    () => normalizeSubmitInput({ ...input, images: [{ ...input.images[0], data: 'not-base64' }] }),
    /canonical base64/,
  )
  assert.throws(
    () => normalizeSubmitInput({
      ...input,
      images: [input.images[0], input.images[0]],
    }, { maxImagesPerMessage: 1 }),
    /image-count limit/,
  )
  assert.throws(
    () => normalizeSubmitInput({
      ...input,
      images: [input.images[0], input.images[0]],
    }, { maxImagesPerMessage: 2, maxImageBytes: 10, maxMessageImageBytes: 5 }),
    /aggregate image-byte limit/,
  )
})

test('buildModelText contains the original request and Vision evidence', () => {
  const text = buildModelText('提取图中文字', '图片里写着：交给我。', 1)
  assert.match(text, /提取图中文字/)
  assert.match(text, /图片里写着：交给我/)
  assert.match(text, /dsh-w-vision/)
  assert.match(text, /不要解释内部转接流程/)
})

test('uploadMetadata only accepts marked user messages that still contain images', () => {
  const marker = {
    version: 1,
    text: 'what is this?',
    visionText: 'a cat',
    imageCount: 1,
  }
  const withImage = {
    role: 'user',
    content: [{ type: 'image', attachment: { id: 'a1' } }],
    source: { kind: 'user', dshWEasyUpload: marker },
  }
  assert.deepEqual(uploadMetadata(withImage), {
    text: 'what is this?',
    visionText: 'a cat',
    imageCount: 1,
  })
  assert.equal(uploadMetadata({
    ...withImage,
    content: [{ type: 'text', text: 'what is this?' }],
  }), undefined)
  assert.equal(uploadMetadata({
    ...withImage,
    source: { kind: 'user' },
  }), undefined)
})

test('replacePendingUploads appends one text-only replacement and preserves original data', () => {
  const original = {
    id: 'message-1',
    role: 'user',
    content: [
      { type: 'image', attachment: { id: 'a1' } },
      { type: 'text', text: 'what is shown?' },
    ],
    source: {
      kind: 'user',
      dshWEasyUpload: {
        version: 1,
        text: 'what is shown?',
        visionText: 'a red warning banner',
        imageCount: 1,
      },
    },
  }
  const session = {
    events: [{
      seq: 0,
      type: 'user/message',
      data: original,
    }],
    surface: { nodes: [0] },
    append(type, data, options) {
      assert.equal(type, 'user/message')
      assert.deepEqual(options, {
        surfaceOp: { op: 'replace', start: 0, end: 0 },
        sourceEventSeqs: [0],
      })
      assert.deepEqual(data.content.map(block => block.type), ['text'])
      assert.equal(data.source.kind, 'plugin')
      assert.equal(data.source.plugin, 'dsh-w-easy-upload')
      this.events.push({ seq: 1, type, data, ...options })
      this.surface.nodes = [1]
    },
  }
  let nextId = 1
  const replaced = replacePendingUploads(session, input => ({
    id: `replacement-${nextId++}`,
    role: 'user',
    ...input,
  }))

  assert.equal(replaced.length, 1)
  assert.equal(original.content.length, 2)
  assert.equal(original.content[0].type, 'image')
  assert.equal(session.events.length, 2)
  assert.match(session.events[1].data.content[0].text, /a red warning banner/)
  assert.equal(session.events[1].data.content.some(block => block.type === 'image'), false)
})
