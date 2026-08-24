import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'

const client = await readFile(new URL('../client.js', import.meta.url), 'utf8')

test('keeps the knowledge-base header compact in a narrow sidebar', () => {
  assert.match(client, /className: "dshwkb-head-top"/)
  assert.match(client, /className: "dshwkb-head-actions"/)
  assert.match(client, /className: "dshwkb-meta", title: view\.root \|\| undefined/)
  assert.match(client, /white-space:nowrap/)
  assert.match(client, /container:knowledge-panel \/ inline-size/)
  assert.match(client, /@container knowledge-panel \(max-width:380px\)/)
  assert.match(client, /flex-wrap:nowrap/)
  assert.doesNotMatch(client, /t\("countLabel"\) \+ \(view\.root/)
})
