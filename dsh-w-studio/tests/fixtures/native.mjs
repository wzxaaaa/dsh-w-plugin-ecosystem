/** External CLI fixture: real argv/stdin/files plus private progress noise. */
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { spawn } from 'node:child_process'
const [engine, ...args] = process.argv.slice(2)
if (args.includes('--version')) {
  console.log(`${engine} fixture 1`)
  process.exit(0)
}
let assignment = ''
for await (const chunk of process.stdin) assignment += chunk
if (args.includes('--input-format')) {
  const request = JSON.parse(assignment)
  if (request.type !== 'control_request' || request.request.subtype !== 'initialize') throw new Error('Expected model discovery without a user message')
  if (args.includes('--catalog-failure')) {
    console.error('PRIVATE_REASONING_SENTINEL unavailable native configuration')
    process.exit(1)
  }
  console.log(JSON.stringify({ type: 'control_response', response: { subtype: 'success', request_id: request.request_id, response: {
    models: [{ value: 'sonnet', displayName: 'Sonnet fixture', supportedEffortLevels: ['low', 'high'] }, { value: 'opus', displayName: 'Opus fixture', supportedEffortLevels: ['high', 'max'] }],
    private_instructions: 'PRIVATE_REASONING_SENTINEL',
  } } }))
  process.exit(0)
}
const requested = /请交付这些项目相对路径的文件：(\[[^\n]*\])/u.exec(assignment)
const files = requested ? JSON.parse(requested[1]) : []
for (const file of files) {
  await mkdir(dirname(join(process.cwd(), file)), { recursive: true })
  await writeFile(file, 'Product document and verified result.\n')
}
await writeFile(join(process.cwd(), `${engine}-invocation.json`), JSON.stringify({ args, assignment })+'\n')
// FAIL_ONCE ends the first attempt like an exhausted Codex plan; the recovery prompt of a retry succeeds.
if (engine === 'codex' && assignment.includes('FAIL_ONCE') && !assignment.includes('中断了')) {
  console.log(JSON.stringify({ type: 'thread.started', thread_id: args.includes('resume') ? args[args.indexOf('resume')+1] : 'fixture-codex-session' }))
  console.log(JSON.stringify({ type: 'turn.failed', error: { message: "You've hit your usage limit. Try again at 9:39 PM." } }))
  process.exit(1)
}
// ASK_USER pauses for the user until a reply arrives; SLOW_PROGRESS reports progress and keeps working for a while.
const asking = assignment.includes('ASK_USER') && !assignment.includes('甲方回复：')
const result = asking ? { message: 'APK installed on the phone.', files: [], handoffs: [], needsUser: 'Allow microphone access on the phone, then reply "done".' }
  : { message: `${engine} finished. Please use the product document.`, files, handoffs: [], needsUser: '' }
if (assignment.includes('SLOW_PROGRESS')) {
  console.log(JSON.stringify(engine === 'claude' ? { type: 'assistant', message: { content: [{ type: 'text', text: 'Running the device test suite.' }] } }
    : { type: 'item.completed', item: { type: 'agent_message', text: 'Running the device test suite.' } }))
  await new Promise(resolve => setTimeout(resolve, 8000))
}
console.error('PRIVATE_REASONING_SENTINEL in native progress')
if (engine === 'claude') {
  const sessionId = args[args.indexOf(args.includes('--resume') ? '--resume' : '--session-id')+1]
  console.log(JSON.stringify({ type: 'system', subtype: 'init', session_id: sessionId, private: 'PRIVATE_REASONING_SENTINEL' }))
  console.log(JSON.stringify({ type: 'assistant', session_id: sessionId, message: { content: [{ type: 'thinking', thinking: 'PRIVATE_REASONING_SENTINEL' }, { type: 'text', text: 'Drafting the document.' }] } }))
  console.log(JSON.stringify({ type: 'result', session_id: sessionId, structured_output: result, result: '', thinking: 'PRIVATE_REASONING_SENTINEL' }))
} else {
  console.log(JSON.stringify({ type: 'thread.started', thread_id: args.includes('resume') ? args[args.indexOf('resume')+1] : 'fixture-codex-session' }))
  console.log(JSON.stringify({ type: 'item.completed', private: 'PRIVATE_REASONING_SENTINEL'.repeat(8000) }))
  console.log(JSON.stringify({ type: 'item.completed', item: { type: 'agent_message', text: 'Checking the build output.' } }))
  console.log('PRIVATE_REASONING_SENTINEL in Codex event stream')
  await writeFile(args[args.indexOf('--output-last-message')+1], JSON.stringify(result))
  console.log(JSON.stringify({ type: 'item.completed', item: { type: 'agent_message', text: JSON.stringify(result) } }))
  console.log(JSON.stringify({ type: 'turn.completed', usage: {} }))
  // Like a dev server or Gradle daemon started during the task: the final answer is out, but the run never exits by itself.
  if (assignment.includes('LINGER_AFTER_FINAL')) {
    spawn(process.execPath, ['-e', 'setTimeout(() => {}, 120000)'], { stdio: 'inherit' })
    setTimeout(() => {}, 120000)
  }
}
