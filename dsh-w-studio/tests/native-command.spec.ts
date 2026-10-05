/** Native executable discovery outside PATH and missing-executable guidance. */
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { commandResolver, explainSpawnError, onPath } from '../src/native-command.ts'

const roots: string[] = []
afterEach(async () => { for (const root of roots.splice(0)) await rm(root, { recursive: true, force: true }) })
async function fixture() {
  const root = await mkdtemp(join(tmpdir(), 'dsh-native-'))
  roots.push(root)
  const bin = join(root, 'bin')
  const app = join(root, 'app')
  await mkdir(bin)
  await mkdir(app)
  const exe = process.platform === 'win32' ? '.exe' : ''
  return { bin, app, exe, env: { PATH: bin, PATHEXT: '.EXE;.CMD' } }
}

describe('native command resolution', () => {
  it('keeps PATH commands and explicit prefixes, and falls back to the located app CLI', async () => {
    const { bin, app, exe, env } = await fixture()
    const bundled = join(app, `codex${exe}`)
    await writeFile(bundled, '')
    const locate = vi.fn(async () => bundled)
    // Not on PATH: the bundled CLI is used.
    expect(await commandResolver(['codex'], locate, env)()).toEqual([bundled])
    // Explicit paths and argv prefixes are deployment choices and are never replaced.
    expect(await commandResolver(['C:/tools/codex.exe'], locate, env)()).toEqual(['C:/tools/codex.exe'])
    expect(await commandResolver(['node', 'codex.mjs'], locate, env)()).toEqual(['node', 'codex.mjs'])
    // On PATH: the bare name wins and the locator is not consulted.
    await writeFile(join(bin, `codex${exe}`), '')
    expect(await onPath('codex', env)).toBe(true)
    locate.mockClear()
    expect(await commandResolver(['codex'], locate, env)()).toEqual(['codex'])
    expect(locate).not.toHaveBeenCalled()
  })

  it('caches the located CLI and re-locates after an app update moves it', async () => {
    const { app, exe, env } = await fixture()
    const first = join(app, `old${exe}`)
    const second = join(app, `new${exe}`)
    await writeFile(first, '')
    await writeFile(second, '')
    const locate = vi.fn().mockResolvedValueOnce(first).mockResolvedValueOnce(second)
    const resolve = commandResolver(['codex'], locate, env)
    expect(await resolve()).toEqual([first])
    expect(await resolve()).toEqual([first])
    expect(locate).toHaveBeenCalledTimes(1)
    await rm(first)
    expect(await resolve()).toEqual([second])
    // Nothing installed: the configured name is returned so the spawn error can be explained.
    expect(await commandResolver(['codex'], async () => null, env)()).toEqual(['codex'])
    expect(await commandResolver(['codex'], async () => join(app, 'missing'), env)()).toEqual(['codex'])
  })

  it('explains a missing executable and leaves other failures unchanged', () => {
    const missing = Object.assign(new Error('spawn codex ENOENT'), { code: 'ENOENT' })
    const explained = explainSpawnError(missing, 'codex', 'codex') as Error
    expect(explained.message).toContain('codex executable not found')
    expect(explained.message).toContain('codexCommand')
    expect(explained.cause).toBe(missing)
    expect((explainSpawnError(new Error('spawn claude ENOENT'), 'claude', 'claude') as Error).message).toContain('claudeCommand')
    const other = new Error('codex exited with code 1')
    expect(explainSpawnError(other, 'codex', 'codex')).toBe(other)
  })
})
