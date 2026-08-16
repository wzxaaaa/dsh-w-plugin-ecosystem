import { Remote, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
import { randomUUID } from 'node:crypto'
import { readFile, rename, rm, rmdir, writeFile } from 'node:fs/promises'
import { dirname, isAbsolute } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  RETENTION_DAYS, clearTombstones, isDue, markDeleteRequested, markPurged,
  normalizeState, publicItems, reconcileEntries,
} from './archive-core.js'

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
      if (done) throw new TypeError('Cannot add initializers after decorators completed')
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

const STATE_FILE = '.dsh-w-archive-manager.json'
const MAINTENANCE_INTERVAL_MS = 5 * 60 * 1000

function sessionIdList(input) {
  if (!Array.isArray(input)) throw new Error('sessionIds must be an array')
  const seen = new Set()
  for (const value of input) {
    if (typeof value !== 'string' || value.length === 0) throw new Error('sessionIds must contain non-empty strings')
    seen.add(value)
  }
  return [...seen]
}

async function writeJsonAtomic(path, value) {
  const temporary = `${path}.${randomUUID()}.tmp`
  try {
    await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, { encoding: 'utf8', mode: 0o600 })
    await rename(temporary, path)
  } catch (error) {
    await rm(temporary, { force: true }).catch(() => {})
    throw error
  }
}

function requireRegistryInternals(registry) {
  const enqueueOperation = registry.enqueueOperation
  const requireState = registry.requireState
  const setState = registry.setState
  if (typeof enqueueOperation !== 'function' || typeof requireState !== 'function' || typeof setState !== 'function') {
    throw new Error('Harness workspace archive internals changed; refusing to mutate archive state')
  }
  return { enqueueOperation, requireState, setState }
}

let ArchiveManagerService = (() => {
  let _classSuper = TypertRemoteService
  let _instanceExtraInitializers = []
  let _listArchived_decorators
  let _restore_decorators
  let _deleteOne_decorators
  let _clearAll_decorators
  let _finalizeDeleted_decorators
  return class ArchiveManagerService extends _classSuper {
    static {
      const metadata = typeof Symbol === 'function' && Symbol.metadata
        ? Object.create(_classSuper[Symbol.metadata] ?? null)
        : void 0
      _listArchived_decorators = [Remote('listArchived')]
      __esDecorate(this, null, _listArchived_decorators, {
        kind: 'method', name: 'listArchived', static: false, private: false,
        access: { has: obj => 'listArchived' in obj, get: obj => obj.listArchived }, metadata,
      }, null, _instanceExtraInitializers)
      _restore_decorators = [Remote('restore')]
      __esDecorate(this, null, _restore_decorators, {
        kind: 'method', name: 'restore', static: false, private: false,
        access: { has: obj => 'restore' in obj, get: obj => obj.restore }, metadata,
      }, null, _instanceExtraInitializers)
      _deleteOne_decorators = [Remote('deleteOne')]
      __esDecorate(this, null, _deleteOne_decorators, {
        kind: 'method', name: 'deleteOne', static: false, private: false,
        access: { has: obj => 'deleteOne' in obj, get: obj => obj.deleteOne }, metadata,
      }, null, _instanceExtraInitializers)
      _clearAll_decorators = [Remote('clearAll')]
      __esDecorate(this, null, _clearAll_decorators, {
        kind: 'method', name: 'clearAll', static: false, private: false,
        access: { has: obj => 'clearAll' in obj, get: obj => obj.clearAll }, metadata,
      }, null, _instanceExtraInitializers)
      _finalizeDeleted_decorators = [Remote('finalizeDeleted')]
      __esDecorate(this, null, _finalizeDeleted_decorators, {
        kind: 'method', name: 'finalizeDeleted', static: false, private: false,
        access: { has: obj => 'finalizeDeleted' in obj, get: obj => obj.finalizeDeleted }, metadata,
      }, null, _instanceExtraInitializers)
      if (metadata) Object.defineProperty(this, Symbol.metadata, { value: metadata })
    }

    static inject = ['workspaceRegistry', 'sessionPersistence']

    constructor(ctx) {
      super(ctx, 'archiveManager')
      __runInitializers(this, _instanceExtraInitializers)
      this._statePromise = this.readState()
      this._tail = Promise.resolve()
      this._started = false
      this.ctx.effect(() => {
        let stopped = false
        const run = () => {
          if (stopped) return
          void this.maintenance().catch(error => {
            this.ctx.logger.warn(`dsh-w-archive-manager maintenance failed: ${String(error)}`)
          })
        }
        const timer = setInterval(run, MAINTENANCE_INTERVAL_MS)
        run()
        return () => {
          stopped = true
          clearInterval(timer)
        }
      }, 'dsh-w-archive-manager: retention maintenance')
    }

    statePath() {
      return fileURLToPath(new URL(STATE_FILE, this.ctx.baseUrl))
    }

    async readState() {
      try {
        return normalizeState(JSON.parse(await readFile(this.statePath(), 'utf8')))
      } catch (error) {
        if (error && error.code !== 'ENOENT') throw error
        return normalizeState({})
      }
    }

    serialize(operation) {
      const result = this._tail.then(operation)
      this._tail = result.then(() => undefined, () => undefined)
      return result
    }

    async saveState(state) {
      await writeJsonAtomic(this.statePath(), state)
      this._statePromise = Promise.resolve(state)
      return state
    }

    async setArchivedIds(ids) {
      const registry = this.ctx.workspaceRegistry
      const methods = requireRegistryInternals(registry)
      return methods.enqueueOperation.call(registry, async () => {
        const state = methods.requireState.call(registry)
        if (!state || !Array.isArray(state.archivedSessionIds)) {
          throw new Error('Harness workspace archive state changed; refusing to mutate it')
        }
        if (ids.length === state.archivedSessionIds.length
          && ids.every((id, index) => id === state.archivedSessionIds[index])) return [...ids]
        await methods.setState.call(registry, { ...state, archivedSessionIds: [...ids] })
        return [...ids]
      })
    }

    async removeArchivedIds(ids) {
      const removed = new Set(ids)
      const current = [...this.ctx.workspaceRegistry.archivedSessionIds]
      return this.setArchivedIds(current.filter(id => !removed.has(id)))
    }

    persistenceBusy(sessionId) {
      if (this.ctx.get('sessions')?.get(sessionId) !== undefined) return true
      if (this.ctx.get('agents')?.get(sessionId) !== undefined) return true
      const coordinator = this.ctx.sessionPersistence.coordinator
      if (coordinator === undefined || coordinator === null) return false
      if (coordinator.states instanceof Map && coordinator.states.has(sessionId)) return true
      if (coordinator.retirements instanceof Map && coordinator.retirements.has(sessionId)) return true
      if (coordinator.chains instanceof Map && coordinator.chains.has(sessionId)) return true
      if (coordinator.preparations && typeof coordinator.preparations.has === 'function'
        && coordinator.preparations.has(sessionId)) return true
      return false
    }

    async deletePersistence(header) {
      const persistence = this.ctx.sessionPersistence
      const location = persistence.locate(header)
      if (location?.kind === 'jsonl') {
        if (typeof location.path !== 'string' || !isAbsolute(location.path)) {
          throw new Error('JSONL persistence returned an unsafe session artifact path')
        }
        await rm(location.path, { force: true })
        await rmdir(dirname(location.path)).catch((error) => {
          if (!error || (error.code !== 'ENOENT' && error.code !== 'ENOTEMPTY')) throw error
        })
        return
      }
      if (persistence.name === 'session-persistence-sqlite') {
        if (persistence.ready && typeof persistence.ready.then === 'function') await persistence.ready
        const db = persistence.db
        if (!db || typeof db.prepare !== 'function') {
          throw new Error('SQLite persistence internals changed; refusing to delete session data')
        }
        db.prepare('DELETE FROM sessions WHERE id = ?').run(header.id)
        return
      }
      throw new Error(`unsupported session persistence backend: ${String(persistence.name ?? location?.kind ?? 'unknown')}`)
    }

    async cleanDerivedState(sessionId) {
      for (const workspace of this.ctx.workspaceRegistry.list()) {
        if (workspace.sessionIds.includes(sessionId)) await workspace.detachSession(sessionId)
      }
      const cache = this.ctx.get('sessionProjectionCache')
      if (cache?.table && typeof cache.table.delete === 'function') await cache.table.delete(sessionId)
      const registry = this.ctx.workspaceRegistry
      if (registry.headers instanceof Map) registry.headers.delete(sessionId)
      if (registry.sessionPaths instanceof Map) registry.sessionPaths.delete(sessionId)
      if (registry.invalidSessionPaths instanceof Map) registry.invalidSessionPaths.delete(sessionId)
    }

    async purge(state, sessionId, headers, now) {
      if (this.persistenceBusy(sessionId)) return { state, status: 'scheduled' }
      const header = headers.get(sessionId)
      if (header !== undefined) await this.deletePersistence(header)
      await this.cleanDerivedState(sessionId)
      return { state: markPurged(state, sessionId, now), status: 'deleted' }
    }

    async reconcile(state, now) {
      if (!this._started) {
        const tombstoneIds = Object.keys(state.tombstones)
        if (tombstoneIds.length > 0) {
          await this.removeArchivedIds(tombstoneIds)
          state = clearTombstones(state, tombstoneIds)
        }
        this._started = true
      }
      const headers = new Map((await this.ctx.sessionPersistence.list()).map(header => [header.id, header]))
      for (const session of this.ctx.get('sessions')?.list() ?? []) headers.set(session.id, session.header)
      const knownIds = [...headers.keys()]
      const archivedIds = [...this.ctx.workspaceRegistry.archivedSessionIds]
      const ghostIds = archivedIds.filter(id => !headers.has(id) && state.entries[id] === undefined)
      if (ghostIds.length > 0) await this.removeArchivedIds(ghostIds)
      state = reconcileEntries(state, archivedIds.filter(id => !ghostIds.includes(id)), knownIds, now)
      for (const [sessionId, entry] of Object.entries(state.entries)) {
        if (!isDue(entry, now)) continue
        state = markDeleteRequested(state, sessionId, now)
        const result = await this.purge(state, sessionId, headers, now)
        state = result.state
      }
      return state
    }

    maintenance() {
      return this.serialize(async () => {
        const state = await this.reconcile(await this._statePromise, Date.now())
        await this.saveState(state)
      })
    }

    listArchived() {
      return this.serialize(async () => {
        const state = await this.reconcile(await this._statePromise, Date.now())
        await this.saveState(state)
        return { retentionDays: RETENTION_DAYS, items: publicItems(state) }
      })
    }

    restore(sessionId) {
      if (typeof sessionId !== 'string' || sessionId.length === 0) return Promise.reject(new Error('sessionId is required'))
      return this.serialize(async () => {
        let state = await this.reconcile(await this._statePromise, Date.now())
        const entry = state.entries[sessionId]
        if (entry === undefined) throw new Error(`archived session "${sessionId}" was not found`)
        if (entry.deleteRequestedAt !== undefined) throw new Error('this session is already pending permanent deletion')
        await this.removeArchivedIds([sessionId])
        const entries = { ...state.entries }
        delete entries[sessionId]
        state = { ...state, entries }
        await this.saveState(state)
        return { restored: true, sessionId }
      })
    }

    deleteOne(sessionId) {
      if (typeof sessionId !== 'string' || sessionId.length === 0) return Promise.reject(new Error('sessionId is required'))
      return this.serialize(async () => {
        const now = Date.now()
        let state = await this.reconcile(await this._statePromise, now)
        if (state.entries[sessionId] === undefined) throw new Error(`archived session "${sessionId}" was not found`)
        state = markDeleteRequested(state, sessionId, now)
        const headers = new Map((await this.ctx.sessionPersistence.list()).map(header => [header.id, header]))
        const result = await this.purge(state, sessionId, headers, now)
        await this.saveState(result.state)
        return { sessionId, status: result.status }
      })
    }

    clearAll() {
      return this.serialize(async () => {
        const now = Date.now()
        let state = await this.reconcile(await this._statePromise, now)
        const headers = new Map((await this.ctx.sessionPersistence.list()).map(header => [header.id, header]))
        const results = []
        for (const sessionId of Object.keys(state.entries)) {
          state = markDeleteRequested(state, sessionId, now)
          const result = await this.purge(state, sessionId, headers, now)
          state = result.state
          results.push({ sessionId, status: result.status })
        }
        await this.saveState(state)
        return { results }
      })
    }

    finalizeDeleted(input) {
      const sessionIds = sessionIdList(input)
      return this.serialize(async () => {
        let state = await this._statePromise
        const finalizable = sessionIds.filter(id => state.tombstones[id] !== undefined)
        if (finalizable.length === 0) return { finalized: [] }
        const persisted = new Set((await this.ctx.sessionPersistence.list()).map(header => header.id))
        const safe = finalizable.filter(id => !persisted.has(id) && !this.persistenceBusy(id))
        if (safe.length > 0) {
          await this.removeArchivedIds(safe)
          state = clearTombstones(state, safe)
          await this.saveState(state)
        }
        return { finalized: safe }
      })
    }
  }
})()

export { ArchiveManagerService, ArchiveManagerService as default }
export const name = 'dsh-w-archive-manager'
