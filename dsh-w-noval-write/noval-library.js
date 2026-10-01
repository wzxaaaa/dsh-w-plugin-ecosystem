/**
 * dsh-w-noval-write — novel library.
 *
 * A Harness Workspace can hold many novels. Each novel is a folder directly
 * inside the workspace: its manuscripts sit in the folder, and everything
 * else (canon, outline, threads, version history) lives in `<folder>/.novel/`.
 * Copying or backing up the folder therefore carries the whole book.
 *
 * Conversations choose a novel explicitly; the binding table maps a session
 * to (workspace, novel). The novel id is stored in `.novel/novel.json`, so a
 * folder renamed in the file explorer is still found.
 */

import { createHash, randomUUID } from 'node:crypto'
import { copyFileSync, existsSync, linkSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { basename, isAbsolute, join, relative, resolve } from 'node:path'

export const NOVEL_DIR = '.novel'
export const NOVEL_META_FILE = 'novel.json'
export const NOVEL_STATE_FILE = 'project.json'
export const NOVEL_HISTORY_DIR = 'history'
export const BINDING_STORE_VERSION = 1
const MAX_FOLDER_CHARS = 60
const HANDLE_SEPARATOR = '#'

function libraryError(code, message) {
  const error = new Error(message)
  error.code = code
  return error
}

/** Handle used everywhere a novel is addressed: `<workspaceId>#<novelId>`. */
export function novelHandle(workspaceId, novelId) {
  return `${workspaceId}${HANDLE_SEPARATOR}${novelId}`
}

export function parseNovelHandle(handle) {
  const text = typeof handle === 'string' ? handle.trim() : ''
  const at = text.lastIndexOf(HANDLE_SEPARATOR)
  if (at <= 0 || at === text.length - 1) throw libraryError('NOVEL_HANDLE_INVALID', `'${text}' does not name a novel; choose one in the Novel Writing panel`)
  return { workspaceId: text.slice(0, at), novelId: text.slice(at + 1) }
}

/** A folder name that is valid on Windows, macOS, and Linux. */
export function sanitizeFolderName(value, fallback = '未命名小说') {
  let name = String(value ?? '')
    .replace(/[\\/:*?"<>|\u0000-\u001f]+/gu, ' ')
    .replace(/\s+/gu, ' ')
    .trim()
    .replace(/^[.\s]+|[.\s]+$/gu, '')
    .slice(0, MAX_FOLDER_CHARS)
    .trim()
  if (!name || /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/iu.test(name.split('.')[0])) name = fallback
  return name
}

/** The first `name`, `name 2`, `name 3`… that does not exist yet. */
export function uniqueFolderName(workspacePath, name) {
  let candidate = name
  for (let suffix = 2; existsSync(join(workspacePath, candidate)); suffix += 1) candidate = `${name} ${suffix}`
  return candidate
}

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'))
  } catch {
    return null
  }
}

function writeJson(path, value, temporary = `${path}.${process.pid}.${randomUUID()}.tmp`) {
  try {
    writeFileSync(temporary, JSON.stringify(value, null, 2) + '\n', 'utf8')
    renameSync(temporary, path)
  } finally {
    rmSync(temporary, { force: true })
  }
}

/** The novel stored in one folder, or null when the folder is not a novel. */
export function readNovelFolder(workspacePath, folder) {
  const dir = join(workspacePath, folder)
  const meta = readJson(join(dir, NOVEL_DIR, NOVEL_META_FILE))
  if (!meta || typeof meta.id !== 'string' || !meta.id) return null
  return {
    id: meta.id,
    title: typeof meta.title === 'string' ? meta.title : '',
    createdAt: typeof meta.createdAt === 'string' ? meta.createdAt : '',
    folder,
    dir,
  }
}

/** Every novel folder directly inside a workspace, sorted by folder name. */
export function scanNovels(workspacePath) {
  let entries
  try {
    entries = readdirSync(workspacePath, { withFileTypes: true })
  } catch (error) {
    if (error && error.code === 'ENOENT') return []
    throw error
  }
  return entries
    .filter(entry => entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules')
    .map(entry => readNovelFolder(workspacePath, entry.name))
    .filter(Boolean)
    .sort((a, b) => a.folder.localeCompare(b.folder, 'zh-Hans-CN', { numeric: true }))
}

/** Locate a novel by id, trying the remembered folder before a full scan. */
export function findNovel(workspacePath, novelId, folderHint = '') {
  if (folderHint) {
    const hinted = readNovelFolder(workspacePath, folderHint)
    if (hinted && hinted.id === novelId) return hinted
  }
  return scanNovels(workspacePath).find(novel => novel.id === novelId) ?? null
}

export function updateNovelTitle(novel, title) {
  const path = join(novel.dir, NOVEL_DIR, NOVEL_META_FILE)
  const meta = readJson(path) || { id: novel.id }
  if (meta.title === title) return
  writeJson(path, { ...meta, title })
}

/**
 * Create `<workspace>/<folder>/.novel/` for a new book. `state` is written as
 * the book's first project file.
 */
export function createNovelFolder(workspacePath, { title = '', folder = '' } = {}, state, now = Date.now()) {
  if (!existsSync(workspacePath) || !statSync(workspacePath).isDirectory()) {
    throw libraryError('NOVEL_WORKSPACE_MISSING', 'the Harness Workspace folder does not exist')
  }
  const name = uniqueFolderName(workspacePath, sanitizeFolderName(folder || title))
  const dir = join(workspacePath, name)
  const id = 'n' + now.toString(36) + randomUUID().slice(0, 6)
  mkdirSync(join(dir, NOVEL_DIR), { recursive: true })
  writeJson(join(dir, NOVEL_DIR, NOVEL_META_FILE), { version: 1, id, title, createdAt: new Date(now).toISOString() })
  writeJson(join(dir, NOVEL_DIR, NOVEL_STATE_FILE), state)
  return { id, title, createdAt: new Date(now).toISOString(), folder: name, dir }
}

/**
 * Copy a directory tree file by file and verify every file landed. Node's
 * cpSync silently copies nothing on Windows when the target path contains
 * non-ASCII characters (Chinese book titles), so it is not used here.
 */
function fileDigest(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex')
}

function copyFileVerified(source, target, expectedDigest = fileDigest(source)) {
  if (existsSync(target)) {
    if (!statSync(target).isFile() || fileDigest(target) !== expectedDigest) {
      throw libraryError('NOVEL_COPY_CONFLICT', `the migration destination has different content: ${target}; the original was preserved`)
    }
    return
  }
  mkdirSync(join(target, '..'), { recursive: true })
  const temporary = `${target}.${process.pid}.${randomUUID()}.tmp`
  try {
    copyFileSync(source, temporary)
    if (fileDigest(temporary) !== expectedDigest) throw libraryError('NOVEL_COPY_FAILED', `the source changed while copying ${source}; the original was preserved`)
    try {
      linkSync(temporary, target)
    } catch (error) {
      if (error?.code !== 'EEXIST') throw error
    }
    if (fileDigest(target) !== expectedDigest) throw libraryError('NOVEL_COPY_CONFLICT', `the migration destination changed: ${target}; the original was preserved`)
  } finally {
    rmSync(temporary, { force: true })
  }
}

export function copyTreeVerified(source, target) {
  mkdirSync(target, { recursive: true })
  let files = 0
  for (const entry of readdirSync(source, { withFileTypes: true })) {
    const from = join(source, entry.name)
    const to = join(target, entry.name)
    if (entry.isDirectory()) files += copyTreeVerified(from, to)
    else if (entry.isFile()) {
      copyFileVerified(from, to)
      files += 1
    } else throw libraryError('NOVEL_COPY_UNSUPPORTED', `cannot safely migrate ${from}; the original was preserved`)
  }
  return files
}

/**
 * Turn a pre-0.13 workspace project into the workspace's first novel folder.
 * A journal reserves the destination before copying. Failed attempts resume
 * that same book, and the book becomes visible only after every copy verifies.
 * Legacy state, history and root manuscripts remain available as backups.
 */
export function migrateLegacyProject({ legacyDir, workspacePath, state, now = Date.now() }) {
  const legacyState = join(legacyDir, NOVEL_STATE_FILE)
  const journalPath = join(legacyDir, 'migration.json')
  const legacyHistory = join(legacyDir, NOVEL_HISTORY_DIR)
  let journal = readJson(journalPath)
  if (existsSync(journalPath) && !journal) throw libraryError('NOVEL_MIGRATION_INVALID', `the migration journal cannot be read: ${journalPath}; no source files were removed`)
  if (!journal) {
    const files = []
    const seen = new Set()
    for (const volume of state.project.volumes) {
      for (const chapter of volume.chapters) {
        const filename = chapter.manuscriptFile
        if (!filename) continue
        if (typeof filename !== 'string' || filename !== basename(filename) || filename === '.' || filename === '..' || /[\\/:*?"<>|\u0000-\u001f]/u.test(filename)) {
          throw libraryError('NOVEL_MIGRATION_FILENAME_INVALID', `the legacy manuscript is not a single safe filename: ${filename}; no source files were removed`)
        }
        const key = process.platform === 'win32' ? filename.toLowerCase() : filename
        if (seen.has(key)) continue
        seen.add(key)
        files.push({ kind: 'manuscript', filename })
      }
    }
    if (existsSync(legacyHistory)) {
      const collectHistory = directory => {
        for (const entry of readdirSync(directory, { withFileTypes: true })) {
          const source = join(directory, entry.name)
          if (entry.isDirectory()) collectHistory(source)
          else if (entry.isFile()) files.push({ kind: 'history', filename: relative(legacyHistory, source) })
          else throw libraryError('NOVEL_COPY_UNSUPPORTED', `cannot safely migrate ${source}; the original was preserved`)
        }
      }
      collectHistory(legacyHistory)
    }
    journal = {
      version: 1, workspacePath: resolve(workspacePath),
      novelId: 'n' + now.toString(36) + randomUUID().slice(0, 6),
      reservationToken: randomUUID(),
      folder: uniqueFolderName(workspacePath, sanitizeFolderName(state.project.title)),
      title: state.project.title, createdAt: new Date(now).toISOString(), state, files,
    }
    writeJson(journalPath, journal)
  }
  const validFolder = typeof journal.folder === 'string' && journal.folder && journal.folder === basename(journal.folder) &&
    journal.folder !== '.' && journal.folder !== '..' && !/[\\/:*?"<>|\u0000-\u001f]/u.test(journal.folder) && !/[.\s]$/u.test(journal.folder)
  if (journal.version !== 1 || journal.workspacePath !== resolve(workspacePath) || typeof journal.novelId !== 'string' || !journal.novelId ||
      !validFolder || !Array.isArray(journal.files) || JSON.stringify(journal.state) !== JSON.stringify(state) ||
      (journal.reservationToken !== undefined && (typeof journal.reservationToken !== 'string' || !/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/iu.test(journal.reservationToken)))) {
    throw libraryError('NOVEL_MIGRATION_CONFLICT', `the pending migration no longer matches the legacy project: ${journalPath}; its original files were preserved`)
  }
  const novel = { id: journal.novelId, title: journal.title, createdAt: journal.createdAt, folder: journal.folder, dir: join(workspacePath, journal.folder) }
  const existingNovel = readNovelFolder(workspacePath, journal.folder)
  if (existingNovel && existingNovel.id !== novel.id) throw libraryError('NOVEL_MIGRATION_CONFLICT', `the reserved folder contains another novel: ${novel.dir}; it was preserved`)
  const ownerPath = join(novel.dir, NOVEL_DIR, 'migration.json')
  const owner = readJson(ownerPath)
  const expectedOwner = { version: 1, novelId: novel.id }
  const reservedTemporary = journal.reservationToken ? `${ownerPath}.${journal.reservationToken}.tmp` : undefined
  const matchesOwner = value => value && typeof value === 'object' && value.version === expectedOwner.version && value.novelId === expectedOwner.novelId && Object.keys(value).length === 2
  if (existsSync(novel.dir) && !matchesOwner(owner)) {
    const entries = readdirSync(novel.dir)
    const ownedTemporary = filename => {
      const path = join(novel.dir, NOVEL_DIR, filename)
      if (!statSync(path).isFile()) return false
      const value = readJson(path)
      // The journal records the exact random filename before creating it, so
      // even an empty/partial owner write can be retried after a process exit.
      if (reservedTemporary && path === reservedTemporary) return value === null || matchesOwner(value)
      // Journals from before the reservation token have no filename receipt.
      // Recover only complete legacy temporary owners for this same novel.
      return /^migration\.json\.\d+\.[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\.tmp$/iu.test(filename) && matchesOwner(value)
    }
    const emptyReservation = !owner && (entries.length === 0 || (entries.length === 1 && entries[0] === NOVEL_DIR && readdirSync(join(novel.dir, NOVEL_DIR)).every(ownedTemporary)))
    if (!emptyReservation) throw libraryError('NOVEL_MIGRATION_CONFLICT', `the reserved novel folder belongs to another book: ${novel.dir}; the original was preserved`)
  }
  mkdirSync(join(novel.dir, NOVEL_DIR), { recursive: true })
  if (!owner) writeJson(ownerPath, expectedOwner, reservedTemporary)
  const locations = file => {
    if (!file || !['manuscript', 'history'].includes(file.kind) || typeof file.filename !== 'string' ||
        (file.kind === 'manuscript' && (file.filename !== basename(file.filename) || /[\\/:*?"<>|\u0000-\u001f]/u.test(file.filename)))) {
      throw libraryError('NOVEL_MIGRATION_FILENAME_INVALID', 'the migration journal contains an invalid file entry')
    }
    const sourceRoot = file.kind === 'history' ? legacyHistory : workspacePath
    const targetRoot = file.kind === 'history' ? join(novel.dir, NOVEL_DIR, NOVEL_HISTORY_DIR) : novel.dir
    const source = resolve(sourceRoot, file.filename)
    const target = resolve(targetRoot, file.filename)
    // Journals are persistent data, not trusted paths.
    for (const [root, path] of [[sourceRoot, source], [targetRoot, target]]) {
      const local = relative(resolve(root), path)
      if (!local || isAbsolute(local) || local === '..' || local.startsWith('..\\') || local.startsWith('../') || resolve(root, local) !== path) {
        throw libraryError('NOVEL_MIGRATION_FILENAME_INVALID', `the migration file escapes its directory: ${file.filename}`)
      }
    }
    return { source, target }
  }
  for (const file of journal.files) {
    const { source, target } = locations(file)
    if (!existsSync(source) && file.kind === 'manuscript' && !file.sha256) continue
    const sha256 = fileDigest(source)
    if (file.sha256 && file.sha256 !== sha256) throw libraryError('NOVEL_MIGRATION_CONFLICT', `the legacy file changed during migration: ${source}; both copies were preserved`)
    if (!file.sha256) {
      file.sha256 = sha256
      writeJson(journalPath, journal)
    }
    copyFileVerified(source, target, sha256)
  }
  for (const file of journal.files) {
    if (!file.sha256) continue
    const { source, target } = locations(file)
    if (fileDigest(source) !== file.sha256 || fileDigest(target) !== file.sha256) {
      throw libraryError('NOVEL_MIGRATION_CONFLICT', `a migration file changed before completion: ${source}; the original was preserved`)
    }
  }
  const statePath = join(novel.dir, NOVEL_DIR, NOVEL_STATE_FILE)
  if (existsSync(statePath) && JSON.stringify(readJson(statePath)) !== JSON.stringify(state)) {
    throw libraryError('NOVEL_MIGRATION_CONFLICT', `the migrated project was edited before completion: ${statePath}; it was preserved`)
  }
  writeJson(statePath, state)
  writeJson(join(novel.dir, NOVEL_DIR, NOVEL_META_FILE), { version: 1, id: novel.id, title: novel.title, createdAt: novel.createdAt })
  const moved = journal.files.filter(file => file.kind === 'manuscript' && file.sha256).map(file => file.filename)
  const skipped = []
  writeJson(join(legacyDir, 'migrated.json'), { novelId: novel.id, folder: novel.folder, at: new Date(now).toISOString(), moved, skipped })
  if (existsSync(legacyState)) renameSync(legacyState, `${legacyState}.migrated`)
  return { novel, moved, skipped }
}

/** Normalize the session → novel binding table. */
export function normalizeBindingStore(value) {
  const bindings = {}
  const source = value && typeof value === 'object' && value.bindings && typeof value.bindings === 'object' ? value.bindings : {}
  for (const [sessionId, entry] of Object.entries(source)) {
    if (!entry || typeof entry !== 'object') continue
    const workspaceId = typeof entry.workspaceId === 'string' ? entry.workspaceId : ''
    const novelId = typeof entry.novelId === 'string' ? entry.novelId : ''
    if (!sessionId.trim() || !workspaceId || !novelId) continue
    bindings[sessionId] = {
      workspaceId,
      novelId,
      folder: typeof entry.folder === 'string' ? entry.folder : '',
      boundAt: typeof entry.boundAt === 'string' ? entry.boundAt : '',
    }
  }
  return { version: BINDING_STORE_VERSION, bindings }
}

export function readBindingStore(path) {
  return normalizeBindingStore(readJson(path))
}

export function writeBindingStore(path, store) {
  mkdirSync(join(path, '..'), { recursive: true })
  writeJson(path, normalizeBindingStore(store))
}
