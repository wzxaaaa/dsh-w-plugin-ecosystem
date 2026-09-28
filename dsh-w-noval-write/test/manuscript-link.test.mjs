import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { mkdtemp, rm, utimes, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import vm from 'node:vm'
import { countManuscriptWords, listWorkspaceManuscripts, readWorkspaceManuscript } from '../noval-file-core.js'
import { analyzeThreads, defaultProject, findChapter, linkChapterManuscript, normalizeProject, projectPrompt } from '../noval-write-core.js'

function outline(statuses = ['planned', 'planned', 'planned']) {
  const project = defaultProject()
  project.volumes = [
    { id: 'v1', title: '卷一', chapters: statuses.map((status, i) => ({ id: `c${i + 1}`, number: String(i + 1), title: `章${i + 1}`, status })) },
    { id: 'v2', title: '卷二', chapters: [{ id: 'c1', number: '1', title: '重名章' }] },
  ]
  return normalizeProject(project)
}

test('word count follows Chinese convention and ignores Markdown markup', () => {
  assert.equal(countManuscriptWords('# 第一章\n\n他说：“你好。”'), 11)
  assert.equal(countManuscriptWords('Hello, world! It’s 2026.'), 4)
  assert.equal(countManuscriptWords('**沈砚**看了看 the clock 三次…'), 10)
  assert.equal(countManuscriptWords('> 引用\n- 列表项\n1. 第一'), 7)
  assert.equal(countManuscriptWords('﻿'), 0)
})

test('workspace listing counts .md/.txt files, skips others, and reuses the cache', async t => {
  const root = await mkdtemp(join(tmpdir(), 'dsh-noval-list-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  await writeFile(join(root, '第10章.md'), '十个字的正文内容在这里')
  await writeFile(join(root, '第2章.txt'), '两章')
  await writeFile(join(root, 'notes.json'), '{}')
  await writeFile(join(root, '.第3章.md.tmp'), 'temp')
  const cache = new Map()
  const first = await listWorkspaceManuscripts(root, { cache })
  assert.deepEqual(first.files.map(file => [file.filename, file.words]), [['第2章.txt', 2], ['第10章.md', 11]], 'natural order')
  // Same size and mtime: the cached count is trusted without re-reading.
  const path = join(root, '第2章.txt')
  const stamp = new Date('2026-01-01T00:00:00Z')
  await utimes(path, stamp, stamp)
  await listWorkspaceManuscripts(root, { cache })
  await writeFile(path, '改了')
  await utimes(path, stamp, stamp)
  assert.equal((await listWorkspaceManuscripts(root, { cache })).files[0].words, 2, 'cache hit keeps the old count')
  await writeFile(path, '改成四个')
  assert.equal((await listWorkspaceManuscripts(root, { cache })).files[0].words, 4, 'a changed file is recounted')
  await assert.rejects(listWorkspaceManuscripts(join(root, 'missing')), error => error.code === 'NOVEL_WORKSPACE_MISSING')
})

test('reading a manuscript returns an excerpt and reports missing files without throwing', async t => {
  const root = await mkdtemp(join(tmpdir(), 'dsh-noval-read-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  await writeFile(join(root, '长章.md'), '字'.repeat(5000))
  const long = await readWorkspaceManuscript(root, '长章.md', { maxChars: 300 })
  assert.equal(long.exists, true)
  assert.equal(long.words, 5000)
  assert.equal(long.excerpt.length, 300)
  assert.equal(long.truncated, true)
  assert.deepEqual(await readWorkspaceManuscript(root, '没有'), { filename: '没有.md', exists: false })
  await assert.rejects(readWorkspaceManuscript(root, '../secret.md'), error => error.code === 'INVALID_NOVEL_FILENAME')
})

test('linking gives a file to exactly one chapter and starts unstarted chapters', () => {
  let project = outline(['计划', 'planned', '定稿'])
  project = linkChapterManuscript(project, 'v1', 'c1', '第1章.md')
  assert.equal(project.volumes[0].chapters[0].manuscriptFile, '第1章.md')
  assert.equal(project.volumes[0].chapters[0].status, '初稿', 'Chinese books get a Chinese status')
  project = linkChapterManuscript(project, 'v1', 'c3', '第1章.md')
  assert.equal(project.volumes[0].chapters[0].manuscriptFile, '', 'the file moved away from c1')
  assert.equal(project.volumes[0].chapters[2].status, '定稿', 'a started chapter keeps its status')
  project = linkChapterManuscript(project, 'v1', 'c2', 'b.md', { status: '修改中' })
  assert.equal(project.volumes[0].chapters[1].status, '修改中')
  project = linkChapterManuscript(project, 'v1', 'c2', '')
  assert.equal(project.volumes[0].chapters[1].manuscriptFile, '')

  const english = linkChapterManuscript(outline(['planned', 'planned', 'planned']), 'v1', 'c2', 'two.md')
  assert.equal(english.volumes[0].chapters[1].status, 'drafted')
  assert.equal(analyzeThreads(english).currentIndex, 1, 'the ledger now sees chapter 2 as reached')

  assert.throws(() => findChapter(project, '', 'c1'), /several volumes; pass volume_id/)
  assert.equal(findChapter(project, '', 'c2').volume.id, 'v1')
  assert.throws(() => findChapter(project, 'v9', 'c1'), /unknown volume/)
  assert.throws(() => findChapter(project, 'v1', 'c9'), /unknown chapter/)
})

test('the prompt shows linked manuscripts with live word counts', () => {
  const project = linkChapterManuscript(outline(), 'v1', 'c1', '第1章.md')
  assert.match(projectPrompt(project, 20_000, { manuscripts: new Map([['第1章.md', 4213]]) }), /manuscript 第1章\.md \(4213 words\)/)
  assert.match(projectPrompt(project, 20_000), /manuscript 第1章\.md(?! \()/, 'without stats the file is still named')
})

function clientHelpers() {
  const source = readFileSync(new URL('../client.js', import.meta.url), 'utf8')
  const start = source.indexOf('    var CJK_DIGITS')
  const end = source.indexOf('    function ProgressBar(', start)
  assert.ok(start !== -1 && end > start)
  return vm.runInNewContext(`${source.slice(start, end)}\n({ chineseNumeral, parseWordTarget, autoMatchManuscripts })`, { Set })
}

test('client helpers parse targets and match manuscripts by chapter number or title', () => {
  const { chineseNumeral, parseWordTarget, autoMatchManuscripts } = clientHelpers()
  assert.deepEqual([1, 10, 12, 20, 105, 110].map(chineseNumeral), ['一', '十', '十二', '二十', '一百零五', '一百一十'])
  assert.equal(parseWordTarget('30 万'), 300000)
  assert.equal(parseWordTarget('1.5w'), 15000)
  assert.equal(parseWordTarget('3千'), 3000)
  assert.equal(parseWordTarget('3000-4,000'), 4000)
  assert.equal(parseWordTarget(''), 0)

  const project = {
    volumes: [{ id: 'v1', chapters: [
      { id: 'a', number: '1', title: '夜班', manuscriptFile: '' },
      { id: 'b', number: '2', title: '排字工', manuscriptFile: '' },
      { id: 'c', number: '3', title: '旧报纸', manuscriptFile: '' },
      { id: 'd', number: '12', title: '档案', manuscriptFile: '' },
      { id: 'e', number: '4', title: '已关联', manuscriptFile: 'done.md' },
    ] }],
  }
  const files = ['第一章_开端.md', 'ch02.md', '旧报纸.txt', '第12章 档案.md', '第12章 备份.md', 'done.md', '第4章.md'].map(filename => ({ filename }))
  const links = autoMatchManuscripts(project, files)
  assert.deepEqual(JSON.parse(JSON.stringify(links)), [
    { volumeId: 'v1', chapterId: 'a', filename: '第一章_开端.md' },
    { volumeId: 'v1', chapterId: 'b', filename: 'ch02.md' },
    { volumeId: 'v1', chapterId: 'c', filename: '旧报纸.txt' },
  ], 'chapter 12 has two candidates and chapter 4 is already linked, so both are left alone')
})
