/**
 * dsh-w-teacher-help-me - Host advisory model and configuration Remote.
 */

import { Remote, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
import { defineTool } from '@deepseek-ai/dsh-tools'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import {
  DEFAULT_MODEL,
  buildContext,
  buildTeacherRequest,
  callTeacherApi,
  normalizeConsultInput,
  writeJsonAtomic,
} from './teacher-core.js'

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

const STATE_FILE = '.dsh-w-teacher-help-me.json'
const MAX_CONFIG_FIELD_CHARS = 4096

function configString(value, name, allowEmpty = true) {
  if (value === undefined || value === null) return ''
  if (typeof value !== 'string') throw new Error(`${name} must be a string`)
  const text = value.trim()
  if (!allowEmpty && text.length === 0) throw new Error(`${name} must not be empty`)
  if (text.length > MAX_CONFIG_FIELD_CHARS) throw new Error(`${name} is too long`)
  return text
}

let TeacherHelpService = (() => {
  let _classSuper = TypertRemoteService
  let _instanceExtraInitializers = []
  let _getConfig_decorators
  let _saveConfig_decorators
  return class TeacherHelpService extends _classSuper {
    static {
      const _metadata = typeof Symbol === 'function' && Symbol.metadata
        ? Object.create(_classSuper[Symbol.metadata] ?? null)
        : void 0
      _getConfig_decorators = [Remote('getConfig')]
      __esDecorate(this, null, _getConfig_decorators, {
        kind: 'method', name: 'getConfig', static: false, private: false,
        access: { has: obj => 'getConfig' in obj, get: obj => obj.getConfig },
        metadata: _metadata,
      }, null, _instanceExtraInitializers)
      _saveConfig_decorators = [Remote('saveConfig')]
      __esDecorate(this, null, _saveConfig_decorators, {
        kind: 'method', name: 'saveConfig', static: false, private: false,
        access: { has: obj => 'saveConfig' in obj, get: obj => obj.saveConfig },
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
      super(ctx, 'teacherHelp')
      __runInitializers(this, _instanceExtraInitializers)
      this._config = undefined
      const self = this
      this.ctx.tools.register(defineTool({
        name: 'teacher_help_me',
        description: 'Ask the configured gpt-5.6-sol teacher for a second opinion when repeated attempts are not resolving the current task. It receives the model-visible session context and may independently list, search, and read files in the current task workspace with bounded read-only tools. It diagnoses and recommends a recovery plan, but does not modify files or complete the task. Use focused context by default.',
        parameters: {
          problem: {
            type: 'string',
            required: true,
            description: 'A precise statement of the current blocker, observed symptoms, and desired outcome.',
          },
          attempts: {
            type: 'string',
            description: 'Optional concise list of approaches already tried and why they failed.',
          },
          contextMode: {
            type: 'string',
            enum: ['focused', 'full'],
            description: 'focused keeps initial goals plus recent work within a budget; full renders all visible messages before applying the hard budget. Defaults to focused.',
          },
          contextBudget: {
            type: 'integer',
            description: 'Optional character budget for rendered context, clamped to 8,000-600,000. Defaults to 120,000.',
          },
        },
        output: {
          schema: {
            type: 'object',
            additionalProperties: false,
            properties: {
              advice: { type: 'string', required: true },
              model: { type: 'string', required: true },
              contextMode: { type: 'string', enum: ['focused', 'full'], required: true },
              contextMessages: { type: 'integer', required: true },
              contextChars: { type: 'integer', required: true },
            },
          },
          render: (_args, value) => [{ type: 'text', text: value.advice }],
        },
        async execute(args, exec) {
          if (exec.agent === undefined) throw new Error('teacher_help_me requires an Agent-backed tool call')
          const input = normalizeConsultInput(args)
          const context = buildContext(exec.agent.session.deriveMessages(), input.contextMode, input.contextBudget)
          const config = await self.readConfig()
          const advice = await callTeacherApi(config, buildTeacherRequest(input, context), {
            signal: exec.signal,
            workspaceRoot: exec.agent.session.header.cwd,
          })
          return {
            advice,
            model: config.modelname,
            contextMode: context.mode,
            contextMessages: context.originalMessages,
            contextChars: context.chars,
          }
        },
      }))
    }

    statePath() {
      return fileURLToPath(new URL(STATE_FILE, this.ctx.baseUrl))
    }

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
      this._config = Object.freeze(next)
      return this._config
    }

    async getConfig() {
      const config = await this.readConfig()
      return {
        base: config.base,
        apikey: '',
        apiKeyConfigured: config.apikey.length > 0,
        modelname: config.modelname,
      }
    }

    async saveConfig(input) {
      if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('config must be an object')
      const current = await this.readConfig()
      const submittedKey = configString(input.apikey, 'apikey')
      const next = {
        base: configString(input.base, 'base'),
        apikey: submittedKey || current.apikey,
        modelname: configString(input.modelname, 'modelname') || DEFAULT_MODEL,
      }
      await writeJsonAtomic(this.statePath(), next)
      this._config = Object.freeze(next)
      return {
        saved: true,
        config: {
          base: next.base,
          apikey: '',
          apiKeyConfigured: next.apikey.length > 0,
          modelname: next.modelname,
        },
      }
    }
  }
})()

export { TeacherHelpService, TeacherHelpService as default }
