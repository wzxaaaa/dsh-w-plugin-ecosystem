import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  analyzeProgression, analyzeThreads, chapterSequence, isAmbiguousChapterReference,
  normalizeProject, projectExportDocument, projectFromImportDocument, upsertChapter,
  upsertProgressionRecord, upsertThread,
} from '../noval-write-core.js'

function legacyBook() {
  return {
    characters: [{ id: 'hero', name: '主角' }],
    volumes: [
      { id: 'v1', chapters: [{ id: 'c1', title: '第一卷开头', status: '初稿', manuscriptFile: '卷一.md' }, { id: 'v1-c1', title: '已有唯一ID' }] },
      { id: 'v2', chapters: [{ id: 'c1', title: '第二卷开头', status: '初稿', manuscriptFile: '卷二.md' }, { id: 'unique', title: '唯一章节' }] },
    ],
    threads: [{ id: 't', title: '旧伏笔', plantedChapterId: 'c1', plannedPayoffChapterId: 'unique', beats: [{ chapterId: 'c1', note: '旧引用无卷号' }] }],
    progression: { records: [{ id: 'r', characterId: 'hero', chapterId: 'c1', holdings: '旧宝剑' }] },
  }
}

test('duplicate chapter ids migrate globally without choosing a volume for old references', () => {
  const project = normalizeProject(legacyBook())
  const chapters = chapterSequence(project)
  assert.equal(new Set(chapters.map(chapter => chapter.id)).size, chapters.length)
  assert.deepEqual(project.volumes.map(volume => volume.chapters.map(chapter => chapter.id)), [['v1-c1-2', 'v1-c1'], ['v2-c1', 'unique']])
  assert.equal(project.volumes[0].chapters[0].manuscriptFile, '卷一.md')
  assert.equal(project.volumes[1].chapters[0].manuscriptFile, '卷二.md')
  assert.equal(project.threads[0].plantedChapterId, 'ambiguous:c1')
  assert.equal(project.threads[0].beats[0].chapterId, 'ambiguous:c1')
  assert.equal(project.threads[0].plannedPayoffChapterId, 'unique')
  assert.equal(project.progression.records[0].chapterId, 'ambiguous:c1')
  assert.equal(isAmbiguousChapterReference(project.progression.records[0].chapterId), true)
  const thread = analyzeThreads(project).threads[0]
  assert.equal(thread.plantedIndex, -1)
  assert.deepEqual(thread.warnings, ['ambiguous-chapter'])
  const progression = analyzeProgression(project)
  assert.deepEqual(progression.states, [], 'ambiguous history never becomes a later-volume state')
  assert.equal(progression.warnings[0].code, 'ambiguous-chapter')
  assert.deepEqual(normalizeProject(project), project, 'migrated ids and unresolved references are stable')
  assert.deepEqual(projectFromImportDocument(projectExportDocument({ project })), project)
  const reversed = normalizeProject({ ...project, volumes: [...project.volumes].reverse() })
  assert.deepEqual(new Set(chapterSequence(reversed).map(chapter => chapter.id)), new Set(chapters.map(chapter => chapter.id)))
})

test('ambiguous records can be explicitly reassigned to the intended unique chapter', () => {
  let project = normalizeProject(legacyBook())
  project = upsertProgressionRecord(project, 'r', { chapterId: 'v1-c1-2' }).project
  project = upsertThread(project, 't', { plantedChapterId: 'v1-c1-2', beats: [{ chapterId: 'v2-c1', note: '第二卷再次提及' }] })
  assert.equal(analyzeProgression(project).states[0].holdings, '旧宝剑')
  assert.deepEqual(analyzeProgression(project).warnings, [])
  assert.deepEqual(analyzeThreads(project).threads[0].warnings, [])
})

test('long duplicate ids remain unique and stable within the canonical 100-character bound', () => {
  const project = normalizeProject({ volumes: [
    { id: 'a'.repeat(100), chapters: [{ id: 'c'.repeat(100) }, { id: 'c'.repeat(100) }] },
    { id: 'b'.repeat(100), chapters: [{ id: 'c'.repeat(100) }] },
  ] })
  const ids = chapterSequence(project).map(chapter => chapter.id)
  assert.equal(new Set(ids).size, 3)
  assert.ok(ids.every(key => key.length <= 100))
  assert.deepEqual(normalizeProject(project), project)
})

test('targeted creation cannot introduce a duplicate id or disturb existing chapter references', () => {
  let project = normalizeProject({ characters: [{ id: 'hero', name: '主角' }], volumes: [{ id: 'v1', chapters: [{ id: 'chapter-1' }] }, { id: 'v2', chapters: [] }], progression: { records: [{ id: 'r', characterId: 'hero', chapterId: 'chapter-1', holdings: '宝剑' }] } })
  assert.throws(() => upsertChapter(project, 'v2', 'chapter-1', { title: '新章' }), /globally unique/)
  project = upsertChapter(project, 'v2', '', { title: '新章' })
  assert.equal(project.volumes[0].chapters[0].id, 'chapter-1')
  assert.equal(project.volumes[1].chapters[0].id, 'v2-chapter-1')
  assert.equal(project.progression.records[0].chapterId, 'chapter-1')
})
