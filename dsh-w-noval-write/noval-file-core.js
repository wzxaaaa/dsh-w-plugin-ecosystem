import { createHash, randomUUID } from 'node:crypto'
import { readFile, rename, rm, stat, writeFile } from 'node:fs/promises'
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
