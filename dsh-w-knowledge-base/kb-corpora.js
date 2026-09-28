/**
 * dsh-w-knowledge-base — style-corpus registry.
 *
 * Writing mode used to have one corpus. It now has any number of isolated
 * corpora ("素材库"), each its own directory with its own notes and banned
 * list, so an adult corpus never leaks into a thriller and vice versa. The
 * registry (`corpora.json` under the knowledge-base root) names them, records
 * which one is the default, and maps each id to a directory. The original
 * `style-corpus/` directory stays in place as the `default` corpus.
 *
 * Pure data helpers only: no filesystem, so they are unit-testable.
 */

/** Registry file under the knowledge-base root. */
export const CORPORA_FILE = 'corpora.json'
/** Parent directory for corpora created after the first one. */
export const CORPORA_DIR = 'corpora'
/** The pre-existing single corpus keeps its id and directory. */
export const DEFAULT_CORPUS_ID = 'default'
export const DEFAULT_CORPUS_DIR = 'style-corpus'
export const MAX_CORPORA = 40
export const MAX_CORPUS_NAME = 24
export const MAX_CORPUS_DESCRIPTION = 200
/** Sentinel a caller passes to write without any corpus. */
export const NO_CORPUS = 'none'
export const REGISTRY_VERSION = 1

function text(value, limit) {
  return typeof value === 'string' ? value.trim().slice(0, limit) : ''
}

function corpusError(code, message) {
  const error = new Error(message)
  error.code = code
  return error
}

function defaultEntry(now) {
  return {
    id: DEFAULT_CORPUS_ID,
    name: '默认素材库',
    description: '',
    adult: false,
    dir: DEFAULT_CORPUS_DIR,
    createdAt: new Date(now).toISOString(),
  }
}

/** A safe directory for a corpus id; never escapes the corpora folder. */
export function corpusDir(corpusId) {
  if (corpusId === DEFAULT_CORPUS_ID) return DEFAULT_CORPUS_DIR
  return CORPORA_DIR + '/' + corpusId
}

function normalizeEntry(value, now) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const id = text(value.id, 40)
  if (!/^[a-z0-9][a-z0-9-]{0,39}$/u.test(id)) return null
  const name = text(value.name, MAX_CORPUS_NAME) || (id === DEFAULT_CORPUS_ID ? '默认素材库' : id)
  return {
    id,
    name,
    description: text(value.description, MAX_CORPUS_DESCRIPTION),
    adult: value.adult === true,
    // The directory is derived, never trusted from the file.
    dir: corpusDir(id),
    createdAt: typeof value.createdAt === 'string' && value.createdAt ? value.createdAt : new Date(now).toISOString(),
  }
}

/**
 * Normalize a registry read from disk (or nothing): drop malformed and
 * duplicate entries, always keep the default corpus, and keep `active`
 * pointing at an existing corpus.
 */
export function normalizeRegistry(value, now = Date.now()) {
  const input = value && typeof value === 'object' && !Array.isArray(value) ? value : {}
  const corpora = []
  const seen = new Set()
  for (const candidate of Array.isArray(input.corpora) ? input.corpora : []) {
    const entry = normalizeEntry(candidate, now)
    if (!entry || seen.has(entry.id)) continue
    seen.add(entry.id)
    corpora.push(entry)
    if (corpora.length >= MAX_CORPORA) break
  }
  if (!seen.has(DEFAULT_CORPUS_ID)) corpora.unshift(defaultEntry(now))
  const active = typeof input.active === 'string' && corpora.some(entry => entry.id === input.active)
    ? input.active
    : corpora[0].id
  return { version: REGISTRY_VERSION, active, corpora }
}

export function findCorpus(registry, corpusId) {
  return registry.corpora.find(entry => entry.id === corpusId) ?? null
}

function assertUniqueName(registry, name, exceptId) {
  const key = name.toLowerCase()
  if (registry.corpora.some(entry => entry.id !== exceptId && entry.name.toLowerCase() === key)) {
    throw corpusError('KB_CORPUS_NAME_TAKEN', `a corpus named "${name}" already exists`)
  }
}

/** Mint a short id that no corpus holds. */
export function mintCorpusId(registry, now = Date.now(), random = Math.random) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const id = 'c' + now.toString(36).slice(-5) + Math.floor(random() * 36 ** 3).toString(36).padStart(3, '0')
    if (!findCorpus(registry, id)) return id
  }
  throw corpusError('KB_CORPUS_ID', 'could not mint a corpus id')
}

/** Add a corpus; returns the next registry and the new entry. */
export function addCorpus(registry, input, { now = Date.now(), random = Math.random } = {}) {
  const source = input && typeof input === 'object' ? input : {}
  const name = text(source.name, MAX_CORPUS_NAME)
  if (!name) throw corpusError('KB_CORPUS_NAME_REQUIRED', 'a corpus needs a name')
  if (registry.corpora.length >= MAX_CORPORA) throw corpusError('KB_CORPUS_LIMIT', `at most ${MAX_CORPORA} corpora`)
  assertUniqueName(registry, name, null)
  const id = mintCorpusId(registry, now, random)
  const entry = {
    id,
    name,
    description: text(source.description, MAX_CORPUS_DESCRIPTION),
    adult: source.adult === true,
    dir: corpusDir(id),
    createdAt: new Date(now).toISOString(),
  }
  return { registry: { ...registry, corpora: [...registry.corpora, entry] }, entry }
}

/** Rename or re-describe a corpus; its id and directory never change. */
export function updateCorpus(registry, corpusId, patch) {
  const current = findCorpus(registry, corpusId)
  if (!current) throw corpusError('KB_CORPUS_UNKNOWN', `unknown corpus '${corpusId}'`)
  const source = patch && typeof patch === 'object' ? patch : {}
  const next = { ...current }
  if (Object.hasOwn(source, 'name')) {
    const name = text(source.name, MAX_CORPUS_NAME)
    if (!name) throw corpusError('KB_CORPUS_NAME_REQUIRED', 'a corpus needs a name')
    assertUniqueName(registry, name, corpusId)
    next.name = name
  }
  if (Object.hasOwn(source, 'description')) next.description = text(source.description, MAX_CORPUS_DESCRIPTION)
  if (Object.hasOwn(source, 'adult')) next.adult = source.adult === true
  return { ...registry, corpora: registry.corpora.map(entry => (entry.id === corpusId ? next : entry)) }
}

/** Drop a corpus from the registry; the last one cannot go. */
export function removeCorpus(registry, corpusId) {
  if (!findCorpus(registry, corpusId)) throw corpusError('KB_CORPUS_UNKNOWN', `unknown corpus '${corpusId}'`)
  if (registry.corpora.length <= 1) throw corpusError('KB_CORPUS_LAST', 'the last corpus cannot be deleted')
  const corpora = registry.corpora.filter(entry => entry.id !== corpusId)
  const active = registry.active === corpusId ? corpora[0].id : registry.active
  return { ...registry, corpora, active }
}

export function setActiveCorpus(registry, corpusId) {
  if (!findCorpus(registry, corpusId)) throw corpusError('KB_CORPUS_UNKNOWN', `unknown corpus '${corpusId}'`)
  return { ...registry, active: corpusId }
}

/**
 * Normalize what a scope resolver (e.g. the novel-writing plugin) returns for
 * one conversation. `null` means "no opinion"; `{ writing: false }` keeps the
 * conversation out of every corpus; otherwise writing mode with a corpus id,
 * or `null` to follow the default corpus.
 */
export function normalizeScopeRequest(value) {
  if (!value || typeof value !== 'object') return null
  if (value.writing === false) return { writing: false, corpusId: null }
  const corpusId = typeof value.corpusId === 'string' && value.corpusId.trim() !== '' && value.corpusId !== NO_CORPUS
    ? value.corpusId.trim()
    : null
  if (value.corpusId === NO_CORPUS) return { writing: false, corpusId: null }
  return { writing: true, corpusId, source: typeof value.source === 'string' ? value.source : '' }
}
