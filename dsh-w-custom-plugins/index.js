/**
 * dsh-w-custom-plugins — Host half.
 *
 * Exposes a Typert Remote service `customPlugins`:
 *   - listCustom(): current non-builtin loader entries with their PERSISTED
 *     enabled state (read from the profile patch, so the switch reflects the
 *     saved intent immediately).
 *   - setEnabled(entryId, enabled): persist an enable/disable patch entry into
 *     the active profile's cordis.patch.yml AND apply it at runtime right away
 *     (entry.update({ disabled })), so no restart is required.
 *
 * NOTE: decorators are emitted in the tsdown-compiled form (__esDecorate +
 * __runInitializers) because the shipped Node runtime does not enable the
 * native stage-3 decorator syntax by default.
 */

import { Remote, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
import { spawn } from 'node:child_process'
import { createHash, randomUUID } from 'node:crypto'
import { createReadStream } from 'node:fs'
import { appendFile, copyFile, lstat, mkdir, mkdtemp, open, readFile, readdir, rename, rm, stat, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { basename, dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as yaml from 'js-yaml'

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
const MANAGER_PACKAGE = 'dsh-w-custom-plugins'
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

/** A loader row is "custom" when it is neither a shipped dsh package nor a cordis builtin. */
function isCustomModule(name) {
  if (typeof name !== 'string' || name.length === 0) return false
  if (name.startsWith('@deepseek-ai/')) return false
  if (name.startsWith('cordis:')) return false
  return true
}

/** Map an expanded Loader child id back to the profile-composition row id. */
function profileEntryId(entryId) {
  const includePrefix = 'include:'
  return entryId.startsWith(includePrefix) ? entryId.slice(includePrefix.length) : entryId
}

function updateDisabledPatch(data, persistedId, entryId, enabled) {
  const next = []
  for (const patch of data) {
    if (!patch || patch.disabled !== true || (patch.id !== persistedId && patch.id !== entryId)) {
      next.push(patch)
      continue
    }
    const preserved = { ...patch }
    delete preserved.disabled
    if (Object.keys(preserved).some(key => key !== 'id')) next.push(preserved)
  }
  if (!enabled) next.push({ id: persistedId, disabled: true })
  return next
}


const MAX_UPLOAD_BYTES = 128 * 1024 * 1024
const MAX_CHUNK_BYTES = 512 * 1024
const MAX_BASE64_CHARS = Math.ceil(MAX_CHUNK_BYTES / 3) * 4
const MAX_EXTRACTED_BYTES = 512 * 1024 * 1024
const MAX_EXTRACTED_FILES = 10_000
const MAX_PACKAGE_JSON_BYTES = 1024 * 1024
const MAX_COMMAND_OUTPUT_BYTES = 8 * 1024 * 1024
const COMMAND_TIMEOUT_MS = 5 * 60 * 1000
const UPLOAD_TTL_MS = 30 * 60 * 1000
const UPLOAD_SWEEP_MS = 5 * 60 * 1000

function archiveKind(fileName) {
  const lower = fileName.toLowerCase()
  if (lower.endsWith('.tar.gz')) return 'tgz'
  if (lower.endsWith('.tgz')) return 'tgz'
  if (lower.endsWith('.zip')) return 'zip'
  return undefined
}

function commandName(name) {
  return process.platform === 'win32' && name === 'pnpm' ? 'pnpm.cmd' : name
}

function runCommand(command, args, options = {}) {
  return new Promise((resolvePromise, reject) => {
    const timeoutMs = options.timeoutMs ?? COMMAND_TIMEOUT_MS
    const maxOutputBytes = options.maxOutputBytes ?? MAX_COMMAND_OUTPUT_BYTES
    const child = spawn(command, args, {
      cwd: options.cwd,
      env: { ...process.env, CI: 'true', ...options.env },
      windowsHide: true,
      shell: options.shell === true,
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    let stdout = ''
    let stderr = ''
    let outputBytes = 0
    let abortError
    let settled = false
    child.stdout.setEncoding('utf8')
    child.stderr.setEncoding('utf8')
    const abort = (error) => {
      if (abortError !== undefined) return
      abortError = error
      child.kill('SIGKILL')
    }
    const appendOutput = (target, chunk) => {
      outputBytes += Buffer.byteLength(chunk, 'utf8')
      if (outputBytes > maxOutputBytes) {
        abort(new Error(`${command} produced more than ${String(maxOutputBytes)} bytes of output`))
        return target
      }
      return target + chunk
    }
    child.stdout.on('data', chunk => { stdout = appendOutput(stdout, chunk) })
    child.stderr.on('data', chunk => { stderr = appendOutput(stderr, chunk) })
    const timer = setTimeout(() => abort(new Error(`${command} timed out after ${String(timeoutMs)} ms`)), timeoutMs)
    const settle = (error, code) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      if (error !== undefined) {
        reject(error)
      } else if (code === 0) {
        resolvePromise({ stdout, stderr })
      } else {
        const detail = `${stdout}\n${stderr}`.trim().slice(-8000)
        reject(new Error(`${command} exited with code ${String(code)}${detail ? `\n${detail}` : ''}`))
      }
    }
    child.once('error', error => settle(error))
    child.once('close', code => settle(abortError, code))
  })
}

function archiveLines(listing) {
  return listing.split(/\r?\n/u).filter(line => line.length > 0)
}

function assertSafeArchivePath(raw) {
  if (raw.length > 1024) throw new Error('Archive contains a path longer than 1024 characters')
  if (/[\u0000-\u001f\u007f]/u.test(raw)) throw new Error('Archive contains a path with control characters')
  const name = raw.replaceAll('\\', '/')
  if (name.startsWith('/') || /^[A-Za-z]:/u.test(name)) throw new Error(`Archive contains an absolute path: ${name}`)
  const parts = name.split('/')
  for (const part of parts) {
    if (part === '' || part === '.') continue
    if (part === '..') throw new Error(`Archive contains path traversal: ${name}`)
    if (/[<>:"|?*]/u.test(part)) throw new Error(`Archive contains a Windows-unsafe path: ${name}`)
    if (/[. ]$/u.test(part)) throw new Error(`Archive contains a path ending in a dot or space: ${name}`)
    const stem = part.split('.')[0].toUpperCase()
    if (/^(?:CON|PRN|AUX|NUL|CLOCK\$|CONIN\$|CONOUT\$|COM[1-9]|LPT[1-9])$/u.test(stem)) {
      throw new Error(`Archive contains a reserved Windows path: ${name}`)
    }
  }
}

function archiveEntrySize(tokens) {
  if (tokens.length >= 5 && tokens.slice(1, 5).every(token => /^\d+$/u.test(token))) return Number(tokens[4])
  if (tokens.length >= 3 && /^\d+$/u.test(tokens[2])) return Number(tokens[2])
  return Number.NaN
}

function inspectArchiveListings(pathListing, verboseListing) {
  const paths = archiveLines(pathListing)
  const details = archiveLines(verboseListing)
  if (paths.length === 0) throw new Error('Plugin archive is empty')
  if (paths.length > MAX_EXTRACTED_FILES) throw new Error(`Archive contains more than ${String(MAX_EXTRACTED_FILES)} entries`)
  if (details.length !== paths.length) throw new Error('Unable to verify every archive entry before extraction')
  let fileCount = 0
  let totalBytes = 0
  for (let index = 0; index < paths.length; index++) {
    assertSafeArchivePath(paths[index])
    const tokens = details[index].trimStart().split(/\s+/u)
    const type = tokens[0]?.[0]
    if (type !== '-' && type !== 'd') {
      throw new Error(`Archive contains a link or unsupported entry type: ${paths[index]}`)
    }
    const size = archiveEntrySize(tokens)
    if (!Number.isSafeInteger(size) || size < 0) throw new Error(`Unable to verify archive entry size: ${paths[index]}`)
    if (type === '-') {
      fileCount += 1
      totalBytes += size
      if (fileCount > MAX_EXTRACTED_FILES) throw new Error(`Archive contains more than ${String(MAX_EXTRACTED_FILES)} files`)
      if (totalBytes > MAX_EXTRACTED_BYTES) throw new Error('Archive expands beyond the 512 MB safety limit')
    }
  }
}

function isValidPackageName(name) {
  if (typeof name !== 'string' || name.length === 0 || name.length > 214 || name !== name.toLowerCase()) return false
  const part = '[a-z0-9][a-z0-9._~-]*'
  return new RegExp(`^(?:${part}|@${part}/${part})$`, 'u').test(name)
}

async function sha256File(path) {
  return new Promise((resolvePromise, reject) => {
    const hash = createHash('sha256')
    const stream = createReadStream(path)
    stream.on('data', chunk => hash.update(chunk))
    stream.once('error', reject)
    stream.once('end', () => resolvePromise(hash.digest('hex')))
  })
}

async function inspectExtractedTree(root) {
  const candidates = []
  let fileCount = 0
  let totalBytes = 0
  async function walk(dir) {
    const entries = await readdir(dir, { withFileTypes: true })
    for (const entry of entries) {
      const full = join(dir, entry.name)
      const info = await lstat(full)
      if (info.isSymbolicLink()) throw new Error(`Archive contains a symbolic link: ${relative(root, full)}`)
      if (info.isDirectory()) {
        await walk(full)
        continue
      }
      if (!info.isFile()) continue
      fileCount += 1
      totalBytes += info.size
      if (fileCount > MAX_EXTRACTED_FILES) throw new Error(`Archive contains more than ${String(MAX_EXTRACTED_FILES)} files`)
      if (totalBytes > MAX_EXTRACTED_BYTES) throw new Error('Archive expands beyond the 512 MB safety limit')
      if (entry.name !== 'package.json') continue
      if (info.size > MAX_PACKAGE_JSON_BYTES) throw new Error('A package.json file exceeds the 1 MB safety limit')
      let manifest
      try { manifest = JSON.parse(await readFile(full, 'utf8')) } catch { continue }
      const patch = manifest?.dsh?.bundle?.patch
      if (patch !== undefined) {
        if (!isValidPackageName(manifest?.name)) throw new Error('Plugin package.json has an invalid npm package name')
        if (typeof patch !== 'string' || patch.length === 0 || patch.length > 1024) {
          throw new Error(`Plugin ${manifest.name} has an invalid dsh.bundle.patch`)
        }
        if (manifest.version !== undefined && (typeof manifest.version !== 'string' || manifest.version.length > 128)) {
          throw new Error(`Plugin ${manifest.name} has an invalid version`)
        }
        const packageDir = dirname(full)
        const patchPath = resolve(packageDir, patch)
        const boundary = `${resolve(packageDir)}${sep}`
        if (patchPath !== resolve(packageDir) && !patchPath.startsWith(boundary)) {
          throw new Error(`Plugin patch escapes its package directory: ${patch}`)
        }
        try {
          const patchInfo = await lstat(patchPath)
          if (!patchInfo.isFile()) throw new Error('not a file')
        } catch {
          throw new Error(`Plugin ${manifest.name} declares a missing dsh.bundle.patch: ${patch}`)
        }
        candidates.push({ packageDir, manifest })
      }
    }
  }
  await walk(root)
  if (candidates.length === 0) throw new Error('No installable dsh.bundle package was found in the archive')
  if (candidates.length > 1) {
    throw new Error(`Archive contains multiple installable bundles: ${candidates.map(item => item.manifest.name).join(', ')}`)
  }
  return candidates[0]
}

let CustomPluginsGateway = (() => {
  let _classSuper = TypertRemoteService
  let _instanceExtraInitializers = []
  let _listCustom_decorators
  let _setEnabled_decorators
  let _beginInstall_decorators
  let _appendInstallChunk_decorators
  let _cancelInstall_decorators
  let _finishInstall_decorators
  return class CustomPluginsGateway extends _classSuper {
    static {
      const _metadata = typeof Symbol === 'function' && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0
      _listCustom_decorators = [Remote('listCustom')]
      __esDecorate(this, null, _listCustom_decorators, {
        kind: 'method', name: 'listCustom', static: false, private: false,
        access: { has: (obj) => 'listCustom' in obj, get: (obj) => obj.listCustom },
        metadata: _metadata,
      }, null, _instanceExtraInitializers)
      _setEnabled_decorators = [Remote('setEnabled')]
      __esDecorate(this, null, _setEnabled_decorators, {
        kind: 'method', name: 'setEnabled', static: false, private: false,
        access: { has: (obj) => 'setEnabled' in obj, get: (obj) => obj.setEnabled },
        metadata: _metadata,
      }, null, _instanceExtraInitializers)
      _beginInstall_decorators = [Remote('beginInstall')]
      __esDecorate(this, null, _beginInstall_decorators, {
        kind: 'method', name: 'beginInstall', static: false, private: false,
        access: { has: (obj) => 'beginInstall' in obj, get: (obj) => obj.beginInstall },
        metadata: _metadata,
      }, null, _instanceExtraInitializers)
      _appendInstallChunk_decorators = [Remote('appendInstallChunk')]
      __esDecorate(this, null, _appendInstallChunk_decorators, {
        kind: 'method', name: 'appendInstallChunk', static: false, private: false,
        access: { has: (obj) => 'appendInstallChunk' in obj, get: (obj) => obj.appendInstallChunk },
        metadata: _metadata,
      }, null, _instanceExtraInitializers)
      _cancelInstall_decorators = [Remote('cancelInstall')]
      __esDecorate(this, null, _cancelInstall_decorators, {
        kind: 'method', name: 'cancelInstall', static: false, private: false,
        access: { has: (obj) => 'cancelInstall' in obj, get: (obj) => obj.cancelInstall },
        metadata: _metadata,
      }, null, _instanceExtraInitializers)
      _finishInstall_decorators = [Remote('finishInstall')]
      __esDecorate(this, null, _finishInstall_decorators, {
        kind: 'method', name: 'finishInstall', static: false, private: false,
        access: { has: (obj) => 'finishInstall' in obj, get: (obj) => obj.finishInstall },
        metadata: _metadata,
      }, null, _instanceExtraInitializers)
      if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata })
    }

    static inject = ['loader']

    constructor(ctx) {
      super(ctx, 'customPlugins')
      __runInitializers(this, _instanceExtraInitializers)
      this.uploads = new Map()
      const cleanupTimer = setInterval(() => this.cleanupExpiredUploads(), UPLOAD_SWEEP_MS)
      cleanupTimer.unref?.()
      this.ctx.effect(() => () => {
        clearInterval(cleanupTimer)
        const roots = [...this.uploads.values()].map(upload => upload.root)
        this.uploads.clear()
        for (const root of roots) void rm(root, { recursive: true, force: true }).catch(() => {})
      })
    }

    /** Absolute path of the active profile's user patch file (resolved from ctx.baseUrl). */
    patchPath() {
      return fileURLToPath(new URL(PATCH_FILE, this.ctx.baseUrl))
    }

    /** Read the persisted disable entry ids from the profile patch file. */
    async readDisabledIds() {
      const ids = new Set()
      for (const patch of await readPatchArray(this.patchPath())) {
        if (!patch || typeof patch.id !== 'string' || typeof patch.disabled !== 'boolean') continue
        if (patch.disabled) ids.add(patch.id)
        else ids.delete(patch.id)
      }
      return ids
    }

    async listCustom() {
      const disabledIds = await this.readDisabledIds()
      const entries = []
      for (const entry of this.ctx.loader.entries()) {
        if (entry.options.group) continue
        if (entry.fiber === this.ctx.fiber) continue
        if (entry.options.name === MANAGER_PACKAGE) continue
        if (!isCustomModule(entry.options.name)) continue
        const persistedId = profileEntryId(entry.id)
        entries.push({
          entryId: entry.id,
          moduleName: entry.options.name,
          enabled: !disabledIds.has(persistedId),
        })
      }
      return { entries }
    }

    async setEnabled(entryId, enabled) {
      if (typeof entryId !== 'string' || entryId.length === 0) throw new Error('entryId must be a non-empty string')
      if (typeof enabled !== 'boolean') throw new Error('enabled must be a boolean')
      let target
      for (const entry of this.ctx.loader.entries()) {
        if (entry.options.group || entry.id !== entryId) continue
        target = entry
        break
      }
      if (!target || !isCustomModule(target.options.name)) throw new Error('Custom plugin entry not found: ' + entryId)
      if (target.fiber === this.ctx.fiber || target.options.name === MANAGER_PACKAGE) {
        throw new Error('The custom plugin manager cannot disable itself')
      }

      const persistedId = profileEntryId(entryId)
      const wasEnabled = !target.disabled
      if (enabled !== wasEnabled) await target.update({ disabled: !enabled })
      try {
        await mutatePatchArray(this.patchPath(), data => updateDisabledPatch(data, persistedId, entryId, enabled))
      } catch (error) {
        if (enabled !== wasEnabled) {
          try { await target.update({ disabled: !wasEnabled }) } catch {}
        }
        throw error
      }
      return { entryId, enabled }
    }

    profileDir() {
      return dirname(this.patchPath())
    }

    cleanupExpiredUploads() {
      const cutoff = Date.now() - UPLOAD_TTL_MS
      for (const [uploadId, upload] of this.uploads) {
        if (upload.busy || upload.updatedAt >= cutoff) continue
        this.uploads.delete(uploadId)
        void rm(upload.root, { recursive: true, force: true }).catch(() => {})
      }
    }

    async beginInstall(fileName, size) {
      this.cleanupExpiredUploads()
      if (this.uploads.size >= 1) throw new Error('Another plugin upload is already in progress')
      if (typeof fileName !== 'string' || archiveKind(fileName) === undefined) {
        throw new Error('Supported plugin archives: .tgz, .tar.gz, and .zip')
      }
      if (!Number.isSafeInteger(size) || size <= 0 || size > MAX_UPLOAD_BYTES) {
        throw new Error('Plugin archive must be between 1 byte and 128 MB')
      }
      const root = await mkdtemp(join(tmpdir(), 'dsh-plugin-upload-'))
      const safeName = basename(fileName).replace(/[^A-Za-z0-9._-]/gu, '_')
      const archivePath = join(root, safeName || 'plugin.tgz')
      await writeFile(archivePath, '')
      const uploadId = randomUUID()
      this.uploads.set(uploadId, {
        archivePath,
        busy: false,
        createdAt: Date.now(),
        fileName,
        kind: archiveKind(fileName),
        nextIndex: 0,
        received: 0,
        root,
        size,
        updatedAt: Date.now(),
      })
      return { uploadId, maxChunkBytes: MAX_CHUNK_BYTES }
    }

    async appendInstallChunk(uploadId, index, base64) {
      if (typeof uploadId !== 'string') throw new Error('Plugin upload id is invalid')
      const upload = this.uploads.get(uploadId)
      if (upload === undefined) throw new Error('Plugin upload session expired')
      if (upload.busy) throw new Error('Another operation is already using this upload session')
      if (!Number.isSafeInteger(index) || index !== upload.nextIndex) throw new Error('Plugin upload chunks arrived out of order')
      if (typeof base64 !== 'string' || base64.length === 0 || base64.length > MAX_BASE64_CHARS) {
        throw new Error('Plugin upload chunk has an invalid encoded size')
      }
      if (base64.length % 4 !== 0 || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/u.test(base64)) {
        throw new Error('Plugin upload chunk is not valid base64')
      }
      upload.busy = true
      try {
        const chunk = Buffer.from(base64, 'base64')
        if (chunk.length === 0 || chunk.length > MAX_CHUNK_BYTES || chunk.toString('base64') !== base64) {
          throw new Error('Plugin upload chunk has an invalid size or encoding')
        }
        if (upload.received + chunk.length > upload.size) throw new Error('Plugin upload exceeds its declared size')
        await appendFile(upload.archivePath, chunk)
        upload.received += chunk.length
        upload.nextIndex += 1
        upload.updatedAt = Date.now()
        return { received: upload.received, size: upload.size }
      } finally {
        upload.busy = false
      }
    }

    async cancelInstall(uploadId) {
      if (typeof uploadId !== 'string') throw new Error('Plugin upload id is invalid')
      const upload = this.uploads.get(uploadId)
      if (upload === undefined) return { cancelled: false }
      if (upload.busy) throw new Error('Another operation is already using this upload session')
      this.uploads.delete(uploadId)
      await rm(upload.root, { recursive: true, force: true })
      return { cancelled: true }
    }

    async finishInstall(uploadId) {
      if (typeof uploadId !== 'string') throw new Error('Plugin upload id is invalid')
      const upload = this.uploads.get(uploadId)
      if (upload === undefined) throw new Error('Plugin upload session expired')
      if (upload.busy) throw new Error('Another operation is already using this upload session')
      upload.busy = true
      this.uploads.delete(uploadId)
      try {
        if (upload.received !== upload.size) {
          throw new Error(`Plugin upload is incomplete: ${String(upload.received)}/${String(upload.size)} bytes`)
        }
        const [listing, verboseListing] = await Promise.all([
          runCommand('tar.exe', ['-tf', upload.archivePath]),
          runCommand('tar.exe', ['-tvf', upload.archivePath]),
        ])
        inspectArchiveListings(listing.stdout, verboseListing.stdout)
        const extracted = join(upload.root, 'extracted')
        await mkdir(extracted, { recursive: true })
        await runCommand('tar.exe', ['--no-same-owner', '--no-same-permissions', '-xf', upload.archivePath, '-C', extracted])
        const candidate = await inspectExtractedTree(extracted)
        let installPath = upload.archivePath
        if (upload.kind === 'zip') {
          const packed = join(upload.root, 'packed')
          await mkdir(packed, { recursive: true })
          await runCommand(commandName('pnpm'), ['pack', '--config.ignore-scripts=true', '--pack-destination', packed], {
            cwd: candidate.packageDir,
            env: { npm_config_ignore_scripts: 'true' },
            shell: process.platform === 'win32',
          })
          const tarballs = (await readdir(packed)).filter(name => name.toLowerCase().endsWith('.tgz'))
          if (tarballs.length !== 1) throw new Error('Packing the ZIP plugin did not produce exactly one .tgz archive')
          installPath = join(packed, tarballs[0])
        }
        const profileDir = this.profileDir()
        const profileName = basename(profileDir)
        const digest = (await sha256File(installPath)).slice(0, 12)
        const archiveDir = join(profileDir, '.plugin-archives')
        await mkdir(archiveDir, { recursive: true })
        const packageDigest = createHash('sha256').update(candidate.manifest.name).digest('hex').slice(0, 8)
        const safePackage = candidate.manifest.name.replace(/[^A-Za-z0-9._-]/gu, '_').slice(0, 80)
        const packageKey = `${safePackage}-${packageDigest}`
        const safeVersion = typeof candidate.manifest.version === 'string'
          ? candidate.manifest.version.replace(/[^A-Za-z0-9._-]/gu, '_').slice(0, 80)
          : '0.0.0'
        const durableArchive = join(archiveDir, `${packageKey}-${safeVersion}-${digest}.tgz`)
        await copyFile(installPath, durableArchive)
        const dshEntry = process.argv[1]
        if (typeof dshEntry !== 'string' || !dshEntry) throw new Error('Unable to locate the running dsh CLI entry')
        let result
        try {
          result = await runCommand(process.execPath, [
            dshEntry,
            'plugin',
            '--profile',
            profileName,
            'add',
            durableArchive,
          ], { cwd: profileDir })
        } catch (error) {
          await rm(durableArchive, { force: true })
          throw error
        }
        for (const oldName of await readdir(archiveDir)) {
          if (oldName === basename(durableArchive)) continue
          if (oldName.startsWith(`${packageKey}-`) && oldName.toLowerCase().endsWith('.tgz')) {
            await rm(join(archiveDir, oldName), { force: true })
          }
        }
        return {
          packageName: candidate.manifest.name,
          version: typeof candidate.manifest.version === 'string' ? candidate.manifest.version : '',
          requiresRestart: true,
          output: `${result.stdout}\n${result.stderr}`.trim().slice(-4000),
        }
      } finally {
        await rm(upload.root, { recursive: true, force: true })
      }
    }
  }
})()

export {
  CustomPluginsGateway,
  CustomPluginsGateway as default,
  assertSafeArchivePath,
  inspectArchiveListings,
  isValidPackageName,
  updateDisabledPatch,
}
