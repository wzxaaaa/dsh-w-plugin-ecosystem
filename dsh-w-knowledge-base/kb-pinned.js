/**
 * dsh-w-knowledge-base — pinned notes (writing mode only).
 *
 * A style corpus can pin a few notes the model must read before it drafts or
 * searches: the book's style guide, a must-follow outline, a do/don't list.
 * Pins are an ordered id list stored next to the corpus (pinned.json), so they
 * travel with the corpus directory. In a writing-mode conversation the pinned
 * notes are injected in full, in pin order, within a character budget; any
 * that do not fit are listed by title with an instruction to kb_read them
 * before writing. Assistant mode never reads pins.
 *
 * Pure text and list helpers: no filesystem, no clock.
 */

/** File name of the per-corpus pin list. */
export const PINNED_FILE = 'pinned.json'
/** Pin list format version. */
export const PINNED_VERSION = 1
/** At most this many pinned notes per corpus. */
export const MAX_PINNED = 30
/** Default character budget for pinned note bodies in one prompt. */
export const DEFAULT_PINNED_CHARS = 12000
/** Runtime-context order: just before the style index (500), so it is read first. */
export const PINNED_CONTEXT_ORDER = 490

/** A clean, de-duplicated, bounded id list; anything malformed becomes empty. */
export function normalizePinned(value) {
  const source = value && typeof value === 'object' && Array.isArray(value.ids) ? value.ids : []
  const ids = []
  for (const entry of source) {
    if (typeof entry !== 'string') continue
    const id = entry.trim()
    if (id === '' || ids.includes(id)) continue
    ids.push(id)
    if (ids.length >= MAX_PINNED) break
  }
  return { version: PINNED_VERSION, ids }
}

/** Pin (appended last) or unpin one note id. */
export function setPinned(listValue, id, pinned) {
  const list = normalizePinned(listValue)
  const key = typeof id === 'string' ? id.trim() : ''
  if (key === '') throw new Error('note id must not be empty')
  const without = list.ids.filter(entry => entry !== key)
  if (!pinned) return { version: PINNED_VERSION, ids: without }
  if (list.ids.includes(key)) return list
  if (list.ids.length >= MAX_PINNED) throw new RangeError(`at most ${MAX_PINNED} pinned notes per corpus`)
  return { version: PINNED_VERSION, ids: [...without, key] }
}

/** Move one pinned id up (delta < 0) or down (delta > 0) in the reading order. */
export function movePinned(listValue, id, delta) {
  const list = normalizePinned(listValue)
  const key = typeof id === 'string' ? id.trim() : ''
  const from = list.ids.indexOf(key)
  if (from < 0) throw new Error(`note '${key}' is not pinned`)
  const to = Math.max(0, Math.min(list.ids.length - 1, from + Math.sign(Number(delta) || 0)))
  if (to === from) return list
  const ids = [...list.ids]
  const [moved] = ids.splice(from, 1)
  ids.splice(to, 0, moved)
  return { version: PINNED_VERSION, ids }
}

/**
 * Split the pinned notes into those injected in full and those only listed.
 * Order is the pin order; a note is injected only when its whole body fits
 * the remaining budget, so nothing is silently cut mid-sentence.
 * @param {Array<{ id: string, title: string, body: string }>} notes - pinned notes that exist, in pin order.
 * @param {number} budget - character budget for injected bodies.
 */
export function planPinned(notes, budget = DEFAULT_PINNED_CHARS) {
  const limit = Number.isFinite(budget) && budget >= 0 ? Math.floor(budget) : DEFAULT_PINNED_CHARS
  let remaining = limit
  const included = []
  const deferred = []
  for (const note of notes) {
    const length = String(note.body ?? '').length
    if (length <= remaining) {
      included.push(note)
      remaining -= length
    } else {
      deferred.push(note)
    }
  }
  return { included, deferred, used: limit - remaining, budget: limit }
}

/**
 * The writing-mode runtime context for pinned notes; empty when none exist.
 * @param {Array<{ id: string, title: string, body: string }>} notes - pinned notes that exist, in pin order.
 * @param {{ budget?: number, corpusName?: string }} [options]
 */
export function pinnedPromptText(notes, options = {}) {
  if (!Array.isArray(notes) || notes.length === 0) return ''
  const plan = planPinned(notes, options.budget)
  const named = options.corpusName ? '「' + options.corpusName + '」' : ''
  const lines = [
    '# 置顶笔记' + named + '（写作前必读）',
    '',
    '用户把下面这些笔记置顶了。动笔、检索素材之前先读完并遵守；它们和检索到的素材冲突时，以置顶笔记为准。不需要再用 kb_read 重复读取已经展开的置顶笔记。',
  ]
  plan.included.forEach((note, index) => {
    lines.push('', `## ${index + 1}. ${note.title || note.id}（${note.id}）`, '', String(note.body ?? '').trim())
  })
  if (plan.deferred.length > 0) {
    lines.push(
      '',
      '## 未展开的置顶笔记（篇幅超出预算）',
      '动笔前必须先用 kb_read 按顺序读完这些笔记：',
      ...plan.deferred.map(note => `- ${note.title || note.id}（${note.id}）`),
    )
  }
  return lines.join('\n')
}
