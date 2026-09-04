import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

test('Harness 0.1.2-alpha.4 value helpers come from dsh-util-values', async () => {
  const [source, manifestText] = await Promise.all([
    readFile(new URL('../index.js', import.meta.url), 'utf8'),
    readFile(new URL('../package.json', import.meta.url), 'utf8'),
  ])
  const manifest = JSON.parse(manifestText)

  assert.match(source, /import \{ deepFreeze \} from '@deepseek-ai\/dsh-util-values'/)
  assert.doesNotMatch(
    source,
    /import\s*\{[^}]*deepFreeze[^}]*\}\s*from '@deepseek-ai\/dsh-llm'/s,
  )
  assert.equal(manifest.peerDependencies['@deepseek-ai/dsh-util-values'], '*')
})
