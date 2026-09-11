import { isAbsolute } from 'node:path'

function isFilesystemModule(name) {
  return name.startsWith('./')
    || name.startsWith('../')
    || name.startsWith('file:')
    || isAbsolute(name)
}

/** A manageable custom plugin is a package row, not an internal file module. */
export function isCustomModule(name) {
  if (typeof name !== 'string' || name.length === 0) return false
  if (name.startsWith('@deepseek-ai/')) return false
  if (name.startsWith('cordis:')) return false
  if (isFilesystemModule(name)) return false
  return true
}

const SEMVER = /^(?:v)?(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/u

function parseSemver(version) {
  if (typeof version !== 'string') return undefined
  const match = SEMVER.exec(version.trim())
  if (match === null) return undefined
  return {
    core: [Number(match[1]), Number(match[2]), Number(match[3])],
    prerelease: match[4] === undefined ? [] : match[4].split('.'),
  }
}

/** Compare two SemVer strings; returns undefined when either value is not SemVer. */
export function compareSemver(left, right) {
  const a = parseSemver(left)
  const b = parseSemver(right)
  if (a === undefined || b === undefined) return undefined
  for (let index = 0; index < 3; index += 1) {
    if (a.core[index] !== b.core[index]) return a.core[index] < b.core[index] ? -1 : 1
  }
  if (a.prerelease.length === 0 || b.prerelease.length === 0) {
    if (a.prerelease.length === b.prerelease.length) return 0
    return a.prerelease.length === 0 ? 1 : -1
  }
  const length = Math.max(a.prerelease.length, b.prerelease.length)
  for (let index = 0; index < length; index += 1) {
    const av = a.prerelease[index]
    const bv = b.prerelease[index]
    if (av === undefined || bv === undefined) return av === undefined ? -1 : 1
    if (av === bv) continue
    const an = /^\d+$/u.test(av)
    const bn = /^\d+$/u.test(bv)
    if (an && bn) return Number(av) < Number(bv) ? -1 : 1
    if (an !== bn) return an ? -1 : 1
    return av < bv ? -1 : 1
  }
  return 0
}
