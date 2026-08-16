import assert from 'node:assert/strict'
import test from 'node:test'

import { isCustomModule } from '../custom-plugin-core.js'

test('lists third-party package plugins', () => {
  assert.equal(isCustomModule('dsh-w-route-primer'), true)
  assert.equal(isCustomModule('@community/plugin'), true)
})

test('hides shipped, builtin, and internal filesystem modules', () => {
  assert.equal(isCustomModule('@deepseek-ai/dsh-tools'), false)
  assert.equal(isCustomModule('cordis:group'), false)
  assert.equal(isCustomModule('./route-primer-bootstrap.mjs'), false)
  assert.equal(isCustomModule('../shared/bootstrap.mjs'), false)
  assert.equal(isCustomModule('file:///tmp/bootstrap.mjs'), false)
  assert.equal(isCustomModule('C:\\plugins\\bootstrap.mjs'), false)
})
