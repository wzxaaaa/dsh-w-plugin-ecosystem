// Behavioral integration of the host service with a deterministic Harness event
// harness. Protocol constructors are stubbed; persistence and plugin code are real.
import test from 'node:test'
import assert from 'node:assert/strict'
import { registerHooks } from 'node:module'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

const protocol = `
export class TypertRemoteService { constructor(ctx) { this.ctx = ctx } }
export const Remote = () => () => {};
export const createUserMessage = value => ({role:'user', ...value});
export const createAssistantMessage = value => ({role:'assistant', ...value});
export const isAgentLoopRequest = value => value.agentLoop === true;
export const SESSION_FORMAT_VERSION = 4;
export function deepFreeze(value) { if (value && typeof value === 'object' && !Object.isFrozen(value)) { Object.freeze(value); for (const child of Object.values(value)) deepFreeze(child) } return value }
export const load = value => JSON.parse(value);
`
const url = 'data:text/javascript,' + encodeURIComponent(protocol)
const hooks = registerHooks({ resolve(specifier, context, next) {
  if (context.parentURL?.endsWith('/dsh-w-persona/index.js') && (specifier.startsWith('@deepseek-ai/') || specifier === 'js-yaml')) return { url, shortCircuit: true }
  return next(specifier, context)
} })
const { PersonaManagerGateway } = await import('../index.js')
hooks.deregister()

const preset = name => ({ enabled: true, user1: `Hello ${name}`, assistant1: `${name} answers`, user2: 'Help', assistant2: 'Yes' })
const message = (role, text) => ({ role, content: [{ type: 'text', text }] })
const promptText = assembly => assembly.sections.map(section => section.text).filter(Boolean).join('\n\n')

async function harness(t) {
  const dir = await mkdtemp(join(tmpdir(), 'w-persona-test-'))
  t.after(() => rm(dir, { recursive: true, force: true }))
  const listeners = new Map()
  const dispatched = []
  const ctx = {
    baseUrl: pathToFileURL(dir + '/').href,
    loader: { entries: () => [{ id: 'system-prompt', options: { config: { personaPrefix: 'Official default' } } }] },
    on(name, handler) { listeners.set(name, handler) },
    llm: { stream: options => listeners.get('llm/stream')(options, async function* () { dispatched.push(options); yield { type: 'finish' } }) },
  }
  const host = new PersonaManagerGateway(ctx)
  async function request(id, { complete = false, compact = false, missingSlot = false } = {}) {
    const original = { sections: [
      { name: 'harness:identity', text: 'Harness identity' },
      { name: missingSlot ? 'custom:prefix' : 'deployment:persona-prefix', text: 'Official default' },
      { name: 'tool:guidance', text: 'Keep tool guidance' },
    ], contexts: [], tools: [], variables: { model: 'deepseek-flash', provider: 'deepseek-official', cwd: dir } }
    const assembly = await listeners.get('system-prompt/assemble')(original, { agent: { id } }, async () => original)
    // Mirrors official SystemPrompt.assemble(): complete restores the original
    // prefix AFTER all cooperative listeners have returned.
    const text = complete ? 'Official default' : promptText(assembly)
    const messages = compact ? [message('system', text), message('user', 'Compacted summary')]
      : [message('system', text), message('user', 'Current question')]
    const options = Object.freeze({ agentLoop: true, sessionId: id, provider: 'deepseek-official', model: 'deepseek-flash', messages })
    for await (const _chunk of ctx.llm.stream(options)) { /* consume */ }
    return { options, outgoing: dispatched.at(-1) }
  }
  return { host, request, dir, listeners, dispatched }
}

test('host keeps leading System, injects all four examples, and does not mutate the session history', async t => {
  const { host, request, dir } = await harness(t)
  await host.saveConfiguration('You are {{char}}', preset('Whale'), { characterName: 'Whale', suffix: 'Be concise' })
  assert.equal((await host.getState()).injectionStatus.state, 'pending')
  const { outgoing, options } = await request('one')
  assert.equal(outgoing.messages[0].role, 'system')
  assert.match(outgoing.messages[0].content[0].text, /You are Whale/)
  assert.match(outgoing.messages[0].content[0].text, /Keep tool guidance/)
  assert.match(outgoing.messages[0].content[0].text, /Be concise/)
  assert.equal(outgoing.messages.length, 6)
  assert.equal(options.messages.length, 2)
  assert.equal((await host.getState()).injectionStatus.exampleMessages, 4)
  assert.equal((await host.getState()).injectionStatus.matchesCurrent, true)
  await assert.rejects(readFile(join(dir, 'cordis.patch.yml')), { code: 'ENOENT' })
})

test('complete-mode final fallback and missing-slot fallback also work after compaction', async t => {
  const { host, request } = await harness(t)
  await host.saveConfiguration('Whale', preset('Whale'), { suffix: 'Warm' })
  const complete = await request('one', { complete: true })
  assert.doesNotMatch(complete.outgoing.messages[0].content[0].text, /Official default/)
  assert.match(complete.outgoing.messages[0].content[0].text, /Warm/)
  assert.equal((await host.getState()).injectionStatus.route, 'complete-fallback')
  const compact = await request('one', { compact: true, missingSlot: true })
  assert.match(compact.outgoing.messages[0].content[0].text, /Keep tool guidance/)
  assert.match(compact.outgoing.messages[0].content[0].text, /Whale/)
  assert.equal(compact.outgoing.messages[1].content[0].text, 'Hello Whale')
  assert.equal((await host.getState()).injectionStatus.route, 'request-fallback')
})

test('new-only holds body AND examples; immediate switches both; restart reloads persisted settings', async t => {
  const h = await harness(t)
  await h.host.saveConfiguration('Detective', preset('Detective'), {})
  await h.request('existing')
  await h.host.saveConfiguration('Teacher', preset('Teacher'), { applyMode: 'new-conversations', suffix: 'Patient' })
  const held = (await h.request('existing')).outgoing
  assert.match(held.messages[0].content[0].text, /Detective/)
  assert.equal(held.messages[1].content[0].text, 'Hello Detective')
  assert.equal((await h.host.getState()).injectionStatus.matchesCurrent, false)
  const fresh = (await h.request('fresh')).outgoing
  assert.match(fresh.messages[0].content[0].text, /Teacher/)
  assert.equal(fresh.messages[1].content[0].text, 'Hello Teacher')
  assert.equal((await h.host.getState()).injectionStatus.matchesCurrent, true)
  await h.host.saveConfiguration('Teacher', preset('Teacher'), { suffix: 'Patient' })
  const switched = (await h.request('existing')).outgoing
  assert.match(switched.messages[0].content[0].text, /Teacher/)
  assert.equal(switched.messages[1].content[0].text, 'Hello Teacher')
  const state = JSON.parse(await readFile(join(h.dir, '.dsh-w-persona-override.json'), 'utf8'))
  assert.equal(state.settings.suffix, 'Patient')
  h.host._customPersona = undefined
  assert.equal((await h.host.getState()).settings.suffix, 'Patient')
  h.listeners.get('agent/disposed')({ agent: { id: 'existing' } })
  assert.equal(h.host._sessionConfigurations.has('existing'), false)
})

test('invalid save leaves all persisted configuration unchanged; plain text survives official rendering', async t => {
  const { host, request, dir } = await harness(t)
  await host.saveConfiguration('Whale', {}, {})
  const before = await readFile(join(dir, '.dsh-w-persona-override.json'), 'utf8')
  await assert.rejects(host.saveConfiguration('{{unknown}}', {}, {}), /不支持的变量/)
  assert.equal(await readFile(join(dir, '.dsh-w-persona-override.json'), 'utf8'), before)
  await host.saveConfiguration('{{unknown}}', {}, { textMode: 'plain' })
  assert.match((await request('one')).outgoing.messages[0].content[0].text, /\{\{unknown\}\}/)
})

test('legacy state and templates remain readable; template apply includes settings', async t => {
  const { host, dir } = await harness(t)
  await writeFile(join(dir, '.dsh-w-persona-override.json'), JSON.stringify({ version: 1, persona: 'Legacy' }))
  assert.equal((await host.getState()).current, 'Legacy')
  const saved = await host.saveTemplate({ name: 'Teacher', persona: '{{char}}', dialoguePreset: preset('Teacher'), settings: { characterName: 'Teacher', suffix: 'Patient' } })
  const applied = await host.applyTemplate(saved.template.id)
  assert.equal(applied.settings.characterName, 'Teacher')
  assert.equal(applied.activeTemplateId, saved.template.id)
  assert.equal(applied.applied, false)
})

test('legacy unsupported variables remain editable and assembly failures are reported', async t => {
  const { host, dir, request } = await harness(t)
  await writeFile(join(dir, '.dsh-w-persona-override.json'), JSON.stringify({ version: 1, persona: '{{unknown}}' }))
  assert.equal((await host.getState()).current, '{{unknown}}')
  await assert.rejects(request('one'), /不支持的变量/)
  assert.equal((await host.getState()).injectionStatus.state, 'error')
  await host.saveConfiguration('{{unknown}}', {}, { textMode: 'plain' })
  assert.match((await request('one')).outgoing.messages[0].content[0].text, /\{\{unknown\}\}/)
})
