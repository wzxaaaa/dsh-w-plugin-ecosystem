import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import vm from 'node:vm'
import { analyzeThreads, defaultProject, normalizeProject } from '../noval-write-core.js'

// The panel re-implements the ledger analysis so it can judge an unsaved
// draft; this keeps its verdicts identical to the host's.
function clientAnalyzer() {
  const source = readFileSync(new URL('../client.js', import.meta.url), 'utf8')
  const start = source.indexOf('    var UNSTARTED_CHAPTER_STATUS')
  const end = source.indexOf('    function compareThreads(', start)
  assert.ok(start !== -1 && end > start)
  return vm.runInNewContext(`${source.slice(start, end)}\nanalyzeThreads`, { Map })
}

test('client and host classify every thread the same way', () => {
  const project = defaultProject()
  project.volumes = [
    { id: 'v1', title: 'I', chapters: Array.from({ length: 8 }, (_, i) => ({ id: `a${i}`, number: String(i + 1), status: i < 7 ? '完成' : 'drafting' })) },
    { id: 'v2', title: 'II', chapters: Array.from({ length: 12 }, (_, i) => ({ id: `b${i}`, number: String(i + 9), status: i < 5 ? 'done' : '计划' })) },
  ]
  project.threads = [
    { id: 'late', title: 'late', plantedChapterId: 'a0', plannedPayoffChapterId: 'a3' },
    { id: 'due', title: 'due', plantedChapterId: 'a1', plannedPayoffChapterId: 'b4' },
    { id: 'soon', title: 'soon', plantedChapterId: 'a1', plannedPayoffChapterId: 'b7', status: 'partial' },
    { id: 'idle', title: 'idle', plantedChapterId: 'a0', plannedPayoffChapterId: 'b11', beats: [{ chapterId: 'a2', note: 'x' }] },
    { id: 'none', title: 'none', plantedChapterId: 'b3' },
    { id: 'done', title: 'done', status: 'resolved', plantedChapterId: 'a0', resolvedChapterId: 'b0' },
    { id: 'drop', title: 'drop', status: 'dropped', plannedPayoffChapterId: 'gone' },
  ]
  const normalized = normalizeProject(project)
  const host = analyzeThreads(normalized)
  const client = clientAnalyzer()(normalized)
  assert.equal(client.currentIndex, host.currentIndex)
  assert.deepEqual({ ...client.counts }, host.counts)
  for (const info of host.threads) {
    const mirror = client.byId[info.id]
    for (const key of ['state', 'active', 'plantedIndex', 'payoffIndex', 'resolvedIndex', 'lastTouchIndex', 'idleChapters', 'stale']) {
      assert.equal(mirror[key], info[key], `${info.id}.${key}`)
    }
    assert.deepEqual([...mirror.warnings], info.warnings, `${info.id}.warnings`)
  }
})
