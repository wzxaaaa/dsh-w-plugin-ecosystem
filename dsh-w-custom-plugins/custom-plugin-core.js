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
