/** Native CLI and isolated Harness execution; only final handoffs leave the child. */
import { mkdtemp, readFile, writeFile, rm, mkdir, stat } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { randomUUID } from 'node:crypto'
import { StringDecoder } from 'node:string_decoder'
import type { Readable } from 'node:stream'
import type { Context } from '@deepseek-ai/cordis'
import { credentialRef } from '@deepseek-ai/dsh-credentials'
import { DeepSeekHarness } from '@deepseek-ai/dsh-sdk-client'
import { scrubbedParentEnv } from '@deepseek-ai/dsh-subprocess'
import type { ReasoningEffortId } from '@deepseek-ai/dsh-llm'
import type { Employee, StudioEmployeeId, EmployeeResult, Project, StudioConfig, StudioExecutor, StudioHealth, Task, StudioExecution, StudioNativeSessionId } from './types.ts'
import { outputName } from './validation.ts'

const resultSchema = {
  type: 'object', additionalProperties: false,
  properties: {
    message: { type: 'string' }, files: { type: 'array', items: { type: 'string' } },
    handoffs: { type: 'array', items: { type: 'object', additionalProperties: false,
      properties: { employeeId: { type: 'string' }, message: { type: 'string' } }, required: ['employeeId', 'message'] } },
  }, required: ['message', 'files', 'handoffs'],
}

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

async function nativeThread(stream: Readable, maxBytes: number): Promise<StudioNativeSessionId | null> {
  const decoder = new StringDecoder('utf8')
  let line = ''
  let dropping = false
  let id: StudioNativeSessionId | null = null
  for await (const chunk of stream) {
    const text = decoder.write(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk as string))
    for (const part of text.split(/(?<=\n)/)) {
      if (!dropping) line += part
      if (Buffer.byteLength(line) > maxBytes) { line = ''; dropping = true }
      if (part.endsWith('\n')) {
        if (!dropping && !id) {
          let event: unknown
          try { event = JSON.parse(line) }
          catch { /* Native progress lines without JSON carry no session identity. */ }
          if (record(event) && event.type === 'thread.started' && typeof event.thread_id === 'string') id = event.thread_id as StudioNativeSessionId
        }
        line = ''; dropping = false
      }
    }
  }
  return id
}

/** Admit final structured fields without copying reasoning or protocol metadata.
 * @param text - Native final response, never a progress stream.
 * @param maxBytes - Maximum complete handoff size.
 * @returns Human-readable final handoff and declared files.
 */
export function finalHandoff(text: string, maxBytes: number): EmployeeResult {
  if (Buffer.byteLength(text) > maxBytes) throw new Error('Final handoff exceeds the configured text limit')
  let parsed: unknown
  try { parsed = JSON.parse(text.replace(/^```(?:json)?\s*|\s*```$/g, '')) }
  catch { return { message: text, files: [], handoffs: [] } }
  if (!record(parsed) || typeof parsed.message !== 'string' || !Array.isArray(parsed.files) || !Array.isArray(parsed.handoffs)) {
    throw new Error('Final handoff must contain message, files, and handoffs')
  }
  const files = parsed.files.map((value) => {
    if (typeof value !== 'string') throw new Error('Final file names must be strings')
    return outputName(value)
  })
  const handoffs = parsed.handoffs.map((value) => {
    if (!record(value) || typeof value.employeeId !== 'string' || typeof value.message !== 'string') throw new Error('Final handoff recipients and messages must be strings')
    return { employeeId: value.employeeId as StudioEmployeeId, message: value.message }
  })
  return { message: parsed.message, files, handoffs }
}

/** One owner of native subprocesses and SDK children.
 * @param ctx - Subprocess and credential services.
 * @param config - Validated paths and deployment limits.
 * @returns Executor plus version probes.
 */
export function createExecutor(ctx: Context, config: StudioConfig): StudioExecutor & { health(): Promise<StudioHealth> } {
  const nativeEnvironment = async (employee: Employee): Promise<NodeJS.ProcessEnv> => {
    const env: NodeJS.ProcessEnv = {}
    const references = employee.apiKeyEnv ? [employee.apiKeyEnv] : employee.engine === 'claude'
      ? ['ANTHROPIC_API_KEY', 'ANTHROPIC_AUTH_TOKEN', 'CLAUDE_CODE_OAUTH_TOKEN'] : ['OPENAI_API_KEY']
    for (const reference of references) {
      const credential = await ctx.credentials.resolve(credentialRef(reference))
      if (credential !== undefined) env[reference] = credential.value
    }
    return env
  }
  const probe = async (argv: string[]): Promise<{ available: boolean; version: string }> => {
    try {
      const child = ctx.subprocess.spawn({ argv: [...argv, '--version'], cwd: process.cwd(),
        stdio: { stdin: 'ignore', stdout: { maxBytes: config.maxTextBytes }, stderr: { maxBytes: config.maxTextBytes } },
        signal: AbortSignal.timeout(config.disposeGraceMs * 4), graceMs: config.disposeGraceMs })
      const outcome = await child.done
      return { available: outcome.exitCode === 0, version: child.collected.stdout?.readFrom(0).text.trim() ?? '' }
    } catch { return { available: false, version: 'Executable unavailable' } }
  }
  return {
    async health() {
      const [claude, codex] = await Promise.all([probe(config.claudeCommand), probe(config.codexCommand)])
      const harness = await stat(config.dshBin).then(value => ({ available: value.isFile(), version: 'Local Harness SDK' }),
        () => ({ available: false, version: 'Build the dsh CLI first' }))
      return { claude, codex, harness }
    },
    async run(employee: Employee, project: Project, task: Task, signal: AbortSignal, execution: StudioExecution): Promise<EmployeeResult> {
      const cwd = employee.cwd || project.cwd
      const env = await nativeEnvironment(employee)
      signal.throwIfAborted()
      if (employee.engine === 'harness' || employee.engine === 'compatible') {
        const home = resolve(config.storageRoot, 'employees', employee.id)
        await mkdir(home, { recursive: true, mode: 0o700 })
        const patches: string[] = []
        const permissionPatch = join(home, 'permissions.patch.json')
        await writeFile(permissionPatch, JSON.stringify([
          { id: 'sdk-jsonrpc-server', config: { resumePersistedSessions: true } },
          { id: 'sandbox-policy', config: { mode: employee.permission === 'full-access' ? 'danger-full-access' : employee.permission, workspaceRoot: cwd } },
          { id: 'approval', config: { policy: employee.permission === 'full-access' ? 'never' : 'ask' } },
        ]), { mode: 0o600 })
        patches.push(permissionPatch)
        if (employee.engine === 'compatible') {
          if (!env[employee.apiKeyEnv]) throw new Error(`Missing credential reference: ${employee.apiKeyEnv}`)
          const path = join(home, 'provider.patch.json')
          await writeFile(path, JSON.stringify([{ id: 'llm-pi-ai', config: { providers: {
            'studio-provider': { api: 'openai-completions', baseURL: employee.baseURL, apiKeyEnv: employee.apiKeyEnv,
              ...(employee.thinkingFormat === 'none' ? {} : { compat: { thinkingFormat: employee.thinkingFormat } }),
              models: [{ id: employee.model, name: employee.model, contextWindow: employee.contextWindow,
                maxTokens: employee.maxTokens, reasoningEfforts: employee.effort ? { [employee.effort]: employee.effort } : false }],
            },
          } } }]), { mode: 0o600 })
          patches.push(path)
        } else {
          const credential = await ctx.credentials.resolve(credentialRef(employee.apiKeyEnv || 'DEEPSEEK_API_KEY'))
          if (credential !== undefined) env.DEEPSEEK_API_KEY = credential.value
        }
        const harness = new DeepSeekHarness({ dshBin: config.dshBin, dshHome: home, profile: 'sdk', patches,
          cwd, processCwd: cwd, env: { ...scrubbedParentEnv(), ...env },
          provider: employee.engine === 'compatible' ? 'studio-provider' : 'deepseek-official',
          ...(employee.model ? { model: employee.model } : {}),
          ...(employee.effort ? { reasoningEffort: employee.effort as ReasoningEffortId } : {}),
          maxTokens: employee.maxTokens, initializeTimeoutMs: config.disposeGraceMs * 20,
          disposeGraceMs: config.disposeGraceMs,
        })
        const cancel = (): void => {
          // The finally block awaits close and reports any teardown failure.
          void harness.close().catch(() => {})
        }
        signal.addEventListener('abort', cancel, { once: true })
        try {
          signal.throwIfAborted()
          const sessionId = execution.resumeSessionId ?? randomUUID()
          const result = await harness.run(task.assignment, { sessionId })
          await execution.recordSession(result.sessionId as StudioNativeSessionId)
          const reason = result.events.findLast(event => event.type === 'turn/end')
          if (reason?.type !== 'turn/end' || reason.data.reason.kind !== 'completed') throw new Error(`Harness task ended: ${reason?.type === 'turn/end' ? reason.data.reason.kind : 'missing completion'}`)
          return finalHandoff(result.finalResponse, config.maxTextBytes)
        } finally {
          signal.removeEventListener('abort', cancel)
          await harness.close()
        }
      }
      const privateRoot = join(config.storageRoot, 'native-runs')
      await mkdir(privateRoot, { recursive: true, mode: 0o700 })
      const dir = await mkdtemp(join(privateRoot, 'run-'))
      try {
        const schemaPath = join(dir, 'result-schema.json')
        const resultPath = join(dir, 'final.json')
        await writeFile(schemaPath, JSON.stringify(resultSchema), { flag: 'wx', mode: 0o600 })
        const argv = employee.engine === 'claude' ? [
          ...config.claudeCommand, '--print', '--output-format', 'json', '--json-schema', JSON.stringify(resultSchema),
          '--permission-mode', employee.permission === 'read-only' ? 'plan' : employee.permission === 'full-access' ? 'bypassPermissions' : 'acceptEdits',
        ] : [
          ...config.codexCommand, 'exec', '--sandbox', employee.permission === 'full-access' ? 'danger-full-access' : employee.permission,
          ...(execution.resumeSessionId ? ['resume', execution.resumeSessionId] : []), '--skip-git-repo-check', '--json',
          '-c', 'approval_policy="never"', '--output-schema', schemaPath, '--output-last-message', resultPath,
        ]
        const claudeSession = execution.resumeSessionId ?? randomUUID()
        if (employee.engine === 'claude') argv.push(...(execution.resumeSessionId ? ['--resume', claudeSession] : ['--session-id', claudeSession, '--name', `${project.name} · ${employee.name}`]))
        if (employee.model) argv.push(employee.engine === 'claude' ? '--model' : '-m', employee.model)
        if (employee.effort) argv.push(...(employee.engine === 'claude'
          ? ['--effort', employee.effort] : ['-c', `model_reasoning_effort="${employee.effort}"`]))
        if (employee.engine === 'codex') argv.push('-')
        const child = ctx.subprocess.spawn({ argv, cwd, env, signal, graceMs: config.disposeGraceMs,
          stdio: { stdin: { data: task.assignment }, stdout: employee.engine === 'codex' ? 'pipe' : { maxBytes: config.maxTextBytes * 2 },
            stderr: { maxBytes: config.maxTextBytes } } })
        const thread = employee.engine === 'codex' && child.stdout ? nativeThread(child.stdout, config.maxTextBytes) : Promise.resolve(null)
        // Joining the stream below owns rejection; attach immediately while the process exits.
        void thread.catch(() => {})
        const outcome = await (async () => {
          try { return await child.done }
          finally {
            child.terminate()
            if (!await child.waitForExit(AbortSignal.timeout(config.disposeGraceMs * 4))) throw new Error(`${employee.engine} process cleanup did not complete`)
            await thread
          }
        })()
        const codexSession = await thread
        if (codexSession) await execution.recordSession(codexSession)
        signal.throwIfAborted()
        if (outcome.exitCode !== 0) throw new Error(`${employee.engine} exited with code ${String(outcome.exitCode)}. Check native login, model, effort, and permissions.`)
        if (employee.engine === 'codex') return finalHandoff(await readFile(resultPath, 'utf8'), config.maxTextBytes)
        const raw: unknown = JSON.parse(child.collected.stdout?.readFrom(0).text ?? '')
        if (!record(raw) || raw.is_error === true) throw new Error('Claude Code did not complete the task. Check native login and permissions.')
        if (typeof raw.session_id !== 'string' || raw.session_id !== claudeSession) throw new Error('Claude Code returned an unexpected session identity')
        await execution.recordSession(raw.session_id as StudioNativeSessionId)
        const final = raw.structured_output !== undefined ? JSON.stringify(raw.structured_output) : raw.result
        if (typeof final !== 'string') throw new Error('Claude Code returned no final handoff')
        return finalHandoff(final, config.maxTextBytes)
      } finally {
        await rm(dir, { recursive: true, force: true })
      }
    },
  }
}
