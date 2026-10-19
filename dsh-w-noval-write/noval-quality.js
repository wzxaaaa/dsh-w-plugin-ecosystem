import { currentTurnNumber } from './noval-mutation-guard.js'

export const QUALITY_SCOPES = ['outline', 'detail', 'project', 'characters', 'relationships', 'world', 'plot', 'scene', 'threads', 'progression']
const filled = value => typeof value === 'string' && value.trim().length > 0
const narrativeKeys = new Set(['premise', 'styleGuide', 'constraints', 'summary', 'appearance', 'traits', 'contrast', 'background', 'goal', 'motivation', 'stakes', 'conflict', 'values', 'abilities', 'edge', 'weaknesses', 'secret', 'knowledge', 'voice', 'arc', 'fate', 'readerAppeal', 'history', 'dynamic', 'powerBalance', 'publicFace', 'privateTruth', 'sharedSecret', 'tension', 'turningPoints', 'futureDirection', 'rules', 'chronology', 'geography', 'environment', 'locations', 'factions', 'politics', 'society', 'culture', 'economy', 'beliefs', 'technology', 'conflicts', 'lore', 'themes', 'storyQuestion', 'coreConflict', 'protagonistGoal', 'antagonisticForce', 'opening', 'midpoint', 'climax', 'ending', 'subplots', 'foreshadowing', 'reveals', 'pacing', 'chapterPlan', 'outline', 'events', 'dialogueNotes', 'endingHook', 'beats', 'emotionalTurn', 'outcome', 'knowledgeChanges', 'propChanges', 'continuity', 'nextHook', 'setup', 'truth', 'payoffPlan', 'resolution', 'notes', 'note', 'customFields'])

/** Structural gaps are errors; language heuristics are review suggestions, never proof of truncation. */
export function auditNovel(project, { scope = 'detail', volumeId = '', chapterId = '' } = {}) {
  if (!QUALITY_SCOPES.includes(scope)) throw new Error(`unknown quality scope '${scope}'`)
  const issues = []
  const add = (path, code, message, severity = 'error') => issues.push({ path, code, message, severity })
  const requireFields = (record, path, fields) => {
    for (const field of fields) if (!filled(record?.[field])) add(`${path}.${field}`, 'missing', `缺少 ${field}，请写清具体内容。`)
  }
  const reviewText = (value, path, key = '', narrative = false) => {
    if (typeof value === 'string' && filled(value) && (narrative || narrativeKeys.has(key))) {
      const text = value.trim()
      if (/^(?:待补充|待完善|待写|略|同上|省略|TODO|TBD|\.\.\.|…+)$/iu.test(text)) add(path, 'placeholder', '仍是占位内容，尚未写完。')
      else if (/(?:[,，、:：;；]|因为|所以|但是|然而|从而|并且|以及|例如|包括|分别是|原因是|意味着|such as|because|therefore)\s*$/iu.test(text)) add(path, 'possible_cutoff', '末尾像未完成的句子；请核对因果、指代和后续内容。', 'warning')
      return
    }
    if (Array.isArray(value)) value.forEach((entry, i) => reviewText(entry, `${path}[${i}]`, key, narrative || narrativeKeys.has(key)))
    else if (value && typeof value === 'object') for (const [childKey, entry] of Object.entries(value)) reviewText(entry, `${path}.${childKey}`, childKey, narrative || key === 'customFields')
  }
  let chapters = 0
  if (scope === 'outline' || scope === 'detail') {
    const volumes = volumeId ? project.volumes.filter(v => v.id === volumeId) : project.volumes
    if (volumeId && !volumes.length) throw new Error(`unknown volume '${volumeId}'`)
    if (chapterId && !volumeId) throw new Error('chapterId requires volumeId')
    if (!volumes.length) add('volumes', 'missing', '还没有结构化卷章目录。')
    for (const volume of volumes) {
      const vp = `volumes[${volume.id}]`
      if (!chapterId) {
        requireFields(volume, vp, ['title', 'summary'])
        if (!volume.plannedChapterCount) add(`${vp}.plannedChapterCount`, 'unplanned', '尚未填写计划章数，无法证明末尾没有漏章。', 'warning')
        else if (volume.chapters.length !== volume.plannedChapterCount) add(`${vp}.chapters`, 'chapter_count', `计划 ${volume.plannedChapterCount} 章，实际 ${volume.chapters.length} 章。请按约定补齐或核对，不要降低计划数来通过检查。`)
        if (!volume.chapters.length) add(`${vp}.chapters`, 'missing', '本卷还没有章节。')
        const seen = new Set()
        let previous
        for (const chapter of volume.chapters) {
          const match = /^\s*(?:第\s*)?(\d+)\s*(?:章)?\s*$/u.exec(chapter.number || '')
          if (!match) continue
          const n = Number(match[1])
          if (seen.has(n)) add(`${vp}.chapters[${chapter.id}].number`, 'duplicate_number', `章号 ${n} 重复。`)
          if (previous !== undefined && n > previous + 1) add(`${vp}.chapters[${chapter.id}].number`, 'number_gap', `${previous} 章之后直接跳到 ${n} 章，请核对缺失章目。`)
          if (previous !== undefined && n < previous) add(`${vp}.chapters[${chapter.id}].number`, 'number_order', '章号倒序，请核对目录顺序。', 'warning')
          seen.add(n); previous = n
        }
      }
      const selected = chapterId ? volume.chapters.filter(c => c.id === chapterId) : volume.chapters
      if (chapterId && !selected.length) throw new Error(`unknown chapter '${chapterId}'`)
      chapters += selected.length
      for (const chapter of selected) {
        const cp = `${vp}.chapters[${chapter.id}]`
        requireFields(chapter, cp, ['title', 'summary'])
        if (scope === 'detail') {
          if (!chapter.events.some(filled)) add(`${cp}.events`, 'missing', '缺少事件推进：谁做了什么、为什么、结果是什么。')
          requireFields(chapter, cp, ['endingHook'])
          if (!chapter.scenes.length) add(`${cp}.scenes`, 'missing', '缺少可据以写正文的场景拆分。')
          for (const scene of chapter.scenes) requireFields(scene, `${cp}.scenes[${scene.id}]`, ['goal', 'conflict', 'beats', 'outcome'])
        }
        reviewText(chapter, cp)
      }
      reviewText({ summary: volume.summary, customFields: volume.customFields }, vp)
    }
  } else {
    const specs = {
      project: [project, ['title', 'premise', 'genre', 'pov']],
      world: [project.world, ['era', 'geography', 'rules']],
      plot: [project.plot, ['coreConflict', 'opening', 'climax', 'ending']],
      scene: [project.scene, ['goal', 'conflict', 'beats', 'outcome']],
      characters: [project.characters, ['name', 'identity', 'goal', 'motivation', 'conflict', 'arc']],
      relationships: [project.relationships, ['fromId', 'toId', 'label', 'dynamic']],
      threads: [project.threads, ['title', 'setup', 'payoffPlan']],
      progression: [project.progression.systems, ['name', 'notes']],
    }
    const [records, fields] = specs[scope]
    if (Array.isArray(records)) {
      if (!records.length) add(scope, 'missing', '本模块尚无条目；仅在本次任务要求这个模块时补充。')
      for (const record of records) { const path = `${scope}[${record.id}]`; requireFields(record, path, fields); reviewText(record, path) }
    } else {
      requireFields(records, scope, fields)
      reviewText(scope === 'project' ? Object.fromEntries(Object.entries(project).filter(([, v]) => typeof v === 'string')) : records, scope)
    }
  }
  const errors = issues.filter(i => i.severity === 'error').length
  return { scope, complete: errors === 0, errors, warnings: issues.length - errors, chapters, issues,
    limitation: '检查结构缺项、章数和可疑断句；不能替代作者对语义、文笔和剧情完整性的审阅。未指定计划章数时无法识别末尾未创建的章节。' }
}

/** Whole-array edits must not silently erase chapters omitted from a paginated read. */
export function assertOutlinePreserved(before, after) {
  const kept = new Set(after.volumes.flatMap(v => v.chapters.map(c => c.id)))
  const removed = before.volumes.flatMap(v => v.chapters.filter(c => !kept.has(c.id)).map(c => `${v.id}/${c.id}`))
  if (removed.length) {
    const error = new Error(`NOVEL_OUTLINE_REMOVAL: this replacement would delete ${removed.length} chapters: ${removed.join(', ')}. No data was written. Use novel_chapter_upsert for incremental work; allow_outline_removal is only for a user-requested deletion/restructure.`)
    error.code = 'NOVEL_OUTLINE_REMOVAL'
    throw error
  }
}

export class NovelQualityGuard {
  constructor() { this.rounds = new WeakMap() }
  require(agent, workspaceId, options) {
    const turn = currentTurnNumber(agent)
    if (turn === undefined) return
    let round = this.rounds.get(agent)
    if (!round || round.turn !== turn) round = { turn, retries: 0, checks: new Map() }
    round.checks.set(JSON.stringify([workspaceId, options]), { workspaceId, options })
    this.rounds.set(agent, round)
  }
  round(agent, turn) { const round = agent && this.rounds.get(agent); return round?.turn === turn ? round : null }
}
