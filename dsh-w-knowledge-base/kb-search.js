/**
 * dsh-w-knowledge-base — retrieval scoring.
 *
 * A personal knowledge base is small (hundreds of notes), so search runs over
 * the store's in-memory snapshot instead of an index that could drift from the
 * files. Everything here is pure and deterministic: same notes, same query,
 * same clock in, same ranking out.
 *
 * Tokenization handles both halves of how these notes are actually written:
 * ASCII word runs, and CJK runs split into single characters plus bigrams
 * (Chinese has no spaces, and bigrams are what make "插件打包" match a note
 * body that says "插件打包踩坑").
 */

import { compareText, firstLine } from './kb-format.js'

/** Scoring weights, all named so ranking stays explainable and tunable. */
export const WEIGHTS = Object.freeze({
  /** Per title occurrence. */
  title: 9,
  /** Title occurrences counted per token. */
  titleCap: 3,
  /** Per matching tag. */
  tag: 7,
  /** Per body occurrence. */
  body: 1,
  /** Body occurrences counted per token. */
  bodyCap: 6,
  /** Multiplied by the fraction of query tokens found anywhere in the note. */
  coverage: 8,
  /** Bonus when every query token is present. */
  allTokens: 5,
  /** Bonus when the raw query appears verbatim in the title. */
  phraseTitle: 14,
  /** Bonus when the raw query appears verbatim in the body. */
  phraseBody: 7,
  /** Multiplied by the recency decay factor. */
  recency: 3,
  /** Half-life in days of the recency decay. */
  recencyHalfLifeDays: 21,
})

/** Default characters returned around the best match. */
export const DEFAULT_SNIPPET_CHARS = 240
/** Characters of lead-in kept before the matched term inside a snippet. */
export const SNIPPET_LEAD_CHARS = 60
/** Upper bound on tokens taken from one query. */
export const MAX_QUERY_TOKENS = 24

const TOKEN_RE = /[a-z0-9]+|[\u3400-\u4dbf\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]+/g
const CJK_RE = /^[\u3400-\u4dbf\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]+$/
const WHITESPACE_RE = /\s+/g
const MS_PER_DAY = 86400000

/**
 * Split text into comparable lowercase tokens.
 * @param {unknown} text - arbitrary text.
 * @returns {string[]} tokens in first-appearance order, de-duplicated.
 */
export function tokenize(text) {
  const lowered = String(text ?? '').toLowerCase()
  const seen = new Set()
  const tokens = []
  const push = (token) => {
    if (token === '' || seen.has(token)) return
    seen.add(token)
    tokens.push(token)
  }
  const matches = lowered.match(TOKEN_RE)
  if (matches === null) return tokens
  for (const run of matches) {
    if (!CJK_RE.test(run)) {
      push(run)
      continue
    }
    if (run.length === 1) {
      push(run)
      continue
    }
    for (let index = 0; index + 1 < run.length; index += 1) push(run.slice(index, index + 2))
  }
  return tokens
}

/**
 * Tokens of one query, bounded so a pathological query cannot dominate cost.
 * @param {unknown} query - the raw query text.
 * @returns {string[]} bounded query tokens.
 */
export function queryTokens(query) {
  return tokenize(query).slice(0, MAX_QUERY_TOKENS)
}

/**
 * Count non-overlapping occurrences of a needle.
 * @param {string} haystack - lowercase text to scan.
 * @param {string} needle - lowercase term.
 * @returns {number} the occurrence count.
 */
export function countOccurrences(haystack, needle) {
  if (needle === '') return 0
  let count = 0
  let from = 0
  for (;;) {
    const at = haystack.indexOf(needle, from)
    if (at === -1) return count
    count += 1
    from = at + needle.length
  }
}

/**
 * Recency decay in [0, 1]: 1 for a note updated now, 0.5 after one half-life.
 * @param {number} updatedMs - note update instant.
 * @param {number} nowMs - reference instant.
 * @returns {number} the decay factor.
 */
export function recencyFactor(updatedMs, nowMs) {
  if (!Number.isFinite(updatedMs) || updatedMs <= 0) return 0
  const ageDays = Math.max(0, (nowMs - updatedMs) / MS_PER_DAY)
  return Math.pow(0.5, ageDays / WEIGHTS.recencyHalfLifeDays)
}

/**
 * Score one note against a query.
 * @param {{ title: string, tags: string[], body: string, updatedMs: number }} note - the candidate note.
 * @param {{ tokens: string[], phrase: string, nowMs: number }} query - the compiled query.
 * @returns {{ score: number, matchedTokens: number, firstMatchIndex: number }} the scoring outcome.
 */
export function scoreNote(note, query) {
  const titleLower = String(note.title ?? '').toLowerCase()
  const bodyLower = String(note.body ?? '').toLowerCase()
  const tagsLower = (note.tags ?? []).map((tag) => String(tag).toLowerCase())
  const tokens = query.tokens
  let score = 0
  let matchedTokens = 0
  let firstMatchIndex = -1
  for (const token of tokens) {
    const inTitle = Math.min(countOccurrences(titleLower, token), WEIGHTS.titleCap)
    const inBody = Math.min(countOccurrences(bodyLower, token), WEIGHTS.bodyCap)
    const inTags = tagsLower.filter((tag) => tag.includes(token)).length
    if (inTitle === 0 && inBody === 0 && inTags === 0) continue
    matchedTokens += 1
    score += inTitle * WEIGHTS.title + inBody * WEIGHTS.body + inTags * WEIGHTS.tag
    const at = bodyLower.indexOf(token)
    if (at !== -1 && (firstMatchIndex === -1 || at < firstMatchIndex)) firstMatchIndex = at
  }
  if (tokens.length > 0) {
    score += WEIGHTS.coverage * (matchedTokens / tokens.length)
    if (matchedTokens === tokens.length) score += WEIGHTS.allTokens
  }
  const phrase = query.phrase
  if (phrase.length > 1) {
    if (titleLower.includes(phrase)) score += WEIGHTS.phraseTitle
    if (bodyLower.includes(phrase)) score += WEIGHTS.phraseBody
  }
  if (score > 0 || tokens.length === 0) score += WEIGHTS.recency * recencyFactor(note.updatedMs, query.nowMs)
  return { score, matchedTokens, firstMatchIndex }
}

/**
 * Build a compact one-line snippet around the best match.
 * @param {unknown} body - the note body.
 * @param {{ tokens: string[], phrase: string }} query - the compiled query.
 * @param {number} [maxChars] - snippet budget.
 * @returns {string} the snippet, with ellipses where text was cut.
 */
export function buildSnippet(body, query, maxChars = DEFAULT_SNIPPET_CHARS) {
  const text = String(body ?? '').replace(WHITESPACE_RE, ' ').trim()
  if (text === '') return ''
  const lowered = text.toLowerCase()
  let at = query.phrase.length > 1 ? lowered.indexOf(query.phrase) : -1
  if (at === -1) {
    for (const token of query.tokens) {
      const found = lowered.indexOf(token)
      if (found !== -1 && (at === -1 || found < at)) at = found
    }
  }
  const start = at === -1 ? 0 : Math.max(0, at - SNIPPET_LEAD_CHARS)
  const end = Math.min(text.length, start + maxChars)
  const cut = text.slice(start, end)
  return `${start > 0 ? '…' : ''}${cut}${end < text.length ? '…' : ''}`
}

/**
 * Compile a query once for reuse across every candidate note.
 * @param {unknown} query - the raw query text.
 * @param {number} nowMs - reference instant for recency.
 * @returns {{ tokens: string[], phrase: string, nowMs: number }} the compiled query.
 */
export function compileQuery(query, nowMs) {
  return {
    tokens: queryTokens(query),
    phrase: String(query ?? '').replace(WHITESPACE_RE, ' ').trim().toLowerCase(),
    nowMs: Number.isFinite(nowMs) ? nowMs : 0,
  }
}

/**
 * Rank notes for one query.
 *
 * An empty query degenerates to "most recently updated first", which is what
 * both the browser panel and `kb_list` want.
 * @param {Array<{ id: string, title: string, tags: string[], body: string, updatedMs: number }>} notes - candidate notes.
 * @param {{ query?: unknown, tags?: string[], limit?: number, now?: number, snippetChars?: number }} [options] - query, tag filter, and budgets.
 * @returns {{ matched: number, results: Array<{ id: string, score: number, snippet: string, note: object }> }} ranked results.
 */
export function searchNotes(notes, options = {}) {
  const nowMs = Number.isFinite(options.now) ? options.now : Date.now()
  const compiled = compileQuery(options.query ?? '', nowMs)
  const filterTags = (options.tags ?? []).map((tag) => String(tag).toLowerCase()).filter((tag) => tag !== '')
  const limit = Number.isFinite(options.limit) && options.limit > 0 ? Math.floor(options.limit) : notes.length
  const snippetChars = Number.isFinite(options.snippetChars) && options.snippetChars > 0
    ? Math.floor(options.snippetChars)
    : DEFAULT_SNIPPET_CHARS
  const scored = []
  for (const note of notes) {
    if (filterTags.length > 0) {
      const own = (note.tags ?? []).map((tag) => String(tag).toLowerCase())
      if (!filterTags.every((tag) => own.includes(tag))) continue
    }
    const outcome = scoreNote(note, compiled)
    if (compiled.tokens.length > 0 && outcome.matchedTokens === 0) continue
    scored.push({ note, score: outcome.score })
  }
  scored.sort((left, right) => {
    if (right.score !== left.score) return right.score - left.score
    if ((right.note.updatedMs ?? 0) !== (left.note.updatedMs ?? 0)) return (right.note.updatedMs ?? 0) - (left.note.updatedMs ?? 0)
    return compareText(left.note.id, right.note.id)
  })
  const results = scored.slice(0, limit).map((entry) => ({
    id: entry.note.id,
    score: Math.round(entry.score * 100) / 100,
    snippet: compiled.tokens.length > 0
      ? buildSnippet(entry.note.body, compiled, snippetChars)
      : firstLine(entry.note.body, snippetChars),
    note: entry.note,
  }))
  return { matched: scored.length, results }
}
