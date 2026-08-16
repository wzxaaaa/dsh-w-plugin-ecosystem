import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const source = await readFile(new URL('../client.js', import.meta.url), 'utf8')
const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'))

test('exports the declared DSH client bundle', () => {
  assert.equal(manifest.exports['./client'], './client.js')
  assert.equal(manifest.dsh.client.platform, 'web')
})

test('registers the custom plugin settings protocol with the package key', () => {
  assert.match(source, /slots\.inject\("custom-plugin\.settings"/u)
  assert.match(source, /key: PLUGIN_ID/u)
})

test('uses a persistent full-window media layer with cover sizing', () => {
  assert.match(source, /position:fixed;inset:0/u)
  assert.match(source, /object-fit:cover/u)
  assert.match(source, /indexedDB\.open/u)
  assert.match(source, /URL\.createObjectURL/u)
})

test('keeps the shell and the left workspace transparent while wallpaper is active', () => {
  assert.match(source, /--dsw-specific-sidebar-fill:transparent!important/u)
  assert.match(source, /\[class\*=sidebarCol\]\)\{background:transparent!important\}/u)
  assert.match(source, /\[class\*=sidebarCol\]\)>div\{background:transparent!important\}/u)
})

test('persists and applies adjustable wallpaper blur without viewport edge gaps', () => {
  assert.match(source, /--dsh-w-wallpaper-blur/u)
  assert.match(source, /--dsh-w-wallpaper-bleed/u)
  assert.match(source, /filter:blur\(var\(--dsh-w-wallpaper-blur\)\)/u)
  assert.match(source, /blur: normalizedBlur/u)
  assert.match(source, /t\("blurLabel"\)/u)
  assert.match(source, /min: MIN_BLUR/u)
  assert.match(source, /max: MAX_BLUR/u)
})

test('configures videos for muted looping playback and adjustable speed', () => {
  assert.match(source, /media\.autoplay = true/u)
  assert.match(source, /media\.loop = true/u)
  assert.match(source, /media\.muted = true/u)
  assert.match(source, /media\.playbackRate = normalizeSpeed/u)
  assert.match(source, /type: "range"/u)
})
