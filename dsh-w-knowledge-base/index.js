/**
 * dsh-w-knowledge-base — Host half.
 *
 * Contributes, from one loader row:
 *   1. five agent tools (kb_save / kb_search / kb_read / kb_list / kb_delete)
 *      over a durable Markdown knowledge base under the Harness home;
 *   2. a prompt section teaching the protocol, plus a compact live index of the
 *      notes injected as runtime context, so the agent knows what it remembers
 *      without spending a tool call to find out;
 *   3. a Typert Remote service ("knowledgeBase") that backs the browser panel.
 *
 * The store itself lives in ./kb-store.js and the tool surface in ./kb-tools.js;
 * both are host-free so they stay unit-testable.
 */

import { mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { mkdir, rename, stat } from 'node:fs/promises'
import { join, resolve, sep } from 'node:path'
import Schema from '@deepseek-ai/schemastery'
import { Remote, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
import { defineTool } from '@deepseek-ai/dsh-tools'
import { dshHomePath, expandHomePath, resolveDshHome } from '@deepseek-ai/dsh-home-paths'
import { KnowledgeStore } from './kb-store.js'
import { buildToolSpecs, summaryOf } from './kb-tools.js'
import { firstLine } from './kb-format.js'
import {
  CORPORA_FILE,
  DEFAULT_CORPUS_ID,
  addCorpus,
  findCorpus,
  normalizeRegistry,
  normalizeScopeRequest,
  removeCorpus,
  setActiveCorpus,
  updateCorpus,
} from './kb-corpora.js'
import {
  BANNED_CONTEXT_ORDER,
  BANNED_FILE,
  DEFAULT_BANNED_PHRASES,
  bannedPromptText,
  formatBannedList,
  normalizeMode,
  parseBannedList,
  styleIndexText,
  writingGuidanceText,
} from './kb-writing.js'

// Node 22 does not enable stage-3 decorator syntax, so the two tsdown helpers
// that the Remote decorator compiles to are inlined here (the same shape the
// first-party packages ship in their build output).
var __runInitializers = function (thisArg, initializers, value) {
  var useValue = arguments.length > 2
  for (var i = 0; i < initializers.length; i++) {
    value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg)
  }
  return useValue ? value : void 0
}

var __esDecorate = function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) {
    if (f !== void 0 && typeof f !== 'function') throw new TypeError('Function expected')
    return f
  }
  var kind = contextIn.kind
  var key = kind === 'getter' ? 'get' : kind === 'setter' ? 'set' : 'value'
  var target = !descriptorIn && ctor ? contextIn.static ? ctor : ctor.prototype : null
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {})
  var _, done = false
  for (var i = decorators.length - 1; i >= 0; i--) {
    var context = {}
    for (var p in contextIn) context[p] = p === 'access' ? {} : contextIn[p]
    for (var p in contextIn.access) context.access[p] = contextIn.access[p]
    context.addInitializer = function (f) {
      if (done) throw new TypeError('Cannot add initializers after decoration has completed')
      extraInitializers.push(accept(f || null))
    }
    var result = decorators[i](kind === 'accessor' ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context)
    if (kind === 'accessor') {
      if (result === void 0) continue
      if (result === null || typeof result !== 'object') throw new TypeError('Object expected')
      if (_ = accept(result.get)) descriptor.get = _
      if (_ = accept(result.set)) descriptor.set = _
      if (_ = accept(result.init)) initializers.unshift(_)
    } else if (_ = accept(result)) {
      if (kind === 'field') initializers.unshift(_)
      else descriptor[key] = _
    }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor)
  done = true
}

/** Directory created under the Harness home when no explicit root is configured. */
export const DEFAULT_ROOT_DIR = 'knowledge-base'
/** Sub-directory holding the writing-mode style corpus, kept apart from the assistant notes. */
export const WRITING_SUBDIR = 'style-corpus'
/** Control file under the knowledge base root that persists the active mode. */
export const MODE_FILE = 'mode.json'
/** Prompt section order: inside the 100-199 band reserved for tool guidance. */
export const GUIDANCE_ORDER = 150
/** Runtime-context order: after the harness-owned facts, since this is an index, not a rule. */
export const INDEX_CONTEXT_ORDER = 500
/** Upper bound for one browser panel page. */
export const MAX_PANEL_LIMIT = 200
/** Default page size served to the browser panel. */
export const DEFAULT_PANEL_LIMIT = 50

/**
 * Resolve the knowledge base root and a display spelling that never leaks a
 * home directory into every prompt.
 * @param {string} configured - the configured root, possibly empty or "~"-prefixed.
 * @returns {{ root: string, displayRoot: string }} the resolved location.
 */
export function resolveRoot(configured) {
  const requested = typeof configured === 'string' ? configured.trim() : ''
  const root = requested === '' ? dshHomePath(DEFAULT_ROOT_DIR) : resolve(expandHomePath(requested))
  const home = resolveDshHome()
  const inside = root === home || root.startsWith(home + sep)
  const displayRoot = inside
    ? '$DSH_HOME' + root.slice(home.length).split(sep).join('/')
    : root.split(sep).join('/')
  return { root, displayRoot }
}

/**
 * The prompt section that teaches the protocol. Written for the model that will
 * read it on every turn: what the base is for, when to search, when to save.
 * @param {string} displayRoot - user-facing knowledge base location.
 * @returns {string} the section text.
 */
export function guidanceText(displayRoot) {
  const tools = '`kb_search`, `kb_read`, `kb_save`, `kb_list`, and `kb_delete`'
  return [
    '# Knowledge base',
    '',
    'You own a durable knowledge base of Markdown notes at ' + displayRoot + ', reached through ' + tools + '.'
      + ' It outlives this session, compaction, and restarts: it is the only memory that carries facts from one session'
      + ' to the next, so treat it as your own long-term notes rather than a user-facing artifact.',
    '',
    "- Search it before re-deriving anything that could already be known: this repository's conventions, an environment"
      + ' quirk, a command that only worked one specific way, a preference the user already stated.',
    '- Save as soon as a finding becomes reusable, while it is still verified: title the note as the question it answers,'
      + ' keep one topic per note, tag it for retrieval, and record the exact paths and commands a future session needs.',
    '- Correct and extend rather than duplicate: pass the existing note id to `kb_save` (mode "append" adds a section),'
      + ' and retire a note that became wrong with `kb_delete`.',
    '- Never store credentials, tokens, or bulk file dumps; store the conclusion and where the rest lives. Cite the note'
      + ' id when a claim in your answer comes from the knowledge base.',
  ].join('\n')
}

/** Host plugin config; override per row in a profile cordis.patch.yml. */
export const Config = Schema.object({
  root: Schema.string().default(''),
  maxNoteChars: Schema.number().default(60000),
  importTargetChars: Schema.number().default(6000),
  importMaxChars: Schema.number().default(10000000),
  searchLimit: Schema.number().default(8),
  readChars: Schema.number().default(20000),
  syncIntervalMs: Schema.number().default(1500),
  promptGuidance: Schema.boolean().default(true),
  promptIndex: Schema.boolean().default(true),
  promptIndexNotes: Schema.number().default(24),
  promptIndexChars: Schema.number().default(2400),
})

let KnowledgeBaseService = (() => {
  let _classSuper = TypertRemoteService
  let _instanceExtraInitializers = []
  let _listNotes_decorators
  let _readNote_decorators
  let _saveNote_decorators
  let _deleteNote_decorators
  let _importDocument_decorators
  let _getStats_decorators
  let _getMode_decorators
  let _setMode_decorators
  let _getBanned_decorators
  let _setBanned_decorators
  let _listCorpora_decorators
  let _createCorpus_decorators
  let _updateCorpus_decorators
  let _deleteCorpus_decorators
  let _setActiveCorpus_decorators
  let _moveNotes_decorators
  return class KnowledgeBaseService extends _classSuper {
    static {
      const _metadata = typeof Symbol === 'function' && Symbol.metadata
        ? Object.create(_classSuper[Symbol.metadata] ?? null)
        : void 0
      _listNotes_decorators = [Remote('listNotes')]
      __esDecorate(this, null, _listNotes_decorators, {
        kind: 'method', name: 'listNotes', static: false, private: false,
        access: { has: obj => 'listNotes' in obj, get: obj => obj.listNotes },
        metadata: _metadata,
      }, null, _instanceExtraInitializers)
      _readNote_decorators = [Remote('readNote')]
      __esDecorate(this, null, _readNote_decorators, {
        kind: 'method', name: 'readNote', static: false, private: false,
        access: { has: obj => 'readNote' in obj, get: obj => obj.readNote },
        metadata: _metadata,
      }, null, _instanceExtraInitializers)
      _saveNote_decorators = [Remote('saveNote')]
      __esDecorate(this, null, _saveNote_decorators, {
        kind: 'method', name: 'saveNote', static: false, private: false,
        access: { has: obj => 'saveNote' in obj, get: obj => obj.saveNote },
        metadata: _metadata,
      }, null, _instanceExtraInitializers)
      _deleteNote_decorators = [Remote('deleteNote')]
      __esDecorate(this, null, _deleteNote_decorators, {
        kind: 'method', name: 'deleteNote', static: false, private: false,
        access: { has: obj => 'deleteNote' in obj, get: obj => obj.deleteNote },
        metadata: _metadata,
      }, null, _instanceExtraInitializers)
      _importDocument_decorators = [Remote('importDocument')]
      __esDecorate(this, null, _importDocument_decorators, {
        kind: 'method', name: 'importDocument', static: false, private: false,
        access: { has: obj => 'importDocument' in obj, get: obj => obj.importDocument },
        metadata: _metadata,
      }, null, _instanceExtraInitializers)
      _getStats_decorators = [Remote('getStats')]
      __esDecorate(this, null, _getStats_decorators, {
        kind: 'method', name: 'getStats', static: false, private: false,
        access: { has: obj => 'getStats' in obj, get: obj => obj.getStats },
        metadata: _metadata,
      }, null, _instanceExtraInitializers)
      _getMode_decorators = [Remote('getMode')]
      __esDecorate(this, null, _getMode_decorators, {
        kind: 'method', name: 'getMode', static: false, private: false,
        access: { has: obj => 'getMode' in obj, get: obj => obj.getMode },
        metadata: _metadata,
      }, null, _instanceExtraInitializers)
      _setMode_decorators = [Remote('setMode')]
      __esDecorate(this, null, _setMode_decorators, {
        kind: 'method', name: 'setMode', static: false, private: false,
        access: { has: obj => 'setMode' in obj, get: obj => obj.setMode },
        metadata: _metadata,
      }, null, _instanceExtraInitializers)
      _getBanned_decorators = [Remote('getBanned')]
      __esDecorate(this, null, _getBanned_decorators, {
        kind: 'method', name: 'getBanned', static: false, private: false,
        access: { has: obj => 'getBanned' in obj, get: obj => obj.getBanned },
        metadata: _metadata,
      }, null, _instanceExtraInitializers)
      _setBanned_decorators = [Remote('setBanned')]
      __esDecorate(this, null, _setBanned_decorators, {
        kind: 'method', name: 'setBanned', static: false, private: false,
        access: { has: obj => 'setBanned' in obj, get: obj => obj.setBanned },
        metadata: _metadata,
      }, null, _instanceExtraInitializers)
      _listCorpora_decorators = [Remote('listCorpora')]
      __esDecorate(this, null, _listCorpora_decorators, {
        kind: 'method', name: 'listCorpora', static: false, private: false,
        access: { has: obj => 'listCorpora' in obj, get: obj => obj.listCorpora },
        metadata: _metadata,
      }, null, _instanceExtraInitializers)
      _createCorpus_decorators = [Remote('createCorpus')]
      __esDecorate(this, null, _createCorpus_decorators, {
        kind: 'method', name: 'createCorpus', static: false, private: false,
        access: { has: obj => 'createCorpus' in obj, get: obj => obj.createCorpus },
        metadata: _metadata,
      }, null, _instanceExtraInitializers)
      _updateCorpus_decorators = [Remote('updateCorpus')]
      __esDecorate(this, null, _updateCorpus_decorators, {
        kind: 'method', name: 'updateCorpus', static: false, private: false,
        access: { has: obj => 'updateCorpus' in obj, get: obj => obj.updateCorpus },
        metadata: _metadata,
      }, null, _instanceExtraInitializers)
      _deleteCorpus_decorators = [Remote('deleteCorpus')]
      __esDecorate(this, null, _deleteCorpus_decorators, {
        kind: 'method', name: 'deleteCorpus', static: false, private: false,
        access: { has: obj => 'deleteCorpus' in obj, get: obj => obj.deleteCorpus },
        metadata: _metadata,
      }, null, _instanceExtraInitializers)
      _setActiveCorpus_decorators = [Remote('setActiveCorpus')]
      __esDecorate(this, null, _setActiveCorpus_decorators, {
        kind: 'method', name: 'setActiveCorpus', static: false, private: false,
        access: { has: obj => 'setActiveCorpus' in obj, get: obj => obj.setActiveCorpus },
        metadata: _metadata,
      }, null, _instanceExtraInitializers)
      _moveNotes_decorators = [Remote('moveNotes')]
      __esDecorate(this, null, _moveNotes_decorators, {
        kind: 'method', name: 'moveNotes', static: false, private: false,
        access: { has: obj => 'moveNotes' in obj, get: obj => obj.moveNotes },
        metadata: _metadata,
      }, null, _instanceExtraInitializers)
      if (_metadata) {
        Object.defineProperty(this, Symbol.metadata, {
          enumerable: true,
          configurable: true,
          writable: true,
          value: _metadata,
        })
      }
    }

    static inject = ['tools']

    static Config = Config

    /**
     * @param {import('@deepseek-ai/cordis').Context} ctx - the plugin context.
     * @param {object} config - validated plugin config.
     */
    constructor(ctx, config) {
      super(ctx, 'knowledgeBase')
      __runInitializers(this, _instanceExtraInitializers)
      const settings = config ?? {}
      const location = resolveRoot(settings.root)
      this.settings = settings
      this.location = location
      const storeConfig = this.storeConfig = {
        maxNoteChars: settings.maxNoteChars,
        importTargetChars: settings.importTargetChars,
        maxDocChars: settings.importMaxChars,
        syncIntervalMs: settings.syncIntervalMs,
      }
      // Assistant mode: the original durable-memory notes, untouched.
      this.assistantStore = new KnowledgeStore({ ...storeConfig, root: location.root, displayRoot: location.displayRoot })
      // Writing mode: isolated style corpora, each a directory of its own under
      // the root (the original <root>/style-corpus is the "default" corpus), so
      // reference novels never mix with the agent's notes or with each other.
      this.corporaPath = join(location.root, CORPORA_FILE)
      this.registry = this._readRegistry()
      this.corpusStores = new Map()
      // Other plugins (novel writing) may bind a conversation to one corpus.
      this.scopeResolvers = new Set()
      this.modePath = join(location.root, MODE_FILE)
      this.mode = this._readMode()
      // A single proxy the tools and panel bind to: every property read and
      // method call forwards to whichever store the current mode selects, so a
      // one-click mode switch retargets the whole surface without re-registering.
      this.store = new Proxy(Object.create(null), {
        get: (_target, prop) => {
          const active = this.activeStore()
          const value = active[prop]
          return typeof value === 'function' ? value.bind(active) : value
        },
      })
      // Warm both snapshots; a missing root is just an empty collection.
      this.assistantStore.sync({ force: true }).catch((error) => this.report('initial sync failed', error))
      this.corpusStore(this.registry.active).sync({ force: true }).catch(() => {})
      for (const spec of buildToolSpecs({
        storeFor: (exec) => this.storeForScope(this.scopeFor(exec && exec.agent)),
        searchLimit: settings.searchLimit,
        readChars: settings.readChars,
      })) {
        // register() is itself a Cordis effect on this context: the tools
        // disappear the moment this row is disabled or reloaded.
        this.ctx.tools.register(defineTool(spec))
      }
      // The prompt integration is optional: a composition without a system
      // prompt registry still gets the tools and the panel. Every section's
      // text() reads the live mode, so a switch takes effect the next turn.
      this.ctx.inject(['systemPrompt'], (scope) => {
        if (settings.promptGuidance !== false) {
          scope.systemPrompt.section({ name: 'dsh-w-knowledge-base:guidance', order: GUIDANCE_ORDER, text: (context) => this.guidanceTextForMode(context && context.agent) })
        }
        if (settings.promptIndex !== false) {
          scope.systemPrompt.context({ name: 'dsh-w-knowledge-base:index', order: INDEX_CONTEXT_ORDER, text: (context) => this.indexText(context && context.agent) })
          scope.systemPrompt.context({ name: 'dsh-w-knowledge-base:banned', order: BANNED_CONTEXT_ORDER, text: (context) => this.bannedText(context && context.agent) })
        }
      })
    }

    /** @returns {KnowledgeStore} the store the panel and unbound conversations use. */
    activeStore() {
      return this.mode === 'writing' ? this.corpusStore(this.registry.active) : this.assistantStore
    }

    /** The store for one corpus id, created on first use. */
    corpusStore(corpusId) {
      const entry = findCorpus(this.registry, corpusId) || findCorpus(this.registry, this.registry.active)
      let store = this.corpusStores.get(entry.id)
      if (!store) {
        store = new KnowledgeStore({
          ...this.storeConfig,
          root: join(this.location.root, entry.dir),
          displayRoot: this.location.displayRoot + '/' + entry.dir,
        })
        this.corpusStores.set(entry.id, store)
      }
      return store
    }

    _readRegistry() {
      try {
        return normalizeRegistry(JSON.parse(readFileSync(this.corporaPath, 'utf8')))
      } catch (error) {
        if (!error || error.code !== 'ENOENT') this.report('corpus registry read failed', error)
        return normalizeRegistry(null)
      }
    }

    _writeRegistry(next) {
      mkdirSync(this.location.root, { recursive: true })
      const temporary = this.corporaPath + '.tmp'
      writeFileSync(temporary, JSON.stringify(next, null, 2) + '\n', 'utf8')
      renameSync(temporary, this.corporaPath)
      this.registry = next
    }

    /**
     * Let another plugin decide, per conversation, whether it writes and with
     * which corpus. The resolver receives the agent and returns null (no
     * opinion), { writing: false }, or { corpusId }. Returns a disposer.
     * @param {(agent: object) => unknown} resolver - the scope resolver.
     * @returns {() => void} unregisters the resolver.
     */
    registerScopeResolver(resolver) {
      if (typeof resolver !== 'function') throw new TypeError('resolver must be a function')
      this.scopeResolvers.add(resolver)
      return () => { this.scopeResolvers.delete(resolver) }
    }

    /**
     * Where one conversation reads and writes: a bound conversation follows its
     * binding, everything else follows the panel's mode and default corpus.
     * @param {object} [agent] - the conversation's agent, when known.
     * @returns {{ mode: 'assistant' | 'writing', corpus: object | null, bound: boolean }} the scope.
     */
    scopeFor(agent) {
      if (agent) {
        for (const resolver of this.scopeResolvers) {
          let request = null
          try {
            request = normalizeScopeRequest(resolver(agent))
          } catch (error) {
            this.report('scope resolver failed', error)
          }
          if (!request) continue
          if (!request.writing) return { mode: 'assistant', corpus: null, bound: true }
          const corpus = (request.corpusId && findCorpus(this.registry, request.corpusId)) || findCorpus(this.registry, this.registry.active)
          return { mode: 'writing', corpus, bound: true }
        }
      }
      return this.mode === 'writing'
        ? { mode: 'writing', corpus: findCorpus(this.registry, this.registry.active), bound: false }
        : { mode: 'assistant', corpus: null, bound: false }
    }

    storeForScope(scope) {
      return scope.mode === 'writing' ? this.corpusStore(scope.corpus.id) : this.assistantStore
    }

    bannedPathFor(corpusId) {
      const entry = findCorpus(this.registry, corpusId) || findCorpus(this.registry, this.registry.active)
      return join(this.location.root, entry.dir, BANNED_FILE)
    }

    /**
     * Read the persisted mode from the control file, defaulting to assistant.
     * @returns {'assistant' | 'writing'} the active mode.
     */
    _readMode() {
      try {
        const parsed = JSON.parse(readFileSync(this.modePath, 'utf8'))
        return normalizeMode(parsed && parsed.mode)
      } catch {
        return 'assistant'
      }
    }

    /**
     * One corpus's banned-phrase list: the user's file when present, otherwise
     * the shipped defaults so writing mode is useful out of the box.
     * @param {string} corpusId - the corpus.
     * @returns {string[]} the phrases to avoid.
     */
    bannedPhrases(corpusId) {
      try {
        return parseBannedList(readFileSync(this.bannedPathFor(corpusId), 'utf8'))
      } catch (error) {
        if (error && error.code === 'ENOENT') return [...DEFAULT_BANNED_PHRASES]
        this.report('banned list read failed', error)
        return [...DEFAULT_BANNED_PHRASES]
      }
    }

    /**
     * The guidance section for one conversation's scope.
     * @param {object} [agent] - the conversation's agent.
     * @returns {string} the section text.
     */
    guidanceTextForMode(agent) {
      const scope = this.scopeFor(agent)
      if (scope.mode === 'writing') {
        const store = this.corpusStore(scope.corpus.id)
        return writingGuidanceText(store.displayRoot, this.bannedPhrases(scope.corpus.id).length > 0, scope.corpus.name)
      }
      return guidanceText(this.location.displayRoot)
    }

    /**
     * The banned-phrase runtime context, injected in writing mode only.
     * @param {object} [agent] - the conversation's agent.
     * @returns {string} the injected text, empty outside writing mode.
     */
    bannedText(agent) {
      const scope = this.scopeFor(agent)
      return scope.mode === 'writing' ? bannedPromptText(this.bannedPhrases(scope.corpus.id)) : ''
    }

    /**
     * Render the live index for one prompt assembly. Assembly is synchronous, so
     * this serves the current snapshot and schedules a revalidation for the next
     * turn — notes edited on disk surface without a restart.
     * @param {object} [agent] - the conversation's agent.
     * @returns {string} the index text.
     */
    indexText(agent) {
      const scope = this.scopeFor(agent)
      const store = this.storeForScope(scope)
      store.sync().catch((error) => this.report('index sync failed', error))
      if (scope.mode === 'writing') {
        return styleIndexText(store.displayRoot, store.notes().length, store.tagFacet(), this.settings.promptIndexNotes, scope.corpus.name)
      }
      return store.indexSnapshot({ maxNotes: this.settings.promptIndexNotes, maxChars: this.settings.promptIndexChars })
    }

    /**
     * Report a contained background failure without taking the row down.
     * @param {string} what - short description of the failed step.
     * @param {unknown} error - the failure.
     * @returns {void}
     */
    report(what, error) {
      const message = error && error.message ? error.message : String(error)
      if (typeof this.ctx.logger === 'function') this.ctx.logger('dsh-w-knowledge-base').warn(what + ': ' + message)
      else console.warn('dsh-w-knowledge-base: ' + what + ': ' + message)
    }

    /**
     * Panel query: ranked search when a query is given, otherwise the most
     * recently updated notes.
     * @param {unknown} query - free-text query, or an empty value to browse.
     * @param {unknown} tag - optional tag filter.
     * @param {unknown} limit - page size.
     * @returns {Promise<object>} notes, totals, and the tag facet.
     */
    async listNotes(query, tag, limit) {
      const text = typeof query === 'string' ? query.trim() : ''
      const tagFilter = typeof tag === 'string' ? tag.trim() : ''
      const size = Number.isFinite(limit) && limit > 0
        ? Math.min(Math.floor(limit), MAX_PANEL_LIMIT)
        : DEFAULT_PANEL_LIMIT
      const stats = await this.store.stats()
      if (text === '') {
        const page = await this.store.list({ tag: tagFilter, limit: size })
        return {
          query: '',
          tag: tagFilter,
          total: page.total,
          notes: page.notes.map((note) => ({ ...summaryOf(note), preview: firstLine(note.body, 160), score: 0 })),
          tags: page.tags,
          root: this.store.displayRoot,
          warnings: stats.warnings,
        }
      }
      const outcome = await this.store.search({
        query: text,
        tags: tagFilter === '' ? [] : [tagFilter],
        limit: size,
      })
      return {
        query: text,
        tag: tagFilter,
        total: outcome.matched,
        notes: outcome.results.map((entry) => ({
          ...summaryOf(entry.note),
          preview: entry.snippet === '' ? firstLine(entry.note.body, 160) : entry.snippet,
          score: entry.score,
        })),
        tags: stats.tags,
        root: this.store.displayRoot,
        warnings: stats.warnings,
      }
    }

    /**
     * Open one note in full for the panel.
     * @param {unknown} id - the note id.
     * @returns {Promise<{ note: object | null }>} the note, or null when absent.
     */
    async readNote(id) {
      await this.store.sync({ force: true })
      const note = this.store.get(id)
      if (note === null) return { note: null }
      return {
        note: {
          ...summaryOf(note),
          content: note.body,
          source: note.source,
          workspace: note.workspace,
          path: 'notes/' + note.file,
        },
      }
    }

    /**
     * Create or update one note from the panel. The panel shows every note, so
     * the duplicate-title guard that protects the agent is not applied here.
     * @param {unknown} input - an object with optional id, title, content, tags.
     * @returns {Promise<{ action: string, note: object }>} the write outcome.
     */
    async saveNote(input) {
      if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('note must be an object')
      const outcome = await this.store.save({
        id: typeof input.id === 'string' ? input.id : undefined,
        title: typeof input.title === 'string' ? input.title : undefined,
        content: typeof input.content === 'string' ? input.content : undefined,
        tags: input.tags,
        allowDuplicateTitle: true,
        source: 'panel',
      })
      return {
        action: outcome.action,
        note: { ...summaryOf(outcome.note), content: outcome.note.body, path: 'notes/' + outcome.note.file },
      }
    }

    /**
     * Feed one whole document into the knowledge base from the panel.
     * @param {unknown} input - an object with name, text, and optional tags.
     * @returns {Promise<object>} the import outcome.
     */
    async importDocument(input) {
      if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('document must be an object')
      return this.store.importDocument({
        name: typeof input.name === 'string' ? input.name : '',
        text: typeof input.text === 'string' ? input.text : '',
        tags: input.tags,
        source: 'import',
        dryRun: input.dryRun === true,
      })
    }

    /**
     * Retire one note from the panel.
     * @param {unknown} id - the note id.
     * @param {unknown} hard - pass true to unlink instead of trashing.
     * @returns {Promise<{ id: string, mode: string, total: number }>} the deletion outcome.
     */
    async deleteNote(id, hard) {
      const outcome = await this.store.remove(id, { hard: hard === true })
      const stats = await this.store.stats()
      return { id: outcome.note.id, mode: outcome.mode, total: stats.total }
    }

    /**
     * Counters for the panel header.
     * @returns {Promise<object>} store-wide statistics.
     */
    async getStats() {
      const stats = await this.store.stats()
      return {
        mode: this.mode,
        total: stats.total,
        chars: stats.chars,
        tags: stats.tags,
        root: stats.displayRoot,
        warnings: stats.warnings,
      }
    }

    /**
     * Report the active mode and both collections' locations for the panel.
     * @returns {Promise<{ mode: string, assistantRoot: string, writingRoot: string }>} the mode state.
     */
    async getMode() {
      const corpus = findCorpus(this.registry, this.registry.active)
      return {
        mode: this.mode,
        assistantRoot: this.location.displayRoot,
        writingRoot: this.corpusStore(corpus.id).displayRoot,
        corpus: { id: corpus.id, name: corpus.name, adult: corpus.adult },
      }
    }

    /**
     * Switch the active mode and persist it, so a one-click toggle from the panel
     * retargets the tools, the panel, and the prompt without a restart.
     * @param {unknown} mode - the requested mode.
     * @returns {Promise<{ mode: string }>} the mode now in effect.
     */
    async setMode(mode) {
      const next = normalizeMode(mode)
      if (next !== this.mode) {
        this.mode = next
        try {
          await mkdir(this.corpusStore(this.registry.active).root, { recursive: true }).catch(() => {})
          writeFileSync(this.modePath, JSON.stringify({ mode: next }) + '\n', 'utf8')
        } catch (error) {
          this.report('mode write failed', error)
        }
      }
      await this.activeStore().sync({ force: true }).catch(() => {})
      return { mode: this.mode }
    }

    /**
     * Read the writing-mode banned-phrase list for the panel editor.
     * @returns {Promise<{ text: string, phrases: string[], isDefault: boolean }>} the list and whether it is the shipped default.
     */
    async getBanned() {
      let isDefault = false
      let phrases
      try {
        phrases = parseBannedList(readFileSync(this.bannedPathFor(this.registry.active), 'utf8'))
      } catch (error) {
        if (!error || error.code === 'ENOENT') { phrases = [...DEFAULT_BANNED_PHRASES]; isDefault = true } else throw error
      }
      return { text: formatBannedList(phrases), phrases, isDefault }
    }

    /**
     * Persist an edited banned-phrase list.
     * @param {unknown} text - the raw list text from the editor.
     * @returns {Promise<{ phrases: string[] }>} the cleaned, stored phrases.
     */
    async setBanned(text) {
      const phrases = parseBannedList(typeof text === 'string' ? text : '')
      await mkdir(this.corpusStore(this.registry.active).root, { recursive: true })
      writeFileSync(this.bannedPathFor(this.registry.active), formatBannedList(phrases), 'utf8')
      return { phrases }
    }

    /**
     * Every corpus with its size and source books, for the panel and for the
     * novel-writing plugin's corpus picker.
     * @returns {Promise<{ active: string, mode: string, corpora: object[] }>} the corpora.
     */
    async listCorpora() {
      const corpora = []
      for (const entry of this.registry.corpora) {
        const store = this.corpusStore(entry.id)
        await store.sync().catch((error) => this.report(`corpus '${entry.id}' sync failed`, error))
        const sources = store.tagFacet().filter((item) => item.tag !== 'import').slice(0, 200)
        corpora.push({
          id: entry.id,
          name: entry.name,
          description: entry.description,
          adult: entry.adult,
          createdAt: entry.createdAt,
          root: store.displayRoot,
          notes: store.notes().length,
          chars: store.notes().reduce((sum, note) => sum + note.chars, 0),
          sources,
          active: entry.id === this.registry.active,
          isDefault: entry.id === DEFAULT_CORPUS_ID,
        })
      }
      return { active: this.registry.active, mode: this.mode, corpora }
    }

    /** Create a corpus; with `activate`, also make it the default. */
    async createCorpus(input) {
      const { registry, entry } = addCorpus(this.registry, input)
      const next = input && input.activate === true ? setActiveCorpus(registry, entry.id) : registry
      await mkdir(join(this.location.root, entry.dir), { recursive: true })
      this._writeRegistry(next)
      return { corpus: entry, active: next.active }
    }

    async updateCorpus(corpusId, patch) {
      this._writeRegistry(updateCorpus(this.registry, corpusId, patch))
      return { corpus: findCorpus(this.registry, corpusId) }
    }

    /**
     * Retire a corpus. Its directory moves to <root>/.trash-corpora so nothing
     * is lost; conversations bound to it fall back to the default corpus.
     */
    async deleteCorpus(corpusId) {
      const entry = findCorpus(this.registry, corpusId)
      const next = removeCorpus(this.registry, corpusId)
      const source = join(this.location.root, entry.dir)
      let trashedTo = ''
      if (await stat(source).then(() => true, () => false)) {
        const trash = join(this.location.root, '.trash-corpora')
        await mkdir(trash, { recursive: true })
        trashedTo = join(trash, `${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z')}__${entry.id}`)
        await rename(source, trashedTo)
      }
      this.corpusStores.delete(corpusId)
      this._writeRegistry(next)
      return { deleted: corpusId, active: next.active, trashedTo: trashedTo ? '.trash-corpora/' + trashedTo.split(/[\\/]/).pop() : '' }
    }

    async setActiveCorpus(corpusId) {
      this._writeRegistry(setActiveCorpus(this.registry, corpusId))
      await this.corpusStore(corpusId).sync({ force: true }).catch(() => {})
      return { active: corpusId }
    }

    /** Move every note carrying `tag` (usually one source book) between corpora. */
    async moveNotes(fromId, toId, tag) {
      if (!findCorpus(this.registry, fromId)) throw new Error(`unknown corpus '${fromId}'`)
      if (!findCorpus(this.registry, toId)) throw new Error(`unknown corpus '${toId}'`)
      if (fromId === toId) throw new Error('source and target corpus are the same')
      const outcome = await this.corpusStore(fromId).moveTaggedTo(this.corpusStore(toId), tag)
      return { ...outcome, from: fromId, to: toId, tag }
    }
  }
})()

export { KnowledgeBaseService, KnowledgeBaseService as default }
