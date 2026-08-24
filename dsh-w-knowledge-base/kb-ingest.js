/**
 * dsh-w-knowledge-base — document ingestion ("feed me a file" mode).
 *
 * The tool surface asks the agent to write one focused note at a time. A human
 * dropping a README, a meeting log, or an exported chat has no such patience,
 * so this module turns one whole document into a set of note drafts on its own:
 * it splits on Markdown headings (or paragraph boundaries when there are none),
 * derives a title per section, tags every draft with the document it came from,
 * and stamps each draft with a stable "origin" so re-feeding the same document
 * UPDATES those notes instead of duplicating them.
 *
 * Pure module: no filesystem, no clock. The store performs the writes.
 */

import { MAX_TITLE_CHARS, normalizeTags, sanitizeTitle, slugifyTitle } from './kb-format.js'

/** Default per-note character target when splitting a document. */
export const DEFAULT_TARGET_CHARS = 6000
/** Smallest split target that still produces readable notes. */
export const MIN_TARGET_CHARS = 200
/** Default hard cap on one document's text length. Large enough for multi-million-character novels. */
export const DEFAULT_MAX_DOC_CHARS = 10000000
/** A preamble at least this long becomes its own note instead of joining the first section. */
export const PREAMBLE_MIN_CHARS = 200
/** Marker prefix of every origin key written by this mode. */
export const ORIGIN_PREFIX = 'import:'
/** Tag added to every imported note, so one filter separates fed documents from hand-written notes. */
export const IMPORT_TAG = 'import'

/** Extensions this mode refuses outright: they are containers, not text. */
export const BINARY_EXTENSIONS = Object.freeze([
  '7z', 'avi', 'bin', 'bmp', 'bz2', 'class', 'dat', 'db', 'dll', 'dmg', 'doc', 'docx', 'dylib', 'exe', 'flac',
  'gif', 'gz', 'ico', 'iso', 'jar', 'jpeg', 'jpg', 'mkv', 'mov', 'mp3', 'mp4', 'msi', 'odt', 'ogg', 'otf',
  'pdf', 'png', 'ppt', 'pptx', 'psd', 'rar', 'so', 'sqlite', 'svgz', 'tar', 'tgz', 'ttf', 'wav', 'webm',
  'webp', 'woff', 'woff2', 'xls', 'xlsx', 'zip', 'zst',
])

const HEADING_RE = /^(#{1,6})[ \t]+(.+?)[ \t]*#*[ \t]*$/
const FENCE_RE = /^[ \t]*(```+|~~~+)/
const NUL_SCAN_CHARS = 8192

/** A chapter heading line is short: a real heading, not a sentence that mentions one. */
export const MAX_CHAPTER_HEADING_CHARS = 40
/** Fewest chapter markers before a plain-text file is treated as a chaptered book. */
export const MIN_NOVEL_CHAPTERS = 2
const CN_NUMERAL = '零一二三四五六七八九十百千两〇壹贰叁肆伍陆柒捌玖拾佰仟0-9'
// "第N章/节/回/卷/篇/折/幕" with an optional trailing title.
const NOVEL_NUMBERED_RE = new RegExp('^[ \\t\\u3000]*第[' + CN_NUMERAL + ']{1,9}[ \\t\\u3000]*[章节節回卷篇折幕][ \\t\\u3000:：、.．·\\-—]*.*$')
// Named front/back matter and side stories that stand as their own chapter.
const NOVEL_NAMED_RE = /^[ \t　]*(?:楔子|序章|序幕|序言|自序|序|引子|引言|前言|后记|後記|尾声|尾聲|终章|終章|结局|結局|大结局|大結局|番外(?:篇)?[零一二三四五六七八九十0-9]*|外传|外傳|完本感言)[ \t　:：、.．·\-—]*.*$/
// "Chapter 12", "CHAPTER 3", "Ch.4".
const NOVEL_LATIN_RE = /^[ \t]*(?:chapter|ch)\.?[ \t]*[0-9]+[ \t:：.．\-—]*.*$/i

/**
 * The extension of a file name, lowercase and without the dot.
 * @param {unknown} name - file name or path.
 * @returns {string} the extension, or an empty string.
 */
export function extensionOf(name) {
  const base = String(name ?? '').split(/[\\/]/).pop() ?? ''
  const cut = base.lastIndexOf('.')
  return cut <= 0 ? '' : base.slice(cut + 1).toLowerCase()
}

/**
 * The human-readable base name of a file: no directories, no extension,
 * separators turned back into spaces.
 * @param {unknown} name - file name or path.
 * @returns {string} the base name, never empty.
 */
export function fileBaseName(name) {
  const base = String(name ?? '').split(/[\\/]/).pop() ?? ''
  const cut = base.lastIndexOf('.')
  const stem = cut <= 0 ? base : base.slice(0, cut)
  const cleaned = stem.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim()
  return /[\p{L}\p{N}]/u.test(cleaned) ? cleaned : 'document'
}

/**
 * The tag that groups every note fed from one document.
 * @param {unknown} name - file name or path.
 * @returns {string} a slug usable as a tag.
 */
export function documentSlug(name) {
  const slug = slugifyTitle(fileBaseName(name), 32)
  return slug === '' ? 'document' : slug
}

/**
 * Normalize document text: no BOM, LF line endings, no trailing blank space.
 * @param {unknown} text - raw document text.
 * @returns {string} the normalized text.
 */
export function normalizeDocument(text) {
  return String(text ?? '').replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\s+$/, '')
}

/**
 * Decide whether one document can be ingested at all. Failures carry a machine
 * reason (the browser panel localizes it) plus an actionable English message.
 * @param {{ name?: unknown, text?: unknown, maxChars?: number }} input - the candidate document.
 * @returns {{ ok: true, extension: string } | { ok: false, reason: string, message: string, extension: string }} the verdict.
 */
export function classifyDocument(input = {}) {
  const extension = extensionOf(input.name)
  const text = String(input.text ?? '')
  const maxChars = Number.isFinite(input.maxChars) && input.maxChars > 0 ? Math.floor(input.maxChars) : DEFAULT_MAX_DOC_CHARS
  if (BINARY_EXTENSIONS.includes(extension)) {
    return {
      ok: false,
      reason: 'binary-type',
      extension,
      message: 'a .' + extension + ' file is not text: export it as .md or .txt first, then feed that',
    }
  }
  if (text.slice(0, NUL_SCAN_CHARS).indexOf('\u0000') !== -1) {
    return { ok: false, reason: 'binary-content', extension, message: 'this file contains binary data, not text' }
  }
  if (normalizeDocument(text) === '') {
    return { ok: false, reason: 'empty', extension, message: 'this file has no text content' }
  }
  if (text.length > maxChars) {
    return {
      ok: false,
      reason: 'too-large',
      extension,
      message: 'this document is ' + text.length + ' characters, over the ' + maxChars + ' limit: split it or raise importMaxChars',
    }
  }
  return { ok: true, extension }
}

/**
 * Collect Markdown headings, ignoring anything inside a fenced code block (a
 * shell comment inside a fence is not a section).
 * @param {string[]} lines - document lines.
 * @returns {Array<{ level: number, text: string, line: number }>} headings in document order.
 */
export function scanHeadings(lines) {
  const headings = []
  let fenced = false
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    if (FENCE_RE.test(line)) {
      fenced = !fenced
      continue
    }
    if (fenced) continue
    const match = HEADING_RE.exec(line)
    if (match !== null && match[2].trim() !== '') {
      headings.push({ level: match[1].length, text: match[2].trim(), line: index })
    }
  }
  return headings
}

/**
 * Test whether one line is a novel chapter heading (Chinese numbered, named
 * front/back matter, or a Latin "Chapter N"). A heading is a short line on its
 * own, so an over-long line that merely mentions "第一章" mid-sentence is not one.
 * @param {string} line - a single document line.
 * @returns {boolean} true when the line reads as a chapter heading.
 */
export function isNovelChapterLine(line) {
  const text = String(line ?? '').trim()
  if (text === '' || text.length > MAX_CHAPTER_HEADING_CHARS) return false
  return NOVEL_NUMBERED_RE.test(text) || NOVEL_NAMED_RE.test(text) || NOVEL_LATIN_RE.test(text)
}

/**
 * Collect chapter headings from a plain-text novel, the way {@link scanHeadings}
 * collects Markdown headings — used only when the document carries no Markdown
 * headings at all.
 * @param {string[]} lines - document lines.
 * @returns {Array<{ text: string, line: number }>} chapter headings in order.
 */
export function scanNovelChapters(lines) {
  const chapters = []
  for (let index = 0; index < lines.length; index += 1) {
    if (isNovelChapterLine(lines[index])) chapters.push({ text: lines[index].trim(), line: index })
  }
  return chapters
}

/**
 * Pick the heading level to cut on: the shallowest level that yields at least
 * two sections, so a document with one H1 and many H2s splits on the H2s.
 * @param {Array<{ level: number }>} headings - scanned headings.
 * @returns {number} the level, or 0 when the document has no headings.
 */
export function chooseSplitLevel(headings) {
  if (headings.length === 0) return 0
  const levels = [...new Set(headings.map((heading) => heading.level))].sort((left, right) => left - right)
  for (const level of levels) {
    if (headings.filter((heading) => heading.level <= level).length >= 2) return level
  }
  return levels[0]
}

/**
 * The document's own title: a unique top-level heading when it has one,
 * otherwise the file name.
 * @param {unknown} name - file name or path.
 * @param {Array<{ level: number, text: string }>} headings - scanned headings.
 * @returns {string} the document title.
 */
export function deriveDocumentTitle(name, headings) {
  if (headings.length > 0) {
    const top = Math.min(...headings.map((heading) => heading.level))
    const tops = headings.filter((heading) => heading.level === top)
    if (tops.length === 1 && tops[0].text !== '') return tops[0].text
  }
  return fileBaseName(name)
}

/**
 * Cut oversized text on paragraph boundaries, falling back to line and word
 * boundaries for one huge paragraph.
 * @param {unknown} text - text to cut.
 * @param {number} targetChars - size budget per part.
 * @returns {string[]} the parts, in order.
 */
export function splitBySize(text, targetChars) {
  const budget = Math.max(MIN_TARGET_CHARS, Math.floor(Number.isFinite(targetChars) ? targetChars : DEFAULT_TARGET_CHARS))
  const source = normalizeDocument(text)
  if (source === '') return []
  if (source.length <= budget) return [source]
  const paragraphs = source.split(/\n{2,}/).map((paragraph) => paragraph.replace(/\s+$/, '')).filter((paragraph) => paragraph.trim() !== '')
  const parts = []
  let current = ''
  const flush = () => {
    if (current.trim() !== '') parts.push(current)
    current = ''
  }
  for (const paragraph of paragraphs) {
    if (paragraph.length > budget) {
      flush()
      for (const piece of hardSplit(paragraph, budget)) parts.push(piece)
      continue
    }
    const candidate = current === '' ? paragraph : current + '\n\n' + paragraph
    if (candidate.length > budget) {
      flush()
      current = paragraph
    } else {
      current = candidate
    }
  }
  flush()
  return parts.length === 0 ? [source] : parts
}

/**
 * Last-resort split of one paragraph that exceeds the budget on its own.
 * @param {string} text - the oversized paragraph.
 * @param {number} budget - size budget per piece.
 * @returns {string[]} the pieces.
 */
function hardSplit(text, budget) {
  const pieces = []
  let rest = text
  const floor = Math.floor(budget / 2)
  while (rest.length > budget) {
    let cut = rest.lastIndexOf('\n', budget)
    if (cut < floor) cut = rest.lastIndexOf(' ', budget)
    if (cut < floor) cut = budget
    pieces.push(rest.slice(0, cut).replace(/\s+$/, ''))
    rest = rest.slice(cut).replace(/^\s+/, '')
  }
  if (rest.trim() !== '') {
    // A sliver left over from a boundary just short of the budget is not a
    // readable note on its own: fold it into the previous piece instead.
    if (pieces.length > 0 && rest.length < floor) {
      pieces[pieces.length - 1] = (pieces[pieces.length - 1] + ' ' + rest.trim()).trim()
    } else {
      pieces.push(rest)
    }
  }
  return pieces
}

/**
 * Cut a document at a list of anchor lines (Markdown headings or novel chapter
 * headings), emitting one raw section per anchor plus an optional leading intro.
 * Shared so headings and chapters split identically.
 * @param {string[]} lines - the document lines.
 * @param {Array<{ text: string, line: number }>} anchors - the cut points, in order.
 * @param {'section' | 'chapter'} kind - the section kind to stamp.
 * @param {object[]} out - the raw-section array to append to.
 * @returns {void}
 */
function sliceByAnchors(lines, anchors, kind, out) {
  const preamble = lines.slice(0, anchors[0].line).join('\n').trim()
  const bodies = anchors.map((anchor, index) => {
    const end = index + 1 < anchors.length ? anchors[index + 1].line : lines.length
    return lines.slice(anchor.line, end).join('\n').trim()
  })
  if (preamble !== '' && preamble.length < PREAMBLE_MIN_CHARS) {
    bodies[0] = preamble + '\n\n' + bodies[0]
  } else if (preamble !== '') {
    out.push({ kind: 'intro', heading: '', body: preamble, segment: 1, segments: 1 })
  }
  anchors.forEach((anchor, index) => {
    out.push({ kind, heading: anchor.text, body: bodies[index], segment: 1, segments: 1 })
  })
}

/**
 * Split one document into sections: heading-anchored when possible, size-based
 * otherwise, with every section bounded by the target size.
 * @param {{ name?: unknown, text?: unknown, targetChars?: number }} input - the document.
 * @returns {{ docTitle: string, docSlug: string, sections: Array<{ kind: string, heading: string, body: string, part: number, parts: number, segment: number, segments: number }> }} the split.
 */
export function splitDocument(input = {}) {
  const targetChars = Math.max(
    MIN_TARGET_CHARS,
    Math.floor(Number.isFinite(input.targetChars) ? input.targetChars : DEFAULT_TARGET_CHARS),
  )
  const text = normalizeDocument(input.text)
  const lines = text.split('\n')
  const headings = scanHeadings(lines)
  const level = chooseSplitLevel(headings)
  // Markdown headings win. A plain-text file with none is probed for novel
  // chapter markers, and only a file with neither is cut purely by size.
  const chapters = level === 0 ? scanNovelChapters(lines) : []
  const docTitle = deriveDocumentTitle(input.name, headings)
  const docSlug = documentSlug(input.name)
  const raw = []
  if (level !== 0) {
    sliceByAnchors(lines, headings.filter((heading) => heading.level <= level), 'section', raw)
  } else if (chapters.length >= MIN_NOVEL_CHAPTERS) {
    sliceByAnchors(lines, chapters, 'chapter', raw)
  } else {
    const segments = splitBySize(text, targetChars)
    segments.forEach((body, index) => {
      raw.push({ kind: 'segment', heading: '', body, segment: index + 1, segments: segments.length })
    })
  }
  const sections = []
  for (const section of raw) {
    if (section.body.length <= targetChars) {
      sections.push({ ...section, part: 1, parts: 1 })
      continue
    }
    const pieces = splitBySize(section.body, targetChars)
    pieces.forEach((body, index) => {
      sections.push({ ...section, body, part: index + 1, parts: pieces.length })
    })
  }
  return { docTitle, docSlug, sections }
}

/**
 * Compose the note title of one section.
 * @param {string} docTitle - the document title.
 * @param {{ kind: string, heading: string, part: number, parts: number, segment: number, segments: number }} section - the section.
 * @returns {string} the note title.
 */
export function sectionTitle(docTitle, section) {
  let title = docTitle
  if ((section.kind === 'section' || section.kind === 'chapter') && section.heading !== '' && section.heading !== docTitle) {
    title = docTitle + ' · ' + section.heading
  } else if (section.kind === 'intro') {
    title = docTitle + ' · 前言'
  } else if (section.kind === 'segment' && section.segments > 1) {
    title = docTitle + ' · 第 ' + section.segment + ' 段'
  }
  if (section.parts > 1) title = title + ' (' + section.part + '/' + section.parts + ')'
  return title.length > MAX_TITLE_CHARS ? title.slice(0, MAX_TITLE_CHARS) : title
}

/**
 * Compose the stable origin key of one section: what makes re-feeding the same
 * document an update instead of a second copy.
 * @param {string} docSlug - the document slug.
 * @param {{ kind: string, heading: string, part: number, segment: number }} section - the section.
 * @param {number} index - section index, used when the heading yields no slug.
 * @returns {string} the origin key.
 */
export function sectionOrigin(docSlug, section, index) {
  let anchor
  if (section.kind === 'intro') anchor = 'intro'
  else if (section.kind === 'segment') anchor = 'seg' + section.segment
  else {
    const slug = slugifyTitle(section.heading, 48)
    const fallback = (section.kind === 'chapter' ? 'ch' : 'h') + (index + 1)
    anchor = slug === '' ? fallback : slug
  }
  const suffix = section.parts > 1 ? '-' + section.part : ''
  return ORIGIN_PREFIX + docSlug + '#' + anchor + suffix
}

/**
 * Turn one document into ready-to-save note drafts.
 * @param {{ name?: unknown, text?: unknown, tags?: unknown, targetChars?: number }} input - the document and extra tags.
 * @returns {{ docTitle: string, docSlug: string, drafts: Array<{ origin: string, title: string, tags: string[], body: string, part: number, parts: number }> }} the drafts.
 */
export function buildImportDrafts(input = {}) {
  const split = splitDocument(input)
  const extra = Array.isArray(input.tags) ? input.tags : typeof input.tags === 'string' ? input.tags.split(',') : []
  const tags = normalizeTags([IMPORT_TAG, split.docSlug, ...extra])
  const used = new Set()
  const drafts = []
  split.sections.forEach((section, index) => {
    let origin = sectionOrigin(split.docSlug, section, index)
    if (used.has(origin)) {
      let suffix = 2
      while (used.has(origin + '~' + suffix)) suffix += 1
      origin = origin + '~' + suffix
    }
    used.add(origin)
    drafts.push({
      origin,
      title: sanitizeTitle(sectionTitle(split.docTitle, section)),
      tags,
      body: section.body,
      part: section.part,
      parts: section.parts,
    })
  })
  return { docTitle: split.docTitle, docSlug: split.docSlug, drafts }
}
