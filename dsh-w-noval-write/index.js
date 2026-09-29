/**
 * dsh-w-noval-write — workspace-scoped novel canon for DeepSeek Harness.
 *
 * The requested package id intentionally keeps the `noval` spelling. Every
 * registered Harness Workspace owns one shared project. `/write` links only
 * the receiving conversation to that project; the project itself has no mode
 * switch and remains available to the sidebar and model tools at all times.
 */

import { randomUUID } from 'node:crypto'
import { existsSync, readFileSync, renameSync } from 'node:fs'
import { mkdir, readFile, rename, rm, stat, writeFile } from 'node:fs/promises'
import { basename, dirname, join, resolve } from 'node:path'
import Schema from '@deepseek-ai/schemastery'
import { createUserMessage } from '@deepseek-ai/dsh-llm'
import { defineTool } from '@deepseek-ai/dsh-tools'
import { Remote, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
import { dshHomePath, expandHomePath } from '@deepseek-ai/dsh-home-paths'
import {
  advanceProject,
  analyzeProgression,
  analyzeThreads,
  assertProjectShape,
  compareThreadUrgency,
  chapterPatchToolSchema,
  chapterSequence,
  characterPatchToolSchema,
  progressionRecordPatchToolSchema,
  defaultProject,
  defaultState,
  deleteProgressionTemplate,
  describeProjectDiff,
  findChapter,
  linkChapterManuscript,
  mergeProject,
  novelToolContract,
  normalizeProgressionTemplates,
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
  removeProgressionRecord,
  restoreBuiltInProgressionTemplates,
  saveProgressionTemplate,
  removeThread,
  reorderChapter,
  projectExportDocument,
  projectFromImportDocument,
  scenePatchToolSchema,
  threadPatchToolSchema,
  threadsForChapter,
  updateWriteLinkStore,
  upsertChapter,
  upsertProgressionRecord,
  upsertThread,
  upsertVolume,
  volumePatchToolSchema,
  writeLinkForSession,
} from './noval-write-core.js'
import { NovelMutationRoundGuard } from './noval-mutation-guard.js'
import { searchManuscripts } from './noval-search-core.js'
import {
  NOVEL_DIR,
  NOVEL_HISTORY_DIR,
  NOVEL_STATE_FILE,
  createNovelFolder,
  findNovel,
  migrateLegacyProject,
  novelHandle,
  parseNovelHandle,
  readBindingStore,
  scanNovels,
  updateNovelTitle,
  writeBindingStore,
} from './noval-library.js'
import { listWorkspaceManuscripts, readWorkspaceManuscript, saveWorkspaceManuscript } from './noval-file-core.js'

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
  historyLimit: Schema.number().default(60),
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
  let _listManuscripts_decorators
  let _readManuscript_decorators
  let _listStyleCorpora_decorators
  let _listNovels_decorators
  let _getBinding_decorators
  let _bindNovel_decorators
  let _unbindNovel_decorators
  let _createNovel_decorators
  let _getRevision_decorators
  let _listHistory_decorators
  let _compareSnapshot_decorators
  let _restoreSnapshot_decorators
  let _getProgressionTemplates_decorators
  let _saveProgressionTemplate_decorators
  let _deleteProgressionTemplate_decorators
  let _restoreProgressionTemplates_decorators
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
      _listManuscripts_decorators = [Remote('listManuscripts')]
      __esDecorate(this, null, _listManuscripts_decorators, {
        kind: 'method', name: 'listManuscripts', static: false, private: false,
        access: { has: obj => 'listManuscripts' in obj, get: obj => obj.listManuscripts }, metadata: _metadata,
      }, null, _instanceExtraInitializers)
      _readManuscript_decorators = [Remote('readManuscript')]
      __esDecorate(this, null, _readManuscript_decorators, {
        kind: 'method', name: 'readManuscript', static: false, private: false,
        access: { has: obj => 'readManuscript' in obj, get: obj => obj.readManuscript }, metadata: _metadata,
      }, null, _instanceExtraInitializers)
      _listStyleCorpora_decorators = [Remote('listStyleCorpora')]
      __esDecorate(this, null, _listStyleCorpora_decorators, {
        kind: 'method', name: 'listStyleCorpora', static: false, private: false,
        access: { has: obj => 'listStyleCorpora' in obj, get: obj => obj.listStyleCorpora }, metadata: _metadata,
      }, null, _instanceExtraInitializers)
      _listNovels_decorators = [Remote('listNovels')]
      __esDecorate(this, null, _listNovels_decorators, {
        kind: 'method', name: 'listNovels', static: false, private: false,
        access: { has: obj => 'listNovels' in obj, get: obj => obj.listNovels }, metadata: _metadata,
      }, null, _instanceExtraInitializers)
      _getBinding_decorators = [Remote('getBinding')]
      __esDecorate(this, null, _getBinding_decorators, {
        kind: 'method', name: 'getBinding', static: false, private: false,
        access: { has: obj => 'getBinding' in obj, get: obj => obj.getBinding }, metadata: _metadata,
      }, null, _instanceExtraInitializers)
      _bindNovel_decorators = [Remote('bindNovel')]
      __esDecorate(this, null, _bindNovel_decorators, {
        kind: 'method', name: 'bindNovel', static: false, private: false,
        access: { has: obj => 'bindNovel' in obj, get: obj => obj.bindNovel }, metadata: _metadata,
      }, null, _instanceExtraInitializers)
      _unbindNovel_decorators = [Remote('unbindNovel')]
      __esDecorate(this, null, _unbindNovel_decorators, {
        kind: 'method', name: 'unbindNovel', static: false, private: false,
        access: { has: obj => 'unbindNovel' in obj, get: obj => obj.unbindNovel }, metadata: _metadata,
      }, null, _instanceExtraInitializers)
      _createNovel_decorators = [Remote('createNovel')]
      __esDecorate(this, null, _createNovel_decorators, {
        kind: 'method', name: 'createNovel', static: false, private: false,
        access: { has: obj => 'createNovel' in obj, get: obj => obj.createNovel }, metadata: _metadata,
      }, null, _instanceExtraInitializers)
      _getRevision_decorators = [Remote('getRevision')]
      __esDecorate(this, null, _getRevision_decorators, {
        kind: 'method', name: 'getRevision', static: false, private: false,
        access: { has: obj => 'getRevision' in obj, get: obj => obj.getRevision }, metadata: _metadata,
      }, null, _instanceExtraInitializers)
      _listHistory_decorators = [Remote('listHistory')]
      __esDecorate(this, null, _listHistory_decorators, {
        kind: 'method', name: 'listHistory', static: false, private: false,
        access: { has: obj => 'listHistory' in obj, get: obj => obj.listHistory }, metadata: _metadata,
      }, null, _instanceExtraInitializers)
      _compareSnapshot_decorators = [Remote('compareSnapshot')]
      __esDecorate(this, null, _compareSnapshot_decorators, {
        kind: 'method', name: 'compareSnapshot', static: false, private: false,
        access: { has: obj => 'compareSnapshot' in obj, get: obj => obj.compareSnapshot }, metadata: _metadata,
      }, null, _instanceExtraInitializers)
      _restoreSnapshot_decorators = [Remote('restoreSnapshot')]
      __esDecorate(this, null, _restoreSnapshot_decorators, {
        kind: 'method', name: 'restoreSnapshot', static: false, private: false,
        access: { has: obj => 'restoreSnapshot' in obj, get: obj => obj.restoreSnapshot }, metadata: _metadata,
      }, null, _instanceExtraInitializers)
      _getProgressionTemplates_decorators = [Remote('getProgressionTemplates')]
      __esDecorate(this, null, _getProgressionTemplates_decorators, {
        kind: 'method', name: 'getProgressionTemplates', static: false, private: false,
        access: { has: obj => 'getProgressionTemplates' in obj, get: obj => obj.getProgressionTemplates }, metadata: _metadata,
      }, null, _instanceExtraInitializers)
      _saveProgressionTemplate_decorators = [Remote('saveProgressionTemplate')]
      __esDecorate(this, null, _saveProgressionTemplate_decorators, {
        kind: 'method', name: 'saveProgressionTemplate', static: false, private: false,
        access: { has: obj => 'saveProgressionTemplate' in obj, get: obj => obj.saveProgressionTemplate }, metadata: _metadata,
      }, null, _instanceExtraInitializers)
      _deleteProgressionTemplate_decorators = [Remote('deleteProgressionTemplate')]
      __esDecorate(this, null, _deleteProgressionTemplate_decorators, {
        kind: 'method', name: 'deleteProgressionTemplate', static: false, private: false,
        access: { has: obj => 'deleteProgressionTemplate' in obj, get: obj => obj.deleteProgressionTemplate }, metadata: _metadata,
      }, null, _instanceExtraInitializers)
      _restoreProgressionTemplates_decorators = [Remote('restoreProgressionTemplates')]
      __esDecorate(this, null, _restoreProgressionTemplates_decorators, {
        kind: 'method', name: 'restoreProgressionTemplates', static: false, private: false,
        access: { has: obj => 'restoreProgressionTemplates' in obj, get: obj => obj.restoreProgressionTemplates }, metadata: _metadata,
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
      // Which novel each conversation writes: session id → (workspace, novel).
      this.bindingsPath = join(this.root, 'session-novels.json')
      this.bindings = readBindingStore(this.bindingsPath)
      this.novelFolders = new Map()
      this.migrationChecked = new Set()
      this.workspaceRegistry = undefined
      this.knowledgeBase = undefined
      // Manuscript statistics: per-file counts keyed by path+mtime, and the
      // latest filename → words map per workspace for the prompt.
      this.manuscriptCache = new Map()
      this.manuscriptWords = new Map()
      // Manuscript text for novel_search, keyed by path and reused while size and mtime match.
      this.manuscriptTextCache = new Map()
      // Progression system templates are shared by every book of this profile.
      this.templatesPath = join(this.root, 'progression-templates.json')
      this.templateTail = Promise.resolve()

      ctx.inject(['workspaceRegistry'], (scope) => {
        this.workspaceRegistry = scope.workspaceRegistry
        scope.effect(() => () => {
          if (this.workspaceRegistry === scope.workspaceRegistry) this.workspaceRegistry = undefined
        }, 'dsh-w-noval-write: release workspace registry')
      })
      ctx.inject(['knowledgeBase'], (scope) => {
        this.knowledgeBase = scope.knowledgeBase
        // A conversation linked by /write writes with its book's style corpus,
        // without flipping the knowledge base for every other conversation.
        if (typeof scope.knowledgeBase.registerScopeResolver === 'function') {
          scope.effect(() => scope.knowledgeBase.registerScopeResolver(agent => this.corpusScopeForAgent(agent)), 'dsh-w-noval-write: style corpus binding')
        }
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
            const novel = this.novelForAgentSync(context.agent)
            if (!novel) return '# Novel writing\n\nThis conversation used /write but no novel is bound to it. Ask the user to choose or create one in the Novel Writing panel.'
            const state = this.stateForWorkspace(novel.id)
            // Refresh counts in the background; this turn uses the last known ones.
            this.manuscriptStats(novel).catch(() => {})
            return [
              '# Bound novel',
              '',
              `- Novel: ${state.project.title || novel.folder}`,
              `- Folder: ${novel.folder}/ in Workspace ${novel.workspaceTitle}; chapter files are saved there.`,
              `- Writing objective: ${link.objective}`,
              '- Every conversation bound to this novel shares the same canon.',
              '',
              projectPrompt(state.project, this.settings.promptMaxChars, { manuscripts: this.manuscriptWords.get(novel.id) }),
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
            const host = await this.workspaceForAgent(agent)
            if (!host) return { kind: 'error', text: '当前对话不属于已注册的 Harness 工作区，无法连接小说项目。' }
            this.ensureMigrated(host)
            const workspace = this.novelForAgentSync(agent)
            if (!workspace) return { kind: 'error', text: '这个对话还没有绑定小说。打开右侧「小说写作」工作台，选择一本已有的小说或新建一本，然后再使用 /write。' }
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
              if (this.knowledgeBase && typeof this.knowledgeBase.registerScopeResolver === 'function') {
                knowledge = await this.describeCorpusBinding(state.project.styleCorpusId)
              } else if (this.knowledgeBase && typeof this.knowledgeBase.setMode === 'function') {
                const result = await this.knowledgeBase.setMode('writing')
                knowledge = result && result.mode === 'writing' ? '知识库已同步到 writing mode。' : '知识库 writing mode 同步结果未知。'
              }
            } catch (error) {
              this.report('knowledge-base mode switch failed', error)
              knowledge = '知识库切换失败，但小说项目仍已连接。'
            }
            if (command.kind === 'create') this.submitWriteFollowup(invocation, linked.objective)
            return this.renderLink(`小说写作任务已创建 · 《${state.project.title || workspace.folder}》（${workspace.folder}/） · ${knowledge}`, linked)
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

    /** The registered Harness Workspace itself. */
    hostWorkspace(workspaceId) {
      if (typeof workspaceId !== 'string' || workspaceId.trim() === '') throw new Error('workspaceId must be a non-empty string')
      const registry = this.registry()
      if (!registry) throw new Error('workspace registry is unavailable')
      const workspace = registry.get(workspaceId)
      if (!workspace) throw new Error(`unknown workspace '${workspaceId}'`)
      return workspace
    }

    /**
     * One novel, addressed by its handle (`<workspaceId>#<novelId>`). The
     * record keeps the old workspace shape — id, title, path — so storage and
     * manuscript code work on the novel's folder unchanged.
     */
    workspaceRecord(handle) {
      const { workspaceId, novelId } = parseNovelHandle(handle)
      const workspace = this.hostWorkspace(workspaceId)
      const remembered = this.novelFolders.get(handle)
      const novel = findNovel(workspace.path, novelId, remembered)
      if (!novel) throw new Error(`the novel folder for '${novelId}' was not found in workspace '${workspace.title}'; it may have been deleted or moved out of the workspace`)
      this.novelFolders.set(handle, novel.folder)
      return {
        id: handle,
        title: novel.title || novel.folder,
        path: novel.dir,
        folder: novel.folder,
        novelId,
        workspaceId: String(workspace.id),
        workspaceTitle: workspace.title,
        workspacePath: workspace.path,
      }
    }

    /** The novel bound to a conversation, or null. */
    novelForAgentSync(agent) {
      if (!agent || !agent.session) return null
      const binding = this.bindings.bindings[String(agent.session.id)]
      if (!binding) return null
      const handle = novelHandle(binding.workspaceId, binding.novelId)
      if (!this.novelFolders.has(handle)) this.novelFolders.set(handle, binding.folder)
      try {
        return this.workspaceRecord(handle)
      } catch {
        return null
      }
    }

    /**
     * A workspace saved by 0.12 or earlier had exactly one project in the
     * plugin's data folder. The first time the workspace is used it becomes
     * the workspace's first novel folder, and conversations that were writing
     * it through /write stay bound to it.
     */
    ensureMigrated(workspace) {
      const key = String(workspace.id)
      if (this.migrationChecked.has(key)) return
      this.migrationChecked.add(key)
      const legacyDir = join(this.root, 'workspaces', key)
      const legacyPath = join(legacyDir, NOVEL_STATE_FILE)
      if (!existsSync(legacyPath) || typeof workspace.path !== 'string' || !existsSync(workspace.path)) return
      try {
        const state = readStateSync(legacyPath)
        if (state.revision === 0 && JSON.stringify(state.project) === JSON.stringify(defaultProject())) {
          renameSync(legacyPath, `${legacyPath}.migrated`)
          return
        }
        const { novel, moved, skipped } = migrateLegacyProject({ legacyDir, workspacePath: workspace.path, state })
        for (const [sessionId, link] of Object.entries(this.writeLinks.links)) {
          if (link.workspaceId === key && !this.bindings.bindings[sessionId]) {
            this.bindings.bindings[sessionId] = { workspaceId: key, novelId: novel.id, folder: novel.folder, boundAt: new Date().toISOString() }
          }
        }
        writeBindingStore(this.bindingsPath, this.bindings)
        const note = `migrated workspace '${workspace.title}' into novel folder '${novel.folder}' (moved ${moved.length} chapter files${skipped.length ? `, left ${skipped.length} in place because the name was taken` : ''})`
        if (typeof this.ctx.logger === 'function') this.ctx.logger('dsh-w-noval-write').info(note)
      } catch (error) {
        this.report(`legacy project of workspace '${workspace.title}' was not migrated`, error)
      }
    }

    novelSummary(workspace, novel) {
      const handle = novelHandle(String(workspace.id), novel.id)
      let state = null
      try {
        state = handle && this.states.get(handle) ? this.states.get(handle) : readStateSync(join(novel.dir, NOVEL_DIR, NOVEL_STATE_FILE))
      } catch {
        state = null
      }
      const project = state ? state.project : null
      return {
        handle,
        id: novel.id,
        title: (project && project.title) || novel.title || novel.folder,
        folder: novel.folder,
        genre: project ? project.genre : '',
        chapters: project ? project.volumes.reduce((sum, volume) => sum + volume.chapters.length, 0) : 0,
        threads: project ? project.threads.filter(thread => thread.status === 'open' || thread.status === 'partial').length : 0,
        revision: state ? state.revision : 0,
        updatedAt: state ? state.updatedAt : novel.createdAt,
        sessions: Object.values(this.bindings.bindings).filter(binding => binding.novelId === novel.id && binding.workspaceId === String(workspace.id)).length,
        readable: Boolean(state),
      }
    }

    async listNovels(workspaceId) {
      const workspace = this.hostWorkspace(workspaceId)
      this.ensureMigrated(workspace)
      const novels = scanNovels(workspace.path).map(novel => this.novelSummary(workspace, novel))
      novels.sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)))
      return { workspace: { id: String(workspace.id), title: workspace.title }, novels }
    }

    /** The conversation's novel (if any) plus the workspace's novels to choose from. */
    async getBinding(sessionId, workspaceId) {
      const listing = workspaceId ? await this.listNovels(workspaceId) : { novels: [] }
      const binding = sessionId ? this.bindings.bindings[String(sessionId)] : null
      if (!binding) return { binding: null, novels: listing.novels }
      const handle = novelHandle(binding.workspaceId, binding.novelId)
      try {
        const novel = this.workspaceRecord(handle)
        return {
          binding: { handle, workspaceId: binding.workspaceId, novelId: binding.novelId, folder: novel.folder, title: this.stateForWorkspace(handle).project.title || novel.title, workspaceTitle: novel.workspaceTitle },
          novels: listing.novels,
        }
      } catch (error) {
        return { binding: null, missing: { novelId: binding.novelId, folder: binding.folder, message: error.message }, novels: listing.novels }
      }
    }

    async bindNovel(sessionId, workspaceId, novelId) {
      const key = String(sessionId || '').trim()
      if (!key) throw new Error('this conversation has no session yet; send a message first')
      const novel = this.workspaceRecord(novelHandle(String(workspaceId), String(novelId)))
      this.bindings.bindings[key] = { workspaceId: novel.workspaceId, novelId: novel.novelId, folder: novel.folder, boundAt: new Date().toISOString() }
      writeBindingStore(this.bindingsPath, this.bindings)
      return this.getBinding(key, novel.workspaceId)
    }

    async unbindNovel(sessionId) {
      const key = String(sessionId || '').trim()
      const binding = this.bindings.bindings[key]
      delete this.bindings.bindings[key]
      writeBindingStore(this.bindingsPath, this.bindings)
      return this.getBinding(key, binding ? binding.workspaceId : '')
    }

    /** Create `<workspace>/<title>/` with an empty book and bind it to the conversation. */
    async createNovel(sessionId, workspaceId, input) {
      const workspace = this.hostWorkspace(String(workspaceId))
      this.ensureMigrated(workspace)
      const source = input && typeof input === 'object' ? input : {}
      const title = typeof source.title === 'string' ? source.title.trim().slice(0, 240) : ''
      if (!title) throw new Error('a new novel needs a title')
      const state = defaultState()
      state.project.title = title
      const novel = createNovelFolder(workspace.path, { title, folder: typeof source.folder === 'string' ? source.folder : '' }, state)
      const handle = novelHandle(String(workspace.id), novel.id)
      this.novelFolders.set(handle, novel.folder)
      if (sessionId) return { created: { handle, folder: novel.folder, title }, ...(await this.bindNovel(sessionId, String(workspace.id), novel.id)) }
      return { created: { handle, folder: novel.folder, title }, ...(await this.getBinding('', String(workspace.id))) }
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

    statePath(handle) {
      return join(this.workspaceRecord(String(handle)).path, NOVEL_DIR, NOVEL_STATE_FILE)
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
        workspace: { id: String(workspace.id), title: workspace.title, path: workspace.path, folder: workspace.folder, workspaceId: workspace.workspaceId, workspaceTitle: workspace.workspaceTitle },
      }
    }

    /** mutate() tagged with who made the change, for the version history. */
    mutateAs(meta, workspaceId, expectedRevision, callback) {
      return this.mutate(workspaceId, expectedRevision, callback, meta)
    }

    async mutate(workspaceId, expectedRevision, callback, meta = { actor: 'user', operation: 'unknown' }) {
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
        // Keep the folder's metadata title in step for the novel list.
        if (next.project.title !== current.project.title) {
          try { updateNovelTitle({ id: workspace.novelId, dir: workspace.path }, next.project.title) } catch (error) { this.report('novel title not updated', error) }
        }
        // History is a safety net: a failure to record it never fails the edit.
        await this.recordHistory(key, current, next, meta).catch(error => this.report(`history for '${key}' not recorded`, error))
        return { ok: true, changed: true, ...this.view(workspace, next) }
      })
      this.writeTails.set(key, operation.then(() => {}, () => {}))
      return operation
    }

    historyDir(key) {
      return join(this.workspaceRecord(key).path, NOVEL_DIR, NOVEL_HISTORY_DIR)
    }

    async readHistoryIndex(key) {
      try {
        const parsed = JSON.parse(await readFile(join(this.historyDir(key), 'index.json'), 'utf8'))
        return Array.isArray(parsed.entries) ? parsed.entries : []
      } catch (error) {
        if (error && error.code === 'ENOENT') return []
        throw error
      }
    }

    /**
     * Snapshot one accepted change. The first recorded change also stores the
     * state it replaced, so the project can always go back to before the
     * first AI edit. Older snapshots beyond historyLimit are pruned.
     */
    async recordHistory(key, previous, next, meta) {
      const dir = this.historyDir(key)
      const entries = await this.readHistoryIndex(key)
      const snapshot = async (state, info) => {
        const file = `r${state.revision}.json`
        await writeAtomic(join(dir, file), { revision: state.revision, at: info.at, actor: info.actor, operation: info.operation, project: state.project })
        return { revision: state.revision, at: info.at, actor: info.actor, operation: info.operation, changes: info.changes, file, ...(info.restoredFrom !== undefined ? { restoredFrom: info.restoredFrom } : {}) }
      }
      if (!entries.some(entry => entry.revision === previous.revision)) {
        entries.push(await snapshot(previous, { at: previous.updatedAt, actor: 'baseline', operation: 'baseline', changes: [] }))
      }
      entries.push(await snapshot(next, {
        at: next.updatedAt,
        actor: meta && meta.actor === 'ai' ? 'ai' : 'user',
        operation: (meta && meta.operation) || 'unknown',
        restoredFrom: meta && Number.isSafeInteger(meta.restoredFrom) ? meta.restoredFrom : undefined,
        changes: describeProjectDiff(previous.project, next.project),
      }))
      const limit = Number.isSafeInteger(this.settings.historyLimit) && this.settings.historyLimit >= 5 ? this.settings.historyLimit : 60
      const kept = entries.sort((a, b) => a.revision - b.revision).slice(-limit)
      const dropped = entries.filter(entry => !kept.includes(entry))
      await writeAtomic(join(dir, 'index.json'), { version: 1, entries: kept })
      for (const entry of dropped) await rm(join(dir, entry.file), { force: true }).catch(() => {})
    }

    async readSnapshot(key, revision) {
      const entry = (await this.readHistoryIndex(key)).find(item => item.revision === revision)
      if (!entry) throw new Error(`revision ${revision} is not in the history (it may have been pruned)`)
      const stored = JSON.parse(await readFile(join(this.historyDir(key), entry.file), 'utf8'))
      return { entry, project: normalizeProject(stored.project) }
    }

    /** Cheap poll for the panel: the current revision and the latest change. */
    async getRevision(workspaceId) {
      const workspace = this.workspaceRecord(workspaceId)
      const key = String(workspace.id)
      const state = this.stateForWorkspace(key)
      const entries = await this.readHistoryIndex(key).catch(() => [])
      const last = entries.length > 0 && entries[entries.length - 1].revision === state.revision ? entries[entries.length - 1] : null
      return { revision: state.revision, updatedAt: state.updatedAt, last }
    }

    async listHistory(workspaceId) {
      const workspace = this.workspaceRecord(workspaceId)
      const key = String(workspace.id)
      const state = this.stateForWorkspace(key)
      const entries = await this.readHistoryIndex(key)
      const limit = Number.isSafeInteger(this.settings.historyLimit) && this.settings.historyLimit >= 5 ? this.settings.historyLimit : 60
      return { current: state.revision, limit, entries: entries.slice().reverse().map(({ file, ...entry }) => entry) }
    }

    /** What restoring `revision` would change, compared with the current project. */
    async compareSnapshot(workspaceId, revision) {
      const workspace = this.workspaceRecord(workspaceId)
      const key = String(workspace.id)
      const { entry, project } = await this.readSnapshot(key, revision)
      const { file, ...meta } = entry
      return { ...meta, current: this.stateForWorkspace(key).revision, sections: describeProjectDiff(this.stateForWorkspace(key).project, project, { detail: true }) }
    }

    /** Bring back a snapshot as a new revision, so the restore itself can be undone. */
    async readProgressionTemplates() {
      try {
        return normalizeProgressionTemplates(JSON.parse(await readFile(this.templatesPath, 'utf8')))
      } catch (error) {
        if (error && error.code === 'ENOENT') return normalizeProgressionTemplates(undefined)
        throw error
      }
    }

    mutateProgressionTemplates(callback) {
      const operation = this.templateTail.then(async () => {
        const next = await callback(await this.readProgressionTemplates())
        await writeAtomic(this.templatesPath, next.library)
        return next
      })
      this.templateTail = operation.then(() => {}, () => {})
      return operation
    }

    async getProgressionTemplates() {
      return this.readProgressionTemplates()
    }

    async saveProgressionTemplate(input) {
      const result = await this.mutateProgressionTemplates(library => saveProgressionTemplate(library, input, { newId: `template-${randomUUID().slice(0, 8)}` }))
      return { ...result.library, saved: result.template }
    }

    async deleteProgressionTemplate(templateId) {
      const result = await this.mutateProgressionTemplates(library => ({ library: deleteProgressionTemplate(library, templateId) }))
      return result.library
    }

    async restoreProgressionTemplates() {
      const result = await this.mutateProgressionTemplates(library => ({ library: restoreBuiltInProgressionTemplates(library) }))
      return result.library
    }

    async restoreSnapshot(workspaceId, revision, expectedRevision) {
      const workspace = this.workspaceRecord(workspaceId)
      const { project } = await this.readSnapshot(String(workspace.id), revision)
      return this.mutateAs({ actor: 'user', operation: 'restore', restoredFrom: revision }, workspaceId, expectedRevision, current => ({ ...current, project }))
    }

    async getState(workspaceId) {
      const workspace = this.workspaceRecord(workspaceId)
      return this.view(workspace, this.stateForWorkspace(String(workspace.id)))
    }

    async saveProject(workspaceId, input, expectedRevision) {
      assertProjectShape(input, { partial: false })
      // A draft saved by an older panel (restored from before 0.14) has no
      // progression key; keep the stored ledger instead of wiping it.
      const keepsProgression = !Object.hasOwn(input, 'progression')
      return this.mutateAs({ actor: 'user', operation: 'panel-save' }, workspaceId, expectedRevision, current => {
        const project = normalizeProject(input)
        if (keepsProgression) project.progression = current.project.progression
        return { ...current, project }
      })
    }

    async exportProject(workspaceId) {
      const workspace = this.workspaceRecord(workspaceId)
      const state = this.stateForWorkspace(String(workspace.id))
      return projectExportDocument(state, workspace)
    }

    async importProject(workspaceId, input, expectedRevision) {
      const project = projectFromImportDocument(input)
      return this.mutateAs({ actor: 'user', operation: 'import' }, workspaceId, expectedRevision, current => ({ ...current, project }))
    }

    async resetProject(workspaceId, expectedRevision) {
      return this.mutateAs({ actor: 'user', operation: 'reset' }, workspaceId, expectedRevision, current => ({ ...current, project: defaultProject() }))
    }

    async manuscriptStats(workspace) {
      const listing = await listWorkspaceManuscripts(workspace.path, { cache: this.manuscriptCache })
      this.manuscriptWords.set(String(workspace.id), new Map(listing.files.map(file => [file.filename, file.words])))
      return listing
    }

    async listManuscripts(workspaceId) {
      const workspace = this.workspaceRecord(workspaceId)
      const listing = await this.manuscriptStats(workspace)
      return { files: listing.files, truncated: listing.truncated }
    }

    /** Manuscript files of a novel with their outline chapter, text loaded for search. */
    async searchableManuscripts(workspace, project) {
      const listing = await this.manuscriptStats(workspace)
      const sequence = chapterSequence(project)
      const byFile = new Map()
      for (const volume of project.volumes) {
        for (const chapter of volume.chapters) {
          if (!chapter.manuscriptFile) continue
          const entry = sequence.find(item => item.id === chapter.id && item.volumeId === volume.id)
          if (entry) byFile.set(chapter.manuscriptFile, entry)
        }
      }
      const files = []
      const seen = new Set()
      for (const file of listing.files) {
        if (file.words < 0) continue // larger than the counting limit; not a chapter
        const path = join(listing.root, file.filename)
        seen.add(path)
        const info = await stat(path).catch(() => undefined)
        if (!info?.isFile()) continue
        let cached = this.manuscriptTextCache.get(path)
        if (!cached || cached.size !== info.size || cached.mtimeMs !== info.mtimeMs) {
          cached = { size: info.size, mtimeMs: info.mtimeMs, text: await readFile(path, 'utf8').catch(() => '') }
          this.manuscriptTextCache.set(path, cached)
        }
        files.push({ filename: file.filename, text: cached.text, chapter: byFile.get(file.filename) || null })
      }
      for (const path of this.manuscriptTextCache.keys()) {
        if (path.startsWith(listing.root) && !seen.has(path)) this.manuscriptTextCache.delete(path)
      }
      return { files, truncated: listing.truncated }
    }

    async readManuscript(workspaceId, filename) {
      const workspace = this.workspaceRecord(workspaceId)
      return readWorkspaceManuscript(workspace.path, filename, { maxChars: 4000 })
    }

    /** The knowledge-base scope for one conversation: its linked book's corpus. */
    corpusScopeForAgent(agent) {
      const link = this.linkForAgent(agent)
      if (!link) return null
      const novel = this.novelForAgentSync(agent)
      if (!novel) return null
      let project
      try {
        project = this.stateForWorkspace(novel.id).project
      } catch {
        return null
      }
      const corpusId = project.styleCorpusId || ''
      if (corpusId === 'none') return { writing: false }
      return { corpusId: corpusId || null, source: 'dsh-w-noval-write' }
    }

    async describeCorpusBinding(corpusId) {
      if (corpusId === 'none') return '本书不使用文风素材库。'
      const listing = await this.knowledgeBase.listCorpora()
      const bound = corpusId ? listing.corpora.find(item => item.id === corpusId) : null
      if (corpusId && !bound) return '本书绑定的素材库已不存在，改用知识库当前默认素材库。'
      const corpus = bound || listing.corpora.find(item => item.id === listing.active)
      return `本书使用「${corpus ? corpus.name : '默认'}」素材库${bound ? '' : '（跟随知识库默认）'}。`
    }

    /** Corpora offered by the knowledge base, for the project's corpus picker. */
    async listStyleCorpora() {
      if (!this.knowledgeBase || typeof this.knowledgeBase.listCorpora !== 'function') return { available: false, corpora: [] }
      const listing = await this.knowledgeBase.listCorpora()
      return {
        available: true,
        active: listing.active,
        corpora: listing.corpora.map(item => ({ id: item.id, name: item.name, description: item.description, adult: item.adult, notes: item.notes, active: item.active })),
      }
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
      const host = await this.workspaceForAgent(exec && exec.agent)
      if (!host) throw new Error('novel tools require a conversation attached to a registered Harness Workspace')
      this.ensureMigrated(host)
      const workspace = this.novelForAgentSync(exec && exec.agent)
      if (!workspace) {
        const error = new Error('NOVEL_NOT_BOUND: this conversation has no novel bound. Ask the user to choose or create one in the Novel Writing panel (右侧「小说写作」工作台), then retry. Do not invent project data.')
        error.code = 'NOVEL_NOT_BOUND'
        throw error
      }
      return { workspace, state: this.stateForWorkspace(workspace.id) }
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
          section: { type: 'string', enum: ['all', 'project', 'genreProfile', 'characters', 'relationships', 'volumes', 'threads', 'world', 'plot', 'scene', 'progress'], description: '要读取的部分；默认 all。结构化章节大纲位于 volumes，伏笔账本位于 threads（分析结果请用 novel_threads）。' },
        },
        output: toolOutput('小说设定已读取', { includeValue: true }),
        async execute(args, exec) {
          const { workspace, state } = await self.modelState(exec)
          const section = typeof args?.section === 'string' ? args.section : 'all'
          const contract = novelToolContract()
          if (section === 'all') return { ...self.view(workspace, state), contract }
          if (section === 'project') {
            const { characters, relationships, volumes, threads, world, plot, scene, progress, ...overview } = state.project
            return { workspace: { id: String(workspace.id), title: workspace.title }, revision: state.revision, project: overview, contract }
          }
          return { workspace: { id: String(workspace.id), title: workspace.title }, revision: state.revision, [section]: state.project[section], contract }
        },
      }))

      this.ctx.tools.register(defineTool({
        name: 'novel_save_chapter',
        description: '把已经完成的小说章节正文真实写入当前 Harness Workspace。用户要求创建、生成、保存或导出章节文件时必须调用；只有返回 ok: true 且 verified: true 后才能声称文件已生成。filename 只能是工作区根目录下的单个 .md/.txt 文件名。正文属于大纲中的某一章时，同时传 chapter_id（必要时加 volume_id），大纲会关联这个文件、统计字数，并把尚未开始的章节标为初稿。',
        parameters: {
          filename: { type: 'string', required: true, description: '工作区根目录下的文件名，例如 第1章_测试.md；禁止目录、绝对路径和路径穿越。无扩展名时自动补 .md。' },
          content: { type: 'string', required: true, description: '要落盘的完整章节正文，不是摘要、设定或 JSON。' },
          overwrite: { type: 'boolean', description: '默认 false。已有同名但内容不同的文件时，只有明确需要替换才传 true。' },
          chapter_id: { type: 'string', description: '可选；这份正文对应的大纲章节 id（见 novel_outline_read）。' },
          volume_id: { type: 'string', description: '可选；章节所在的卷 id。chapter_id 在多卷中重复时必填。' },
          chapter_status: { type: 'string', description: '可选；关联后要写入的章节状态，例如 初稿、修改中、定稿。省略时只把未开始的章节改为初稿。' },
        },
        output: toolOutput('小说章节文件已核验', { includeValue: true }),
        finalizeContent: manuscriptFailureContent,
        async execute(args, exec) {
          const { workspace, state } = await self.modelState(exec)
          const chapterId = typeof args?.chapter_id === 'string' ? args.chapter_id.trim() : ''
          // Resolve the chapter before touching the disk so a bad id writes nothing.
          const target = chapterId ? findChapter(state.project, args?.volume_id, chapterId) : null
          const saved = await saveWorkspaceManuscript(workspace.path, {
            filename: args?.filename,
            content: args?.content,
            overwrite: args?.overwrite === true,
          })
          let linked
          if (target) {
            const result = await self.mutateAs({ actor: 'ai', operation: 'novel_save_chapter' }, String(workspace.id), undefined, current => ({
              ...current,
              project: linkChapterManuscript(current.project, target.volume.id, target.chapter.id, saved.filename, { status: args?.chapter_status }),
            }))
            const chapter = findChapter(result.project, target.volume.id, target.chapter.id).chapter
            linked = { volumeId: target.volume.id, chapterId: chapter.id, status: chapter.status, revision: result.revision }
          }
          const listing = await self.manuscriptStats(workspace).catch(() => undefined)
          const words = listing?.files.find(file => file.filename === saved.filename)?.words
          return {
            ok: true,
            ...saved,
            ...(Number.isFinite(words) ? { words } : {}),
            ...(linked ? { linked } : {}),
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
          const result = await self.mutateAs({ actor: 'ai', operation: 'novel_patch' }, String(workspace.id), expectedRevision, current => {
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
          const result = await self.mutateAs({ actor: 'ai', operation: 'novel_character_patch' }, String(workspace.id), expectedRevision, current => ({
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
          const result = await self.mutateAs({ actor: 'ai', operation: 'novel_relationship_patch' }, String(workspace.id), expectedRevision, current => ({
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
          const listing = volumes.some(volume => volume.chapters.some(chapter => chapter.manuscriptFile))
            ? await self.manuscriptStats(workspace).catch(() => undefined)
            : undefined
          const files = new Map((listing?.files || []).map(file => [file.filename, file]))
          const withManuscript = chapter => {
            if (!chapter.manuscriptFile) return chapter
            const file = files.get(chapter.manuscriptFile)
            return { ...chapter, manuscript: file ? { exists: true, words: file.words, bytes: file.bytes, updatedAt: file.updatedAt } : { exists: listing ? false : undefined } }
          }
          const value = volumes.map(volume => {
            if (chapterId) {
              const chapter = volume.chapters.find(item => item.id === chapterId)
              if (!chapter) throw new Error(`unknown chapter '${chapterId}'`)
              return { ...volume, chapters: [withManuscript(chapter)], totalChapters: volume.chapters.length }
            }
            return { ...volume, chapters: volume.chapters.slice(offset, offset + limit).map(withManuscript), totalChapters: volume.chapters.length }
          })
          return { workspace: { id: String(workspace.id), title: workspace.title }, revision: state.revision, volumes: value }
        },
      }))

      this.ctx.tools.register(defineTool({
        name: 'novel_search',
        description: '在这本小说已写的正文里搜索原文（人物、物件、地点、台词、承诺、伤势等），按大纲的卷章顺序返回命中，每条带章节、行号和上下文。写新章要用到前文细节时先搜，不要凭记忆写；order: desc 可以先看最近一次出现。只搜这本书文件夹里的 .md/.txt 正文，未关联大纲的文件排在最后。',
        parameters: {
          query: { type: 'string', required: true, description: '要找的文字。match 为 any/all 时用空格分隔多个词。' },
          match: { type: 'string', enum: ['phrase', 'any', 'all'], description: 'phrase（默认）整句匹配；any 任一词；all 同一行里包含全部词。' },
          from_chapter_id: { type: 'string', description: '可选；只搜这一章及之后（大纲章节 id）。' },
          to_chapter_id: { type: 'string', description: '可选；只搜到这一章为止（大纲章节 id）。' },
          order: { type: 'string', enum: ['asc', 'desc'], description: 'asc（默认）从前往后；desc 从最近往前。' },
          max_results: { type: 'integer', description: '返回的命中行数，默认 40，最多 200。' },
          context_chars: { type: 'integer', description: '命中前后各带多少字，默认 60，最多 200。' },
          case_sensitive: { type: 'boolean', description: '区分英文大小写，默认 false。' },
        },
        output: toolOutput('正文搜索完成', { includeValue: true }),
        async execute(args, exec) {
          const { workspace, state } = await self.modelState(exec)
          const sequence = chapterSequence(state.project)
          const indexOf = (value, field) => {
            const key = typeof value === 'string' ? value.trim() : ''
            if (!key) return undefined
            const found = sequence.find(chapter => chapter.id === key)
            if (!found) throw new Error(`${field} '${key}' is not an outline chapter id; call novel_outline_read`)
            return found.index
          }
          const fromIndex = indexOf(args?.from_chapter_id, 'from_chapter_id')
          const toIndex = indexOf(args?.to_chapter_id, 'to_chapter_id')
          const { files, truncated } = await self.searchableManuscripts(workspace, state.project)
          const result = searchManuscripts(files, {
            query: args?.query,
            match: args?.match,
            order: args?.order,
            maxResults: args?.max_results,
            contextChars: args?.context_chars,
            caseSensitive: args?.case_sensitive,
            fromIndex,
            toIndex,
          })
          return {
            workspace: { id: String(workspace.id), title: workspace.title, folder: workspace.folder },
            ...result,
            ...(truncated ? { note: 'The novel folder has more files than the listing limit; some files were not searched.' } : {}),
            ...(result.totalHits === 0 ? { hint: 'No hits. Try a shorter phrase, an alias, or match: any.' } : {}),
          }
        },
      }))

      this.ctx.tools.register(defineTool({
        name: 'novel_progression_read',
        description: '成长体系：读取这本书的全部体系（如修为境界、炼丹品级、宗门职位、位分、军衔，每套都从低到高排列），以及角色在某一章结束时的状态：各体系里的等级和小阶段、伤势、持有物、已暴露的底牌、最近变化；另有账本警告（跌级/跳级没写原因、引用失效）。写一章前传 as_of_chapter_id 和出场角色的 character_ids；传两个以上角色时，按每套体系返回他们之间的等级差。',
        parameters: {
          as_of_chapter_id: { type: 'string', description: '可选；按这一章结束时的状态计算。默认是已开始写作的最后一章。' },
          character_ids: { type: 'array', items: { type: 'string' }, description: '可选；角色 id 或唯一名字。省略时返回所有有记录的角色。' },
          include_records: { type: 'boolean', description: '同时返回完整记录账本，默认 false。' },
        },
        output: toolOutput('成长体系与角色状态已读取', { includeValue: true }),
        async execute(args, exec) {
          const { workspace, state } = await self.modelState(exec)
          const insight = analyzeProgression(state.project, {
            asOfChapterId: args?.as_of_chapter_id,
            characterIds: Array.isArray(args?.character_ids) ? args.character_ids : undefined,
          })
          return {
            workspace: { id: String(workspace.id), title: workspace.title },
            revision: state.revision,
            ...insight,
            ...(args?.include_records === true ? { records: state.project.progression.records } : {}),
            guidance: insight.active
              ? [
                'Keep each character at the tier and stage shown for every system, and at the condition and holdings shown, unless this chapter changes them.',
                'Beating someone a tier higher needs a cost, a setup or a stated counter. Never reuse an already revealed card as a surprise.',
                'After the chapter, record every change with novel_progression_record (systemId + tierId for a rise or fall); a tier drop or skip needs a note.',
                'Edit systems with novel_patch({ progression: { systems: [...] } }), tiers lowest first; novel_progression_templates lists reusable templates.',
              ]
              : ['This book does not track progression yet. If the user wants it, set progression.enabled or add a system with novel_patch (novel_progression_templates lists templates).'],
          }
        },
      }))

      this.ctx.tools.register(defineTool({
        name: 'novel_progression_templates',
        description: '成长体系：列出可复用的体系模板（内置修仙境界、武侠武学层次、西幻魔法位阶、网游段位、后宫位分、现代军衔，以及用户自建的模板）。给新书建体系时，可以照模板写入 progression.systems。模板库由用户在面板里管理，这个工具只读。',
        parameters: {},
        output: toolOutput('体系模板已读取', { includeValue: true }),
        async execute() {
          return self.readProgressionTemplates()
        },
      }))

      this.ctx.tools.register(defineTool({
        name: 'novel_progression_record',
        description: '成长体系：记录某个角色在某一章的变化。某套体系里升级或降级时传 systemId + tierId（可加 stage）；伤势/状态、持有物、暴露的底牌、得失是角色本身的，不分体系。不传 record_id 就新建一条；传 record_id 就局部修改那一条。角色、章节、体系和等级都必须真实存在。holdings 是本章结束后的完整快照。先 novel_read 并复制 revision。',
        parameters: {
          record_id: { type: 'string', description: '可选；要修改的记录 id。' },
          patch: progressionRecordPatchToolSchema({ required: true }),
          expected_revision: { type: 'integer', required: true },
        },
        output: toolOutput('成长记录已保存'),
        finalizeContent: mutationFailureContent('progression record'),
        async execute(args, exec) {
          const { workspace } = await self.modelState(exec)
          const expectedRevision = assertExpectedRevision(args?.expected_revision)
          let recordId
          const result = await self.mutateAs({ actor: 'ai', operation: 'novel_progression_record' }, String(workspace.id), expectedRevision, current => {
            const next = upsertProgressionRecord(current.project, args?.record_id, args?.patch)
            recordId = next.recordId
            return { ...current, project: next.project }
          })
          return concludeStoppedMutation({ ...result, recordId }, exec)
        },
      }))

      this.ctx.tools.register(defineTool({
        name: 'novel_progression_remove',
        description: '成长体系：删除一条成长记录。只在记录写错或用户要求删除时调用。',
        parameters: {
          record_id: { type: 'string', required: true },
          expected_revision: { type: 'integer', required: true },
        },
        output: toolOutput('成长记录已删除'),
        finalizeContent: mutationFailureContent('progression remove'),
        async execute(args, exec) {
          const { workspace } = await self.modelState(exec)
          const expectedRevision = assertExpectedRevision(args?.expected_revision)
          const result = await self.mutateAs({ actor: 'ai', operation: 'novel_progression_remove' }, String(workspace.id), expectedRevision, current => ({
            ...current,
            project: removeProgressionRecord(current.project, args?.record_id),
          }))
          return concludeStoppedMutation(result, exec)
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
          const result = await self.mutateAs({ actor: 'ai', operation: 'novel_volume_upsert' }, String(workspace.id), expectedRevision, current => ({
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
          const result = await self.mutateAs({ actor: 'ai', operation: 'novel_chapter_upsert' }, String(workspace.id), expectedRevision, current => ({
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
          const result = await self.mutateAs({ actor: 'ai', operation: 'novel_chapter_remove' }, String(workspace.id), expectedRevision, current => ({
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
          const result = await self.mutateAs({ actor: 'ai', operation: 'novel_chapter_reorder' }, String(workspace.id), expectedRevision, current => ({
            ...current,
            project: reorderChapter(current.project, args?.volume_id, args?.chapter_id, args?.target_index),
          }))
          return concludeStoppedMutation(result, exec)
        },
      }))

      this.ctx.tools.register(defineTool({
        name: 'novel_threads',
        description: '读取伏笔/悬念/承诺账本及其时间线分析：当前写到哪一章（按大纲章节状态推断）、哪些线索逾期、本章该回收、即将回收、未规划回收或久未呼应。写某一章之前传 chapter_id，获取这一章需要回收、呼应和避免提前揭示的线索。',
        parameters: {
          chapter_id: { type: 'string', description: '可选；准备撰写或修改的大纲章节 id。' },
          include: { type: 'string', enum: ['active', 'all'], description: '默认 active，只返回进行中（open/partial）的线索；all 包含已回收和放弃的。' },
        },
        output: toolOutput('线索账本已读取', { includeValue: true }),
        async execute(args, exec) {
          const { workspace, state } = await self.modelState(exec)
          const project = state.project
          const insight = analyzeThreads(project)
          const byId = new Map(project.threads.map(thread => [thread.id, thread]))
          const includeAll = args?.include === 'all'
          const threads = insight.threads
            .filter(info => includeAll || info.active)
            .sort((a, b) => compareThreadUrgency(a, b, byId))
            .map(info => ({ ...byId.get(info.id), insight: info }))
          const chapterId = typeof args?.chapter_id === 'string' ? args.chapter_id.trim() : ''
          return {
            workspace: { id: String(workspace.id), title: workspace.title },
            revision: state.revision,
            currentChapter: insight.currentChapter,
            counts: insight.counts,
            threads,
            ...(chapterId ? { chapterFocus: threadsForChapter(project, chapterId) } : {}),
            guidance: [
              'Pay off overdue and due threads in the chapter being written, or deliberately move plannedPayoffChapterId.',
              'Keep every truth hidden until its payoff chapter; knownByIds lists the characters who already know it.',
              'Echo idle threads so readers do not forget them; record echoes with novel_thread_upsert add_beat.',
            ],
          }
        },
      }))

      this.ctx.tools.register(defineTool({
        name: 'novel_thread_upsert',
        description: '按稳定 id 创建或局部更新一条伏笔/悬念/承诺线索。新线索必须有 title。章节字段只能填 novel_outline_read 返回的大纲章节 id；角色字段填角色 id。add_beat 追加一次中途呼应。回收时设置 status: resolved、resolvedChapterId 和 resolution。先 novel_read 并复制 revision。',
        parameters: {
          thread_id: { type: 'string', required: true, description: '稳定线索 id，例如 obituary-author；不存在则创建。' },
          patch: threadPatchToolSchema({ required: false }),
          add_beat: {
            type: 'object',
            additionalProperties: false,
            description: '可选；追加一次中途呼应。',
            properties: {
              chapter_id: { type: 'string', description: '呼应所在的大纲章节 id。' },
              note: { type: 'string', required: true, description: '这一章如何呼应这条线索。' },
            },
          },
          expected_revision: { type: 'integer', required: true },
        },
        output: toolOutput('线索已保存'),
        finalizeContent: mutationFailureContent('thread patch'),
        async execute(args, exec) {
          const { workspace } = await self.modelState(exec)
          const expectedRevision = assertExpectedRevision(args?.expected_revision)
          const addBeat = args?.add_beat ? { chapterId: args.add_beat.chapter_id, note: args.add_beat.note } : undefined
          const result = await self.mutateAs({ actor: 'ai', operation: 'novel_thread_upsert' }, String(workspace.id), expectedRevision, current => ({
            ...current,
            project: upsertThread(current.project, args?.thread_id, args?.patch, { addBeat }),
          }))
          return concludeStoppedMutation(result, exec)
        },
      }))

      this.ctx.tools.register(defineTool({
        name: 'novel_thread_remove',
        description: '从账本中删除一条线索。只在用户明确要求删除时调用；放弃的线索应改为 status: dropped 而不是删除。',
        parameters: {
          thread_id: { type: 'string', required: true },
          expected_revision: { type: 'integer', required: true },
        },
        output: toolOutput('线索已删除'),
        finalizeContent: mutationFailureContent('thread remove'),
        async execute(args, exec) {
          const { workspace } = await self.modelState(exec)
          const expectedRevision = assertExpectedRevision(args?.expected_revision)
          const result = await self.mutateAs({ actor: 'ai', operation: 'novel_thread_remove' }, String(workspace.id), expectedRevision, current => ({
            ...current,
            project: removeThread(current.project, args?.thread_id),
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
          // A complete rewrite that leaves threads or progression out must not wipe those ledgers.
          const keepsThreads = !Object.hasOwn(args.project, 'threads')
          const keepsProgression = !Object.hasOwn(args.project, 'progression')
          const result = await self.mutateAs({ actor: 'ai', operation: 'novel_write' }, String(workspace.id), expectedRevision, current => {
            const project = normalizeProject(args?.project)
            if (args?.replace_progress !== true) project.progress = current.project.progress
            if (keepsThreads) project.threads = current.project.threads
            if (keepsProgression) project.progression = current.project.progression
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
          open_threads: { type: 'string', description: '仍待回收的伏笔、承诺或冲突的简述；结构化的线索账本请用 novel_thread_upsert 维护。' },
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
          const result = await self.mutateAs({ actor: 'ai', operation: 'novel_advance' }, String(workspace.id), expectedRevision, current => ({
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
