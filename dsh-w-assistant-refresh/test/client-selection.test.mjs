import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { runInNewContext } from 'node:vm'

test('reply hiding follows the official main view across switches and retains legacy selection', async () => {
  const source = await readFile(new URL('../client.js', import.meta.url), 'utf8')
  const start = source.indexOf('    function currentSessionId() {')
  const end = source.indexOf('    function cssEscapeKey(', start)
  let snapshot = { current: 'legacy-session' }
  const read = runInNewContext(`(${source.slice(start, end).trim()})`, {
    appCtx: { sessions: { list: { getSnapshot: () => snapshot } } },
  })
  assert.equal(read(), 'legacy-session')
  snapshot = { byId: {
    background: { id: 'background', retainedBy: { sidebar: 1 } },
    first: { id: 'first', retainedBy: { mainView: 1 } },
    second: { id: 'second', retainedBy: {} },
  } }
  assert.equal(read(), 'first')
  snapshot.byId.first.retainedBy = {}
  snapshot.byId.second.retainedBy = { mainView: 1 }
  assert.equal(read(), 'second')
  snapshot.byId.second.retainedBy = {}
  assert.equal(read(), undefined)
})

for (const iconName of ['IconRefreshOutlineRegular', 'IconRefreshOutline16']) {
  test(`completed reply action renders with ${iconName}`, async () => {
    const source = await readFile(new URL('../client.js', import.meta.url), 'utf8')
    const icon = () => null
    const react = {
      useState: value => [value, () => {}],
      useEffect: () => {},
      createElement(type, props, ...children) {
        assert.notEqual(type, undefined, 'missing public UI export')
        return { type, props, children }
      },
    }
    let plugin, action
    runInNewContext(source, {
      window: { __ModuleLoader__: { load: definition => { plugin = definition.factory(name => name === 'react' ? react : { [iconName]: icon, Tooltip: () => null }) } } },
      document: { querySelector: () => null, createElement: () => ({ dataset: {}, remove() {} }), head: { appendChild() {} } },
    })
    await plugin.apply({
      effect: () => {}, locale: { register: () => {} },
      remote: { $mount: async () => () => {} },
      get: () => ({ hiddenKeys: async () => ({ ok: true, value: { keys: [] } }) }),
      sessions: { list: { getSnapshot: () => ({}), subscribe: () => () => {} } },
      slots: { inject: (_name, register) => register(), register: (_definition, component) => { action = component } },
    })
    const rendered = action({ useSession: () => false, t: key => key, sessionId: 'session' })
    const renderedIcon = rendered.children[0].children[0].children[0]
    assert.equal(renderedIcon.type, icon)
    assert.equal(renderedIcon.props.size, 16)
  })
}
