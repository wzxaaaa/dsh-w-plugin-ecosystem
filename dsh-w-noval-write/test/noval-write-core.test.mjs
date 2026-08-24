import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  advanceProject,
  applyWriteLinkProjection,
  assertProjectShape,
  defaultProject,
  defaultState,
  isWriteSession,
  mergeProject,
  novelToolContract,
  normalizeProject,
  normalizeState,
  parseWriteCommand,
  projectShapeIssues,
  projectToolSchema,
  projectPrompt,
  projectExportDocument,
  projectFromImportDocument,
  writeLinkFromEvents,
} from '../noval-write-core.js'

test('portable framework export round-trips without local workspace binding', () => {
  const state = defaultState(0)
  state.project.title = 'A portable novel'
  state.project.world.rules = 'Magic has a price.'
  const exported = projectExportDocument(state, { id: 'private-id', title: 'Writing room', path: 'C:/private' }, 0)
  assert.equal(exported.format, 'dsh-w-noval-write/project')
  assert.equal(exported.version, 1)
  assert.deepEqual(exported.workspace, { title: 'Writing room' })
  assert.equal(JSON.stringify(exported).includes('private-id'), false)
  assert.equal(JSON.stringify(exported).includes('C:/private'), false)
  assert.deepEqual(projectFromImportDocument(exported), state.project)
  assert.deepEqual(projectFromImportDocument(state.project), state.project)
})

test('framework import rejects incompatible and partial documents', () => {
  assert.throws(() => projectFromImportDocument({ format: 'other', version: 1, project: defaultProject() }), /unsupported import format/)
  assert.throws(() => projectFromImportDocument({ format: 'dsh-w-noval-write\/project', version: 2, project: defaultProject() }), /unsupported import version/)
  assert.throws(() => projectFromImportDocument({ title: 'partial' }), /INVALID_NOVEL_ARGUMENTS/)
})

test('default project contains every editor section', () => {
  const project = defaultProject()
  assert.deepEqual(project.characters, [])
  assert.deepEqual(project.relationships, [])
  assert.deepEqual(Object.keys(project.world), ['era', 'chronology', 'geography', 'environment', 'locations', 'rules', 'factions', 'politics', 'society', 'culture', 'economy', 'beliefs', 'technology', 'conflicts', 'lore'])
  assert.deepEqual(Object.keys(project.plot), ['themes', 'storyQuestion', 'coreConflict', 'protagonistGoal', 'stakes', 'antagonisticForce', 'opening', 'midpoint', 'climax', 'ending', 'subplots', 'foreshadowing', 'reveals', 'pacing', 'chapterPlan', 'outline'])
  assert.equal(project.scene.povCharacterId, '')
  assert.deepEqual(project.progress, [])
})

test('normalization preserves valid links and removes dangling references', () => {
  const project = normalizeProject({
    characters: [
      { id: 'hero', name: '林岚' },
      { id: 'hero', name: '镜像' },
    ],
    relationships: [
      { id: 'r1', fromId: 'hero', toId: 'missing', label: '宿敌' },
    ],
    scene: { povCharacterId: 'missing' },
  })
  assert.equal(project.characters[0].id, 'hero')
  assert.notEqual(project.characters[1].id, 'hero')
  assert.equal(project.relationships[0].fromId, 'hero')
  assert.equal(project.relationships[0].toId, '')
  assert.equal(project.scene.povCharacterId, '')
})

test('normalization preserves Unicode ids and resolves relationship endpoints by id or name', () => {
  const project = normalizeProject({
    characters: [
      { id: '王子信', name: '王子信' },
      { id: 'father', name: '王林' },
    ],
    relationships: [
      { id: '父子', fromId: '王子信', toId: '王林', label: '家人' },
    ],
    scene: { povCharacterId: '王林' },
  })
  assert.equal(project.characters[0].id, '王子信')
  assert.equal(project.relationships[0].fromId, '王子信')
  assert.equal(project.relationships[0].toId, 'father')
  assert.equal(project.scene.povCharacterId, 'father')
})

test('normalization trims text and rejects non-object collections', () => {
  const project = normalizeProject({
    title: '  长夜  ',
    characters: 'not-an-array',
    relationships: null,
    world: { rules: '  梦境不能说谎。  ' },
  })
  assert.equal(project.title, '长夜')
  assert.equal(project.world.rules, '梦境不能说谎。')
  assert.deepEqual(project.characters, [])
  assert.deepEqual(project.relationships, [])
})

test('state normalization keeps revision without a mode switch', () => {
  const state = normalizeState({ enabled: true, revision: 7, updatedAt: '2026-01-01T00:00:00.000Z', project: { title: '潮汐' } })
  assert.equal(Object.hasOwn(state, 'enabled'), false)
  assert.equal(state.revision, 7)
  assert.equal(state.project.title, '潮汐')
  assert.equal(Object.hasOwn(defaultState(0), 'enabled'), false)
})

test('partial model patches merge structured sections and preserve omitted canon', () => {
  const merged = mergeProject({
    title: '潮汐碑',
    world: { era: '永夜', rules: '名字不可写下' },
    characters: [{ id: 'hero', name: '岚' }],
  }, {
    world: { rules: '名字只能写一次' },
    notes: 'AI 更新',
  })
  assert.equal(merged.title, '潮汐碑')
  assert.equal(merged.world.era, '永夜')
  assert.equal(merged.world.rules, '名字只能写一次')
  assert.equal(merged.characters[0].name, '岚')
  assert.equal(merged.notes, 'AI 更新')
})

test('model tool schema exposes the complete canonical object structure', () => {
  const schema = projectToolSchema({ partial: false })
  assert.equal(schema.type, 'object')
  assert.equal(schema.additionalProperties, false)
  assert.equal(schema.properties.characters.type, 'array')
  assert.equal(schema.properties.characters.items.properties.name.type, 'string')
  assert.equal(schema.properties.world.properties.rules.type, 'string')
  assert.equal(schema.properties.scene.properties.povCharacterId.type, 'string')
  assert.equal(schema.properties.progress.items.properties.canonChanges.type, 'string')
  assert.equal(schema.properties.title.required, true)

  const patch = projectToolSchema({ partial: true })
  assert.equal(Object.hasOwn(patch.properties.title, 'required'), false)
  assert.equal(Object.hasOwn(patch.properties.world.properties.rules, 'required'), false)
})

test('destructive writes reject strings, wrappers, incomplete projects, and unknown fields', () => {
  assert.match(projectShapeIssues(JSON.stringify({ project: defaultProject() }))[0], /must be an object/)
  assert.match(projectShapeIssues({ project: defaultProject() })[0], /project\.project is not part/)
  assert.match(projectShapeIssues({ title: 'only one field' })[0], /project\.genre is required/)
  assert.throws(
    () => assertProjectShape(JSON.stringify({ expected_revision: 1, project: defaultProject() })),
    error => error.code === 'INVALID_NOVEL_ARGUMENTS' && error.retryable === true,
  )
  assert.doesNotThrow(() => assertProjectShape(defaultProject()))
})

test('partial patches accept canonical fields and reject empty or schema-drifting objects', () => {
  assert.deepEqual(projectShapeIssues({ world: { rules: '名字只能写一次' } }, { partial: true }), [])
  assert.match(projectShapeIssues({}, { partial: true })[0], /must change at least one/)
  assert.match(projectShapeIssues({ hardware: {} }, { partial: true })[0], /project\.hardware is not part/)
  assert.match(projectShapeIssues({ characters: { hero: {} } }, { partial: true })[0], /must be an array/)
})

test('schema discovery contract includes an example and automatic retry protocol', () => {
  const contract = novelToolContract()
  assert.equal(contract.schemaVersion, 3)
  assert.deepEqual(contract.emptyProjectExample, defaultProject())
  assert.ok(contract.retryProtocol.some(line => /novel_schema/.test(line)))
  assert.ok(contract.retryProtocol.some(line => /never JSON strings/.test(line)))
})

test('AI advance appends durable progress and updates the scene cursor', () => {
  const project = advanceProject({ title: '潮汐碑', scene: { chapter: '第一章' } }, {
    chapter: '第二章',
    summary: '岚穿过退潮后的城门。',
    canonChanges: '岚得到了铜钥匙。',
    openThreads: '钥匙对应哪一扇门。',
    scene: { chapter: '第三章', location: '钟楼' },
  }, '2026-08-23T00:00:00.000Z')
  assert.equal(project.progress.length, 1)
  assert.equal(project.progress[0].chapter, '第二章')
  assert.equal(project.progress[0].at, '2026-08-23T00:00:00.000Z')
  assert.equal(project.scene.chapter, '第三章')
  assert.equal(project.scene.location, '钟楼')
})

test('AI advance deduplicates an identical latest progress entry', () => {
  const first = advanceProject({ title: '潮汐碑' }, {
    chapter: '第二章',
    summary: '主角进入钟楼。',
    canonChanges: '得到铜钥匙。',
    openThreads: '钟声来源。',
    scene: { chapter: '第三章' },
  }, '2026-08-23T00:00:00.000Z')
  const repeated = advanceProject(first, {
    chapter: '第二章',
    summary: '主角进入钟楼。',
    canonChanges: '得到铜钥匙。',
    openThreads: '钟声来源。',
    scene: { chapter: '第三章' },
  }, '2026-08-23T00:01:00.000Z')
  assert.equal(repeated.progress.length, 1)
  assert.equal(repeated.progress[0].at, '2026-08-23T00:00:00.000Z')
})

test('/write parses a goal-like objective, edit, clear, and show grammar', () => {
  assert.deepEqual(parseWriteCommand(''), { kind: 'show' })
  assert.deepEqual(parseWriteCommand('写第一章，让主角发现钥匙'), { kind: 'create', objective: '写第一章，让主角发现钥匙' })
  assert.deepEqual(parseWriteCommand('edit  改写第二章'), { kind: 'edit', objective: '改写第二章' })
  assert.deepEqual(parseWriteCommand('EDIT'), { kind: 'invalid-edit' })
  assert.deepEqual(parseWriteCommand('CLEAR'), { kind: 'clear' })
})

test('/write durable link projection survives replay, edits, and clear', () => {
  const first = { revision: 1, objective: '写第一章', workspaceId: 'w1', workspaceTitle: '小说', updatedAt: 1 }
  const second = { ...first, revision: 2, objective: '写第二章', updatedAt: 2 }
  const create = { type: 'noval-write/change', data: { version: 1, operation: 'link', link: first } }
  const edit = { type: 'noval-write/change', data: { version: 1, operation: 'edit', link: second } }
  const clear = { type: 'noval-write/change', data: { version: 1, operation: 'clear' } }
  const unrelated = { type: 'command/run', data: { name: 'write' } }
  assert.equal(applyWriteLinkProjection(first, unrelated), first)
  assert.deepEqual(writeLinkFromEvents([create, edit]), second)
  assert.equal(isWriteSession([create, edit]), true)
  assert.equal(writeLinkFromEvents([create, edit, clear]), null)
  assert.equal(isWriteSession([create, edit, clear]), false)
})

test('prompt renders canon, relationships, current scene, and KB boundary', () => {
  const prompt = projectPrompt({
    title: '潮汐碑',
    characters: [
      { id: 'a', name: '岚', goal: '找回被删去的记忆', voice: '短句，很少解释' },
      { id: 'b', name: '鹭', role: '守门人' },
    ],
    relationships: [{ id: 'r', fromId: 'a', toId: 'b', label: '互相利用', tension: '信任正在增长' }],
    world: { rules: '每次潮退会抹去一个名字' },
    plot: { coreConflict: '记住真相会让城市沉没' },
    scene: { chapter: '第三章', povCharacterId: 'a', continuity: '岚左手受伤；钥匙在鹭身上' },
  })
  assert.match(prompt, /潮汐碑/)
  assert.match(prompt, /岚 → 鹭: 互相利用; 信任正在增长/)
  assert.match(prompt, /POV character: 岚/)
  assert.match(prompt, /岚左手受伤/)
  assert.match(prompt, /kb_search\/kb_read/)
  assert.match(prompt, /never copy distinctive wording/)
  assert.match(prompt, /novel_read, novel_patch, novel_write, or novel_advance/)
  assert.match(prompt, /novel_schema/)
  assert.match(prompt, /Success requires ok: true/i)
})

test('prompt enforces a bounded context size', () => {
  const prompt = projectPrompt({ notes: '字'.repeat(10_000) }, 2_000)
  assert.ok(prompt.length <= 2_000)
  assert.match(prompt, /truncated/)
  assert.match(prompt, /Writing protocol:/)
  assert.match(prompt, /never copy distinctive wording/)
})
