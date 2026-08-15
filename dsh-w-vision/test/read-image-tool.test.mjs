import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import test from 'node:test'

import { createReadImageTool } from '../read-image-tool.js'

const pngBytes = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])

async function mockVisionServer() {
  let received
  const server = createServer((request, response) => {
    const chunks = []
    request.on('data', chunk => chunks.push(chunk))
    request.on('end', () => {
      received = JSON.parse(Buffer.concat(chunks).toString('utf8'))
      response.writeHead(200, { 'Content-Type': 'application/json' })
      response.end(JSON.stringify({ choices: [{ message: { content: 'The page shows a loading veil.' } }] }))
    })
  })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  return {
    base: `http://127.0.0.1:${server.address().port}`,
    received: () => received,
    close: () => new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve())),
  }
}

test('read_image resolves through ctx.fs, calls the relay, and returns text analysis', async () => {
  const relay = await mockVisionServer()
  const observed = []
  const resolutions = []
  const target = { targetKey: 'target', displayPath: 'C:\\workspace\\shot.png' }
  const service = {
    ctx: {
      fs: {
        async resolve(filePath, options) {
          resolutions.push({ filePath, options })
          return target
        },
        async stat() {
          return { version: 'v1', type: 'file', size: pngBytes.length }
        },
        async readBytes(_target, _signal, maxBytes) {
          assert.equal(maxBytes, 5 * 1024 * 1024)
          return pngBytes
        },
      },
      emit(name, resolvedTarget, observation, exec) {
        observed.push({ name, resolvedTarget, observation, exec })
      },
    },
    async readConfig() {
      return { base: relay.base, apikey: 'test-key', modelname: 'vision-test' }
    },
  }
  const tool = createReadImageTool(service)
  const signal = new AbortController().signal
  const exec = {
    signal,
    agent: { session: { header: { cwd: 'C:\\workspace' } } },
  }

  try {
    const value = await tool.execute({ file_path: 'shot.png', question: 'Is it loaded?' }, exec)
    assert.deepEqual(value, {
      path: 'C:\\workspace\\shot.png',
      analysis: 'The page shows a loading veil.',
      mediaType: 'image/png',
      bytes: pngBytes.length,
      model: 'vision-test',
    })
    assert.equal(resolutions.length, 1)
    assert.equal(resolutions[0].filePath, 'shot.png')
    assert.equal(resolutions[0].options.cwd, 'C:\\workspace')
    assert.equal(resolutions[0].options.signal, signal)
    assert.equal(observed.length, 1)
    assert.equal(observed[0].name, 'fs/observed')
    assert.deepEqual(observed[0].observation, { kind: 'present', version: 'v1' })

    const request = relay.received()
    assert.equal(request.model, 'vision-test')
    assert.equal(request.messages[0].content[0].type, 'text')
    assert.match(request.messages[0].content[0].text, /Is it loaded/)
    assert.match(request.messages[0].content[1].image_url.url, /^data:image\/png;base64,/)
    assert.equal(tool.output.render({}, value)[0].text, value.analysis)
  } finally {
    await relay.close()
  }
})

test('read_image rejects unsupported paths before filesystem I/O', async () => {
  let resolved = false
  const tool = createReadImageTool({
    ctx: {
      fs: { resolve: async () => { resolved = true } },
      emit() {},
    },
    readConfig: async () => ({}),
  })
  await assert.rejects(tool.execute({ file_path: 'diagram.svg' }, {}), /only accepts/)
  assert.equal(resolved, false)
})

test('read_image reports missing and oversized files without calling the relay', async () => {
  let configReads = 0
  const target = { targetKey: 'target', displayPath: 'C:\\workspace\\shot.png' }
  const observations = []
  const service = {
    ctx: {
      fs: {
        resolve: async () => target,
        stat: async () => undefined,
      },
      emit: (...args) => observations.push(args),
    },
    readConfig: async () => { configReads += 1; return {} },
  }
  const tool = createReadImageTool(service)
  await assert.rejects(tool.execute({ file_path: 'shot.png' }, {}), /not found/)
  assert.equal(observations[0][0], 'fs/observed')
  assert.deepEqual(observations[0][2], { kind: 'absent' })
  assert.equal(configReads, 0)

  service.ctx.fs.stat = async () => ({ version: 'v1', type: 'file', size: 5 * 1024 * 1024 + 1 })
  await assert.rejects(tool.execute({ file_path: 'shot.png' }, {}), /5 MB/)
  assert.equal(configReads, 0)
})
