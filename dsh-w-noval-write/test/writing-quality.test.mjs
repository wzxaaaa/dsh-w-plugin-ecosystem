import assert from 'node:assert/strict'
import { test } from 'node:test'
import { normalizeProject, projectPrompt, upsertVolume } from '../noval-write-core.js'
import { auditNovel } from '../noval-quality.js'
import { hostFixture } from './helpers/host-fixture.mjs'

const chapter = (id, number) => ({ id, number: String(number), title: `Chapter ${number}`, summary: '主角为寻找证据进入仓库，发现账本被替换，决定追查搬运人。', events: ['进入仓库找到假账本，因此追查当夜搬运人。'], endingHook: '搬运人的名字指向主角的老师。', scenes: [{ id: `scene-${id}`, goal: '找到原账本。', conflict: '守卫阻止进入。', beats: '以送货名义进入，核对封条后发现账本已调包。', outcome: '取得搬运单，嫌疑转向老师。' }] })
const book = () => normalizeProject({ title: '测试书', volumes: [{ id: 'v', title: '第一卷', summary: '追查假账本，揭开老师的秘密。', plannedChapterCount: 2, chapters: [chapter('c1', 1), chapter('c2', 2)] }] })

test('audit detects missing tail chapters, number gaps, empty detail and placeholder modules', () => {
  const p = book(); p.volumes[0].plannedChapterCount = 4; p.volumes[0].chapters[1].number = '3'; p.volumes[0].chapters[1].scenes = []
  const a = auditNovel(p)
  assert.equal(a.complete, false)
  for (const code of ['chapter_count', 'number_gap', 'missing']) assert.ok(a.issues.some(i => i.code === code))
  p.world = { era: '古代', geography: '沿河城市', rules: '待补充' }
  assert.ok(auditNovel(p, { scope: 'world' }).issues.some(i => i.code === 'placeholder'))
})

test('language warnings are not punctuation mandates; optional fields may stay empty', () => {
  const p = book(); p.volumes[0].chapters[0].summary = '主角寻找证据，因为'
  const a = auditNovel(p)
  assert.equal(a.complete, true)
  assert.equal(a.warnings, 1)
  p.volumes[0].chapters[0].summary = '主角找到证据后离开仓库'
  assert.equal(auditNovel(p).warnings, 0)
  assert.equal(auditNovel(p, { scope: 'outline' }).complete, true)
})

test('legacy plans remain unknown, counts validate and long facts never become half-sentences', () => {
  const legacy = normalizeProject({ volumes: [{ id: 'v', chapters: [] }] })
  assert.equal(legacy.volumes[0].plannedChapterCount, 0)
  assert.throws(() => upsertVolume(legacy, 'v', { plannedChapterCount: -1 }), /plannedChapterCount/)
  const prompt = projectPrompt({ premise: '开头'.repeat(9000) + '完整结束。' }, 2000)
  assert.ok(prompt.length <= 2000)
  assert.doesNotMatch(prompt, /开头/)
  assert.match(prompt, /novel_quality_check/)
})

test('partial-page whole-array writes cannot erase existing chapters; targeted updates preserve siblings', async t => {
  const f = await hostFixture(t); await f.setProject(book())
  const agent = { session: { id: 's' } }
  const revision = f.service.stateForWorkspace(f.handle).revision
  const patch = { volumes: [{ ...book().volumes[0], chapters: [chapter('c1', 1)] }] }
  await assert.rejects(f.tools.find(t => t.name === 'novel_patch').execute({ expected_revision: revision, patch }, { agent }), /NOVEL_OUTLINE_REMOVAL/)
  await assert.rejects(f.tools.find(t => t.name === 'novel_write').execute({ expected_revision: revision, project: { ...book(), ...patch } }, { agent }), /NOVEL_OUTLINE_REMOVAL/)
  assert.equal(f.service.stateForWorkspace(f.handle).revision, revision)
  await f.tools.find(t => t.name === 'novel_chapter_upsert').execute({ expected_revision: revision, volume_id: 'v', chapter_id: 'c1', patch: { summary: '新的完整概要。' } }, { agent })
  assert.deepEqual(JSON.parse(JSON.stringify(f.service.stateForWorkspace(f.handle).project.volumes[0].chapters[1])), book().volumes[0].chapters[1])
})

test('an unchanged chapter save does not conclude the remaining multi-chapter task', async t => {
  const f = await hostFixture(t); await f.setProject(book()); let concluded = false
  const result = await f.tools.find(t => t.name === 'novel_chapter_upsert').execute({ expected_revision: f.service.stateForWorkspace(f.handle).revision, volume_id: 'v', chapter_id: 'c1', patch: { title: 'Chapter 1' } }, { agent: { session: { id: 's' } }, concludeTurn: () => { concluded = true } })
  assert.equal(result.changed, false); assert.equal(result.stop, false); assert.equal(concluded, false)
})

test('quality delivery gate rechecks saved data, retries are bounded, abort/new-turn/rebind are respected', async t => {
  const f = await hostFixture(t); const p = book(); p.volumes[0].chapters.pop(); await f.setProject(p)
  const notices = [], agent = { session: { id: 's', events: [{ type: 'turn/start', data: { turn: 1 } }] }, inject: message => notices.push(message) }
  const check = f.tools.find(t => t.name === 'novel_quality_check')
  const report = await check.execute({ scope: 'detail', require_complete: true, limit: 1 }, { agent })
  assert.equal(report.complete, false)
  const stop = (turn = 1, aborted = false) => f.service.finishWritingTurn({ agent, turn, signal: { aborted } })
  await stop(1, true); await stop(2); assert.equal(notices.length, 0)
  await stop(); assert.equal(notices.length, 1)
  await f.setProject(book()); await stop(); assert.equal(notices.length, 1)
  await f.setProject(p); await stop(); assert.equal(notices.length, 2)
  await assert.rejects(stop(), e => e.code === 'NOVEL_PLAN_INCOMPLETE')
  await f.service.unbindNovel('s'); await stop()
})

test('outline pagination exposes an actionable continuation, including after chapter fifty', async t => {
  const f = await hostFixture(t); const p = book(); p.volumes[0].plannedChapterCount = 55; p.volumes[0].chapters = Array.from({ length: 55 }, (_, i) => chapter(`c${i}`, i + 1)); await f.setProject(p)
  const read = f.tools.find(t => t.name === 'novel_outline_read')
  const first = await read.execute({ volume_id: 'v' }, { agent: { session: { id: 's' } } })
  const volumes = first.volumes
  assert.equal(volumes[0].nextOffset, 50); assert.equal(volumes[0].hasMore, true)
  const last = await read.execute({ volume_id: 'v', offset: 50 }, { agent: { session: { id: 's' } } })
  assert.equal(last.volumes[0].returnedChapters, 5); assert.equal(last.volumes[0].nextOffset, null)
})
