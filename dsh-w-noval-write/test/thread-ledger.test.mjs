import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  analyzeThreads,
  defaultProject,
  defaultState,
  mergeProject,
  normalizeProject,
  normalizeState,
  projectExportDocument,
  projectFromImportDocument,
  projectPrompt,
  projectShapeIssues,
  removeThread,
  threadsForChapter,
  upsertThread,
} from '../noval-write-core.js'

// Fifteen chapters; the first eleven have begun, so chapter index 10 is current.
function outlineProject(threads = []) {
  const project = defaultProject()
  project.characters = [{ id: 'shen', name: '沈砚' }, { id: 'lu', name: '陆知微' }]
  project.volumes = [{
    id: 'v1',
    title: '第一卷',
    chapters: Array.from({ length: 15 }, (_, index) => ({
      id: `c${index + 1}`,
      number: String(index + 1),
      title: `第${index + 1}章`,
      status: index < 10 ? 'done' : index === 10 ? '写作中' : 'planned',
    })),
  }]
  project.threads = threads
  return normalizeProject(project)
}

const byId = insight => new Map(insight.threads.map(info => [info.id, info]))

test('v4 projects gain an empty ledger and threads normalize to canonical defaults', () => {
  const legacy = defaultProject()
  delete legacy.threads
  const state = normalizeState({ schemaVersion: 4, revision: 3, project: legacy })
  assert.equal(state.schemaVersion, 5)
  assert.deepEqual(state.project.threads, [])

  const project = normalizeProject({
    characters: [{ id: 'shen', name: '沈砚' }],
    threads: [
      { id: 't1', title: ' 讣告 ', kind: 'nonsense', importance: 'huge', status: 'maybe', characterIds: ['shen', '沈砚', 'ghost'], plantedChapterId: 'deleted-chapter', beats: [{ note: '' }, { note: '再提一次' }] },
      { id: 't1', title: '重复 id' },
    ],
  })
  const [first, second] = project.threads
  assert.equal(first.title, '讣告')
  assert.equal(first.kind, 'foreshadowing')
  assert.equal(first.importance, 'major')
  assert.equal(first.status, 'open')
  assert.deepEqual(first.characterIds, ['shen'])
  assert.equal(first.plantedChapterId, 'deleted-chapter', 'chapter references survive a deleted chapter')
  assert.deepEqual(first.beats.map(beat => beat.note), ['再提一次'])
  assert.notEqual(second.id, 't1')
})

test('shape validation rejects malformed threads before any write', () => {
  const issues = projectShapeIssues({ threads: [{ id: 't', status: 'finished', characterIds: 'shen', beats: [{ chapterId: 'c1' }], extra: 1 }] }, { partial: true })
  assert.ok(issues.some(issue => /status must be one of/.test(issue)))
  assert.ok(issues.some(issue => /characterIds must be an array/.test(issue)))
  assert.ok(issues.some(issue => /beats\[0\]\.note is required/.test(issue)))
  assert.ok(issues.some(issue => /extra is not part/.test(issue)))
  assert.deepEqual(projectShapeIssues({ threads: [] }, { partial: true }), [])
})

test('analysis places threads on the outline and flags overdue, due, soon, unplanned, and idle ones', () => {
  const insight = analyzeThreads(outlineProject([
    { id: 'late', title: '迟到', plantedChapterId: 'c1', plannedPayoffChapterId: 'c4', beats: [{ chapterId: 'c9', note: '呼应' }] },
    { id: 'now', title: '本章', plantedChapterId: 'c2', plannedPayoffChapterId: 'c11' },
    { id: 'soon', title: '将至', plantedChapterId: 'c3', plannedPayoffChapterId: 'c13' },
    { id: 'far', title: '远期', plantedChapterId: 'c5', plannedPayoffChapterId: 'c15' },
    { id: 'idle', title: '久置', plantedChapterId: 'c1', plannedPayoffChapterId: 'c15' },
    { id: 'none', title: '未规划', plantedChapterId: 'c6' },
    { id: 'done', title: '已收', status: 'resolved', plantedChapterId: 'c1', resolvedChapterId: 'c7' },
    { id: 'gone', title: '放弃', status: 'dropped' },
    { id: 'odd', title: '倒挂', status: 'resolved', plantedChapterId: 'c9', plannedPayoffChapterId: 'c2' },
  ]))
  assert.equal(insight.currentIndex, 10)
  assert.equal(insight.currentChapter.id, 'c11')
  const info = byId(insight)
  assert.equal(info.get('late').state, 'overdue')
  assert.equal(info.get('late').lastTouchIndex, 8, 'beats count as touches')
  assert.equal(info.get('now').state, 'due')
  assert.equal(info.get('soon').state, 'soon')
  assert.equal(info.get('far').state, 'open')
  assert.equal(info.get('idle').stale, true)
  assert.equal(info.get('idle').idleChapters, 10)
  assert.equal(info.get('far').stale, false)
  assert.equal(info.get('none').state, 'unplanned')
  assert.equal(info.get('done').state, 'resolved')
  assert.equal(info.get('gone').state, 'dropped')
  assert.deepEqual(info.get('odd').warnings, ['payoff-before-plant', 'resolved-without-chapter'])
  assert.deepEqual(
    { active: insight.counts.active, overdue: insight.counts.overdue, due: insight.counts.due, soon: insight.counts.soon, unplanned: insight.counts.unplanned, stale: insight.counts.stale, resolved: insight.counts.resolved, dropped: insight.counts.dropped },
    { active: 6, overdue: 1, due: 1, soon: 1, unplanned: 1, stale: 1, resolved: 2, dropped: 1 },
  )
})

test('with no chapter started nothing is overdue and missing chapters are reported', () => {
  const project = outlineProject([{ id: 't', title: '线', plantedChapterId: 'c1', plannedPayoffChapterId: 'gone' }])
  project.volumes[0].chapters.forEach(chapter => { chapter.status = 'planned' })
  const insight = analyzeThreads(project)
  assert.equal(insight.currentIndex, -1)
  assert.equal(insight.threads[0].state, 'unplanned')
  assert.deepEqual(insight.threads[0].warnings, ['missing-chapter'])
})

test('targeted upserts create, patch, echo, and validate outline and character references', () => {
  let project = outlineProject()
  project = upsertThread(project, 'obit', { title: '讣告的作者', kind: 'mystery', importance: 'core', plantedChapterId: 'c1', plannedPayoffChapterId: 'c10', characterIds: ['沈砚'], customFields: { 线索: '报纸' } })
  assert.equal(project.threads[0].id, 'obit')
  assert.deepEqual(project.threads[0].characterIds, ['shen'], 'names resolve to ids')

  project = upsertThread(project, 'obit', { knownByIds: ['lu'], customFields: { 线索: '', 备注: '晚报' } }, { addBeat: { chapterId: 'c5', note: '沈砚再次看到报纸' } })
  const thread = project.threads[0]
  assert.equal(thread.title, '讣告的作者', 'omitted fields are preserved')
  assert.deepEqual(thread.knownByIds, ['lu'])
  assert.deepEqual(thread.customFields, { 备注: '晚报' })
  assert.deepEqual(thread.beats.map(beat => [beat.chapterId, beat.note]), [['c5', '沈砚再次看到报纸']])

  project = upsertThread(project, 'obit', { status: 'resolved', resolvedChapterId: 'c10', resolution: '老周承认' })
  assert.equal(project.threads[0].status, 'resolved')

  assert.throws(() => upsertThread(project, 'obit', { plannedPayoffChapterId: 'c99' }), /not an outline chapter id/)
  assert.throws(() => upsertThread(project, 'obit', { characterIds: ['nobody'] }), /does not identify a unique character/)
  assert.throws(() => upsertThread(project, 'obit', { status: 'finished' }), /INVALID_NOVEL_ARGUMENTS/)
  assert.throws(() => upsertThread(project, 'obit', { id: 'other' }), /patch\.id is not allowed/)
  assert.throws(() => upsertThread(project, 'fresh', { setup: 'no title' }), /needs a non-empty title/)
  assert.throws(() => upsertThread(project, 'obit', {}), /must not be empty/)
  assert.throws(() => upsertThread(project, 'obit', {}, { addBeat: { chapterId: 'c2', note: ' ' } }), /add_beat\.note/)

  project = removeThread(project, 'obit')
  assert.deepEqual(project.threads, [])
  assert.throws(() => removeThread(project, 'obit'), /unknown thread/)
})

test('per-chapter focus lists what to pay off, echo, and keep alive', () => {
  const project = outlineProject([
    { id: 'late', title: '迟到', plantedChapterId: 'c1', plannedPayoffChapterId: 'c4' },
    { id: 'here', title: '此处', plantedChapterId: 'c2', plannedPayoffChapterId: 'c11', importance: 'core' },
    { id: 'next', title: '下一章', plantedChapterId: 'c11', plannedPayoffChapterId: 'c12', beats: [{ chapterId: 'c11', note: '提一句' }] },
  ])
  const focus = threadsForChapter(project, 'c11')
  assert.equal(focus.chapter.id, 'c11')
  assert.deepEqual(focus.payoffHere.map(thread => thread.id), ['here'])
  assert.deepEqual(focus.overdueBefore.map(thread => thread.id), ['late'])
  assert.deepEqual(focus.dueSoonAfter.map(thread => thread.id), ['next'])
  assert.deepEqual(focus.plantedHere.map(thread => thread.id), ['next'])
  assert.deepEqual(focus.echoedHere.map(thread => thread.id), ['next'])
  assert.throws(() => threadsForChapter(project, 'missing'), /unknown chapter/)
})

test('patches and portable exports keep the ledger intact', () => {
  const project = outlineProject([{ id: 't', title: '线', plantedChapterId: 'c1' }])
  assert.deepEqual(mergeProject(project, { title: '新书名' }).threads, project.threads)
  assert.deepEqual(mergeProject(project, { threads: [] }).threads, [])
  const state = defaultState(0)
  state.project = project
  const exported = projectExportDocument(state, { title: 'room' }, 0)
  assert.deepEqual(projectFromImportDocument(exported).threads, project.threads)
  const legacyExport = structuredClone(exported)
  delete legacyExport.project.threads
  assert.deepEqual(projectFromImportDocument(legacyExport).threads, [], 'v4 exports without threads still import')
})

test('the prompt lists active threads by urgency and keeps truths marked hidden', () => {
  const prompt = projectPrompt(outlineProject([
    { id: 'far', title: '远期', plantedChapterId: 'c5', plannedPayoffChapterId: 'c15' },
    { id: 'late', title: '迟到', plantedChapterId: 'c1', plannedPayoffChapterId: 'c4', truth: '老周写的', kind: 'mystery', importance: 'core' },
    { id: 'done', title: '已收', status: 'resolved' },
  ]), 20_000)
  assert.match(prompt, /## Story threads/)
  assert.match(prompt, /Current chapter: #11 第11章/)
  assert.ok(prompt.indexOf('[OVERDUE] 迟到') < prompt.indexOf('[OPEN] 远期'), 'overdue threads come first')
  assert.match(prompt, /truth \(hidden until payoff\): 老周写的/)
  assert.doesNotMatch(prompt, /已收/, 'settled threads are not repeated')
  assert.match(prompt, /novel_threads\(chapter_id\)/)
  assert.doesNotMatch(projectPrompt(defaultProject()), /novel_threads/, 'no ledger guidance without threads')
})
