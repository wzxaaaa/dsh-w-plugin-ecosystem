/** Pure target selection helpers shared by the plugin tests and client design. */

export const PLUGIN_ID = 'dsh-w-assistant-refresh'

function sameId(left, right) {
  return left !== undefined && right !== undefined && String(left) === String(right)
}

function nodeMessageId(node) {
  if (node?.kind === 'assistant') return node.messageId
  if (node?.kind === 'turn-tail') return node.data?.closing?.finalNode?.messageId
  return undefined
}

function nodeSeq(node) {
  if (typeof node?.seq === 'number') return node.seq
  if (typeof node?.data?.seq === 'number') return node.data.seq
  return undefined
}

function nodeTurn(node) {
  if (typeof node?.turn === 'number') return node.turn
  if (typeof node?.data?.turn === 'number') return node.data.turn
  return undefined
}

/**
 * Locate the original human prompt and the completed-turn cut needed to
 * replay one finalized assistant answer in a fresh branch.
 */
export function findRefreshTarget(snapshot, messageId) {
  const nodes = Array.isArray(snapshot?.nodes) ? snapshot.nodes : []
  const assistant = nodes.find(node => sameId(nodeMessageId(node), messageId))
  if (assistant === undefined) return { ok: false, reason: 'message-not-visible' }
  const assistantSeq = nodeSeq(assistant)
  const turn = nodeTurn(assistant)
  if (assistantSeq === undefined || turn === undefined) {
    return { ok: false, reason: 'assistant-location-missing' }
  }
  const user = nodes
    .filter(node => (node?.kind === 'user' || node?.kind === 'steering') && nodeSeq(node) < assistantSeq)
    .sort((left, right) => nodeSeq(left) - nodeSeq(right))
    .at(-1)
  if (user === undefined || !Array.isArray(user.content)) {
    return { ok: false, reason: 'prompt-not-visible' }
  }
  let cutSeq
  if (snapshot?.turnEnds !== undefined && typeof snapshot.turnEnds[Symbol.iterator] === 'function') {
    for (const [candidateTurn, candidateSeq] of snapshot.turnEnds) {
      if (typeof candidateTurn !== 'number' || candidateTurn >= turn || typeof candidateSeq !== 'number') continue
      if (cutSeq === undefined || candidateSeq > cutSeq) cutSeq = candidateSeq
    }
  }
  return {
    ok: true,
    assistantSeq,
    turn,
    userSeq: nodeSeq(user),
    content: user.content,
    ...(cutSeq === undefined ? {} : { cutSeq }),
  }
}

export function textBlocks(content) {
  return (Array.isArray(content) ? content : [])
    .filter(block => block?.type === 'text' && typeof block.text === 'string')
    .map(block => block.text)
}
