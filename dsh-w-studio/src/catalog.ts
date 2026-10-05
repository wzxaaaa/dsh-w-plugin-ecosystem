/** Public native model pickers and the Harness directory, without session content. */
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-llm'
import type {} from '@deepseek-ai/dsh-subprocess'
import type { StudioCatalog, StudioConfig, StudioModel } from './types.ts'

function object(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
/** Read model identities without exposing native instructions or other cache fields.
 * @param ctx - Harness model directory.
 * @param codexHome - Native Codex configuration directory.
 * @param config - Native executable and bounded discovery lifecycle.
 * @returns Native picker entries and supported efforts; Claude discovery failures remain visible.
 */
export async function modelCatalog(ctx: Context, codexHome: string, config: StudioConfig): Promise<StudioCatalog> {
  let codex: StudioModel[] = []
  let text: string | undefined
  try { text = await readFile(join(codexHome, 'models_cache.json'), 'utf8') }
  catch (error) { if (!(error instanceof Error && 'code' in error && error.code === 'ENOENT')) throw error }
  if (text !== undefined) {
    const raw: unknown = JSON.parse(text)
    if (!object(raw) || !Array.isArray(raw.models)) throw new Error('Native Codex model cache is invalid')
    codex = raw.models.flatMap((value) => {
      if (!object(value) || typeof value.slug !== 'string' || value.visibility === 'hide') return []
      const efforts = Array.isArray(value.supported_reasoning_levels) ? value.supported_reasoning_levels.flatMap(level => object(level) && typeof level.effort === 'string' ? [level.effort] : []) : []
      return [{ id: value.slug, name: typeof value.display_name === 'string' ? value.display_name : value.slug, efforts, imageInput: null }]
    })
  }
  const harness = await ctx.llm.listModels('deepseek-official')
  const models = await Promise.all(harness.map(async (model) => {
    const info = await ctx.llm.resolveModelInfo('deepseek-official', model.id)
    return { id: model.id, name: model.name, efforts: info.reasoning?.efforts.map(effort => effort.id) ?? [], imageInput: info.inputModalities?.includes('image') ?? false }
  }))
  let claude: StudioModel[] = []
  let claudeError = ''
  try {
    // Initialize with no user message: model discovery never starts a model turn.
    const request = { type: 'control_request', request_id: 'studio-models', request: { subtype: 'initialize' } }
    const child = ctx.subprocess.spawn({
      argv: [...config.claudeCommand, '--print', '--input-format', 'stream-json', '--output-format', 'stream-json', '--verbose', '--no-session-persistence'],
      cwd: process.cwd(), signal: AbortSignal.timeout(config.disposeGraceMs * 4), graceMs: config.disposeGraceMs,
      stdio: { stdin: { data: `${JSON.stringify(request)}\n` }, stdout: { maxBytes: config.maxTextBytes * 2 }, stderr: { maxBytes: config.maxTextBytes } },
    })
    try {
      const outcome = await child.done
      if (outcome.exitCode !== 0) throw new Error('Claude model discovery failed; check the installed CLI and login')
      for (const line of (child.collected.stdout?.readFrom(0).text ?? '').split('\n').filter(Boolean)) {
        const message: unknown = JSON.parse(line)
        if (!object(message) || message.type !== 'control_response' || !object(message.response) || message.response.request_id !== 'studio-models') continue
        const response = message.response.response
        if (!object(response) || !Array.isArray(response.models)) throw new Error('Claude returned an invalid model list')
        claude = response.models.map((value) => {
          if (!object(value) || typeof value.value !== 'string' || typeof value.displayName !== 'string') throw new Error('Claude returned an invalid model entry')
          const efforts = Array.isArray(value.supportedEffortLevels) ? value.supportedEffortLevels.filter((effort): effort is string => typeof effort === 'string') : []
          return { id: value.value, name: value.displayName, efforts, imageInput: null }
        })
      }
      if (!claude.length) throw new Error('Claude returned no selectable models; enter an exact model ID or check the CLI')
    } finally {
      child.terminate()
      if (!await child.waitForExit(AbortSignal.timeout(config.disposeGraceMs * 4))) throw new Error('Claude model discovery cleanup did not complete')
    }
  } catch (error) { claudeError = error instanceof Error ? error.message : 'Claude model discovery unavailable' }
  return { codex, claude, claudeError, harness: models }
}
