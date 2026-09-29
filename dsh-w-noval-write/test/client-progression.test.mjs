import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import vm from 'node:vm'
import { analyzeProgression, builtInProgressionTemplates, normalizeProject } from '../noval-write-core.js'

const source = readFileSync(new URL('../client.js', import.meta.url), 'utf8')

function slice(startMarker, endMarker) {
  const start = source.indexOf(startMarker)
  const end = source.indexOf(endMarker, start)
  assert.ok(start >= 0 && end > start, `${startMarker} … ${endMarker}`)
  return source.slice(start, end)
}

// The progression block plus the small helpers it relies on, run as plain script.
function loadClient(React = {}) {
  const code = [
    slice('    var UNSTARTED_CHAPTER_STATUS', '    var THREAD_DUE_SOON_CHAPTERS'),
    slice('    function chapterSequenceOf(project) {', '    function analyzeThreads(project) {'),
    slice('    // ── progression systems', '    // ── version history'),
    'this.exports = { progressionOn, analyzeProgressionView, systemFromTemplateClient, ProgressionTab };',
  ].join('\n')
  const stub = name => props => ({ type: name, props: props || {}, children: [] })
  const context = {
    React, Map, Array, Object, String, Boolean, Infinity, JSON,
    makeId: prefix => `${prefix}-test-${Math.random().toString(36).slice(2, 8)}`,
    clone: value => structuredClone(value),
    failureText: error => (error && error.message) || String(error),
    NwIcon: stub('NwIcon'), IconButton: stub('IconButton'), AddButton: props => ({ type: 'AddButton', props, children: [] }),
    InputField: stub('InputField'), TextField: stub('TextField'), SelectField: stub('SelectField'), ChapterSelect: stub('ChapterSelect'),
    FieldGroup: props => ({ type: 'FieldGroup', props, children: [].concat(props.children || []) }),
  }
  vm.runInNewContext(code, context)
  return context.exports
}

function sample() {
  return normalizeProject({
    characters: [{ id: 'lin', name: '林默' }, { id: 'zhao', name: '赵乾' }],
    volumes: [{ id: 'v1', chapters: [{ id: 'c1', status: '初稿' }, { id: 'c2', status: '初稿' }, { id: 'c3', status: 'planned' }] }],
    progression: {
      systems: [{ id: 'xiuwei', name: '修为境界', tiers: [{ name: '炼气' }, { name: '筑基' }, { name: '金丹' }] }, { id: 'dan', name: '炼丹品级', tiers: [{ name: '一品' }, { name: '二品' }] }],
      records: [
        { id: 'r1', characterId: 'lin', chapterId: 'c1', systemId: 'xiuwei', tierId: '炼气', holdings: '青玄剑' },
        { id: 'r2', characterId: 'lin', chapterId: 'c2', systemId: 'xiuwei', tierId: '金丹', revealed: '雷诀' },
        { id: 'r3', characterId: 'lin', chapterId: 'c2', systemId: 'dan', tierId: '二品' },
        { id: 'r4', characterId: 'zhao', chapterId: 'c1', systemId: 'xiuwei', tierId: '筑基', condition: '骨折' },
        { id: 'r5', characterId: 'zhao', chapterId: 'c3', systemId: 'xiuwei', tierId: '炼气' },
        { id: 'r6', characterId: 'ghost', chapterId: 'c1' },
      ],
    },
  })
}

test('the panel analyzer agrees with the core analyzer', () => {
  const client = loadClient()
  const project = sample()
  for (const asOf of ['', 'c1', 'c3']) {
    const core = analyzeProgression(project, asOf ? { asOfChapterId: asOf } : {})
    const view = client.analyzeProgressionView(project, asOf)
    const simplify = states => states
      .map(state => ({ id: state.characterId, standings: state.standings.map(item => `${item.systemId}:${item.tier}:${item.rank}`), condition: state.condition, holdings: state.holdings, revealed: state.revealed.length }))
      .sort((a, b) => a.id.localeCompare(b.id))
    // JSON round-trip: objects built inside the vm sandbox carry its own prototypes.
    assert.deepEqual(JSON.parse(JSON.stringify(simplify(view.states))), simplify(core.states), `as of ${asOf || 'current'}`)
    assert.deepEqual([...view.warnings.map(item => item.code)].sort(), core.warnings.map(item => item.code).sort())
  }
  assert.equal(client.progressionOn(project), true)
  assert.equal(client.progressionOn(normalizeProject({})), true, "on by default")
  assert.equal(client.progressionOn(normalizeProject({ progression: { enabled: false } })), false)
  assert.equal(client.progressionOn({ characters: [] }), true, "a draft without the key is on")
  assert.equal(client.progressionOn(normalizeProject({ progression: { enabled: true } })), true)
})

test('a template copied into a book gets a unique id and its own tiers', () => {
  const client = loadClient()
  const template = builtInProgressionTemplates()[0]
  const first = client.systemFromTemplateClient(template, [])
  const second = client.systemFromTemplateClient(template, [first])
  assert.deepEqual([first.id, second.id], ['修仙境界', '修仙境界-2'])
  assert.equal(first.tiers.length, template.tiers.length)
  assert.notEqual(first.tiers[0].id, undefined)
})

// A tiny hook runtime; function components render inline.
function createReact() {
  const slots = []
  let cursor = 0
  let effects = []
  const equal = (a, b) => a?.length === b?.length && a.every((value, index) => Object.is(value, b[index]))
  const React = {
    useState(initial) { const i = cursor++; if (!(i in slots)) slots[i] = initial; return [slots[i], value => { slots[i] = typeof value === 'function' ? value(slots[i]) : value }] },
    useRef(initial) { const i = cursor++; if (!(i in slots)) slots[i] = { current: initial }; return slots[i] },
    useEffect(fn, deps) { const i = cursor++; if (!slots[i] || !equal(slots[i].deps, deps)) { slots[i] = { deps }; effects.push(() => { slots[i].cleanup = fn() }) } },
    createElement(type, props, ...children) {
      const merged = { ...(props || {}), children: children.flat() }
      if (typeof type === 'function') return type(merged)
      return { type, props: props || {}, children: children.flat() }
    },
    Fragment: 'Fragment',
  }
  return {
    React,
    render(Component, props) {
      cursor = 0
      const tree = Component(props)
      const pending = effects
      effects = []
      pending.forEach(effect => effect())
      return tree
    },
  }
}

function findAll(node, predicate, out = []) {
  if (!node || typeof node !== 'object') return out
  if (predicate(node)) out.push(node)
  for (const child of node.children || []) findAll(child, predicate, out)
  return out
}

const textOf = node => (node == null || node === false ? '' : typeof node !== 'object' ? String(node) : (node.children || []).map(textOf).join(''))
const tick = () => new Promise(resolve => setImmediate(resolve))

test('the template library applies, saves, deletes and restores through the writer', async () => {
  const runtime = createReact()
  const client = loadClient(runtime.React)
  let templates = builtInProgressionTemplates()
  const calls = []
  const writer = {
    getProgressionTemplates: async () => ({ templates }),
    saveProgressionTemplate: async input => { calls.push(['save', input.name, input.tiers.length]); templates = [...templates, { ...input, id: 'template-new' }]; return { templates } },
    deleteProgressionTemplate: async id => { calls.push(['delete', id]); templates = templates.filter(item => item.id !== id); return { templates } },
    restoreProgressionTemplates: async () => { calls.push(['restore']); templates = builtInProgressionTemplates(); return { templates } },
  }
  let draft = { enabled: false, systems: [], records: [] }
  const props = {
    t: key => key, writer,
    project: { characters: [], volumes: [], progression: draft },
    onUpdate: mutate => { draft = structuredClone(draft); mutate(draft); props.project = { ...props.project, progression: draft } },
  }
  const render = () => runtime.render(client.ProgressionTab, props)
  let tree = render()
  assert.match(textOf(tree), /loading/)
  await tick()
  tree = render()
  const button = label => findAll(tree, node => node.type === 'button' && textOf(node) === label)

  // Use a built-in template in this book.
  button('useTemplate')[0].props.onClick()
  assert.equal(draft.systems.length, 1)
  assert.equal(draft.systems[0].name, '修仙境界')
  assert.equal(draft.systems[0].tiers.length, 9)

  // Save the book's system back as a template.
  tree = render()
  const saveAsTemplate = findAll(tree, node => node.type === 'IconButton' && node.props.label === 'saveAsTemplate')[0]
  saveAsTemplate.props.onClick()
  await tick()
  assert.deepEqual(calls.at(-1), ['save', '修仙境界', 9])

  // Deleting asks inside the panel first: one click arms, the second deletes.
  tree = render()
  button('delete')[1].props.onClick()
  assert.equal(calls.filter(call => call[0] === 'delete').length, 0)
  tree = render()
  assert.match(textOf(tree), /deleteTemplateConfirm/)
  button('confirmDelete')[0].props.onClick()
  await tick()
  assert.deepEqual(calls.at(-1), ['delete', 'builtin-wuxia'])

  // Restoring the built-ins is also a two-step action.
  tree = render()
  button('restoreTemplates')[0].props.onClick()
  assert.notDeepEqual(calls.at(-1), ['restore'])
  tree = render()
  button('confirmRestore')[0].props.onClick()
  await tick()
  assert.deepEqual(calls.at(-1), ['restore'])
  tree = render()
  assert.match(textOf(tree), /templatesRestored/)
})

test('no client code opens a native dialog', () => {
  const block = slice('    // ── progression systems', '    // ── version history')
  assert.doesNotMatch(block, /window\.(confirm|alert|prompt)\(/)
})
