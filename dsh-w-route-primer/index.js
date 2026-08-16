/**
 * dsh-w-route-primer - installs a scoped routing-suite-compatible agent preset.
 */

import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  MODULE_MARKER,
  PLUGIN_ID,
  PRESET_ID,
  PRESET_MARKER,
  ROUTER_BOOTSTRAP_FILE,
  ROUTER_CORE_FILE,
  managedModuleSource,
  managedPresetComposition,
  managedPresetMetadata,
} from './primer-core.js'

export const name = PLUGIN_ID
export const inject = ['agentPresets']

async function writeAtomic(path, text) {
  const temp = join(dirname(path), `.${basename(path)}.${process.pid}.${randomUUID()}.tmp`)
  try {
    await writeFile(temp, text, { encoding: 'utf8', flag: 'wx' })
    await rename(temp, path)
  } finally {
    await rm(temp, { force: true }).catch(() => {})
  }
}

function profileDir(ctx) {
  if (typeof ctx.baseUrl !== 'string') throw new Error(`${PLUGIN_ID}: loader baseUrl is unavailable`)
  return fileURLToPath(new URL('.', ctx.baseUrl))
}

function presetDirectory(ctx) {
  return resolve(profileDir(ctx), '..', '..', '.agent-presets', PRESET_ID)
}

async function assertManagedOrAbsent(path, marker = PRESET_MARKER) {
  try {
    const current = await readFile(path, 'utf8')
    if (!current.startsWith(marker)) {
      throw new Error(`${PLUGIN_ID}: refusing to overwrite unmanaged preset file ${path}`)
    }
  } catch (error) {
    if (error?.code === 'ENOENT') return
    throw error
  }
}

async function bundledModule(file) {
  return readFile(fileURLToPath(new URL(file, import.meta.url)), 'utf8')
}

async function installPreset(ctx) {
  const standard = await ctx.agentPresets.resolve('standard')
  if (standard.broken) throw new Error(`${PLUGIN_ID}: standard preset is broken: ${standard.broken}`)

  const [composition, bootstrapSource, coreSource] = await Promise.all([
    readFile(standard.path, 'utf8'),
    bundledModule(ROUTER_BOOTSTRAP_FILE),
    bundledModule(ROUTER_CORE_FILE),
  ])
  const directory = presetDirectory(ctx)
  const files = [
    { path: join(directory, 'agent.cordis.yml'), marker: PRESET_MARKER, text: managedPresetComposition(composition) },
    { path: join(directory, 'preset.yml'), marker: PRESET_MARKER, text: managedPresetMetadata() },
    { path: join(directory, ROUTER_BOOTSTRAP_FILE), marker: MODULE_MARKER, text: managedModuleSource(bootstrapSource) },
    { path: join(directory, ROUTER_CORE_FILE), marker: MODULE_MARKER, text: managedModuleSource(coreSource) },
  ]

  await mkdir(directory, { recursive: true })
  for (const file of files) await assertManagedOrAbsent(file.path, file.marker)
  for (const file of files) await writeAtomic(file.path, file.text)
}

export async function apply(ctx) {
  await installPreset(ctx)
}

export {
  assertManagedOrAbsent,
  bundledModule,
  installPreset,
  presetDirectory,
  writeAtomic,
}
