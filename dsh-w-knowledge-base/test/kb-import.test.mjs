import assert from 'node:assert/strict'
import { test } from 'node:test'
import { mkdtemp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { KnowledgeStore } from '../kb-store.js'

const START = Date.parse('2026-09-01T12:00:00.000Z')

async function makeStore(overrides = {}) {
  const root = await mkdtemp(join(tmpdir(), 'dsh-w-kb-import-'))
  let clock = START
  let seed = 0.13
  const store = new KnowledgeStore({
    root,
    displayRoot: '$DSH_HOME/knowledge-base',
    syncIntervalMs: 0,
    now: () => clock,
    random: () => {
      seed = (seed + 0.171) % 1
      return seed
    },
    ...overrides,
  })
  return {
    root,
    store,
    tick(ms) {
      clock += ms
    },
    async cleanup() {
      await rm(root, { recursive: true, force: true })
    },
  }
}

function makeDoc() {
  return [
    '# Handoff Notes',
    '',
    'Things we learned this week.',
    '',
    '## Setup',
    '',
    'Run install once.',
    '',
    '## Deploy',
    '',
    'Ship it with the tag.',
    '',
  ].join('\n')
}

test('importDocument writes one note per section with import tags and origins', async (t) => {
  const kb = await makeStore()
  t.after(() => kb.cleanup())
  const outcome = await kb.store.importDocument({ name: 'handoff.md', text: makeDoc(), tags: ['team'] })
  assert.equal(outcome.dryRun, false)
  assert.equal(outcome.counts.created, 3)
  assert.equal(outcome.counts.updated, 0)
  assert.equal(outcome.notes.length, 3)
  const stats = await kb.store.stats()
  assert.equal(stats.total, 3)
  const notes = kb.store.notes()
  for (const note of notes) {
    assert.deepEqual(note.tags, ['import', 'handoff', 'team'])
    assert.ok(note.origin.startsWith('import:handoff#'), note.origin)
  }
  const deploy = kb.store.findByOrigin('import:handoff#deploy')
  assert.ok(deploy !== null)
  assert.equal(deploy.title, 'Handoff Notes · Deploy')
  assert.ok(deploy.body.includes('Ship it'))
  const text = await readFile(join(kb.root, 'notes', deploy.file), 'utf8')
  assert.ok(text.includes('origin: import:handoff#deploy'), text)
})

test('feeding the same document again updates its notes instead of duplicating', async (t) => {
  const kb = await makeStore()
  t.after(() => kb.cleanup())
  const first = await kb.store.importDocument({ name: 'handoff.md', text: makeDoc() })
  assert.equal(first.counts.created, 3)
  const changed = makeDoc().replace('Run install once.', 'Run install TWICE now.')
  const second = await kb.store.importDocument({ name: 'handoff.md', text: changed })
  assert.equal(second.counts.created, 0)
  assert.equal(second.counts.updated, 3)
  assert.equal(second.counts.stale, 0)
  assert.equal((await kb.store.stats()).total, 3)
  const setup = kb.store.findByOrigin('import:handoff#setup')
  assert.ok(setup.body.includes('TWICE'), setup.body)
  // ids stay stable across a re-feed: the same notes were updated, not replaced.
  assert.deepEqual(second.notes.map((note) => note.id).sort(), first.notes.map((note) => note.id).sort())
})

test('a later feed without tags keeps tags an earlier feed added', async (t) => {
  const kb = await makeStore()
  t.after(() => kb.cleanup())
  await kb.store.importDocument({ name: 'handoff.md', text: makeDoc(), tags: ['team'] })
  await kb.store.importDocument({ name: 'handoff.md', text: makeDoc() })
  const setup = kb.store.findByOrigin('import:handoff#setup')
  assert.deepEqual(setup.tags, ['import', 'handoff', 'team'], 'the team tag survives a tagless re-feed')
})

test('sections that vanished are reported as stale but never deleted silently', async (t) => {
  const kb = await makeStore()
  t.after(() => kb.cleanup())
  await kb.store.importDocument({ name: 'handoff.md', text: makeDoc() })
  const shrunk = makeDoc().replace('\n## Deploy\n\nShip it with the tag.\n', '\n')
  const outcome = await kb.store.importDocument({ name: 'handoff.md', text: shrunk })
  assert.equal(outcome.counts.created, 0)
  assert.equal(outcome.counts.updated, 2)
  assert.equal(outcome.counts.stale, 1)
  assert.equal(outcome.stale.length, 1)
  assert.equal(outcome.stale[0].origin, 'import:handoff#deploy')
  assert.equal((await kb.store.stats()).total, 3, 'stale notes stay until the user deletes them')
})

test('a dry run reports the split plan and writes nothing', async (t) => {
  const kb = await makeStore()
  t.after(() => kb.cleanup())
  const plan = await kb.store.importDocument({ name: 'handoff.md', text: makeDoc(), dryRun: true })
  assert.equal(plan.dryRun, true)
  assert.equal(plan.plan.docTitle, 'Handoff Notes')
  assert.equal(plan.plan.docSlug, 'handoff')
  assert.equal(plan.plan.drafts.length, 3)
  assert.equal(plan.plan.drafts[0].update, false)
  assert.equal((await kb.store.stats()).total, 0)
  await kb.store.importDocument({ name: 'handoff.md', text: makeDoc() })
  const rePlan = await kb.store.importDocument({ name: 'handoff.md', text: makeDoc(), dryRun: true })
  assert.equal(rePlan.plan.drafts[0].update, true, 'a dry run flags which sections would update')
})

test('origins survive a full reload from disk', async (t) => {
  const kb = await makeStore()
  t.after(() => kb.cleanup())
  await kb.store.importDocument({ name: 'handoff.md', text: makeDoc() })
  await kb.store.sync({ force: true })
  const deploy = kb.store.findByOrigin('import:handoff#deploy')
  assert.ok(deploy !== null)
  assert.equal(deploy.origin, 'import:handoff#deploy')
})

test('unusable documents are refused with stable error codes', async (t) => {
  const kb = await makeStore()
  t.after(() => kb.cleanup())
  await assert.rejects(() => kb.store.importDocument({ name: 'x.pdf', text: 'not actually pdf' }), (error) => {
    assert.equal(error.code, 'KB_IMPORT_BINARY')
    return true
  })
  await assert.rejects(() => kb.store.importDocument({ name: 'x.txt', text: '   ' }), (error) => {
    assert.equal(error.code, 'KB_IMPORT_EMPTY')
    return true
  })
  const smallCap = await makeStore({ maxDocChars: 100 })
  t.after(() => smallCap.cleanup())
  await assert.rejects(
    () => smallCap.store.importDocument({ name: 'x.txt', text: 'y'.repeat(500) }),
    (error) => error.code === 'KB_IMPORT_TOO_LARGE',
  )
})

test('a document with one huge section splits into parts with one origin per part', async (t) => {
  const kb = await makeStore({ maxNoteChars: 3000, importTargetChars: 600 })
  t.after(() => kb.cleanup())
  const big = '# One Heading\n\n' + 'x '.repeat(5000)
  const outcome = await kb.store.importDocument({ name: 'big.md', text: big })
  assert.ok(outcome.counts.created >= 2, 'expected multiple parts, got ' + outcome.counts.created)
  for (const note of kb.store.notes()) {
    assert.ok(note.body.length <= 3000, 'note over the store budget: ' + note.body.length)
  }
  const distinctOrigins = new Set(kb.store.notes().map((note) => note.origin))
  assert.equal(distinctOrigins.size, outcome.counts.created)
})

test('a document with no headings still becomes notes', async (t) => {
  const kb = await makeStore({ importTargetChars: 200 })
  t.after(() => kb.cleanup())
  const paragraphs = Array.from({ length: 5 }, (_, index) => 'paragraph ' + index + ': ' + 'word '.repeat(40))
  const outcome = await kb.store.importDocument({ name: 'plain.txt', text: paragraphs.join('\n\n') })
  assert.equal(outcome.counts.created, 5)
  const titles = kb.store.notes().map((note) => note.title)
  assert.ok(titles.every((title) => title.startsWith('plain · 第 ')), titles.join(' | '))
})
