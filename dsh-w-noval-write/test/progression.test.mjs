import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  analyzeProgression,
  builtInProgressionTemplates,
  defaultProject,
  deleteProgressionTemplate,
  describeProjectDiff,
  mergeProject,
  normalizeProgressionTemplates,
  normalizeProject,
  normalizeState,
  novelToolContract,
  progressionActive,
  projectFromImportDocument,
  projectExportDocument,
  projectPrompt,
  projectShapeIssues,
  removeProgressionRecord,
  restoreBuiltInProgressionTemplates,
  saveProgressionTemplate,
  systemFromTemplate,
  upsertProgressionRecord,
} from '../noval-write-core.js'

// Four chapters; the first three have begun, so c3 is the current chapter.
function book(progression = {}) {
  return normalizeProject({
    title: '测试书',
    characters: [{ id: 'lin', name: '林默' }, { id: 'zhao', name: '赵乾' }, { id: 'su', name: '苏晚' }],
    volumes: [{ id: 'v1', title: '卷一', chapters: [
      { id: 'c1', number: '1', status: '初稿' },
      { id: 'c2', number: '2', status: '初稿' },
      { id: 'c3', number: '3', status: '修改中' },
      { id: 'c4', number: '4', status: 'planned' },
    ] }],
    progression: {
      systems: [
        { id: 'xiuwei', name: '修为境界', tiers: [{ name: '炼气' }, { name: '筑基' }, { name: '金丹' }, { name: '元婴' }] },
        { id: 'dan', name: '炼丹品级', tiers: [{ name: '一品' }, { name: '二品' }, { name: '三品' }] },
      ],
      ...progression,
    },
  })
}

function record(project, patch, recordId = '') {
  return upsertProgressionRecord(project, recordId, patch)
}

test('old projects gain an empty, switched-off progression', () => {
  const state = normalizeState({ schemaVersion: 5, revision: 3, project: { title: 'old' } })
  assert.equal(state.schemaVersion, 6)
  assert.deepEqual(state.project.progression, { enabled: false, systems: [], records: [] })
  assert.deepEqual(defaultProject().progression, { enabled: false, systems: [], records: [] })
  assert.equal(progressionActive(state.project), false)
  assert.doesNotMatch(projectPrompt(state.project), /Progression systems/)
  assert.doesNotMatch(projectPrompt(state.project), /novel_progression_read/)
})

test('tracking turns on by switch or by having a system, for any genre', () => {
  const switched = normalizeProject({ genre: '都市', progression: { enabled: true } })
  assert.equal(progressionActive(switched), true)
  assert.match(projectPrompt(switched), /Progression tracking is on, but no system exists yet/)
  const withSystem = book()
  assert.equal(withSystem.progression.enabled, false)
  assert.equal(progressionActive(withSystem), true)
  const prompt = projectPrompt(withSystem)
  assert.match(prompt, /- 修为境界 \(xiuwei\); lowest to highest:/)
  assert.match(prompt, /- 炼丹品级 \(dan\); lowest to highest:/)
  assert.match(prompt, /novel_progression_read\(as_of_chapter_id, character_ids of the cast\)/)
})

test('tiers normalize with ids from names, unique within their system', () => {
  const project = book()
  assert.deepEqual(project.progression.systems[0].tiers.map(tier => tier.id), ['炼气', '筑基', '金丹', '元婴'])
  const duplicate = normalizeProject({ progression: { systems: [{ name: 'A', tiers: [{ name: 'x' }, { name: 'x' }] }, { name: 'A' }] } })
  assert.deepEqual(duplicate.progression.systems.map(system => system.id), ['A', 'A-2'])
  assert.deepEqual(duplicate.progression.systems[0].tiers.map(tier => tier.id), ['x', 'x-2'])
})

test('standings fold per system; condition, holdings and revealed cards belong to the character', () => {
  let project = book()
  project = record(project, { characterId: '林默', chapterId: 'c1', systemId: '修为境界', tierId: '炼气', stage: '九层', holdings: '青玄剑' }).project
  project = record(project, { characterId: 'lin', chapterId: 'c2', systemId: 'dan', tierId: '二品' }).project
  project = record(project, { characterId: 'lin', chapterId: 'c2', systemId: 'xiuwei', tierId: '筑基', revealed: '雷诀', condition: '经脉受损' }).project
  project = record(project, { characterId: 'lin', chapterId: 'c3', systemId: 'xiuwei', stage: '中期', condition: '痊愈' }).project
  project = record(project, { characterId: 'lin', chapterId: 'c4', systemId: 'xiuwei', tierId: '金丹', holdings: '青玄剑、雷珠' }).project

  const now = analyzeProgression(project, { characterIds: ['lin'] })
  assert.equal(now.asOf.id, 'c3', 'defaults to the furthest started chapter')
  const [lin] = now.states
  assert.deepEqual(lin.standings.map(item => [item.system, item.tier, item.stage, item.rank]), [['修为境界', '筑基', '中期', 1], ['炼丹品级', '二品', '', 1]])
  assert.equal(lin.condition, '痊愈')
  assert.equal(lin.holdings, '青玄剑')
  assert.deepEqual(lin.revealed.map(item => item.text), ['雷诀'])

  const early = analyzeProgression(project, { asOfChapterId: 'c1', characterIds: ['lin'] }).states[0]
  assert.deepEqual(early.standings.map(item => [item.tier, item.stage]), [['炼气', '九层']])
  const later = analyzeProgression(project, { asOfChapterId: 'c4', characterIds: ['lin'] }).states[0]
  assert.deepEqual(later.standings[0].tier, '金丹')
  assert.equal(later.standings[0].stage, '', 'a new tier starts without the old sub-stage')
  assert.equal(later.holdings, '青玄剑、雷珠')
  assert.throws(() => analyzeProgression(project, { asOfChapterId: 'nope' }), /unknown chapter/)
})

test('gaps are computed per system between requested characters', () => {
  let project = book()
  project = record(project, { characterId: 'lin', chapterId: 'c1', systemId: 'xiuwei', tierId: '筑基' }).project
  project = record(project, { characterId: 'zhao', chapterId: 'c1', systemId: 'xiuwei', tierId: '元婴' }).project
  project = record(project, { characterId: 'zhao', chapterId: 'c1', systemId: 'dan', tierId: '一品' }).project
  const insight = analyzeProgression(project, { characterIds: ['林默', '赵乾', '苏晚'] })
  assert.deepEqual(insight.gaps, [{ systemId: 'xiuwei', system: '修为境界', from: 'lin', to: 'zhao', tiers: -2 }])
  assert.deepEqual(insight.states.map(state => state.name), ['林默', '赵乾', '苏晚'], 'requested characters are listed even without records')
  assert.deepEqual(insight.states[2].standings, [])
})

test('drops and skips are flagged per system unless a note explains them', () => {
  let project = book()
  project = record(project, { characterId: 'lin', chapterId: 'c1', systemId: 'xiuwei', tierId: '金丹' }).project
  project = record(project, { characterId: 'lin', chapterId: 'c2', systemId: 'xiuwei', tierId: '炼气' }).project
  project = record(project, { characterId: 'lin', chapterId: 'c3', systemId: 'xiuwei', tierId: '元婴' }).project
  project = record(project, { characterId: 'lin', chapterId: 'c2', systemId: 'dan', tierId: '三品' }).project
  const codes = analyzeProgression(project).warnings.map(warning => `${warning.code}:${warning.chapterId}`)
  assert.deepEqual(codes.sort(), ['tier-regression:c2', 'tier-skip:c3'])
  const explained = record(project, { note: '被废修为' }, 'record-2').project
  assert.deepEqual(analyzeProgression(explained).warnings.map(warning => warning.code), ['tier-skip'])
})

test('broken references are kept and flagged, never silently dropped', () => {
  const project = normalizeProject({
    ...book(),
    progression: {
      ...book().progression,
      records: [
        { id: 'r1', characterId: 'ghost', chapterId: 'c1' },
        { id: 'r2', characterId: 'lin', chapterId: 'gone' },
        { id: 'r3', characterId: 'lin', chapterId: 'c1', systemId: 'deleted', tierId: 'x' },
        { id: 'r4', characterId: 'lin', chapterId: 'c1', systemId: 'dan', tierId: '九品' },
        { id: 'r5', characterId: 'lin', chapterId: 'c1', stage: '中期' },
      ],
    },
  })
  assert.equal(project.progression.records.length, 5)
  assert.deepEqual(analyzeProgression(project).warnings.map(warning => `${warning.code}:${warning.recordId}`), [
    'missing-character:r1', 'missing-chapter:r2', 'missing-system:r3', 'missing-tier:r4', 'tier-without-system:r5',
  ])
})

test('record upserts validate every reference and generate stable ids', () => {
  const project = book()
  const cases = [
    [{ characterId: 'nobody', chapterId: 'c1' }, /does not identify a unique character/],
    [{ characterId: 'lin', chapterId: 'c9' }, /is not an outline chapter id/],
    [{ characterId: 'lin', chapterId: 'c1', systemId: '不存在' }, /is not a progression system/],
    [{ characterId: 'lin', chapterId: 'c1', tierId: '金丹' }, /tierId needs systemId/],
    [{ characterId: 'lin', chapterId: 'c1', stage: '中期' }, /stage needs systemId/],
    [{ characterId: 'lin', chapterId: 'c1', systemId: 'dan', tierId: '金丹' }, /is not a tier of '炼丹品级'/],
    [{ characterId: 'lin', chapterId: 'c1', level: 3 }, /INVALID_NOVEL_ARGUMENTS/],
    [{}, /must not be empty/],
  ]
  for (const [patch, pattern] of cases) assert.throws(() => record(project, patch), pattern, JSON.stringify(patch))
  assert.throws(() => record(project, { note: 'x' }, 'record-9'), /unknown progression record/)

  const first = record(project, { characterId: '林默', chapterId: 'c1', systemId: '修为境界', tierId: '筑基' })
  assert.equal(first.recordId, 'record-1')
  assert.deepEqual(first.project.progression.records[0], {
    id: 'record-1', characterId: 'lin', chapterId: 'c1', systemId: 'xiuwei', tierId: '筑基',
    stage: '', condition: '', holdings: '', revealed: '', gained: '', lost: '', note: '',
  })
  const edited = record(first.project, { stage: '后期' }, 'record-1')
  assert.equal(edited.recordId, 'record-1')
  assert.equal(edited.project.progression.records[0].stage, '后期')
  assert.equal(edited.project.progression.records[0].tierId, '筑基')
  const second = record(edited.project, { characterId: 'zhao', chapterId: 'c2', condition: '中毒' })
  assert.equal(second.recordId, 'record-2')
  assert.equal(removeProgressionRecord(second.project, 'record-1').progression.records.length, 1)
  assert.throws(() => removeProgressionRecord(second.project, 'record-7'), /unknown progression record/)
})

test('patches replace systems or records without touching the other', () => {
  let project = record(book(), { characterId: 'lin', chapterId: 'c1', systemId: 'dan', tierId: '一品' }).project
  project = mergeProject(project, { progression: { systems: [{ id: 'dan', name: '炼丹品级', tiers: [{ name: '一品' }, { name: '二品' }] }] } })
  assert.equal(project.progression.systems.length, 1)
  assert.equal(project.progression.records.length, 1)
  project = mergeProject(project, { progression: { enabled: true } })
  assert.equal(project.progression.enabled, true)
  assert.equal(project.progression.systems.length, 1)
})

test('shape validation rejects malformed progression data', () => {
  const issues = projectShapeIssues({
    progression: {
      enabled: 'yes',
      label: 'x',
      systems: [{ tiers: [{ stages: 'a' }] }, 'bad'],
      records: [{ chapterId: 'c1', extra: 1 }],
    },
  }, { partial: true })
  for (const expected of [
    'project.progression.label is not part of the canonical structure',
    'project.progression.enabled must be a boolean; received string',
    'project.progression.systems[0].name is required',
    'project.progression.systems[0].tiers[0].name is required',
    'project.progression.systems[1] must be an object; received string',
    'project.progression.records[0].extra is not part of the canonical structure',
    'project.progression.records[0].characterId is required',
  ]) assert.ok(issues.includes(expected), expected)
})

test('export, import and history diffs carry progression', () => {
  const project = record(book(), { characterId: 'lin', chapterId: 'c1', systemId: 'xiuwei', tierId: '炼气' }).project
  const restored = projectFromImportDocument(projectExportDocument({ project }))
  assert.deepEqual(restored.progression, project.progression)
  const sections = describeProjectDiff(defaultProject(), project, { detail: true })
  const systems = sections.find(section => section.section === 'progressionSystems')
  assert.deepEqual(systems.addedItems, ['修为境界', '炼丹品级'])
  assert.equal(sections.find(section => section.section === 'progressionRecords').added, 1)
  const contract = novelToolContract()
  assert.ok(contract.cultivationRecordPatchSchema === undefined)
  assert.ok(contract.progressionRecordPatchSchema.properties.systemId)
  assert.ok(contract.patchSchema.properties.progression.properties.systems)
})

test('the template library starts with six editable built-ins', () => {
  const library = normalizeProgressionTemplates(undefined)
  assert.deepEqual(library.templates.map(template => template.name), ['修仙境界', '武侠武学层次', '西幻魔法位阶', '网游段位', '后宫位分', '现代军衔'])
  assert.ok(library.templates.every(template => template.builtIn && template.tiers.length >= 7))
  assert.equal(builtInProgressionTemplates()[0].tiers[0].name, '炼气')
  assert.deepEqual(normalizeProgressionTemplates({ templates: [] }).templates, [], 'an emptied library stays empty')
})

test('templates can be created, edited, deleted and the built-ins restored', () => {
  let library = normalizeProgressionTemplates(undefined)
  const created = saveProgressionTemplate(library, { name: '宗门职位', description: '宗门内的身份', tiers: [{ name: '外门弟子' }, { name: '内门弟子' }, { name: '真传弟子' }] }, { newId: 'template-sect' })
  assert.equal(created.template.id, 'template-sect')
  assert.equal(created.template.builtIn, false)
  library = created.library
  library = saveProgressionTemplate(library, { id: 'builtin-wuxia', name: '武侠（我的版本）', tiers: [{ name: '入门' }, { name: '小成' }] }).library
  const wuxia = library.templates.find(template => template.id === 'builtin-wuxia')
  assert.equal(wuxia.name, '武侠（我的版本）')
  assert.equal(wuxia.builtIn, true)
  assert.equal(wuxia.description, '江湖武者的实力层次。', 'omitted fields keep their stored value')
  library = saveProgressionTemplate(library, { id: 'template-sect', name: '宗门职位' , description: '改过' }).library
  assert.equal(library.templates.find(template => template.id === 'template-sect').tiers.length, 3)
  library = deleteProgressionTemplate(library, 'builtin-harem')
  assert.ok(!library.templates.some(template => template.id === 'builtin-harem'))
  assert.throws(() => deleteProgressionTemplate(library, 'nope'), /unknown template/)
  assert.throws(() => saveProgressionTemplate(library, { name: '  ' }), /name must not be empty/)
  assert.throws(() => saveProgressionTemplate(library, { name: 'x', tiers: [{ stages: 'a' }] }), /name is required/)
  assert.throws(() => saveProgressionTemplate(library, { id: 'missing', name: 'x' }), /unknown template/)

  const restored = restoreBuiltInProgressionTemplates(library)
  assert.equal(restored.templates.find(template => template.id === 'builtin-wuxia').name, '武侠武学层次')
  assert.ok(restored.templates.some(template => template.id === 'builtin-harem'))
  assert.equal(restored.templates.find(template => template.id === 'template-sect').description, '改过', 'own templates survive a restore')
})

test('a template becomes a book system with its own unique id', () => {
  const [xiuxian] = builtInProgressionTemplates()
  const first = systemFromTemplate(xiuxian, [])
  assert.equal(first.id, '修仙境界')
  assert.equal(first.notes, xiuxian.description)
  assert.equal(first.tiers.length, 9)
  const second = systemFromTemplate(xiuxian, [first])
  assert.equal(second.id, '修仙境界-2')
  first.tiers[0].name = 'changed'
  assert.equal(xiuxian.tiers[0].name, '炼气', 'the copy is independent of the template')
})
