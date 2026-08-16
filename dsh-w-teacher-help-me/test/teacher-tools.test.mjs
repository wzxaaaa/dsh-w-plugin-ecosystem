import assert from 'node:assert/strict'
import { mkdtemp, mkdir, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'

import {
  READ_ONLY_TEACHER_TOOLS,
  executeReadonlyTeacherTool,
} from '../teacher-tools.js'

test('teacher tools list, search, and read workspace files', async () => {
  const root = await mkdtemp(join(tmpdir(), 'teacher-tools-'))
  try {
    await mkdir(join(root, 'src'))
    await writeFile(join(root, 'src', 'bug.js'), 'export function total(items) {\n  return items.length + 1\n}\n', 'utf8')

    const listed = await executeReadonlyTeacherTool(root, 'list_directory', '{}')
    assert.match(listed, /\[dir\] src/)

    const searched = await executeReadonlyTeacherTool(root, 'search_files', JSON.stringify({ query: 'items.length', path: 'src' }))
    assert.match(searched, /src\/bug\.js:2/)
    assert.match(searched, /items\.length \+ 1/)

    const read = await executeReadonlyTeacherTool(root, 'read_file', JSON.stringify({ path: 'src/bug.js', startLine: 2, endLine: 2 }))
    assert.match(read, /lines 2-2/)
    assert.match(read, /return items\.length \+ 1/)
    assert.equal(READ_ONLY_TEACHER_TOOLS.length, 3)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('teacher tools reject paths outside the workspace, including symlinks', async t => {
  const parent = await mkdtemp(join(tmpdir(), 'teacher-tools-boundary-'))
  const root = join(parent, 'workspace')
  const outside = join(parent, 'outside.txt')
  await mkdir(root)
  await writeFile(outside, 'secret', 'utf8')
  try {
    await assert.rejects(
      executeReadonlyTeacherTool(root, 'read_file', JSON.stringify({ path: '../outside.txt' })),
      /escapes the current task workspace/,
    )
    await assert.rejects(
      executeReadonlyTeacherTool(root, 'read_file', JSON.stringify({ path: outside })),
      /path must be relative/,
    )
    try {
      await symlink(outside, join(root, 'outside-link.txt'), 'file')
    } catch (error) {
      if (error?.code === 'EPERM') {
        t.diagnostic('symlink creation is unavailable on this Windows account')
        return
      }
      throw error
    }
    await assert.rejects(
      executeReadonlyTeacherTool(root, 'read_file', JSON.stringify({ path: 'outside-link.txt' })),
      /escapes the current task workspace/,
    )
  } finally {
    await rm(parent, { recursive: true, force: true })
  }
})
