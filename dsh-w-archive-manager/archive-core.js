export const RETENTION_DAYS = 30
export const RETENTION_MS = RETENTION_DAYS * 24 * 60 * 60 * 1000
export const STATE_VERSION = 2

function finiteTimestamp(value, fallback) {
  const number = Number(value)
  return Number.isFinite(number) && number >= 0 ? Math.trunc(number) : fallback
}

function normalizeEntry(value, fallback) {
  const source = value !== null && typeof value === 'object' && !Array.isArray(value) ? value : {}
  const archivedAt = finiteTimestamp(source.archivedAt, fallback)
  const deleteRequestedAt = source.deleteRequestedAt === undefined
    ? undefined
    : finiteTimestamp(source.deleteRequestedAt, fallback)
  return { archivedAt, ...deleteRequestedAt === undefined ? {} : { deleteRequestedAt } }
}

function normalizeTombstone(value, fallback) {
  const source = value !== null && typeof value === 'object' && !Array.isArray(value) ? value : {}
  return { purgedAt: finiteTimestamp(source.purgedAt, fallback) }
}

export function normalizeState(value, now = Date.now()) {
  const source = value !== null && typeof value === 'object' && !Array.isArray(value) ? value : {}
  const entries = {}
  const tombstones = {}
  if (source.entries !== null && typeof source.entries === 'object' && !Array.isArray(source.entries)) {
    for (const [id, entry] of Object.entries(source.entries)) {
      if (id.length > 0) entries[id] = normalizeEntry(entry, now)
    }
  }
  if (source.tombstones !== null && typeof source.tombstones === 'object' && !Array.isArray(source.tombstones)) {
    for (const [id, tombstone] of Object.entries(source.tombstones)) {
      if (id.length > 0) tombstones[id] = normalizeTombstone(tombstone, now)
    }
  }
  return {
    version: STATE_VERSION,
    entries,
    tombstones,
    legacyRecoveryCompleted: source.version === STATE_VERSION
      ? source.legacyRecoveryCompleted === true
      : false,
  }
}

export function isDue(entry, now = Date.now(), retentionMs = RETENTION_MS) {
  return entry.deleteRequestedAt !== undefined || now - entry.archivedAt >= retentionMs
}

export function reconcileEntries(state, archivedIds, now = Date.now()) {
  const archived = new Set(archivedIds)
  const entries = {}
  for (const id of archived) {
    if (state.tombstones[id] !== undefined) continue
    entries[id] = state.entries[id] ?? { archivedAt: now }
  }
  for (const [id, entry] of Object.entries(state.entries)) {
    if (entry.deleteRequestedAt === undefined || state.tombstones[id] !== undefined) continue
    entries[id] = entry
  }
  return { ...state, entries }
}

export function legacyRecoveryIds(state, archivedIds) {
  if (state.legacyRecoveryCompleted) return []
  const archived = new Set(archivedIds)
  return Object.keys(state.entries).filter(id => !archived.has(id))
}

export function completeLegacyRecovery(state) {
  return state.legacyRecoveryCompleted ? state : { ...state, legacyRecoveryCompleted: true }
}

export function extractSessionHeader(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('session persistence returned an invalid list item')
  }
  const candidate = value.header !== null && typeof value.header === 'object' && !Array.isArray(value.header)
    ? value.header
    : value
  if (typeof candidate.id !== 'string' || candidate.id.length === 0) {
    throw new Error('session persistence returned an item without a valid header id')
  }
  return candidate
}

export function indexSessionHeaders(values) {
  if (!Array.isArray(values)) throw new Error('session persistence list result must be an array')
  const headers = new Map()
  for (const value of values) {
    const header = extractSessionHeader(value)
    if (headers.has(header.id)) throw new Error(`session persistence returned duplicate id "${header.id}"`)
    headers.set(header.id, header)
  }
  return headers
}

export function publicItems(state) {
  return Object.entries(state.entries)
    .filter(([, entry]) => entry.deleteRequestedAt === undefined)
    .map(([sessionId, entry]) => ({ sessionId, archivedAt: entry.archivedAt }))
}

export function markDeleteRequested(state, sessionId, now = Date.now()) {
  const entry = state.entries[sessionId]
  if (entry === undefined) return state
  return {
    ...state,
    entries: {
      ...state.entries,
      [sessionId]: { ...entry, deleteRequestedAt: entry.deleteRequestedAt ?? now },
    },
  }
}

export function markPurged(state, sessionId, now = Date.now()) {
  const entries = { ...state.entries }
  delete entries[sessionId]
  return {
    ...state,
    entries,
    tombstones: { ...state.tombstones, [sessionId]: { purgedAt: now } },
  }
}

export function clearTombstones(state, sessionIds) {
  const tombstones = { ...state.tombstones }
  for (const sessionId of sessionIds) delete tombstones[sessionId]
  return { ...state, tombstones }
}
