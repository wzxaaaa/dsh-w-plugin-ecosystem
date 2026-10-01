import { createHash, randomUUID, timingSafeEqual } from 'node:crypto'

export const VAULT_VERSION = 1
export const MAX_KEYS_PER_PROVIDER = 50
export const MAX_LABEL_LENGTH = 80

const LEGAL_API_KEY = /^[\x21-\x7E]+$/u
const SAFE_PROVIDER = /^[A-Za-z0-9][A-Za-z0-9._~-]{0,127}$/u
const SAFE_ENTRY_ID = /^key-[0-9a-f-]{36}$/u
const FORBIDDEN_PROVIDER_KEYS = new Set(['__proto__', 'constructor', 'prototype'])

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

export function validateProvider(provider) {
  if (typeof provider !== 'string' || !SAFE_PROVIDER.test(provider) || FORBIDDEN_PROVIDER_KEYS.has(provider)) {
    throw new Error('provider must be a safe model-provider route id')
  }
  return provider
}

export function deriveCredentialRef(provider) {
  const safe = validateProvider(provider).toUpperCase().replace(/[^A-Z0-9]+/gu, '_')
  const stem = /^[A-Z_]/u.test(safe) ? safe : `DSH_${safe}`
  return `${stem}_API_KEY`
}

export function vaultRecordId(provider) {
  validateProvider(provider)
  return `provider-${createHash('sha256').update(provider).digest('hex').slice(0, 24)}`
}

export function normalizeLabel(value) {
  if (typeof value !== 'string') throw new Error('label must be a string')
  const label = value.trim()
  if (label.length === 0) throw new Error('label is required')
  if (label.length > MAX_LABEL_LENGTH) throw new Error(`label must not exceed ${String(MAX_LABEL_LENGTH)} characters`)
  return label
}

export function validateApiKey(value) {
  if (typeof value !== 'string') throw new Error('apiKey must be a string')
  const key = value.trim()
  if (key.length === 0) throw new Error('apiKey is required')
  if (!LEGAL_API_KEY.test(key)) throw new Error('apiKey must contain printable ASCII characters without spaces')
  return key
}

export function emptyVault(provider) {
  return { version: VAULT_VERSION, provider: validateProvider(provider), entries: [] }
}

function parseEntry(value) {
  if (!isRecord(value) || typeof value.id !== 'string' || !SAFE_ENTRY_ID.test(value.id)) {
    throw new Error('stored API-key entry has an invalid id')
  }
  const label = normalizeLabel(value.label)
  const apiKey = validateApiKey(value.apiKey)
  const createdAt = Number(value.createdAt)
  const updatedAt = Number(value.updatedAt)
  if (!Number.isSafeInteger(createdAt) || createdAt <= 0 || !Number.isSafeInteger(updatedAt) || updatedAt <= 0) {
    throw new Error('stored API-key entry has an invalid timestamp')
  }
  return { id: value.id, label, apiKey, createdAt, updatedAt }
}

export function parseVaultRecord(record, provider) {
  const expectedProvider = validateProvider(provider)
  if (record === undefined) return emptyVault(expectedProvider)
  if (!isRecord(record) || record.kind !== 'grant' || !isRecord(record.payload)) {
    throw new Error('stored API-key vault has an unsupported record format')
  }
  const payload = record.payload
  if (payload.version !== VAULT_VERSION || payload.provider !== expectedProvider || !Array.isArray(payload.entries)) {
    throw new Error('stored API-key vault is incompatible with this plugin version')
  }
  if (payload.entries.length > MAX_KEYS_PER_PROVIDER) throw new Error('stored API-key vault exceeds the entry limit')
  const entries = payload.entries.map(parseEntry)
  const ids = new Set(entries.map(entry => entry.id))
  if (ids.size !== entries.length) throw new Error('stored API-key vault contains duplicate ids')
  return { version: VAULT_VERSION, provider: expectedProvider, entries }
}

export function toCredentialRecord(vault) {
  const parsed = parseVaultRecord({ kind: 'grant', payload: vault }, vault.provider)
  return { kind: 'grant', payload: parsed }
}

export function addVaultEntry(vault, input, now = Date.now(), id = `key-${randomUUID()}`) {
  const parsed = parseVaultRecord({ kind: 'grant', payload: vault }, vault.provider)
  if (parsed.entries.length >= MAX_KEYS_PER_PROVIDER) {
    throw new Error(`a provider can save at most ${String(MAX_KEYS_PER_PROVIDER)} API keys`)
  }
  if (!SAFE_ENTRY_ID.test(id)) throw new Error('generated API-key entry id is invalid')
  if (!Number.isSafeInteger(now) || now <= 0) throw new Error('timestamp is invalid')
  const apiKey = validateApiKey(input?.apiKey)
  if (parsed.entries.some(entry => sameSecret(entry.apiKey, apiKey))) {
    throw new Error('this API key is already saved for the provider')
  }
  const entry = {
    id,
    label: normalizeLabel(input?.label),
    apiKey,
    createdAt: now,
    updatedAt: now,
  }
  return { vault: { ...parsed, entries: [...parsed.entries, entry] }, entry }
}

export function updateVaultEntry(vault, input, now = Date.now()) {
  const parsed = parseVaultRecord({ kind: 'grant', payload: vault }, vault.provider)
  if (!isRecord(input) || typeof input.id !== 'string') throw new Error('entry id is required')
  const index = parsed.entries.findIndex(entry => entry.id === input.id)
  if (index < 0) throw new Error('saved API-key entry was not found')
  if (!Number.isSafeInteger(now) || now <= 0) throw new Error('timestamp is invalid')
  const apiKey = input.apiKey === undefined || input.apiKey === ''
    ? parsed.entries[index].apiKey
    : validateApiKey(input.apiKey)
  if (parsed.entries.some((entry, position) => position !== index && sameSecret(entry.apiKey, apiKey))) {
    throw new Error('this API key is already saved for the provider')
  }
  const entries = [...parsed.entries]
  entries[index] = {
    ...entries[index],
    label: normalizeLabel(input.label),
    apiKey,
    updatedAt: now,
  }
  return { ...parsed, entries }
}

export function removeVaultEntry(vault, id) {
  const parsed = parseVaultRecord({ kind: 'grant', payload: vault }, vault.provider)
  if (typeof id !== 'string' || !SAFE_ENTRY_ID.test(id)) throw new Error('entry id is invalid')
  if (!parsed.entries.some(entry => entry.id === id)) throw new Error('saved API-key entry was not found')
  return { ...parsed, entries: parsed.entries.filter(entry => entry.id !== id) }
}

export function sameSecret(left, right) {
  if (typeof left !== 'string' || typeof right !== 'string') return false
  const a = createHash('sha256').update(left).digest()
  const b = createHash('sha256').update(right).digest()
  return timingSafeEqual(a, b)
}

export function projectVault(vault, currentValue, credential) {
  const parsed = parseVaultRecord({ kind: 'grant', payload: vault }, vault.provider)
  const active = parsed.entries.find(entry => sameSecret(entry.apiKey, currentValue))
  return {
    provider: parsed.provider,
    activeId: active?.id ?? null,
    currentMatchesSaved: active !== undefined,
    credential: {
      ref: credential.ref,
      configured: credential.configured === true,
      writable: credential.writable === true,
      ...(typeof credential.source === 'string' ? { source: credential.source } : {}),
    },
    entries: parsed.entries.map(entry => ({
      id: entry.id,
      label: entry.label,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
      active: entry.id === active?.id,
    })),
  }
}
