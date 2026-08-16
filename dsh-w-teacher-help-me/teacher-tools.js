import { readdir, readFile, realpath, stat } from 'node:fs/promises'
import { isAbsolute, relative, resolve, sep } from 'node:path'

const MAX_LIST_ENTRIES = 500
const MAX_READ_BYTES = 4 * 1024 * 1024
const MAX_READ_LINES = 800
const MAX_TOOL_OUTPUT_CHARS = 120_000
const MAX_SEARCH_FILES = 5_000
const MAX_SEARCH_BYTES = 64 * 1024 * 1024
const MAX_SEARCH_RESULTS = 200
const MAX_SEARCH_LINE_CHARS = 1_200

const SKIPPED_DIRECTORIES = new Set([
  '.git', '.hg', '.svn', '.next', '.nuxt', '.turbo',
  'build', 'coverage', 'dist', 'node_modules', 'target',
])

const READ_ONLY_TEACHER_TOOLS = Object.freeze([
  {
    type: 'function',
    function: {
      name: 'list_directory',
      description: 'List files and directories inside the current task workspace. Read-only; cannot leave the workspace root.',
      parameters: {
        type: 'object',
        additionalProperties: false,
        properties: {
          path: { type: 'string', description: 'Workspace-relative directory path. Defaults to the workspace root.' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'search_files',
      description: 'Search text files recursively inside the current task workspace. Read-only and bounded.',
      parameters: {
        type: 'object',
        additionalProperties: false,
        required: ['query'],
        properties: {
          query: { type: 'string', description: 'Literal text or regular expression to search for.' },
          path: { type: 'string', description: 'Workspace-relative file or directory. Defaults to the workspace root.' },
          regex: { type: 'boolean', description: 'Interpret query as a JavaScript regular expression. Defaults to false.' },
          caseSensitive: { type: 'boolean', description: 'Use case-sensitive matching. Defaults to false.' },
          maxResults: { type: 'integer', minimum: 1, maximum: MAX_SEARCH_RESULTS, description: 'Maximum matching lines. Defaults to 80.' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'read_file',
      description: 'Read a bounded line range from a UTF-8 text file inside the current task workspace. Read-only.',
      parameters: {
        type: 'object',
        additionalProperties: false,
        required: ['path'],
        properties: {
          path: { type: 'string', description: 'Workspace-relative file path.' },
          startLine: { type: 'integer', minimum: 1, description: 'First 1-based line. Defaults to 1.' },
          endLine: { type: 'integer', minimum: 1, description: 'Last 1-based line. Defaults to startLine + 399; capped to 800 lines.' },
        },
      },
    },
  },
])

function objectLike(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function throwIfAborted(signal) {
  if (signal?.aborted) throw signal.reason instanceof Error ? signal.reason : new Error('teacher investigation was aborted')
}

function integer(value, fallback, min, max) {
  if (value === undefined || value === null) return fallback
  const parsed = Number(value)
  if (!Number.isSafeInteger(parsed)) throw new Error('expected an integer')
  return Math.max(min, Math.min(max, parsed))
}

function requestedPath(value) {
  if (value === undefined || value === null || value === '') return '.'
  if (typeof value !== 'string') throw new Error('path must be a string')
  if (value.length > 4096) throw new Error('path is too long')
  if (isAbsolute(value)) throw new Error('path must be relative to the current task workspace')
  return value
}

function displayPath(root, path) {
  return relative(root, path).split(sep).join('/') || '.'
}

function isInside(root, target) {
  const path = relative(root, target)
  return path === '' || (!path.startsWith(`..${sep}`) && path !== '..' && !isAbsolute(path))
}

async function workspaceRoot(path) {
  if (typeof path !== 'string' || !isAbsolute(path)) throw new Error('the current session has no absolute workspace root')
  const root = await realpath(path)
  if (!(await stat(root)).isDirectory()) throw new Error('the current workspace root is not a directory')
  return root
}

async function resolveInside(root, path) {
  const target = await realpath(resolve(root, requestedPath(path)))
  if (!isInside(root, target)) throw new Error('path escapes the current task workspace')
  return target
}

function parseArguments(raw) {
  if (objectLike(raw)) return raw
  if (typeof raw !== 'string' || raw.trim() === '') return {}
  let parsed
  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new Error('tool arguments are not valid JSON')
  }
  if (!objectLike(parsed)) throw new Error('tool arguments must be an object')
  return parsed
}

function clipOutput(text) {
  if (text.length <= MAX_TOOL_OUTPUT_CHARS) return text
  return `${text.slice(0, MAX_TOOL_OUTPUT_CHARS)}\n...[tool output clipped]...`
}

function isBinary(buffer) {
  return buffer.subarray(0, Math.min(buffer.length, 8192)).includes(0)
}

async function listDirectory(root, args, signal) {
  throwIfAborted(signal)
  const target = await resolveInside(root, args.path)
  if (!(await stat(target)).isDirectory()) throw new Error(`${displayPath(root, target)} is not a directory`)
  const entries = await readdir(target, { withFileTypes: true })
  entries.sort((left, right) => {
    const rank = entry => entry.isDirectory() ? 0 : entry.isFile() ? 1 : 2
    return rank(left) - rank(right) || left.name.localeCompare(right.name)
  })
  const shown = entries.slice(0, MAX_LIST_ENTRIES).map(entry => {
    const kind = entry.isDirectory() ? 'dir' : entry.isFile() ? 'file' : entry.isSymbolicLink() ? 'link' : 'other'
    return `[${kind}] ${entry.name}`
  })
  if (entries.length > shown.length) shown.push(`...[${String(entries.length - shown.length)} more entries omitted]...`)
  return `Directory ${displayPath(root, target)} (${String(entries.length)} entries)\n${shown.join('\n') || '[empty]'}`
}

async function readTextFile(path, info) {
  if (!info.isFile()) throw new Error('path is not a regular file')
  if (info.size > MAX_READ_BYTES) throw new Error(`file exceeds the ${String(MAX_READ_BYTES)} byte read limit`)
  const buffer = await readFile(path)
  if (isBinary(buffer)) throw new Error('file appears to be binary')
  return buffer.toString('utf8')
}

async function readWorkspaceFile(root, args, signal) {
  throwIfAborted(signal)
  const target = await resolveInside(root, args.path)
  const text = await readTextFile(target, await stat(target))
  const lines = text.split(/\r?\n/u)
  const start = integer(args.startLine, 1, 1, Math.max(1, lines.length))
  const requestedEnd = integer(args.endLine, start + 399, start, Math.max(start, lines.length))
  const end = Math.min(requestedEnd, start + MAX_READ_LINES - 1, lines.length)
  const body = lines.slice(start - 1, end).map((line, index) => `${String(start + index).padStart(6, ' ')} | ${line}`).join('\n')
  return clipOutput(`File ${displayPath(root, target)} lines ${String(start)}-${String(end)} of ${String(lines.length)}\n${body}`)
}

function compileMatcher(args) {
  if (typeof args.query !== 'string' || args.query.length === 0) throw new Error('query must be a non-empty string')
  if (args.query.length > 1000) throw new Error('query is too long')
  const flags = args.caseSensitive === true ? 'u' : 'iu'
  if (args.regex === true) {
    const expression = new RegExp(args.query, flags)
    return line => expression.test(line)
  }
  const needle = args.caseSensitive === true ? args.query : args.query.toLocaleLowerCase()
  return line => (args.caseSensitive === true ? line : line.toLocaleLowerCase()).includes(needle)
}

async function searchFiles(root, args, signal) {
  throwIfAborted(signal)
  const target = await resolveInside(root, args.path)
  const matcher = compileMatcher(args)
  const maxResults = integer(args.maxResults, 80, 1, MAX_SEARCH_RESULTS)
  const targetRelative = relative(root, target).split(sep)
  const skipHeavy = !targetRelative.some(part => SKIPPED_DIRECTORIES.has(part))
  const queue = [target]
  const matches = []
  let scannedFiles = 0
  let scannedBytes = 0
  let truncated = false

  while (queue.length > 0 && matches.length < maxResults) {
    throwIfAborted(signal)
    const current = queue.shift()
    const info = await stat(current)
    if (info.isDirectory()) {
      const entries = await readdir(current, { withFileTypes: true })
      entries.sort((left, right) => left.name.localeCompare(right.name))
      for (const entry of entries) {
        if (entry.isSymbolicLink()) continue
        if (skipHeavy && entry.isDirectory() && SKIPPED_DIRECTORIES.has(entry.name)) continue
        if (entry.isDirectory() || entry.isFile()) queue.push(resolve(current, entry.name))
      }
      continue
    }
    if (!info.isFile() || info.size > MAX_READ_BYTES) continue
    if (scannedFiles >= MAX_SEARCH_FILES || scannedBytes + info.size > MAX_SEARCH_BYTES) {
      truncated = true
      break
    }
    scannedFiles += 1
    scannedBytes += info.size
    const buffer = await readFile(current)
    if (isBinary(buffer)) continue
    const lines = buffer.toString('utf8').split(/\r?\n/u)
    for (let index = 0; index < lines.length; index++) {
      if (!matcher(lines[index])) continue
      const line = lines[index].length > MAX_SEARCH_LINE_CHARS
        ? `${lines[index].slice(0, MAX_SEARCH_LINE_CHARS)}...[line clipped]...`
        : lines[index]
      matches.push(`${displayPath(root, current)}:${String(index + 1)}: ${line}`)
      if (matches.length >= maxResults) break
    }
  }

  if (queue.length > 0 || matches.length >= maxResults) truncated = true
  const summary = `Search scanned ${String(scannedFiles)} files / ${String(scannedBytes)} bytes and found ${String(matches.length)} matching lines.`
  return clipOutput(`${summary}\n${matches.join('\n') || '[no matches]'}${truncated ? '\n...[search limits reached; narrow the path or query]...' : ''}`)
}

async function executeReadonlyTeacherTool(rootPath, name, rawArguments, options = {}) {
  const root = await workspaceRoot(rootPath)
  const args = parseArguments(rawArguments)
  switch (name) {
    case 'list_directory': return await listDirectory(root, args, options.signal)
    case 'read_file': return await readWorkspaceFile(root, args, options.signal)
    case 'search_files': return await searchFiles(root, args, options.signal)
    default: throw new Error(`unknown teacher tool: ${String(name)}`)
  }
}

export {
  READ_ONLY_TEACHER_TOOLS,
  executeReadonlyTeacherTool,
}
