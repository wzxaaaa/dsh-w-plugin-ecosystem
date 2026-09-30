import { createHash } from 'node:crypto'
import { readFile, writeFile } from 'node:fs/promises'
import { gunzipSync } from 'node:zlib'
import { compareSemver } from './custom-plugin-core.js'

export const REPOSITORY = 'wzxaaaa/dsh-w-plugin-ecosystem'
const CODELOAD = `https://codeload.github.com/${REPOSITORY}/tar.gz/`
const TTL = 10 * 60 * 1000
const MAX_DOWNLOAD = 128 * 1024 * 1024
const MAX_EXPANDED = 256 * 1024 * 1024
const SHA = /^[a-f0-9]{40}$/u
const NAME = /^dsh-w-[a-z0-9][a-z0-9-]*$/u
const snapshots = new Map()
const pendingDownloads = new Map()

export function validCatalogEntry(entry) {
  return NAME.test(entry?.moduleName ?? '') && compareSemver(entry.version, entry.version) === 0
    && typeof entry.description === 'string' && entry.description.length <= 5000
    && SHA.test(entry.ref ?? '') && (entry.archiveSha === null || SHA.test(entry.archiveSha ?? ''))
}

function blobDigest(bytes) {
  return createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex')
}

function tarText(bytes) { return bytes.toString('utf8').split('\0')[0] }
function tarNumber(bytes) {
  const text = tarText(bytes).trim()
  if (!/^[0-7]+$/u.test(text)) throw new Error('Repository tar header has an invalid number')
  return parseInt(text, 8)
}

function paxRecords(bytes) {
  const records = {}
  let offset = 0
  while (offset < bytes.length) {
    const space = bytes.indexOf(32, offset)
    const lengthText = bytes.subarray(offset, space).toString('ascii')
    const length = Number(lengthText)
    if (space < offset || !/^[0-9]+$/u.test(lengthText) || !Number.isSafeInteger(length)
      || length <= space - offset + 1 || offset + length > bytes.length || bytes[offset + length - 1] !== 10) {
      throw new Error('Repository tar metadata is invalid')
    }
    const record = bytes.subarray(space + 1, offset + length - 1).toString('utf8')
    const equals = record.indexOf('=')
    if (equals < 1) throw new Error('Repository tar metadata is invalid')
    records[record.slice(0, equals)] = record.slice(equals + 1)
    offset += length
  }
  return records
}

/** Read selected files in memory only; never extract repository paths to disk. */
export function parseRepositorySnapshot(compressed, expectedRef) {
  if (compressed.length > MAX_DOWNLOAD) throw new Error('Repository download exceeds the size limit')
  const tar = gunzipSync(compressed, { maxOutputLength: MAX_EXPANDED })
  const files = new Map()
  let ref = '', root = '', localPax = {}, offset = 0, count = 0, ended = false
  while (offset + 512 <= tar.length) {
    const header = tar.subarray(offset, offset + 512)
    if (header.every(byte => byte === 0)) { ended = true; break }
    if (++count > 20_000) throw new Error('Repository contains too many files')
    let checksum = 0
    for (let i = 0; i < 512; i++) checksum += i >= 148 && i < 156 ? 32 : header[i]
    if (checksum !== tarNumber(header.subarray(148, 156))) throw new Error('Repository tar checksum does not match')
    const size = tarNumber(header.subarray(124, 136))
    const next = offset + 512 + Math.ceil(size / 512) * 512
    if (next > tar.length) throw new Error('Repository tar is truncated')
    const bytes = tar.subarray(offset + 512, offset + 512 + size)
    const type = String.fromCharCode(header[156])
    offset = next
    if (type === 'g' || type === 'x') {
      if (size > 1024 * 1024) throw new Error('Repository tar metadata exceeds the size limit')
      const metadata = paxRecords(bytes)
      if (type === 'g') {
        if (metadata.comment) {
          if (ref && ref !== metadata.comment) throw new Error('Repository tar has conflicting commit references')
          ref = metadata.comment
        }
      } else localPax = metadata
      continue
    }
    const prefix = tarText(header.subarray(345, 500))
    const path = localPax.path ?? `${prefix ? `${prefix}/` : ''}${tarText(header.subarray(0, 100))}`
    if (localPax.size !== undefined && Number(localPax.size) !== size) throw new Error('Repository tar size metadata does not match')
    localPax = {}
    const parts = path.replace(/\/$/u, '').split('/')
    if (parts.some(part => !part || part === '.' || part === '..') || /[\\\0]/u.test(path)) throw new Error('Repository tar path is invalid')
    if (!root) root = parts[0]
    if (parts[0] !== root) throw new Error('Repository tar contains multiple roots')
    const relative = parts.slice(1).join('/')
    if (!/^dsh-w-[a-z0-9-]+\/(?:package\.json|dsh-w-[a-z0-9.-]+\.tgz)$/u.test(relative)) continue
    if (type !== '0' && type !== '\0') throw new Error('Repository plugin file must be a regular file')
    if (files.has(relative)) throw new Error('Repository tar contains duplicate plugin files')
    files.set(relative, Buffer.from(bytes))
  }
  if (!ended || !SHA.test(ref) || (expectedRef && ref !== expectedRef)) throw new Error('Repository snapshot commit does not match')
  return { ref, files }
}

async function downloadSnapshot(ref) {
  if (ref !== 'refs/heads/main' && !SHA.test(ref)) throw new Error('Invalid repository snapshot reference')
  if (SHA.test(ref) && snapshots.has(ref)) return snapshots.get(ref)
  if (pendingDownloads.has(ref)) return pendingDownloads.get(ref)
  const pending = (async () => {
    const response = await fetch(`${CODELOAD}${ref}`, {
      headers: { 'user-agent': 'dsh-w-custom-plugins' },
      redirect: 'error', signal: AbortSignal.timeout(30_000),
    })
    if (!response.ok) throw new Error(`GitHub repository download HTTP ${response.status}`)
    const chunks = []
    let size = 0
    for await (const chunk of response.body) {
      size += chunk.length
      if (size > MAX_DOWNLOAD) throw new Error('Repository download exceeds the size limit')
      chunks.push(chunk)
    }
    const snapshot = parseRepositorySnapshot(Buffer.concat(chunks), SHA.test(ref) ? ref : undefined)
    snapshots.delete(snapshot.ref)
    snapshots.set(snapshot.ref, snapshot)
    // Retain recent archives for installs without downloading the same repository again.
    while (snapshots.size > 2) snapshots.delete(snapshots.keys().next().value)
    return snapshot
  })()
  pendingDownloads.set(ref, pending)
  try { return await pending } finally { pendingDownloads.delete(ref) }
}

/** One public archive request discovers every W plugin without using the REST API. */
export async function fetchRepositoryCatalog() {
  const { ref, files } = await downloadSnapshot('refs/heads/main')
  const manifests = [...files].filter(([path]) => path.endsWith('/package.json'))
  if (manifests.length > 200) throw new Error('Repository contains too many plugins')
  const entries = []
  for (const [path, bytes] of manifests) {
    if (bytes.length > 1024 * 1024) throw new Error('Repository manifest exceeds the size limit')
    const manifest = JSON.parse(bytes.toString('utf8'))
    const moduleName = path.split('/')[0]
    if (manifest.name !== moduleName || typeof manifest.dsh?.bundle?.patch !== 'string') continue
    const archive = files.get(`${moduleName}/${moduleName}-${manifest.version}.tgz`)
    const entry = { moduleName, version: manifest.version, description: typeof manifest.description === 'string' ? manifest.description.slice(0, 5000) : '', ref, archiveSha: archive ? blobDigest(archive) : null }
    if (!validCatalogEntry(entry)) throw new Error(`Invalid repository manifest: ${moduleName}`)
    entries.push(entry)
  }
  return entries.sort((a, b) => a.moduleName.localeCompare(b.moduleName))
}

export async function readCatalogCache(path) {
  try {
    const stat = await readFile(path, 'utf8')
    if (Buffer.byteLength(stat) > 2 * 1024 * 1024) return undefined
    const cache = JSON.parse(stat)
    if (!Number.isFinite(cache.time) || !Array.isArray(cache.entries) || !cache.entries.every(validCatalogEntry)) return undefined
    return cache
  } catch { return undefined }
}

async function bundledCatalog() {
  const seed = JSON.parse(await readFile(new URL('./repository-seed.json', import.meta.url), 'utf8'))
  if (seed.repository !== REPOSITORY || !Array.isArray(seed.entries) || !seed.entries.every(validCatalogEntry)) throw new Error('Bundled repository catalogue is invalid')
  return seed.entries
}

export class RepositoryCatalog {
  constructor(cachePath, fetcher = fetchRepositoryCatalog) { this.cachePath = cachePath; this.fetcher = fetcher }
  async snapshot(force = false) {
    if (!this.cache) this.cache = await readCatalogCache(this.cachePath)
    if (!force && this.lastFailure && Date.now() - this.lastFailure.time < 30_000) return this.lastFailure.snapshot
    if (!force && this.cache && Date.now() - this.cache.time < TTL) return { entries: this.cache.entries, warning: '' }
    if (!this.pending) this.pending = (async () => {
      try {
        const entries = await this.fetcher(this.cache?.entries ?? [])
        this.cache = { time: Date.now(), entries }
        this.lastFailure = undefined
        await writeFile(this.cachePath, JSON.stringify(this.cache)).catch(() => {})
        return { entries, warning: '' }
      } catch (error) {
        const entries = this.cache?.entries?.length ? this.cache.entries : await bundledCatalog()
        const snapshot = { entries, warning: String(error.message || error), stale: true }
        this.lastFailure = { time: Date.now(), snapshot }
        return snapshot
      } finally { this.pending = undefined }
    })()
    return this.pending
  }
}

/** Install the exact archive from the catalogue commit, verifying its Git blob digest. */
export async function downloadRepositoryArchive(entry, destination) {
  if (!validCatalogEntry(entry) || entry.archiveSha === null) throw new Error('Repository has not published an archive for this plugin version')
  const snapshot = await downloadSnapshot(entry.ref)
  const bytes = snapshot.files.get(`${entry.moduleName}/${entry.moduleName}-${entry.version}.tgz`)
  if (!bytes || blobDigest(bytes) !== entry.archiveSha) throw new Error('Repository archive digest does not match')
  await writeFile(destination, bytes, { flag: 'wx' })
}

export function mergeCatalog(installed, catalog) {
  const names = new Set(installed.map(entry => entry.moduleName))
  const byName = new Map(catalog.map(entry => [entry.moduleName, entry]))
  return [
    ...installed.map(entry => ({ ...entry, installed: true, latestVersion: byName.get(entry.moduleName)?.version ?? '', description: byName.get(entry.moduleName)?.description ?? '' })),
    ...catalog.filter(entry => !names.has(entry.moduleName)).map(entry => ({ entryId: `repository:${entry.moduleName}`, moduleName: entry.moduleName, version: entry.version, description: entry.description, installed: false, enabled: false, downloadable: entry.archiveSha !== null })),
  ]
}
