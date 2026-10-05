/** Build the W-series package with the dependency runtime of a Harness checkout. */
import { createRequire } from 'node:module'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const pluginRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const harnessRoot = resolve(process.argv[2] || process.env.DSH_HARNESS_SOURCE || '../../../deepseek-harness')
const harnessRequire = createRequire(join(harnessRoot, 'package.json'))
const esbuildPath = harnessRequire.resolve('tsx').replace(/tsx[\\/]dist[\\/].*$/, 'esbuild/lib/main.js')
const { build } = harnessRequire(esbuildPath)
const { transform } = harnessRequire('lightningcss')
const dependencyRoots = [join(harnessRoot, 'packages/experimental/studio/node_modules'), join(harnessRoot, 'node_modules')]
const shared = { absWorkingDir: pluginRoot, bundle: true, target: 'es2024', nodePaths: dependencyRoots, logLevel: 'info' }

await mkdir(join(pluginRoot, '.build'), { recursive: true })
await build({ ...shared, entryPoints: ['src/index.ts'], outfile: 'index.js', platform: 'node', format: 'esm',
  external: ['@deepseek-ai/cordis', '@deepseek-ai/dsh-credentials', '@deepseek-ai/dsh-subprocess', '@deepseek-ai/schemastery'] })
await build({ ...shared, entryPoints: ['src/client/index.ts'], outfile: 'client.js', platform: 'browser', format: 'cjs',
  jsx: 'automatic', external: ['react', 'react/jsx-runtime'],
  define: { 'process.env.NODE_ENV': '"production"' },
  banner: { js: 'window.__ModuleLoader__.load({id:"dsh-w-studio",factory:(require)=>{var module={exports:{}};var exports=module.exports;' },
  footer: { js: 'return module.exports;}});' },
  plugins: [{ name: 'studio-css-modules', setup(builder) {
    builder.onLoad({ filter: /\.module\.css$/ }, async ({ path }) => {
      const { code, exports } = transform({ filename: path, code: Buffer.from(await readFile(path)), cssModules: true, minify: true })
      const classes = Object.fromEntries(Object.entries(exports).map(([key, value]) => [key, value.name]))
      return { loader: 'js', contents: `const tagId="dsh-w-studio/styles";if(typeof document!=="undefined"){let tag=document.querySelector('style[data-plugin-css="'+tagId+'"]');if(!tag){tag=document.createElement("style");tag.dataset.plugin="dsh-w-studio";tag.dataset.pluginCss=tagId;document.head.appendChild(tag);}tag.textContent=${JSON.stringify(code.toString())};}export default ${JSON.stringify(classes)};` }
    })
  } }] })
const provenance = { plugin: 'dsh-w-studio', version: JSON.parse(await readFile(join(pluginRoot, 'package.json'), 'utf8')).version,
  harnessVersion: JSON.parse(await readFile(join(harnessRoot, 'package.json'), 'utf8')).version,
  harnessCommit: spawnSync('git', ['rev-parse', 'HEAD'], { cwd: harnessRoot, encoding: 'utf8' }).stdout.trim() }
await writeFile(join(pluginRoot, 'BUILD.json'), JSON.stringify(provenance, null, 2) + '\n')
