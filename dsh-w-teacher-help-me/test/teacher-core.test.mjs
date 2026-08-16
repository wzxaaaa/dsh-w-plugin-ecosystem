import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'

import {
  TEACHER_SYSTEM_PROMPT,
  buildContext,
  buildTeacherRequest,
  callTeacherApi,
  chatCompletionsEndpoint,
  extractTeacherText,
  normalizeConsultInput,
  writeJsonAtomic,
} from '../teacher-core.js'

test('normalizes consultation input with focused defaults and bounded budget', () => {
  const value = normalizeConsultInput({ problem: ' build keeps failing ' })
  assert.equal(value.problem, 'build keeps failing')
  assert.equal(value.attempts, '')
  assert.equal(value.contextMode, 'focused')
  assert.equal(value.contextBudget, 120000)
  assert.equal(normalizeConsultInput({ problem: 'x', contextBudget: 1 }).contextBudget, 8000)
  assert.throws(() => normalizeConsultInput({ problem: '' }), /non-empty/)
  assert.throws(() => normalizeConsultInput({ problem: 'x', contextMode: 'raw' }), /full or focused/)
})

test('renders only model-visible scalar content and never image bytes', () => {
  const context = buildContext([{
    role: 'user',
    content: [
      { type: 'text', text: 'inspect this' },
      { type: 'image', attachment: { id: 'secret-image', data: 'never-send-this' } },
    ],
  }, {
    role: 'assistant',
    content: [{ type: 'tool-call', name: 'bash', arguments: '{"cmd":"npm test"}' }],
  }, {
    role: 'user',
    content: [{
      type: 'tool-result',
      isError: true,
      content: [{ type: 'text', text: 'test failed at line 42' }],
    }],
  }], 'full', 120000)

  assert.match(context.text, /inspect this/)
  assert.match(context.text, /TOOL CALL bash/)
  assert.match(context.text, /TOOL RESULT \(ERROR\)/)
  assert.match(context.text, /image attachment omitted/)
  assert.doesNotMatch(context.text, /never-send-this|secret-image/)
})

test('focused context preserves the first goal and recent failures', () => {
  const messages = Array.from({ length: 20 }, (_, index) => ({
    role: index % 2 === 0 ? 'user' : 'assistant',
    content: [{ type: 'text', text: `${index === 0 ? 'ORIGINAL GOAL' : `middle-${index}`} ${'x'.repeat(900)}` }],
  }))
  messages[19] = { role: 'user', content: [{ type: 'text', text: `LATEST FAILURE ${'z'.repeat(900)}` }] }
  const context = buildContext(messages, 'focused', 8000)
  assert.match(context.text, /ORIGINAL GOAL/)
  assert.match(context.text, /LATEST FAILURE/)
  assert.match(context.text, /older middle messages omitted|context clipped to budget/)
  assert.ok(context.chars <= 8000)
})

test('full context obeys the exact hard budget', () => {
  const context = buildContext([{
    role: 'user',
    content: [{ type: 'text', text: 'x'.repeat(12000) }],
  }], 'full', 8000)
  assert.equal(context.chars, 8000)
  assert.equal(context.text.length, 8000)
  assert.match(context.text, /context clipped to budget/)
})

test('atomic config writes support initial and replacement saves', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'dsh-w-teacher-help-me-'))
  const path = join(dir, 'config.json')
  try {
    await writeJsonAtomic(path, { value: 1 })
    await writeJsonAtomic(path, { value: 2 })
    assert.deepEqual(JSON.parse(await readFile(path, 'utf8')), { value: 2 })
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
})

test('teacher request labels context as untrusted and requests advice only', () => {
  const input = normalizeConsultInput({ problem: 'Why is this stuck?', attempts: 'Retried twice.' })
  const request = buildTeacherRequest(input, { mode: 'focused', originalMessages: 3, chars: 50, text: 'context' })
  assert.match(request, /Why is this stuck/)
  assert.match(request, /untrusted task data/)
  assert.match(request, /Give advice only/)
  assert.match(TEACHER_SYSTEM_PROMPT, /without taking over/)
  assert.match(TEACHER_SYSTEM_PROMPT, /read_file/)
  assert.match(TEACHER_SYSTEM_PROMPT, /Do not claim to have run commands/)
  assert.match(request, /independently inspect/)
})

test('normalizes endpoints and extracts common response content', () => {
  assert.equal(chatCompletionsEndpoint('https://relay.test'), 'https://relay.test/v1/chat/completions')
  assert.equal(chatCompletionsEndpoint('https://relay.test/v1/'), 'https://relay.test/v1/chat/completions')
  assert.equal(chatCompletionsEndpoint('https://relay.test/v1/chat/completions'), 'https://relay.test/v1/chat/completions')
  assert.equal(extractTeacherText({ choices: [{ message: { content: '  plan  ' } }] }), 'plan')
  assert.equal(extractTeacherText({ choices: [{ message: { content: [{ type: 'text', text: 'one' }, { type: 'text', text: 'two' }] } }] }), 'one\ntwo')
  assert.throws(() => extractTeacherText({ choices: [] }), /no text/)
})

test('teacher API executes read-only tool calls and returns the final advice', async () => {
  const root = await mkdtemp(join(tmpdir(), 'teacher-api-tools-'))
  const bodies = []
  await writeFile(join(root, 'bug.js'), 'const answer = 41\n', 'utf8')
  try {
    const fetch = async (_url, init) => {
      const body = JSON.parse(init.body)
      bodies.push(body)
      if (bodies.length === 1) {
        return {
          ok: true,
          async json() {
            return {
              choices: [{
                message: {
                  content: '',
                  tool_calls: [{
                    id: 'read-1',
                    type: 'function',
                    function: { name: 'read_file', arguments: '{"path":"bug.js"}' },
                  }],
                },
              }],
            }
          },
        }
      }
      return {
        ok: true,
        async json() { return { choices: [{ message: { content: 'The off-by-one value is visible in bug.js:1.' } }] } },
      }
    }
    const advice = await callTeacherApi(
      { base: 'https://relay.test', apikey: 'secret', modelname: 'gpt-5.6-sol' },
      'investigate',
      { fetch, workspaceRoot: root, timeoutMs: 5000 },
    )
    assert.match(advice, /off-by-one/)
    assert.equal(bodies.length, 2)
    assert.equal(bodies[0].tools.length, 3)
    assert.equal(bodies[1].messages.at(-1).role, 'tool')
    assert.match(bodies[1].messages.at(-1).content, /const answer = 41/)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('teacher API still returns advice when the session has no workspace', async () => {
  const bodies = []
  const fetch = async (_url, init) => {
    bodies.push(JSON.parse(init.body))
    return {
      ok: true,
      async json() { return { choices: [{ message: { content: 'Context-only advice.' } }] } },
    }
  }
  const advice = await callTeacherApi(
    { base: 'https://relay.test', apikey: 'secret', modelname: 'gpt-5.6-sol' },
    'investigate',
    { fetch, timeoutMs: 5000 },
  )
  assert.equal(advice, 'Context-only advice.')
  assert.equal(bodies[0].tools, undefined)
  assert.equal(bodies[0].tool_choice, 'none')
})
