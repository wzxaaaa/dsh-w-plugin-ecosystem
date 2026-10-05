/** Start the W plugin through a built dsh Web profile in an explicit source checkout. */
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { mkdir, writeFile } from 'node:fs/promises'
import { spawn } from 'node:child_process'

const pluginRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const harnessRoot = resolve(process.argv[2] || process.env.DSH_HARNESS_SOURCE || '../../../deepseek-harness')
const dshBin = join(harnessRoot, 'apps/cli/lib/bin.js')
const patch = join(pluginRoot, '.build/web.patch.json')
await mkdir(dirname(patch), { recursive: true })
await writeFile(patch, JSON.stringify([{ insert: [{ id: 'dsh-w-studio', name: join(pluginRoot, 'index.js'), config: { dshBin } }] }], null, 2) + '\n')
const child = spawn(process.execPath, [dshBin, 'web', '--patch', patch, ...process.argv.slice(3)], { cwd: harnessRoot, stdio: 'inherit' })
child.on('error', error => { console.error(error.message); process.exitCode = 1 })
child.on('exit', code => { process.exitCode = code ?? 1 })
