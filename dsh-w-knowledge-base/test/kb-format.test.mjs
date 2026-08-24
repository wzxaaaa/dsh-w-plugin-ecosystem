import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  MAX_TAGS,
  NOTE_ID_RE,
  firstLine,
  formatTimestamp,
  idFromFileName,
  newNoteId,
  noteFileName,
  normalizeTags,
  parseNote,
  parseTimestamp,
  sanitizeTitle,
  serializeNote,
  slugifyTitle,
  syntheticNoteId,
} from '../kb-format.js'

const AT = Date.parse('2026-09-01T15:30:12.345Z')

test('newNoteId is sortable, id-shaped, and deterministic under an injected random', () => {
  const id = newNoteId(AT, () => 0)
  assert.equal(id, 'kb-20260901-153012-aaaa')
  assert.match(id, NOTE_ID_RE)
  const later = newNoteId(AT + 86400000, () => 0)
  assert.ok(later > id, 'a later note id sorts after an earlier one')
})

test('newNoteId tolerates a hostile random source', () => {
  assert.match(newNoteId(AT, () => Number.NaN), NOTE_ID_RE)
  assert.match(newNoteId(AT, () => 1), NOTE_ID_RE)
  assert.match(newNoteId(AT, () => -0.5), NOTE_ID_RE)
})

test('sanitizeTitle collapses whitespace and rejects empty titles', () => {
  assert.equal(sanitizeTitle('  DSH   plugin\tpackaging  '), 'DSH plugin packaging')
  assert.equal(sanitizeTitle('line\u0000break'), 'line break')
  assert.throws(() => sanitizeTitle('   '), /must not be empty/)
  assert.throws(() => sanitizeTitle(42), TypeError)
  assert.equal(sanitizeTitle('x'.repeat(500)).length, 200)
})

test('normalizeTags trims, de-duplicates case-insensitively, and caps the count', () => {
  assert.deepEqual(normalizeTags(['DSH', 'dsh', ' packaging ', '']), ['DSH', 'packaging'])
  assert.deepEqual(normalizeTags('a, b , a'), ['a', 'b'])
  assert.deepEqual(normalizeTags(undefined), [])
  assert.equal(normalizeTags(Array.from({ length: 40 }, (_, index) => 'tag' + index)).length, MAX_TAGS)
  assert.throws(() => normalizeTags([1]), TypeError)
})

test('file names round-trip the note id and keep a readable slug', () => {
  const id = 'kb-20260901-153012-aaaa'
  const file = noteFileName(id, 'DSH: plugin/packaging pitfalls')
  assert.equal(file, 'kb-20260901-153012-aaaa__dsh-plugin-packaging-pitfalls.md')
  assert.equal(idFromFileName(file), id)
  const longSlug = slugifyTitle('word '.repeat(30))
  assert.ok(longSlug.length <= 40 && longSlug.length > 30, longSlug)
  assert.ok(!longSlug.endsWith('-'), 'a truncated slug never ends on a separator')
  assert.equal(idFromFileName('no-front-matter.md'), 'no-front-matter')
  assert.equal(idFromFileName('我的笔记.md'), '')
  assert.match(syntheticNoteId('我的笔记.md'), NOTE_ID_RE)
  assert.equal(slugifyTitle('  ???  '), '')
  assert.equal(noteFileName(id, '???'), id + '.md')
})

test('serializeNote and parseNote round-trip every field', () => {
  const note = {
    id: 'kb-20260901-153012-aaaa',
    title: 'Windows: pnpm pack pitfalls',
    tags: ['dsh', 'packaging'],
    created: formatTimestamp(AT),
    updated: formatTimestamp(AT + 1000),
    source: 'session-abc',
    workspace: 'E:\\deepseek-workspace\\demo',
    body: '# Heading\n\nAlways remove before add.\n',
  }
  const text = serializeNote(note)
  assert.ok(text.startsWith('---\nid: kb-20260901-153012-aaaa\n'))
  const parsed = parseNote(text)
  assert.equal(parsed.id, note.id)
  assert.equal(parsed.title, note.title)
  assert.deepEqual(parsed.tags, note.tags)
  assert.equal(parsed.created, note.created)
  assert.equal(parsed.updated, note.updated)
  assert.equal(parsed.source, note.source)
  assert.equal(parsed.workspace, note.workspace)
  assert.equal(parsed.body, '# Heading\n\nAlways remove before add.')
  assert.equal(parsed.hasFrontMatter, true)
})

test('parseNote tolerates a hand-written file with no front matter', () => {
  const parsed = parseNote('\n# My hand written note\n\nbody text\n', { fallbackId: 'my-note' })
  assert.equal(parsed.hasFrontMatter, false)
  assert.equal(parsed.id, 'my-note')
  assert.equal(parsed.title, 'My hand written note')
  assert.deepEqual(parsed.tags, [])
  assert.equal(parsed.created, '')
  assert.equal(parsed.body, '# My hand written note\n\nbody text')
})

test('parseNote ignores unknown keys and a broken fence', () => {
  const parsed = parseNote('---\nid: kb-x\nsecret: nope\ntitle: Kept\n---\nbody', { fallbackId: 'fallback' })
  assert.equal(parsed.title, 'Kept')
  assert.equal(parsed.body, 'body')
  assert.equal(parsed.secret, undefined)
  const unterminated = parseNote('---\nid: kb-x\ntitle: Nope\nbody without fence', { fallbackId: 'fallback' })
  assert.equal(unterminated.hasFrontMatter, false)
  assert.equal(unterminated.id, 'fallback')
})

test('timestamp helpers survive junk', () => {
  assert.equal(parseTimestamp('not a date'), 0)
  assert.equal(parseTimestamp(undefined), 0)
  assert.equal(parseTimestamp(formatTimestamp(AT)), AT)
  assert.equal(formatTimestamp(Number.NaN), '1970-01-01T00:00:00.000Z')
})

test('firstLine skips blanks, strips heading marks, and truncates', () => {
  assert.equal(firstLine('\n\n## Title here\nmore'), 'Title here')
  assert.equal(firstLine(''), '')
  assert.equal(firstLine('x'.repeat(50), 10), 'xxxxxxxxxx…')
})
