import assert from 'node:assert/strict'
import { test } from 'node:test'
import { inflateRawSync } from 'node:zlib'
import { exportWritingDocument, writingDocument, spreadsheetRows } from '../noval-writing-export.js'
import { hostFixture } from './helpers/host-fixture.mjs'

// Independently read the ZIP local records to inspect the actual produced OOXML.
function unzip(data) {
  const files = {}; let offset = 0
  while (data.readUInt32LE(offset) === 0x04034b50) {
    const size = data.readUInt32LE(offset + 18), n = data.readUInt16LE(offset + 26), extra = data.readUInt16LE(offset + 28)
    const name = data.subarray(offset + 30, offset + 30 + n).toString(); const start = offset + 30 + n + extra
    files[name] = inflateRawSync(data.subarray(start, start + size)).toString(); offset = start + size
  }
  return files
}
const project = () => ({ title: '长夜<&>"/测试', premise: '全书梗概。', plot: { ending: '全书结局。' }, volumes: [{ id: 'v', title: '卷一', summary: '分卷概要。', plannedChapterCount: 55, chapters: Array.from({ length: 55 }, (_, i) => ({ id: `c${i}`, number: String(i + 1), title: `章-${i}`, summary: `第${i + 1}章的完整概要。`, events: ['完整事件<一>。'], dialogueNotes: '=HYPERLINK("https://example.test")', endingHook: '下一章衔接。', scenes: [{ id: 's', title: '完整场景', goal: '找到证据。', conflict: '守卫拒绝。', beats: '绕道查找后发现线索。', outcome: '取得证据。' }] })) }] })

test('all six exports contain every chapter, are distinct from JSON and preserve source', () => {
  const p = project(), before = structuredClone(p)
  for (const kind of ['outline', 'detail']) for (const format of ['md', 'docx', 'xlsx']) {
    const file = exportWritingDocument(p, kind, format, 12), bytes = Buffer.from(file.base64, 'base64')
    assert.equal(bytes.length, file.bytes)
    assert.ok(file.filename.endsWith(`.${format}`)); assert.doesNotMatch(file.filename, /[<>"/]/)
    const content = format === 'md' ? bytes.toString() : Object.values(unzip(bytes)).join('\n')
    assert.match(content, /章-54/)
    assert.match(content, /第55章的完整概要/)
    assert.match(content, /已保存版本 12/)
    if (kind === 'detail') { assert.match(content, /绕道查找后发现线索/); assert.match(content, /手写备注/) }
    else { assert.match(content, /全书结局/); assert.doesNotMatch(content, /绕道查找后发现线索/) }
    if (format === 'xlsx') { assert.doesNotMatch(content, /<f[ >]/); assert.match(content, /t="inlineStr"/); assert.match(content, /ySplit="2"/) }
  }
  assert.deepEqual(p, before)
})

test('long prose, multiline text and emoji survive Word and Excel without silent truncation', () => {
  const p = project(); p.volumes[0].chapters = [p.volumes[0].chapters[0]]; const text = '全文🌙'.repeat(3000) + '\n结尾不能丢。'; p.volumes[0].chapters[0].summary = text
  const word = unzip(Buffer.from(exportWritingDocument(p, 'detail', 'docx').base64, 'base64'))['word/document.xml']
  assert.match(word, /结尾不能丢。/); assert.equal((word.match(/全文🌙/gu) || []).length, 3000)
  const rows = spreadsheetRows(writingDocument(p, 'detail'))
  const parts = rows.filter(r => /^章节概要/u.test(r[2])).map(r => r[3])
  assert.equal(parts.join('').replaceAll('\n', ''), text.replaceAll('\n', ''))
  assert.ok(parts.every(s => s.length < 32767)); assert.ok(parts.length > 1)
})

test('empty detail is explicitly marked, invalid formats fail and stale exports cannot bypass revision checks', async t => {
  assert.match(Buffer.from(exportWritingDocument({ volumes: [{ id: 'v', chapters: [{ id: 'c' }] }] }, 'detail', 'md').base64, 'base64').toString(), /【待补充】/)
  assert.throws(() => exportWritingDocument({}, 'outline', 'pdf'), /format/)
  const f = await hostFixture(t); await f.setProject(project())
  const state = f.service.stateForWorkspace(f.handle)
  const file = await f.service.exportWriting(f.handle, 'detail', 'docx', state.revision)
  assert.ok(file.bytes > 0)
  await assert.rejects(f.service.exportWriting(f.handle, 'detail', 'docx', state.revision - 1), /项目已变化/)
  assert.equal(f.service.stateForWorkspace(f.handle).revision, state.revision)
})

test('long titles and labels remain visible in Excel continuation rows', () => {
  const text = '长标题🌙'.repeat(48)
  const rows = spreadsheetRows({ title: '测试', blocks: [{ type: 'field', volume: text, chapter: text, label: text, text: '完整内容。' }] }).slice(2)
  for (const col of [0, 1, 2]) {
    assert.equal(rows.map(row => row[col]).join('').replaceAll('\n', ''), text)
    assert.ok(rows.every(row => row[col].split('\n').length <= 5))
  }
  const doc = writingDocument({}, 'outline')
  assert.ok(!doc.blocks.some(block => block.text === '成长体系'))
})
