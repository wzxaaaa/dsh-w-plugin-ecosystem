/**
 * dsh-w-knowledge-base — note format helpers.
 *
 * One note is one Markdown file with a small `---` front matter block, so the
 * knowledge base stays readable, greppable, and hand-editable without this
 * plugin (the agent's own `read`/`edit` tools work on it directly).
 *
 * Every export here is pure: no filesystem, no clock, no randomness unless the
 * caller injects it. That keeps the format unit-testable in isolation.
 */

/** Front matter fence line. */
export const FENCE = '---'
/** Note file extension. */
export const NOTE_EXTENSION = '.md'
/** Separator between the id and the human-readable slug in a file name. */
export const ID_SEPARATOR = '__'
/** Hard cap for a note title. */
export const MAX_TITLE_CHARS = 200
/** Hard cap for the number of tags on one note. */
export const MAX_TAGS = 12
/** Hard cap for one tag. */
export const MAX_TAG_CHARS = 48
/** Hard cap for the slug appended to a note file name. */
export const MAX_SLUG_CHARS = 40
/** Shape a note id must have to be addressable by the tools and safe in a file name. */
export const NOTE_ID_RE = /^[A-Za-z0-9][A-Za-z0-9._-]{0,79}$/
/** Front matter keys this format understands; anything else is ignored on read. */
export const FRONT_MATTER_KEYS = Object.freeze(['id', 'title', 'tags', 'created', 'updated', 'source', 'workspace', 'origin'])

const ID_SUFFIX_ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789'
const ID_SUFFIX_CHARS = 4
const CONTROL_CHARS_RE = /[\u0000-\u001f\u007f]+/g
const WHITESPACE_RE = /\s+/g
const UNSAFE_FILE_CHARS_RE = /[<>:"/\\|?*\u0000-\u001f]+/g
const TRIM_EDGE_RE = /^[-._]+|[-._]+$/g
const HEADING_PREFIX_RE = /^#{1,6}\s*/

/**
 * Compare two strings by code unit. Deliberately not `localeCompare`: note
 * ordering must not change with the machine's locale (a Chinese title would
 * otherwise sort before or after Latin titles depending on the host ICU data).
 * @param {unknown} left - first value.
 * @param {unknown} right - second value.
 * @returns {number} -1, 0, or 1.
 */
export function compareText(left, right) {
  const a = String(left ?? '')
  const b = String(right ?? '')
  return a < b ? -1 : a > b ? 1 : 0
}

/**
 * Compare two titles case-insensitively, falling back to code-unit order so the
 * result is a total order.
 * @param {unknown} left - first title.
 * @param {unknown} right - second title.
 * @returns {number} -1, 0, or 1.
 */
export function compareTitles(left, right) {
  const primary = compareText(String(left ?? '').toLowerCase(), String(right ?? '').toLowerCase())
  return primary !== 0 ? primary : compareText(left, right)
}

/**
 * Render one millisecond timestamp as a stable ISO-8601 UTC string.
 * @param {number} ms - epoch milliseconds; non-finite values fall back to the epoch.
 * @returns {string} the ISO-8601 representation.
 */
export function formatTimestamp(ms) {
  return new Date(Number.isFinite(ms) ? ms : 0).toISOString()
}

/**
 * Parse a front matter timestamp back to milliseconds.
 * @param {unknown} text - candidate timestamp text.
 * @returns {number} epoch milliseconds, or 0 when the value is absent or unparsable.
 */
export function parseTimestamp(text) {
  if (typeof text !== 'string' || text.trim() === '') return 0
  const ms = Date.parse(text.trim())
  return Number.isFinite(ms) ? ms : 0
}

/**
 * Mint a sortable, human-recognizable note id: `kb-<UTC date>-<UTC time>-<random>`.
 * UTC keeps ids stable regardless of the machine time zone.
 * @param {number} [nowMs] - creation instant in epoch milliseconds.
 * @param {() => number} [random] - injected uniform random source in [0, 1).
 * @returns {string} the new note id.
 */
export function newNoteId(nowMs = Date.now(), random = Math.random) {
  const stamp = formatTimestamp(nowMs).slice(0, 19).replace(/[-:]/g, '').replace('T', '-')
  let suffix = ''
  for (let index = 0; index < ID_SUFFIX_CHARS; index += 1) {
    const roll = random()
    const scaled = Number.isFinite(roll) ? Math.abs(roll) % 1 : 0
    const pick = Math.min(Math.floor(scaled * ID_SUFFIX_ALPHABET.length), ID_SUFFIX_ALPHABET.length - 1)
    suffix += ID_SUFFIX_ALPHABET[pick]
  }
  return `kb-${stamp}-${suffix}`
}

/**
 * Normalize a title into one clean single-line string.
 * @param {unknown} value - candidate title.
 * @returns {string} the normalized title.
 * @throws {TypeError} when the value is not a string.
 * @throws {Error} when the title is empty after normalization.
 */
export function sanitizeTitle(value) {
  if (typeof value !== 'string') throw new TypeError('title must be a string')
  const text = value.replace(CONTROL_CHARS_RE, ' ').replace(WHITESPACE_RE, ' ').trim()
  if (text === '') throw new Error('title must not be empty')
  return text.length > MAX_TITLE_CHARS ? text.slice(0, MAX_TITLE_CHARS).trim() : text
}

/**
 * Normalize a title without throwing, for tolerant reads of hand-written files.
 * @param {unknown} value - candidate title.
 * @returns {string} the normalized title, or an empty string when unusable.
 */
export function softTitle(value) {
  try {
    return sanitizeTitle(value)
  } catch {
    return ''
  }
}

/**
 * Normalize tags from an array or a comma-separated string.
 * Order is preserved, comparison for duplicates is case-insensitive.
 * @param {unknown} value - candidate tags.
 * @returns {string[]} the normalized tag list.
 * @throws {TypeError} when the value is neither a string, an array of strings, nor nullish.
 */
export function normalizeTags(value) {
  if (value === undefined || value === null) return []
  const raw = Array.isArray(value) ? value : typeof value === 'string' ? value.split(',') : null
  if (raw === null) throw new TypeError('tags must be an array of strings')
  const seen = new Set()
  const tags = []
  for (const item of raw) {
    if (typeof item !== 'string') throw new TypeError('tags must be an array of strings')
    const tag = item
      .replace(CONTROL_CHARS_RE, ' ')
      .replace(/,/g, ' ')
      .replace(WHITESPACE_RE, ' ')
      .trim()
      .slice(0, MAX_TAG_CHARS)
      .trim()
    if (tag === '') continue
    const key = tag.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    tags.push(tag)
    if (tags.length >= MAX_TAGS) break
  }
  return tags
}

/**
 * Derive the file-name slug of a title. Non-ASCII letters are kept (the file
 * system accepts them and they make the directory browsable); only characters
 * that are unsafe in a path are folded away.
 * @param {unknown} title - the note title.
 * @param {number} [maxChars] - slug length budget.
 * @returns {string} the slug, possibly empty.
 */
export function slugifyTitle(title, maxChars = MAX_SLUG_CHARS) {
  const folded = String(title ?? '')
    .replace(UNSAFE_FILE_CHARS_RE, ' ')
    .replace(WHITESPACE_RE, '-')
    .replace(TRIM_EDGE_RE, '')
  return folded.slice(0, Math.max(0, maxChars)).replace(TRIM_EDGE_RE, '').toLowerCase()
}

/**
 * Compose the file name of one note.
 * @param {string} id - the note id.
 * @param {unknown} title - the note title, used for the readable slug.
 * @returns {string} the file name including the extension.
 */
export function noteFileName(id, title) {
  const slug = slugifyTitle(title)
  return slug === '' ? `${id}${NOTE_EXTENSION}` : `${id}${ID_SEPARATOR}${slug}${NOTE_EXTENSION}`
}

/**
 * Recover the note id encoded in a file name written by {@link noteFileName}.
 * @param {string} fileName - the bare file name.
 * @returns {string} the id, or an empty string when the name carries none.
 */
export function idFromFileName(fileName) {
  const name = String(fileName ?? '')
  const base = name.endsWith(NOTE_EXTENSION) ? name.slice(0, -NOTE_EXTENSION.length) : name
  const cut = base.indexOf(ID_SEPARATOR)
  const candidate = cut === -1 ? base : base.slice(0, cut)
  return NOTE_ID_RE.test(candidate) ? candidate : ''
}

/**
 * Build an addressable id for a file that carries none — a note a human dropped
 * into the notes directory by hand.
 * @param {string} fileName - the bare file name.
 * @returns {string} an id matching {@link NOTE_ID_RE}.
 */
export function syntheticNoteId(fileName) {
  const name = String(fileName ?? '')
  const base = name.endsWith(NOTE_EXTENSION) ? name.slice(0, -NOTE_EXTENSION.length) : name
  const ascii = base.replace(/[^A-Za-z0-9._-]+/g, '-').replace(TRIM_EDGE_RE, '').slice(0, 60).replace(TRIM_EDGE_RE, '')
  if (ascii === '') return 'kb-note'
  return NOTE_ID_RE.test(ascii) ? ascii : `kb-${ascii}`.slice(0, 80)
}

/**
 * Take the first meaningful line of a note body, for one-line summaries.
 * @param {unknown} body - the note body.
 * @param {number} [maxChars] - length budget.
 * @returns {string} the collapsed first line.
 */
export function firstLine(body, maxChars = 120) {
  const lines = String(body ?? '').split('\n')
  for (const line of lines) {
    const text = line.replace(HEADING_PREFIX_RE, '').replace(WHITESPACE_RE, ' ').trim()
    if (text !== '') return text.length > maxChars ? `${text.slice(0, maxChars)}…` : text
  }
  return ''
}

/**
 * Serialize one note to its on-disk Markdown representation.
 * @param {{ id: string, title: string, tags?: string[], created: string, updated: string, source?: string, workspace?: string, body?: string }} note - the note to render.
 * @returns {string} the complete file text, newline-terminated.
 */
export function serializeNote(note) {
  const head = [FENCE, `id: ${note.id}`, `title: ${note.title}`, `tags: ${(note.tags ?? []).join(', ')}`]
  head.push(`created: ${note.created}`, `updated: ${note.updated}`)
  if (note.source) head.push(`source: ${note.source}`)
  if (note.workspace) head.push(`workspace: ${note.workspace}`)
  if (note.origin) head.push(`origin: ${note.origin}`)
  head.push(FENCE)
  const body = String(note.body ?? '').replace(/\r\n/g, '\n').replace(/\s+$/, '')
  return `${head.join('\n')}\n\n${body}\n`
}

/**
 * Parse one note file tolerantly: a missing or partial front matter block never
 * throws, it only produces empty fields the store can backfill from the file's
 * own metadata.
 * @param {unknown} text - the file text.
 * @param {{ fallbackId?: string }} [options] - id to use when the file carries none.
 * @returns {{ id: string, title: string, tags: string[], created: string, updated: string, source: string, workspace: string, body: string, hasFrontMatter: boolean }} the parsed note.
 */
export function parseNote(text, options = {}) {
  const raw = String(text ?? '').replace(/^\uFEFF/, '').replace(/\r\n/g, '\n')
  const lines = raw.split('\n')
  const fields = Object.create(null)
  let body = raw
  let hasFrontMatter = false
  if (lines.length > 0 && lines[0].trim() === FENCE) {
    let end = -1
    for (let index = 1; index < lines.length; index += 1) {
      if (lines[index].trim() === FENCE) {
        end = index
        break
      }
    }
    if (end !== -1) {
      hasFrontMatter = true
      for (const line of lines.slice(1, end)) {
        const cut = line.indexOf(':')
        if (cut <= 0) continue
        const key = line.slice(0, cut).trim().toLowerCase()
        if (!FRONT_MATTER_KEYS.includes(key)) continue
        fields[key] = line.slice(cut + 1).trim()
      }
      body = lines.slice(end + 1).join('\n').replace(/^\n+/, '')
    }
  }
  const fallbackId = typeof options.fallbackId === 'string' ? options.fallbackId : ''
  const declaredId = typeof fields.id === 'string' ? fields.id.trim() : ''
  const id = NOTE_ID_RE.test(declaredId) ? declaredId : fallbackId
  const cleanBody = body.replace(/^\n+/, '').replace(/\s+$/, '')
  const title = softTitle(fields.title) || firstLine(cleanBody, MAX_TITLE_CHARS) || id || 'untitled'
  return {
    id,
    title,
    tags: normalizeTags(typeof fields.tags === 'string' ? fields.tags : ''),
    created: typeof fields.created === 'string' ? fields.created.trim() : '',
    updated: typeof fields.updated === 'string' ? fields.updated.trim() : '',
    source: typeof fields.source === 'string' ? fields.source.trim() : '',
    workspace: typeof fields.workspace === 'string' ? fields.workspace.trim() : '',
    origin: typeof fields.origin === 'string' ? fields.origin.trim() : '',
    body: cleanBody,
    hasFrontMatter,
  }
}
