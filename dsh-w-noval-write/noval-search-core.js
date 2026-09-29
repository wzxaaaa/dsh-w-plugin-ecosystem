/**
 * Chapter-aware search over a novel's written manuscripts.
 *
 * Harness's generic grep only knows files and lines; a writer asks "when did
 * this sword last appear?" Hits here are ordered by the outline (volume and
 * chapter order), carry the chapter label, and can be limited to a chapter
 * range. Files not linked to an outline chapter are searched after the linked
 * ones, in file-name order.
 */

export const SEARCH_LIMITS = Object.freeze({
  queryChars: 200,
  terms: 8,
  maxResults: 200,
  defaultResults: 40,
  contextChars: 200,
  defaultContext: 60,
})

export const SEARCH_MATCH_MODES = Object.freeze(['phrase', 'any', 'all'])

function clampInteger(value, min, max, fallback) {
  return Number.isSafeInteger(value) ? Math.max(min, Math.min(max, value)) : fallback
}

/** Validate and normalize tool arguments; throws with a model-readable message. */
export function normalizeSearchOptions(input = {}) {
  const query = typeof input.query === 'string' ? input.query.trim() : ''
  if (query === '') throw new Error('query must not be empty')
  if (query.length > SEARCH_LIMITS.queryChars) throw new Error(`query is longer than ${SEARCH_LIMITS.queryChars} characters`)
  const match = SEARCH_MATCH_MODES.includes(input.match) ? input.match : 'phrase'
  const terms = match === 'phrase' ? [query] : [...new Set(query.split(/\s+/u).filter(Boolean))]
  if (terms.length > SEARCH_LIMITS.terms) throw new Error(`use at most ${SEARCH_LIMITS.terms} terms`)
  return {
    query,
    match,
    terms,
    order: input.order === 'desc' ? 'desc' : 'asc',
    maxResults: clampInteger(input.maxResults, 1, SEARCH_LIMITS.maxResults, SEARCH_LIMITS.defaultResults),
    contextChars: clampInteger(input.contextChars, 10, SEARCH_LIMITS.contextChars, SEARCH_LIMITS.defaultContext),
    caseSensitive: input.caseSensitive === true,
  }
}

function lineStarts(text) {
  const starts = [0]
  for (let index = 0; index < text.length; index += 1) if (text[index] === '\n') starts.push(index + 1)
  return starts
}

function chapterName(chapter) {
  if (!chapter) return ''
  return [chapter.number ? `#${chapter.number}` : '', chapter.title || (chapter.number ? '' : chapter.id)].filter(Boolean).join(' ')
}

/** Every [start, end) span where one of `terms` occurs. */
function findSpans(text, terms, caseSensitive) {
  const haystack = caseSensitive ? text : text.toLowerCase()
  const spans = []
  for (const term of terms) {
    const needle = caseSensitive ? term : term.toLowerCase()
    let from = 0
    while (from <= haystack.length) {
      const at = haystack.indexOf(needle, from)
      if (at < 0) break
      spans.push([at, at + needle.length, term])
      from = at + Math.max(1, needle.length)
    }
  }
  return spans.sort((a, b) => a[0] - b[0])
}

/**
 * Search manuscripts.
 * @param {Array<{ filename: string, text: string, chapter: object | null }>} files
 *   chapter: { index, id, volumeId, volumeTitle, number, title } from the outline, or null.
 * @param {object} optionsInput - see normalizeSearchOptions, plus fromIndex / toIndex (outline indexes).
 */
export function searchManuscripts(files, optionsInput) {
  const options = normalizeSearchOptions(optionsInput)
  const fromIndex = Number.isSafeInteger(optionsInput?.fromIndex) ? optionsInput.fromIndex : -Infinity
  const toIndex = Number.isSafeInteger(optionsInput?.toIndex) ? optionsInput.toIndex : Infinity
  const ranged = fromIndex !== -Infinity || toIndex !== Infinity
  const ordered = files
    .filter(file => !ranged || (file.chapter && file.chapter.index >= fromIndex && file.chapter.index <= toIndex))
    .sort((a, b) => {
      if (a.chapter && b.chapter) return a.chapter.index - b.chapter.index
      if (a.chapter) return -1
      if (b.chapter) return 1
      return a.filename.localeCompare(b.filename, 'zh-Hans-CN', { numeric: true })
    })
  const hits = []
  const perChapter = []
  for (const file of ordered) {
    const text = String(file.text ?? '').replace(/^﻿/u, '')
    const starts = lineStarts(text)
    const byLine = new Map()
    for (const span of findSpans(text, options.terms, options.caseSensitive)) {
      let low = 0
      let high = starts.length - 1
      while (low < high) {
        const mid = (low + high + 1) >> 1
        if (starts[mid] <= span[0]) low = mid
        else high = mid - 1
      }
      const entry = byLine.get(low) || { line: low, spans: [], terms: new Set() }
      entry.spans.push(span)
      entry.terms.add(span[2])
      byLine.set(low, entry)
    }
    let count = 0
    for (const entry of [...byLine.values()].sort((a, b) => a.line - b.line)) {
      if (options.match === 'all' && entry.terms.size < options.terms.length) continue
      count += entry.spans.length
      const lineStart = starts[entry.line]
      const lineEnd = entry.line + 1 < starts.length ? starts[entry.line + 1] - 1 : text.length
      const [first] = entry.spans
      const start = Math.max(lineStart, first[0] - options.contextChars)
      const end = Math.min(lineEnd, first[1] + options.contextChars)
      let excerpt = ''
      let cursor = start
      for (const [spanStart, spanEnd] of entry.spans) {
        if (spanStart < cursor || spanEnd > end) continue
        excerpt += text.slice(cursor, spanStart) + '【' + text.slice(spanStart, spanEnd) + '】'
        cursor = spanEnd
      }
      excerpt = (start > lineStart ? '…' : '') + (excerpt + text.slice(cursor, end)).replace(/\s+/gu, ' ').trim() + (end < lineEnd ? '…' : '')
      hits.push({
        filename: file.filename,
        chapterId: file.chapter ? file.chapter.id : '',
        volumeId: file.chapter ? file.chapter.volumeId : '',
        chapter: file.chapter ? chapterName(file.chapter) : '',
        volume: file.chapter ? file.chapter.volumeTitle || '' : '',
        outlineIndex: file.chapter ? file.chapter.index : -1,
        line: entry.line + 1,
        matches: entry.spans.length,
        excerpt,
      })
    }
    if (count > 0) {
      perChapter.push({
        filename: file.filename,
        chapterId: file.chapter ? file.chapter.id : '',
        chapter: file.chapter ? chapterName(file.chapter) : '',
        matches: count,
      })
    }
  }
  const total = hits.length
  const orderedHits = options.order === 'desc' ? [...hits].reverse() : hits
  return {
    query: options.query,
    match: options.match,
    order: options.order,
    searchedFiles: ordered.length,
    totalHits: total,
    truncated: total > options.maxResults,
    first: hits[0] ? { filename: hits[0].filename, chapter: hits[0].chapter, line: hits[0].line } : null,
    last: hits[total - 1] ? { filename: hits[total - 1].filename, chapter: hits[total - 1].chapter, line: hits[total - 1].line } : null,
    perChapter,
    hits: orderedHits.slice(0, options.maxResults),
  }
}
