/** Keyless compatible-provider round trip through the built dsh SDK profile. */
import { createServer, type Server } from 'node:http'
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { Context } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'
import CredentialsLocal from '@deepseek-ai/dsh-credentials-local'
import { afterEach, expect, it, vi } from 'vitest'
import { Studio } from '../src/studio.ts'
import { Config } from '../src/index.ts'
import { createExecutor } from '../src/executor.ts'
import { teamTemplate } from '../src/templates.ts'
import type { StudioConfig, StudioState } from '../src/types.ts'

let root: string | undefined
let ctx: Context | undefined
let studio: Studio | undefined
let server: Server | undefined
afterEach(async () => {
  await studio?.close()
  await ctx?.fiber.dispose()
  if (server) await new Promise<void>((done, reject) => server!.close((error) => {
    if (error) reject(error)
    else done()
  }))
  if (root) await rm(root, { recursive: true, force: true })
  studio = undefined; ctx = undefined; server = undefined; root = undefined
})

it('sends GLM model and thinking settings, executes native Harness tools, and excludes private reasoning from handoffs', async () => {
  root = await mkdtemp(join(tmpdir(), 'dsh-studio-compatible-'))
  const cwd = join(root, 'workspace')
  await mkdir(cwd)
  const requests: { model: string; thinking?: unknown; messages: { role: string; content?: unknown }[]; tools: unknown[] }[] = []
  server = createServer((request, response) => {
    let body = ''
    request.on('data', (chunk: Buffer) => { body += chunk.toString() })
    request.on('end', () => {
      try {
        const parsed = JSON.parse(body) as typeof requests[number]
        requests.push(parsed)
        const usedTool = parsed.messages.some(message => message.role === 'tool')
        const delta = usedTool ? { content: JSON.stringify({ message: 'Implemented and verified the GLM employee document.', files: ['result.md'], handoffs: [] }) }
          : { tool_calls: [{ index: 0, id: 'call_write', type: 'function', function: { name: 'write', arguments: JSON.stringify({ file_path: 'result.md', content: '# GLM result\nProduct implementation completed.\n' }) } }] }
        response.writeHead(200, { 'content-type': 'text/event-stream' })
        const events = [
          { choices: [{ index: 0, delta: { role: 'assistant', reasoning_content: 'PRIVATE_REASONING_SENTINEL' }, finish_reason: null }] },
          { choices: [{ index: 0, delta, finish_reason: null }] },
          { choices: [{ index: 0, delta: {}, finish_reason: usedTool ? 'stop' : 'tool_calls' }], usage: { prompt_tokens: 30, completion_tokens: 20 } },
        ]
        for (const event of events) response.write(`data: ${JSON.stringify(event)}\n\n`)
        response.end('data: [DONE]\n\n')
      } catch { response.writeHead(500); response.end('Invalid mock request') }
    })
  })
  await new Promise<void>(done => server!.listen(0, '127.0.0.1', done))
  const address = server.address()
  if (!address || typeof address === 'string') throw new Error('Missing mock port')
  const keyPath = join(root, 'credentials.yaml')
  await writeFile(keyPath, 'STUDIO_COMPATIBLE_TEST_KEY: fixture-only-key\n', { mode: 0o600 })
  ctx = new Context()
  await ctx.plugin(CredentialsLocal, { path: keyPath, watch: false })
  const config = z.resolve({ storageRoot: join(root, 'studio'), dshBin: resolve('apps/cli/lib/bin.js') }, Config, {})[0] as StudioConfig
  const executor = createExecutor(ctx, config)
  studio = await Studio.open(config, executor)
  const command = (action: string, input: unknown): Promise<StudioState> => studio!.command({
    action, input, expectedRevision: studio!.snapshot().revision,
  })
  const employee = { ...teamTemplate('lean')[0]!, engine: 'compatible', model: 'glm-fixture', effort: 'high',
    baseURL: `http://127.0.0.1:${address.port}/v1`, apiKeyEnv: 'STUDIO_COMPATIBLE_TEST_KEY', thinkingFormat: 'zai', maxTokens: 1024 }
  await command('saveEmployee', employee)
  const company = await command('createWorkspace', { name: 'Company', path: cwd })
  const created = await command('createProject', { name: 'Compatible delivery', objective: 'Write result.md and summarize the completed work.', cwd, workspaceId: company.activeWorkspaceId, acceptanceCriteria: 'Verified delivery', sessionMode: 'employee-project', employeeIds: [employee.id] })
  const task = created.tasks[0]!
  await command('editTask', { id: task.id, task: { projectId: task.projectId, employeeId: task.employeeId,
    title: task.title, instruction: task.instruction, dependsOn: task.dependsOn, outputFiles: ['result.md'] } })
  await command('startProject', { id: created.projects[0]!.id })
  await vi.waitFor(() =>{  expect(['completed', 'failed']).toContain(studio!.snapshot().tasks[0]!.status) }, { timeout: 60000 })
  expect(studio.snapshot().tasks[0]!.error).toBe('')
  expect(studio.snapshot().tasks[0]!.status).toBe('completed')
  expect(requests).toHaveLength(2)
  expect(requests[0]).toMatchObject({ model: 'glm-fixture', thinking: { type: 'enabled' } })
  expect(requests[0]!.tools.length).toBeGreaterThan(0)
  expect(await readFile(join(cwd, 'result.md'), 'utf8')).toContain('Product implementation completed')
  expect(studio.snapshot().tasks[0]!.result).toBe('Implemented and verified the GLM employee document.')
  expect(JSON.stringify(studio.snapshot())).not.toContain('PRIVATE_REASONING_SENTINEL')
  expect(JSON.stringify(studio.snapshot())).not.toContain('fixture-only-key')
  const session = studio.snapshot().tasks[0]!.nativeSessions[0]!
  await command('createTask', { projectId: task.projectId, employeeId: task.employeeId, title: 'Continue the same provider session',
    instruction: 'Summarize the previous result without editing files.', dependsOn: [task.id], outputFiles: [] })
  await command('startProject', { id: task.projectId })
  await vi.waitFor(() => { expect(['completed', 'failed']).toContain(studio!.snapshot().tasks[1]!.status) }, { timeout: 60000 })
  expect(studio.snapshot().tasks[1]!.error).toBe('')
  expect(studio.snapshot().tasks[1]!.nativeSessions[0]).toMatchObject({ id: session.id, continued: true })
  expect(requests).toHaveLength(3)
  expect(requests[2]!.messages.some(message => message.role === 'tool')).toBe(true)
  expect(JSON.stringify(studio.snapshot())).not.toContain('PRIVATE_REASONING_SENTINEL')
})
