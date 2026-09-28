import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import vm from 'node:vm'
import { defaultProject } from '../noval-write-core.js'

test('failed workspace load does not expose or save the previous workspace draft', async () => {
  const source = readFileSync(new URL('../client.js', import.meta.url), 'utf8')
  const start = source.indexOf('    function NovelWriterPanel(props) {')
  const end = source.indexOf('    function SidebarRail(props) {', start)
  assert.ok(start !== -1 && end > start)

  const slots = []
  let cursor = 0
  let effects = []
  const equal = (a, b) => a?.length === b?.length && a.every((value, index) => Object.is(value, b[index]))
  const React = {
    useState(initial) {
      const index = cursor++
      if (!(index in slots)) slots[index] = initial
      return [slots[index], value => { slots[index] = typeof value === 'function' ? value(slots[index]) : value }]
    },
    useRef(initial) {
      const index = cursor++
      if (!(index in slots)) slots[index] = { current: initial }
      return slots[index]
    },
    useCallback(fn, deps) {
      const index = cursor++
      if (!slots[index] || !equal(slots[index].deps, deps)) slots[index] = { fn, deps }
      return slots[index].fn
    },
    useEffect(fn, deps) {
      const index = cursor++
      if (!slots[index] || !equal(slots[index].deps, deps)) {
        const previous = slots[index]
        slots[index] = { deps }
        effects.push(() => { previous?.cleanup?.(); slots[index].cleanup = fn() })
      }
    },
    createElement(type, props, ...children) { return { type, props: props || {}, children: children.flat() } },
  }
  const ProjectTab = () => null
  const SectionNav = () => null
  const Panel = vm.runInNewContext(`(${source.slice(start, end).trim()})`, {
    React, ProjectTab, SectionNav, clone: value => structuredClone(value), failureText: error => error.message,
    window: { confirm: () => true },
  })
  let active = 'A'
  let failB = false
  let saves = 0
  const writer = {
    getState: id => id === 'B' && failB
      ? Promise.reject(new Error('simulated load failure'))
      : Promise.resolve({ revision: 1, workspace: { id }, project: { ...defaultProject(), title: `Book ${id}` } }),
    saveProject: () => { saves++; throw new Error('stale draft was saved') },
  }
  const props = {
    writer,
    t: key => key,
    useSessions: select => select({ current: `session-${active}` }),
    useWorkspaces: select => select({ items: ['A', 'B'].map(id => ({ workspaceId: id, title: id, sessionIds: [`session-${id}`] })) }),
  }
  const render = () => {
    cursor = 0
    const tree = Panel(props)
    const pending = effects
    effects = []
    pending.forEach(effect => effect())
    return tree
  }
  const flush = () => new Promise(resolve => setImmediate(resolve))
  const find = (node, predicate) => {
    if (!node || typeof node !== 'object') return null
    if (predicate(node)) return node
    for (const child of node.children || []) {
      const match = find(child, predicate)
      if (match) return match
    }
    return null
  }

  render()
  await flush()
  const loadedA = render()
  assert.ok(find(loadedA, node => node.type === ProjectTab))

  active = 'B'
  failB = true
  render()
  await flush()
  const failedB = render()
  assert.equal(find(failedB, node => node.type === ProjectTab), null)
  const retry = find(failedB, node => node.type === 'button' && node.children.includes('retry'))
  assert.ok(retry, 'failed load should offer a retry')
  assert.equal(saves, 0)

  failB = false
  retry.props.onClick()
  await flush()
  const loadedB = render()
  assert.ok(find(loadedB, node => node.type === ProjectTab))
})
