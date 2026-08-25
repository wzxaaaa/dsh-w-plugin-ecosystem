/**
 * dsh-w-persona — Host half.
 *
 * Exposes a Typert Remote service `personaManager`:
 *   - getState(): the current custom persona (the saved override, or the
 *     HARNESS DEFAULT captured on first use into a state file) plus the
 *     harness default itself.
 *   - save(text): persist a persona override into the profile's
 *     cordis.patch.yml (`- id: system-prompt, config: { persona }`). Saving
 *     the default text removes the override instead (clean revert).
 *
 * Persistence alone is NOT enough: every agent preset mounts its own
 * `@deepseek-ai/dsh-persona` row that shadows the deployment persona. This
 * plugin therefore also registers a GLOBAL `system-prompt/assemble` listener
 * that rewrites the assembled `deployment:persona` section to the saved
 * override on every model turn, so it applies instantly to new sessions
 * regardless of the active preset.
 */

import {
  createAssistantMessage,
  createUserMessage,
  deepFreeze,
  isAgentLoopRequest,
} from '@deepseek-ai/dsh-llm'
import { Remote, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
import { randomUUID } from 'node:crypto'
import { open, readFile, rename, rm, stat, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { basename, dirname, join } from 'node:path'
import * as yaml from 'js-yaml'
import {
  defaultDialoguePreset,
  dialoguePresetTurns,
  normalizeDialoguePreset,
} from './dialogue-preset-core.js'
import {
  defaultPersonaTemplateLibrary,
  deletePersonaTemplate,
  matchingPersonaTemplateId,
  normalizePersonaTemplateLibrary,
  savePersonaTemplate,
} from './persona-template-core.js'
import { updatePersonaPatch } from './persona-patch-core.js'

var __runInitializers = function (thisArg, initializers, value) {
  var useValue = arguments.length > 2
  for (var i = 0; i < initializers.length; i++) value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg)
  return useValue ? value : void 0
}
var __esDecorate = function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) {
    if (f !== void 0 && typeof f !== 'function') throw new TypeError('Function expected')
    return f
  }
  var kind = contextIn.kind, key = kind === 'getter' ? 'get' : kind === 'setter' ? 'set' : 'value'
  var target = !descriptorIn && ctor ? contextIn['static'] ? ctor : ctor.prototype : null
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
    var result = (0, decorators[i])(kind === 'accessor' ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context)
    if (kind === 'accessor') {
      if (result === void 0) continue
      if (result === null || typeof result !== 'object') throw new TypeError('Object expected')
      if (_ = accept(result.get)) descriptor.get = _
      if (_ = accept(result.set)) descriptor.set = _
      if (_ = accept(result.init)) initializers.unshift(_)
    } else if (_ = accept(result)) if (kind === 'field') initializers.unshift(_)
    else descriptor[key] = _
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor)
  done = true
}

const PATCH_FILE = 'cordis.patch.yml'
const DEFAULT_STATE_FILE = '.dsh-w-persona-default.txt'
const DIALOGUE_STATE_FILE = '.dsh-w-persona-dialogue.json'
const TEMPLATE_STATE_FILE = '.dsh-w-persona-templates.json'
const PROMPT_ROW_ID = 'system-prompt'
const PERSONA_SECTION = 'deployment:persona'
const MAX_PERSONA_BYTES = 1024 * 1024
const MAX_DIALOGUE_BYTES = 1024 * 1024
const MAX_TEMPLATE_LIBRARY_BYTES = 16 * 1024 * 1024
const PATCH_LOCK_SUFFIX = '.dsh-w.lock'
const PATCH_LOCK_STALE_MS = 30_000
const PATCH_LOCK_TIMEOUT_MS = 10_000
const DIALOGUE_BYPASS = new WeakSet()

function sleep(ms) {
  return new Promise(resolvePromise => setTimeout(resolvePromise, ms))
}

async function readPatchArray(path) {
  let raw
  try {
    raw = await readFile(path, 'utf8')
  } catch (error) {
    if (error && error.code === 'ENOENT') return []
    throw error
  }
  if (raw.trim() === '') return []
  const parsed = yaml.load(raw)
  if (parsed == null) return []
  if (!Array.isArray(parsed)) {
    throw new Error('cordis.patch.yml must contain a YAML list; refusing to overwrite it')
  }
  return parsed
}

async function withPatchLock(path, callback) {
  const lockPath = path + PATCH_LOCK_SUFFIX
  const deadline = Date.now() + PATCH_LOCK_TIMEOUT_MS
  let handle
  while (handle === undefined) {
    try {
      const candidate = await open(lockPath, 'wx')
      try {
        await candidate.writeFile(JSON.stringify({ pid: process.pid, createdAt: Date.now() }), 'utf8')
        handle = candidate
      } catch (error) {
        await candidate.close().catch(() => {})
        await rm(lockPath, { force: true }).catch(() => {})
        throw error
      }
    } catch (error) {
      if (!error || error.code !== 'EEXIST') throw error
      try {
        const info = await stat(lockPath)
        if (Date.now() - info.mtimeMs > PATCH_LOCK_STALE_MS) {
          await rm(lockPath, { force: true })
          continue
        }
      } catch (statError) {
        if (!statError || statError.code !== 'ENOENT') throw statError
        continue
      }
      if (Date.now() >= deadline) throw new Error('Timed out waiting to update cordis.patch.yml')
      await sleep(40)
    }
  }
  try {
    return await callback()
  } finally {
    await handle.close().catch(() => {})
    await rm(lockPath, { force: true }).catch(() => {})
  }
}

async function writePatchArrayAtomic(path, data) {
  const tempPath = join(dirname(path), '.' + basename(path) + '.' + process.pid + '.' + randomUUID() + '.tmp')
  try {
    await writeFile(tempPath, yaml.dump(data, { noRefs: true, lineWidth: 120 }), 'utf8')
    await rename(tempPath, path)
  } finally {
    await rm(tempPath, { force: true }).catch(() => {})
  }
}

async function mutatePatchArray(path, callback) {
  return withPatchLock(path, async () => {
    const current = await readPatchArray(path)
    const next = await callback(current)
    if (!Array.isArray(next)) throw new Error('patch mutation must return an array')
    await writePatchArrayAtomic(path, next)
    return next
  })
}

async function writeJsonAtomic(path, value) {
  const tempPath = join(dirname(path), '.' + basename(path) + '.' + process.pid + '.' + randomUUID() + '.tmp')
  try {
    await writeFile(tempPath, JSON.stringify(value, null, 2) + '\n', 'utf8')
    await rename(tempPath, path)
  } finally {
    await rm(tempPath, { force: true }).catch(() => {})
  }
}

/** Map an expanded Loader child id back to the profile-composition row id. */
function profileEntryId(entryId) {
  const includePrefix = 'include:'
  return entryId.startsWith(includePrefix) ? entryId.slice(includePrefix.length) : entryId
}

let PersonaManagerGateway = (() => {
  let _classSuper = TypertRemoteService
  let _instanceExtraInitializers = []
  let _getState_decorators
  let _save_decorators
  let _saveDialoguePreset_decorators
  let _saveConfiguration_decorators
  let _saveTemplate_decorators
  let _deleteTemplate_decorators
  let _applyTemplate_decorators
  return class PersonaManagerGateway extends _classSuper {
    static {
      const _metadata = typeof Symbol === 'function' && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0
      _getState_decorators = [Remote('getState')]
      __esDecorate(this, null, _getState_decorators, {
        kind: 'method', name: 'getState', static: false, private: false,
        access: { has: (obj) => 'getState' in obj, get: (obj) => obj.getState },
        metadata: _metadata,
      }, null, _instanceExtraInitializers)
      _save_decorators = [Remote('save')]
      __esDecorate(this, null, _save_decorators, {
        kind: 'method', name: 'save', static: false, private: false,
        access: { has: (obj) => 'save' in obj, get: (obj) => obj.save },
        metadata: _metadata,
      }, null, _instanceExtraInitializers)
      _saveDialoguePreset_decorators = [Remote('saveDialoguePreset')]
      __esDecorate(this, null, _saveDialoguePreset_decorators, {
        kind: 'method', name: 'saveDialoguePreset', static: false, private: false,
        access: { has: (obj) => 'saveDialoguePreset' in obj, get: (obj) => obj.saveDialoguePreset },
        metadata: _metadata,
      }, null, _instanceExtraInitializers)
      _saveConfiguration_decorators = [Remote('saveConfiguration')]
      __esDecorate(this, null, _saveConfiguration_decorators, {
        kind: 'method', name: 'saveConfiguration', static: false, private: false,
        access: { has: (obj) => 'saveConfiguration' in obj, get: (obj) => obj.saveConfiguration },
        metadata: _metadata,
      }, null, _instanceExtraInitializers)
      _saveTemplate_decorators = [Remote('saveTemplate')]
      __esDecorate(this, null, _saveTemplate_decorators, {
        kind: 'method', name: 'saveTemplate', static: false, private: false,
        access: { has: (obj) => 'saveTemplate' in obj, get: (obj) => obj.saveTemplate },
        metadata: _metadata,
      }, null, _instanceExtraInitializers)
      _deleteTemplate_decorators = [Remote('deleteTemplate')]
      __esDecorate(this, null, _deleteTemplate_decorators, {
        kind: 'method', name: 'deleteTemplate', static: false, private: false,
        access: { has: (obj) => 'deleteTemplate' in obj, get: (obj) => obj.deleteTemplate },
        metadata: _metadata,
      }, null, _instanceExtraInitializers)
      _applyTemplate_decorators = [Remote('applyTemplate')]
      __esDecorate(this, null, _applyTemplate_decorators, {
        kind: 'method', name: 'applyTemplate', static: false, private: false,
        access: { has: (obj) => 'applyTemplate' in obj, get: (obj) => obj.applyTemplate },
        metadata: _metadata,
      }, null, _instanceExtraInitializers)
      if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata })
    }

    static inject = ['loader', 'llm']

    constructor(ctx) {
      super(ctx, 'personaManager')
      __runInitializers(this, _instanceExtraInitializers)

      // undefined = not yet read, null = no override, string = saved override.
      this._customPersona = undefined
      // The preset is captured on the first model request per session. Later
      // setting changes therefore affect new conversations without rewriting
      // the context of conversations already in progress.
      this._sessionDialoguePresets = new Map()
      this._mutationTail = Promise.resolve()

      // The `system-prompt` config override alone is NOT enough: every shipped
      // agent preset mounts its own `@deepseek-ai/dsh-persona` row that SHADOWS
      // the deployment persona for that session. A global (untagged) assemble
      // listener is admitted by `scopeTarget` for every assembly, so we rewrite
      // the assembled persona section to the saved override on each model turn.
      // `next()` returns the downstream (inner) result, so we patch that value
      // and return it as authoritative.
      const self = this
      this.ctx.on('system-prompt/assemble', async (assembly, _context, next) => {
        const assembled = await next()
        const custom = await self.getCustomPersona()
        if (custom === null || !assembled || !Array.isArray(assembled.sections)) return assembled
        return {
          ...assembled,
          sections: assembled.sections.map((section) =>
            section.name === PERSONA_SECTION ? { ...section, text: custom } : section,
          ),
        }
      })

      // Harness loop requests are immutable and reconstructable from the
      // durable session log. To keep the four preset messages hidden from that
      // log, this outer listener short-circuits into one unmarked request copy.
      // The nested copy traverses the ordinary adapter middleware once and the
      // WeakSet guard prevents recursion.
      this.ctx.on('llm/stream', (options, next) => {
        if (DIALOGUE_BYPASS.has(options) || !isAgentLoopRequest(options)) return next()
        return (async function* () {
          const preset = await self.getSessionDialoguePreset(options.sessionId)
          const turns = dialoguePresetTurns(preset)
          if (turns.length === 0) {
            yield* next()
            return
          }
          const prefix = turns.map(turn => turn.role === 'user'
            ? createUserMessage({
              content: [{ type: 'text', text: turn.text }],
              source: { kind: 'plugin', plugin: 'dsh-w-persona', form: 'recall' },
            })
            : createAssistantMessage({
              content: [{ type: 'text', text: turn.text }],
              source: { provider: options.provider, model: options.model },
            }))
          const replacement = deepFreeze({
            ...options,
            messages: [...prefix, ...options.messages],
          })
          DIALOGUE_BYPASS.add(replacement)
          yield* self.ctx.llm.stream(replacement)
        })()
      }, { global: true, prepend: true })

      this.ctx.on('agent/disposed', ({ agent }) => {
        this._sessionDialoguePresets.delete(String(agent.id))
      }, { global: true })
    }

    /** Absolute path of the active profile's user patch file (resolved from ctx.baseUrl). */
    patchPath() {
      return fileURLToPath(new URL(PATCH_FILE, this.ctx.baseUrl))
    }

    /** Profile directory (where the patch and the default-persona state file live). */
    profileDir() {
      return dirname(this.patchPath())
    }

    /** Path of the captured harness-default persona state file. */
    defaultStatePath() {
      return join(this.profileDir(), DEFAULT_STATE_FILE)
    }

    /** Path of the profile-local DeepSeek dialogue preset. */
    dialogueStatePath() {
      return join(this.profileDir(), DIALOGUE_STATE_FILE)
    }

    /** Path of the profile-local reusable persona template library. */
    templateStatePath() {
      return join(this.profileDir(), TEMPLATE_STATE_FILE)
    }

    /** Find the loader entry of the `system-prompt` row (any expanded id form). */
    findPromptEntry() {
      for (const entry of this.ctx.loader.entries()) {
        if (entry.options.group) continue
        if (profileEntryId(entry.id) === PROMPT_ROW_ID) return entry
      }
      return undefined
    }

    /** Current effective persona template (the `system-prompt` row's config.persona). */
    async readCurrentPersona() {
      const entry = this.findPromptEntry()
      return entry?.options?.config?.persona ?? ''
    }

    /** The saved override from the profile patch (null when absent). */
    async readOverrideFromPatch() {
      const data = await readPatchArray(this.patchPath())
      for (let index = data.length - 1; index >= 0; index--) {
        const row = data[index]
        if (!row || row.id !== PROMPT_ROW_ID || !row.config
          || !Object.prototype.hasOwnProperty.call(row.config, 'persona')) continue
        if (typeof row.config.persona !== 'string') throw new Error('system-prompt config.persona must be a string')
        return row.config.persona
      }
      return null
    }

    /** The saved custom persona (cached after first read). */
    async getCustomPersona() {
      if (this._customPersona !== undefined) return this._customPersona
      this._customPersona = await this.readOverrideFromPatch()
      return this._customPersona
    }

    /**
     * The harness-default persona. Captured once into a state file on first
     * use (before any override exists), so later saves/resets can always
     * restore the original.
     */
    async readDefaultPersona() {
      try {
        return await readFile(this.defaultStatePath(), 'utf8')
      } catch (error) {
        if (error && error.code !== 'ENOENT') throw error
        const current = await this.readCurrentPersona()
        try {
          await writeFile(this.defaultStatePath(), current, { encoding: 'utf8', flag: 'wx' })
          return current
        } catch (writeError) {
          if (!writeError || writeError.code !== 'EEXIST') throw writeError
          return readFile(this.defaultStatePath(), 'utf8')
        }
      }
    }

    async readDialoguePreset() {
      let raw
      try {
        raw = await readFile(this.dialogueStatePath(), 'utf8')
      } catch (error) {
        if (error && error.code === 'ENOENT') return defaultDialoguePreset()
        throw error
      }
      if (raw.trim() === '') return defaultDialoguePreset()
      return normalizeDialoguePreset(JSON.parse(raw))
    }

    async readTemplateLibrary() {
      let raw
      try {
        raw = await readFile(this.templateStatePath(), 'utf8')
      } catch (error) {
        if (error && error.code === 'ENOENT') return defaultPersonaTemplateLibrary()
        throw error
      }
      if (raw.trim() === '') return defaultPersonaTemplateLibrary()
      return normalizePersonaTemplateLibrary(JSON.parse(raw))
    }

    serializeMutation(callback) {
      const operation = this._mutationTail.then(callback)
      this._mutationTail = operation.then(() => {}, () => {})
      return operation
    }

    async getSessionDialoguePreset(sessionId) {
      const key = String(sessionId ?? '')
      if (this._sessionDialoguePresets.has(key)) return this._sessionDialoguePresets.get(key)
      const preset = await this.readDialoguePreset()
      this._sessionDialoguePresets.set(key, preset)
      return preset
    }

    async getState() {
      const [custom, defaultText, dialoguePreset, library] = await Promise.all([
        this.getCustomPersona(),
        this.readDefaultPersona(),
        this.readDialoguePreset(),
        this.readTemplateLibrary(),
      ])
      const current = custom ?? defaultText
      return {
        current,
        defaultText,
        dialoguePreset,
        templates: library.templates,
        activeTemplateId: matchingPersonaTemplateId(library, current, dialoguePreset),
      }
    }

    validateConfiguration(text, value) {
      if (typeof text !== 'string') throw new Error('persona text must be a string')
      if (Buffer.byteLength(text, 'utf8') > MAX_PERSONA_BYTES) throw new Error('persona text exceeds the 1 MB limit')
      const preset = normalizeDialoguePreset(value)
      if (Buffer.byteLength(JSON.stringify(preset), 'utf8') > MAX_DIALOGUE_BYTES) {
        throw new Error('dialogue preset exceeds the 1 MB limit')
      }
      return preset
    }

    async writeConfiguration(text, preset) {
      const defaultText = await this.readDefaultPersona()
      const patchPath = this.patchPath()
      const dialoguePath = this.dialogueStatePath()
      await withPatchLock(patchPath, async () => {
        const beforePatch = await readPatchArray(patchPath)
        const nextPatch = updatePersonaPatch(beforePatch, text, defaultText)
        await writePatchArrayAtomic(patchPath, nextPatch)
        try {
          await writeJsonAtomic(dialoguePath, preset)
        } catch (error) {
          await writePatchArrayAtomic(patchPath, beforePatch).catch(() => {})
          throw error
        }
      })
      this._customPersona = text !== defaultText ? text : null
      return { defaultText }
    }

    async save(text) {
      return this.serializeMutation(async () => {
        if (typeof text !== 'string') throw new Error('persona text must be a string')
        if (Buffer.byteLength(text, 'utf8') > MAX_PERSONA_BYTES) throw new Error('persona text exceeds the 1 MB limit')
        const defaultText = await this.readDefaultPersona()
        await mutatePatchArray(this.patchPath(), data => updatePersonaPatch(data, text, defaultText))
        this._customPersona = text !== defaultText ? text : null
        return { saved: true, current: text, defaultText, applied: true }
      })
    }

    async saveDialoguePreset(value) {
      return this.serializeMutation(async () => {
        const preset = normalizeDialoguePreset(value)
        if (Buffer.byteLength(JSON.stringify(preset), 'utf8') > MAX_DIALOGUE_BYTES) {
          throw new Error('dialogue preset exceeds the 1 MB limit')
        }
        const path = this.dialogueStatePath()
        await withPatchLock(path, () => writeJsonAtomic(path, preset))
        return { saved: true, dialoguePreset: preset, applied: true }
      })
    }

    async saveConfiguration(text, value) {
      return this.serializeMutation(async () => {
        const preset = this.validateConfiguration(text, value)
        await this.writeConfiguration(text, preset)
        return { saved: true, applied: true, ...(await this.getState()) }
      })
    }

    async saveTemplate(value) {
      return this.serializeMutation(async () => {
        if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('persona template input must be an object')
        const preset = this.validateConfiguration(value.persona, value.dialoguePreset)
        const path = this.templateStatePath()
        let saved
        await withPatchLock(path, async () => {
          const current = await this.readTemplateLibrary()
          saved = savePersonaTemplate(current, { ...value, dialoguePreset: preset }, {
            id: randomUUID(),
            now: new Date().toISOString(),
          })
          const serialized = JSON.stringify(saved.library)
          if (Buffer.byteLength(serialized, 'utf8') > MAX_TEMPLATE_LIBRARY_BYTES) {
            throw new Error('persona template library exceeds the 16 MB limit')
          }
          await writeJsonAtomic(path, saved.library)
        })
        const state = await this.getState()
        return { saved: true, template: saved.template, ...state }
      })
    }

    async deleteTemplate(id) {
      return this.serializeMutation(async () => {
        const path = this.templateStatePath()
        await withPatchLock(path, async () => {
          const current = await this.readTemplateLibrary()
          await writeJsonAtomic(path, deletePersonaTemplate(current, id))
        })
        return { deleted: true, ...(await this.getState()) }
      })
    }

    async applyTemplate(id) {
      return this.serializeMutation(async () => {
        const library = await this.readTemplateLibrary()
        const template = library.templates.find(candidate => candidate.id === String(id ?? ''))
        if (!template) throw new Error(`unknown persona template: ${String(id)}`)
        await this.writeConfiguration(template.persona, template.dialoguePreset)
        return { applied: true, appliedTemplateId: template.id, ...(await this.getState()) }
      })
    }
  }
})()

export { PersonaManagerGateway, PersonaManagerGateway as default, updatePersonaPatch }
