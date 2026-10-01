/**
 * dsh-w-api-key-switcher — Host half.
 *
 * Saved keys live only in Harness's credential provider. The browser receives
 * labels and active-state metadata, never the secret values.
 */

import { credentialKey, credentialRef } from '@deepseek-ai/dsh-credentials'
import { Remote, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
import {
  addVaultEntry,
  deriveCredentialRef,
  parseVaultRecord,
  projectVault,
  removeVaultEntry,
  sameSecret,
  toCredentialRecord,
  updateVaultEntry,
  validateProvider,
  vaultRecordId,
} from './api-key-switcher-core.js'

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

const VAULT_SCOPE = 'dsh-w-api-key-switcher'
const PI_SETTINGS_NS = 'llm-pi-ai'
const DEEPSEEK_SETTINGS_NS = 'llm-deepseek'
const DEEPSEEK_PROVIDER = 'deepseek-official'
const DEEPSEEK_DEFAULT_REF = 'DEEPSEEK_API_KEY'

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

let ApiKeySwitcherService = (() => {
  let _classSuper = TypertRemoteService
  let _instanceExtraInitializers = []
  let _getState_decorators
  let _saveKey_decorators
  let _switchKey_decorators
  let _updateKey_decorators
  let _deleteKey_decorators
  return class ApiKeySwitcherService extends _classSuper {
    static {
      const metadata = typeof Symbol === 'function' && Symbol.metadata
        ? Object.create(_classSuper[Symbol.metadata] ?? null)
        : void 0
      _getState_decorators = [Remote('getState')]
      __esDecorate(this, null, _getState_decorators, {
        kind: 'method', name: 'getState', static: false, private: false,
        access: { has: obj => 'getState' in obj, get: obj => obj.getState }, metadata,
      }, null, _instanceExtraInitializers)
      _saveKey_decorators = [Remote('saveKey')]
      __esDecorate(this, null, _saveKey_decorators, {
        kind: 'method', name: 'saveKey', static: false, private: false,
        access: { has: obj => 'saveKey' in obj, get: obj => obj.saveKey }, metadata,
      }, null, _instanceExtraInitializers)
      _switchKey_decorators = [Remote('switchKey')]
      __esDecorate(this, null, _switchKey_decorators, {
        kind: 'method', name: 'switchKey', static: false, private: false,
        access: { has: obj => 'switchKey' in obj, get: obj => obj.switchKey }, metadata,
      }, null, _instanceExtraInitializers)
      _updateKey_decorators = [Remote('updateKey')]
      __esDecorate(this, null, _updateKey_decorators, {
        kind: 'method', name: 'updateKey', static: false, private: false,
        access: { has: obj => 'updateKey' in obj, get: obj => obj.updateKey }, metadata,
      }, null, _instanceExtraInitializers)
      _deleteKey_decorators = [Remote('deleteKey')]
      __esDecorate(this, null, _deleteKey_decorators, {
        kind: 'method', name: 'deleteKey', static: false, private: false,
        access: { has: obj => 'deleteKey' in obj, get: obj => obj.deleteKey }, metadata,
      }, null, _instanceExtraInitializers)
      if (metadata) Object.defineProperty(this, Symbol.metadata, { value: metadata })
    }

    static inject = ['credentials', 'settings']

    constructor(ctx) {
      super(ctx, 'apiKeySwitcher')
      __runInitializers(this, _instanceExtraInitializers)
    }

    providerProfile(provider) {
      const route = validateProvider(provider)
      if (route === DEEPSEEK_PROVIDER) {
        const profile = this.ctx.settings.get(DEEPSEEK_SETTINGS_NS)
        if (!isRecord(profile)) throw new Error('official DeepSeek model provider is not configured')
        const explicitRef = typeof profile.apiKeyEnv === 'string' && profile.apiKeyEnv.length > 0
          ? profile.apiKeyEnv
          : undefined
        return {
          provider: route,
          profile,
          settingsNs: DEEPSEEK_SETTINGS_NS,
          credentialPath: ['apiKeyEnv'],
          credentialRef: explicitRef ?? DEEPSEEK_DEFAULT_REF,
          explicitRef,
        }
      }
      const config = this.ctx.settings.get(PI_SETTINGS_NS)
      const profiles = isRecord(config) && isRecord(config.providers) ? config.providers : undefined
      const profile = profiles === undefined ? undefined : profiles[route]
      if (!isRecord(profile)) throw new Error(`model provider "${route}" is not configured`)
      const explicitRef = typeof profile.apiKeyEnv === 'string' && profile.apiKeyEnv.length > 0
        ? profile.apiKeyEnv
        : undefined
      return {
        provider: route,
        profile,
        settingsNs: PI_SETTINGS_NS,
        credentialPath: ['providers', route, 'apiKeyEnv'],
        credentialRef: explicitRef ?? deriveCredentialRef(route),
        explicitRef,
      }
    }

    recordKey(provider) {
      return credentialKey(VAULT_SCOPE, vaultRecordId(provider))
    }

    async readVault(provider) {
      return parseVaultRecord(await this.ctx.credentials.readRecord(this.recordKey(provider)), provider)
    }

    async ensureCredentialRef(route) {
      if (route.explicitRef !== undefined) return route.credentialRef
      if (this.ctx.settings.writable !== true) {
        throw new Error('model settings are read-only; this provider does not yet name an apiKeyEnv reference')
      }
      await this.ctx.settings.mutate(route.settingsNs, [{
        op: 'set', path: route.credentialPath, value: route.credentialRef,
      }])
      return route.credentialRef
    }

    async stateFor(provider) {
      const route = this.providerProfile(provider)
      const ref = credentialRef(route.credentialRef)
      const [vault, info, resolved] = await Promise.all([
        this.readVault(route.provider),
        this.ctx.credentials.describe(ref),
        this.ctx.credentials.resolve(ref),
      ])
      return projectVault(vault, resolved?.value, { ref: route.credentialRef, ...info })
    }

    async getState(provider) {
      return this.stateFor(provider)
    }

    async saveKey(input) {
      if (!isRecord(input)) throw new Error('input must be an object')
      const route = this.providerProfile(input.provider)
      const refName = await this.ensureCredentialRef(route)
      const ref = credentialRef(refName)
      const info = await this.ctx.credentials.describe(ref)
      if (!info.writable) throw new Error(`credential ${refName} is read-only${info.source ? ` because ${info.source} supplies it` : ''}`)
      let savedEntry
      await this.ctx.credentials.modifyRecord(this.recordKey(route.provider), async current => {
        const result = addVaultEntry(parseVaultRecord(current, route.provider), input)
        savedEntry = result.entry
        return toCredentialRecord(result.vault)
      })
      await this.ctx.credentials.set(ref, savedEntry.apiKey)
      return this.stateFor(route.provider)
    }

    async switchKey(provider, id) {
      const route = this.providerProfile(provider)
      const vault = await this.readVault(route.provider)
      const entry = vault.entries.find(candidate => candidate.id === id)
      if (entry === undefined) throw new Error('saved API-key entry was not found')
      const refName = await this.ensureCredentialRef(route)
      const ref = credentialRef(refName)
      const info = await this.ctx.credentials.describe(ref)
      if (!info.writable) throw new Error(`credential ${refName} is read-only${info.source ? ` because ${info.source} supplies it` : ''}`)
      await this.ctx.credentials.set(ref, entry.apiKey)
      return this.stateFor(route.provider)
    }

    async updateKey(input) {
      if (!isRecord(input)) throw new Error('input must be an object')
      const route = this.providerProfile(input.provider)
      const recordKey = this.recordKey(route.provider)
      const ref = credentialRef(route.credentialRef)
      const [before, activeBefore] = await Promise.all([
        this.readVault(route.provider),
        this.ctx.credentials.resolve(ref),
      ])
      const preview = updateVaultEntry(before, input)
      const beforeEntry = before.entries.find(entry => entry.id === input.id)
      const previewEntry = preview.entries.find(entry => entry.id === input.id)
      const expectedActiveReplacement = !sameSecret(beforeEntry.apiKey, previewEntry.apiKey)
        && sameSecret(beforeEntry.apiKey, activeBefore?.value)
      if (expectedActiveReplacement) {
        const info = await this.ctx.credentials.describe(ref)
        if (!info.writable) {
          throw new Error(`credential ${route.credentialRef} is read-only${info.source ? ` because ${info.source} supplies it` : ''}`)
        }
        await this.ensureCredentialRef(route)
      }
      let previousEntry
      let updatedEntry
      await this.ctx.credentials.modifyRecord(recordKey, async current => {
        const vault = parseVaultRecord(current, route.provider)
        previousEntry = vault.entries.find(entry => entry.id === input.id)
        const updated = updateVaultEntry(vault, input)
        updatedEntry = updated.entries.find(entry => entry.id === input.id)
        const replaceActive = !sameSecret(previousEntry.apiKey, updatedEntry.apiKey)
          && sameSecret(previousEntry.apiKey, activeBefore?.value)
        if (replaceActive !== expectedActiveReplacement) throw new Error('saved key changed during update; retry')
        return toCredentialRecord(updated)
      })
      if (expectedActiveReplacement) {
        try {
          await this.ctx.credentials.set(ref, updatedEntry.apiKey)
        } catch (error) {
          try {
            await this.ctx.credentials.modifyRecord(recordKey, async current => {
              const vault = parseVaultRecord(current, route.provider)
              const entry = vault.entries.find(candidate => candidate.id === input.id)
              if (!entry || !sameSecret(entry.apiKey, updatedEntry.apiKey) || entry.updatedAt !== updatedEntry.updatedAt) {
                throw new Error('saved key changed before the failed update could be rolled back')
              }
              return toCredentialRecord({
                ...vault,
                entries: vault.entries.map(candidate => candidate.id === input.id ? previousEntry : candidate),
              })
            })
          } catch (rollbackError) {
            throw new Error('active credential update failed and saved-key rollback also failed', { cause: rollbackError })
          }
          throw error
        }
      }
      return this.stateFor(route.provider)
    }

    async deleteKey(provider, id) {
      const route = this.providerProfile(provider)
      const ref = credentialRef(route.credentialRef)
      const current = await this.ctx.credentials.resolve(ref)
      await this.ctx.credentials.modifyRecord(this.recordKey(route.provider), async record => {
        const vault = parseVaultRecord(record, route.provider)
        const entry = vault.entries.find(candidate => candidate.id === id)
        if (entry === undefined) throw new Error('saved API-key entry was not found')
        if (sameSecret(entry.apiKey, current?.value)) {
          throw new Error('the active API key cannot be deleted; switch to another saved key first')
        }
        const next = removeVaultEntry(vault, id)
        return next.entries.length === 0 ? { kind: 'grant', payload: next } : toCredentialRecord(next)
      })
      return this.stateFor(route.provider)
    }
  }
})()

export function apply(ctx) {
  return ctx.plugin(ApiKeySwitcherService)
}

export const inject = ['credentials', 'settings']
export const name = 'dsh-w-api-key-switcher'
export default apply
