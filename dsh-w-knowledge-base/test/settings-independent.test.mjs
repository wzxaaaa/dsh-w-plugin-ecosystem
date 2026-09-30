import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import vm from 'node:vm'

test('settings provides the knowledge-base API when no right-sidebar slots exist', async () => {
  const source = await readFile(new URL('../client.js', import.meta.url), 'utf8')
  let plugin, section, completeMount
  const mounting = new Promise(resolve => { completeMount = resolve })
  vm.runInNewContext(source, {
    window: { __ModuleLoader__: { load: ({ factory }) => { plugin = factory(() => ({})) } } },
    document: { querySelector: () => null, getElementById: () => null, createElement: () => ({ dataset: {}, remove() {} }), head: { appendChild() {} } },
  })
  const applying = plugin.apply({
    effect() {}, locale: { register() {}, bind: () => k => k },
    remote: { $mount: () => mounting },
    get: () => ({ getStats: async () => ({ ok: true, value: { count: 7 } }) }),
    slots: {
      inject: (name, fn) => { if (name === 'settings.section') fn() },
      register: (options, component) => { section = { options, component }; return () => {} },
    },
  })
  assert.equal(section.options.id, 'knowledge-base')
  assert.equal(section.options.label(), 'nav')
  assert.equal(typeof section.component, 'function')
  const stats = section.options.inject().kb.stats()
  completeMount(() => {})
  await applying
  assert.equal((await stats).count, 7)
  const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'))
  assert.equal(manifest.dsh.client.inject.some(name => name.includes('right-sidebar')), false)
})
