/**
 * dsh-w-noval-write — workspace-scoped novel canon for DeepSeek Harness.
 *
 * The requested package id intentionally keeps the `noval` spelling. Every
 * registered Harness Workspace owns one shared project. `/write` links only
 * the receiving conversation to that project; the project itself has no mode
 * switch and remains available to the sidebar and model tools at all times.
 */

import { randomUUID } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { mkdir, rename, rm, writeFile } from 'node:fs/promises'
import { basename, dirname, join, resolve } from 'node:path'
import Schema from '@deepseek-ai/schemastery'
import { createUserMessage } from '@deepseek-ai/dsh-llm'
import { defineTool } from '@deepseek-ai/dsh-tools'
import { Remote, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
import { dshHomePath, expandHomePath } from '@deepseek-ai/dsh-home-paths'
import {
  advanceProject,
  assertProjectShape,
  chapterPatchToolSchema,
  characterPatchToolSchema,
  defaultProject,
  defaultState,
  mergeProject,
  novelToolContract,
  normalizeProject,
  normalizeState,
  normalizeWriteLink,
  normalizeWriteLinkStore,
  patchCharacterById,
  patchRelationshipById,
  parseWriteCommand,
  projectToolSchema,
  projectPrompt,
  relationshipPatchToolSchema,
  removeChapter,
  reorderChapter,
  projectExportDocument,
  projectFromImportDocument,
  scenePatchToolSchema,
  updateWriteLinkStore,
  upsertChapter,
  upsertVolume,
  volumePatchToolSchema,
  writeLinkForSession,
} from './noval-write-core.js'
import { NovelMutationRoundGuard } from './noval-mutation-guard.js'
import { saveWorkspaceManuscript } from './noval-file-core.js'

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

export const Config = Schema.object({
  root: Schema.string().default(''),
  promptMaxChars: Schema.number().default(12000),
})

function resolveRoot(configured) {
  const requested = typeof configured === 'string' ? configured.trim() : ''
  return requested === '' ? dshHomePath('noval-write') : resolve(expandHomePath(requested))
}

function readStateSync(path) {
  try {
    return normalizeState(JSON.parse(readFileSync(path, 'utf8')))
  } catch (error) {
    if (error && error.code === 'ENOENT') return defaultState()
    throw error
  }
}

function readWriteLinkStoreSync(path) {
  try {
    return normalizeWriteLinkStore(JSON.parse(readFileSync(path, 'utf8')))
  } catch (error) {
    if (error && error.code === 'ENOENT') return normalizeWriteLinkStore(null)
    throw error
  }
}

async function writeAtomic(path, state) {
  await mkdir(dirname(path), { recursive: true })
  const temp = join(dirname(path), `.${basename(path)}.${process.pid}.${randomUUID()}.tmp`)
  try {
    await writeFile(temp, JSON.stringify(state, null, 2) + '\n', 'utf8')
    await rename(temp, path)
  } finally {
    await rm(temp, { force: true }).catch(() => {})
  }
}

function toolOutput(label, { includeValue = false } = {}) {
  return {
    schema: { type: 'object', additionalProperties: true },
    render: (_args, value) => [{
      type: 'text',
      text: includeValue
        ? JSON.stringify(value, null, 2)
        : value && value.changed === false
          ? `${label}: ok: true; changed: false; stop: true; revision ${value.revision}. ${value.reason ? `Reason: ${value.reason} ` : 'No data changed. '}Do not retry or call another novel mutation; answer the user.`
          : `${label}: ok: ${value && value.ok === true ? 'true' : 'unknown'}; changed: ${value && value.changed === true ? 'true' : 'unknown'}; revision ${value && value.revision !== undefined ? value.revision : 'read'}`,
    }],
  }
}

function assertExpectedRevision(value) {
  if (Number.isSafeInteger(value) && value >= 0) return value
  const error = new TypeError([
    'INVALID_NOVEL_ARGUMENTS: no data was written.',
    '- expected_revision must be the integer returned by the latest novel_read call.',
    '- Call novel_read, rebuild the arguments, and retry once.',
  ].join('\n'))
  error.code = 'INVALID_NOVEL_ARGUMENTS'
  error.retryable = true
  throw error
}

function mutationFailureContent(field) {
  return (_exec, result) => {
    if (!result || result.isError !== true) return undefined
    const message = result.error && typeof result.error.message === 'string'
      ? result.error.message
      : 'The mutation arguments or revision were rejected.'
    return [{
      type: 'text',
      text: JSON.stringify({
        ok: false,
        retryable: true,
        code: result.error && typeof result.error.code === 'string' ? result.error.code : 'NOVEL_MUTATION_FAILED',
        message,
        rejectedField: field,
        noDataWritten: true,
        recovery: [
          'Call novel_read again to refresh the project and revision.',
          'Use the contract below to rebuild direct JSON-object arguments; never stringify them or nest an outer argument wrapper.',
          'Retry the failed mutation once and only report success after ok: true with a newer revision.',
        ],
        contract: novelToolContract(),
      }, null, 2),
    }]
  }
}

function manuscriptFailureContent(_exec, result) {
  if (!result || result.isError !== true) return undefined
  const message = result.error && typeof result.error.message === 'string'
    ? result.error.message
    : 'The manuscript file was not written.'
  return [{
    type: 'text',
    text: JSON.stringify({
      ok: false,
      verified: false,
      noFileWritten: true,
      code: result.error && typeof result.error.code === 'string' ? result.error.code : 'NOVEL_FILE_WRITE_FAILED',
      message,
      instruction: 'Do not claim that a file was created. Correct the filename/content or inspect the existing file, then retry once.',
    }, null, 2),
  }]
}

function concludeStoppedMutation(result, exec) {
  if (result && result.stop === true && exec && typeof exec.concludeTurn === 'function') exec.concludeTurn()
  return result
}

const WRITE_USAGE = '用法：/write [<写作任务>|edit <写作任务>|clear]'
const DEFAULT_WRITE_OBJECTIVE = '在当前工作区持续创作小说，并同步维护角色、世界观、情节和连续性。'

let NovalWriterService = (() => {
  let _classSuper = TypertRemoteService
  let _instanceExtraInitializers = []
  let _getState_decorators
  let _saveProject_decorators
  let _exportProject_decorators
  let _importProject_decorators
  let _resetProject_decorators
  let _getLink_decorators
  let _editLink_decorators
  let _clearLink_decorators
  return class NovalWriterService extends _classSuper {
    static {
      const _metadata = typeof Symbol === 'function' && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0
      _getState_decorators = [Remote('getState')]
      __esDecorate(this, null, _getState_decorators, {
        kind: 'method', name: 'getState', static: false, private: false,
        access: { has: obj => 'getState' in obj, get: obj => obj.getState }, metadata: _metadata,
      }, null, _instanceExtraInitializers)
      _saveProject_decorators = [Remote('saveProject')]
      __esDecorate(this, null, _saveProject_decorators, {
        kind: 'method', name: 'saveProject', static: false, private: false,
        access: { has: obj => 'saveProject' in obj, get: obj => obj.saveProject }, metadata: _metadata,
      }, null, _instanceExtraInitializers)
      _exportProject_decorators = [Remote('exportProject')]
      __esDecorate(this, null, _exportProject_decorators, {
        kind: 'method', name: 'exportProject', static: false, private: false,
        access: { has: obj => 'exportProject' in obj, get: obj => obj.exportProject }, metadata: _metadata,
      }, null, _instanceExtraInitializers)
      _importProject_decorators = [Remote('importProject')]
      __esDecorate(this, null, _importProject_decorators, {
        kind: 'method', name: 'importProject', static: false, private: false,
        access: { has: obj => 'importProject' in obj, get: obj => obj.importProject }, metadata: _metadata,
      }, null, _instanceExtraInitializers)
      _resetProject_decorators = [Remote('resetProject')]
      __esDecorate(this, null, _resetProject_decorators, {
        kind: 'method', name: 'resetProject', static: false, private: false,
        access: { has: obj => 'resetProject' in obj, get: obj => obj.resetProject }, metadata: _metadata,
      }, null, _instanceExtraInitializers)
      _getLink_decorators = [Remote('getLink')]
      __esDecorate(this, null, _getLink_decorators, {
        kind: 'method', name: 'getLink', static: false, private: false,
        access: { has: obj => 'getLink' in obj, get: obj => obj.getLink }, metadata: _metadata,
      }, null, _instanceExtraInitializers)
      _editLink_decorators = [Remote('editLink')]
      __esDecorate(this, null, _editLink_decorators, {
        kind: 'method', name: 'editLink', static: false, private: false,
        access: { has: obj => 'editLink' in obj, get: obj => obj.editLink }, metadata: _metadata,
      }, null, _instanceExtraInitializers)
      _clearLink_decorators = [Remote('clearLink')]
      __esDecorate(this, null, _clearLink_decorators, {
        kind: 'method', name: 'clearLink', static: false, private: false,
        access: { has: obj => 'clearLink' in obj, get: obj => obj.clearLink }, metadata: _metadata,
      }, null, _instanceExtraInitializers)
      if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata })
    }

    static Config = Config
    static inject = ['tools', 'agents']

    constructor(ctx, config) {
      super(ctx, 'novalWriter')
      __runInitializers(this, _instanceExtraInitializers)
      this.settings = config ?? {}
      this.root = resolveRoot(this.settings.root)
      this.states = new Map()
      this.writeTails = new Map()
      this.writeLinksPath = join(this.root, 'session-links.json')
      this.writeLinks = readWriteLinkStoreSync(this.writeLinksPath)
      this.writeLinkTail = Promise.resolve()
      this.mutationRoundGuard = new NovelMutationRoundGuard()
      this.workspaceRegistry = undefined
      this.knowledgeBase = undefined

      ctx.inject(['workspaceRegistry'], (scope) => {
        this.workspaceRegistry = scope.workspaceRegistry
        scope.effect(() => () => {
          if (this.workspaceRegistry === scope.workspaceRegistry) this.workspaceRegistry = undefined
        }, 'dsh-w-noval-write: release workspace registry')
      })
      ctx.inject(['knowledgeBase'], (scope) => {
        this.knowledgeBase = scope.knowledgeBase
        scope.effect(() => () => {
          if (this.knowledgeBase === scope.knowledgeBase) this.knowledgeBase = undefined
        }, 'dsh-w-noval-write: release knowledge-base integration')
      })
      ctx.inject(['workspaceRegistry', 'systemPrompt'], (scope) => {
        scope.systemPrompt.section({
          name: 'dsh-w-noval-write:workspace',
          order: 155,
          text: (context) => {
            if (!context.agent) return ''
            const link = this.linkForAgent(context.agent)
            if (!link) return ''
            const workspace = this.workspaceForAgentSync(context.agent)
            if (!workspace) return '# Novel writing workspace\n\nThis conversation used /write, but its session is not attached to a registered Workspace.'
            const state = this.stateForWorkspace(workspace.id)
            return [
              '# Linked Harness Workspace',
              '',
              `- Workspace: ${workspace.title}`,
              `- Workspace id: ${workspace.id}`,
              `- Writing objective: ${link.objective}`,
              '- Shared by every conversation attached to this Workspace.',
              '',
              projectPrompt(state.project, this.settings.promptMaxChars),
            ].join('\n')
          },
        })
      })

      ctx.inject(['commands'], (scope) => {
        scope.commands.register({
          name: 'write',
          description: '像 goal 一样建立或查看当前对话的持久小说写作任务',
          input: {
            hint: '[<写作任务>|edit <写作任务>|clear]',
            images: true,
          },
          handler: async (invocation) => {
            const { agent } = invocation
            const command = parseWriteCommand(invocation.rawInput)
            const current = this.linkForAgent(agent)
            if (invocation.attachments.length > 0 && command.kind !== 'create' && command.kind !== 'edit') {
              return { kind: 'error', text: `图片附件只能跟随写作任务：/write <写作任务> 或 /write edit <写作任务>。\n${WRITE_USAGE}` }
            }
            if (command.kind === 'invalid-edit') return { kind: 'error', text: `编辑写作任务需要新内容。\n${WRITE_USAGE}` }
            if (command.kind === 'clear') {
              if (!current) return { kind: 'success', text: '当前对话没有需要清除的小说写作任务。' }
              await this.commitLink(agent.session.id, null, 'clear', current.revision)
              return { kind: 'success', text: '已解除当前对话与小说写作工作区的联动；工作区项目数据没有删除。' }
            }
            if (command.kind === 'show' && current) return this.renderLink('小说写作任务', current)
            const workspace = await this.workspaceForAgent(agent)
            if (!workspace) return { kind: 'error', text: '当前对话不属于已注册的 Harness 工作区，无法连接小说项目。' }
            if (command.kind === 'edit') {
              if (!current) return { kind: 'error', text: `当前对话还没有小说写作任务。先使用 /write <写作任务>。\n${WRITE_USAGE}` }
              const edited = await this.commitLink(agent.session.id, {
                ...current,
                revision: current.revision + 1,
                objective: command.objective,
                workspaceId: String(workspace.id),
                workspaceTitle: workspace.title,
                updatedAt: Date.now(),
              }, 'edit', current.revision)
              this.submitWriteFollowup(invocation, edited.objective)
              return this.renderLink('小说写作任务已更新', edited)
            }
            if (current) return { kind: 'error', text: `当前对话已经有小说写作任务。请直接继续对话，或使用 /write edit <写作任务> 修改、/write clear 清除。` }
            const objective = command.kind === 'create' ? command.objective : DEFAULT_WRITE_OBJECTIVE
            const linked = await this.commitLink(agent.session.id, {
              revision: 1,
              objective,
              workspaceId: String(workspace.id),
              workspaceTitle: workspace.title,
              updatedAt: Date.now(),
            }, 'link')
            const state = this.stateForWorkspace(workspace.id)
            let knowledge = '知识库未挂载。'
            try {
              if (this.knowledgeBase && typeof this.knowledgeBase.setMode === 'function') {
                const result = await this.knowledgeBase.setMode('writing')
                knowledge = result && result.mode === 'writing' ? '知识库已同步到 writing mode。' : '知识库 writing mode 同步结果未知。'
              }
            } catch (error) {
              this.report('knowledge-base mode switch failed', error)
              knowledge = '知识库切换失败，但小说项目仍已连接。'
            }
            if (command.kind === 'create') this.submitWriteFollowup(invocation, linked.objective)
            return this.renderLink(`小说写作任务已创建 · 《${state.project.title || '未命名'}》 · ${knowledge}`, linked)
          },
        })
      })

      this.registerTools()
    }

    report(what, error) {
      const message = error && error.message ? error.message : String(error)
      if (typeof this.ctx.logger === 'function') this.ctx.logger('dsh-w-noval-write').warn(`${what}: ${message}`)
      else console.warn(`dsh-w-noval-write: ${what}: ${message}`)
    }

    linkForAgent(agent) {
      if (!agent || !agent.session) return null
      return writeLinkForSession(this.writeLinks, agent.session.id)
    }

    commitLink(sessionId, nextValue, operation, expectedRevision) {
      const key = String(sessionId)
      const queued = this.writeLinkTail.then(async () => {
        const current = writeLinkForSession(this.writeLinks, key)
        if (operation === 'link' && current) throw new Error('this conversation already has a novel writing task')
        if (operation !== 'link') {
          if (!current) throw new Error('this conversation has no novel writing task')
          if (!Number.isSafeInteger(expectedRevision) || current.revision !== expectedRevision) {
            throw new Error('the novel writing task changed; reload before editing it')
          }
        }
        const link = nextValue === null ? null : normalizeWriteLink(nextValue)
        if (nextValue !== null && !link) throw new Error('invalid novel writing task')
        const nextStore = updateWriteLinkStore(this.writeLinks, key, link)
        await writeAtomic(this.writeLinksPath, nextStore)
        this.writeLinks = nextStore
        return link
      })
      this.writeLinkTail = queued.then(() => {}, () => {})
      return queued
    }

    submitWriteFollowup(invocation, objective) {
      const attachments = Array.isArray(invocation.attachments) ? invocation.attachments : []
      invocation.agent.followup(createUserMessage({
        content: [...attachments, { type: 'text', text: objective }],
        source: { kind: 'user' },
      }))
    }

    renderLink(title, link) {
      return {
        kind: 'success',
        text: [
          title,
          'Status: linked',
          `Workspace: ${link.workspaceTitle || link.workspaceId}`,
          `Objective: ${link.objective}`,
          '',
          'Commands: /write edit <写作任务>, /write clear',
        ].join('\n'),
      }
    }

    registry() {
      return this.workspaceRegistry ?? this.ctx.get('workspaceRegistry')
    }

    workspaceRecord(workspaceId) {
      if (typeof workspaceId !== 'string' || workspaceId.trim() === '') throw new Error('workspaceId must be a non-empty string')
      const registry = this.registry()
      if (!registry) throw new Error('workspace registry is unavailable')
      const workspace = registry.get(workspaceId)
      if (!workspace) throw new Error(`unknown workspace '${workspaceId}'`)
      return workspace
    }

    workspaceForAgentSync(agent) {
      const registry = this.registry()
      if (!registry || !agent || !agent.session) return undefined
      const sessionId = agent.session.id
      const byMembership = registry.list().find(workspace => workspace.sessionIds.includes(sessionId))
      if (byMembership) return byMembership
      const cwd = agent.session.header && agent.session.header.cwd
      return typeof cwd === 'string' ? registry.list().find(workspace => workspace.path === cwd) : undefined
    }

    async workspaceForAgent(agent) {
      const direct = this.workspaceForAgentSync(agent)
      if (direct) return direct
      const registry = this.registry()
      const cwd = agent && agent.session && agent.session.header ? agent.session.header.cwd : undefined
      if (!registry || typeof cwd !== 'string') return undefined
      return registry.resolveByPath(cwd)
    }

    statePath(workspaceId) {
      return join(this.root, 'workspaces', String(workspaceId), 'project.json')
    }

    stateForWorkspace(workspaceId) {
      const key = String(workspaceId)
      const cached = this.states.get(key)
      if (cached) return cached
      let state
      try {
        state = readStateSync(this.statePath(key))
      } catch (error) {
        this.report(`workspace '${key}' state read failed`, error)
        throw new Error(`novel project '${key}' could not be read; the original file was preserved and writes are blocked until it is repaired or explicitly reset`, { cause: error })
      }
      this.states.set(key, state)
      return state
    }

    view(workspace, state) {
      return {
        ...normalizeState(state),
        workspace: { id: String(workspace.id), title: workspace.title, path: workspace.path },
      }
    }

    async mutate(workspaceId, expectedRevision, callback) {
      const workspace = this.workspaceRecord(workspaceId)
      const key = String(workspace.id)
      const priorTail = this.writeTails.get(key) ?? Promise.resolve()
      const operation = priorTail.then(async () => {
        const current = normalizeState(this.stateForWorkspace(key))
        if (Number.isSafeInteger(expectedRevision) && expectedRevision !== current.revision) {
          throw new Error('project changed in another conversation, tab, or model tool; reload before saving')
        }
        const next = normalizeState(callback(current))
        if (JSON.stringify(next.project) === JSON.stringify(current.project)) {
          return { ok: true, changed: false, stop: true, ...this.view(workspace, current) }
        }
        next.revision = current.revision + 1
        next.updatedAt = new Date().toISOString()
        await writeAtomic(this.statePath(key), next)
        this.states.set(key, next)
        return { ok: true, changed: true, ...this.view(workspace, next) }
      })
      this.writeTails.set(key, operation.then(() => {}, () => {}))
      return operation
    }

    async getState(workspaceId) {
      const workspace = this.workspaceRecord(workspaceId)
      return this.view(workspace, this.stateForWorkspace(String(workspace.id)))
    }

    async saveProject(workspaceId, input, expectedRevision) {
      assertProjectShape(input, { partial: false })
      return this.mutate(workspaceId, expectedRevision, current => ({ ...current, project: normalizeProject(input) }))
    }

    async exportProject(workspaceId) {
      const workspace = this.workspaceRecord(workspaceId)
      const state = this.stateForWorkspace(String(workspace.id))
      return projectExportDocument(state, workspace)
    }

    async importProject(workspaceId, input, expectedRevision) {
      const project = projectFromImportDocument(input)
      return this.mutate(workspaceId, expectedRevision, current => ({ ...current, project }))
    }

    async resetProject(workspaceId, expectedRevision) {
      return this.mutate(workspaceId, expectedRevision, current => ({ ...current, project: defaultProject() }))
    }

    async getLink(sessionId) {
      return writeLinkForSession(this.writeLinks, sessionId)
    }

    async editLink(sessionId, objective, expectedRevision) {
      const current = writeLinkForSession(this.writeLinks, sessionId)
      if (!current) throw new Error('this conversation has no novel writing task')
      return this.commitLink(sessionId, {
        ...current,
        revision: current.revision + 1,
        objective,
        updatedAt: Date.now(),
      }, 'edit', expectedRevision)
    }

    async clearLink(sessionId, expectedRevision) {
      await this.commitLink(sessionId, null, 'clear', expectedRevision)
      return { cleared: true }
    }

    async modelState(exec) {
      const workspace = await this.workspaceForAgent(exec && exec.agent)
      if (!workspace) throw new Error('novel tools require a conversation attached to a registered Harness Workspace')
      return { workspace, state: this.stateForWorkspace(String(workspace.id)) }
    }

    registerTools() {
      const self = this
      this.ctx.tools.register(defineTool({
        name: 'novel_schema',
        description: '读取 dsh-w-noval-write 的权威项目结构和纠错重试协议。任何 novel 工具因参数结构失败时，必须调用本工具，按返回结构重建参数并重试一次。',
        parameters: {},
        output: toolOutput('小说结构已读取', { includeValue: true }),
        async execute(_args, exec) {
          const { workspace, state } = await self.modelState(exec)
          return {
            workspace: { id: String(workspace.id), title: workspace.title },
            revision: state.revision,
            contract: novelToolContract(),
          }
        },
      }))

      this.ctx.tools.register(defineTool({
        name: 'novel_read',
        description: '读取当前 Harness 工作区共享的小说项目设定，同时返回权威结构和重试协议。任何写入前必须先读取 revision；不要猜测项目结构。',
        parameters: {
          section: { type: 'string', enum: ['all', 'project', 'genreProfile', 'characters', 'relationships', 'volumes', 'world', 'plot', 'scene', 'progress'], description: '要读取的部分；默认 all。结构化章节大纲位于 volumes。' },
        },
        output: toolOutput('小说设定已读取', { includeValue: true }),
        async execute(args, exec) {
          const { workspace, state } = await self.modelState(exec)
          const section = typeof args?.section === 'string' ? args.section : 'all'
          const contract = novelToolContract()
          if (section === 'all') return { ...self.view(workspace, state), contract }
          if (section === 'project') {
            const { characters, relationships, volumes, world, plot, scene, progress, ...overview } = state.project
            return { workspace: { id: String(workspace.id), title: workspace.title }, revision: state.revision, project: overview, contract }
          }
          return { workspace: { id: String(workspace.id), title: workspace.title }, revision: state.revision, [section]: state.project[section], contract }
        },
      }))

      this.ctx.tools.register(defineTool({
        name: 'novel_save_chapter',
        description: '把已经完成的小说章节正文真实写入当前 Harness Workspace。用户要求创建、生成、保存或导出章节文件时必须调用；只有返回 ok: true 且 verified: true 后才能声称文件已生成。filename 只能是工作区根目录下的单个 .md/.txt 文件名。',
        parameters: {
          filename: { type: 'string', required: true, description: '工作区根目录下的文件名，例如 第1章_测试.md；禁止目录、绝对路径和路径穿越。无扩展名时自动补 .md。' },
          content: { type: 'string', required: true, description: '要落盘的完整章节正文，不是摘要、设定或 JSON。' },
          overwrite: { type: 'boolean', description: '默认 false。已有同名但内容不同的文件时，只有明确需要替换才传 true。' },
        },
        output: toolOutput('小说章节文件已核验', { includeValue: true }),
        finalizeContent: manuscriptFailureContent,
        async execute(args, exec) {
          const { workspace } = await self.modelState(exec)
          const saved = await saveWorkspaceManuscript(workspace.path, {
            filename: args?.filename,
            content: args?.content,
            overwrite: args?.overwrite === true,
          })
          return {
            ok: true,
            ...saved,
            workspace: { id: String(workspace.id), title: workspace.title, path: workspace.path },
          }
        },
      }))

      this.ctx.tools.register(defineTool({
        name: 'novel_patch',
        description: '安全地局部修改当前工作区小说设定。先 novel_read；patch 必须是直接 JSON 对象，禁止字符串化或包裹整个工具参数。失败时调用 novel_schema、修正并重试一次。对象部分深度合并；提供的数组整体替换。',
        parameters: {
          patch: projectToolSchema({ partial: true, required: true }),
          expected_revision: { type: 'integer', required: true, description: '必填并发保护；复制最近一次 novel_read 返回的 revision。' },
        },
        output: toolOutput('小说设定已修改'),
        finalizeContent: mutationFailureContent('patch'),
        async execute(args, exec) {
          const { workspace } = await self.modelState(exec)
          assertProjectShape(args?.patch, { partial: true })
          const expectedRevision = assertExpectedRevision(args?.expected_revision)
          const result = await self.mutate(String(workspace.id), expectedRevision, current => {
            const project = mergeProject(current.project, args?.patch)
            assertProjectShape(project, { partial: false })
            return { ...current, project }
          })
          return concludeStoppedMutation(result, exec)
        },
      }))

      this.ctx.tools.register(defineTool({
        name: 'novel_character_patch',
        description: '按稳定角色 ID 局部更新一张角色卡；不需要重发 characters 数组。类型专用内容写入 patch.customFields。先 novel_read characters 并复制 revision。',
        parameters: {
          character_id: { type: 'string', required: true, description: '已有角色的稳定 id，不要使用姓名猜测。' },
          patch: characterPatchToolSchema(),
          expected_revision: { type: 'integer', required: true },
        },
        output: toolOutput('角色卡已修改'),
        finalizeContent: mutationFailureContent('character patch'),
        async execute(args, exec) {
          const { workspace } = await self.modelState(exec)
          const expectedRevision = assertExpectedRevision(args?.expected_revision)
          const result = await self.mutate(String(workspace.id), expectedRevision, current => ({
            ...current,
            project: patchCharacterById(current.project, args?.character_id, args?.patch),
          }))
          return concludeStoppedMutation(result, exec)
        },
      }))

      this.ctx.tools.register(defineTool({
        name: 'novel_relationship_patch',
        description: '按稳定关系 ID 局部更新一条关系线；端点必须指向两个不同且明确的角色 ID。先 novel_read relationships 并复制 revision。',
        parameters: {
          relationship_id: { type: 'string', required: true },
          patch: relationshipPatchToolSchema(),
          expected_revision: { type: 'integer', required: true },
        },
        output: toolOutput('关系线已修改'),
        finalizeContent: mutationFailureContent('relationship patch'),
        async execute(args, exec) {
          const { workspace } = await self.modelState(exec)
          const expectedRevision = assertExpectedRevision(args?.expected_revision)
          const result = await self.mutate(String(workspace.id), expectedRevision, current => ({
            ...current,
            project: patchRelationshipById(current.project, args?.relationship_id, args?.patch),
          }))
          return concludeStoppedMutation(result, exec)
        },
      }))

      this.ctx.tools.register(defineTool({
        name: 'novel_outline_read',
        description: '按卷或章节读取结构化大纲，避免把几十章塞进一个长字符串。默认返回所有卷的概要和每卷前 50 章。',
        parameters: {
          volume_id: { type: 'string', description: '可选；只读取这个卷。' },
          chapter_id: { type: 'string', description: '可选；只读取这个章节，必须同时提供 volume_id。' },
          offset: { type: 'integer', description: '章节起始下标，默认 0。' },
          limit: { type: 'integer', description: '返回章数，默认 50，最大 100。' },
        },
        output: toolOutput('结构化大纲已读取', { includeValue: true }),
        async execute(args, exec) {
          const { workspace, state } = await self.modelState(exec)
          const volumeId = typeof args?.volume_id === 'string' ? args.volume_id.trim() : ''
          const chapterId = typeof args?.chapter_id === 'string' ? args.chapter_id.trim() : ''
          if (chapterId && !volumeId) throw new Error('chapter_id requires volume_id')
          const volumes = volumeId ? state.project.volumes.filter(volume => volume.id === volumeId) : state.project.volumes
          if (volumeId && volumes.length === 0) throw new Error(`unknown volume '${volumeId}'`)
          const offset = Number.isSafeInteger(args?.offset) ? Math.max(0, args.offset) : 0
          const limit = Number.isSafeInteger(args?.limit) ? Math.max(1, Math.min(100, args.limit)) : 50
          const value = volumes.map(volume => {
            if (chapterId) {
              const chapter = volume.chapters.find(item => item.id === chapterId)
              if (!chapter) throw new Error(`unknown chapter '${chapterId}'`)
              return { ...volume, chapters: [chapter], totalChapters: volume.chapters.length }
            }
            return { ...volume, chapters: volume.chapters.slice(offset, offset + limit), totalChapters: volume.chapters.length }
          })
          return { workspace: { id: String(workspace.id), title: workspace.title }, revision: state.revision, volumes: value }
        },
      }))

      this.ctx.tools.register(defineTool({
        name: 'novel_volume_upsert',
        description: '创建或局部更新一个卷。volume_id 是稳定 ID；不存在则创建，存在则只更新 patch 中提供的字段。',
        parameters: {
          volume_id: { type: 'string', required: true },
          patch: volumePatchToolSchema(),
          expected_revision: { type: 'integer', required: true },
        },
        output: toolOutput('卷已保存'),
        finalizeContent: mutationFailureContent('volume patch'),
        async execute(args, exec) {
          const { workspace } = await self.modelState(exec)
          const expectedRevision = assertExpectedRevision(args?.expected_revision)
          const result = await self.mutate(String(workspace.id), expectedRevision, current => ({
            ...current,
            project: upsertVolume(current.project, args?.volume_id, args?.patch),
          }))
          return concludeStoppedMutation(result, exec)
        },
      }))

      this.ctx.tools.register(defineTool({
        name: 'novel_chapter_upsert',
        description: '在指定卷内创建或局部更新一章。适合逐章写入详细大纲，不需要重发整卷或全部章节。events 是字符串数组，类型专用信息放 customFields。',
        parameters: {
          volume_id: { type: 'string', required: true },
          chapter_id: { type: 'string', required: true },
          patch: chapterPatchToolSchema(),
          expected_revision: { type: 'integer', required: true },
        },
        output: toolOutput('章节大纲已保存'),
        finalizeContent: mutationFailureContent('chapter patch'),
        async execute(args, exec) {
          const { workspace } = await self.modelState(exec)
          const expectedRevision = assertExpectedRevision(args?.expected_revision)
          const result = await self.mutate(String(workspace.id), expectedRevision, current => ({
            ...current,
            project: upsertChapter(current.project, args?.volume_id, args?.chapter_id, args?.patch),
          }))
          return concludeStoppedMutation(result, exec)
        },
      }))

      this.ctx.tools.register(defineTool({
        name: 'novel_chapter_remove',
        description: '删除结构化大纲中的指定章节。只在用户明确要求删除时调用。',
        parameters: {
          volume_id: { type: 'string', required: true },
          chapter_id: { type: 'string', required: true },
          expected_revision: { type: 'integer', required: true },
        },
        output: toolOutput('章节已删除'),
        finalizeContent: mutationFailureContent('chapter remove'),
        async execute(args, exec) {
          const { workspace } = await self.modelState(exec)
          const expectedRevision = assertExpectedRevision(args?.expected_revision)
          const result = await self.mutate(String(workspace.id), expectedRevision, current => ({
            ...current,
            project: removeChapter(current.project, args?.volume_id, args?.chapter_id),
          }))
          return concludeStoppedMutation(result, exec)
        },
      }))

      this.ctx.tools.register(defineTool({
        name: 'novel_chapter_reorder',
        description: '把指定章节移动到卷内的新下标。target_index 从 0 开始。',
        parameters: {
          volume_id: { type: 'string', required: true },
          chapter_id: { type: 'string', required: true },
          target_index: { type: 'integer', required: true },
          expected_revision: { type: 'integer', required: true },
        },
        output: toolOutput('章节顺序已更新'),
        finalizeContent: mutationFailureContent('chapter reorder'),
        async execute(args, exec) {
          const { workspace } = await self.modelState(exec)
          const expectedRevision = assertExpectedRevision(args?.expected_revision)
          const result = await self.mutate(String(workspace.id), expectedRevision, current => ({
            ...current,
            project: reorderChapter(current.project, args?.volume_id, args?.chapter_id, args?.target_index),
          }))
          return concludeStoppedMutation(result, exec)
        },
      }))

      this.ctx.tools.register(defineTool({
        name: 'novel_write',
        description: '完整替换当前工作区小说项目，仅用于大规模重构。先 novel_read 并保留全部字段；project 必须是直接的完整 JSON 对象，禁止字符串化、Markdown 或再次包裹 {expected_revision, project}。失败时调用 novel_schema、修正并重试一次。',
        parameters: {
          project: projectToolSchema({ partial: false, required: true }),
          expected_revision: { type: 'integer', required: true, description: '必填并发保护；复制最近一次 novel_read 返回的 revision。' },
          replace_progress: { type: 'boolean', description: '默认 false，完整重写仍保留不可追加式的进展账本。只有明确要重建历史时才传 true。' },
        },
        output: toolOutput('小说项目已重写'),
        finalizeContent: mutationFailureContent('project'),
        async execute(args, exec) {
          const { workspace, state } = await self.modelState(exec)
          const guard = self.mutationRoundGuard.check(exec?.agent, 'novel_write')
          if (!guard.allowed) {
            return concludeStoppedMutation({
              ok: true,
              changed: false,
              stop: true,
              reason: guard.reason,
              blockedOperation: 'novel_write',
              previousOperation: guard.previousOperation,
              ...self.view(workspace, state),
            }, exec)
          }
          assertProjectShape(args?.project, { partial: false })
          const expectedRevision = assertExpectedRevision(args?.expected_revision)
          const result = await self.mutate(String(workspace.id), expectedRevision, current => {
            const project = normalizeProject(args?.project)
            if (args?.replace_progress !== true) project.progress = current.project.progress
            return { ...current, project }
          })
          if (result.changed === true) self.mutationRoundGuard.record(exec?.agent, 'novel_write')
          return concludeStoppedMutation(result, exec)
        },
      }))

      this.ctx.tools.register(defineTool({
        name: 'novel_advance',
        description: '推进当前工作区小说进度。先 novel_read；追加一条故事进展记录并可更新场景。scene 必须是直接 JSON 对象；参数失败时调用 novel_schema、修正并重试一次。',
        parameters: {
          summary: { type: 'string', required: true, description: '本次实际发生的剧情进展。' },
          chapter: { type: 'string', description: '章节或场次名称。' },
          canon_changes: { type: 'string', description: '本次新增或改变的永久事实。' },
          open_threads: { type: 'string', description: '仍待回收的伏笔、承诺或冲突。' },
          scene: scenePatchToolSchema(),
          expected_revision: { type: 'integer', required: true, description: '必填并发保护；复制最近一次 novel_read 返回的 revision。' },
        },
        output: toolOutput('小说进度已推进'),
        finalizeContent: mutationFailureContent('scene'),
        async execute(args, exec) {
          const { workspace, state } = await self.modelState(exec)
          const guard = self.mutationRoundGuard.check(exec?.agent, 'novel_advance')
          if (!guard.allowed) {
            return concludeStoppedMutation({
              ok: true,
              changed: false,
              stop: true,
              reason: guard.reason,
              blockedOperation: 'novel_advance',
              previousOperation: guard.previousOperation,
              ...self.view(workspace, state),
            }, exec)
          }
          if (args?.scene !== undefined) assertProjectShape({ scene: args.scene }, { partial: true })
          const expectedRevision = assertExpectedRevision(args?.expected_revision)
          const result = await self.mutate(String(workspace.id), expectedRevision, current => ({
            ...current,
            project: advanceProject(current.project, {
              summary: args?.summary,
              chapter: args?.chapter,
              canonChanges: args?.canon_changes,
              openThreads: args?.open_threads,
              scene: args?.scene,
            }),
          }))
          if (result.changed === true) self.mutationRoundGuard.record(exec?.agent, 'novel_advance')
          return concludeStoppedMutation(result, exec)
        },
      }))
    }
  }
})()

export { NovalWriterService, NovalWriterService as default }
