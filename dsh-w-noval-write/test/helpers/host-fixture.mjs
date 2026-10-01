import assert from 'node:assert/strict'
import * as crypto from 'node:crypto'
import * as fs from 'node:fs'
import * as fsp from 'node:fs/promises'
import { tmpdir } from 'node:os'
import * as path from 'node:path'
import vm from 'node:vm'
import * as core from '../../noval-write-core.js'
import * as files from '../../noval-file-core.js'
import * as library from '../../noval-library.js'
import * as search from '../../noval-search-core.js'
import * as guard from '../../noval-mutation-guard.js'
import * as completion from '../../noval-completion-guard.js'

// Exercise the actual Host methods and filesystem; only Harness registration
// and decorators are stubbed, so no profile, model or user session is loaded.
export async function hostFixture(t) {
  const root = await fsp.mkdtemp(path.join(tmpdir(), 'dsh-novel-host-test-'))
  t.after(async () => {
    const target = path.resolve(root)
    assert.equal(path.dirname(target), path.resolve(tmpdir()))
    assert.ok(path.basename(target).startsWith('dsh-novel-host-test-'))
    await fsp.rm(target, { recursive: true, force: true })
  })
  const workspace = { id: 'w', title: 'Workspace', path: path.join(root, 'workspace'), sessionIds: ['s'] }
  await fsp.mkdir(workspace.path)
  const registry = { get: id => id === workspace.id ? workspace : undefined, list: () => [workspace] }
  const tools = []
  const handlers = new Map()
  const sections = []
  const ctx = { tools: { register: value => tools.push(value) }, on: (name, handler) => handlers.set(name, handler),
    inject(deps, callback) { if (deps.includes('systemPrompt')) callback({ systemPrompt: { section: section => sections.push(section) } }) },
    get: () => registry, logger: () => ({ warn() {}, info() {} }) }
  const schema = new Proxy(function () { return schema }, { get() { return schema } })
  const context = vm.createContext({
    ...crypto, ...fs, ...fsp, ...path, ...core, ...files, ...library, ...search, ...guard, ...completion,
    console, process, Buffer, Schema: schema, Remote: () => method => method,
    TypertRemoteService: class { constructor(scope) { this.ctx = scope } },
    createUserMessage: value => value, defineTool: value => value,
    dshHomePath: (...parts) => path.join(root, ...parts), expandHomePath: value => value,
  })
  const source = fs.readFileSync(new URL('../../index.js', import.meta.url), 'utf8')
    .replace(/^import[\s\S]*?from '[^']+'\r?\n/gm, '')
    .replace(/^export const /gm, 'const ')
    .replace(/^export \{[^\n]+\}\r?$/gm, '')
  vm.runInContext(source + '\nglobalThis.Service = NovalWriterService', context)
  const service = new context.Service(ctx, { root: path.join(root, 'data') })
  service.workspaceRegistry = registry
  const created = await service.createNovel('s', 'w', { title: 'Book' })
  const handle = created.created.handle
  const book = service.workspaceRecord(handle)
  const tool = tools.find(value => value.name === 'novel_save_chapter')
  return { root, workspace, book, handle, service, context, tools, tool, handlers, sections,
    execute: args => tool.execute(args, { agent: { session: { id: 's' } } }),
    setProject: project => service.mutateAs({ actor: 'user', operation: 'fixture' }, handle, service.stateForWorkspace(handle).revision, current => ({ ...current, project: core.normalizeProject(project) })),
  }
}
