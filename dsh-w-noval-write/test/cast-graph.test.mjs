import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import vm from 'node:vm'
import {
  acknowledgeCastInbox,
  castChangesBetween,
  characterPatchToolSchema,
  mergeCastInbox,
  normalizeProject,
  normalizeState,
  novelToolContract,
  patchRelationshipById,
  projectPrompt,
  relationshipPatchToolSchema,
} from '../noval-write-core.js'
import { hostFixture } from './helpers/host-fixture.mjs'

const cast = () => normalizeProject({
  characters: [
    { id: 'lin', name: '林远', importance: 'protagonist', faction: '青云宗' },
    { id: 'su', name: '苏晴' },
    { id: 'wang', name: '王五', importance: 'minor' },
  ],
  relationships: [{ id: 'r1', fromId: 'lin', toId: 'su', kind: 'ally' }],
})

test('cast fields normalise to the graph enums, accepting Chinese names and defaulting the rest', () => {
  const project = normalizeProject({
    characters: [{ id: 'a', name: '甲', importance: '主角' }, { id: 'b', name: '乙', importance: 'nonsense' }],
    relationships: [
      { id: 'r', fromId: 'a', toId: 'b', kind: '暧昧', state: '伏线', direction: '单向', strength: '强' },
      { id: 's', fromId: 'b', toId: 'a' },
    ],
  })
  assert.equal(project.characters[0].importance, 'protagonist')
  assert.equal(project.characters[1].importance, 'supporting')
  assert.deepEqual(['kind', 'state', 'direction', 'strength'].map(key => project.relationships[0][key]), ['romance', 'planned', 'oneway', '3'])
  assert.deepEqual(['kind', 'state', 'direction', 'strength'].map(key => project.relationships[1][key]), ['other', 'active', 'mutual', '2'])
  for (const key of ['gender', 'faction', 'tags', 'contrast', 'values', 'likes', 'edge', 'firstAppearance', 'fate', 'readerAppeal']) {
    assert.equal(project.characters[0][key], '', key)
  }
})

test('model tool schemas describe the cast enums', () => {
  assert.deepEqual(characterPatchToolSchema().properties.importance.enum, ['protagonist', 'core', 'major', 'supporting', 'minor'])
  const relation = relationshipPatchToolSchema().properties
  assert.deepEqual(relation.state.enum, ['active', 'hidden', 'planned', 'ended'])
  assert.match(relation.state.description, /planned/)
  assert.ok(relation.kind.enum.includes('enemy'))
  assert.deepEqual(novelToolContract().castEnums.direction, ['mutual', 'oneway'])
  const patched = patchRelationshipById(cast(), 'r1', { state: 'hidden', kind: 'romance' })
  assert.equal(patched.relationships[0].state, 'hidden')
})

test('cast changes fold into one inbox entry per character or relationship', () => {
  const before = cast()
  const after = structuredClone(before)
  after.characters.push({ ...after.characters[1], id: 'li', name: '李四' })
  after.relationships.push({ ...after.relationships[0], id: 'r2', fromId: 'lin', toId: 'wang', kind: 'enemy', state: 'planned' })
  after.relationships[0].state = 'hidden'
  after.characters = after.characters.filter(item => item.id !== 'wang' || true)
  let inbox = mergeCastInbox([], castChangesBetween(before, after))
  assert.deepEqual(inbox.map(entry => [entry.id, entry.change]), [
    ['character:li', 'added'], ['relationship:r1', 'changed'], ['relationship:r2', 'added'],
  ])
  assert.deepEqual(inbox[1].fields, ['state'])

  // Editing the new character keeps it "added"; more edits to r1 merge fields.
  const later = structuredClone(after)
  later.characters.find(item => item.id === 'li').goal = '复仇'
  later.relationships[0].fromId = 'su'
  later.relationships[0].toId = 'lin'
  inbox = mergeCastInbox(inbox, castChangesBetween(after, later))
  assert.equal(inbox.find(entry => entry.id === 'character:li').change, 'added')
  assert.deepEqual(inbox.find(entry => entry.id === 'relationship:r1').fields, ['state', 'endpoints'])

  // Adding then removing cancels out; removing an edited tie becomes "removed".
  const last = structuredClone(later)
  last.characters = last.characters.filter(item => item.id !== 'li')
  last.relationships = last.relationships.filter(item => item.id !== 'r1')
  inbox = mergeCastInbox(inbox, castChangesBetween(later, last))
  assert.deepEqual(inbox.map(entry => [entry.id, entry.change]), [['relationship:r1', 'removed'], ['relationship:r2', 'added']])
  assert.match(inbox[0].label, /苏晴 ↔ 林远/)

  assert.deepEqual(acknowledgeCastInbox(inbox, ['relationship:r1']).map(entry => entry.id), ['relationship:r2'])
  assert.deepEqual(acknowledgeCastInbox(inbox, []), [])
  assert.deepEqual(normalizeState({ project: last, castInbox: inbox }).castInbox, inbox)
})

test('the prompt orders the cast by importance and puts pending cast changes beside the protocol', () => {
  const project = cast()
  project.relationships.push({ ...project.relationships[0], id: 'r2', fromId: 'lin', toId: 'wang', kind: 'enemy', state: 'planned', direction: 'oneway', futureDirection: '第十章翻脸' })
  const plain = projectPrompt(project)
  assert.match(plain, /林远 \(lin; protagonist\) — faction: 青云宗/)
  assert.ok(plain.indexOf('林远 (lin') < plain.indexOf('苏晴 (su') && plain.indexOf('苏晴 (su') < plain.indexOf('王五 (wang'))
  assert.match(plain, /林远 → 王五 \[enemy · planned · oneway · strength 2\]/)
  assert.doesNotMatch(plain, /Author cast changes/)

  const inbox = mergeCastInbox([], castChangesBetween(cast(), project))
  const prompt = projectPrompt({ ...project, notes: '字'.repeat(20_000) }, 4_000, { castInbox: inbox })
  assert.ok(prompt.length <= 4_000)
  assert.match(prompt, /## Author cast changes awaiting your adjustment/)
  assert.match(prompt, /\[relationship added\] 林远 → 王五 \(relationship:r2\) — enemy · planned · oneway · strength 2; direction: 第十章翻脸/)
  assert.match(prompt, /novel_cast_ack/)
  assert.match(prompt, /Never rewrite chapters that already have manuscripts/)
})

test('panel saves queue cast changes for the AI, which acknowledges them without a new revision', async t => {
  const f = await hostFixture(t)
  await f.setProject(cast())
  const before = f.service.stateForWorkspace(f.handle)
  assert.deepEqual(before.castInbox, [])
  const draft = structuredClone(before.project)
  draft.relationships.push({ ...draft.relationships[0], id: 'r2', fromId: 'su', toId: 'wang', kind: 'rival', state: 'planned' })
  draft.characters[1].goal = '查清身世'
  const saved = await f.service.saveProject(f.handle, draft, before.revision)
  assert.deepEqual(saved.castInbox.map(entry => entry.id), ['character:su', 'relationship:r2'])
  assert.deepEqual((await f.service.getRevision(f.handle)).castInbox.length, 2)

  const section = f.sections.find(item => item.name === 'dsh-w-noval-write:workspace')
  const agent = { session: { id: 's' } }
  assert.match(section.text({ agent }), /\[relationship added\] 苏晴 ↔ 王五/)

  const ack = f.tools.find(tool => tool.name === 'novel_cast_ack')
  const listed = await f.tools.find(tool => tool.name === 'novel_cast_inbox').execute({}, { agent })
  assert.equal(listed.castInbox.length, 2)
  const result = await ack.execute({ entry_ids: ['relationship:r2'] }, { agent })
  assert.deepEqual([result.ok, result.removed, result.remaining], [true, 1, 1])
  assert.equal(f.service.stateForWorkspace(f.handle).revision, saved.revision, 'acknowledging does not bump the revision')
  const dismissed = await f.service.dismissCastInbox(f.handle, [])
  assert.deepEqual(dismissed.castInbox, [])
  assert.doesNotMatch(section.text({ agent }), /Author cast changes/)

  // AI edits never queue; a reset clears the inbox.
  await f.service.mutateAs({ actor: 'ai', operation: 'novel_patch' }, f.handle, saved.revision, current => ({ ...current, project: { ...current.project, characters: [...current.project.characters, { ...current.project.characters[2], id: 'x', name: 'X' }] } }))
  assert.deepEqual(f.service.stateForWorkspace(f.handle).castInbox, [])
})

// The layout step runs in the panel; check it settles without overlaps and
// keeps pinned spheres in place.
function loadStepCast() {
  const source = readFileSync(new URL('../client.js', import.meta.url), 'utf8')
  const start = source.indexOf('    function stepCast(nodes, links, alpha) {')
  const end = source.indexOf('    function seedPosition(', start)
  return vm.runInNewContext(`(${source.slice(start, end).trim()})`, { Math })
}

test('the cast layout separates spheres, pulls linked ones together and respects pins', () => {
  const stepCast = loadStepCast()
  const nodes = new Map()
  const radius = [34, 17, 17, 12, 22, 17, 12, 12]
  radius.forEach((r, index) => nodes.set(`n${index}`, { id: `n${index}`, x: index * 3, y: (index % 3) * 2, vx: 0, vy: 0, r, center: index === 0 }))
  nodes.get('n7').pinned = true
  nodes.get('n7').x = 400
  nodes.get('n7').y = -300
  const links = [{ fromId: 'n0', toId: 'n1' }, { fromId: 'n0', toId: 'n2' }, { fromId: 'n1', toId: 'n4' }]
  let alpha = 1
  while (alpha > 0.012) { stepCast(nodes, links, alpha); alpha *= 0.985 }
  const list = [...nodes.values()]
  for (const node of list) assert.ok(Number.isFinite(node.x) && Number.isFinite(node.y))
  for (let i = 0; i < list.length; i += 1) {
    for (let j = i + 1; j < list.length; j += 1) {
      const d = Math.hypot(list[i].x - list[j].x, list[i].y - list[j].y)
      assert.ok(d >= list[i].r + list[j].r, `${list[i].id} overlaps ${list[j].id}`)
    }
  }
  assert.deepEqual([nodes.get('n7').x, nodes.get('n7').y], [400, -300])
  const dist = (a, b) => Math.hypot(nodes.get(a).x - nodes.get(b).x, nodes.get(a).y - nodes.get(b).y)
  assert.ok(dist('n0', 'n1') < dist('n0', 'n6'), 'linked spheres sit closer than unlinked ones')
  assert.ok(Math.hypot(nodes.get('n0').x, nodes.get('n0').y) < 80, 'the protagonist stays near the centre')
})
