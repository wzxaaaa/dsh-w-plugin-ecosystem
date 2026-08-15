/**
 * dsh-w-vision — Host half.
 *
 * Two faces in one service:
 *   1. A `vision` Typert Remote service (`getConfig` / `saveConfig` /
 *      `analyzeUploads`) so the browser settings form can edit the relay and
 *      dsh-w-easy-upload can turn draft images into safe text context. Config
 *      lives in a JSON state file in the profile dir and is read live.
 *   2. A model tool `look_at_screen` registered on `ctx.tools`: it captures the
 *      current Windows screen (PowerShell + System.Drawing) and asks the relay
 *      vision model for a structured text description.
 *
 * NOTE: decorators are emitted in the tsdown-compiled form because the shipped
 * Node runtime does not enable the native stage-3 decorator syntax by default.
 */

import { Remote, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
import { defineTool } from '@deepseek-ai/dsh-tools'
import { readFile, writeFile, mkdtemp, rm } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { tmpdir } from 'node:os'
import { randomUUID } from 'node:crypto'
import { spawn } from 'node:child_process'
import {
  buildUploadVisionContent,
  callVisionApi,
  normalizeUploadBatch,
} from './vision-core.js'

var __runInitializers = function (thisArg, initializers, value) {
  var useValue = arguments.length > 2
  for (var i = 0; i < initializers.length; i++) value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg)
  return useValue ? value : void 0
}
var __esDecorate = function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) {
    if (f !== void 0 && typeof f !== 'function') throw new TypeError('Function expected')
    return f
  }
  var kind = contextIn.kind, key = kind === 'getter' ? 'get' : kind === 'setter' ? 'set' : 'value'
  var target = !descriptorIn && ctor ? contextIn['static'] ? ctor : ctor.prototype : null
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {})
  var _, done = false
  for (var i = decorators.length - 1; i >= 0; i--) {
    var context = {}
    for (var p in contextIn) context[p] = p === 'access' ? {} : contextIn[p]
    for (var p in contextIn.access) context.access[p] = contextIn.access[p]
    context.addInitializer = function (f) {
      if (done) throw new TypeError('Cannot add initializers after decoration has completed')
      extraInitializers.push(accept(f || null))
    }
    var result = (0, decorators[i])(kind === 'accessor' ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context)
    if (kind === 'accessor') {
      if (result === void 0) continue
      if (result === null || typeof result !== 'object') throw new TypeError('Object expected')
      if (_ = accept(result.get)) descriptor.get = _
      if (_ = accept(result.set)) descriptor.set = _
      if (_ = accept(result.init)) initializers.unshift(_)
    } else if (_ = accept(result)) if (kind === 'field') initializers.unshift(_)
    else descriptor[key] = _
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor)
  done = true
}

const STATE_FILE = '.dsh-w-vision.json'
const DEFAULT_MODEL = 'gpt-5.6-sol'

/**
 * Fixed screen-reader prompt. Kept out of the settings UI on purpose. It asks
 * for a structured UI inventory with pixel bounding boxes (not prose), because
 * the consuming agent needs exact coordinates to click on things.
 */
const FIXED_PROMPT = [
  'You are the visual cortex of an AI agent that controls the user\'s Windows machine. You receive exactly one screenshot. Produce BOTH of the following:',
  '',
  '[A] OVERVIEW: 1-3 sentences naming the active windows, the overall layout, and any obvious error, loading, pending-action, or required-input state.',
  '',
  '[B] UI INVENTORY (the important part): list every interactive element you can identify — buttons, text input boxes, menus, tabs, icons, links, scrollbars, toolbars, dialogs. For EACH, output one line in this exact shape:',
  '    role | label-or-visible-text | box [x1,y1,x2,y2] | center (cx,cy)',
  'where every coordinate is an absolute PHYSICAL WINDOWS VIRTUAL-DESKTOP pixel. The screenshot geometry supplied below defines how image pixels map to desktop pixels.',
  '',
  'RULES:',
  '- Coordinates must be integer desktop pixels estimated from the image, not vague guesses; if you cannot estimate a box, write "unknown box" for that element.',
  '- Never output normalized 0-1, 0-1000, CSS, logical, or DPI-scaled coordinates.',
  '- Compute each center from its final absolute box: cx = round((x1+x2)/2), cy = round((y1+y2)/2).',
  '- If an element is partially off-screen, report its visible part and append "clipped".',
  '- If the user names a specific element (e.g. "the send button" or "the message input box"), put that element FIRST and give its exact box and center.',
  '- Prefer precision and completeness of the inventory over prose. Do not invent elements that are not visible.',
  '- Write the overview prose in the language the user has been using, or English if unclear.',
].join('\n')

function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      windowsHide: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    let stdout = ''
    let stderr = ''
    child.stdout.on('data', (chunk) => { stdout += String(chunk) })
    child.stderr.on('data', (chunk) => { stderr += String(chunk) })
    if (options.signal) {
      options.signal.addEventListener('abort', () => { child.kill() }, { once: true })
    }
    child.once('error', reject)
    child.once('exit', (code) => {
      if (code === 0) resolve(stdout)
      else reject(new Error(`${command} exited with code ${String(code)}${stderr ? `: ${stderr}`.slice(0, 4000) : ''}`))
    })
  })
}

let VisionService = (() => {
  let _classSuper = TypertRemoteService
  let _instanceExtraInitializers = []
  let _getConfig_decorators
  let _saveConfig_decorators
  let _analyzeUploads_decorators
  return class VisionService extends _classSuper {
    static {
      const _metadata = typeof Symbol === 'function' && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0
      _getConfig_decorators = [Remote('getConfig')]
      __esDecorate(this, null, _getConfig_decorators, {
        kind: 'method', name: 'getConfig', static: false, private: false,
        access: { has: (obj) => 'getConfig' in obj, get: (obj) => obj.getConfig },
        metadata: _metadata,
      }, null, _instanceExtraInitializers)
      _saveConfig_decorators = [Remote('saveConfig')]
      __esDecorate(this, null, _saveConfig_decorators, {
        kind: 'method', name: 'saveConfig', static: false, private: false,
        access: { has: (obj) => 'saveConfig' in obj, get: (obj) => obj.saveConfig },
        metadata: _metadata,
      }, null, _instanceExtraInitializers)
      _analyzeUploads_decorators = [Remote('analyzeUploads')]
      __esDecorate(this, null, _analyzeUploads_decorators, {
        kind: 'method', name: 'analyzeUploads', static: false, private: false,
        access: { has: (obj) => 'analyzeUploads' in obj, get: (obj) => obj.analyzeUploads },
        metadata: _metadata,
      }, null, _instanceExtraInitializers)
      if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata })
    }

    static inject = ['tools']

    constructor(ctx) {
      super(ctx, 'vision')
      __runInitializers(this, _instanceExtraInitializers)
      this._config = undefined
      const self = this
      this.ctx.tools.register(defineTool({
        name: 'look_at_screen',
        description: 'Capture the physical Windows virtual desktop (or a sub-region) and return interactive-element boxes in the exact coordinate space used by dsh-w-computer-use. Pass a region to zoom in for more accurate centers. Use returned coordinates directly without DPI scaling.',
        parameters: {
          question: {
            type: 'string',
            description: 'Optional: which element to locate (e.g. "the message input box", "the send button"). It will be listed first in the result.',
          },
          region: {
            type: 'object',
            additionalProperties: false,
            properties: {
              x: { type: 'integer', required: true, description: 'Crop origin X in physical virtual-desktop pixels.' },
              y: { type: 'integer', required: true, description: 'Crop origin Y in physical virtual-desktop pixels.' },
              width: { type: 'integer', required: true, description: 'Positive physical crop width.' },
              height: { type: 'integer', required: true, description: 'Positive physical crop height.' },
            },
            description: 'Optional physical virtual-desktop rectangle. It must be fully inside screen_layout. A tight crop makes small controls more accurate.',
          },
        },
        output: {
          schema: {
            type: 'object',
            additionalProperties: false,
            properties: {
              description: { type: 'string', required: true },
              x: { type: 'integer', required: true },
              y: { type: 'integer', required: true },
              width: { type: 'integer', required: true },
              height: { type: 'integer', required: true },
              coordinateSpace: { type: 'string', enum: ['physical-virtual-desktop'], required: true },
            },
          },
          render: (_args, value) => [{ type: 'text', text: value.description }],
        },
        async execute(args, exec) {
          const signal = exec && exec.signal ? exec.signal : undefined
          const config = await self.readConfig()
          const region = args && args.region && typeof args.region === 'object' ? args.region : undefined
          const capture = await self.captureScreen(signal, region)
          const result = await describeImage(config, capture, args && args.question, signal)
          const geometry = 'CAPTURE: physical desktop [' + capture.x + ',' + capture.y + ' '
            + capture.width + 'x' + capture.height + ']. Use coordinates below directly; do not DPI-scale them.'
          return {
            description: geometry + '\n' + result,
            x: capture.x,
            y: capture.y,
            width: capture.width,
            height: capture.height,
            coordinateSpace: 'physical-virtual-desktop',
          }
        },
      }))
    }

    /** Absolute path of the config state file (resolved from ctx.baseUrl). */
    statePath() {
      return fileURLToPath(new URL(STATE_FILE, this.ctx.baseUrl))
    }

    profileDir() {
      return dirname(this.statePath())
    }

    /** Read the persisted config (cached after first read). */
    async readConfig() {
      if (this._config !== undefined) return this._config
      let next
      try {
        const parsed = JSON.parse(await readFile(this.statePath(), 'utf8'))
        next = {
          base: typeof parsed.base === 'string' ? parsed.base : '',
          apikey: typeof parsed.apikey === 'string' ? parsed.apikey : '',
          modelname: typeof parsed.modelname === 'string' && parsed.modelname ? parsed.modelname : DEFAULT_MODEL,
        }
      } catch (error) {
        if (error && error.code !== 'ENOENT') throw error
        next = { base: '', apikey: '', modelname: DEFAULT_MODEL }
      }
      this._config = next
      return next
    }

    async getConfig() {
      return { ...(await this.readConfig()) }
    }

    async saveConfig(input) {
      if (!input || typeof input !== 'object') throw new Error('config must be an object')
      const next = {
        base: typeof input.base === 'string' ? input.base.trim() : '',
        apikey: typeof input.apikey === 'string' ? input.apikey.trim() : '',
        modelname: typeof input.modelname === 'string' && input.modelname.trim() ? input.modelname.trim() : DEFAULT_MODEL,
      }
      await writeFile(this.statePath(), JSON.stringify(next, null, 2), 'utf8')
      this._config = next
      return { saved: true, config: { ...next } }
    }

    /**
     * Analyze browser draft images for dsh-w-easy-upload. The main text-only
     * model receives only the returned description, never the base64 payload.
     */
    async analyzeUploads(input) {
      const batch = normalizeUploadBatch(input)
      const text = await callVisionApi(
        await this.readConfig(),
        buildUploadVisionContent(batch),
        { maxTokens: 4000 },
      )
      return { text, count: batch.images.length }
    }

    /** Capture physical virtual-desktop pixels and return PNG data plus geometry. */
    async captureScreen(signal, region) {
      const dir = await mkdtemp(join(tmpdir(), 'dsh-w-vision-'))
      const pngPath = join(dir, 'shot.png')
      const ps1Path = join(dir, 'shot.ps1')
      const isRegion = region
        && Number.isFinite(region.x) && Number.isFinite(region.y)
        && Number.isFinite(region.width) && Number.isFinite(region.height)
        && region.width > 0 && region.height > 0
      if (region && !isRegion) throw new Error('region must contain finite x/y and positive width/height')
      const dpiLines = [
        '$dpiSrc = @"',
        'using System;',
        'using System.Runtime.InteropServices;',
        'public static class VisionDpi {',
        '  [DllImport("user32.dll", SetLastError=true)] private static extern bool SetProcessDpiAwarenessContext(IntPtr value);',
        '  [DllImport("user32.dll", SetLastError=true)] private static extern bool SetProcessDPIAware();',
        '  public static void Enable() {',
        '    try { if (SetProcessDpiAwarenessContext(new IntPtr(-4))) return; } catch (EntryPointNotFoundException) {}',
        '    try { SetProcessDPIAware(); } catch (EntryPointNotFoundException) {}',
        '  }',
        '}',
        '"@',
        'Add-Type -TypeDefinition $dpiSrc | Out-Null',
        '[VisionDpi]::Enable()',
        'Add-Type -AssemblyName System.Windows.Forms,System.Drawing',
        '$virtual = [System.Windows.Forms.SystemInformation]::VirtualScreen',
      ]
      const boundsLines = isRegion
        ? [
            '$capture = New-Object System.Drawing.Rectangle('
              + Math.round(region.x) + ', ' + Math.round(region.y) + ', '
              + Math.round(region.width) + ', ' + Math.round(region.height) + ')',
            'if ($capture.Left -lt $virtual.Left -or $capture.Top -lt $virtual.Top -or $capture.Right -gt $virtual.Right -or $capture.Bottom -gt $virtual.Bottom) {',
            '  throw "capture region [$($capture.X),$($capture.Y) $($capture.Width)x$($capture.Height)] is outside virtual desktop [$($virtual.X),$($virtual.Y) $($virtual.Width)x$($virtual.Height)]"',
            '}',
          ]
        : ['$capture = $virtual']
      const script = [
        "$ErrorActionPreference = 'Stop'",
        ...dpiLines,
        ...boundsLines,
        'if ([long]$capture.Width * [long]$capture.Height -gt 100000000) { throw "capture exceeds 100 million pixels" }',
        '$bitmap = New-Object System.Drawing.Bitmap $capture.Width, $capture.Height',
        '$graphics = [System.Drawing.Graphics]::FromImage($bitmap)',
        '$graphics.CopyFromScreen($capture.Location, [System.Drawing.Point]::Empty, $capture.Size)',
        '$bitmap.Save(' + JSON.stringify(pngPath) + ', [System.Drawing.Imaging.ImageFormat]::Png)',
        '$graphics.Dispose()',
        '$bitmap.Dispose()',
        '[ordered]@{x=[int]$capture.X;y=[int]$capture.Y;width=[int]$capture.Width;height=[int]$capture.Height;coordinateSpace="physical-virtual-desktop"} | ConvertTo-Json -Compress',
      ].join('\n')
      await writeFile(ps1Path, script, 'utf8')
      try {
        const stdout = await runCommand('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', ps1Path], { signal })
        const outputLine = stdout.trim().split(/\r?\n/).at(-1)
        const geometry = JSON.parse(outputLine)
        const bytes = await readFile(pngPath)
        return { ...geometry, base64: bytes.toString('base64') }
      } finally {
        await rm(dir, { recursive: true, force: true })
      }
    }
  }
})()

/** Call the relay vision endpoint and return the model's text answer. */
async function describeImage(config, capture, question, signal) {
  const parts = [
    FIXED_PROMPT,
    'SCREENSHOT GEOMETRY: the image is exactly ' + capture.width + 'x' + capture.height
      + ' pixels. Image pixel (0,0) maps to physical desktop pixel (' + capture.x + ',' + capture.y
      + '). Convert every image box to absolute desktop coordinates by adding (' + capture.x + ',' + capture.y
      + ') to both corners. Valid desktop X is ' + capture.x + '..' + (capture.x + capture.width - 1)
      + '; valid desktop Y is ' + capture.y + '..' + (capture.y + capture.height - 1) + '.',
  ]
  if (question) {
    parts.push('Additional focus from the requesting agent: ' + String(question))
  }
  const prompt = parts.join('\n\n')
  return callVisionApi(config, [
    { type: 'text', text: prompt },
    { type: 'image_url', image_url: { url: 'data:image/png;base64,' + capture.base64, detail: 'high' } },
  ], { signal, maxTokens: 3000 })
}

export { VisionService, VisionService as default }
