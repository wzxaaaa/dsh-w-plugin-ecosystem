import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { runInNewContext } from 'node:vm'

const source = await readFile(new URL('../client.js', import.meta.url), 'utf8')

test('mounts all Remote codecs with both lazy and legacy schema contracts', async () => {
  let plugin
  let contribution
  runInNewContext(source, {
    window: { __ModuleLoader__: { load: ({ factory }) => { plugin = factory(() => ({})) } } },
  })
  await plugin.apply({
    effect() {},
    locale: { bind: () => () => '' },
    remote: { $mount: async (value) => { contribution = value; return () => {} } },
    get: () => ({}),
    slots: { inject() {} },
  })
  assert.equal(contribution.package, 'dsh-w-custom-plugins')
  assert.deepEqual(Array.from(contribution.descriptors, item => item.method), [
    'listCustom', 'setEnabled', 'requestUpdate', 'requestInstall', 'refreshRepository', 'beginInstall',
    'appendInstallChunk', 'cancelInstall', 'finishInstall',
  ])
  for (const descriptor of contribution.descriptors) {
    for (const codec of [descriptor.result, ...descriptor.parameters.map(item => item.codec)]) {
      assert.equal(codec.mode, 'strict')
      assert.equal(typeof codec.create, 'function', descriptor.id)
      const schema = codec.create()
      assert.equal(typeof schema.parse, 'function', descriptor.id)
      assert.equal(schema, codec.schema)
      for (const value of [null, true, 42, 'entry-1', { enabled: false }, [{ name: 'plugin' }]]) {
        assert.equal(schema.parse(value), value)
        assert.equal(codec.schema.parse(value), value)
      }
    }
  }
})
