/** Locate native CLIs installed outside PATH, such as the CLI bundled with the Codex desktop app. */
import { stat } from 'node:fs/promises'
import { delimiter, join } from 'node:path'

/** Finds an executable by other means than PATH; resolves to null when it is not installed. */
export type ExecutableLocator = () => Promise<string | null>

async function isFile(path: string): Promise<boolean> {
  try { return (await stat(path)).isFile() }
  catch { return false }
}
/** Whether a bare command name is reachable through PATH (and PATHEXT on Windows).
 * @param name - Command without directory.
 * @param env - Environment supplying PATH and PATHEXT.
 * @returns True when spawning the bare name can succeed.
 */
export async function onPath(name: string, env: NodeJS.ProcessEnv = process.env): Promise<boolean> {
  const extensions = process.platform === 'win32' ? ['', ...(env.PATHEXT ?? '.EXE;.CMD;.BAT;.COM').split(';').filter(Boolean)] : ['']
  for (const directory of (env.PATH ?? env.Path ?? '').split(delimiter).filter(Boolean)) {
    for (const extension of extensions) if (await isFile(join(directory, name + extension))) return true
  }
  return false
}
/** Resolve the configured argv prefix. Explicit paths and multi-part prefixes are used as configured; a bare
 * default missing from PATH falls back to the locator, re-checked when an app update moves the binary.
 * @param configured - Deployment argv prefix, e.g. `['codex']`.
 * @param locate - Fallback discovery.
 * @param env - Environment supplying PATH.
 * @returns Resolver returning the argv prefix to spawn.
 */
export function commandResolver(configured: string[], locate: ExecutableLocator, env: NodeJS.ProcessEnv = process.env): () => Promise<string[]> {
  let located: string | null = null
  return async () => {
    const [name] = configured
    if (configured.length !== 1 || name === undefined || /[\\/]/.test(name) || await onPath(name, env)) return configured
    if (located && await isFile(located)) return [located]
    located = await locate()
    return located && await isFile(located) ? [located] : configured
  }
}
/** Turn a spawn ENOENT into guidance naming the missing tool and the setting that fixes it.
 * @param error - Spawn or process failure.
 * @param engine - Native tool being started.
 * @param command - Executable that was attempted.
 * @returns Explanatory error, or the original one.
 */
export function explainSpawnError(error: unknown, engine: 'codex' | 'claude', command: string): unknown {
  const code = typeof error === 'object' && error !== null && 'code' in error ? error.code : undefined
  if (code !== 'ENOENT' && !(error instanceof Error && /\bENOENT\b/.test(error.message))) return error
  const product = engine === 'codex' ? 'Codex CLI (npm i -g @openai/codex, or the Codex desktop app)' : 'Claude Code CLI'
  return new Error(`${engine} executable not found: "${command}". Install the ${product}, or set ${engine}Command in the dsh-w-studio plugin config to its full path.`, { cause: error })
}
