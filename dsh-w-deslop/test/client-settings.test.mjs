import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'

const source = readFileSync(new URL('../client.js', import.meta.url), 'utf8')

// A tiny hook runtime: enough to render the settings form, run its effects
// and re-render after state changes.
function createReact() {
  const slots = []
  let cursor = 0
  let pending = []
  let dirty = false
  const equal = (a, b) => a?.length === b?.length && a.every((value, index) => Object.is(value, b[index]))
  const React = {
    useState(initial) {
      const i = cursor++
      if (!(i in slots)) slots[i] = initial
      return [slots[i], value => { slots[i] = typeof value === 'function' ? value(slots[i]) : value; dirty = true }]
    },
    useEffect(fn, deps) {
      const i = cursor++
      if (!slots[i] || !equal(slots[i].deps, deps)) { slots[i] = { deps }; pending.push(() => { slots[i].cleanup = fn() }) }
    },
    createElement(type, props, ...children) {
      if (typeof type === 'function') return type({ ...(props || {}), children })
      return { type, props: props || {}, children: children.flat() }
    },
    Fragment: 'Fragment',
  }
  return {
    React,
    render(Component, props) {
      cursor = 0
      dirty = false
      const tree = Component(props)
      const effects = pending
      pending = []
      for (const effect of effects) effect()
      return tree
    },
    get dirty() { return dirty },
  }
}

function load(react) {
  let definition
  const sandbox = {
    window: { __ModuleLoader__: { load(value) { definition = value } } },
    document: undefined,
    console,
  }
  vm.runInNewContext(source, sandbox)
  return definition.factory(name => {
    if (name === 'react') return react.React
    throw new Error(`unexpected require ${name}`)
  })
}

function textOf(node) {
  if (node === null || node === undefined || node === false) return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  return (node.children || []).map(textOf).join('')
}

function find(node, predicate) {
  if (!node || typeof node !== 'object') return undefined
  if (predicate(node)) return node
  for (const child of node.children || []) {
    const hit = find(child, predicate)
    if (hit) return hit
  }
  return undefined
}

const tick = () => new Promise(resolve => setImmediate(resolve))

test('apply mounts the remote and registers the plugin settings form', async () => {
  const react = createReact()
  const mod = load(react)
  const registered = []
  const remote = {
    getState: async () => ({ ok: true, value: {} }),
  }
  const ctx = {
    effect() {},
    locale: { register() { return () => {} } },
    remote: { $mount: async descriptorSet => { assert.equal(descriptorSet.package, 'dsh-w-deslop'); return () => {} } },
    get: key => (key === 'remote.deslopWriter' ? remote : undefined),
    slots: {
      inject(name, fn) { assert.equal(name, 'custom-plugin.settings'); fn() },
      register(options, component) { registered.push({ options, component }) },
    },
  }
  await mod.apply(ctx)
  assert.equal(registered.length, 1)
  assert.equal(registered[0].options.key, 'dsh-w-deslop')
  assert.deepEqual(Object.keys(registered[0].options.inject()), ['getState', 'saveConfig', 'previewScan'])
})

test('settings form loads, saves the edited config and shows a scan report', async () => {
  const react = createReact()
  const mod = load(react)
  let Component
  const ctx = {
    effect() {},
    locale: { register() { return () => {} } },
    remote: { $mount: async () => () => {} },
    get: () => ({}),
    slots: { inject(_name, fn) { fn() }, register(_options, component) { Component = component } },
  }
  await mod.apply(ctx)
  const saved = []
  const state = {
    config: { enabled: true, strict: false, autoCheck: true, extraBanned: ['霸气侧漏'], whitelist: [] },
    novelPluginAvailable: false,
    promptPreview: '# 去 AI 味写作规则',
  }
  const props = {
    t: key => key,
    getState: async () => state,
    saveConfig: async input => { saved.push(input); return { ...state, config: { ...state.config, strict: input.strict } } },
    previewScan: async () => ({
      summary: { verdict: '需要修改', chars: 12, high: 1, advise: 0 },
      stats: { averageSentence: 12, shortSentenceRatio: 0, weakAdverbsPerThousand: 0, dialogueRatio: 0 },
      hits: [{ rule: 'not-but', severity: 'high', label: '「不是A，而是B」句式', line: 1, match: '不是怕，而是', excerpt: '他不是怕，而是恨。', fix: '直接写 B。' }],
    }),
  }
  let tree = react.render(Component, props)
  assert.match(textOf(tree), /loading/)
  await tick()
  tree = react.render(Component, props)
  assert.match(textOf(tree), /statusMissing/, 'warns when the novel plugin is absent')
  const extra = find(tree, node => node.type === 'textarea' && node.props.value === '霸气侧漏')
  assert.ok(extra, 'custom words render one per line')

  const strictSwitch = find(tree, node => node.props && node.props['aria-label'] === 'strict')
  strictSwitch.props.onClick()
  tree = react.render(Component, props)
  find(tree, node => node.type === 'button' && textOf(node) === 'save').props.onClick()
  await tick()
  assert.equal(saved.length, 1)
  assert.equal(saved[0].strict, true)
  assert.equal(saved[0].extraBanned, '霸气侧漏')

  tree = react.render(Component, props)
  const sample = find(tree, node => node.type === 'textarea' && node.props.placeholder === 'tryPlaceholder')
  sample.props.onChange({ currentTarget: { value: '他不是怕，而是恨。' } })
  tree = react.render(Component, props)
  find(tree, node => node.type === 'button' && textOf(node) === 'scan').props.onClick()
  await tick()
  tree = react.render(Component, props)
  assert.match(textOf(tree), /不是怕，而是/)
  assert.match(textOf(tree), /直接写 B/)
})
