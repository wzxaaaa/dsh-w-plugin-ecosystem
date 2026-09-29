import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import vm from 'node:vm'

const source = readFileSync(new URL('../client.js', import.meta.url), 'utf8')

test('no client calls a native dialog, which strands keyboard focus in Electron on Windows', () => {
  assert.doesNotMatch(source, /window\.(confirm|alert|prompt)\(\s*[^)\s]/)
})

// Runs the real PersonaSection with a tiny hook implementation.
function mountSection(props) {
  const start = source.indexOf('    function emptyPreset(')
  const end = source.indexOf('    var NS = "dshWPersona";')
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
    Fragment: 'Fragment',
  }
  const Section = vm.runInNewContext(`${source.slice(start, end)}\nPersonaSection`, {
    React, console, setTimeout, clearTimeout,
    window: { confirm() { throw new Error('native confirm must not be used') } },
  })
  const render = () => { cursor = 0; const tree = Section(props); const pending = effects; effects = []; pending.forEach(e => e()); return tree }
  return render
}

const flush = () => new Promise(resolve => setImmediate(resolve))
const findAll = (node, predicate, out = []) => {
  if (!node || typeof node !== 'object') return out
  if (predicate(node)) out.push(node)
  for (const child of node.children || []) findAll(child, predicate, out)
  return out
}
const text = node => (node.children || []).map(child => (typeof child === 'string' ? child : '')).join('')

test('deleting a template asks inside the panel, then deletes on the second click', async () => {
  const templates = [
    { id: 'a', name: '江娘', persona: 'A', dialoguePreset: {} },
    { id: 'b', name: '鲸鱼娘', persona: 'B', dialoguePreset: {} },
  ]
  const deleted = []
  const state = () => ({ current: 'A', defaultText: '', dialoguePreset: {}, templates: templates.filter(t => !deleted.includes(t.id)), activeTemplateId: 'a' })
  const render = mountSection({
    t: key => key,
    getState: async () => state(),
    saveConfiguration: async () => state(),
    saveTemplate: async () => state(),
    applyTemplate: async () => state(),
    deleteTemplate: async id => { deleted.push(id); return state() },
  })
  render(); await flush()
  const deleteButton = () => findAll(render(), node => node.type === 'button' && node.props['data-danger'] === 'true')[0]

  deleteButton().props.onClick()
  const armed = render()
  assert.deepEqual(deleted, [], 'the first click only asks')
  assert.equal(findAll(armed, node => node.props?.className === 'pw-confirm').length, 1, 'an inline confirmation appears')
  assert.equal(text(deleteButton()), 'templateDeleteArmed')

  // choosing another template cancels the pending delete
  const select = findAll(render(), node => node.type === 'select')[0]
  select.props.onChange({ currentTarget: { value: 'b' } })
  assert.equal(text(deleteButton()), 'templateDelete')

  deleteButton().props.onClick()
  deleteButton().props.onClick()
  await flush()
  assert.deepEqual(deleted, ['b'])
  const after = render()
  assert.equal(findAll(after, node => node.type === 'select')[0].props.disabled, false, 'the list stays usable after deleting')
})
