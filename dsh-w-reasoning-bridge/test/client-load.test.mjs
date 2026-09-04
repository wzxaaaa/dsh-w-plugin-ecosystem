import test from 'node:test'
import assert from 'node:assert/strict'

test('browser bundle mounts inside the official Models provider card', async () => {
  let definition
  globalThis.window = {
    __ModuleLoader__: {
      load(value) { definition = value },
    },
  }
  try {
    await import(`../client.js?test=${Date.now()}`)
    assert.equal(definition.id, 'dsh-w-reasoning-bridge')

    const plugin = definition.factory((id) => {
      assert.equal(id, 'react')
      return {}
    })
    assert.equal(plugin.name, 'dsh-w-reasoning-bridge')
    assert.deepEqual(plugin.inject, [
      'slots', 'locale', 'remote', 'remote.settings', 'remote.session',
    ])

    const entries = []
    const disposers = []
    const ctx = {
      effect(callback) {
        const dispose = callback()
        if (typeof dispose === 'function') disposers.push(dispose)
      },
      locale: {
        register() { return () => {} },
        bind() { return key => key },
      },
      slots: {
        inject(name, callback) {
          assert.equal(name, 'settings.models.provider-card')
          return callback()
        },
        register(options, component) {
          entries.push({ options, component })
          return () => {}
        },
      },
      remote: {},
    }

    await plugin.apply(ctx)
    assert.equal(entries.length, 1)
    assert.equal(entries[0].options.key, 'llm-pi-ai')
    assert.equal(entries[0].options.name, 'settings.models.provider-card')
    assert.equal(typeof entries[0].options.inject, 'function')
    assert.equal(typeof entries[0].component, 'function')
    const injected = entries[0].options.inject()
    assert.equal(typeof injected.readSnapshot, 'function')
    assert.equal(typeof injected.invalidateSnapshot, 'function')
    assert.equal(typeof injected.mutateSettings, 'function')
    disposers.reverse().forEach(dispose => dispose())
  } finally {
    delete globalThis.window
  }
})
