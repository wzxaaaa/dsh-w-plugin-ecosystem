import assert from 'node:assert/strict'
import { test } from 'node:test'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import iconv from 'iconv-lite'
import { KnowledgeStore } from '../kb-store.js'
import { buildToolSpecs } from '../kb-tools.js'

const EXEC = { agent: { session: { header: { id: 'session-1', cwd: '' } } } }

const NOVEL = [
  '第一章 觉醒',
  '',
  '林风睁开眼，窗外的雨还在下。他握紧手中的剑。',
  '',
  '第二章 出发',
  '',
  '天亮时，他已经走出了城门，头也不回。',
  '',
].join('\n')

test('kb_import decodes a GBK novel .txt and splits it by chapter', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'dsh-w-kb-gbk-'))
  const store = new KnowledgeStore({ root: join(root, 'kb'), syncIntervalMs: 0, now: () => Date.now(), random: () => Math.random() })
  const spec = buildToolSpecs({ store }).find((entry) => entry.name === 'kb_import')
  t.after(async () => { await rm(root, { recursive: true, force: true }) })

  const file = join(root, '剑客行.txt')
  await writeFile(file, iconv.encode(NOVEL, 'gb18030'))

  const done = await spec.execute({ path: file, tags: ['武侠'] }, EXEC)
  assert.equal(done.encoding, 'gb18030', 'the GBK source encoding is detected and reported')
  assert.equal(done.docTitle, '剑客行')
  assert.equal(done.counts.created, 2)

  const chapter = store.findByOrigin('import:剑客行#第一章-觉醒')
  assert.ok(chapter !== null, 'chapter one is addressable by its stable origin')
  assert.ok(chapter.body.includes('林风睁开眼'), 'the decoded body is real Chinese, not mojibake')
  assert.ok(!chapter.body.includes('�'), 'no replacement characters leaked in')
  assert.deepEqual(chapter.tags, ['import', '剑客行', '武侠'])
})
