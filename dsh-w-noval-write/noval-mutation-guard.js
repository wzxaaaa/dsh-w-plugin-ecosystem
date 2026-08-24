const EXCLUSIVE_MUTATIONS = new Set(['novel_write', 'novel_advance'])

export function currentTurnNumber(agent) {
  const events = agent?.session?.events
  if (!events || typeof events[Symbol.iterator] !== 'function') return undefined
  let turn
  for (const event of events) {
    if (event?.type === 'turn/start' && Number.isSafeInteger(event?.data?.turn)) turn = event.data.turn
  }
  return turn
}

/**
 * Prevents destructive novel tools from undoing each other inside one model
 * turn. The WeakMap keeps the guard scoped to the live calling Agent; a new
 * Harness turn automatically receives a fresh operation set.
 */
export class NovelMutationRoundGuard {
  constructor() {
    this.rounds = new WeakMap()
  }

  record(agent, operation) {
    if (!agent || typeof agent !== 'object' || !EXCLUSIVE_MUTATIONS.has(operation)) return
    const turn = currentTurnNumber(agent)
    if (turn === undefined) return
    const current = this.rounds.get(agent)
    const operations = current?.turn === turn ? current.operations : new Set()
    operations.add(operation)
    this.rounds.set(agent, { turn, operations })
  }

  check(agent, operation) {
    if (!agent || typeof agent !== 'object' || !EXCLUSIVE_MUTATIONS.has(operation)) return { allowed: true }
    const turn = currentTurnNumber(agent)
    if (turn === undefined) return { allowed: true }
    const current = this.rounds.get(agent)
    if (!current || current.turn !== turn || current.operations.size === 0) return { allowed: true }
    const previousOperation = [...current.operations][0]
    return {
      allowed: false,
      turn,
      previousOperation,
      reason: `${previousOperation} already changed this project in the current model turn; ${operation} was blocked to prevent a write/advance retry loop.`,
    }
  }
}
