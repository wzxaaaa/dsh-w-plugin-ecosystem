/** External CLI fixture: real argv/stdin/files plus private progress noise. */
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
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
const result = { message: `${engine} finished. Please use the product document.`, files, handoffs: [] }
console.error('PRIVATE_REASONING_SENTINEL in native progress')
if (engine === 'claude') console.log(JSON.stringify({ session_id: args[args.indexOf(args.includes('--resume') ? '--resume' : '--session-id')+1], structured_output: result, result: '', thinking: 'PRIVATE_REASONING_SENTINEL' }))
else {
  console.log(JSON.stringify({ type: 'thread.started', thread_id: args.includes('resume') ? args[args.indexOf('resume')+1] : 'fixture-codex-session' }))
  console.log(JSON.stringify({ type: 'item.completed', private: 'PRIVATE_REASONING_SENTINEL'.repeat(8000) }))
  console.log('PRIVATE_REASONING_SENTINEL in Codex event stream')
  await writeFile(args[args.indexOf('--output-last-message')+1], JSON.stringify(result))
}
