/**
 * dsh-w-deslop — Host half of the "去 AI 味" companion to dsh-w-noval-write.
 *
 * Everything here is gated on the novel plugin: the rules section, the
 * deslop_scan tool and /deslop act only in a conversation that dsh-w-noval-write
 * has linked with /write and bound to a novel. Without the `novalWriter`
 * service (plugin missing or disabled) the section never registers, the
 * command never registers, and the tool refuses.
 *
 * Settings live in a profile-local state file, never in cordis.patch.yml:
 * rewriting that file hot-reloads the tree and disposes live sessions.
 */

import { readFileSync } from 'node:fs'
import { readFile, rename, rm, stat, writeFile } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import { basename, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createUserMessage } from '@deepseek-ai/dsh-llm'
import { defineTool } from '@deepseek-ai/dsh-tools'
import { Remote, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
import {
  LIMITS,
  buildRevisePrompt,
  buildRulesPrompt,
  normalizeChapterFilename,
  normalizeConfig,
  parseDeslopCommand,
  renderScanReport,
  scanText,
} from './deslop-core.js'

var __runInitializers = function (thisArg, initializers, value) {
  var useValue = arguments.length > 2
  for (var i = 0; i < initializers.length; i++) {
    value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg)
  }
  return useValue ? value : void 0
}

var __esDecorate = function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) {
    if (f !== void 0 && typeof f !== 'function') throw new TypeError('Function expected')
    return f
  }
  var kind = contextIn.kind
  var key = kind === 'getter' ? 'get' : kind === 'setter' ? 'set' : 'value'
  var target = !descriptorIn && ctor ? contextIn.static ? ctor : ctor.prototype : null
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
    var result = decorators[i](kind === 'accessor' ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context)
    if (kind === 'accessor') {
      if (result === void 0) continue
      if (result === null || typeof result !== 'object') throw new TypeError('Object expected')
      if (_ = accept(result.get)) descriptor.get = _
      if (_ = accept(result.set)) descriptor.set = _
      if (_ = accept(result.init)) initializers.unshift(_)
    } else if (_ = accept(result)) {
      if (kind === 'field') initializers.unshift(_)
      else descriptor[key] = _
    }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor)
  done = true
}

const STATE_FILE = '.dsh-w-deslop.json'
const MAX_CHAPTER_BYTES = 2 * 1024 * 1024

async function writeJsonAtomic(path, value) {
  const tempPath = join(dirname(path), '.' + basename(path) + '.' + process.pid + '.' + randomUUID() + '.tmp')
  try {
    await writeFile(tempPath, JSON.stringify(value, null, 2) + '\n', 'utf8')
    await rename(tempPath, path)
  } finally {
    await rm(tempPath, { force: true }).catch(() => {})
  }
}

function inactiveError(code, message) {
  const error = new Error(`${code}: ${message}`)
  error.code = code
  return error
}

let DeslopService = (() => {
  let _classSuper = TypertRemoteService
  let _instanceExtraInitializers = []
  let _getState_decorators
  let _saveConfig_decorators
  let _previewScan_decorators
  return class DeslopService extends _classSuper {
    static {
      const _metadata = typeof Symbol === 'function' && Symbol.metadata
        ? Object.create(_classSuper[Symbol.metadata] ?? null)
        : void 0
      _getState_decorators = [Remote('getState')]
      __esDecorate(this, null, _getState_decorators, {
        kind: 'method', name: 'getState', static: false, private: false,
        access: { has: obj => 'getState' in obj, get: obj => obj.getState },
        metadata: _metadata,
      }, null, _instanceExtraInitializers)
      _saveConfig_decorators = [Remote('saveConfig')]
      __esDecorate(this, null, _saveConfig_decorators, {
        kind: 'method', name: 'saveConfig', static: false, private: false,
        access: { has: obj => 'saveConfig' in obj, get: obj => obj.saveConfig },
        metadata: _metadata,
      }, null, _instanceExtraInitializers)
      _previewScan_decorators = [Remote('previewScan')]
      __esDecorate(this, null, _previewScan_decorators, {
        kind: 'method', name: 'previewScan', static: false, private: false,
        access: { has: obj => 'previewScan' in obj, get: obj => obj.previewScan },
        metadata: _metadata,
      }, null, _instanceExtraInitializers)
      if (_metadata) {
        Object.defineProperty(this, Symbol.metadata, {
          enumerable: true,
          configurable: true,
          writable: true,
          value: _metadata,
        })
      }
    }

    static inject = ['tools']

    constructor(ctx) {
      super(ctx, 'deslopWriter')
      __runInitializers(this, _instanceExtraInitializers)
      this.config = this.readConfigSync()
      this.promptText = buildRulesPrompt(this.config)
      this.novalWriter = undefined
      this.saveTail = Promise.resolve()
      const self = this

      // Track the novel plugin. It may load after us, be disabled, or be
      // reloaded; every entry point re-checks this reference.
      ctx.inject(['novalWriter'], (scope) => {
        // Capture the instance: by cleanup time scope.novalWriter is already gone.
        const writer = scope.novalWriter
        this.novalWriter = writer
        scope.effect(() => () => {
          if (this.novalWriter === writer) this.novalWriter = undefined
        }, 'dsh-w-deslop: release novel writer')
      })

      // Right after the bound-novel section (order 155) of dsh-w-noval-write.
      ctx.inject(['novalWriter', 'systemPrompt'], (scope) => {
        scope.systemPrompt.section({
          name: 'dsh-w-deslop:rules',
          order: 156,
          text: (context) => {
            if (!context.agent || !self.config.enabled) return ''
            return self.boundNovel(scope.novalWriter, context.agent) ? self.promptText : ''
          },
        })
      })

      ctx.inject(['novalWriter', 'commands'], (scope) => {
        scope.commands.register({
          name: 'deslop',
          description: '去 AI 味：扫描并修改当前小说的一章（需要先用 /write 联动小说）',
          input: { hint: '[<章节文件名>|status]' },
          handler: async (invocation) => {
            const { agent } = invocation
            const command = parseDeslopCommand(invocation.rawInput)
            if (!self.config.enabled) return { kind: 'error', text: '去AI味插件已在设置里关闭。到「插件」→ dsh-w-deslop 的齿轮里重新开启。' }
            const novel = self.boundNovel(scope.novalWriter, agent)
            if (!novel) return { kind: 'error', text: '去AI味只在小说写作对话里生效：先在右侧「小说写作」工作台绑定一本书，再用 /write 建立写作任务。' }
            if (command.kind === 'status') return { kind: 'success', text: self.describeStatus(novel) }
            let filename = null
            if (command.filename) {
              try {
                filename = normalizeChapterFilename(command.filename)
              } catch (error) {
                return { kind: 'error', text: `文件名无效：${error.message}\n用法：/deslop [<章节文件名>|status]` }
              }
            }
            agent.followup(createUserMessage({
              content: [{ type: 'text', text: buildRevisePrompt(filename) }],
              source: { kind: 'user' },
            }))
            return { kind: 'success', text: filename ? `已开始对「${filename}」去 AI 味。` : '已开始对最近一章去 AI 味。' }
          },
        })
      })

      this.ctx.tools.register(defineTool({
        name: 'deslop_scan',
        description: '去AI味扫描（仅在 /write 联动小说的对话中可用）：检查小说正文里的 AI 套路句式、套词、解释腔、章尾升华和节奏问题，返回带行号的必改/复核清单。保存章节前传 text；修改已保存的章节时传 filename（小说文件夹里的单个 .md/.txt 文件名）。',
        parameters: {
          text: { type: 'string', description: '要扫描的正文。与 filename 二选一。' },
          filename: { type: 'string', description: '小说文件夹里的章节文件名，例如 第3章_入门.md。与 text 二选一。' },
        },
        output: {
          schema: { type: 'object', additionalProperties: true },
          render: (_args, value) => [{ type: 'text', text: value.report }],
        },
        async execute(args, exec) {
          if (!self.config.enabled) throw inactiveError('DESLOP_DISABLED', 'the deslop plugin is turned off in its settings. Do not retry; continue without scanning.')
          const writer = self.novalWriter
          if (!writer) throw inactiveError('DESLOP_INACTIVE', 'dsh-w-noval-write is not enabled, so deslop is inactive. Do not retry.')
          const novel = self.boundNovel(writer, exec && exec.agent)
          if (!novel) throw inactiveError('DESLOP_INACTIVE', 'this conversation is not a /write novel conversation, so deslop is inactive. Do not retry.')
          const hasText = typeof args?.text === 'string' && args.text.trim() !== ''
          const hasFile = typeof args?.filename === 'string' && args.filename.trim() !== ''
          if (hasText === hasFile) throw new Error('INVALID_DESLOP_ARGUMENTS: pass exactly one of text or filename.')
          let text = args.text
          let source = '传入正文'
          if (hasFile) {
            const filename = normalizeChapterFilename(args.filename)
            text = await self.readChapter(novel, filename)
            source = filename
          }
          const report = scanText(text, self.config)
          return { ok: true, source, ...report, report: renderScanReport(report, source) }
        },
      }))
    }

    statePath() {
      return fileURLToPath(new URL(STATE_FILE, this.ctx.baseUrl))
    }

    readConfigSync() {
      try {
        return normalizeConfig(JSON.parse(readFileSync(this.statePath(), 'utf8')))
      } catch (error) {
        if (error && error.code === 'ENOENT') return normalizeConfig(undefined)
        // A corrupt settings file must not take the tree down; fall back and say so.
        console.warn(`dsh-w-deslop: ignoring unreadable ${STATE_FILE}: ${error && error.message ? error.message : error}`)
        return normalizeConfig(undefined)
      }
    }

    /** The novel bound to a /write conversation, or null when deslop is inactive there. */
    boundNovel(writer, agent) {
      if (!writer || !agent || !agent.session) return null
      try {
        if (!writer.linkForAgent(agent)) return null
        return writer.novelForAgentSync(agent) || null
      } catch {
        return null
      }
    }

    async readChapter(novel, filename) {
      const path = join(novel.path, filename)
      let info
      try {
        info = await stat(path)
      } catch (error) {
        if (error && error.code === 'ENOENT') throw new Error(`CHAPTER_NOT_FOUND: 「${filename}」 is not in the novel folder ${novel.folder}/. Use novel_outline_read to find the linked file name.`)
        throw error
      }
      if (!info.isFile()) throw new Error(`「${filename}」 is not a file`)
      if (info.size > MAX_CHAPTER_BYTES) throw new Error(`「${filename}」 is larger than 2 MB; scan one chapter at a time`)
      const text = await readFile(path, 'utf8')
      if (text.length > LIMITS.scanChars) throw new Error(`「${filename}」 has more than ${LIMITS.scanChars} characters; scan one chapter at a time`)
      return text
    }

    describeStatus(novel) {
      const config = this.config
      return [
        '去AI味：已生效',
        `小说：${novel.title || novel.folder}（${novel.folder}/）`,
        `模式：${config.strict ? '严格（禁破折号和省略号）' : '标准'}；保存前自查：${config.autoCheck ? '开' : '关'}`,
        `自定义禁用词 ${config.extraBanned.length} 个，白名单 ${config.whitelist.length} 个`,
        '',
        '命令：/deslop 修改最近一章，/deslop <文件名> 修改指定章节',
      ].join('\n')
    }

    async getState() {
      return {
        config: this.config,
        novelPluginAvailable: this.novalWriter !== undefined,
        promptPreview: this.promptText,
      }
    }

    async saveConfig(input) {
      const operation = this.saveTail.then(async () => {
        const next = normalizeConfig(input)
        await writeJsonAtomic(this.statePath(), next)
        this.config = next
        this.promptText = buildRulesPrompt(next)
        return { saved: true, ...(await this.getState()) }
      })
      this.saveTail = operation.then(() => {}, () => {})
      return operation
    }

    async previewScan(text) {
      return scanText(typeof text === 'string' ? text : '', this.config)
    }
  }
})()

export { DeslopService, DeslopService as default }
