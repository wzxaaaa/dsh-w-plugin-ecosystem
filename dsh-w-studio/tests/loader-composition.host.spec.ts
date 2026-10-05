/** Real Loader, authenticated HTTP, and managed native process composition. */
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { Context } from '@deepseek-ai/cordis'
import Loader from '@deepseek-ai/cordis-plugin-loader'
import Include from '@deepseek-ai/cordis-plugin-include'
import WebServer from '@deepseek-ai/dsh-host-webserver'
import CredentialsLocal from '@deepseek-ai/dsh-credentials-local'
import SubprocessLocal from '@deepseek-ai/dsh-subprocess-local'
import LlmRuntime from '@deepseek-ai/dsh-llm'
import * as Connection from '@deepseek-ai/dsh-client-connection'
import { afterEach, expect, it, vi } from 'vitest'
import z from '@deepseek-ai/schemastery'
import * as StudioPlugin from '../src/index.ts'
import * as ModelDirectory from './fixtures/model-directory.ts'
import { modelCatalog } from '../src/catalog.ts'
import type { StudioConfig } from '../src/types.ts'
import type { StudioState } from '../src/types.ts'

let root: string | undefined
let ctx: Context | undefined
afterEach(async () => {
  await ctx?.fiber.dispose()
  ctx = undefined
  if (root) await rm(root, { recursive: true, force: true })
  root = undefined
})

it('runs native employees through cordis.yml without leaking private progress into the HTTP journal', async () => {
  root = await mkdtemp(join(tmpdir(), 'dsh-studio-loader-'))
  const cwd = join(root, 'workspace')
  await mkdir(cwd)
  const native = fileURLToPath(new URL('./fixtures/native.mjs', import.meta.url))
  const plugins = new Map<string, unknown>([
    ['webServer', WebServer], ['credentials', CredentialsLocal], ['connection', Connection],
    ['subprocess', SubprocessLocal], ['llm', LlmRuntime], ['directory', ModelDirectory], ['studio', StudioPlugin],
  ])
  const configuration = [
    { name: 'webServer', config: { host: '127.0.0.1', port: 0 } },
    { name: 'credentials', config: { dshHome: root, watch: false } },
    { name: 'connection' }, { name: 'subprocess' }, { name: 'llm' }, { name: 'directory' },
    { name: 'studio', config: { storageRoot: join(root, 'store'), dshBin: join(root, 'dsh.js'),
      claudeCommand: [process.execPath, native, 'claude'], codexCommand: [process.execPath, native, 'codex'],
      maxRequestBytes: 4096 } },
  ]
  const path = join(root, 'cordis.yml')
  await writeFile(path, JSON.stringify(configuration))
  ctx = new Context()
  ctx.baseUrl = `${pathToFileURL(root).href}/`
  await ctx.plugin(Loader)
  ctx.loader.builtins.include = Include
  ctx.loader.internal = { version: 'v2', async import(name: string) {
    if (!plugins.has(name)) throw new Error(`Unexpected fixture plugin: ${name}`)
    return plugins.get(name)
  } } as unknown as NonNullable<typeof ctx.loader.internal>
  await ctx.loader.create({ name: 'cordis:include', config: { path: pathToFileURL(path).href } })
  await ctx.loader.await()
  expect([...ctx.loader.entries()].filter(entry => !entry.disabled && !entry.fiber)).toEqual([])
  const origin = `http://127.0.0.1:${ctx.webServer.port}`
  expect((await fetch(`${origin}/api/studio/state`)).status).toBe(401)
  let cookie = ''
  const accepted = ctx.connection.authorizeIndex({ method: 'GET', url: ctx.connection.authenticatedUrl(origin), headers: { host: new URL(origin).host } }, {
    writeHead(_status, headers) { cookie = headers?.['set-cookie']?.split(';')[0] ?? '' }, end() {},
  })
  expect(accepted).toBe(false)
  expect(cookie).not.toBe('')
  const request = (path: string, init?: RequestInit) => {
    const headers = new Headers({ cookie, origin })
    new Headers(init?.headers).forEach((value, key) => { headers.set(key, value) })
    return fetch(`${origin}/api/studio/${path}`, { ...init, headers })
  }
  const state = async (): Promise<StudioState> => (await (await request('state')).json() as { state: StudioState }).state
  const command = async (action: string, input: unknown): Promise<StudioState> => {
    const current = await state()
    const response = await request('command', { method: 'POST', body: JSON.stringify({ action, input, expectedRevision: current.revision }) })
    expect(response.status).toBe(200)
    return (await response.json() as { state: StudioState }).state
  }
  expect((await request('state', { headers: { origin: 'https://untrusted.example' } })).status).toBe(403)
  expect((await request('command', { method: 'POST', body: 'x'.repeat(4097) })).status).toBe(413)
  const catalog: unknown = await (await request('catalog')).json()
  expect(catalog).toMatchObject({ claudeError: '', claude: [
    { id: 'sonnet', name: 'Sonnet fixture', efforts: ['low', 'high'] },
    { id: 'opus', name: 'Opus fixture', efforts: ['high', 'max'] },
  ] })
  expect(JSON.stringify(catalog)).not.toContain('PRIVATE_REASONING_SENTINEL')
  await writeFile(join(root, 'models_cache.json'), JSON.stringify({ models: [
    { slug: 'model-one', display_name: 'First model', supported_reasoning_levels: [{ effort: 'low' }], private_prompt: 'PRIVATE_REASONING_SENTINEL' },
    { slug: 'model-two', display_name: 'Second model', supported_reasoning_levels: [{ effort: 'high' }] },
    { slug: 'internal-review', visibility: 'hide' },
  ] }))
  const discoveryConfig = z.resolve({ dshBin: join(root, 'dsh.js'), claudeCommand: [process.execPath, native, 'claude', '--catalog-failure'] }, StudioPlugin.Config, {})[0] as StudioConfig
  const partial = await modelCatalog(ctx, root, discoveryConfig)
  expect(partial.codex).toEqual([
    { id: 'model-one', name: 'First model', efforts: ['low'], imageInput: null },
    { id: 'model-two', name: 'Second model', efforts: ['high'], imageInput: null },
  ])
  expect(partial.claude).toEqual([])
  expect(partial.claudeError).toContain('Claude model discovery failed')
  expect(JSON.stringify(partial)).not.toContain('PRIVATE_REASONING_SENTINEL')
  const roster = (await command('template', { kind: 'lean' })).employees.slice(0, 2)
  for (const employee of roster) await command('saveEmployee', { ...employee, model: employee.engine === 'codex' ? 'fixture-codex' : 'fixture-claude', effort: 'high' })
  const company = await command('createWorkspace', { name: 'Company', path: cwd })
  const created = await command('createProject', { name: 'Native delivery', objective: 'Deliver a document', cwd, workspaceId: company.activeWorkspaceId, acceptanceCriteria: 'Verified delivery', sessionMode: 'employee-project', employeeIds: roster.map(e => e.id) })
  await command('startProject', { id: created.projects[0]!.id })
  await vi.waitFor(async () =>{  expect((await state()).projects[0]!.status).toBe('review') }, { timeout: 15000 })
  const final = await state()
  expect(JSON.stringify(final)).not.toContain('PRIVATE_REASONING_SENTINEL')
  expect(final.tasks[1]!.assignment).toContain('codex finished. Please use the product document.')
  const invocation = async (engine: string) => JSON.parse(await readFile(join(cwd, `${engine}-invocation.json`), 'utf8')) as { args: string[] }
  expect((await invocation('codex')).args).toEqual(expect.arrayContaining(['-m', 'fixture-codex', 'model_reasoning_effort="high"', '--sandbox', 'workspace-write']))
  expect((await invocation('claude')).args).toEqual(expect.arrayContaining(['--model', 'fixture-claude', '--effort', 'high', '--permission-mode', 'acceptEdits']))
  const sessions = final.tasks.map(task => task.nativeSessions[0]!.id)
  for (const task of final.tasks) await command('createTask', { projectId: task.projectId, employeeId: task.employeeId,
    title: 'Continue private context', instruction: 'Use your own prior session.', dependsOn: [task.id], outputFiles: [] })
  await command('startProject', { id: created.projects[0]!.id })
  await vi.waitFor(async () => { expect((await state()).tasks.every(task => task.status === 'completed')).toBe(true) }, { timeout: 15000 })
  const continued = (await state()).tasks.slice(2)
  expect(continued.map(task => task.nativeSessions[0]!.id)).toEqual(sessions)
  expect(continued.every(task => task.nativeSessions[0]!.continued)).toBe(true)
  expect((await invocation('codex')).args).toEqual(expect.arrayContaining(['resume', sessions[0], '--sandbox', 'workspace-write']))
  expect((await invocation('claude')).args).toEqual(expect.arrayContaining(['--resume', sessions[1]]))
  expect(JSON.stringify(await state())).not.toContain('PRIVATE_REASONING_SENTINEL')
  const artifact = final.artifacts.find(file => file.name !== 'handoff.md')!
  expect(await (await request(`artifact?id=${artifact.id}`)).text()).toContain('Product document')
  expect(await (await request('health')).json()).toMatchObject({ codex: { available: true }, claude: { available: true } })
  const studio = [...ctx.loader.entries()].find(entry => entry.options.name === 'studio')!
  await studio.fiber!.dispose()
  expect((await request('state')).status).toBe(404)
})
