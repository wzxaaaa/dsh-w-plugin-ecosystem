import { createServer } from 'node:http'
import { randomBytes, randomUUID } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { setTimeout as delay } from 'node:timers/promises'

const MAX_BODY_BYTES = 8_100_000

/** A loopback-only camera client for desktop shells that deny video permissions. */
export async function createBrowserCameraBridge(broker) {
  const token = randomBytes(32).toString('hex')
  const clientId = `browser-camera-${randomUUID()}`
  const script = await readFile(new URL('./browser-camera.js', import.meta.url))
  const html = await readFile(new URL('./browser-camera.html', import.meta.url))
  let origin
  let closed = false
  const server = createServer(async (request, response) => {
    response.setHeader('Cache-Control', 'no-store')
    response.setHeader('X-Content-Type-Options', 'nosniff')
    response.setHeader('Referrer-Policy', 'no-referrer')
    response.setHeader('Permissions-Policy', 'camera=(self), microphone=()')
    response.setHeader('Content-Security-Policy', "default-src 'none'; script-src 'self'; style-src 'unsafe-inline'; connect-src 'self'; media-src 'self' blob:; frame-ancestors 'none'; base-uri 'none'; form-action 'none'")
    const reply = (status, value) => {
      response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' })
      response.end(JSON.stringify(value))
    }
    try {
      if (request.headers.host !== new URL(origin).host || (request.headers.origin && request.headers.origin !== origin)) return reply(403, { error: 'Forbidden origin' })
      if (request.method === 'GET' && (request.url === '/' || request.url === '/camera.js')) {
        response.writeHead(200, { 'Content-Type': request.url === '/' ? 'text/html; charset=utf-8' : 'text/javascript; charset=utf-8' })
        response.end(request.url === '/' ? html : script)
        return
      }
      if (request.headers.authorization !== `Bearer ${token}`) return reply(401, { error: 'Unauthorized' })
      if (request.method !== 'POST' || !['/api/poll', '/api/submit', '/api/fail', '/api/disconnect'].includes(request.url)) return reply(404, { error: 'Not found' })
      if (!String(request.headers['content-type'] || '').startsWith('application/json')) return reply(415, { error: 'Expected JSON' })
      let size = 0
      const chunks = []
      for await (const chunk of request) {
        size += chunk.length
        if (size > MAX_BODY_BYTES) { reply(413, { error: 'Capture is too large' }); return }
        chunks.push(chunk)
      }
      const value = JSON.parse(Buffer.concat(chunks).toString('utf8'))
      if (!value || typeof value !== 'object' || Array.isArray(value)) return reply(400, { error: 'Expected an object' })
      // Browser input cannot impersonate another Harness client.
      const input = { ...value, clientId }
      if (request.url === '/api/disconnect') { disconnect(); return reply(200, { accepted: true }) }
      const method = request.url.slice('/api/'.length)
      // Pace polling on the Host so background browser timer throttling cannot
      // expire the camera heartbeat while the user returns to Harness.
      if (method === 'poll') await delay(650)
      if (closed) return reply(410, { error: 'Camera bridge closed' })
      reply(200, broker[method](input))
    } catch (error) {
      if (!response.headersSent) reply(400, { error: error.message || String(error) })
      else response.end()
    }
  })
  function disconnect() {
    for (const pending of broker.pending.values()) {
      if (pending.claimedBy === clientId) broker.fail({ clientId, requestId: pending.id, message: '本机浏览器摄像头已断开。' })
    }
    broker.clients.delete(clientId)
  }
  server.requestTimeout = 10_000
  server.headersTimeout = 10_000
  await new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', resolve)
  })
  origin = `http://127.0.0.1:${server.address().port}`
  server.unref()
  return {
    url: `${origin}/#${token}`,
    close() {
      if (closed) return
      closed = true
      disconnect()
      server.close()
      server.closeAllConnections()
    },
  }
}
