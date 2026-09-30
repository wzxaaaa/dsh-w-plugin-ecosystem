import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import vm from 'node:vm'
import { defaultProject } from '../noval-write-core.js'

// Runs the real NovelWriterPanel with a tiny hook implementation, as the
// workspace-switch test does, to check the conversation → novel gate.
function mountPanel(props) {
  const source = readFileSync(new URL('../client.js', import.meta.url), 'utf8')
  const start = source.indexOf('    function NovelWriterPanel(props) {')
  const end = source.indexOf('    function SidebarRail(props) {', start)
  const slots = []
  let cursor = 0
  let effects = []
  const equal = (a, b) => a?.length === b?.length && a.every((value, index) => Object.is(value, b[index]))
  const React = {
    useState(initial) { const i = cursor++; if (!(i in slots)) slots[i] = initial; return [slots[i], v => { slots[i] = typeof v === 'function' ? v(slots[i]) : v }] },
    useRef(initial) { const i = cursor++; if (!(i in slots)) slots[i] = { current: initial }; return slots[i] },
    useCallback(fn, deps) { const i = cursor++; if (!slots[i] || !equal(slots[i].deps, deps)) slots[i] = { fn, deps }; return slots[i].fn },
    useEffect(fn, deps) { const i = cursor++; if (!slots[i] || !equal(slots[i].deps, deps)) { const prev = slots[i]; slots[i] = { deps }; effects.push(() => { prev?.cleanup?.(); slots[i].cleanup = fn() }) } },
    createElement(type, p, ...children) { return { type, props: p || {}, children: children.flat() } },
  }
  const stubs = { ProjectTab: () => null, SectionNav: () => null, NovelLibrary: () => null, progressionOn: () => false }
  const Panel = vm.runInNewContext(`(${source.slice(start, end).trim()})`, {
    React, ...stubs, clone: v => structuredClone(v), failureText: e => e.message,
    window: { confirm: () => true, setInterval: () => 0, clearInterval() {}, addEventListener() {}, removeEventListener() {} },
    document: { visibilityState: 'visible', addEventListener() {}, removeEventListener() {} },
  })
  const render = () => { cursor = 0; const tree = Panel(props); const pending = effects; effects = []; pending.forEach(e => e()); return tree }
  return { render, stubs }
}

const flush = () => new Promise(resolve => setImmediate(resolve))
const find = (node, predicate) => {
  if (!node || typeof node !== 'object') return null
  if (predicate(node)) return node
  for (const child of node.children || []) { const hit = find(child, predicate); if (hit) return hit }
  return null
}

for (const mode of ['legacy', 'official']) test(`${mode}: an unbound conversation sees only the novel library, a bound one its own novel`, async () => {
  let binding = null
  const reads = []
  const writer = {
    getBinding: async () => ({ binding, novels: [{ handle: 'w1#n1', id: 'n1', title: '长夜', folder: '长夜' }] }),
    bindNovel: async (_s, _w, novelId) => { binding = { handle: `w1#${novelId}`, novelId, title: '长夜', folder: '长夜' }; return { binding, novels: [] } },
    getState: async handle => { reads.push(handle); return { revision: 1, workspace: { id: handle, folder: '长夜' }, project: { ...defaultProject(), title: '长夜' } } },
  }
  const { render, stubs } = mountPanel({
    writer, t: key => key,
    useSessions: select => select(mode === 'legacy' ? { current: 's1' } : { byId: {
      other: { id: 'other', retainedBy: { sidebar: 1 } },
      s1: { id: 's1', retainedBy: { mainView: 1 } },
    } }),
    useWorkspaces: select => select({ items: [{ workspaceId: 'w1', title: 'W', sessionIds: ['s1'] }] }),
  })

  render(); await flush()
  const unbound = render()
  const library = find(unbound, node => node.type === stubs.NovelLibrary)
  assert.ok(library, 'the library is shown')
  assert.equal(library.props.mode, 'picker')
  assert.equal(find(unbound, node => node.type === stubs.ProjectTab), null, 'no project is exposed before binding')
  assert.deepEqual(reads, [], 'nothing is read before binding')

  library.props.onBind('n1')
  await flush(); render(); await flush(); await flush()
  const bound = render()
  assert.ok(find(bound, node => node.type === stubs.ProjectTab), 'the bound novel opens')
  assert.deepEqual(reads, ['w1#n1'], 'the panel reads the novel by its handle')
})
