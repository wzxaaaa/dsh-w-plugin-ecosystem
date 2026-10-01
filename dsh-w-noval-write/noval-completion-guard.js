import { currentTurnNumber } from './noval-mutation-guard.js'

/** Keep a rejected chapter pending until counted prose passes, within this turn. */
export class NovelCompletionGuard {
  constructor() { this.rounds = new WeakMap() }

  fail(agent, workspaceId, args, requirement) {
    const turn = currentTurnNumber(agent)
    if (turn === undefined || !requirement || requirement.ok !== false) return
    let round = this.rounds.get(agent)
    if (!round || round.turn !== turn) round = { turn, retries: 0, pending: new Map() }
    const key = `${workspaceId}:${args.chapter_id}`
    round.pending.set(key, { workspaceId, chapterId: args.chapter_id, volumeId: args.volume_id, filename: args.filename, requirement })
    this.rounds.set(agent, round)
  }

  pass(agent, workspaceId, chapterId) {
    const round = agent && this.rounds.get(agent)
    if (round && round.turn === currentTurnNumber(agent)) round.pending.delete(`${workspaceId}:${chapterId}`)
  }

  round(agent, turn) {
    const round = agent && this.rounds.get(agent)
    return round?.turn === turn ? round : null
  }
}
