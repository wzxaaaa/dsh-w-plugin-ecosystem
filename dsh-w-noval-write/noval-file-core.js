import { createHash, randomUUID } from 'node:crypto'
import { readdir, readFile, rename, rm, stat, writeFile } from 'node:fs/promises'
import { extname, isAbsolute, join, resolve } from 'node:path'

export const MAX_MANUSCRIPT_CHARS = 2_000_000

function fileError(code, message) {
  const error = new Error(message)
  error.code = code
  return error
}

export function normalizeManuscriptFilename(value) {
  let filename = String(value ?? '').trim()
  if (!filename) throw fileError('INVALID_NOVEL_FILENAME', 'filename is required')
  if (filename === '.' || filename === '..' || /[\\/:*?"<>|\u0000-\u001f]/u.test(filename)) {
    throw fileError('INVALID_NOVEL_FILENAME', 'filename must be a single safe filename without directories or reserved characters')
  }
  if (filename.endsWith('.')) throw fileError('INVALID_NOVEL_FILENAME', 'filename cannot end with a dot')
  if (extname(filename) === '') filename += '.md'
  const extension = extname(filename).toLowerCase()
  if (extension !== '.md' && extension !== '.txt') {
    throw fileError('INVALID_NOVEL_FILENAME', 'manuscripts must use a .md or .txt extension')
  }
  const stem = filename.slice(0, -extension.length).trim().toLowerCase()
  const deviceStem = stem.split('.')[0]
  if (!stem || /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/u.test(deviceStem)) {
    throw fileError('INVALID_NOVEL_FILENAME', 'filename is reserved or empty')
  }
  return filename
}

function digest(value) {
  return createHash('sha256').update(value, 'utf8').digest('hex')
}

export async function saveWorkspaceManuscript(workspaceRoot, input = {}) {
  if (typeof workspaceRoot !== 'string' || !workspaceRoot.trim() || !isAbsolute(workspaceRoot)) {
    throw fileError('NOVEL_WORKSPACE_MISSING', 'the registered Harness Workspace has no absolute filesystem path')
  }
  const root = resolve(workspaceRoot)
  const rootInfo = await stat(root).catch(() => undefined)
  if (!rootInfo?.isDirectory()) throw fileError('NOVEL_WORKSPACE_MISSING', 'the registered Harness Workspace directory does not exist')

  const filename = normalizeManuscriptFilename(input.filename)
  const content = typeof input.content === 'string' ? input.content : ''
  if (!content.trim()) throw fileError('INVALID_NOVEL_CONTENT', 'content must be a non-empty string')
  if (content.length > MAX_MANUSCRIPT_CHARS) {
    throw fileError('NOVEL_CONTENT_TOO_LARGE', `content is ${content.length} characters, over the ${MAX_MANUSCRIPT_CHARS} limit`)
  }

  const path = join(root, filename)
  const existing = await readFile(path, 'utf8').catch(error => {
    if (error?.code === 'ENOENT') return undefined
    throw error
  })
  if (existing === content) {
    return {
      changed: false,
      created: false,
      overwritten: false,
      verified: true,
      filename,
      path,
      characters: content.length,
      bytes: Buffer.byteLength(content, 'utf8'),
      sha256: digest(content),
    }
  }
  if (existing !== undefined && input.overwrite !== true) {
    throw fileError('NOVEL_FILE_EXISTS', `file already exists: ${path}; read it first and pass overwrite: true only when replacement is intended`)
  }

  const temp = join(root, `.${filename}.${process.pid}.${randomUUID()}.tmp`)
  try {
    await writeFile(temp, content, 'utf8')
    await rename(temp, path)
  } finally {
    await rm(temp, { force: true }).catch(() => {})
  }

  const persisted = await readFile(path, 'utf8')
  if (persisted !== content) throw fileError('NOVEL_FILE_VERIFY_FAILED', `file verification failed after writing: ${path}`)
  return {
    changed: true,
    created: existing === undefined,
    overwritten: existing !== undefined,
    verified: true,
    filename,
    path,
    characters: persisted.length,
    bytes: Buffer.byteLength(persisted, 'utf8'),
    sha256: digest(persisted),
  }
}

const HAN = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu
const CJK_PUNCTUATION = /[　-〿＀-￯‘-‟—…·]/gu
const LATIN_WORD = /[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu
const MARKDOWN_SYNTAX = /^\s{0,3}(?:#{1,6}\s+|>\s?|[-*+]\s+|\d+\.\s+)|[*_`~]+/gmu

/**
 * Chinese-style word count: every CJK character and full-width punctuation
 * mark counts as one, every run of Latin letters or digits counts as one
 * word, and Markdown markup is ignored.
 */
export function countManuscriptWords(value) {
  const text = String(value ?? '').replace(/^﻿/u, '').replace(MARKDOWN_SYNTAX, ' ')
  const han = text.match(HAN)?.length ?? 0
  const withoutHan = text.replace(HAN, ' ')
  const latin = withoutHan.match(LATIN_WORD)?.length ?? 0
  // Words go first so an apostrophe inside "it’s" is not counted as punctuation.
  const punctuation = withoutHan.replace(LATIN_WORD, ' ').match(CJK_PUNCTUATION)?.length ?? 0
  return han + punctuation + latin
}

const MAX_LISTED_MANUSCRIPTS = 2000
const MAX_COUNTED_BYTES = 8 * 1024 * 1024

async function workspaceDirectory(workspaceRoot) {
  if (typeof workspaceRoot !== 'string' || !workspaceRoot.trim() || !isAbsolute(workspaceRoot)) {
    throw fileError('NOVEL_WORKSPACE_MISSING', 'the registered Harness Workspace has no absolute filesystem path')
  }
  const root = resolve(workspaceRoot)
  const info = await stat(root).catch(() => undefined)
  if (!info?.isDirectory()) throw fileError('NOVEL_WORKSPACE_MISSING', 'the registered Harness Workspace directory does not exist')
  return root
}

/**
 * Every .md/.txt manuscript in the workspace root with live statistics.
 * `cache` (a Map) skips re-reading files whose size and mtime are unchanged.
 */
export async function listWorkspaceManuscripts(workspaceRoot, { cache } = {}) {
  const root = await workspaceDirectory(workspaceRoot)
  const entries = await readdir(root, { withFileTypes: true })
  const names = entries
    .filter(entry => entry.isFile() && !entry.name.startsWith('.') && ['.md', '.txt'].includes(extname(entry.name).toLowerCase()))
    .map(entry => entry.name)
    .sort((a, b) => a.localeCompare(b, 'zh-Hans-CN', { numeric: true }))
    .slice(0, MAX_LISTED_MANUSCRIPTS)
  const files = []
  for (const filename of names) {
    const path = join(root, filename)
    const info = await stat(path).catch(() => undefined)
    if (!info?.isFile()) continue
    const cached = cache?.get(path)
    let words = cached && cached.size === info.size && cached.mtimeMs === info.mtimeMs ? cached.words : undefined
    if (words === undefined) {
      words = info.size <= MAX_COUNTED_BYTES ? countManuscriptWords(await readFile(path, 'utf8').catch(() => '')) : -1
      cache?.set(path, { size: info.size, mtimeMs: info.mtimeMs, words })
    }
    files.push({ filename, bytes: info.size, words, updatedAt: info.mtime.toISOString() })
  }
  return { root, files, truncated: entries.length > MAX_LISTED_MANUSCRIPTS }
}

/** Read one manuscript for preview; a missing file is reported, not thrown. */
export async function readWorkspaceManuscript(workspaceRoot, filenameValue, { maxChars = 4000 } = {}) {
  const root = await workspaceDirectory(workspaceRoot)
  const filename = normalizeManuscriptFilename(filenameValue)
  const path = join(root, filename)
  const info = await stat(path).catch(() => undefined)
  if (!info?.isFile()) return { filename, exists: false }
  const content = await readFile(path, 'utf8')
  const limit = Math.max(200, Math.min(20_000, Number.isFinite(maxChars) ? Math.floor(maxChars) : 4000))
  return {
    filename,
    exists: true,
    bytes: info.size,
    words: countManuscriptWords(content),
    characters: content.length,
    updatedAt: info.mtime.toISOString(),
    excerpt: content.slice(0, limit),
    truncated: content.length > limit,
  }
}
