/**
 * dsh-w-knowledge-base — the durable store.
 *
 * Layout under the configured root:
 *
 *   <root>/notes/<id>__<slug>.md   one note per file, front matter + Markdown
 *   <root>/.trash/<stamp>__<file>  soft-deleted notes, kept for recovery
 *
 * The files are the source of truth. This class keeps an in-memory snapshot for
 * ranking and for the prompt index, and revalidates it against `mtime`/`size`
 * on every sync, so notes edited by hand (or by the agent's own file tools)
 * are picked up without a restart.
 */

import { mkdir, readdir, readFile, rename, stat, unlink, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import {
  NOTE_EXTENSION,
  compareText,
  compareTitles,
  formatTimestamp,
  idFromFileName,
  newNoteId,
  noteFileName,
  normalizeTags,
  parseNote,
  parseTimestamp,
  sanitizeTitle,
  serializeNote,
  syntheticNoteId,
} from './kb-format.js'
import { searchNotes } from './kb-search.js'
import {
  DEFAULT_MAX_DOC_CHARS,
  DEFAULT_TARGET_CHARS,
  MIN_TARGET_CHARS,
  ORIGIN_PREFIX,
  buildImportDrafts,
  classifyDocument,
} from './kb-ingest.js'

/** Sub-directory holding live notes. */
export const NOTES_DIR = 'notes'
/** Sub-directory holding soft-deleted notes. */
export const TRASH_DIR = '.trash'
/** Default per-note body budget. */
export const DEFAULT_MAX_NOTE_CHARS = 60000
/** Default per-section character target when a document is fed in. */
export { DEFAULT_TARGET_CHARS as DEFAULT_IMPORT_TARGET_CHARS }
/** Default hard cap on one fed document. */
export { DEFAULT_MAX_DOC_CHARS as DEFAULT_MAX_DOC_CHARS }
/** Default minimum delay between two disk revalidations. */
export const DEFAULT_SYNC_INTERVAL_MS = 1500
/** Default number of notes named in the prompt index. */
export const DEFAULT_INDEX_NOTES = 24
/** Default character budget of the prompt index. */
export const DEFAULT_INDEX_CHARS = 2400
/** Sort keys accepted by {@link KnowledgeStore.list}. */
export const SORT_KEYS = Object.freeze(['updated', 'created', 'title'])

const ID_MINT_ATTEMPTS = 64

/**
 * Normalize note body text: LF line endings, no trailing whitespace, no
 * leading blank lines.
 * @param {unknown} text - raw body text.
 * @returns {string} the normalized body.
 */
export function normalizeBody(text) {
  return String(text ?? '').replace(/\r\n/g, '\n').replace(/^\n+/, '').replace(/\s+$/, '')
}

/**
 * Build an error carrying a stable code, so callers can branch without string
 * matching while the message stays actionable for the model.
 * @param {string} code - stable error code.
 * @param {string} message - actionable message.
 * @returns {Error} the tagged error.
 */
function storeError(code, message) {
  const error = new Error(message)
  error.code = code
  return error
}

/** The knowledge base: notes on disk, plus ranking and index projections. */
export class KnowledgeStore {
  /**
   * @param {{ root: string, displayRoot?: string, maxNoteChars?: number, syncIntervalMs?: number, now?: () => number, random?: () => number }} options - store configuration.
   */
  constructor(options) {
    if (!options || typeof options.root !== 'string' || options.root.trim() === '') {
      throw new TypeError('KnowledgeStore requires a root directory')
    }
    /** Absolute knowledge base root. */
    this.root = options.root
    /** User-facing spelling of {@link root} (e.g. `$DSH_HOME/knowledge-base`). */
    this.displayRoot = typeof options.displayRoot === 'string' && options.displayRoot !== '' ? options.displayRoot : options.root
    /** Per-note body budget. */
    this.maxNoteChars = Number.isFinite(options.maxNoteChars) && options.maxNoteChars > 0
      ? Math.floor(options.maxNoteChars)
      : DEFAULT_MAX_NOTE_CHARS
    /** Per-section character target when splitting a fed document. */
    this.importTargetChars = Number.isFinite(options.importTargetChars) && options.importTargetChars > 0
      ? Math.floor(options.importTargetChars)
      : DEFAULT_TARGET_CHARS
    /** Hard cap on one fed document. */
    this.maxDocChars = Number.isFinite(options.maxDocChars) && options.maxDocChars > 0
      ? Math.floor(options.maxDocChars)
      : DEFAULT_MAX_DOC_CHARS
    /** Minimum delay between two unforced disk revalidations. */
    this.syncIntervalMs = Number.isFinite(options.syncIntervalMs) && options.syncIntervalMs >= 0
      ? Math.floor(options.syncIntervalMs)
      : DEFAULT_SYNC_INTERVAL_MS
    /** Non-fatal integrity notes from the last sync (duplicate ids, unreadable files). */
    this.warnings = []
    /** Monotonic counter bumped whenever the snapshot changes. */
    this.revision = 0
    this._now = typeof options.now === 'function' ? options.now : () => Date.now()
    this._random = typeof options.random === 'function' ? options.random : Math.random
    this._notes = new Map()
    this._lastSyncAt = 0
    this._syncing = null
    this._chain = Promise.resolve()
  }

  /** @returns {string} the live notes directory. */
  notesDir() {
    return join(this.root, NOTES_DIR)
  }

  /** @returns {string} the trash directory. */
  trashDir() {
    return join(this.root, TRASH_DIR)
  }

  /**
   * Revalidate the in-memory snapshot against the files.
   * Unforced calls inside {@link syncIntervalMs} of the previous one are no-ops,
   * and concurrent calls share one disk pass.
   * @param {{ force?: boolean }} [options] - pass `force` to bypass the interval.
   * @returns {Promise<KnowledgeStore>} this store, for chaining.
   */
  async sync(options = {}) {
    const force = options.force === true
    if (this._syncing !== null) {
      await this._syncing
      if (!force) return this
    }
    if (!force && this._now() - this._lastSyncAt < this.syncIntervalMs) return this
    this._syncing = this._reload()
    try {
      await this._syncing
    } finally {
      this._syncing = null
      this._lastSyncAt = this._now()
    }
    return this
  }

  /** @returns {object[]} every note, most recently updated first. */
  notes() {
    return [...this._notes.values()].sort((left, right) => {
      if (right.updatedMs !== left.updatedMs) return right.updatedMs - left.updatedMs
      return compareText(left.id, right.id)
    })
  }

  /**
   * Look one note up in the current snapshot.
   * @param {unknown} id - the note id.
   * @returns {object | null} the note record, or null when absent.
   */
  get(id) {
    const key = String(id ?? '').trim()
    return key === '' ? null : this._notes.get(key) ?? null
  }

  /** @returns {Array<{ tag: string, count: number }>} tag counts, most used first. */
  tagFacet() {
    const counts = new Map()
    for (const note of this._notes.values()) {
      for (const tag of note.tags) {
        const key = tag.toLowerCase()
        const entry = counts.get(key)
        if (entry === undefined) counts.set(key, { tag, count: 1 })
        else entry.count += 1
      }
    }
    return [...counts.values()].sort((left, right) => {
      if (right.count !== left.count) return right.count - left.count
      return compareText(left.tag.toLowerCase(), right.tag.toLowerCase())
    })
  }

  /**
   * Rank notes for one query.
   * @param {{ query?: unknown, tags?: string[], limit?: number, snippetChars?: number }} [options] - query and budgets.
   * @returns {Promise<{ matched: number, total: number, results: object[] }>} ranked results.
   */
  async search(options = {}) {
    await this.sync()
    const outcome = searchNotes(this.notes(), { ...options, now: this._now() })
    return { matched: outcome.matched, total: this._notes.size, results: outcome.results }
  }

  /**
   * Page through notes with an optional tag filter.
   * @param {{ tag?: unknown, limit?: number, offset?: number, sort?: string, order?: string }} [options] - filter, paging, and ordering.
   * @returns {Promise<{ total: number, offset: number, notes: object[], tags: Array<{ tag: string, count: number }> }>} one page.
   */
  async list(options = {}) {
    await this.sync()
    const tag = String(options.tag ?? '').trim().toLowerCase()
    let notes = this.notes()
    if (tag !== '') notes = notes.filter((note) => note.tags.some((own) => own.toLowerCase() === tag))
    const sort = SORT_KEYS.includes(options.sort) ? options.sort : 'updated'
    const ascending = options.order === 'asc'
    notes.sort((left, right) => {
      const delta = sort === 'title'
        ? compareTitles(left.title, right.title)
        : sort === 'created'
          ? left.createdMs - right.createdMs
          : left.updatedMs - right.updatedMs
      const tie = delta !== 0 ? delta : compareText(left.id, right.id)
      return ascending ? tie : -tie
    })
    const total = notes.length
    const offset = Number.isFinite(options.offset) && options.offset > 0 ? Math.floor(options.offset) : 0
    const limit = Number.isFinite(options.limit) && options.limit > 0 ? Math.floor(options.limit) : total
    return { total, offset, notes: notes.slice(offset, offset + limit), tags: this.tagFacet() }
  }

  /** @returns {Promise<{ root: string, displayRoot: string, total: number, chars: number, tags: Array<{ tag: string, count: number }>, warnings: string[], revision: number }>} store-wide counters. */
  async stats() {
    await this.sync()
    let chars = 0
    for (const note of this._notes.values()) chars += note.chars
    return {
      root: this.root,
      displayRoot: this.displayRoot,
      total: this._notes.size,
      chars,
      tags: this.tagFacet(),
      warnings: [...this.warnings],
      revision: this.revision,
    }
  }

  /**
   * Look one note up by its import origin key.
   * @param {unknown} origin - the origin key to find.
   * @returns {object | null} the note record, or null when absent.
   */
  findByOrigin(origin) {
    const key = String(origin ?? '').trim()
    if (key === '') return null
    for (const note of this._notes.values()) {
      if (note.origin === key) return note
    }
    return null
  }

  /**
   * Feed one whole document into the knowledge base: it is classified, split
   * into sections, and every section is saved as a note stamped with a stable
   * origin, so feeding the same document again updates those notes instead of
   * duplicating them.
   * @param {{ name?: string, text?: string, tags?: unknown, source?: string, workspace?: string, dryRun?: boolean }} input - the document.
   * @returns {Promise<object>} the import outcome: plan (dry run) or write summary plus the id of every note touched.
   */
  async importDocument(input = {}) {
    // Not wrapped in _enqueue on purpose: every draft below is persisted
    // through save(), which serializes itself. Queuing this method too would
    // deadlock the chain (a queued task awaiting another queued task).
    return (async () => {
      await this.sync({ force: true })
      const verdict = classifyDocument({ name: input.name, text: input.text, maxChars: this.maxDocChars })
      if (!verdict.ok) {
        const error = new Error(verdict.message)
        error.code = verdict.reason === 'binary-type' || verdict.reason === 'binary-content' ? 'KB_IMPORT_BINARY'
          : verdict.reason === 'empty' ? 'KB_IMPORT_EMPTY' : 'KB_IMPORT_TOO_LARGE'
        throw error
      }
      // Split at the requested target, but never produce a note over the
      // per-note budget — a small maxNoteChars wins over a larger target.
      const targetChars = Math.min(
        Math.max(MIN_TARGET_CHARS, this.importTargetChars),
        this.maxNoteChars,
      )
      const built = buildImportDrafts({ name: input.name, text: input.text, tags: input.tags, targetChars })
      const source = typeof input.source === 'string' && input.source !== '' ? input.source : ''
      const workspace = typeof input.workspace === 'string' && input.workspace !== '' ? input.workspace : ''
      const plan = {
        name: String(input.name ?? ''),
        docTitle: built.docTitle,
        docSlug: built.docSlug,
        drafts: built.drafts.map((draft) => ({
          origin: draft.origin,
          title: draft.title,
          chars: draft.body.length,
          part: draft.part,
          parts: draft.parts,
          update: this.findByOrigin(draft.origin) !== null,
        })),
      }
      if (input.dryRun === true) {
        return { dryRun: true, plan, notes: [], counts: { created: 0, updated: 0, stale: 0 } }
      }
      // Tags the user passes describe the DOCUMENT, not one section: on an
      // update they are merged into what the note already carries, so a later
      // feed without tags never wipes an earlier annotation.
      const extraTags = typeof input.tags === 'string' ? input.tags.split(',').map((tag) => tag.trim()).filter((tag) => tag !== '') : Array.isArray(input.tags) ? input.tags : []
      const notes = []
      let created = 0
      let updated = 0
      for (const draft of built.drafts) {
        const existing = this.findByOrigin(draft.origin)
        let tags = draft.tags
        if (existing !== null) {
          // Re-project the derived tags from THIS document (so a renamed file
          // moves its slug) but carry everything the note accumulated on its
          // own: custom tags from earlier feeds and hand-edited ones.
          const carried = existing.tags.filter((tag) => tag.toLowerCase() !== 'import' && tag.toLowerCase() !== built.docSlug)
          const merged = [...new Set([...extraTags.map((tag) => String(tag).trim()).filter((tag) => tag !== ''), ...carried])]
          tags = ['import', built.docSlug, ...merged]
        }
        const outcome = await this.save({
          title: draft.title,
          content: draft.body,
          tags,
          origin: draft.origin,
          source: source === '' ? 'import' : source,
          workspace,
          allowDuplicateTitle: true,
        })
        if (outcome.action === 'created') created += 1
        else updated += 1
        notes.push({ id: outcome.note.id, title: outcome.note.title, chars: outcome.note.chars, origin: draft.origin })
      }
      const prefix = ORIGIN_PREFIX + built.docSlug + '#'
      const stale = this.notes()
        .filter((note) => note.origin !== '' && note.origin.startsWith(prefix) && !built.drafts.some((draft) => draft.origin === note.origin))
        .map((note) => ({ id: note.id, title: note.title, origin: note.origin }))
      return {
        dryRun: false,
        plan,
        notes,
        stale,
        counts: { created, updated, stale: stale.length },
      }
    })()
  }

  /**
   * Create a note, or update one addressed by `id` or by an import `origin`.
   * @param {{ id?: string, origin?: string, title?: string, content?: string, tags?: unknown, mode?: string, source?: string, workspace?: string, allowDuplicateTitle?: boolean }} input - the write request.
   * @returns {Promise<{ action: 'created' | 'updated', note: object }>} the write outcome.
   */
  async save(input = {}) {
    return this._enqueue(async () => {
      await this.sync({ force: true })
      const nowMs = this._now()
      const requestedId = typeof input.id === 'string' ? input.id.trim() : ''
      const requestedOrigin = typeof input.origin === 'string' ? input.origin.trim() : ''
      const existing = requestedId !== ''
        ? this.get(requestedId)
        : requestedOrigin !== ''
          ? this.findByOrigin(requestedOrigin)
          : null
      if (requestedId !== '' && existing === null) {
        throw storeError(
          'KB_UNKNOWN_ID',
          `unknown note id "${requestedId}": run kb_search or kb_list to find the right id, or omit id to create a new note`,
        )
      }
      const hasTitle = typeof input.title === 'string' && input.title.trim() !== ''
      const hasContent = typeof input.content === 'string' && input.content.trim() !== ''
      const hasTags = input.tags !== undefined && input.tags !== null
      if (existing === null) {
        if (!hasTitle) throw storeError('KB_TITLE_REQUIRED', 'title is required when creating a note')
        if (!hasContent) throw storeError('KB_CONTENT_REQUIRED', 'content is required when creating a note')
      } else if (!hasTitle && !hasContent && !hasTags) {
        throw storeError('KB_EMPTY_UPDATE', 'nothing to update: pass content, title, or tags alongside id')
      }
      const title = hasTitle ? sanitizeTitle(input.title) : existing.title
      const tags = hasTags ? normalizeTags(input.tags) : existing === null ? [] : existing.tags
      const append = input.mode === 'append'
      const incoming = hasContent ? normalizeBody(input.content) : ''
      const body = existing === null
        ? incoming
        : !hasContent
          ? existing.body
          : append
            ? normalizeBody(existing.body === '' ? incoming : `${existing.body}\n\n${incoming}`)
            : incoming
      if (body.length > this.maxNoteChars) {
        throw storeError(
          'KB_NOTE_TOO_LARGE',
          `note body is ${body.length} characters, over the ${this.maxNoteChars} limit: split it into focused notes or raise maxNoteChars in the plugin config`,
        )
      }
      if (existing === null && input.allowDuplicateTitle !== true) {
        const key = title.toLowerCase()
        const clash = this.notes().find((note) => note.title.toLowerCase() === key)
        if (clash !== undefined) {
          throw storeError(
            'KB_DUPLICATE_TITLE',
            `a note titled "${clash.title}" already exists as ${clash.id}: pass id "${clash.id}" to update it (mode "append" to extend it), or allowDuplicateTitle true to keep both`,
          )
        }
      }
      const id = existing === null ? this._mintId(nowMs) : existing.id
      const created = existing === null ? formatTimestamp(nowMs) : existing.created
      const updated = formatTimestamp(nowMs)
      const source = typeof input.source === 'string' && input.source.trim() !== ''
        ? input.source.trim()
        : existing === null ? '' : existing.source
      const workspace = typeof input.workspace === 'string' && input.workspace.trim() !== ''
        ? input.workspace.trim()
        : existing === null ? '' : existing.workspace
      const origin = requestedOrigin !== ''
        ? requestedOrigin
        : existing === null ? '' : existing.origin
      const file = noteFileName(id, title)
      const target = join(this.notesDir(), file)
      await mkdir(this.notesDir(), { recursive: true })
      await this._writeAtomic(target, { id, title, tags, created, updated, source, workspace, origin, body })
      if (existing !== null && existing.file !== file) await this._unlinkQuiet(join(this.notesDir(), existing.file))
      const info = await stat(target)
      const record = {
        id,
        naturalId: id,
        title,
        tags,
        body,
        source,
        workspace,
        origin,
        created,
        updated,
        createdMs: parseTimestamp(created),
        updatedMs: parseTimestamp(updated),
        chars: body.length,
        file,
        size: info.size,
        mtimeMs: info.mtimeMs,
      }
      this._notes.set(id, record)
      this.revision += 1
      return { action: existing === null ? 'created' : 'updated', note: record }
    })
  }

  /**
   * Retire one note. Soft deletion (the default) moves the file into the trash
   * directory so a mistaken deletion stays recoverable.
   * @param {unknown} id - the note id.
   * @param {{ hard?: boolean }} [options] - pass `hard` to unlink instead.
   * @returns {Promise<{ note: object, mode: 'trash' | 'permanent', path: string }>} the deletion outcome.
   */
  async remove(id, options = {}) {
    return this._enqueue(async () => {
      await this.sync({ force: true })
      const note = this.get(id)
      if (note === null) {
        throw storeError('KB_UNKNOWN_ID', `unknown note id "${String(id ?? '').trim()}": run kb_list to see the current ids`)
      }
      const source = join(this.notesDir(), note.file)
      let mode = 'trash'
      let path = ''
      if (options.hard === true) {
        await this._unlinkQuiet(source)
        mode = 'permanent'
      } else {
        await mkdir(this.trashDir(), { recursive: true })
        const stamp = formatTimestamp(this._now()).replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z')
        path = join(this.trashDir(), `${stamp}__${note.file}`)
        try {
          await rename(source, path)
        } catch (error) {
          if (error && error.code === 'ENOENT') path = ''
          else throw error
        }
      }
      this._notes.delete(note.id)
      this.revision += 1
      return { note, mode, path }
    })
  }

  /**
   * Render the compact index injected into the model's runtime context.
   * @param {{ maxNotes?: number, maxChars?: number }} [options] - index budgets.
   * @returns {string} the index text, or an empty string when no notes exist and nothing is worth saying.
   */
  indexSnapshot(options = {}) {
    const maxNotes = Number.isFinite(options.maxNotes) && options.maxNotes > 0 ? Math.floor(options.maxNotes) : DEFAULT_INDEX_NOTES
    const maxChars = Number.isFinite(options.maxChars) && options.maxChars > 0 ? Math.floor(options.maxChars) : DEFAULT_INDEX_CHARS
    const notes = this.notes()
    const header = `Knowledge base (dsh-w-knowledge-base) at ${this.displayRoot}`
    if (notes.length === 0) {
      return `${header}: empty. Save a durable finding with kb_save so a later session can recall it.`
    }
    const lines = [`${header}: ${notes.length} note${notes.length === 1 ? '' : 's'}. Search with kb_search, open with kb_read.`]
    let used = lines[0].length
    let shown = 0
    for (const note of notes.slice(0, maxNotes)) {
      const tags = note.tags.length > 0 ? ` [${note.tags.join(', ')}]` : ''
      const line = `- ${note.id} · ${note.title}${tags} · ${note.updated.slice(0, 10)}`
      if (used + line.length + 1 > maxChars) break
      lines.push(line)
      used += line.length + 1
      shown += 1
    }
    const hidden = notes.length - shown
    if (hidden > 0) lines.push(`(+${hidden} more note${hidden === 1 ? '' : 's'}; run kb_list to page through them.)`)
    return lines.join('\n')
  }

  /**
   * Serialize one mutation behind the previous ones, so two concurrent writes
   * cannot interleave a sync with a rename.
   * @param {() => Promise<any>} task - the mutation to run.
   * @returns {Promise<any>} the mutation result.
   */
  _enqueue(task) {
    const result = this._chain.then(() => task())
    this._chain = result.then(() => undefined, () => undefined)
    return result
  }

  /**
   * Mint an id that no current note holds.
   * @param {number} nowMs - creation instant.
   * @returns {string} the fresh id.
   */
  _mintId(nowMs) {
    for (let attempt = 0; attempt < ID_MINT_ATTEMPTS; attempt += 1) {
      const id = newNoteId(nowMs, this._random)
      if (!this._notes.has(id)) return id
    }
    let counter = 2
    const base = newNoteId(nowMs, this._random)
    while (this._notes.has(`${base}-${counter}`)) counter += 1
    return `${base}-${counter}`
  }

  /**
   * Write one note file atomically: a temporary sibling, then a rename over the
   * target, so a crash never leaves a half-written note.
   * @param {string} path - destination file path.
   * @param {object} note - the note to serialize.
   * @returns {Promise<void>} resolution after the rename.
   */
  async _writeAtomic(path, note) {
    const token = Math.floor(Math.abs(this._random()) * 0xffffffff).toString(36)
    const temporary = `${path}.tmp-${token}`
    await writeFile(temporary, serializeNote(note), 'utf8')
    try {
      await rename(temporary, path)
    } catch (error) {
      await this._unlinkQuiet(temporary)
      throw error
    }
  }

  /**
   * Delete a file, tolerating a file that is already gone.
   * @param {string} path - the file to remove.
   * @returns {Promise<void>} resolution after the attempt.
   */
  async _unlinkQuiet(path) {
    try {
      await unlink(path)
    } catch (error) {
      if (!error || error.code !== 'ENOENT') throw error
    }
  }

  /**
   * Rebuild the snapshot from disk, reusing cached bodies for files whose
   * `mtime` and `size` are unchanged.
   * @returns {Promise<void>} resolution after the snapshot is replaced.
   */
  async _reload() {
    let entries
    try {
      entries = await readdir(this.notesDir(), { withFileTypes: true })
    } catch (error) {
      if (error && error.code === 'ENOENT') {
        if (this._notes.size > 0) {
          this._notes.clear()
          this.revision += 1
        }
        this.warnings = []
        return
      }
      throw error
    }
    const files = entries
      .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(NOTE_EXTENSION))
      .map((entry) => entry.name)
      .sort()
    const cachedByFile = new Map()
    for (const note of this._notes.values()) cachedByFile.set(note.file, note)
    const next = new Map()
    const warnings = []
    let changed = files.length !== this._notes.size
    for (const file of files) {
      const path = join(this.notesDir(), file)
      let info
      try {
        info = await stat(path)
      } catch (error) {
        if (error && error.code === 'ENOENT') continue
        throw error
      }
      const cached = cachedByFile.get(file)
      let record
      if (cached !== undefined && cached.mtimeMs === info.mtimeMs && cached.size === info.size) {
        record = cached
      } else {
        changed = true
        try {
          record = this._recordFromFile(file, await readFile(path, 'utf8'), info)
        } catch (error) {
          warnings.push(`could not read ${file}: ${error && error.message ? error.message : String(error)}`)
          continue
        }
      }
      // Collisions are detected against the id the FILE declares, never against
      // a previously de-duplicated one, so the warning survives later syncs.
      const naturalId = record.naturalId ?? record.id
      let id = naturalId
      if (next.has(id)) {
        let suffix = 2
        while (next.has(`${id}-${suffix}`)) suffix += 1
        warnings.push(`duplicate note id "${id}" in ${file}; indexed as "${id}-${suffix}"`)
        id = `${id}-${suffix}`
        changed = true
      }
      if (record.id !== id) record = { ...record, id }
      next.set(id, record)
    }
    this._notes = next
    this.warnings = warnings
    if (changed) this.revision += 1
  }

  /**
   * Project one file into a snapshot record, backfilling timestamps from the
   * file itself when the front matter omits them.
   * @param {string} file - bare file name.
   * @param {string} text - file text.
   * @param {{ size: number, mtimeMs: number, birthtimeMs?: number }} info - stat result.
   * @returns {object} the snapshot record.
   */
  _recordFromFile(file, text, info) {
    const fallbackId = idFromFileName(file) || syntheticNoteId(file)
    const parsed = parseNote(text, { fallbackId })
    const birth = Number.isFinite(info.birthtimeMs) && info.birthtimeMs > 0 ? info.birthtimeMs : info.mtimeMs
    const createdMs = parseTimestamp(parsed.created) || birth
    const updatedMs = Math.max(parseTimestamp(parsed.updated), info.mtimeMs)
    const id = parsed.id === '' ? fallbackId : parsed.id
    return {
      id,
      naturalId: id,
      title: parsed.title,
      tags: parsed.tags,
      body: parsed.body,
      source: parsed.source,
      workspace: parsed.workspace,
      origin: parsed.origin,
      created: formatTimestamp(createdMs),
      updated: formatTimestamp(updatedMs),
      createdMs,
      updatedMs,
      chars: parsed.body.length,
      file,
      size: info.size,
      mtimeMs: info.mtimeMs,
    }
  }
}

export default KnowledgeStore
