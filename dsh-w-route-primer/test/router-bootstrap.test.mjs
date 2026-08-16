import assert from 'node:assert/strict'
import test from 'node:test'

import {
  RL_PERSONA,
  W_PERSONA_SECTION,
  apply,
  standardSections,
} from '../route-primer-bootstrap.mjs'

function message(text) {
  return {
    source: { kind: 'user' },
    content: [{ type: 'text', text }],
  }
}

function createHarness() {
  const listeners = new Map()
  const registered = new Map()
  const guides = []
  const session = {
    id: 'session-1',
    events: [],
  }
  const agent = {
    options: { provider: 'test-provider', model: 'deepseek-v4-pro' },
    session,
    inbox: {
      append(_slot, item) { guides.push(item) },
    },
  }
  const personaManager = {
    async getState() { return { current: 'live custom persona' } },
  }
  const ctx = {
    llm: {
      async *stream() {
        yield { type: 'reasoning-delta', text: 'reason' }
        yield { type: 'text-delta', text: 'answer' }
      },
    },
    tools: {
      register(tool) {
        registered.set(tool.name, tool)
        return () => registered.delete(tool.name)
      },
    },
    effect(setup) { return setup() },
    get(name) {
      if (name === 'agent') return agent
      if (name === 'personaManager') return personaManager
      return undefined
    },
    on(name, listener) {
      listeners.set(name, listener)
      return () => listeners.delete(name)
    },
  }
  return { agent, ctx, guides, listeners, registered, session }
}

function assembled() {
  return {
    sections: [
      { name: 'harness:identity', text: 'identity' },
      { name: W_PERSONA_SECTION, text: 'custom w-persona' },
      { name: 'tool-guidance', text: 'guidance' },
    ],
    contexts: [{ name: 'runtime', text: 'dynamic context' }],
    tools: [
      { name: 'read' },
      { name: 'pwsh' },
      { name: 'str_replace_editor' },
      { name: 'web_search' },
    ],
  }
}

test('standard sections send RL anchor before the live w-persona section', () => {
  const custom = { name: W_PERSONA_SECTION, text: 'custom w-persona' }
  const sections = standardSections({
    sections: [custom, { name: 'plan-mode', text: 'plan boundary' }],
  })
  assert.deepEqual(sections, [
    { name: 'plan-mode', text: 'plan boundary' },
    { name: 'router-persona', text: RL_PERSONA, order: 0 },
    custom,
  ])
})

test('scoped router matches upstream bootstrap, guidance, promotion, and tools', async () => {
  const harness = createHarness()
  apply(harness.ctx, { routerMode: 'standard' })

  assert.deepEqual([...harness.registered.keys()].sort(), [
    'dev_mode_subagent',
    'dev_router_mode',
    'dev_router_status',
  ])

  const userEvent = { type: 'user/message', data: message('请看看这个') }
  harness.session.events.push(userEvent)
  harness.listeners.get('session/event')(harness.session, userEvent)
  assert.equal(harness.guides.length, 1)
  assert.match(harness.guides[0].content[0].text, /classify this task/)
  assert.equal(harness.guides[0].source.plugin, 'dsh-w-route-primer')

  const assemblyListener = harness.listeners.get('system-prompt/assemble')
  const first = await assemblyListener(undefined, { agent: harness.agent }, async () => assembled())
  assert.deepEqual(first.sections.map(section => section.name), ['router-persona', W_PERSONA_SECTION])
  assert.deepEqual(first.sections.map(section => section.text), [RL_PERSONA, 'custom w-persona'])
  assert.deepEqual(first.contexts, [])
  assert.deepEqual(first.tools.map(tool => tool.name), ['pwsh', 'str_replace_editor'])

  harness.session.events.push({ type: 'tool/call', data: { name: 'pwsh' } })
  const promoted = await assemblyListener(undefined, { agent: harness.agent }, async () => assembled())
  assert.deepEqual(promoted.sections.map(section => section.name), ['router-persona', W_PERSONA_SECTION])
  assert.deepEqual(promoted.contexts, [])
  assert.deepEqual(promoted.tools.map(tool => tool.name), ['read', 'pwsh', 'str_replace_editor', 'web_search'])

  const status = harness.registered.get('dev_router_status').execute()
  assert.match(status, /band=weak/)
  const subagent = await harness.registered.get('dev_mode_subagent').execute({ mode: 'react', task: 'build it' })
  assert.match(subagent, /mode-subagent react/)
  assert.match(subagent, /answer/)

  harness.listeners.get('session/disposed')(harness.session)
})

test('clear build/fix tasks classify without weak guidance', () => {
  const harness = createHarness()
  apply(harness.ctx, { routerMode: 'standard' })
  const event = { type: 'user/message', data: message('从零创建一个网页游戏') }
  harness.session.events.push(event)
  harness.listeners.get('session/event')(harness.session, event)
  assert.equal(harness.guides.length, 0)
  const status = harness.registered.get('dev_router_status').execute()
  assert.match(status, /band=react/)
})
