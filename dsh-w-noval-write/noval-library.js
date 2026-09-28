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

import { randomUUID } from 'node:crypto'
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

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

function writeJson(path, value) {
  const temporary = `${path}.${process.pid}.${randomUUID()}.tmp`
  writeFileSync(temporary, JSON.stringify(value, null, 2) + '\n', 'utf8')
  renameSync(temporary, path)
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
export function copyTreeVerified(source, target) {
  mkdirSync(target, { recursive: true })
  let files = 0
  for (const entry of readdirSync(source, { withFileTypes: true })) {
    const from = join(source, entry.name)
    const to = join(target, entry.name)
    if (entry.isDirectory()) files += copyTreeVerified(from, to)
    else if (entry.isFile()) {
      copyFileSync(from, to)
      if (!existsSync(to) || statSync(to).size !== statSync(from).size) {
        throw libraryError('NOVEL_COPY_FAILED', `could not copy ${from} to ${to}; nothing was removed`)
      }
      files += 1
    }
  }
  return files
}

/**
 * Turn a pre-0.13 workspace project into the workspace's first novel folder.
 * The legacy file is renamed, not deleted, so the migration can be undone by
 * hand. Chapter files linked in the outline move into the new folder unless
 * the name is already taken there.
 */
export function migrateLegacyProject({ legacyDir, workspacePath, state, now = Date.now() }) {
  const legacyState = join(legacyDir, NOVEL_STATE_FILE)
  const novel = createNovelFolder(workspacePath, { title: state.project.title, folder: state.project.title }, state, now)
  const legacyHistory = join(legacyDir, NOVEL_HISTORY_DIR)
  if (existsSync(legacyHistory)) {
    // The legacy history is removed only after every file is verified.
    copyTreeVerified(legacyHistory, join(novel.dir, NOVEL_DIR, NOVEL_HISTORY_DIR))
    rmSync(legacyHistory, { recursive: true, force: true })
  }
  const moved = []
  const skipped = []
  for (const volume of state.project.volumes) {
    for (const chapter of volume.chapters) {
      const file = chapter.manuscriptFile
      if (!file) continue
      const source = join(workspacePath, file)
      const target = join(novel.dir, file)
      if (!existsSync(source)) continue
      if (existsSync(target)) { skipped.push(file); continue }
      renameSync(source, target)
      moved.push(file)
    }
  }
  renameSync(legacyState, `${legacyState}.migrated`)
  writeJson(join(legacyDir, 'migrated.json'), { novelId: novel.id, folder: novel.folder, at: new Date(now).toISOString(), moved, skipped })
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
