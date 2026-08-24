import assert from 'node:assert/strict'
import { test } from 'node:test'
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { KnowledgeStore } from '../kb-store.js'
import { buildToolSpecs } from '../kb-tools.js'

const EXEC = { agent: { session: { header: { id: 'session-42', cwd: 'E:\\deepseek-workspace\\demo' } } } }

const DOC = [
  '# Feed Test',
  '',
  'Preamble.',
  '',
  '## Setup',
  '',
  'Run the installer.',
  '',
  '## Teardown',
  '',
  'Stop the service.',
  '',
].join('\n')

test('kb_import reads a workspace file, splits it, and writes tagged notes', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'dsh-w-kb-tool-import-'))
  const kbRoot = join(root, 'kb')
  const store = new KnowledgeStore({
    root: kbRoot,
    displayRoot: '$DSH_HOME/knowledge-base',
    syncIntervalMs: 0,
    now: () => Date.parse('2026-09-01T12:00:00.000Z'),
    random: () => Math.random(),
  })
  const spec = buildToolSpecs({ store }).find((entry) => entry.name === 'kb_import')
  t.after(async () => {
    await rm(root, { recursive: true, force: true })
  })
  const file = join(root, 'handoff.md')
  await writeFile(file, DOC, 'utf8')

  const dry = await spec.execute({ path: file, dryRun: true }, EXEC)
  assert.equal(dry.dryRun, true)
  assert.equal(dry.docTitle, 'Feed Test')
  assert.equal(dry.docSlug, 'handoff')
  assert.equal(dry.plan.length, 3)
  assert.equal(dry.counts.created, 0)
  assert.equal((await store.stats()).total, 0)
  assert.ok(spec.output.render({ path: file, dryRun: true }, dry).some((block) => block.text.includes('Dry run:')), 'the render explains a dry run')

  const done = await spec.execute({ path: file, tags: ['demo'] }, EXEC)
  assert.equal(done.dryRun, false)
  assert.equal(done.counts.created, 3)
  assert.equal(done.counts.updated, 0)
  assert.equal((await store.stats()).total, 3)
  const setup = store.findByOrigin('import:handoff#setup')
  assert.ok(setup !== null)
  assert.deepEqual(setup.tags, ['import', 'handoff', 'demo'])
  assert.ok(setup.body.includes('Run the installer.'))
  const rendered = spec.output.render({ path: file }, done).map((block) => block.text).join('\n')
  assert.ok(rendered.includes('Imported'), rendered)
  assert.ok(rendered.includes('3 created, 0 updated'), rendered)
  assert.ok(rendered.includes('kb_list tag "handoff"'), rendered)

  const again = await spec.execute({ path: file }, EXEC)
  assert.equal(again.counts.created, 0)
  assert.equal(again.counts.updated, 3)
  assert.equal((await store.stats()).total, 3, 'a re-feed updates, it does not pile up')
})

test('kb_import resolves relative paths against the calling session cwd', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'dsh-w-kb-tool-cwd-'))
  const kbRoot = join(root, 'kb')
  const workspace = join(root, 'workspace')
  await mkdir(workspace)
  const store = new KnowledgeStore({ root: kbRoot, syncIntervalMs: 0, now: () => Date.now(), random: () => Math.random() })
  const spec = buildToolSpecs({ store }).find((entry) => entry.name === 'kb_import')
  t.after(async () => {
    await rm(root, { recursive: true, force: true })
  })
  await writeFile(join(workspace, 'notes.txt'), DOC, 'utf8')
  const exec = { agent: { session: { header: { id: 'session-9', cwd: workspace } } } }
  const outcome = await spec.execute({ path: 'notes.txt' }, exec)
  assert.equal(outcome.counts.created, 3)
  assert.equal(outcome.file, join(workspace, 'notes.txt'))
  const text = await readFile(join(kbRoot, 'notes', store.findByOrigin('import:notes#setup').file), 'utf8')
  assert.ok(text.includes('workspace: ' + workspace), text)
})

test('kb_import fails loud on missing paths, directories, and binary content', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'dsh-w-kb-tool-err-'))
  const store = new KnowledgeStore({ root: join(root, 'kb'), syncIntervalMs: 0, now: () => Date.now(), random: () => Math.random() })
  const spec = buildToolSpecs({ store }).find((entry) => entry.name === 'kb_import')
  t.after(async () => {
    await rm(root, { recursive: true, force: true })
  })
  await assert.rejects(() => spec.execute({ path: 'no-such-file.md' }, EXEC), /cannot find/)
  await assert.rejects(() => spec.execute({ path: root }, EXEC), /is a directory/)
  await writeFile(join(root, 'blob.bin'), Buffer.from([0, 1, 2, 3]), 'utf8')
  await assert.rejects(
    () => spec.execute({ path: join(root, 'blob.bin') }, EXEC),
    (error) => error.code === 'KB_IMPORT_BINARY',
  )
  await assert.rejects(() => spec.execute({ path: '' }, EXEC), /needs a file path/)
})
