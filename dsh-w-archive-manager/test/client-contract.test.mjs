import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const client = await readFile(new URL('../client.js', import.meta.url), 'utf8')

test('registers the archived settings section at the bottom of the nav', () => {
  assert.match(client, /id:\s*"archived-conversations"/u)
  assert.match(client, /order:\s*1000/u)
  assert.match(client, /ctx\.slots\.inject\("settings\.section"/u)
})

test('uses the requested 30-day retention copy verbatim', () => {
  assert.match(client, /标记为归档的对话将在\{days\}天后被永久删除/u)
})

test('Typert descriptor names match Host method parameters', () => {
  assert.match(client, /descriptor\("restore", \[parameter\("sessionId"\)\]\)/u)
  assert.match(client, /descriptor\("deleteOne", \[parameter\("sessionId"\)\]\)/u)
  assert.match(client, /descriptor\("finalizeDeleted", \[parameter\("input"\)\]\)/u)
})

test('client refreshes both runtime baselines around permanent deletion', () => {
  assert.match(client, /refreshSessions\(\).*finalizeDeleted\(deleted\).*refreshWorkspaces\(\)/su)
})
