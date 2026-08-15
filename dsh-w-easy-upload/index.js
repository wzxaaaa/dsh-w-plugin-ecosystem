/**
 * dsh-w-easy-upload — transparent image admission for text-only models.
 *
 * The Host receives the original image bytes after dsh-w-vision has analyzed
 * them, persists a normal user message containing image + text, and lets the
 * conversation UI render that message normally. Immediately before the Agent
 * dispatches its model request, this plugin adds a model-only Surface
 * replacement containing the Vision result.
 */

import { Remote, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
import { createUserMessage, isAgentLoopRequest } from '@deepseek-ai/dsh-llm'
import {
  buildModelText,
  normalizeSubmitInput,
  replacePendingUploads,
} from './easy-upload-core.js'

var __runInitializers = function (thisArg, initializers, value) {
  var useValue = arguments.length > 2
  for (var i = 0; i < initializers.length; i++) {
    value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg)
  }
  return useValue ? value : void 0
}

var __esDecorate = function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) {
    if (f !== void 0 && typeof f !== 'function') throw new TypeError('Function expected')
    return f
  }
  var kind = contextIn.kind
  var key = kind === 'getter' ? 'get' : kind === 'setter' ? 'set' : 'value'
  var target = !descriptorIn && ctor
    ? contextIn.static ? ctor : ctor.prototype
    : null
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {})
  var _, done = false
  for (var i = decorators.length - 1; i >= 0; i--) {
    var context = {}
    for (var p in contextIn) context[p] = p === 'access' ? {} : contextIn[p]
    for (var p in contextIn.access) context.access[p] = contextIn.access[p]
    context.addInitializer = function (f) {
      if (done) throw new TypeError('Cannot add initializers after decoration has completed')
      extraInitializers.push(accept(f || null))
    }
    var result = decorators[i](
      kind === 'accessor' ? { get: descriptor.get, set: descriptor.set } : descriptor[key],
      context,
    )
    if (kind === 'accessor') {
      if (result === void 0) continue
      if (result === null || typeof result !== 'object') throw new TypeError('Object expected')
      if (_ = accept(result.get)) descriptor.get = _
      if (_ = accept(result.set)) descriptor.set = _
      if (_ = accept(result.init)) initializers.unshift(_)
    } else if (_ = accept(result)) {
      if (kind === 'field') initializers.unshift(_)
      else descriptor[key] = _
    }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor)
  done = true
}

const IANA_TIME_ZONE = /^[A-Za-z][A-Za-z0-9_+.-]*(?:\/[A-Za-z0-9_+.-]+)+$/

function canonicalClientTimeZone(value) {
  if (value === 'UTC') return value
  if (typeof value !== 'string' || value.length === 0 || value.trim() !== value || !IANA_TIME_ZONE.test(value)) {
    throw new Error('clientTimeZone must be UTC or a valid IANA Area/Location name')
  }
  try {
    const canonical = new Intl.DateTimeFormat('en-US', { timeZone: value }).resolvedOptions().timeZone
    if (canonical !== 'UTC' && !IANA_TIME_ZONE.test(canonical)) throw new Error('invalid time zone')
    return canonical
  } catch {
    throw new Error('clientTimeZone must be UTC or a valid IANA Area/Location name')
  }
}

function objectLike(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

let EasyUploadService = (() => {
  let _classSuper = TypertRemoteService
  let _instanceExtraInitializers = []
  let _submit_decorators
  return class EasyUploadService extends _classSuper {
    static {
      const _metadata = typeof Symbol === 'function' && Symbol.metadata
        ? Object.create(_classSuper[Symbol.metadata] ?? null)
        : void 0
      _submit_decorators = [Remote('submit')]
      __esDecorate(this, null, _submit_decorators, {
        kind: 'method',
        name: 'submit',
        static: false,
        private: false,
        access: { has: obj => 'submit' in obj, get: obj => obj.submit },
        metadata: _metadata,
      }, null, _instanceExtraInitializers)
      if (_metadata) {
        Object.defineProperty(this, Symbol.metadata, {
          enumerable: true,
          configurable: true,
          writable: true,
          value: _metadata,
        })
      }
    }

    static inject = ['attachments', 'llm', 'sessions', 'typert']

    constructor(ctx) {
      super(ctx, 'easyUpload')
      __runInitializers(this, _instanceExtraInitializers)
      this.forwardedRequests = new WeakSet()

      // A loop request is already frozen and cannot be edited in place. Instead
      // append a durable Surface replacement, derive again, and dispatch a new
      // unmarked request. The invariant validates the original request before
      // this listener; the nested request is intentionally auxiliary.
      ctx.on('llm/stream', (options, next) => {
        if (this.forwardedRequests.has(options) || !isAgentLoopRequest(options)) return next()
        if (!options || options.sessionId === undefined) return next()
        const session = ctx.sessions.get(options.sessionId)
        if (session === undefined) return next()

        const replaced = replacePendingUploads(session, createUserMessage)
        if (replaced.length === 0) return next()

        const forwarded = {
          ...options,
          messages: session.deriveMessages(),
        }
        this.forwardedRequests.add(forwarded)
        return ctx.llm.stream(forwarded)
      })
    }

    resolveAgent(sessionId) {
      const lookup = this.ctx.typert.lookups.get('agent')
      if (lookup === undefined) throw new Error('agent lookup is unavailable')
      return lookup.resolve(sessionId).then(agent => {
        if (agent === undefined) throw new Error(`session "${String(sessionId)}" is unavailable`)
        return agent
      })
    }

    /**
     * Admit one already Vision-analyzed browser upload as a normal user
     * message. The main model capability check is deliberately not performed:
     * it receives the later text-only Surface replacement.
     */
    async submit(input) {
      const normalized = normalizeSubmitInput(input, this.ctx.attachments.imageLimits)
      const agent = await this.resolveAgent(normalized.sessionId)

      for (const image of normalized.images) {
        await this.ctx.attachments.validateImage({
          data: image.data,
          mediaType: image.mediaType,
          ...(image.name === undefined ? {} : { name: image.name }),
        })
      }

      const durableImages = []
      for (const image of normalized.images) {
        durableImages.push(await this.ctx.attachments.saveImage({
          data: image.data,
          mediaType: image.mediaType,
          ...(image.name === undefined ? {} : { name: image.name }),
        }))
      }

      const content = durableImages.map(attachment => ({ type: 'image', attachment }))
      if (normalized.text !== '') content.push({ type: 'text', text: normalized.text })

      const source = {
        kind: 'user',
        dshWEasyUpload: {
          version: 1,
          text: normalized.text,
          visionText: normalized.visionText,
          imageCount: durableImages.length,
        },
        ...(normalized.clientTimeZone === undefined
          ? {}
          : { clientTimeZone: canonicalClientTimeZone(normalized.clientTimeZone) }),
      }
      const message = createUserMessage({ content, source })
      if (normalized.mode === 'steer') agent.steer(message)
      else agent.followup(message)
      return { accepted: true }
    }
  }
})()

export { EasyUploadService, EasyUploadService as default }
