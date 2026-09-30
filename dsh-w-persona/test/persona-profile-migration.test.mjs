import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, writeFile, readFile, rm, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { migrateLegacyPersona } from '../persona-profile-migration.js'

async function profiles(t) {
  const root = await mkdtemp(join(tmpdir(), 'persona-migration-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  const web = join(root, 'web'), desktop = join(root, 'desktop')
  await mkdir(web); await mkdir(desktop)
  return { web, desktop }
}
const library = { version: 1, templates: [{ id: 'old', name: 'Old', persona: 'Legacy prompt', dialoguePreset: {}, createdAt: '2026-09-01', updatedAt: '2026-09-01' }] }
const names = ['.dsh-w-persona-override.json', '.dsh-w-persona-dialogue.json', '.dsh-w-persona-templates.json']
async function seed(web) {
  for (const [i, value] of [{ persona: 'Legacy prompt' }, { enabled: false }, library].entries()) await writeFile(join(web, names[i]), JSON.stringify(value))
}
test('automatically migrates old state once, backs it up, and preserves each Harness default', async t => {
  const { web, desktop } = await profiles(t)
  await seed(web)
  await writeFile(join(web, '.dsh-w-persona-default.txt'), 'Old default')
  await writeFile(join(desktop, '.dsh-w-persona-default.txt'), 'Official default')
  const result = await migrateLegacyPersona(desktop)
  assert.deepEqual(result.migrated, names)
  for (const name of names) {
    assert.deepEqual(await readFile(join(desktop, name)), await readFile(join(web, name)))
    assert.deepEqual(await readFile(join(result.backupDir, name)), await readFile(join(web, name)))
  }
  assert.equal(await readFile(join(desktop, '.dsh-w-persona-default.txt'), 'utf8'), 'Official default')
  await rm(join(desktop, names[2]))
  assert.deepEqual(await migrateLegacyPersona(desktop), { migrated: [] })
  assert.equal((await readdir(desktop)).includes(names[2]), false, 'deleted templates must not be resurrected')
})
test('never overwrites current desktop persona state', async t => {
  const { web, desktop } = await profiles(t)
  await seed(web)
  const current = JSON.stringify({ persona: 'Current prompt' })
  await writeFile(join(desktop, names[0]), current)
  assert.deepEqual((await migrateLegacyPersona(desktop)).migrated, names.slice(1))
  assert.equal(await readFile(join(desktop, names[0]), 'utf8'), current)
})
test('validates all old files before writing and leaves corrupt source untouched', async t => {
  const { web, desktop } = await profiles(t)
  await seed(web)
  await writeFile(join(web, names[2]), '{broken')
  await assert.rejects(migrateLegacyPersona(desktop), SyntaxError)
  assert.deepEqual(await readdir(desktop), [])
  assert.equal(await readFile(join(web, names[2]), 'utf8'), '{broken')
})
test('web profiles and desktop profiles without a legacy sibling are untouched', async t => {
  const { web, desktop } = await profiles(t)
  assert.deepEqual(await migrateLegacyPersona(web), { migrated: [] })
  assert.deepEqual(await migrateLegacyPersona(desktop), { migrated: [] })
  assert.deepEqual(await readdir(desktop), [])
})
test('an already migrated desktop profile is marked once so later deletions stay deleted', async t => {
  const { web, desktop } = await profiles(t)
  await seed(web); await seed(desktop)
  assert.deepEqual(await migrateLegacyPersona(desktop), { migrated: [] })
  await rm(join(desktop, names[2]))
  assert.deepEqual(await migrateLegacyPersona(desktop), { migrated: [] })
  assert.equal((await readdir(desktop)).includes(names[2]), false)
})
