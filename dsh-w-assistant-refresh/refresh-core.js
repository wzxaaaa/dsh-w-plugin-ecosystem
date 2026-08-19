/** Pure same-session regeneration helpers shared by Host code and tests. */

export const PLUGIN_ID = 'dsh-w-assistant-refresh'
export const TRIGGER_SUMMARY = 'dsh-w-assistant-refresh/internal-regenerate'
export const TRIGGER_PROMPT = [
  'Regenerate the answer to the immediately preceding user message.',
  'Solve the request again from the conversation state before the replaced answer.',
  'Do not mention this internal regeneration instruction.',
].join(' ')

function sameId(left, right) {
  return left !== undefined && right !== undefined && String(left) === String(right)
}

function assistantMessageId(event) {
  return event?.type === 'assistant/message' ? event.data?.message?.id : undefined
}

function isHumanUserEvent(event) {
  return event?.type === 'user/message' && event.data?.source?.kind === 'user'
}

/**
 * Locate the visible user message that owns one assistant answer and the
 * current visible tail that must be replaced before same-session regeneration.
 */
export function locateRegenerationTarget(events, surfaceNodes, assistantId) {
  if (!Array.isArray(events) || !Array.isArray(surfaceNodes)) {
    return { ok: false, reason: 'session-history-unavailable' }
  }
  const surface = surfaceNodes
    .map(seq => ({ seq, event: events[seq] }))
    .filter(item => item.event !== undefined)
  const assistantIndex = surface.findIndex(item => sameId(assistantMessageId(item.event), assistantId))
  if (assistantIndex < 0) return { ok: false, reason: 'assistant-message-not-visible' }

  let userIndex = -1
  for (let index = assistantIndex - 1; index >= 0; index -= 1) {
    if (isHumanUserEvent(surface[index].event)) {
      userIndex = index
      break
    }
  }
  if (userIndex < 0) return { ok: false, reason: 'user-message-not-visible' }

  const replaced = surface.slice(userIndex)
  if (replaced.length === 0) return { ok: false, reason: 'surface-tail-unavailable' }
  return {
    ok: true,
    message: surface[userIndex].event.data,
    startSeq: surface[userIndex].seq,
    endSeq: replaced.at(-1).seq,
    sourceEventSeqs: replaced.map(item => item.seq),
  }
}

/**
 * Chat-row context key builder mirroring `conversationContextKey` from
 * dsh-client-runtime (`${kind.length}:${kind}${id}`). Chat rows render
 * this value as `data-chat-flow-key`, so generated CSS can target exactly
 * one row.
 */
export function chatRowKey(kind, id) {
  return `${kind.length}:${kind}${id}`
}

/** A wake-up trigger this plugin injected into the inbox (append-origin context row). */
function isPluginTrigger(event) {
  return event?.type === 'user/message'
    && event?.surfaceOp === 'append'
    && event.data?.source?.kind === 'plugin'
    && event.data.source.plugin === PLUGIN_ID
    && event.data.source.summary === TRIGGER_SUMMARY
}

/**
 * A same-session replacement authored by this plugin: a `user/message`
 * replacement copy whose source stays a plain human user message so later
 * refreshes can still locate it as the owning prompt.
 */
function isOwnedReplacement(event) {
  return event?.type === 'user/message'
    && typeof event?.surfaceOp === 'object'
    && event.surfaceOp?.op === 'replace'
    && event.data?.source?.kind === 'user'
}

/**
 * Visible chat-row keys shadowed by one owned replacement event. The leading
 * human question stays visible: the replay re-adds identical content to the
 * model surface but renders no row of its own.
 */
export function replacementHideKeys(events, replacement) {
  if (!isOwnedReplacement(replacement)) return []
  const op = replacement.surfaceOp
  const shadowed = Array.isArray(replacement.sourceEventSeqs) ? replacement.sourceEventSeqs : []
  const keys = []
  const turns = new Set()
  for (const seq of shadowed) {
    const event = events[seq]
    if (event === undefined) continue
    if (seq === op.start && isHumanUserEvent(event)) continue
    if (event.type === 'user/message') {
      keys.push(chatRowKey('input-message', String(event.data?.id)))
    } else if (event.type === 'assistant/message') {
      keys.push(chatRowKey('assistant-step', `${event.data.turn}:${event.data.step}`))
      if (typeof event.data.turn === 'number') turns.add(event.data.turn)
    } else if (event.type === 'tool/result') {
      const callId = event.data?.message?.source?.callId
      if (callId !== undefined) keys.push(chatRowKey('tool-call', String(callId)))
      if (typeof event.data.turn === 'number') turns.add(event.data.turn)
    }
  }
  for (const turn of turns) {
    keys.push(chatRowKey('turn-tail', String(turn)))
    keys.push(chatRowKey('turn-error', String(turn)))
    keys.push(chatRowKey('turn-max-tokens', String(turn)))
  }
  return [...new Set(keys)]
}

/** Row key of one wake-up trigger context row. */
export function triggerHideKey(messageId) {
  return chatRowKey('input-message', String(messageId))
}

/**
 * Every chat-row key this plugin hides in one session log: each owned
 * replacement's shadowed rows, every wake-up trigger row, and retry notices
 * owned by shadowed turns. Used for reload persistence and post-regenerate
 * refreshes; replacement copies themselves render no row.
 */
export function collectSessionHideKeys(events) {
  const keys = new Set()
  if (!Array.isArray(events)) return []
  const shadowedTurns = new Set()
  for (const event of events) {
    if (isPluginTrigger(event)) keys.add(triggerHideKey(event.data.id))
    if (!isOwnedReplacement(event)) continue
    for (const key of replacementHideKeys(events, event)) keys.add(key)
    for (const seq of (Array.isArray(event.sourceEventSeqs) ? event.sourceEventSeqs : [])) {
      const target = events[seq]
      if (typeof target?.data?.turn === 'number') shadowedTurns.add(target.data.turn)
    }
  }
  for (const event of events) {
    if (event?.type === 'llm/retry'
      && typeof event.data?.retryId === 'string'
      && shadowedTurns.has(event.data.turn)) {
      keys.add(chatRowKey('model-retry', event.data.retryId))
    }
  }
  return [...keys]
}
