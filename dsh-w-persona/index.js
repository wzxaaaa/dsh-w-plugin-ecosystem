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

import { Remote, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
import { randomUUID } from 'node:crypto'
import { open, readFile, rename, rm, stat, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { basename, dirname, join } from 'node:path'
import * as yaml from 'js-yaml'
import {
  PERSONA_SECTION,
  PROMPT_ROW_ID,
  patchPersonaAssembly,
  updatePersonaPatch,
} from './persona-core.js'

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
const MAX_PERSONA_BYTES = 1024 * 1024
const PATCH_LOCK_SUFFIX = '.dsh-w.lock'
const PATCH_LOCK_STALE_MS = 30_000
const PATCH_LOCK_TIMEOUT_MS = 10_000

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
  let _refreshDefault_decorators
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
      _refreshDefault_decorators = [Remote('refreshDefault')]
      __esDecorate(this, null, _refreshDefault_decorators, {
        kind: 'method', name: 'refreshDefault', static: false, private: false,
        access: { has: (obj) => 'refreshDefault' in obj, get: (obj) => obj.refreshDefault },
        metadata: _metadata,
      }, null, _instanceExtraInitializers)
      if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata })
    }

    static inject = ['loader']

    constructor(ctx) {
      super(ctx, 'personaManager')
      __runInitializers(this, _instanceExtraInitializers)

      // undefined = not yet read, null = no override, string = saved override.
      this._customPersona = undefined
      this._overrideSignature = undefined
      this._lastAssembly = null

      // The `system-prompt` config override alone is NOT enough: every shipped
      // agent preset mounts its own `@deepseek-ai/dsh-persona` row that SHADOWS
      // the deployment persona for that session. A global (untagged) assemble
      // listener is admitted by `scopeTarget` for every assembly, so we rewrite
      // the assembled persona section to the saved override on each model turn.
      // `next()` returns the downstream (inner) result, so we patch that value
      // and return it as authoritative.
      const self = this
      this.ctx.on('system-prompt/assemble', async (_assembly, _context, next) => {
        const assembled = await next()
        const custom = await self.getCustomPersona()
        const hadSection = Array.isArray(assembled?.sections)
          && assembled.sections.some(section => section?.name === PERSONA_SECTION)
        const result = patchPersonaAssembly(assembled, custom)
        self._lastAssembly = {
          at: Date.now(),
          customActive: custom !== null,
          hadSection,
          applied: result.status.applied,
          inserted: result.status.inserted,
        }
        return result.assembly
      })
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

    /** Signature used to invalidate the cached patch override after external edits. */
    async patchSignature() {
      try {
        const info = await stat(this.patchPath())
        return `${info.mtimeMs}:${info.ctimeMs}:${info.size}`
      } catch (error) {
        if (error?.code === 'ENOENT') return 'missing'
        throw error
      }
    }

    /** The saved custom persona; re-reads cordis.patch.yml when it changes externally. */
    async getCustomPersona() {
      const signature = await this.patchSignature()
      if (this._customPersona !== undefined && signature === this._overrideSignature) return this._customPersona
      this._customPersona = await this.readOverrideFromPatch()
      this._overrideSignature = signature
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

    async getState() {
      const custom = await this.getCustomPersona()
      const defaultText = await this.readDefaultPersona()
      return {
        current: custom ?? defaultText,
        defaultText,
        hasOverride: custom !== null,
        canRefreshDefault: custom === null,
        diagnostics: {
          sectionName: PERSONA_SECTION,
          patchPath: this.patchPath(),
          defaultStatePath: this.defaultStatePath(),
          lastAssembly: this._lastAssembly,
        },
      }
    }

    async refreshDefault() {
      const custom = await this.getCustomPersona()
      if (custom !== null) {
        return { ...(await this.getState()), refreshed: false, reason: 'override-active' }
      }
      const current = await this.readCurrentPersona()
      await writeFile(this.defaultStatePath(), current, 'utf8')
      return { ...(await this.getState()), refreshed: true }
    }

    async save(text) {
      if (typeof text !== 'string') throw new Error('persona text must be a string')
      if (Buffer.byteLength(text, 'utf8') > MAX_PERSONA_BYTES) throw new Error('persona text exceeds the 1 MB limit')
      const defaultText = await this.readDefaultPersona()
      await mutatePatchArray(this.patchPath(), data => updatePersonaPatch(data, text, defaultText))

      // Update the in-memory cache so the `system-prompt/assemble` listener
      // rewrites the persona on the very next model turn — no restart needed.
      this._customPersona = text !== defaultText ? text : null
      this._overrideSignature = await this.patchSignature()

      return { ...(await this.getState()), saved: true, applied: true }
    }
  }
})()

export { PersonaManagerGateway, PersonaManagerGateway as default, patchPersonaAssembly, updatePersonaPatch }
