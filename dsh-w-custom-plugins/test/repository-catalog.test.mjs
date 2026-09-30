import assert from 'node:assert/strict'
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { createHash } from 'node:crypto'
import { gzipSync } from 'node:zlib'
import { RepositoryCatalog, mergeCatalog, validCatalogEntry, fetchRepositoryCatalog, downloadRepositoryArchive, parseRepositorySnapshot } from '../repository-catalog.js'
import { installWithHarness } from '../harness-install.js'

const published = { moduleName: 'dsh-w-example', version: '1.2.3', description: 'Example', ref: 'a'.repeat(40), archiveSha: 'b'.repeat(40) }

test('shows every repository plugin once and keeps installed controls and third-party rows', () => {
  const rows = mergeCatalog([
    { moduleName: 'dsh-w-example', entryId: 'live', enabled: false, version: '1.0.0' },
    { moduleName: '@community/extra', entryId: 'other', enabled: true },
  ], [published, { ...published, moduleName: 'dsh-w-new' }])
  assert.equal(rows.length, 3)
  assert.equal(rows[0].installed, true)
  assert.equal(rows[0].entryId, 'live')
  assert.equal(rows[0].enabled, false)
  assert.equal(rows[0].version, '1.0.0')
  assert.equal(rows[0].latestVersion, '1.2.3')
  assert.equal(rows[1].installed, true)
  assert.equal(rows[2].installed, false)
  assert.equal(rows[2].downloadable, true)
})

test('a source-only repository entry has a disabled download action', () => {
  assert.equal(mergeCatalog([], [{ ...published, archiveSha: null }])[0].downloadable, false)
})

test('rejects forged package names, versions and mutable commit references', () => {
  assert.equal(validCatalogEntry(published), true)
  for (const patch of [{ moduleName: '../third-party' }, { version: 'latest' }, { ref: 'main' }, { archiveSha: 'https://elsewhere' }]) {
    assert.equal(validCatalogEntry({ ...published, ...patch }), false)
  }
})

test('shares refreshes, persists the catalogue and preserves it offline across restarts', async t => {
  const root = await mkdtemp(join(tmpdir(), 'dsh-w-catalog-test-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  const file = join(root, 'cache.json')
  let requests = 0
  const service = new RepositoryCatalog(file, async () => { requests += 1; return [published] })
  const snapshots = await Promise.all([service.snapshot(), service.snapshot()])
  assert.equal(requests, 1)
  assert.deepEqual(snapshots[0].entries, [published])
  assert.equal(JSON.parse(await readFile(file, 'utf8')).entries.length, 1)
  await service.snapshot()
  assert.equal(requests, 1)
  service.fetcher = async () => { throw new Error('offline') }
  const failure = await service.snapshot(true)
  assert.equal(failure.stale, true)
  assert.equal(failure.warning, 'offline')
  assert.deepEqual(failure.entries, [published])
  const reloaded = new RepositoryCatalog(file, async () => { throw new Error('network must not be needed') })
  assert.deepEqual((await reloaded.snapshot()).entries, [published])
  await writeFile(file, JSON.stringify({ time: Date.now(), entries: [{ ...published, ref: 'main' }] }))
  const corrupted = new RepositoryCatalog(file, async () => { throw new Error('offline') })
  const fallback = await corrupted.snapshot()
  assert.equal(fallback.entries.length, 18)
  assert.equal(fallback.stale, true)
  assert.equal(fallback.entries.every(validCatalogEntry), true)
})

test('uses the official service and reports activation independently from installation', async () => {
  const calls = []
  const result = await installWithHarness({ get: () => ({ installBundle: async spec => {
    calls.push(spec)
    return { application: 'applied', warnings: [{ diagnostic: 'plugin needs adaptation' }], packageResult: { output: 'pnpm succeeded' } }
  } }) }, 'C:/plugins/validated.tgz', () => { throw new Error('must not launch a CLI') })
  assert.deepEqual(calls, ['C:/plugins/validated.tgz'])
  assert.equal(result.requiresRestart, false)
  assert.equal(result.warnings.length, 1)
})

test('official errors and cancellation are surfaced without falling back to another installer', async () => {
  for (const outcome of [{ application: 'failed', error: { diagnostic: 'package installation failed' } }, { application: 'cancelled' }]) {
    await assert.rejects(installWithHarness({ get: () => ({ installBundle: async () => outcome }) }, 'plugin.tgz', () => {
      throw new Error('unsafe fallback')
    }), /package installation failed|cancelled/)
  }
})

test('manager self-upgrades require a Host restart even when the official service reports applied', async () => {
  const result = await installWithHarness({ get: () => ({ installBundle: async () => ({ application: 'applied' }) }) }, 'manager.tgz', () => {
    throw new Error('must use the official service')
  }, 'dsh-w-custom-plugins')
  assert.equal(result.requiresRestart, true)
  assert.equal(result.application, 'applied')
})

test('retains old source-runtime installation and its restart requirement', async () => {
  const result = await installWithHarness({ get: () => undefined }, 'plugin.tgz', async () => ({ stdout: 'installed', stderr: '' }))
  assert.equal(result.application, 'restart-required')
  assert.equal(result.requiresRestart, true)
})

function tarFixture(files, ref = published.ref) {
  const record = `comment=${ref}\n`
  let length = record.length + 3
  while (length !== record.length + String(length).length + 1) length = record.length + String(length).length + 1
  const entries = [{ path: 'pax_global_header', type: 'g', bytes: Buffer.from(`${length} ${record}`) }, ...files]
  const chunks = []
  for (const entry of entries) {
    const bytes = Buffer.from(entry.bytes ?? '')
    const header = Buffer.alloc(512)
    header.write(entry.path)
    header.write(bytes.length.toString(8).padStart(11, '0') + '\0', 124)
    header.fill(32, 148, 156)
    header[156] = (entry.type ?? '0').charCodeAt(0)
    const checksum = header.reduce((sum, byte) => sum + byte, 0)
    header.write(checksum.toString(8).padStart(6, '0') + '\0 ', 148)
    chunks.push(header, bytes, Buffer.alloc((512 - bytes.length % 512) % 512))
  }
  return gzipSync(Buffer.concat([...chunks, Buffer.alloc(1024)]))
}

function repositoryFixture(ref = published.ref, archive = Buffer.from('fixture archive bytes')) {
  const manifest = { name: published.moduleName, version: published.version, description: 'Example', dsh: { bundle: { patch: './cordis.patch.yml' } } }
  return tarFixture([
    { path: `repo/${published.moduleName}/package.json`, bytes: JSON.stringify(manifest) },
    { path: `repo/${published.moduleName}/${published.moduleName}-${published.version}.tgz`, bytes: archive },
    { path: 'repo/third-party/package.json', bytes: JSON.stringify(manifest) },
  ], ref)
}

test('discovers every W bundle and installs without REST API requests even when that API returns 403', async t => {
  const root = await mkdtemp(join(tmpdir(), 'dsh-w-no-api-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  const bytes = Buffer.from('fixture archive bytes')
  const sha = createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex')
  const requests = []
  t.mock.method(globalThis, 'fetch', async url => {
    requests.push(url)
    if (new URL(url).hostname === 'api.github.com') return new Response('API rate limit exceeded', { status: 403 })
    assert.equal(url, 'https://codeload.github.com/wzxaaaa/dsh-w-plugin-ecosystem/tar.gz/refs/heads/main')
    return new Response(repositoryFixture())
  })
  const entries = await fetchRepositoryCatalog()
  assert.deepEqual(entries, [{ ...published, archiveSha: sha }])
  const target = join(root, 'plugin.tgz')
  await downloadRepositoryArchive(entries[0], target)
  assert.deepEqual(await readFile(target), bytes)
  assert.equal(requests.length, 1, 'installation reuses the snapshot already fetched for discovery')
  await assert.rejects(downloadRepositoryArchive(published, join(root, 'wrong.tgz')), /digest does not match/)
  await assert.rejects(readFile(join(root, 'wrong.tgz')), { code: 'ENOENT' })
})

test('cold start without network or cache still shows the bundled W catalogue and retries after recovery', async t => {
  const root = await mkdtemp(join(tmpdir(), 'dsh-w-cold-offline-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  let calls = 0
  const service = new RepositoryCatalog(join(root, 'cache.json'), async () => { calls++; throw new Error('offline') })
  const first = await service.snapshot()
  assert.equal(first.entries.length, 18)
  assert.equal(first.entries.every(validCatalogEntry), true)
  assert.equal(first.warning, 'offline')
  assert.equal(first.stale, true)
  assert.deepEqual(await service.snapshot(), first)
  assert.equal(calls, 1)
  service.fetcher = async () => [published, { ...published, moduleName: 'dsh-w-new' }]
  const refreshed = await service.snapshot(true)
  assert.equal(refreshed.warning, '')
  assert.equal(refreshed.entries.length, 2)
})

test('a fresh catalogue detects newly published plugins', async t => {
  const manifest = { name: 'dsh-w-new', version: '2.0.0', dsh: { bundle: { patch: './cordis.patch.yml' } } }
  t.mock.method(globalThis, 'fetch', async () => new Response(tarFixture([
    { path: 'repo/dsh-w-new/package.json', bytes: JSON.stringify(manifest) },
  ], 'c'.repeat(40))))
  assert.deepEqual(await fetchRepositoryCatalog([published]), [{ moduleName: 'dsh-w-new', version: '2.0.0', description: '', ref: 'c'.repeat(40), archiveSha: null }])
})

test('pinned downloads reject a different commit without writing a file', async t => {
  const root = await mkdtemp(join(tmpdir(), 'dsh-w-pinned-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  t.mock.method(globalThis, 'fetch', async url => {
    assert.ok(url.endsWith('d'.repeat(40)))
    return new Response(repositoryFixture('e'.repeat(40)))
  })
  const target = join(root, 'plugin.tgz')
  await assert.rejects(downloadRepositoryArchive({ ...published, ref: 'd'.repeat(40) }, target), /commit does not match/)
  await assert.rejects(readFile(target), { code: 'ENOENT' })
})

test('repository tar reader rejects traversal, linked plugin files, duplicates and damaged headers', () => {
  const path = 'repo/dsh-w-example/package.json'
  assert.throws(() => parseRepositorySnapshot(tarFixture([{ path: 'repo/../package.json' }])), /path is invalid/)
  assert.throws(() => parseRepositorySnapshot(tarFixture([{ path, type: '2' }])), /regular file/)
  assert.throws(() => parseRepositorySnapshot(tarFixture([{ path }, { path }])), /duplicate/)
  assert.throws(() => parseRepositorySnapshot(repositoryFixture(), 'f'.repeat(40)), /commit does not match/)
  assert.throws(() => parseRepositorySnapshot(Buffer.from('corrupt gzip')))
})
