/**
 * dsh-w-computer-use — Host half (no client UI).
 *
 * Registers the "hands" of a Codex-style computer-use loop on `ctx.tools`:
 * absolute mouse control and keyboard input, plus a control SESSION with a
 * visible safety overlay and human interrupt / auto-resume:
 *
 *   - computer_use_start  : show the light-blue tint + top banner (controlling)
 *   - computer_use_stop   : hide the overlay (idle)
 *   - computer_use_state  : report idle | controlling | interrupted
 *
 * All actions are executed by ONE long-lived PowerShell controller process
 * (controller.ps1) which owns the overlay, performs the input, and polls the
 * cursor. Because every agent mouse movement goes through that process, it can
 * tell "agent movement" from "user movement": a cursor position it did not set
 * means the user grabbed the mouse -> interrupted; after `RESUME_MS` of
 * stillness it re-enters controlling. Vision is NOT reimplemented here — the
 * agent composes these tools with `look_at_screen` from dsh-w-vision.
 */

import { defineTool } from '@deepseek-ai/dsh-tools'
import { writeFile, readFile, mkdtemp, rename, rm } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { tmpdir } from 'node:os'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const CONTROLLER_FILE = join(dirname(fileURLToPath(import.meta.url)), 'controller.ps1')
const RESUME_MS = 2000
const REQUEST_TIMEOUT_MS = 15000

let ctrl = null // { proc, dir, seq, stderr }
let requestTail = Promise.resolve()

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function cleanupDirectory(path) {
  for (let attempt = 0; attempt < 8; attempt++) {
    try {
      await rm(path, { recursive: true, force: true })
      return
    } catch {
      await sleep(50 * (attempt + 1))
    }
  }
}

async function ensureController() {
  if (ctrl !== null && ctrl.proc.exitCode === null && ctrl.proc.killed !== true) return ctrl
  if (ctrl !== null) await destroyController()
  const dir = await mkdtemp(join(tmpdir(), 'dsh-w-cu-'))
  const proc = spawn('powershell.exe', [
    '-NoProfile',
    '-ExecutionPolicy',
    'Bypass',
    '-File',
    CONTROLLER_FILE,
    '-CtrlDir',
    dir,
    '-ResumeMs',
    String(RESUME_MS),
  ], {
    windowsHide: true,
    stdio: ['ignore', 'ignore', 'pipe'],
  })
  let stderr = ''
  proc.stderr.on('data', (chunk) => { stderr = (stderr + String(chunk)).slice(-8000) })
  const instance = { proc, dir, seq: 0, stderr: () => stderr }
  proc.once('exit', () => {
    if (ctrl === instance) ctrl = null
    void cleanupDirectory(dir)
  })
  proc.once('error', (error) => {
    stderr = (stderr + '\n' + error.message).slice(-8000)
  })
  ctrl = instance
  return instance
}

async function destroyController() {
  const current = ctrl
  if (current === null) return
  ctrl = null
  try { current.proc.kill() } catch {}
  for (let attempt = 0; attempt < 20 && current.proc.exitCode === null; attempt++) {
    await sleep(50)
  }
  await cleanupDirectory(current.dir)
}

async function performRequest(op, payload = {}, timeoutMs = REQUEST_TIMEOUT_MS) {
  const c = await ensureController()
  const seq = ++c.seq
  const tag = String(seq).padStart(8, '0')
  const cmdPath = join(c.dir, 'cmd-' + tag + '.json')
  const pendingPath = cmdPath + '.tmp'
  const respPath = join(c.dir, 'resp-' + tag + '.json')
  await writeFile(pendingPath, JSON.stringify({ op, ...payload }), 'utf8')
  await rename(pendingPath, cmdPath)
  const deadline = Date.now() + timeoutMs
  try {
    while (Date.now() < deadline) {
      if (c.proc.exitCode !== null || c.proc.killed === true) {
        const detail = c.stderr().trim().slice(-2000)
        throw new Error('computer-use controller exited during op "' + op + '"' + (detail ? '\n' + detail : ''))
      }
      try {
        const raw = await readFile(respPath, 'utf8')
        const result = JSON.parse(raw)
        if (result && result.ok !== true) {
          throw new Error(result.error || ('computer-use op failed: ' + op))
        }
        return result
      } catch (error) {
        if (error && error.code === 'ENOENT') {
          await sleep(40)
          continue
        }
        throw error
      }
    }
    const detail = c.stderr().trim().slice(-2000)
    throw new Error('computer-use controller timed out for op "' + op + '"' + (detail ? '\n' + detail : ''))
  } finally {
    await Promise.all([
      rm(pendingPath, { force: true }),
      rm(cmdPath, { force: true }),
      rm(respPath, { force: true }),
    ].map((operation) => operation.catch(() => {})))
  }
}

function request(op, payload = {}, timeoutMs = REQUEST_TIMEOUT_MS) {
  const run = requestTail.then(
    () => performRequest(op, payload, timeoutMs),
    () => performRequest(op, payload, timeoutMs),
  )
  requestTail = run.catch(() => {})
  return run
}

async function readState() {
  if (ctrl === null) return { mode: 'idle', coordinateSpace: 'physical-virtual-desktop' }
  try {
    const raw = await readFile(join(ctrl.dir, 'state.json'), 'utf8')
    return JSON.parse(raw)
  } catch {
    return { mode: 'idle', coordinateSpace: 'physical-virtual-desktop' }
  }
}

const OK_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    ok: { type: 'boolean', required: true },
  },
}
const okRender = (_args, value) => [{ type: 'text', text: value.ok ? 'ok' : 'failed' }]

const COORDINATE_SPACE = 'physical-virtual-desktop'
const RECT_PROPERTIES = {
  x: { type: 'integer', required: true },
  y: { type: 'integer', required: true },
  width: { type: 'integer', required: true },
  height: { type: 'integer', required: true },
}
const COORDINATE_SPACE_PROPERTY = {
  type: 'string',
  enum: [COORDINATE_SPACE],
  required: true,
}

export const inject = ['tools']
export const name = 'dsh-w-computer-use'

export function apply(ctx) {
  ctx.effect(() => () => {
    void destroyController()
  }, 'dsh-w-computer-use: controller lifecycle')

  // When a turn ends normally (the agent finished its loop), exit control mode
  // so the overlay does not linger. A manual abort (user pressed stop) is
  // handled by the controller's idle watchdog instead.
  ctx.on('agent/turn-stopping', () => {
    if (ctrl !== null) void request('stop', {}, 3000).catch(() => {})
  })

  ctx.tools.register(defineTool({
    name: 'screen_size',
    description: 'Get the primary monitor rectangle in physical Windows desktop pixels. Coordinates exactly match look_at_screen screenshots and mouse tools. Use screen_layout when multiple monitors may be present.',
    parameters: {},
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          ...RECT_PROPERTIES,
          coordinateSpace: COORDINATE_SPACE_PROPERTY,
        },
      },
      render: (_args, value) => [{
        type: 'text',
        text: 'primary monitor: [' + value.x + ',' + value.y + ' ' + value.width + 'x' + value.height + '] physical pixels',
      }],
    },
    async execute() {
      const r = await request('screen_size')
      return {
        x: r.x,
        y: r.y,
        width: r.width,
        height: r.height,
        coordinateSpace: COORDINATE_SPACE,
      }
    },
  }))

  ctx.tools.register(defineTool({
    name: 'screen_layout',
    description: 'Get the complete Windows virtual desktop and every monitor in physical pixels. Secondary monitors may have negative x/y. These coordinates exactly match look_at_screen screenshots, cursor_position, mouse tools, and window rectangles.',
    parameters: {},
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          ...RECT_PROPERTIES,
          coordinateSpace: COORDINATE_SPACE_PROPERTY,
          monitors: {
            type: 'array',
            required: true,
            items: {
              type: 'object',
              additionalProperties: false,
              properties: {
                device: { type: 'string', required: true },
                primary: { type: 'boolean', required: true },
                ...RECT_PROPERTIES,
                workX: { type: 'integer', required: true },
                workY: { type: 'integer', required: true },
                workWidth: { type: 'integer', required: true },
                workHeight: { type: 'integer', required: true },
              },
            },
          },
        },
      },
      render: (_args, value) => [{
        type: 'text',
        text: 'virtual desktop: [' + value.x + ',' + value.y + ' ' + value.width + 'x' + value.height + '] physical pixels\n'
          + value.monitors.map((monitor) => (monitor.primary ? '* ' : '  ') + monitor.device + ': ['
            + monitor.x + ',' + monitor.y + ' ' + monitor.width + 'x' + monitor.height + ']').join('\n'),
      }],
    },
    async execute() {
      const r = await request('screen_layout')
      return {
        x: r.x,
        y: r.y,
        width: r.width,
        height: r.height,
        coordinateSpace: COORDINATE_SPACE,
        monitors: r.monitors || [],
      }
    },
  }))

  ctx.tools.register(defineTool({
    name: 'cursor_position',
    description: 'Read the current cursor position in physical virtual-desktop pixels. Use this diagnostic after mouse_move when checking coordinate alignment.',
    parameters: {},
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          x: { type: 'integer', required: true },
          y: { type: 'integer', required: true },
          coordinateSpace: COORDINATE_SPACE_PROPERTY,
        },
      },
      render: (_args, value) => [{
        type: 'text',
        text: 'cursor: (' + value.x + ',' + value.y + ') physical pixels',
      }],
    },
    async execute() {
      const r = await request('cursor_position')
      return { x: r.x, y: r.y, coordinateSpace: COORDINATE_SPACE }
    },
  }))

  ctx.tools.register(defineTool({
    name: 'computer_use_start',
    description: 'Enter computer-control mode: show a light-blue screen tint and a top banner so the user can see the agent is in control. While controlling, if the USER moves the mouse, control pauses (interrupted); after about 2 seconds of mouse stillness it resumes automatically.',
    parameters: {},
    output: { schema: OK_SCHEMA, render: okRender },
    async execute() {
      await request('start')
      return { ok: true }
    },
  }))

  ctx.tools.register(defineTool({
    name: 'computer_use_stop',
    description: 'Exit computer-control mode and hide the overlay.',
    parameters: {},
    output: { schema: OK_SCHEMA, render: okRender },
    async execute() {
      await request('stop')
      return { ok: true }
    },
  }))

  ctx.tools.register(defineTool({
    name: 'computer_use_state',
    description: 'Report the current control mode: "idle" (not controlling), "controlling" (overlay shown, agent in control), or "interrupted" (the user moved the mouse; auto-resumes after stillness). Check this before/after actions to detect human takeover.',
    parameters: {},
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          mode: { type: 'string', required: true },
          x: { type: 'integer' },
          y: { type: 'integer' },
          coordinateSpace: { type: 'string', enum: [COORDINATE_SPACE] },
        },
      },
      render: (_args, value) => [{
        type: 'text',
        text: 'mode: ' + value.mode + (Number.isInteger(value.x) ? '; cursor: (' + value.x + ',' + value.y + ')' : ''),
      }],
    },
    async execute() {
      const st = await readState()
      const value = { mode: st.mode || 'idle' }
      if (Number.isInteger(st.x) && Number.isInteger(st.y)) {
        value.x = st.x
        value.y = st.y
        value.coordinateSpace = COORDINATE_SPACE
      }
      return value
    },
  }))

  ctx.tools.register(defineTool({
    name: 'mouse_move',
    description: 'Move the cursor to an absolute physical virtual-desktop coordinate. Use coordinates directly from look_at_screen; do not apply DPI scaling. Negative coordinates are valid on monitors left/above the primary monitor.',
    parameters: {
      x: { type: 'integer', required: true, description: 'Physical virtual-desktop X coordinate.' },
      y: { type: 'integer', required: true, description: 'Physical virtual-desktop Y coordinate.' },
    },
    output: { schema: OK_SCHEMA, render: okRender },
    async execute(args) {
      await request('move', { x: args.x, y: args.y })
      return { ok: true }
    },
  }))

  ctx.tools.register(defineTool({
    name: 'mouse_click',
    description: 'Move to an absolute physical virtual-desktop coordinate and click. Coordinates from look_at_screen must be used directly with no DPI conversion.',
    parameters: {
      x: { type: 'integer', required: true, description: 'Physical virtual-desktop X coordinate.' },
      y: { type: 'integer', required: true, description: 'Physical virtual-desktop Y coordinate.' },
      button: { type: 'string', enum: ['left', 'right', 'middle'], description: 'Which button to press; defaults to left.' },
      clicks: { type: 'integer', description: '1 (default) or 2 for a double-click.' },
    },
    output: { schema: OK_SCHEMA, render: okRender },
    async execute(args) {
      await request('click', { x: args.x, y: args.y, button: args.button, clicks: args.clicks })
      return { ok: true }
    },
  }))

  ctx.tools.register(defineTool({
    name: 'mouse_drag',
    description: 'Smoothly drag between two physical virtual-desktop coordinates while holding a mouse button. Coordinates from look_at_screen require no DPI conversion.',
    parameters: {
      x1: { type: 'integer', required: true, description: 'Start physical X coordinate.' },
      y1: { type: 'integer', required: true, description: 'Start physical Y coordinate.' },
      x2: { type: 'integer', required: true, description: 'End physical X coordinate.' },
      y2: { type: 'integer', required: true, description: 'End physical Y coordinate.' },
      button: { type: 'string', enum: ['left', 'right'], description: 'Which button to hold; defaults to left.' },
      durationMs: { type: 'integer', description: 'Drag duration in milliseconds (80-5000); defaults to 300.' },
    },
    output: { schema: OK_SCHEMA, render: okRender },
    async execute(args) {
      await request('drag', {
        x1: args.x1,
        y1: args.y1,
        x2: args.x2,
        y2: args.y2,
        button: args.button,
        durationMs: args.durationMs,
      })
      return { ok: true }
    },
  }))

  ctx.tools.register(defineTool({
    name: 'mouse_scroll',
    description: 'Move to a physical virtual-desktop coordinate and roll the mouse wheel. Positive scrolls up and negative scrolls down; 120 is one notch.',
    parameters: {
      x: { type: 'integer', required: true, description: 'Physical virtual-desktop X coordinate.' },
      y: { type: 'integer', required: true, description: 'Physical virtual-desktop Y coordinate.' },
      amount: { type: 'integer', required: true, description: 'Wheel delta; positive = up, negative = down.' },
    },
    output: { schema: OK_SCHEMA, render: okRender },
    async execute(args) {
      await request('scroll', { x: args.x, y: args.y, amount: args.amount })
      return { ok: true }
    },
  }))

  ctx.tools.register(defineTool({
    name: 'keyboard_type',
    description: 'Insert literal Unicode text into the focused window. The clipboard is used briefly for reliable multiline input and its previous contents are restored afterward.',
    parameters: {
      text: { type: 'string', required: true, description: 'The exact text to type.' },
    },
    output: { schema: OK_SCHEMA, render: okRender },
    async execute(args) {
      await request('type', { text: args.text })
      return { ok: true }
    },
  }))

  ctx.tools.register(defineTool({
    name: 'keyboard_press',
    description: 'Press one key with optional modifiers using SendKeys-style notation: ^c = Ctrl+C, %{F4} = Alt+F4, +a = Shift+A, {ENTER}, {TAB}, {ESC}, arrow keys, {BACKSPACE}, {DELETE}, {INSERT}, {HOME}, {END}, {PGUP}, {PGDN}, or F1-F24.',
    parameters: {
      keys: { type: 'string', required: true, description: 'SendKeys key combination string.' },
    },
    output: { schema: OK_SCHEMA, render: okRender },
    async execute(args) {
      await request('key', { keys: args.keys })
      return { ok: true }
    },
  }))

  ctx.tools.register(defineTool({
    name: 'list_windows',
    description: 'List visible top-level windows and their rectangles in physical virtual-desktop pixels. The optional title filter is case-insensitive. Use a returned handle when title text is ambiguous.',
    parameters: {
      title: { type: 'string', description: 'Optional case-insensitive substring to filter window titles.' },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          windows: {
            type: 'array',
            required: true,
            items: {
              type: 'object',
              additionalProperties: false,
              properties: {
                title: { type: 'string', required: true },
                handle: { type: 'string', required: true },
                foreground: { type: 'boolean', required: true },
                minimized: { type: 'boolean', required: true },
                maximized: { type: 'boolean', required: true },
                ...RECT_PROPERTIES,
              },
            },
          },
          coordinateSpace: COORDINATE_SPACE_PROPERTY,
        },
      },
      render: (_args, value) => [{ type: 'text', text: (value.windows || []).map((w) => `${w.foreground ? '>' : ' '} ${w.title} [${w.x},${w.y} ${w.width}x${w.height}]`).join('\n') }],
    },
    async execute(args) {
      const r = await request('list_windows', { title: args && args.title })
      return { windows: r.windows || [], coordinateSpace: COORDINATE_SPACE }
    },
  }))

  ctx.tools.register(defineTool({
    name: 'move_window',
    description: 'Move and resize a visible window in physical virtual-desktop pixels, then foreground it. Identify the window by a unique case-insensitive title substring or, preferably, a handle from list_windows.',
    parameters: {
      title: { type: 'string', description: 'Unique case-insensitive title substring; omit when handle is supplied.' },
      handle: { type: 'string', description: 'Exact handle from list_windows; avoids ambiguous title matches.' },
      x: { type: 'integer', required: true, description: 'Target physical left edge.' },
      y: { type: 'integer', required: true, description: 'Target physical top edge.' },
      width: { type: 'integer', required: true, description: 'Target physical width.' },
      height: { type: 'integer', required: true, description: 'Target physical height.' },
    },
    output: { schema: OK_SCHEMA, render: okRender },
    async execute(args) {
      if (!args.title && !args.handle) throw new Error('move_window requires title or handle')
      await request('move_window', {
        title: args.title,
        handle: args.handle,
        x: args.x,
        y: args.y,
        width: args.width,
        height: args.height,
      })
      return { ok: true }
    },
  }))

  ctx.tools.register(defineTool({
    name: 'foreground_window',
    description: 'Bring a visible window to the foreground using a unique case-insensitive title substring or a handle from list_windows.',
    parameters: {
      title: { type: 'string', description: 'Unique case-insensitive title substring; omit when handle is supplied.' },
      handle: { type: 'string', description: 'Exact handle from list_windows.' },
    },
    output: { schema: OK_SCHEMA, render: okRender },
    async execute(args) {
      if (!args.title && !args.handle) throw new Error('foreground_window requires title or handle')
      await request('foreground_window', { title: args.title, handle: args.handle })
      return { ok: true }
    },
  }))
}
