/** Run the plugin-owned source tests with an explicit Harness dependency checkout. */
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { spawnSync } from 'node:child_process'

const pluginRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const harnessRoot = resolve(process.argv[2] || process.env.DSH_HARNESS_SOURCE || '../../../deepseek-harness')
const dependencyRequire = createRequire(join(harnessRoot, 'package.json'))
const ts = dependencyRequire('typescript')
const parsed = ts.readConfigFile(join(harnessRoot, 'tsconfig.base.json'), ts.sys.readFile)
if (parsed.error) throw new Error(ts.flattenDiagnosticMessageText(parsed.error.messageText, '\n'))
const config = parsed.config
const alias = Object.entries(config.compilerOptions.paths).filter(([key]) => !key.includes('*')).map(([find, paths]) => ({ find, replacement: resolve(harnessRoot, paths[0]) }))
await mkdir(join(pluginRoot, '.build'), { recursive: true })
const configPath = join(pluginRoot, '.build/vitest.config.mjs')
const sharedUrl = pathToFileURL(join(harnessRoot, 'vitest.shared.ts')).href
await writeFile(configPath, `import {standardDecoratorPlugin,vitestExecArgv} from ${JSON.stringify(sharedUrl)};const config=${JSON.stringify({ root: pluginRoot, resolve: { alias }, test: { include: ['tests/**/*.spec.ts'], testTimeout: 30000, hookTimeout: 30000, pool: 'forks' } })};config.plugins=[standardDecoratorPlugin()];config.test.execArgv=vitestExecArgv;export default config;\n`)
const runner = join(dirname(dependencyRequire.resolve('vitest/package.json')), 'vitest.mjs')
const result = spawnSync(process.execPath, [runner, 'run', '--config', configPath], { cwd: harnessRoot, stdio: 'inherit' })
process.exitCode = result.status ?? 1
