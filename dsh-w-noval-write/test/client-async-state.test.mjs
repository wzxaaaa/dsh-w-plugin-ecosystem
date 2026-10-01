import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import vm from 'node:vm'
import { defaultProject } from '../noval-write-core.js'

const source = readFileSync(new URL('../client.js', import.meta.url), 'utf8')
const tick = () => new Promise(resolve => setImmediate(resolve))
const deferred = () => { let resolve, reject; const promise = new Promise((yes, no) => { resolve = yes; reject = no }); return { promise, resolve, reject } }
const book = (id, title = `Book ${id}`, revision = 1) => ({ revision, workspace: { id }, project: { ...defaultProject(), title } })
const find = (node, predicate) => {
  if (!node || typeof node !== 'object') return null
  if (predicate(node)) return node
  for (const child of node.children || []) { const hit = find(child, predicate); if (hit) return hit }
  return null
}

function hooks() {
  const slots = []; let cursor = 0, effects = [], writes = 0
  const equal = (a, b) => a?.length === b?.length && a.every((x, i) => Object.is(x, b[i]))
  const React = {
    Fragment: 'fragment',
    useState(initial) { const i = cursor++; if (!(i in slots)) slots[i] = initial; return [slots[i], value => { writes++; slots[i] = typeof value === 'function' ? value(slots[i]) : value }] },
    useRef(initial) { const i = cursor++; if (!(i in slots)) slots[i] = { current: initial }; return slots[i] },
    useCallback(fn, deps) { const i = cursor++; if (!slots[i] || !equal(slots[i].deps, deps)) slots[i] = { fn, deps }; return slots[i].fn },
    useEffect(fn, deps) { const i = cursor++; if (!slots[i] || !equal(slots[i].deps, deps)) { const old = slots[i]; slots[i] = { deps }; effects.push(() => { old?.cleanup?.(); slots[i].cleanup = fn() }) } },
    createElement(type, props, ...children) { return { type, props: props || {}, children: children.flat() } },
  }
  return {
    React,
    get writes() { return writes },
    render(Component, props) { cursor = 0; const tree = Component(props); const pending = effects; effects = []; pending.forEach(effect => effect()); return tree },
    unmount() { for (const slot of slots) slot?.cleanup?.() },
  }
}

function mount(writer, active = { session: 's-A' }) {
  const runtime = hooks(), checks = []
  const stubs = Object.fromEntries(['ProjectTab', 'SectionNav', 'SettingsTab', 'NovelLibrary'].map(name => [name, () => null]))
  const from = source.indexOf('    function NovelWriterPanel(props) {'), to = source.indexOf('    function SidebarRail(props) {', from)
  const Panel = vm.runInNewContext(`(${source.slice(from, to).trim()})`, {
    React: runtime.React, ...stubs, progressionOn: () => false, clone: value => structuredClone(value), failureText: error => error.message,
    window: { setInterval: fn => { checks.push(fn); return checks.length }, clearInterval() {}, addEventListener() {}, removeEventListener() {} },
    document: { visibilityState: 'visible', addEventListener() {}, removeEventListener() {} },
  })
  const props = {
    writer, t: key => key,
    useSessions: select => select({ current: active.session }),
    useWorkspaces: select => select({ items: ['A', 'B'].map(id => ({ workspaceId: id, title: id, sessionIds: [`s-${id}`] })) }),
  }
  const render = () => runtime.render(Panel, props)
  const project = tree => find(tree, node => node.type === stubs.ProjectTab)
  const settings = tree => find(tree, node => node.type === stubs.SettingsTab)
  const select = (tree, tab) => find(tree, node => node.type === stubs.SectionNav).props.onSelect(tab)
  return { ...stubs, active, runtime, checks, render, project, settings, select }
}

test('a background pull preserves edits made while the remote read was in flight and keeps their cache', async () => {
  const reply = deferred(); let reads = 0
  const ui = mount({ getState: id => id === 'A' && ++reads === 2 ? reply.promise : Promise.resolve(book(id)), getRevision: async () => ({ revision: 2 }) })
  ui.render(); await tick(); ui.render()
  ui.checks[0](); await tick()
  ui.project(ui.render()).props.set('title', 'Unsaved input')
  ui.render(); reply.resolve(book('A', 'AI revision', 2)); await tick()
  let tree = ui.render()
  assert.equal(ui.project(tree).props.project.title, 'Unsaved input')
  assert.equal(find(tree, node => node.type === 'button' && node.children.includes('save')).props.disabled, false)
  assert.ok(find(tree, node => node.type === 'button' && node.children.includes('externalLoad')))
  ui.active.session = 's-B'; ui.render(); await tick(); ui.render()
  ui.active.session = 's-A'; ui.render(); tree = ui.render()
  assert.equal(ui.project(tree).props.project.title, 'Unsaved input')
})

test('explicitly loading an external revision replaces the confirmed old draft', async () => {
  const reply = deferred(); let reads = 0
  const ui = mount({ getState: id => ++reads === 1 ? Promise.resolve(book(id)) : reply.promise, getRevision: async () => ({ revision: 2 }) })
  ui.render(); await tick()
  ui.project(ui.render()).props.set('title', 'Old draft'); ui.render()
  ui.checks[0](); await tick()
  find(ui.render(), node => node.type === 'button' && node.children.includes('externalLoad')).props.onClick()
  reply.resolve(book('A', 'External title', 2)); await tick()
  const tree = ui.render()
  assert.equal(ui.project(tree).props.project.title, 'External title')
  assert.equal(find(tree, node => node.type === 'button' && node.children.includes('save')).props.disabled, true)
})

test('even an explicit external load preserves new input typed after that load started', async () => {
  const reply = deferred(); let reads = 0
  const ui = mount({ getState: id => ++reads === 1 ? Promise.resolve(book(id)) : reply.promise, getRevision: async () => ({ revision: 2 }) })
  ui.render(); await tick()
  ui.project(ui.render()).props.set('title', 'Old draft'); ui.render()
  ui.checks[0](); await tick()
  find(ui.render(), node => node.type === 'button' && node.children.includes('externalLoad')).props.onClick()
  ui.project(ui.render()).props.set('title', 'New input'); ui.render()
  reply.resolve(book('A', 'External title', 2)); await tick()
  assert.equal(ui.project(ui.render()).props.project.title, 'New input')
})

test('history restore locks the parent editor, and finishing after switching books cannot overwrite the new book', async () => {
  const reply = deferred()
  const ui = mount({ getState: async id => book(id), restoreSnapshot: () => reply.promise })
  ui.render(); await tick(); ui.select(ui.render(), 'settings')
  const operation = ui.settings(ui.render()).props.onRestore(0)
  ui.select(ui.render(), 'project')
  let tree = ui.render()
  assert.equal(find(tree, node => node.type === 'fieldset').props.disabled, true)
  ui.project(tree).props.set('title', 'Blocked edit')
  assert.equal(ui.project(ui.render()).props.project.title, 'Book A')
  ui.active.session = 's-B'; ui.render(); await tick()
  ui.project(ui.render()).props.set('title', 'B draft'); ui.render()
  reply.resolve(book('A', 'Restored A', 2)); await operation
  tree = ui.render()
  assert.equal(ui.project(tree).props.project.title, 'B draft')
  assert.equal(find(tree, node => node.type === 'button' && node.children.includes('save')).props.disabled, false)
})

test('a revision poll begun before history restore cannot cancel the restore or unlock its editor', async () => {
  const restore = deferred(), revision = deferred(); let reads = 0
  const ui = mount({ getState: async id => { reads++; return book(id) }, getRevision: () => revision.promise, restoreSnapshot: () => restore.promise })
  ui.render(); await tick(); ui.render()
  ui.checks[0](); ui.select(ui.render(), 'settings')
  const operation = ui.settings(ui.render()).props.onRestore(0)
  revision.resolve({ revision: 2 }); await tick()
  assert.equal(reads, 1, 'the old poll must not start a replacing getState read')
  assert.equal(find(ui.render(), node => node.type === 'fieldset').props.disabled, true)
  restore.resolve(book('A', 'Restored title', 3)); await operation
  ui.select(ui.render(), 'project')
  const tree = ui.render()
  assert.equal(ui.project(tree).props.project.title, 'Restored title')
  assert.equal(find(tree, node => node.type === 'fieldset').props.disabled, false)
})

for (const settle of ['resolve', 'reject']) test(`an old conversation's late binding ${settle} cannot replace the selected conversation`, async () => {
  const reply = deferred()
  const binding = id => ({ binding: { handle: id, novelId: id }, novels: [] })
  const ui = mount({ getBinding: session => session === 's-A' ? reply.promise : Promise.resolve(binding('B')), getState: async id => book(id) })
  ui.render(); ui.active.session = 's-B'; ui.render(); await tick(); ui.render(); await tick()
  assert.equal(ui.project(ui.render()).props.project.title, 'Book B')
  reply[settle](settle === 'resolve' ? binding('A') : new Error('Old A failed')); await tick()
  assert.equal(ui.project(ui.render()).props.project.title, 'Book B')
})

test('a late bind action cannot clear the new conversation draft or change its selected book', async () => {
  const reply = deferred(), binding = id => ({ binding: { handle: id, novelId: id }, novels: [] })
  const ui = mount({ getBinding: async session => binding(session.slice(2)), getState: async id => book(id), bindNovel: () => reply.promise })
  ui.render(); await tick(); ui.render(); await tick(); ui.select(ui.render(), 'settings')
  ui.settings(ui.render()).props.library.onBind('other-book')
  ui.active.session = 's-B'; ui.render(); await tick(); ui.render(); await tick()
  ui.select(ui.render(), 'project'); ui.project(ui.render()).props.set('title', 'B draft'); ui.render()
  reply.resolve(binding('A-other')); await tick()
  const tree = ui.render()
  assert.equal(ui.project(tree).props.project.title, 'B draft')
  assert.equal(find(tree, node => node.type === 'button' && node.children.includes('save')).props.disabled, false)
})

test('unmounting the panel makes late loads and binding requests inert', async () => {
  const reply = deferred(), ui = mount({ getState: () => reply.promise })
  ui.render(); ui.runtime.unmount()
  const writes = ui.runtime.writes
  reply.resolve(book('A')); await tick()
  assert.equal(ui.runtime.writes, writes)
  const bindingReply = deferred(), bindingUi = mount({ getBinding: () => bindingReply.promise, getState: async id => book(id) })
  bindingUi.render(); bindingUi.runtime.unmount()
  const bindingWrites = bindingUi.runtime.writes
  bindingReply.resolve({ binding: { handle: 'A' }, novels: [] }); await tick()
  assert.equal(bindingUi.runtime.writes, bindingWrites)
})

test('the actual HistoryPanel delegates restore and ignores completion after it unmounts', async () => {
  const runtime = hooks(), reply = deferred(); let restores = 0
  const from = source.indexOf('    function HistoryPanel(props) {'), to = source.indexOf('    function SettingIcon(props) {', from)
  const History = vm.runInNewContext(`(${source.slice(from, to).trim()})`, {
    React: runtime.React, ActorPill: () => null, SnapshotDiff: () => null, NwIcon: () => null,
    failureText: error => error.message, operationLabel: () => '', relativeTime: () => '', describeChanges: () => '',
  })
  const props = { workspaceId: 'A', revision: 2, t: key => key, locked: false,
    onRestore: revision => { assert.equal(revision, 1); restores++; return reply.promise }, onError: () => assert.fail('unmounted error callback'),
    writer: { listHistory: async () => ({ entries: [{ revision: 1 }] }), compareSnapshot: async () => ({ sections: [{}] }) },
  }
  const render = () => runtime.render(History, props)
  render(); await tick()
  find(render(), node => node.type === 'button' && node.props.className === 'dshwnw-history-row').props.onClick(); await tick()
  find(render(), node => node.type === 'button' && node.children.includes('restoreAction')).props.onClick()
  find(render(), node => node.type === 'button' && node.props.className === 'dshwnw-primary').props.onClick()
  assert.equal(restores, 1)
  runtime.unmount(); const writes = runtime.writes
  reply.resolve(book('A', 'Restored', 3)); await tick()
  assert.equal(runtime.writes, writes)
})
