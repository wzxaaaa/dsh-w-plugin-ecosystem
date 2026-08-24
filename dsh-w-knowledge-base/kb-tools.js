/**
 * dsh-w-knowledge-base — the agent-facing tool surface.
 *
 * Every tool is described here as plain data in the `defineTool` option shape:
 * schemas, model-facing descriptions, canonical values, and rendering. Keeping
 * it free of host imports means the whole surface — including the wording of
 * every failure — is unit-testable without booting a Harness profile;
 * `index.js` is the only place that wraps these specs with `defineTool` and
 * registers them.
 */

import { readFile, stat } from 'node:fs/promises'
import { isAbsolute, resolve } from 'node:path'
import { firstLine } from './kb-format.js'
import { detectAndDecode } from './kb-encoding.js'

/** The tool names this plugin contributes, in registration order. */
export const TOOL_NAMES = Object.freeze(['kb_save', 'kb_search', 'kb_read', 'kb_list', 'kb_delete', 'kb_import'])

/** Hard cap on the byte size of one file read by kb_import, regardless of the store config. */
export const IMPORT_READ_LIMIT = 16 * 1024 * 1024
/** Friendly list of the extensions the import mode is designed for. */
export const IMPORT_EXTENSIONS = '.md .markdown .txt .log .csv .json .yaml .yml .tsv'

/** Default number of ranked notes returned by `kb_search`. */
export const DEFAULT_SEARCH_LIMIT = 8
/** Default number of summaries returned by `kb_list`. */
export const DEFAULT_LIST_LIMIT = 20
/** Hard cap for one `kb_list` page. */
export const MAX_LIST_LIMIT = 200
/** Default per-note character budget applied by `kb_read`. */
export const DEFAULT_READ_CHARS = 20000
/** Hard cap on how many notes one `kb_read` call may open. */
export const MAX_READ_NOTES = 10
/** Cooperative timeout for every knowledge base tool: these are local file operations. */
export const TOOL_TIMEOUT_MS = 20000

const NOTE_SUMMARY_PROPERTIES = Object.freeze({
  id: { type: 'string', required: true, description: 'Stable note id, the handle kb_read/kb_save/kb_delete take.' },
  title: { type: 'string', required: true },
  tags: { type: 'array', items: { type: 'string' }, required: true },
  created: { type: 'string', required: true, description: 'ISO-8601 creation time.' },
  updated: { type: 'string', required: true, description: 'ISO-8601 last write time.' },
  chars: { type: 'integer', required: true, description: 'Body length in characters.' },
})

const TAG_FACET_SCHEMA = Object.freeze({
  type: 'array',
  required: true,
  description: 'Tag usage across the whole knowledge base, most used first.',
  items: {
    type: 'object',
    additionalProperties: false,
    properties: { tag: { type: 'string', required: true }, count: { type: 'integer', required: true } },
  },
})

/**
 * Project one store record into the summary shape shared by every tool.
 * @param {object} note - a store record.
 * @returns {object} the canonical summary.
 */
export function summaryOf(note) {
  return {
    id: note.id,
    title: note.title,
    tags: [...note.tags],
    created: note.created,
    updated: note.updated,
    chars: note.chars,
  }
}

/**
 * Read the calling session's identity, so a note remembers where it came from.
 * @param {object} [exec] - the tool execution context, when the caller has one.
 * @returns {{ source: string, workspace: string }} provenance fields.
 */
export function provenanceOf(exec) {
  const header = exec && exec.agent && exec.agent.session ? exec.agent.session.header : undefined
  const id = header && typeof header.id === 'string' ? header.id : ''
  const cwd = header && typeof header.cwd === 'string' ? header.cwd : ''
  return { source: id === '' ? '' : `session:${id}`, workspace: cwd }
}

/**
 * Cut text to a budget, reporting whether anything was dropped.
 * @param {string} text - the text to bound.
 * @param {number} maxChars - character budget.
 * @returns {{ text: string, truncated: boolean }} the bounded text.
 */
export function boundText(text, maxChars) {
  const value = String(text ?? '')
  if (!Number.isFinite(maxChars) || maxChars <= 0 || value.length <= maxChars) return { text: value, truncated: false }
  return { text: value.slice(0, Math.floor(maxChars)), truncated: true }
}

/**
 * One `text` content block, the only block kind these tools render.
 * @param {string} text - block text.
 * @returns {Array<{ type: 'text', text: string }>} the rendered content.
 */
function textBlocks(text) {
  return [{ type: 'text', text }]
}

/**
 * Format a tag list for human-facing lines.
 * @param {string[]} tags - the tags.
 * @returns {string} ` [a, b]` or an empty string.
 */
function tagSuffix(tags) {
  return tags.length === 0 ? '' : ` [${tags.join(', ')}]`
}

/**
 * Clamp an integer parameter into range.
 * @param {unknown} value - candidate value.
 * @param {number} fallback - value used when absent or unusable.
 * @param {number} min - lower bound.
 * @param {number} max - upper bound.
 * @returns {number} the clamped integer.
 */
function clampInteger(value, fallback, min, max) {
  const candidate = Number.isFinite(value) ? Math.floor(value) : fallback
  return Math.min(Math.max(candidate, min), max)
}

/**
 * Build the tool specs bound to one store.
 * @param {{ store: import('./kb-store.js').KnowledgeStore, searchLimit?: number, readChars?: number }} options - the bound store and defaults.
 * @returns {object[]} specs in `defineTool` option shape, ordered by {@link TOOL_NAMES}.
 */
export function buildToolSpecs(options) {
  const store = options.store
  const searchLimit = clampInteger(options.searchLimit, DEFAULT_SEARCH_LIMIT, 1, 100)
  const readChars = clampInteger(options.readChars, DEFAULT_READ_CHARS, 500, 200000)

  const save = {
    name: 'kb_save',
    description: [
      'Write one durable note into your own cross-session knowledge base (Markdown files that survive session end, compaction, and restarts).',
      'Save a finding the moment it is worth re-reading: a verified fact about this machine, repository, or profile; a pitfall and the fix that actually worked; a recipe you had to derive; a standing preference the user stated.',
      'Title the note as the question it answers, keep one topic per note, and tag it so a later search finds it.',
      'To extend or correct an existing note, pass its id (mode "append" adds a section, the default rewrites the body) instead of creating a near-duplicate.',
      'Never store credentials, tokens, or bulk file dumps: save the conclusion and where the rest lives.',
    ].join(' '),
    parameters: {
      title: {
        type: 'string',
        description: 'Short specific title, ideally the question the note answers. Required when creating; with id it renames the note.',
      },
      content: {
        type: 'string',
        description: 'Markdown body: the finding, why it matters, and the exact commands, paths, or snippets needed to reuse it. Required when creating.',
      },
      tags: {
        type: 'array',
        items: { type: 'string' },
        description: 'Retrieval handles, e.g. the project, the subsystem, and the kind of note ("pitfall", "recipe", "preference").',
      },
      id: {
        type: 'string',
        description: 'Existing note id to update. Omit to create a new note.',
      },
      mode: {
        type: 'string',
        enum: ['replace', 'append'],
        description: 'With id: replace (default) rewrites the body, append adds the new content as a further section.',
      },
      allowDuplicateTitle: {
        type: 'boolean',
        description: 'Create a second note even though one with the same title exists. The default refuses so one topic stays in one note.',
      },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          action: { type: 'string', enum: ['created', 'updated'], required: true },
          ...NOTE_SUMMARY_PROPERTIES,
          path: { type: 'string', required: true, description: 'Note file path relative to the knowledge base root.' },
          total: { type: 'integer', required: true, description: 'Notes in the knowledge base after this write.' },
        },
      },
      render(_args, value) {
        return textBlocks([
          `${value.action === 'created' ? 'Created' : 'Updated'} note ${value.id}`,
          `title: ${value.title}`,
          `tags: ${value.tags.length === 0 ? '(none)' : value.tags.join(', ')}`,
          `file: ${value.path} · ${value.chars} chars · updated ${value.updated}`,
          `The knowledge base now holds ${value.total} note${value.total === 1 ? '' : 's'}.`,
        ].join('\n'))
      },
    },
    timeoutMs: TOOL_TIMEOUT_MS,
    async execute(args, exec) {
      const provenance = provenanceOf(exec)
      const outcome = await store.save({
        id: args.id,
        title: args.title,
        content: args.content,
        tags: args.tags,
        mode: args.mode,
        allowDuplicateTitle: args.allowDuplicateTitle === true,
        source: provenance.source,
        workspace: provenance.workspace,
      })
      const stats = await store.stats()
      return {
        action: outcome.action,
        ...summaryOf(outcome.note),
        path: `notes/${outcome.note.file}`,
        total: stats.total,
      }
    },
  }

  const search = {
    name: 'kb_search',
    description: [
      'Search your cross-session knowledge base before re-deriving anything that could already be known: this repository\'s conventions, an environment quirk, a fix that previously took several attempts, a stated user preference.',
      'Ranking combines title, tag, and body matches with recency; Chinese queries match through character bigrams, so exact phrasing is not required.',
      'Results carry a snippet and an id — open the full note with kb_read when the snippet looks relevant.',
    ].join(' '),
    parameters: {
      query: {
        type: 'string',
        required: true,
        description: 'Words describing what you are trying to recall. Prefer a few distinctive terms over a sentence.',
      },
      tags: {
        type: 'array',
        items: { type: 'string' },
        description: 'Optional tag filter; a note must carry every listed tag.',
      },
      limit: {
        type: 'integer',
        description: `Maximum ranked notes to return (1-50). Defaults to ${searchLimit}.`,
      },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          query: { type: 'string', required: true },
          matched: { type: 'integer', required: true, description: 'Notes matching the query before the limit.' },
          searched: { type: 'integer', required: true, description: 'Notes in the knowledge base.' },
          results: {
            type: 'array',
            required: true,
            items: {
              type: 'object',
              additionalProperties: false,
              properties: {
                ...NOTE_SUMMARY_PROPERTIES,
                score: { type: 'number', required: true },
                snippet: { type: 'string', required: true },
              },
            },
          },
        },
      },
      render(_args, value) {
        if (value.searched === 0) {
          return textBlocks('The knowledge base is empty. Save the first durable finding with kb_save.')
        }
        if (value.results.length === 0) {
          return textBlocks(`No note matches "${value.query}" (${value.searched} searched). Try fewer or different terms, or browse with kb_list.`)
        }
        const lines = [`${value.matched} of ${value.searched} notes match "${value.query}"${value.matched > value.results.length ? `, showing ${value.results.length}` : ''}:`]
        value.results.forEach((entry, index) => {
          lines.push(`${index + 1}. ${entry.id} · ${entry.title}${tagSuffix(entry.tags)} · updated ${entry.updated.slice(0, 10)} · score ${entry.score}`)
          if (entry.snippet !== '') lines.push(`   ${entry.snippet}`)
        })
        lines.push('Open a note with kb_read.')
        return textBlocks(lines.join('\n'))
      },
    },
    timeoutMs: TOOL_TIMEOUT_MS,
    isConcurrencySafe() {
      return true
    },
    async execute(args) {
      const outcome = await store.search({
        query: args.query,
        tags: args.tags ?? [],
        limit: clampInteger(args.limit, searchLimit, 1, 50),
      })
      return {
        query: String(args.query),
        matched: outcome.matched,
        searched: outcome.total,
        results: outcome.results.map((entry) => ({
          ...summaryOf(entry.note),
          score: entry.score,
          snippet: entry.snippet,
        })),
      }
    },
  }

  const read = {
    name: 'kb_read',
    description: [
      'Open one or more knowledge base notes in full by id, as returned by kb_search or kb_list.',
      'Use it once a search snippet looks relevant: the body carries the commands, paths, and caveats the snippet had to cut.',
    ].join(' '),
    parameters: {
      id: { type: 'string', description: 'Note id to open.' },
      ids: {
        type: 'array',
        items: { type: 'string' },
        description: `Several note ids to open in one call (at most ${MAX_READ_NOTES}).`,
      },
      maxChars: {
        type: 'integer',
        description: `Per-note character budget before the body is cut (500-200000). Defaults to ${readChars}.`,
      },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          notes: {
            type: 'array',
            required: true,
            items: {
              type: 'object',
              additionalProperties: false,
              properties: {
                ...NOTE_SUMMARY_PROPERTIES,
                content: { type: 'string', required: true },
                truncated: { type: 'boolean', required: true },
                source: { type: 'string', required: true, description: 'Session that saved the note, when known.' },
                workspace: { type: 'string', required: true, description: 'Workspace the note was saved from, when known.' },
                path: { type: 'string', required: true },
              },
            },
          },
          missing: {
            type: 'array',
            required: true,
            items: { type: 'string' },
            description: 'Requested ids with no matching note.',
          },
        },
      },
      render(_args, value) {
        const blocks = []
        for (const note of value.notes) {
          blocks.push([
            `${note.id} · ${note.title}${tagSuffix(note.tags)}`,
            `created ${note.created} · updated ${note.updated} · ${note.chars} chars · ${note.path}`,
            '',
            note.content === '' ? '(empty note)' : note.content,
            note.truncated ? '… (body cut by maxChars; raise it or read the file directly)' : '',
          ].filter((line) => line !== '').join('\n'))
        }
        if (value.missing.length > 0) blocks.push(`No note exists for: ${value.missing.join(', ')} — run kb_list to see current ids.`)
        return textBlocks(blocks.length === 0 ? 'No note ids were requested.' : blocks.join('\n\n---\n\n'))
      },
    },
    timeoutMs: TOOL_TIMEOUT_MS,
    isConcurrencySafe() {
      return true
    },
    async execute(args) {
      const requested = []
      if (typeof args.id === 'string' && args.id.trim() !== '') requested.push(args.id.trim())
      for (const id of args.ids ?? []) {
        if (typeof id === 'string' && id.trim() !== '' && !requested.includes(id.trim())) requested.push(id.trim())
      }
      if (requested.length === 0) throw new Error('kb_read needs id or ids: run kb_search or kb_list to find note ids')
      if (requested.length > MAX_READ_NOTES) {
        throw new Error(`kb_read opens at most ${MAX_READ_NOTES} notes per call; ${requested.length} were requested`)
      }
      const budget = clampInteger(args.maxChars, readChars, 500, 200000)
      await store.sync()
      const notes = []
      const missing = []
      for (const id of requested) {
        const note = store.get(id)
        if (note === null) {
          missing.push(id)
          continue
        }
        const bounded = boundText(note.body, budget)
        notes.push({
          ...summaryOf(note),
          content: bounded.text,
          truncated: bounded.truncated,
          source: note.source,
          workspace: note.workspace,
          path: `notes/${note.file}`,
        })
      }
      return { notes, missing }
    },
  }

  const list = {
    name: 'kb_list',
    description: [
      'Browse the knowledge base: one page of note summaries plus the tag counts of the whole base.',
      'Use it to see what you already know before saving something new, to pick a tag for a follow-up search, or to find the id of a note that needs updating.',
    ].join(' '),
    parameters: {
      tag: { type: 'string', description: 'Only notes carrying this tag (case-insensitive).' },
      limit: { type: 'integer', description: `Summaries per page (1-${MAX_LIST_LIMIT}). Defaults to ${DEFAULT_LIST_LIMIT}.` },
      offset: { type: 'integer', description: 'Summaries to skip, for paging.' },
      sort: { type: 'string', enum: ['updated', 'created', 'title'], description: 'Sort key. Defaults to updated.' },
      order: { type: 'string', enum: ['desc', 'asc'], description: 'Sort direction. Defaults to desc.' },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          total: { type: 'integer', required: true, description: 'Notes matching the filter.' },
          offset: { type: 'integer', required: true },
          notes: {
            type: 'array',
            required: true,
            items: {
              type: 'object',
              additionalProperties: false,
              properties: { ...NOTE_SUMMARY_PROPERTIES, preview: { type: 'string', required: true } },
            },
          },
          tags: TAG_FACET_SCHEMA,
          root: { type: 'string', required: true, description: 'Where the notes live on disk.' },
        },
      },
      render(args, value) {
        if (value.total === 0) {
          return textBlocks(args.tag === undefined || args.tag === ''
            ? `The knowledge base at ${value.root} is empty. Save the first durable finding with kb_save.`
            : `No note carries the tag "${args.tag}". Known tags: ${value.tags.length === 0 ? '(none)' : value.tags.map((entry) => `${entry.tag} (${entry.count})`).join(', ')}.`)
        }
        const last = value.offset + value.notes.length
        const lines = [`${value.total} note${value.total === 1 ? '' : 's'}${args.tag ? ` tagged "${args.tag}"` : ''}, showing ${value.offset + 1}-${last} sorted by ${args.sort ?? 'updated'} ${args.order ?? 'desc'}:`]
        for (const note of value.notes) {
          lines.push(`- ${note.id} · ${note.title}${tagSuffix(note.tags)} · ${note.updated.slice(0, 10)} · ${note.chars} chars`)
          if (note.preview !== '') lines.push(`  ${note.preview}`)
        }
        if (last < value.total) lines.push(`(${value.total - last} more; call kb_list with offset ${last}.)`)
        if (value.tags.length > 0) lines.push(`tags: ${value.tags.map((entry) => `${entry.tag} (${entry.count})`).join(', ')}`)
        return textBlocks(lines.join('\n'))
      },
    },
    timeoutMs: TOOL_TIMEOUT_MS,
    isConcurrencySafe() {
      return true
    },
    async execute(args) {
      const page = await store.list({
        tag: args.tag,
        limit: clampInteger(args.limit, DEFAULT_LIST_LIMIT, 1, MAX_LIST_LIMIT),
        offset: clampInteger(args.offset, 0, 0, Number.MAX_SAFE_INTEGER),
        sort: args.sort,
        order: args.order,
      })
      return {
        total: page.total,
        offset: page.offset,
        notes: page.notes.map((note) => ({ ...summaryOf(note), preview: firstLine(note.body) })),
        tags: page.tags.map((entry) => ({ tag: entry.tag, count: entry.count })),
        root: store.displayRoot,
      }
    },
  }

  const importDoc = {
    name: 'kb_import',
    description: [
      'Feed one whole text document from the workspace into the knowledge base without manual note-writing.',
      'The document is split into focused notes on Markdown headings (or paragraph boundaries when it has none); each note gets a derived title, the tags "import" and the document slug, plus any tags you pass.',
      'Every note is stamped with a stable origin, so re-feeding the same file updates those notes instead of creating duplicates.',
      'Refuses binary containers (' + IMPORT_EXTENSIONS.split(' ').map((ext) => ext.slice(1)).filter((ext) => !['md', 'markdown', 'txt'].includes(ext)).join(', ') + ' are fine; .pdf/.docx/.zip etc. are not).',
      'Run it with dryRun true to see the split plan before writing anything.',
    ].join(' '),
    parameters: {
      path: {
        type: 'string',
        required: true,
        description: 'Workspace-relative or absolute path of the text document to import (' + IMPORT_EXTENSIONS.trim() + ').',
      },
      tags: {
        type: 'array',
        items: { type: 'string' },
        description: 'Extra tags added to every note from this document, e.g. the project name.',
      },
      dryRun: {
        type: 'boolean',
        description: 'Show the split plan (titles and which notes would be updated) without writing. Defaults to false.',
      },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          dryRun: { type: 'boolean', required: true },
          file: { type: 'string', required: true, description: 'The imported file path.' },
          encoding: { type: 'string', required: true, description: 'The detected source encoding the file was decoded from (e.g. utf-8, gb18030).' },
          docTitle: { type: 'string', required: true, description: 'The document title derived from its top-level heading or file name.' },
          docSlug: { type: 'string', required: true, description: 'The tag grouping every note from this document.' },
          counts: {
            type: 'object',
            additionalProperties: false,
            required: true,
            properties: {
              created: { type: 'integer', required: true },
              updated: { type: 'integer', required: true },
              stale: { type: 'integer', required: true, description: 'Notes left over from a previous import whose sections no longer exist.' },
            },
          },
          notes: {
            type: 'array',
            required: true,
            description: 'One entry per note written (empty in a dry run).',
            items: {
              type: 'object',
              additionalProperties: false,
              properties: {
                id: { type: 'string', required: true },
                title: { type: 'string', required: true },
                chars: { type: 'integer', required: true },
                origin: { type: 'string', required: true },
              },
            },
          },
          plan: {
            type: 'array',
            required: true,
            description: 'The split plan: one entry per section the document was cut into.',
            items: {
              type: 'object',
              additionalProperties: false,
              properties: {
                origin: { type: 'string', required: true },
                title: { type: 'string', required: true },
                chars: { type: 'integer', required: true },
                part: { type: 'integer', required: true },
                parts: { type: 'integer', required: true },
                update: { type: 'boolean', required: true, description: 'Whether this section already has a note (a re-import updates it).' },
              },
            },
          },
          stale: {
            type: 'array',
            required: true,
            description: 'Notes from a previous import of this document whose sections no longer exist; consider kb_delete for each.',
            items: {
              type: 'object',
              additionalProperties: false,
              properties: {
                id: { type: 'string', required: true },
                title: { type: 'string', required: true },
                origin: { type: 'string', required: true },
              },
            },
          },
        },
      },
      render(_args, value) {
        const lines = []
        if (value.dryRun) {
          lines.push('Dry run: ' + value.file + ' would split into ' + value.plan.length + ' note' + (value.plan.length === 1 ? '' : 's') + ' (' + value.docTitle + '):')
        } else {
          const count = value.counts
          const enc = value.encoding && value.encoding !== 'utf-8' ? ' [decoded from ' + value.encoding + ']' : ''
          lines.push('Imported ' + value.file + enc + ' (' + value.docTitle + '): ' + count.created + ' created, ' + count.updated + ' updated.')
          if (count.stale > 0) lines.push(count.stale + ' note' + (count.stale === 1 ? '' : 's') + ' from a previous import no longer have a section in this file (see below).')
        }
        value.plan.forEach((entry, index) => {
          const verb = entry.update ? 'update' : 'new'
          const parts = entry.parts > 1 ? ' · part ' + entry.part + '/' + entry.parts : ''
          lines.push((index + 1) + '. [' + verb + '] ' + entry.title + parts + ' (' + entry.chars + ' chars)')
        })
        for (const note of value.notes) lines.push('   → ' + note.id + ' · ' + note.title)
        for (const stale of value.stale) lines.push('   stale: ' + stale.id + ' · ' + stale.title + ' — kb_delete it if it no longer matters')
        lines.push('Filter all these notes with kb_list tag "' + value.docSlug + '" or kb_search tags ["' + value.docSlug + '"].')
        return textBlocks(lines.join('\n'))
      },
    },
    timeoutMs: 60000,
    async execute(args, exec) {
      const header = exec && exec.agent && exec.agent.session ? exec.agent.session.header : undefined
      const cwd = header && typeof header.cwd === 'string' ? header.cwd : ''
      const requested = String(args.path ?? '').trim()
      if (requested === '') throw new Error('kb_import needs a file path')
      const file = isAbsolute(requested) ? requested : resolve(cwd === '' ? process.cwd() : cwd, requested)
      let info
      try {
        info = await stat(file)
      } catch (error) {
        if (error && error.code === 'ENOENT') throw new Error('kb_import cannot find "' + requested + '": run a directory listing first and re-check the path')
        throw error
      }
      if (!info.isFile()) throw new Error('kb_import needs a file, "' + requested + '" is a directory')
      if (info.size > IMPORT_READ_LIMIT) {
        throw new Error('kb_import refuses "' + requested + '": ' + info.size + ' bytes is over the ' + IMPORT_READ_LIMIT + ' byte read limit')
      }
      // Read raw bytes and detect the encoding: novel .txt files are routinely
      // GBK/GB18030, which a plain utf8 read would turn into mojibake.
      const decoded = detectAndDecode(await readFile(file))
      const outcome = await store.importDocument({
        name: file,
        text: decoded.text,
        tags: args.tags ?? [],
        source: provenanceOf(exec).source || 'import:' + file,
        workspace: provenanceOf(exec).workspace,
        dryRun: args.dryRun === true,
      })
      return {
        dryRun: args.dryRun === true,
        file,
        encoding: decoded.encoding,
        docTitle: outcome.plan.docTitle,
        docSlug: outcome.plan.docSlug,
        counts: outcome.counts,
        notes: outcome.notes ?? [],
        plan: outcome.plan.drafts,
        stale: outcome.stale ?? [],
      }
    },
  }

  const remove = {
    name: 'kb_delete',
    description: [
      'Retire a knowledge base note that became wrong or obsolete.',
      'The note moves to the knowledge base trash directory by default, so a mistaken deletion stays recoverable; pass hard true only when the content must not persist.',
      'Prefer kb_save with the note id when the finding merely changed — history in one note beats a deletion plus a new note.',
    ].join(' '),
    parameters: {
      id: { type: 'string', required: true, description: 'Id of the note to retire.' },
      hard: { type: 'boolean', description: 'Delete the file instead of moving it to the trash directory. Defaults to false.' },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          id: { type: 'string', required: true },
          title: { type: 'string', required: true },
          mode: { type: 'string', enum: ['trash', 'permanent'], required: true },
          path: { type: 'string', required: true, description: 'Trash file path, empty for a permanent delete.' },
          total: { type: 'integer', required: true, description: 'Notes remaining.' },
        },
      },
      render(_args, value) {
        const where = value.mode === 'trash' && value.path !== '' ? ` It is recoverable at ${value.path}.` : ''
        return textBlocks(`${value.mode === 'trash' ? 'Moved' : 'Permanently deleted'} note ${value.id} "${value.title}".${where} ${value.total} note${value.total === 1 ? '' : 's'} remain.`)
      },
    },
    timeoutMs: TOOL_TIMEOUT_MS,
    async execute(args) {
      const outcome = await store.remove(args.id, { hard: args.hard === true })
      const stats = await store.stats()
      return {
        id: outcome.note.id,
        title: outcome.note.title,
        mode: outcome.mode,
        path: outcome.path === '' ? '' : `.trash/${outcome.path.split(/[\\/]/).pop()}`,
        total: stats.total,
      }
    },
  }

  return [save, search, read, list, remove, importDoc]
}
