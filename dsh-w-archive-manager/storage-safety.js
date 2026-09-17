import { basename, dirname, isAbsolute, relative, resolve, sep } from 'node:path'

export function encodeSegment(raw) {
  if (raw.length === 0) throw new Error('cannot encode an empty session id')
  if (raw === '.') return '~002E'
  if (raw === '..') return '~002E~002E'
  let output = ''
  for (let index = 0; index < raw.length; index += 1) {
    const code = raw.charCodeAt(index)
    const character = String.fromCharCode(code)
    output += character !== '~' && /^[A-Za-z0-9._-]$/.test(character)
      ? character
      : `~${code.toString(16).toUpperCase().padStart(4, '0')}`
  }
  return output
}

function strictDescendant(root, target) {
  const nested = relative(root, target)
  return nested.length > 0 && !isAbsolute(nested) && nested !== '..' && !nested.startsWith(`..${sep}`)
}

export function jsonlSessionDirectory(persistence, header, location) {
  if (typeof persistence.root !== 'string' || !isAbsolute(persistence.root)) {
    throw new Error('JSONL persistence did not expose a safe absolute root')
  }
  if (typeof location?.path !== 'string' || !isAbsolute(location.path)) {
    throw new Error('JSONL persistence returned an unsafe session artifact path')
  }
  const root = resolve(persistence.root)
  const artifact = resolve(location.path)
  const sessionDirectory = dirname(artifact)
  const nested = relative(root, sessionDirectory)
  const segments = nested.split(/[\\/]+/).filter(Boolean)
  if (!strictDescendant(root, artifact)
    || !strictDescendant(root, sessionDirectory)
    || segments.length < 2
    || basename(sessionDirectory) !== encodeSegment(header.id)) {
    throw new Error('JSONL persistence returned a path outside the expected session directory')
  }
  return sessionDirectory
}
