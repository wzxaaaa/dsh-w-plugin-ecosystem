import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  DEFAULT_MAX_DOC_CHARS,
  DEFAULT_TARGET_CHARS,
  ORIGIN_PREFIX,
  buildImportDrafts,
  chooseSplitLevel,
  classifyDocument,
  deriveDocumentTitle,
  documentSlug,
  extensionOf,
  fileBaseName,
  normalizeDocument,
  scanHeadings,
  sectionOrigin,
  sectionTitle,
  splitBySize,
  splitDocument,
} from '../kb-ingest.js'

const BOM = String.fromCharCode(0xfeff)
const NUL = String.fromCharCode(0)

const README = [
  '# My Project',
  '',
  'Intro paragraph one.',
  '',
  '## Install',
  '',
  'npm install',
  '',
  '### Windows',
  '',
  'extra windows note',
  '',
  '## Usage',
  '',
  'run it',
  '',
].join('\n')

test('file name helpers derive extension, base name, and slug', () => {
  assert.equal(extensionOf('docs/readme.MD'), 'md')
  assert.equal(extensionOf('no-ext'), '')
  assert.equal(extensionOf(undefined), '')
  assert.equal(fileBaseName('E:\\docs\\my_notes.txt'), 'my notes')
  assert.equal(fileBaseName('???.txt'), 'document')
  assert.equal(documentSlug('DeepSeek 插件开发经验.md'), 'deepseek-插件开发经验')
})

test('scanHeadings sees levels and ignores fenced code', () => {
  const doc = '# Top\n\nbody\n\n```js\n# not a heading\n```\n\n## Real\n'
  const headings = scanHeadings(doc.split('\n'))
  assert.deepEqual(headings.map((h) => h.level + ':' + h.text), ['1:Top', '2:Real'])
})

test('normalizeDocument strips a BOM, CRLF, and trailing space', () => {
  assert.equal(normalizeDocument(BOM + 'a\r\nb\r\nc\n\n\n'), 'a\nb\nc')
})

test('chooseSplitLevel prefers the shallowest level with at least two headings', () => {
  const headings = [{ level: 1 }, { level: 2 }, { level: 2 }]
  assert.equal(chooseSplitLevel(headings), 2)
  assert.equal(chooseSplitLevel([{ level: 1 }, { level: 1 }]), 1)
  assert.equal(chooseSplitLevel([{ level: 3 }]), 3)
  assert.equal(chooseSplitLevel([]), 0)
})

test('classifyDocument refuses containers, binary data, empties, and oversize', () => {
  assert.equal(classifyDocument({ name: 'a.pdf', text: 'x' }).ok, false)
  assert.equal(classifyDocument({ name: 'a.pdf', text: 'x' }).reason, 'binary-type')
  assert.equal(classifyDocument({ name: 'a.txt', text: 'x' + NUL + 'y' }).reason, 'binary-content')
  assert.equal(classifyDocument({ name: 'a.txt', text: '   \n ' }).reason, 'empty')
  const big = classifyDocument({ name: 'a.txt', text: 'x'.repeat(500), maxChars: 100 })
  assert.equal(big.reason, 'too-large')
  assert.ok(big.message.includes('500'), big.message)
  assert.deepEqual(classifyDocument({ name: 'a.md', text: 'fine' }), { ok: true, extension: 'md' })
})

test('default document cap accepts a multi-million-character novel before chapter splitting', () => {
  assert.equal(DEFAULT_MAX_DOC_CHARS, 10_000_000)
  const verdict = classifyDocument({ name: '长篇小说.txt', text: '字'.repeat(2_841_750) })
  assert.deepEqual(verdict, { ok: true, extension: 'txt' })
})

test('a unique top heading becomes the document title', () => {
  assert.equal(deriveDocumentTitle('some-file.md', scanHeadings(README.split('\n'))), 'My Project')
  assert.equal(deriveDocumentTitle('some-file.md', []), 'some file')
})

test('splitDocument cuts a README on its real sections', () => {
  const split = splitDocument({ name: 'guide.md', text: README })
  assert.equal(split.docTitle, 'My Project')
  assert.equal(split.docSlug, 'guide')
  // level-2 split: Intro (preamble) + Install + Usage
  assert.equal(split.sections.length, 3)
  assert.equal(split.sections[0].kind, 'section')
  assert.equal(split.sections[0].heading, 'My Project')
  assert.ok(split.sections[0].body.includes('Intro paragraph one.'))
  assert.equal(split.sections[1].heading, 'Install')
  assert.ok(split.sections[1].body.includes('### Windows'))
  assert.equal(split.sections[2].heading, 'Usage')
})

test('a long preamble becomes its own note instead of inflating the first section', () => {
  const preamble = 'preamble words. '.repeat(60).trim()
  const doc = preamble + '\n\n# Only\n\ncontent'
  const split = splitDocument({ name: 'x.md', text: doc })
  assert.equal(split.sections[0].kind, 'intro')
  assert.equal(split.sections[1].heading, 'Only')
})

test('a document with no headings splits on paragraphs and numbered titles', () => {
  const paragraphs = []
  for (let index = 0; index < 5; index += 1) paragraphs.push('paragraph ' + index + ': ' + 'word '.repeat(20))
  const split = splitDocument({ name: 'log.txt', text: paragraphs.join('\n\n'), targetChars: 200 })
  assert.equal(split.sections.length, 5)
  assert.equal(split.sections[0].kind, 'segment')
  assert.equal(split.sections[0].heading, '')
})

test('oversized sections are cut into numbered parts with distinct origins', () => {
  const paragraphs = Array.from({ length: 8 }, (_, index) => 'chunk ' + index + ': ' + 'word '.repeat(40))
  const big = '# T\n\n' + paragraphs.join('\n\n')
  const split = splitDocument({ name: 'big.md', text: big, targetChars: 1200 })
  assert.ok(split.sections.length > 1, 'expected parts, got ' + split.sections.length)
  for (const section of split.sections) {
    assert.ok(section.body.length <= 1300, 'part over budget: ' + section.body.length)
    assert.equal(section.parts, split.sections.length)
  }
  const origins = split.sections.map((section, index) => sectionOrigin('big', section, index))
  assert.equal(new Set(origins).size, origins.length, 'origins must be unique')
})

test('section titles compose document, heading, and part numbers', () => {
  assert.equal(sectionTitle('Doc', { kind: 'section', heading: 'Part', part: 1, parts: 1, segment: 1, segments: 1 }), 'Doc · Part')
  assert.equal(sectionTitle('Doc', { kind: 'intro', heading: '', part: 1, parts: 1, segment: 1, segments: 1 }), 'Doc · 前言')
  assert.equal(sectionTitle('Doc', { kind: 'segment', heading: '', part: 1, parts: 1, segment: 3, segments: 5 }), 'Doc · 第 3 段')
  assert.equal(sectionTitle('Doc', { kind: 'section', heading: 'Part', part: 2, parts: 3, segment: 1, segments: 1 }), 'Doc · Part (2/3)')
  assert.equal(sectionTitle('Same', { kind: 'section', heading: 'Same', part: 1, parts: 1, segment: 1, segments: 1 }), 'Same')
})

test('buildImportDrafts stamps every draft with import tags and stable origins', () => {
  const built = buildImportDrafts({ name: 'guide.md', text: README, tags: ['extra'] })
  assert.equal(built.drafts.length, 3)
  for (const draft of built.drafts) {
    assert.deepEqual(draft.tags, ['import', 'guide', 'extra'])
    assert.ok(draft.origin.startsWith(ORIGIN_PREFIX + 'guide#'), draft.origin)
    assert.ok(draft.body.length > 0)
    assert.equal(draft.parts, 1)
  }
  assert.equal(built.drafts[1].origin, ORIGIN_PREFIX + 'guide#install')
  assert.equal(built.drafts[1].title, 'My Project · Install')
  // Rebuilding the same document yields byte-identical origins: the update key.
  const rebuilt = buildImportDrafts({ name: 'guide.md', text: README, tags: ['other'] })
  assert.deepEqual(rebuilt.drafts.map((d) => d.origin), built.drafts.map((d) => d.origin))
})

test('splitBySize cuts at paragraph boundaries and never loses text', () => {
  const paragraphs = Array.from({ length: 12 }, (_, index) => 'para ' + index + ' ' + 'a'.repeat(40))
  const parts = splitBySize(paragraphs.join('\n\n'), 220)
  assert.ok(parts.length > 1, 'got ' + parts.length)
  assert.equal(parts.join('\n\n').replace(/\s/g, '').length, paragraphs.join('\n\n').replace(/\s/g, '').length)
  assert.deepEqual(splitBySize('', 100), [])
  assert.deepEqual(splitBySize('short', 1000), ['short'])
})

test('the size budget is clamped to the configured floor', () => {
  const many = 'x'.repeat(2000)
  const parts = splitBySize(many, 10)
  assert.ok(parts.length >= 5, 'expected at least 5 parts at the MIN_TARGET_CHARS floor')
  assert.ok(DEFAULT_TARGET_CHARS >= 400, 'the default target stays comfortable to read')
})
