import { createUserMessage } from '@deepseek-ai/dsh-llm'
import { Remote, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
import {
  collectSessionHideKeys,
  locateRegenerationTarget,
  PLUGIN_ID,
  TRIGGER_PROMPT,
  TRIGGER_SUMMARY,
  triggerHideKey,
} from './refresh-core.js'

const PREPARE_TIMEOUT_MS = 60_000

function sameId(left, right) {
  return left !== undefined && right !== undefined && String(left) === String(right)
}

function errorMessage(error) {
  return error instanceof Error ? error.message : String(error)
}

function triggerMatches(message, record) {
  if (sameId(message?.id, record.triggerId)) return true
  return message?.source?.kind === 'plugin'
    && message.source.plugin === PLUGIN_ID
    && message.source.summary === TRIGGER_SUMMARY
}

const remoteInitializers = []

class AssistantRefreshService extends TypertRemoteService {
  static inject = ['agents']

  constructor(ctx) {
    super(ctx, 'assistantRefresh')
    for (const initialize of remoteInitializers) initialize.call(this)
    this.pending = new Map()
    this.ctx.effect(() => this.ctx.on('agent/pre-step', (payload, next) => this.onPreStep(payload, next)),
      'dsh-w-assistant-refresh: same-session regeneration')
  }

  settle(sessionId, record, error) {
    if (this.pending.get(sessionId) !== record) return
    this.pending.delete(sessionId)
    clearTimeout(record.timer)
    if (error === undefined) record.started.resolve()
    else record.started.reject(error)
  }

  async onPreStep(payload, next) {
    const sessionId = String(payload.agent.id)
    const record = this.pending.get(sessionId)
    if (record === undefined || !payload.messages.some(message => triggerMatches(message, record))) {
      return next()
    }
    try {
      const decision = await next()
      if (decision.kind !== 'enter' || !decision.messages.some(message => triggerMatches(message, record))) {
        throw new Error('the regeneration trigger was rejected by a pre-step hook')
      }
      const replay = createUserMessage({
        content: record.target.message.content,
        source: { kind: 'user' },
      })
      payload.agent.session.append('user/message', replay, {
        surfaceOp: {
          op: 'replace',
          start: record.target.startSeq,
          end: record.target.endSeq,
        },
        sourceEventSeqs: record.target.sourceEventSeqs,
      })
      this.settle(sessionId, record)
      return decision
    } catch (error) {
      this.settle(sessionId, record, error)
      throw error
    }
  }

  async regenerate(sessionId, assistantMessageId) {
    if (typeof sessionId !== 'string' || sessionId.length === 0) throw new Error('sessionId is required')
    if (typeof assistantMessageId !== 'string' || assistantMessageId.length === 0) {
      throw new Error('assistantMessageId is required')
    }
    const agent = this.ctx.agents.get(sessionId)
    if (agent === undefined) throw new Error(`session "${sessionId}" is not active`)
    if (agent.status !== 'idle') throw new Error('wait for the current request to finish')
    if (this.pending.has(sessionId)) throw new Error('a reply refresh is already pending')

    const target = locateRegenerationTarget(agent.session.events, agent.session.surface.nodes, assistantMessageId)
    if (!target.ok) throw new Error(`reply cannot be refreshed: ${target.reason}`)

    const trigger = createUserMessage({
      content: [{ type: 'text', text: TRIGGER_PROMPT }],
      source: {
        kind: 'plugin',
        plugin: PLUGIN_ID,
        form: 'notice',
        summary: TRIGGER_SUMMARY,
      },
    })
    const started = Promise.withResolvers()
    const record = {
      triggerId: trigger.id,
      target,
      started,
      timer: undefined,
    }
    record.timer = setTimeout(() => {
      this.settle(sessionId, record, new Error('timed out while preparing the same-session refresh'))
    }, PREPARE_TIMEOUT_MS)
    this.pending.set(sessionId, record)

    try {
      agent.followup(trigger)
    } catch (error) {
      this.settle(sessionId, record, error)
      throw error
    }
    try {
      await started.promise
    } catch (error) {
      throw new Error(`same-session refresh failed: ${errorMessage(error)}`)
    }
    // The replay replacement is already in the log; return every chat-row key
    // the client must hide. The trigger event itself is appended by the loop
    // right after pre-step, so its key is added explicitly.
    const hideKeys = [
      ...collectSessionHideKeys(agent.session.events),
      triggerHideKey(record.triggerId),
    ]
    return { accepted: true, hideKeys: [...new Set(hideKeys)] }
  }

  /** Chat-row keys this plugin hides in one session log (reload persistence). */
  async hiddenKeys(sessionId) {
    if (typeof sessionId !== 'string' || sessionId.length === 0) throw new Error('sessionId is required')
    const agent = this.ctx.agents.get(sessionId)
    if (agent === undefined) return { keys: [] }
    return { keys: collectSessionHideKeys(agent.session.events) }
  }
}

Remote('regenerate')(
  AssistantRefreshService.prototype.regenerate,
  {
    kind: 'method',
    name: 'regenerate',
    static: false,
    private: false,
    access: {
      has: object => 'regenerate' in object,
      get: object => object.regenerate,
    },
    addInitializer: initializer => { remoteInitializers.push(initializer) },
  },
)

Remote('hiddenKeys')(
  AssistantRefreshService.prototype.hiddenKeys,
  {
    kind: 'method',
    name: 'hiddenKeys',
    static: false,
    private: false,
    access: {
      has: object => 'hiddenKeys' in object,
      get: object => object.hiddenKeys,
    },
    addInitializer: initializer => { remoteInitializers.push(initializer) },
  },
)

export { AssistantRefreshService, AssistantRefreshService as default }
export const name = PLUGIN_ID
