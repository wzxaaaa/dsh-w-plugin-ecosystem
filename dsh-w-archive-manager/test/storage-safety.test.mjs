import assert from 'node:assert/strict'
import { join, resolve } from 'node:path'
import test from 'node:test'
import { encodeSegment, jsonlSessionDirectory } from '../storage-safety.js'

test('accepts only the encoded per-session directory under the configured root', () => {
  const root = resolve('test-root')
  const id = 'session/unsafe~name'
  const directory = join(root, 'project', encodeSegment(id))
  const persistence = { root }
  const location = { kind: 'jsonl', path: join(directory, 'session.v3.jsonl.zstd') }
  assert.equal(jsonlSessionDirectory(persistence, { id }, location), directory)
})

test('rejects broad, mismatched, relative, and escaping deletion targets', () => {
  const root = resolve('test-root')
  const header = { id: 'session-one' }
  assert.throws(
    () => jsonlSessionDirectory({ root }, header, { path: join(root, 'project', 'session.v3.jsonl') }),
    /expected session directory/u,
  )
  assert.throws(
    () => jsonlSessionDirectory({ root }, header, { path: join(root, 'project', 'another-session', 'session.v3.jsonl') }),
    /expected session directory/u,
  )
  assert.throws(
    () => jsonlSessionDirectory({ root: 'relative-root' }, header, { path: join(root, 'project', header.id, 'session.v3.jsonl') }),
    /absolute root/u,
  )
  assert.throws(
    () => jsonlSessionDirectory({ root }, header, { path: resolve(root, '..', header.id, 'session.v3.jsonl') }),
    /outside the expected session directory/u,
  )
})
