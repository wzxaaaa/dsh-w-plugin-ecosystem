/** Use the same service as the official Add Plugin UI, with a legacy CLI fallback. */
export async function installWithHarness(ctx, archive, legacyInstall, packageName) {
  const manager = ctx.get?.('pluginManager')
  if (typeof manager?.installBundle === 'function') {
    const result = await manager.installBundle(archive)
    if (!result || result.error || ['failed', 'cancelled'].includes(result.application)) {
      throw new Error(result?.error?.diagnostic || result?.error?.code || `Official plugin installation ${result?.application ?? 'returned no result'}`)
    }
    return {
      // Replacing this manager can leave its existing Host instance running old code.
      requiresRestart: result.application !== 'applied' || packageName === 'dsh-w-custom-plugins',
      application: result.application,
      warnings: result.warnings ?? [],
      output: result.packageResult?.output ?? '',
    }
  }
  // Desktop's Host entry is not a CLI. Never invoke it with plugin/add arguments.
  if (/dsh-desktop-host[\\/]/u.test(process.argv[1] ?? '')) {
    throw new Error('Official Desktop pluginManager service is unavailable; enable the built-in plugin manager and retry')
  }
  const result = await legacyInstall()
  return { requiresRestart: true, application: 'restart-required', warnings: [], output: `${result.stdout}\n${result.stderr}`.trim() }
}
