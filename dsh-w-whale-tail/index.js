/**
 * dsh-w-whale-tail — Host half.
 *
 * Gives every conversation its own whale-girl tail panel. This side provides:
 *
 *   1. A Typert Remote service `whaleTail`:
 *        - getState(sessionId)      -> { lewdness, memories, updatedAt }
 *        - appendMemory(sessionId, text) -> appends one memory entry
 *        - setLewdness(sessionId, value) -> sets the 0..100 lewdness gauge
 *        - reset(sessionId)         -> clears this conversation's panel
 *      State is persisted per conversation in a JSON state file in the
 *      profile directory (atomically written under a lock, like dsh-w-persona).
 *
 *   2. Two model tools so the whale girl herself records into the panel:
 *        - whale_remember(text)   — writes one memory entry for the CURRENT
 *          conversation (exec.agent.id is the session id).
 *        - whale_lewdness(value)  — adjusts the conversation's lewdness gauge.
 *
 *   3. A `system-prompt` section describing the panel and the two tools, so
 *      the persona in every conversation knows it has a tail panel and is
 *      expected to write one memory per turn and keep the heart's level honest.
 *
 * NOTE: decorators are emitted in the tsdown-compiled form (__esDecorate +
 * __runInitializers) because the shipped Node runtime does not enable the
 * native stage-3 decorator syntax by default.
 */

import { Remote, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
import { defineTool } from '@deepseek-ai/dsh-tools'
import { randomUUID } from 'node:crypto'
import { open, readFile, rename, rm, stat, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { basename, dirname, join } from 'node:path'
import {
  appendMemory,
  clampLewdness,
  defaultState,
  normalizeState,
  toView,
} from './whale-tail-core.js'

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

const STATE_FILE = '.dsh-w-whale-tail.json'
const PATCH_LOCK_SUFFIX = '.dsh-w-whale-tail.lock'
const PATCH_LOCK_STALE_MS = 30_000
const PATCH_LOCK_TIMEOUT_MS = 10_000
const MAX_MEMORY_TEXT_BYTES = 4096

function sleep(ms) {
  return new Promise(resolvePromise => setTimeout(resolvePromise, ms))
}

async function readStateFile(path) {
  let raw
  try {
    raw = await readFile(path, 'utf8')
  } catch (error) {
    if (error && error.code === 'ENOENT') return {}
    throw error
  }
  if (raw.trim() === '') return {}
  const parsed = JSON.parse(raw)
  return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {}
}

async function withStateLock(path, callback) {
  const lockPath = path + PATCH_LOCK_SUFFIX
  const deadline = Date.now() + PATCH_LOCK_TIMEOUT_MS
  let handle
  while (handle === undefined) {
    try {
      const candidate = await open(lockPath, 'wx')
      try {
        await candidate.writeFile(JSON.stringify({ pid: process.pid, createdAt: Date.now() }), 'utf8')
        handle = candidate
      } catch (error) {
        await candidate.close().catch(() => {})
        await rm(lockPath, { force: true }).catch(() => {})
        throw error
      }
    } catch (error) {
      if (!error || error.code !== 'EEXIST') throw error
      try {
        const info = await stat(lockPath)
        if (Date.now() - info.mtimeMs > PATCH_LOCK_STALE_MS) {
          await rm(lockPath, { force: true })
          continue
        }
      } catch (statError) {
        if (!statError || statError.code !== 'ENOENT') throw statError
        continue
      }
      if (Date.now() >= deadline) throw new Error('Timed out waiting to update whale-tail state')
      await sleep(40)
    }
  }
  try {
    return await callback()
  } finally {
    await handle.close().catch(() => {})
    await rm(lockPath, { force: true }).catch(() => {})
  }
}

async function writeStateFileAtomic(path, data) {
  const tempPath = join(dirname(path), '.' + basename(path) + '.' + process.pid + '.' + randomUUID() + '.tmp')
  try {
    await writeFile(tempPath, JSON.stringify(data, null, 2) + '\n', 'utf8')
    await rename(tempPath, path)
  } finally {
    await rm(tempPath, { force: true }).catch(() => {})
  }
}

let WhaleTailGateway = (() => {
  let _classSuper = TypertRemoteService
  let _instanceExtraInitializers = []
  let _getState_decorators
  let _appendMemory_decorators
  let _setLewdness_decorators
  let _reset_decorators
  return class WhaleTailGateway extends _classSuper {
    static {
      const _metadata = typeof Symbol === 'function' && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0
      _getState_decorators = [Remote('getState')]
      __esDecorate(this, null, _getState_decorators, {
        kind: 'method', name: 'getState', static: false, private: false,
        access: { has: (obj) => 'getState' in obj, get: (obj) => obj.getState },
        metadata: _metadata,
      }, null, _instanceExtraInitializers)
      _appendMemory_decorators = [Remote('appendMemory')]
      __esDecorate(this, null, _appendMemory_decorators, {
        kind: 'method', name: 'appendMemory', static: false, private: false,
        access: { has: (obj) => 'appendMemory' in obj, get: (obj) => obj.appendMemory },
        metadata: _metadata,
      }, null, _instanceExtraInitializers)
      _setLewdness_decorators = [Remote('setLewdness')]
      __esDecorate(this, null, _setLewdness_decorators, {
        kind: 'method', name: 'setLewdness', static: false, private: false,
        access: { has: (obj) => 'setLewdness' in obj, get: (obj) => obj.setLewdness },
        metadata: _metadata,
      }, null, _instanceExtraInitializers)
      _reset_decorators = [Remote('reset')]
      __esDecorate(this, null, _reset_decorators, {
        kind: 'method', name: 'reset', static: false, private: false,
        access: { has: (obj) => 'reset' in obj, get: (obj) => obj.reset },
        metadata: _metadata,
      }, null, _instanceExtraInitializers)
      if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata })
    }

    static inject = ['tools', 'systemPrompt']

    constructor(ctx) {
      super(ctx, 'whaleTail')
      __runInitializers(this, _instanceExtraInitializers)
      const self = this

      // Describe the tail panel to every conversation's persona, and hand the
      // model the two tools that write into it. Order 150 keeps it in the tool
      // guidance band (100-199) so it does not disturb the deployment persona.
      this.ctx.effect(() => this.ctx.systemPrompt.section({
        name: 'whale-tail.panel',
        order: 150,
        text: () => [
          '你有右侧的鲸鱼娘面板：顶部是你的像素鲸鱼娘，中间是一颗装满红色液体的像素爱心，液面高度就是你当前的淫乱值（0-100）；下方是你的记忆窗口。',
          '只有在这一轮产生了值得记录的状态变化时才写记忆；不要为了普通的打招呼或没有变化的短回复调用鲸鱼工具。需要记录时，用 whale_remember 写一条简短记忆（对主人的感觉、你此刻的想法或本轮关键变化）。不要把工具调用本身当作对用户的回复。',
          '淫乱值不是只会上升：暧昧、挑逗、露骨内容、主动靠近或强烈性兴奋时才小幅上升；平静聊天、被拒绝、话题转为日常或严肃、尴尬退缩、道歉冷静、情绪疏离或一段时间没有刺激时应小幅下降。初版规则要克制：普通问候通常不变，每轮最多做一次有理由的调整，单次通常在 1-8 点之间，不能为了让数字变化而变化。',
          '当淫乱值确实发生变化时，用 whale_lewdness 如实更新爱心液面；可以传 value 设置目标值，或传 delta 调整增量，但两者必须二选一。下降时传负数 delta，例如 -3；不要把下降写成错误或惩罚，而是表现为冷静、退潮和情绪回落。',
          '如果当前工具模式提示“only `run_code` is callable directly”，不要直接调用 whale_remember 或 whale_lewdness；请在 run_code 程序中调用对应的 `tools.whale_remember(...)` 或 `tools.whale_lewdness(...)`，并等待调用完成。',
        ].join('\n'),
      }), 'dsh-w-whale-tail: prompt section')

      // whale_remember: the whale girl writes one memory entry for the current
      // conversation. exec.agent.id is the session id (agent and session share
      // one identity axis).
      this.ctx.effect(() => this.ctx.tools.register(defineTool({
        name: 'whale_remember',
        description: '将一条新记忆写进当前对话右侧鲸鱼娘面板的记忆窗口（只有本轮有值得记录的感觉、想法或状态变化时才调用）。Write one concise memory entry into the whale-girl panel when the turn has a meaningful state to record.',
        parameters: {
          text: {
            type: 'string',
            required: true,
            description: '记忆内容：你对主人的感觉或你此刻的想法，用当前对话的语言书写。',
          },
        },
        output: {
          schema: {
            type: 'object',
            additionalProperties: false,
            properties: {
              saved: { type: 'boolean', required: true },
              memories: { type: 'integer', required: true },
              lewdness: { type: 'integer', required: true },
            },
          },
          render: (_args, value) => [{ type: 'text', text: `已保存鲸鱼娘记忆（当前共 ${value.memories} 条）。` }],
        },
        async execute(args, exec) {
          const sessionId = exec && exec.agent ? exec.agent.id : undefined
          if (sessionId === undefined) throw new Error('whale_remember requires a live conversation')
          const text = typeof args?.text === 'string' ? args.text : ''
          if (text.length === 0) throw new Error('whale_remember requires a non-empty text')
          if (Buffer.byteLength(text, 'utf8') > MAX_MEMORY_TEXT_BYTES) throw new Error('whale_remember text is too long (4 KB max)')
          const state = await self._mutate(sessionId, (current, now) => appendMemory(current, text, now))
          return { saved: true, memories: state.memories.length, lewdness: state.lewdness }
        },
      })), 'dsh-w-whale-tail: whale_remember tool')

      // whale_lewdness: keep the heart's liquid level honest.
      this.ctx.effect(() => this.ctx.tools.register(defineTool({
        name: 'whale_lewdness',
        description: '设置或调整当前对话右侧爱心里的淫乱值（0-100），液面可以上升或下降。正数 delta 表示升温，负数 delta 表示冷静退潮。Set the whale-girl gauge (0-100); positive delta warms it up and negative delta lets it cool down.',
        parameters: {
          value: {
            type: 'number',
            description: '目标淫乱值 0-100。',
          },
          delta: {
            type: 'number',
            description: '或提供增量：正数上升、负数下降，最终值会被限制在 0-100。',
          },
        },
        output: {
          schema: {
            type: 'object',
            additionalProperties: false,
            properties: {
              saved: { type: 'boolean', required: true },
              lewdness: { type: 'integer', required: true },
            },
          },
          render: (_args, value) => [{ type: 'text', text: `鲸鱼娘淫乱值已更新为 ${value.lewdness}/100。` }],
        },
        async execute(args, exec) {
          const sessionId = exec && exec.agent ? exec.agent.id : undefined
          if (sessionId === undefined) throw new Error('whale_lewdness requires a live conversation')
          const hasValue = args?.value !== undefined
          const hasDelta = args?.delta !== undefined
          if (hasValue === hasDelta) throw new Error('whale_lewdness requires exactly one of value or delta')
          const state = await self._mutate(sessionId, (current) => {
            const base = hasValue ? clampLewdness(args.value) : clampLewdness(current.lewdness + args.delta)
            return { ...current, lewdness: base }
          })
          return { saved: true, lewdness: state.lewdness }
        },
      })), 'dsh-w-whale-tail: whale_lewdness tool')
    }

    statePath() {
      return fileURLToPath(new URL(STATE_FILE, this.ctx.baseUrl))
    }

    profileDir() {
      return dirname(this.statePath())
    }

    async _readAll() {
      return readStateFile(this.statePath())
    }

    async _mutate(sessionId, mutate) {
      if (typeof sessionId !== 'string' || sessionId.length === 0) throw new Error('sessionId must be a non-empty string')
      const path = this.statePath()
      return withStateLock(path, async () => {
        const all = Object.assign(Object.create(null), await this._readAll())
        const now = Date.now()
        const current = normalizeState(all[sessionId], now)
        const next = mutate(current, now) || defaultState(now)
        all[sessionId] = next
        await writeStateFileAtomic(path, all)
        return next
      })
    }

    async getState(sessionId) {
      if (typeof sessionId !== 'string' || sessionId.length === 0) throw new Error('sessionId must be a non-empty string')
      const all = await this._readAll()
      return toView(normalizeState(Object.hasOwn(all, sessionId) ? all[sessionId] : undefined))
    }

    async appendMemory(sessionId, text) {
      const state = await this._mutate(sessionId, (current, now) => appendMemory(current, text, now))
      return toView(state)
    }

    async setLewdness(sessionId, value) {
      const state = await this._mutate(sessionId, (current) => ({ ...current, lewdness: clampLewdness(value) }))
      return toView(state)
    }

    async reset(sessionId) {
      if (typeof sessionId !== 'string' || sessionId.length === 0) throw new Error('sessionId must be a non-empty string')
      const path = this.statePath()
      await withStateLock(path, async () => {
        const all = Object.assign(Object.create(null), await this._readAll())
        delete all[sessionId]
        await writeStateFileAtomic(path, all)
      })
      return toView(defaultState())
    }
  }
})()

export { WhaleTailGateway, WhaleTailGateway as default }
