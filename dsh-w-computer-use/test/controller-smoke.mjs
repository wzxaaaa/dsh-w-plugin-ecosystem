import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { mkdtemp, readFile, rename, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const controller = join(root, 'controller.ps1')
const dir = await mkdtemp(join(tmpdir(), 'dsh-w-cu-test-'))
const proc = spawn('powershell.exe', [
  '-NoProfile',
  '-ExecutionPolicy',
  'Bypass',
  '-File',
  controller,
  '-CtrlDir',
  dir,
], {
  windowsHide: true,
  stdio: ['ignore', 'ignore', 'pipe'],
})

let stderr = ''
proc.stderr.on('data', (chunk) => { stderr = (stderr + String(chunk)).slice(-8000) })

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function waitForFile(path, timeoutMs = 10000) {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    if (proc.exitCode !== null) throw new Error('controller exited: ' + stderr)
    try {
      return await readFile(path, 'utf8')
    } catch (error) {
      if (!error || error.code !== 'ENOENT') throw error
    }
    await sleep(40)
  }
  throw new Error('timed out waiting for ' + path + (stderr ? '\n' + stderr : ''))
}

let seq = 0
async function request(op, payload = {}) {
  const tag = String(++seq).padStart(8, '0')
  const commandPath = join(dir, 'cmd-' + tag + '.json')
  const pendingPath = commandPath + '.tmp'
  const responsePath = join(dir, 'resp-' + tag + '.json')
  await writeFile(pendingPath, JSON.stringify({ op, ...payload }), 'utf8')
  await rename(pendingPath, commandPath)
  return JSON.parse(await waitForFile(responsePath))
}

try {
  await waitForFile(join(dir, 'state.json'))

  const layout = await request('screen_layout')
  assert.equal(layout.ok, true)
  assert.equal(layout.coordinateSpace, 'physical-virtual-desktop')
  assert.ok(layout.width > 0 && layout.height > 0)
  assert.ok(Array.isArray(layout.monitors) && layout.monitors.length >= 1)

  const before = await request('cursor_position')
  assert.equal(before.ok, true)
  assert.ok(before.x >= layout.x && before.x < layout.x + layout.width)
  assert.ok(before.y >= layout.y && before.y < layout.y + layout.height)

  assert.equal((await request('move', { x: before.x, y: before.y })).ok, true)
  const after = await request('cursor_position')
  assert.deepEqual([after.x, after.y], [before.x, before.y])
  assert.equal((await request('stop')).ok, true)

  const invalid = await request('move', { x: layout.x + layout.width, y: layout.y })
  assert.equal(invalid.ok, false)
  assert.match(invalid.error, /outside the physical virtual desktop/)

  const windowsBefore = await request('list_windows')
  assert.equal(windowsBefore.ok, true)
  assert.ok(Array.isArray(windowsBefore.windows))
  const foregroundBefore = windowsBefore.windows.find((window) => window.foreground)

  assert.equal((await request('start')).ok, true)
  const windowsAfter = await request('list_windows')
  const foregroundAfter = windowsAfter.windows.find((window) => window.foreground)
  if (foregroundBefore && foregroundAfter) {
    assert.equal(foregroundAfter.handle, foregroundBefore.handle, 'control overlay stole foreground focus')
  }
  assert.equal((await request('stop')).ok, true)

  console.log(JSON.stringify({
    coordinateSpace: layout.coordinateSpace,
    virtualDesktop: [layout.x, layout.y, layout.width, layout.height],
    monitors: layout.monitors.length,
    cursor: [after.x, after.y],
    windows: windowsAfter.windows.length,
    overlayPreservedFocus: Boolean(foregroundBefore && foregroundAfter),
  }, null, 2))
} finally {
  if (proc.exitCode === null) {
    proc.kill()
    await Promise.race([once(proc, 'exit'), sleep(1000)]).catch(() => {})
  }
  await rm(dir, { recursive: true, force: true })
}
