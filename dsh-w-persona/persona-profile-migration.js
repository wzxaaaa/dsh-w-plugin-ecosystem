import { constants } from 'node:fs'
import { copyFile, mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { basename, dirname, join } from 'node:path'
import { randomUUID } from 'node:crypto'
import { normalizeDialoguePreset } from './dialogue-preset-core.js'
import { normalizePersonaTemplateLibrary } from './persona-template-core.js'

const FILES = ['.dsh-w-persona-override.json', '.dsh-w-persona-dialogue.json', '.dsh-w-persona-templates.json']
const MARKER = '.dsh-w-persona-web-migration.json'
async function exists(path) {
  try { await stat(path); return true } catch (error) { if (error.code === 'ENOENT') return false; throw error }
}

/** Adopt missing legacy state once, preserving both profiles and their defaults. */
export async function migrateLegacyPersona(profileDir) {
  if (basename(profileDir).toLowerCase() !== 'desktop' || await exists(join(profileDir, MARKER))) return { migrated: [] }
  const sourceDir = join(dirname(profileDir), 'web')
  const candidates = []
  let hasLegacy = false
  for (const name of FILES) {
    if (!await exists(join(sourceDir, name))) continue
    hasLegacy = true
    if (await exists(join(profileDir, name))) continue
    const raw = await readFile(join(sourceDir, name))
    if (raw.length > 8 * 1024 * 1024) throw new Error(`${name}: legacy persona state exceeds 8 MB`)
    const value = JSON.parse(raw.toString('utf8'))
    if (name.endsWith('templates.json')) normalizePersonaTemplateLibrary(value)
    else if (name.endsWith('dialogue.json')) normalizeDialoguePreset(value)
    else if (value?.persona !== null && typeof value?.persona !== 'string') throw new Error('Legacy persona override is invalid')
    candidates.push({ name, raw })
  }
  if (!hasLegacy) return { migrated: [] }
  const backupDir = candidates.length ? join(profileDir, '.dsh-w-persona-backups', `web-migration-${randomUUID()}`) : undefined
  if (backupDir) await mkdir(backupDir, { recursive: true })
  for (const { name, raw } of candidates) await writeFile(join(backupDir, name), raw, { flag: 'wx' })
  const migrated = []
  for (const { name } of candidates) {
    try {
      // Copy the validated backup, not a source that may change during migration.
      await copyFile(join(backupDir, name), join(profileDir, name), constants.COPYFILE_EXCL)
      migrated.push(name)
    } catch (error) { if (error.code !== 'EEXIST') throw error }
  }
  await writeFile(join(profileDir, MARKER), JSON.stringify({ version: 1, source: 'web', migrated, backupDir, migratedAt: new Date().toISOString() }), { flag: 'wx' }).catch(error => { if (error.code !== 'EEXIST') throw error })
  return backupDir ? { migrated, backupDir } : { migrated }
}
