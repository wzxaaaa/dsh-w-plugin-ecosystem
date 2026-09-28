import assert from 'node:assert/strict'
import { test } from 'node:test'
import { defaultProject, describeProjectDiff } from '../noval-write-core.js'

function base() {
  const project = defaultProject()
  project.title = '长夜灯火'
  project.characters = [{ id: 'shen', name: '沈砚' }, { id: 'zhou', name: '老周' }]
  project.volumes = [{ id: 'v1', title: '卷一', chapters: [{ id: 'c1', number: '1', title: '夜班' }, { id: 'c2', number: '2', title: '排字工' }] }]
  return project
}

test('identical projects produce no changes', () => {
  assert.deepEqual(describeProjectDiff(base(), base()), [])
})

test('summaries count record fields and list items added, removed, and changed', () => {
  const after = base()
  after.title = '长夜'
  after.world.rules = '讣告会成真'
  after.characters[0].role = '主角'
  after.characters.splice(1, 1)
  after.characters.push({ id: 'lu', name: '陆知微' })
  after.threads = [{ id: 't', title: '讣告' }]
  const summary = describeProjectDiff(base(), after)
  assert.deepEqual(summary, [
    { section: 'project', changed: 1, fields: ['title'] },
    { section: 'world', changed: 1, fields: ['rules'] },
    { section: 'characters', added: 1, removed: 1, changed: 1 },
    { section: 'threads', added: 1, removed: 0, changed: 0 },
  ])
  assert.equal(JSON.stringify(summary).includes('沈砚'), false, 'the stored summary carries no names')
})

test('detail adds labels and before/after snippets for the compare view', () => {
  const after = base()
  after.title = '长夜'
  after.characters[0].role = '主角'
  after.characters.push({ id: 'lu', name: '陆知微' })
  const detail = describeProjectDiff(base(), after, { detail: true })
  assert.deepEqual(detail.find(section => section.section === 'project').values, [{ field: 'title', before: '长夜灯火', after: '长夜' }])
  const characters = detail.find(section => section.section === 'characters')
  assert.deepEqual(characters.addedItems, ['陆知微'])
  assert.deepEqual(characters.changedItems, [{ label: '沈砚', fields: ['role'] }])
})

test('chapters are compared across volumes and reordering is reported', () => {
  const after = base()
  after.volumes[0].chapters.reverse()
  after.volumes[0].chapters[0].summary = '改了概要'
  const detail = describeProjectDiff(base(), after, { detail: true })
  const chapters = detail.find(section => section.section === 'chapters')
  assert.equal(chapters.reordered, true)
  assert.deepEqual(chapters.changedItems, [{ label: '#2 排字工', fields: ['summary'] }])
  assert.equal(detail.find(section => section.section === 'volumes'), undefined, 'a volume is not "changed" just because its chapters moved')
})
