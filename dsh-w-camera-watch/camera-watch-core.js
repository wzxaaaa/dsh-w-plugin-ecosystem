import { randomUUID } from 'node:crypto'

export const DEFAULT_CAPTURE_TIMEOUT_MS = 25_000
export const DEFAULT_CLIENT_TTL_MS = 5_000
export const MAX_CAPTURE_BASE64_CHARS = 8_000_000

const CANONICAL_BASE64 = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/

function requiredString(value, name, max = 500) {
  if (typeof value !== 'string' || value.trim().length === 0) throw new Error(`${name} must be a non-empty string`)
  const text = value.trim()
  if (text.length > max) throw new Error(`${name} is too long`)
  return text
}

function optionalString(value, name, max = 500) {
  if (value === undefined || value === null) return ''
  if (typeof value !== 'string') throw new Error(`${name} must be a string`)
  const text = value.trim()
  if (text.length > max) throw new Error(`${name} is too long`)
  return text
}

function positiveInteger(value, name, max) {
  if (!Number.isInteger(value) || value < 1 || value > max) throw new Error(`${name} must be an integer between 1 and ${max}`)
  return value
}

export function normalizePollInput(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('poll input must be an object')
  return {
    clientId: requiredString(input.clientId, 'clientId', 200),
    ready: input.ready === true,
    deviceLabel: optionalString(input.deviceLabel, 'deviceLabel', 300),
    error: optionalString(input.error, 'error', 1000),
  }
}

export function normalizeCapturePayload(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('capture payload must be an object')
  const data = requiredString(input.data, 'data', MAX_CAPTURE_BASE64_CHARS)
  if (!CANONICAL_BASE64.test(data)) throw new Error('data must be canonical base64')
  return {
    data,
    mediaType: input.mediaType === 'image/png' ? 'image/png' : 'image/jpeg',
    width: positiveInteger(input.width, 'width', 16_384),
    height: positiveInteger(input.height, 'height', 16_384),
    capturedAt: optionalString(input.capturedAt, 'capturedAt', 100) || new Date().toISOString(),
    deviceLabel: optionalString(input.deviceLabel, 'deviceLabel', 300),
  }
}

export function decodedBase64Bytes(data) {
  return Buffer.from(data, 'base64')
}

/** Coordinates explicit Host capture requests with one or more live browser clients. */
export class CaptureBroker {
  constructor(options = {}) {
    this.timeoutMs = options.timeoutMs ?? DEFAULT_CAPTURE_TIMEOUT_MS
    this.clientTtlMs = options.clientTtlMs ?? DEFAULT_CLIENT_TTL_MS
    this.now = options.now ?? Date.now
    this.setTimer = options.setTimer ?? setTimeout
    this.clearTimer = options.clearTimer ?? clearTimeout
    this.clients = new Map()
    this.pending = new Map()
    this.disposed = false
  }

  pruneClients() {
    const threshold = this.now() - this.clientTtlMs
    for (const [id, client] of this.clients) {
      if (client.seenAt < threshold) this.clients.delete(id)
    }
  }

  hasReadyClient() {
    this.pruneClients()
    for (const client of this.clients.values()) if (client.ready) return true
    return false
  }

  state() {
    this.pruneClients()
    const ready = Array.from(this.clients.values()).filter(client => client.ready)
    const newest = ready.slice().sort((left, right) => right.seenAt - left.seenAt)[0]
    return {
      connectedClients: this.clients.size,
      readyClients: ready.length,
      pendingCaptures: this.pending.size,
      cameraReady: ready.length > 0,
      deviceLabel: newest?.deviceLabel ?? '',
      clientError: newest?.error ?? '',
    }
  }

  poll(rawInput) {
    if (this.disposed) throw new Error('camera broker is disposed')
    const input = normalizePollInput(rawInput)
    this.clients.set(input.clientId, { ...input, seenAt: this.now() })
    if (!input.ready) return { request: null, state: this.state() }
    for (const request of this.pending.values()) {
      if (request.claimedBy !== undefined && request.claimedBy !== input.clientId) continue
      request.claimedBy = input.clientId
      return {
        request: { id: request.id, question: request.question },
        state: this.state(),
      }
    }
    return { request: null, state: this.state() }
  }

  request(question = '', signal) {
    if (this.disposed) return Promise.reject(new Error('camera broker is disposed'))
    if (!this.hasReadyClient()) {
      return Promise.reject(new Error('没有可用的摄像头页面。请保持 DSH 网页打开，并在“设置 → 摄像头监督”中启动摄像头。'))
    }
    const id = randomUUID()
    return new Promise((resolve, reject) => {
      const settle = (callback, value) => {
        const pending = this.pending.get(id)
        if (!pending) return
        this.pending.delete(id)
        this.clearTimer(pending.timer)
        if (pending.signal && pending.abort) pending.signal.removeEventListener('abort', pending.abort)
        callback(value)
      }
      const timer = this.setTimer(() => {
        settle(reject, new Error('摄像头截图超时；请确认 DSH 页面仍在运行且摄像头没有被其他程序占用。'))
      }, this.timeoutMs)
      const abort = signal
        ? () => settle(reject, signal.reason instanceof Error ? signal.reason : new Error('camera capture aborted'))
        : undefined
      this.pending.set(id, { id, question: optionalString(question, 'question', 2000), resolve, reject, timer, abort, signal, claimedBy: undefined })
      if (signal) {
        if (signal.aborted) abort()
        else signal.addEventListener('abort', abort, { once: true })
      }
    })
  }

  submit(rawInput) {
    if (!rawInput || typeof rawInput !== 'object' || Array.isArray(rawInput)) throw new Error('submit input must be an object')
    const clientId = requiredString(rawInput.clientId, 'clientId', 200)
    const requestId = requiredString(rawInput.requestId, 'requestId', 200)
    const pending = this.pending.get(requestId)
    if (!pending || pending.claimedBy !== clientId) return { accepted: false }
    const payload = normalizeCapturePayload(rawInput.payload)
    this.pending.delete(requestId)
    this.clearTimer(pending.timer)
    if (pending.signal && pending.abort) pending.signal.removeEventListener('abort', pending.abort)
    pending.resolve(payload)
    return { accepted: true }
  }

  fail(rawInput) {
    if (!rawInput || typeof rawInput !== 'object' || Array.isArray(rawInput)) throw new Error('failure input must be an object')
    const clientId = requiredString(rawInput.clientId, 'clientId', 200)
    const requestId = requiredString(rawInput.requestId, 'requestId', 200)
    const pending = this.pending.get(requestId)
    if (!pending || pending.claimedBy !== clientId) return { accepted: false }
    const message = optionalString(rawInput.message, 'message', 1000) || '浏览器摄像头截图失败。'
    this.pending.delete(requestId)
    this.clearTimer(pending.timer)
    if (pending.signal && pending.abort) pending.signal.removeEventListener('abort', pending.abort)
    pending.reject(new Error(message))
    return { accepted: true }
  }

  dispose() {
    if (this.disposed) return
    this.disposed = true
    for (const pending of this.pending.values()) {
      this.clearTimer(pending.timer)
      if (pending.signal && pending.abort) pending.signal.removeEventListener('abort', pending.abort)
      pending.reject(new Error('camera broker was disposed'))
    }
    this.pending.clear()
    this.clients.clear()
  }
}
