import test from 'node:test'
import assert from 'node:assert/strict'
import {
  normalizeConfiguration, normalizePersonaSettings, renderConfiguration,
  sessionConfiguration, enforceRequestPersona, insertDialogueExamples, personaBody, personaStyle,
} from '../persona-injection-core.js'
import { savePersonaTemplate, personaTemplateMatches } from '../persona-template-core.js'

const msg = (role, text) => ({ role, content: [{ type: 'text', text }] })
const example = { enabled: true, user1: 'Hello {{char}}', assistant1: '{{user}}, hi', user2: 'Help', assistant2: 'Of course' }
const settings = { characterName: 'Whale', userName: 'Alex', suffix: 'Be concise, {{char}}.' }
const config = () => normalizeConfiguration('You are {{char}} on {{model}}.', example, settings)
const vars = { model: 'deepseek-flash', provider: 'deepseek-official', cwd: 'C:/work' }

test('renders supported variables once, including examples and literal replacement values', () => {
  const rendered = renderConfiguration(config(), vars)
  assert.equal(rendered.persona, 'You are Whale on deepseek-flash.')
  assert.equal(rendered.turns[1].text, 'Alex, hi')
  assert.match(rendered.suffix, /Character name: Whale/)
  assert.match(rendered.suffix, /Be concise, Whale/)
  const literal = normalizeConfiguration('{{char}}', {}, { characterName: '$& {{unknown}}' })
  assert.equal(renderConfiguration(literal, vars).persona, '$& {{unknown}}')
})

test('rejects unknown/unbound variables before save; plain text keeps all braces', () => {
  assert.throws(() => normalizeConfiguration('{{unknown}}', {}, {}), /不支持的变量/)
  assert.throws(() => normalizeConfiguration('{{char}}', {}, {}), /角色名/)
  assert.throws(() => normalizeConfiguration('', example, {}), /角色名/)
  const literal = normalizeConfiguration('{{unknown}} {{char}}', {}, { textMode: 'plain' })
  assert.equal(renderConfiguration(literal, vars).persona, '{{unknown}} {{char}}')
  assert.throws(() => normalizePersonaSettings({ applyMode: 'surprise' }), /applyMode/)
})

test('switches the entire session snapshot immediately or holds the entire old snapshot', () => {
  const sessions = new Map()
  const old = config()
  const first = sessionConfiguration(sessions, 'a', old)
  old.persona = 'mutation must not leak'
  assert.notEqual(first.persona, old.persona)
  const next = normalizeConfiguration('Teacher', { ...example, user1: 'new example' }, { ...settings, applyMode: 'new-conversations' })
  assert.deepEqual(sessionConfiguration(sessions, 'a', next), first)
  assert.equal(sessionConfiguration(sessions, 'b', next).persona, 'Teacher')
  next.settings.applyMode = 'immediate'
  const updated = sessionConfiguration(sessions, 'a', next)
  assert.equal(updated.persona, 'Teacher')
  assert.equal(updated.dialoguePreset.user1, 'new example')
})

test('complete-prompt fallback replaces the fixed prefix while normal assembly preserves tool guidance', () => {
  const rendered = renderConfiguration(config(), vars)
  const fixed = Object.freeze([msg('system', 'Fixed engineer'), msg('user', 'Question')])
  const result = enforceRequestPersona(fixed, rendered, 'Fixed engineer')
  assert.equal(result.route, 'complete-fallback')
  assert.equal(result.messages[0].content[0].text, personaBody(rendered.persona) + '\n\n' + personaStyle(rendered.suffix))
  assert.equal(fixed[0].content[0].text, 'Fixed engineer')
  const normal = [msg('system', personaBody(rendered.persona) + '\nTools guidance\n' + personaStyle(rendered.suffix)), msg('user', 'Question')]
  assert.equal(enforceRequestPersona(normal, rendered).messages, normal)
  assert.equal(enforceRequestPersona(normal, rendered).route, 'assembly')
})

test('missing persona slot falls back without deleting Harness instructions', () => {
  const result = enforceRequestPersona([msg('system', 'Tools and policy')], renderConfiguration(config(), vars))
  assert.equal(result.route, 'request-fallback')
  assert.match(result.messages[0].content[0].text, /^Tools and policy/)
  assert.throws(() => enforceRequestPersona([msg('user', 'no system')], renderConfiguration(config(), vars)), /缺少 System/)
})

test('examples follow leading System, preserve later system updates, and repeat correctly after compaction', () => {
  const history = [msg('system', 'first'), msg('developer', 'tools'), msg('user', 'old'), msg('assistant', 'old answer'), msg('system', 'updated'), msg('user', 'current')]
  const prefix = [msg('user', 'example'), msg('assistant', 'style')]
  const injected = insertDialogueExamples(history, prefix)
  assert.deepEqual(injected.map(message => message.role), ['system', 'developer', 'user', 'assistant', 'user', 'assistant', 'system', 'user'])
  assert.equal(injected[6], history[4])
  assert.equal(history.length, 6)
  const compact = [msg('system', 'current'), msg('user', 'summary')]
  assert.equal(insertDialogueExamples(compact, prefix)[1], prefix[0])
  const rendered = renderConfiguration(config(), vars)
  const updated = enforceRequestPersona(history, rendered)
  assert.equal(updated.messages[0], history[0])
  assert.match(updated.messages[4].content[0].text, /w-persona/)
})

test('templates roundtrip settings and legacy templates acquire compatible defaults', () => {
  const created = savePersonaTemplate(null, { name: 'Whale', persona: '{{char}}', dialoguePreset: example, settings }, { id: 'one', now: 'now' })
  assert.equal(personaTemplateMatches(created.template, '{{char}}', example, settings), true)
  assert.equal(personaTemplateMatches(created.template, '{{char}}', example, { ...settings, suffix: 'other' }), false)
  const legacy = savePersonaTemplate(null, { name: 'Old', persona: 'Old' }, { id: 'old', now: 'now' })
  assert.deepEqual(legacy.template.settings, normalizePersonaSettings())
})
