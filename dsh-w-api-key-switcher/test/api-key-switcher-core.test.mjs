import test from 'node:test'
import assert from 'node:assert/strict'
import {
  addVaultEntry,
  deriveCredentialRef,
  emptyVault,
  parseVaultRecord,
  projectVault,
  removeVaultEntry,
  sameSecret,
  toCredentialRecord,
  updateVaultEntry,
  validateApiKey,
  vaultRecordId,
} from '../api-key-switcher-core.js'

const PROVIDER = 'cc-vibe'
const ENTRY_ID = 'key-00000000-0000-4000-8000-000000000001'

test('derives stable credential and private-record addresses', () => {
  assert.equal(deriveCredentialRef(PROVIDER), 'CC_VIBE_API_KEY')
  assert.match(vaultRecordId(PROVIDER), /^provider-[0-9a-f]{24}$/u)
  assert.equal(vaultRecordId(PROVIDER), vaultRecordId(PROVIDER))
  assert.notEqual(vaultRecordId(PROVIDER), vaultRecordId('another-provider'))
})

test('rejects blank and spaced API keys', () => {
  assert.throws(() => validateApiKey('   '), /required/u)
  assert.throws(() => validateApiKey('sk has spaces'), /printable ASCII/u)
  assert.equal(validateApiKey('  sk-live_123  '), 'sk-live_123')
})

test('stores a key in a credential record but projects no secret to the client', () => {
  const added = addVaultEntry(emptyVault(PROVIDER), {
    label: '主账号', apiKey: 'sk-secret-value',
  }, 1000, ENTRY_ID)
  const record = toCredentialRecord(added.vault)
  const restored = parseVaultRecord(record, PROVIDER)
  assert.equal(restored.entries[0].apiKey, 'sk-secret-value')
  const view = projectVault(restored, 'sk-secret-value', {
    ref: 'CC_VIBE_API_KEY', configured: true, writable: true, source: 'file',
  })
  assert.equal(view.activeId, ENTRY_ID)
  assert.equal(view.entries[0].active, true)
  assert.equal(JSON.stringify(view).includes('sk-secret-value'), false)
  assert.deepEqual(view.entries[0], {
    id: ENTRY_ID, label: '主账号', createdAt: 1000, updatedAt: 1000, active: true,
  })
})

test('updates the name without replacing the stored secret', () => {
  const added = addVaultEntry(emptyVault(PROVIDER), {
    label: '旧名称', apiKey: 'sk-one',
  }, 1000, ENTRY_ID)
  const updated = updateVaultEntry(added.vault, {
    id: ENTRY_ID, label: '备用额度',
  }, 2000)
  assert.equal(updated.entries[0].apiKey, 'sk-one')
  assert.equal(updated.entries[0].label, '备用额度')
  assert.equal(updated.entries[0].updatedAt, 2000)
})

test('replaces one saved key without changing its identity or other entries', () => {
  const first = addVaultEntry(emptyVault(PROVIDER), { label: '主账号', apiKey: 'sk-old' }, 1000, ENTRY_ID)
  const secondId = 'key-00000000-0000-4000-8000-000000000002'
  const second = addVaultEntry(first.vault, { label: '备用', apiKey: 'sk-backup' }, 1100, secondId)
  const updated = updateVaultEntry(second.vault, {
    id: ENTRY_ID, label: '主账号', apiKey: 'sk-new',
  }, 2000)
  assert.deepEqual(updated.entries[0], {
    id: ENTRY_ID, label: '主账号', apiKey: 'sk-new', createdAt: 1000, updatedAt: 2000,
  })
  assert.deepEqual(updated.entries[1], second.vault.entries[1])
  const view = projectVault(updated, 'sk-new', { ref: 'CC_VIBE_API_KEY', configured: true, writable: true })
  assert.equal(view.activeId, ENTRY_ID)
  assert.equal(JSON.stringify(view).includes('sk-new'), false)
})

test('rejects replacement with a duplicate or invalid key', () => {
  const first = addVaultEntry(emptyVault(PROVIDER), { label: '主账号', apiKey: 'sk-old' }, 1000, ENTRY_ID)
  const secondId = 'key-00000000-0000-4000-8000-000000000002'
  const second = addVaultEntry(first.vault, { label: '备用', apiKey: 'sk-backup' }, 1100, secondId)
  assert.throws(() => updateVaultEntry(second.vault, {
    id: ENTRY_ID, label: '主账号', apiKey: 'sk-backup',
  }, 2000), /already saved/u)
  assert.throws(() => updateVaultEntry(second.vault, {
    id: ENTRY_ID, label: '主账号', apiKey: 'sk with spaces',
  }, 2000), /printable ASCII/u)
  assert.throws(() => updateVaultEntry(second.vault, {
    id: ENTRY_ID, label: '主账号', apiKey: '   ',
  }, 2000), /required/u)
})

test('loads legacy entries while removing their obsolete note field', () => {
  const restored = parseVaultRecord({
    kind: 'grant',
    payload: {
      version: 1,
      provider: PROVIDER,
      entries: [{
        id: ENTRY_ID,
        label: '旧配置',
        note: '旧版本备注',
        apiKey: 'sk-legacy',
        createdAt: 1000,
        updatedAt: 1000,
      }],
    },
  }, PROVIDER)
  assert.equal(restored.entries[0].label, '旧配置')
  assert.equal(Object.hasOwn(restored.entries[0], 'note'), false)
})

test('removes only the requested saved key and compares secrets by value', () => {
  const first = addVaultEntry(emptyVault(PROVIDER), { label: 'A', apiKey: 'sk-a' }, 1000, ENTRY_ID)
  const secondId = 'key-00000000-0000-4000-8000-000000000002'
  const second = addVaultEntry(first.vault, { label: 'B', apiKey: 'sk-b' }, 2000, secondId)
  assert.equal(sameSecret('sk-a', 'sk-a'), true)
  assert.equal(sameSecret('sk-a', 'sk-b'), false)
  const remaining = removeVaultEntry(second.vault, ENTRY_ID)
  assert.deepEqual(remaining.entries.map(entry => entry.id), [secondId])
})

test('rejects saving the same secret twice under different labels', () => {
  const first = addVaultEntry(emptyVault(PROVIDER), { label: 'A', apiKey: 'sk-a' }, 1000, ENTRY_ID)
  assert.throws(() => addVaultEntry(first.vault, {
    label: 'duplicate', apiKey: 'sk-a',
  }, 2000, 'key-00000000-0000-4000-8000-000000000002'), /already saved/u)
})

test('fails loudly for malformed credential records instead of erasing them', () => {
  assert.throws(() => parseVaultRecord({ kind: 'api-key', key: 'x' }, PROVIDER), /unsupported/u)
  assert.throws(() => parseVaultRecord({
    kind: 'grant', payload: { version: 1, provider: PROVIDER, entries: [{ id: 'bad' }] },
  }, PROVIDER), /invalid id/u)
})
