import assert from 'node:assert/strict'
import { writeFile, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { test } from 'node:test'
import { defaultProject } from '../noval-write-core.js'
import { hostFixture } from './helpers/host-fixture.mjs'

const setup = async t => {
  const f = await hostFixture(t)
  await f.setProject({ ...defaultProject(), volumes: [{ id: 'v', chapters: [{ id: 'c', title: 'Chapter', targetWords: '3000字' }] }] })
  const notices = []
  const agent = { session: { id: 's', events: [{ type: 'turn/start', data: { turn: 1 } }] }, inject: value => notices.push(value) }
  const save = args => f.tool.execute({ filename: 'chapter.md', chapter_id: 'c', volume_id: 'v', ...args }, { agent })
  const stopping = () => f.handlers.get('agent/turn-stopping')({ agent, turn: 1, signal: new AbortController().signal })
  return { ...f, agent, notices, save, stopping }
}

test('a rejected draft cannot be abandoned as a completed turn; a counted retry clears it', async t => {
  const f = await setup(t)
  await assert.rejects(f.save({ content: '字'.repeat(2144) }), /NOVEL_CHAPTER_WORD_COUNT/)
  await f.stopping()
  assert.equal(f.notices.length, 1)
  assert.match(f.notices[0].content[0].text, /2144 字.*856 字/s)
  assert.equal(f.notices[0].source.kind, 'dsh-w-noval-write')
  await f.save({ content: '字'.repeat(3100) })
  await f.stopping()
  assert.equal(f.notices.length, 1)
  assert.equal((await readFile(join(f.book.path, 'chapter.md'), 'utf8')).length, 3100)
})

test('an old valid file does not certify this turn\'s rejected rewrite; repeated failure stops', async t => {
  const f = await setup(t)
  await f.save({ content: '字'.repeat(3100) })
  await assert.rejects(f.save({ content: '字'.repeat(2144), overwrite: true }), /NOVEL_CHAPTER_WORD_COUNT/)
  await f.stopping(); await f.stopping()
  await assert.rejects(f.stopping(), error => error.code === 'NOVEL_CHAPTER_INCOMPLETE')
  assert.equal(f.notices.length, 2)
  assert.equal((await readFile(join(f.book.path, 'chapter.md'), 'utf8')).length, 3100)
})

test('abort, later turns and changed bindings do not revive old chapter corrections', async t => {
  const f = await setup(t)
  await assert.rejects(f.save({ content: '字' }), /NOVEL_CHAPTER_WORD_COUNT/)
  await f.service.finishWritingTurn({ agent: f.agent, turn: 1, signal: { aborted: true } })
  await f.service.finishWritingTurn({ agent: f.agent, turn: 2, signal: { aborted: false } })
  assert.equal(f.notices.length, 0)
  await f.service.unbindNovel('s')
  await f.stopping()
  assert.equal(f.notices.length, 0)
})

test('a linked existing short manuscript has authoritative deficiencies and cannot be presented', async t => {
  const f = await setup(t)
  const state = await f.service.getState(f.handle)
  state.project.volumes[0].chapters[0].manuscriptFile = 'chapter.md'
  await f.setProject(state.project)
  await writeFile(join(f.book.path, 'chapter.md'), '字'.repeat(2144))
  const listing = await f.service.listManuscripts(f.handle)
  assert.equal(listing.runtimeVersion, '0.15.0')
  assert.equal(listing.wordChecks[0].missingWords, 856)
  assert.equal(listing.wordChecks[0].ok, false)
  const gate = f.handlers.get('tools/pre-execute')
  const exec = { name: 'present', agent: f.agent, arguments: { files: [{ path: join(f.book.path, 'chapter.md') }] } }
  const rejected = await gate(exec, async () => ({ kind: 'allow' }))
  assert.equal(rejected.kind, 'deny')
  assert.match(rejected.reason, /856 字/)
  await f.stopping()
  await f.save({ content: '字'.repeat(3100), overwrite: true })
  assert.equal((await gate(exec, async () => ({ kind: 'allow' }))).kind, 'allow')
})

test('bound conversations receive chapter constraints without requiring a /write task', async t => {
  const f = await setup(t)
  assert.equal(f.service.linkForAgent(f.agent), null)
  const prompt = f.sections[0].text({ agent: f.agent })
  assert.match(prompt, /Bound novel/)
  assert.match(prompt, /3000字/)
  assert.match(prompt, /novel_save_chapter/)
  assert.equal((await f.service.getState(f.handle)).runtimeVersion, '0.15.0')
})
