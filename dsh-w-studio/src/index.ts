/** Opt-in Studio Host plugin on the authenticated Web Connection carrier. */
import { dirname, resolve } from 'node:path'
import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import type { Context } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'
import { resolveDshHome } from '@deepseek-ai/dsh-home-paths'
import type {} from '@deepseek-ai/dsh-client-connection'
import type {} from '@deepseek-ai/dsh-credentials'
import type {} from '@deepseek-ai/dsh-subprocess'
import { Studio } from './studio.ts'
import { createExecutor } from './executor.ts'
import { modelCatalog } from './catalog.ts'
import type { StudioConfig } from './types.ts'

/** Stable opt-in plugin name. */
export const name = 'dsh-w-studio'
/** Authenticated transport, process ownership, and secret-reference resolution. */
export const inject = ['connection', 'subprocess', 'credentials', 'llm']
/** Deployment-owned Studio storage, executable commands, and resource budgets. */
export type Config = StudioConfig
/** Validated deployment settings; no credential values are accepted. */
export const Config: z<Config> = z.object({
  storageRoot: z.string().default(resolve(resolveDshHome(), 'studio')),
  claudeCommand: z.array(z.string().min(1)).min(1).default(['claude']),
  codexCommand: z.array(z.string().min(1)).min(1).default(['codex']),
  dshBin: z.string().default(''),
  maxParallel: z.natural().min(1).max(16).default(2),
  maxTasksPerProject: z.natural().min(1).max(1000).default(100),
  maxTextBytes: z.natural().min(1024).max(100_000).default(65_536),
  maxArtifactBytes: z.natural().min(1024).default(16_777_216),
  maxRequestBytes: z.natural().min(1024).default(262_144),
  taskTimeoutMs: z.natural().min(1000).max(2_147_483_647).default(3_600_000),
  disposeGraceMs: z.natural().min(100).max(60_000).default(3000),
  pollIntervalMs: z.natural().min(250).max(60_000).default(1500),
})

/** Register the Web consumer and its fully owned native execution provider.
 * @param ctx - Web Host context.
 * @param config - Parsed deployment settings.
 */
export async function apply(ctx: Context, config: Config): Promise<void> {
  const resolved = { ...config, storageRoot: resolve(config.storageRoot), dshBin: resolve(config.dshBin || installedDshBin()) }
  const executor = createExecutor(ctx, resolved)
  const studio = await Studio.open(resolved, executor)
  ctx.effect(() => () => studio.close(), 'studio: employee operations')
  const reply = (value: unknown, status = 200): Response => Response.json(value, { status, headers: { 'cache-control': 'no-store' } })
  ctx.connection.fetch.register({ path: '/api/studio/state', methods: ['GET'], requestBody: 'buffered',
    fetch: () => Promise.resolve(reply({ state: studio.snapshot(), pollIntervalMs: config.pollIntervalMs })) })
  ctx.connection.fetch.register({ path: '/api/studio/health', methods: ['GET'], requestBody: 'buffered',
    fetch: async () => reply(await executor.health()) })
  ctx.connection.fetch.register({ path: '/api/studio/catalog', methods: ['GET'], requestBody: 'buffered',
    fetch: async () => {
      try { return reply(await modelCatalog(ctx, process.env.CODEX_HOME || resolve(homedir(), '.codex'), resolved)) }
      catch (error) { return reply({ error: error instanceof Error ? error.message : 'Model catalog unavailable' }, 400) }
    } })
  ctx.connection.fetch.register({ path: '/api/studio/command', methods: ['POST'], requestBody: 'streaming',
    fetch: async (request) => {
      try {
        const reader = request.body?.getReader()
        const chunks: Uint8Array[] = []
        let size = 0
        if (reader) {
          try {
            while (true) {
              const chunk = await reader.read()
              if (chunk.done) break
              size += chunk.value.byteLength
              if (size > config.maxRequestBytes) {
                await reader.cancel()
                return reply({ error: 'Studio request exceeds the configured limit' }, 413)
              }
              chunks.push(chunk.value)
            }
          } finally { reader.releaseLock() }
        }
        const text = Buffer.concat(chunks).toString('utf8')
        const state = await studio.command(JSON.parse(text))
        return reply({ state })
      } catch (error) { return reply({ error: error instanceof Error ? error.message : 'Studio command failed' }, 400) }
    } })
  ctx.connection.fetch.register({ path: '/api/studio/artifact', methods: ['GET'], requestBody: 'buffered',
    fetch: async (request) => {
      try {
        const id = new URL(request.url).searchParams.get('id') ?? ''
        const { artifact, bytes } = await studio.artifact(id)
        return new Response(new Uint8Array(bytes), { headers: {
          'content-type': 'application/octet-stream', 'cache-control': 'no-store',
          'content-disposition': `attachment; filename*=UTF-8''${encodeURIComponent(artifact.name.split(/[\\/]/).at(-1) ?? 'result')}`,
        } })
      } catch (error) { return reply({ error: error instanceof Error ? error.message : 'Result file unavailable' }, 404) }
    } })
}

/** Locate the CLI belonging to the installed Harness runtime.
 * @returns Absolute built dsh entry; an explicit dshBin overrides this lookup.
 */
function installedDshBin(): string {
  const manifestPath = createRequire(import.meta.url).resolve('@deepseek-ai/dsh/package.json')
  const manifest: unknown = JSON.parse(readFileSync(manifestPath, 'utf8'))
  if (typeof manifest !== 'object' || manifest === null || !('bin' in manifest)) throw new Error('Installed Harness declares no CLI entry; configure dshBin')
  const bin = manifest.bin
  const entry = typeof bin === 'string' ? bin : typeof bin === 'object' && bin !== null && 'dsh' in bin ? bin.dsh : undefined
  if (typeof entry !== 'string' || !entry) throw new Error('Installed Harness declares no dsh executable; configure dshBin')
  return resolve(dirname(manifestPath), entry)
}
