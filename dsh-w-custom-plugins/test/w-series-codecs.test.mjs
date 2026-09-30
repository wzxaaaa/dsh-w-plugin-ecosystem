import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { runInNewContext } from 'node:vm'
import test from 'node:test'

for (const name of ['assistant-refresh', 'camera-watch', 'deslop', 'knowledge-base', 'noval-write', 'persona']) {
  test(`${name}: every mounted RPC codec supports the official lazy factory and legacy parse contract`, async () => {
    const moduleName = `dsh-w-${name}`
    const source = await readFile(new URL(`../../${moduleName}/client.js`, import.meta.url), 'utf8')
    let plugin, contribution
    const document = {
      querySelector: () => null,
      getElementById: () => null,
      createElement: () => ({ dataset: {}, textContent: '', remove() {} }),
      head: { appendChild() {} },
    }
    runInNewContext(source, {
      document,
      window: { __ModuleLoader__: { load: ({ factory }) => { plugin = factory(() => ({})) } } },
    })
    const mounted = new Error('stop after mounting the actual descriptors')
    await assert.rejects(plugin.apply({
      effect() {},
      slots: { inject() {} },
      locale: { bind: () => () => '', register() {} },
      remote: { $mount: async value => { contribution = value; throw mounted } },
    }), error => error === mounted)
    assert.equal(contribution.package, moduleName)
    assert.ok(contribution.descriptors.length > 0)
    for (const descriptor of contribution.descriptors) {
      for (const codec of [descriptor.result, ...descriptor.parameters.map(item => item.codec)]) {
        assert.equal(typeof codec.create, 'function', descriptor.id)
        const schema = codec.create()
        assert.equal(schema, codec.schema)
        for (const value of [null, false, 42, 'entry-1', { enabled: false }, [{ name: 'plugin' }]]) {
          assert.equal(schema.parse(value), value, descriptor.id)
        }
      }
    }
    const manifest = JSON.parse(await readFile(new URL(`../../${moduleName}/package.json`, import.meta.url), 'utf8'))
    assert.ok(manifest.dsh.client.inject.includes('@deepseek-ai/dsh-client-ui-slots'))
    if (plugin.inject.includes('sessions')) assert.ok(manifest.dsh.client.inject.includes('@deepseek-ai/dsh-client-ui-session'))
  })
}
