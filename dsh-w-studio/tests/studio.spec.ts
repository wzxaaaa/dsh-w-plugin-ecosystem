/** Studio scheduling, durable handoffs, and artifact ownership. */
import { mkdtemp, mkdir, readFile, writeFile, rm, readdir, symlink } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import z from '@deepseek-ai/schemastery'
import { Studio } from '../src/studio.ts'
import { Config } from '../src/index.ts'
import { finalHandoff } from '../src/executor.ts'
import { teamTemplate } from '../src/templates.ts'
import { outputName, parseState } from '../src/validation.ts'
import type { EmployeeResult, StudioConfig, StudioExecutor, StudioState, Task, StudioNativeSessionId } from '../src/types.ts'

const owners: { studio: Studio; root: string }[] = []
afterEach(async () => {
  for (const { studio, root } of owners.splice(0)) {
    await studio.close()
    await rm(root, { recursive: true, force: true })
  }
})
async function setup(executor: StudioExecutor, overrides: Partial<StudioConfig> = {}) {
  const root = await mkdtemp(join(tmpdir(), 'dsh-studio-'))
  const cwd = join(root, 'workspace')
  await mkdir(cwd)
  const config = z.resolve({ storageRoot: join(root, 'store'), dshBin: join(root, 'dsh.js'), ...overrides }, Config, {})[0] as StudioConfig
  const studio = await Studio.open(config, executor)
  owners.push({ studio, root })
  async function command(action: string, input: unknown): Promise<StudioState> {
    return studio.command({ action, input, expectedRevision: studio.snapshot().revision })
  }
  const roster = teamTemplate('lean').slice(0, 2)
  for (const employee of roster) await command('saveEmployee', employee)
  const company = await command('createWorkspace', { name: 'Company', path: cwd })
  const created = await command('createProject', { name: 'Delivery', objective: 'Ship the product', cwd, workspaceId: company.activeWorkspaceId, acceptanceCriteria: 'Verified delivery', sessionMode: 'employee-project', employeeIds: roster.map(e => e.id) })
  const project = created.projects[0]!
  return { studio, config, root, cwd, command, roster, project, tasks: created.tasks }
}
const summary: EmployeeResult = { message: 'Ready for the next employee.', files: [], handoffs: [] }
function taskFields(task: Task) {
  return { projectId: task.projectId, employeeId: task.employeeId, title: task.title, instruction: task.instruction,
    dependsOn: task.dependsOn, outputFiles: task.outputFiles }
}
async function completed(studio: Studio, count: number) {
  await vi.waitFor(() =>{  expect(studio.snapshot().tasks.filter(t => t.status === 'completed')).toHaveLength(count) })
}
async function report(cwd: string, task: Task) {
  for (const file of task.outputFiles) {
    await mkdir(join(cwd, '.studio-deliverables'), { recursive: true })
    await writeFile(join(cwd, file), `Product requirements for ${task.title}`)
  }
}

describe('public employee handoffs', () => {
  it('keeps fresh-per-task projects independent even when the same employee has completed work', async () => {
    const resumes: (string | null)[] = []
    const fixture = await setup({ async run(_employee, project, task, _signal, execution) {
      resumes.push(execution.resumeSessionId)
      await execution.recordSession(`session-${task.id}` as StudioNativeSessionId)
      await report(project.cwd, task)
      return summary
    } })
    await fixture.command('startProject', { id: fixture.project.id })
    await completed(fixture.studio, 2)
    const created = await fixture.command('createProject', { name: 'Fresh project', objective: 'Independent context', cwd: '',
      workspaceId: fixture.project.workspaceId, acceptanceCriteria: '', sessionMode: 'new-task', employeeIds: [fixture.roster[0]!.id] })
    const project = created.projects.at(-1)!
    await fixture.command('startProject', { id: project.id })
    await completed(fixture.studio, 3)
    const original = fixture.studio.snapshot().tasks.at(-1)!
    await fixture.command('requestChanges', { id: original.id, instruction: 'Complete a fresh revision' })
    await fixture.command('startProject', { id: project.id })
    await completed(fixture.studio, 4)
    expect(resumes).toEqual([null, null, null, null])
    expect(fixture.studio.snapshot().tasks.at(-1)!.nativeSessions[0]!.id).not.toBe(original.nativeSessions[0]!.id)
  })
  it('continues only the same employee’s completed project session and preserves reviewed revisions', async () => {
    const resumes: (string | null)[] = []
    const fixture = await setup({ async run(employee, project, task, _signal, execution) {
      resumes.push(execution.resumeSessionId)
      await execution.recordSession(`native-${employee.id}` as StudioNativeSessionId)
      await report(project.cwd, task)
      return summary
    } })
    await expect(fixture.command('acceptProject', { id: fixture.project.id })).rejects.toThrow('Every task')
    await fixture.command('startProject', { id: fixture.project.id })
    await completed(fixture.studio, 2)
    expect(resumes).toEqual([null, null])
    const original = fixture.studio.snapshot().tasks[0]!
    await fixture.command('requestChanges', { id: original.id, instruction: 'Revise the product document and verify the correction.' })
    expect(fixture.studio.snapshot().tasks[0]!.result).toBe(original.result)
    expect(fixture.studio.snapshot().tasks[0]!.reviewStatus).toBe('superseded')
    await fixture.command('startProject', { id: fixture.project.id })
    await completed(fixture.studio, 3)
    expect(resumes[2]).toBe(original.nativeSessions[0]!.id)
    const repaired = fixture.studio.snapshot().tasks[2]!
    expect(repaired.assignment).toContain('Verified delivery')
    expect(repaired.assignment).toContain('Revise the product document')
    expect(repaired.nativeSessions[0]!.continued).toBe(true)
    await fixture.command('acceptProject', { id: fixture.project.id })
    await fixture.command('exportProject', { id: fixture.project.id })
    const dir = join(fixture.cwd, '.studio', 'projects', fixture.project.id)
    const board = await readFile(join(dir, 'board.json'), 'utf8')
    expect(board).not.toContain('nativeSessions')
    expect(board).not.toContain('assignment')
    const artifact = fixture.studio.snapshot().artifacts[0]!
    expect(await readFile(join(dir, 'artifacts', artifact.id))).toEqual((await fixture.studio.artifact(artifact.id)).bytes)
    await expect(JSON.stringify({ project: fixture.studio.snapshot().projects[0]!.status,
      tasks: fixture.studio.snapshot().tasks.map(task => ({ status: task.status, review: task.reviewStatus,
        continued: task.nativeSessions[0]!.continued })),
      files: (await readdir(dir)).sort() }, null, 2)+'\n').toMatchFileSnapshot('./expected/company-review.json')
  })

  it('rejects directories outside the company and symlinked collaboration exports', async () => {
    const run = vi.fn(async () => summary)
    const fixture = await setup({ run })
    await expect(fixture.command('createProject', { name: 'Outside', objective: 'Forbidden', cwd: fixture.root,
      workspaceId: fixture.project.workspaceId, acceptanceCriteria: '', sessionMode: 'employee-project', employeeIds: [fixture.roster[0]!.id] })).rejects.toThrow('inside the company')
    await fixture.command('saveEmployee', { ...fixture.roster[0], cwd: fixture.root })
    await fixture.command('startProject', { id: fixture.project.id })
    await vi.waitFor(() => { expect(fixture.studio.snapshot().tasks[0]!.status).toBe('failed') })
    expect(run).not.toHaveBeenCalled()
    await symlink(fixture.config.storageRoot, join(fixture.cwd, '.studio'), process.platform === 'win32' ? 'junction' : 'dir')
    await expect(fixture.command('exportProject', { id: fixture.project.id })).rejects.toThrow('inside the company')
    expect(await readdir(fixture.config.storageRoot)).toEqual(['studio.v2.json'])
  })

  it('migrates the v1 journal into a successor while preserving the predecessor bytes', async () => {
    const fixture = await setup({ async run() { return summary } })
    await fixture.studio.close()
    const current = fixture.studio.snapshot()
    const old = { version: 1, revision: current.revision, employees: current.employees,
      projects: current.projects.map(({ workspaceId: _workspace, acceptanceCriteria: _criteria,
        sessionMode: _mode, ...project }) => project),
      tasks: current.tasks.map(({ nativeSessions: _sessions, reviewStatus: _review, ...task }) => task),
      messages: current.messages, artifacts: current.artifacts }
    const bytes = JSON.stringify(old)+'\n'
    await rm(join(fixture.config.storageRoot, 'studio.v2.json'))
    await writeFile(join(fixture.config.storageRoot, 'studio.v1.json'), bytes)
    const reopened = await Studio.open(fixture.config, { async run() { throw new Error('Migration must not start work') } })
    owners.push({ studio: reopened, root: await mkdtemp(join(tmpdir(), 'dsh-studio-migration-')) })
    expect(reopened.snapshot().employees).toEqual(current.employees)
    expect(reopened.snapshot().tasks.map(task => task.id)).toEqual(current.tasks.map(task => task.id))
    expect(reopened.snapshot().projects[0]!.sessionMode).toBe('new-task')
    expect(reopened.snapshot().workspaces[0]!.path).toBe(fixture.cwd)
    expect(await readFile(join(fixture.config.storageRoot, 'studio.v1.json'), 'utf8')).toBe(bytes)
    expect(parseState(JSON.parse(await readFile(join(fixture.config.storageRoot, 'studio.v2.json'), 'utf8'))).version).toBe(2)
  })
  it('publishes image bytes unchanged and gives a dependent employee the immutable image path', async () => {
    const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jOZkAAAAASUVORK5CYII=', 'base64')
    let inspected = false
    const fixture = await setup({ async run(employee, project, task) {
      await report(employee.cwd || project.cwd, task)
      if (!task.dependsOn.length) {
        await writeFile(join(project.cwd, 'ui.png'), png)
        return { ...summary, files: ['ui.png'] }
      }
      const artifact = fixture.studio.snapshot().artifacts.find(file => file.name === 'ui.png')!
      const path = join(fixture.config.storageRoot, 'artifacts', artifact.id)
      expect(task.assignment).toContain('ui.png')
      expect(task.assignment).toContain(path.replaceAll('\\', '\\\\'))
      expect(await readFile(path)).toEqual(png)
      inspected = true
      return summary
    } })
    await fixture.command('startProject', { id: fixture.project.id })
    await completed(fixture.studio, 2)
    expect(inspected).toBe(true)
    const artifact = fixture.studio.snapshot().artifacts.find(file => file.name === 'ui.png')!
    expect((await fixture.studio.artifact(artifact.id)).bytes).toEqual(png)
  })

  it('advances dependent work with human reports and immutable files only', async () => {
    const assignments: string[] = []
    const fixture = await setup({ async run(employee, project, task) {
      assignments.push(task.assignment)
      await report(employee.cwd || project.cwd, task)
      return { ...summary, handoffs: task.dependsOn.length ? [] : [{ employeeId: fixture.roster[1]!.id, message: 'Please implement the documented UI.' }] }
    } })
    await fixture.command('message', { projectId: fixture.project.id, to: 'team', message: 'Use a blue button.' })
    expect(parseState(fixture.studio.snapshot()).messages[0]!.taskId).toBeNull()
    await fixture.command('startProject', { id: fixture.project.id })
    await completed(fixture.studio, 2)
    expect(assignments[1]).toContain('Ready for the next employee.')
    expect(assignments[1]).toContain('Please implement the documented UI.')
    expect(assignments[1]).toContain('Use a blue button.')
    const state = fixture.studio.snapshot()
    expect(state.projects[0]!.status).toBe('review')
    expect(state.tasks.map(task => task.attempt)).toEqual([1, 1])
    const file = state.artifacts.find(a => a.name !== 'handoff.md')!
    await writeFile(join(fixture.cwd, file.name), 'changed after publication')
    expect((await fixture.studio.artifact(file.id)).bytes.toString()).toContain('Product requirements')
    await writeFile(join(fixture.config.storageRoot, 'artifacts', file.id), 'tampered storage')
    await expect(fixture.studio.artifact(file.id)).rejects.toThrow('hash')
    await expect(fixture.studio.artifact('../studio.v1.json')).rejects.toThrow('does not exist')
  })

  it('does not launch the next dependency after failure and requires an explicit retry', async () => {
    let fail = true
    const fixture = await setup({ async run(_employee, project, task) {
      if (fail) throw new Error('Native model unavailable')
      await report(project.cwd, task)
      return summary
    } })
    await fixture.command('startProject', { id: fixture.project.id })
    await vi.waitFor(() =>{  expect(fixture.studio.snapshot().tasks[0]!.status).toBe('failed') })
    expect(fixture.studio.snapshot().tasks[1]!.status).toBe('pending')
    expect(fixture.studio.snapshot().messages).toEqual([])
    fail = false
    await fixture.command('retryTask', { id: fixture.tasks[0]!.id })
    await completed(fixture.studio, 2)
    expect(fixture.studio.snapshot().tasks[0]!.attempt).toBe(2)
  })

  it('rejects cyclic edits and stale revisions without changing the saved company', async () => {
    const fixture = await setup({ async run() { return summary } })
    const before = fixture.studio.snapshot()
    const task = fixture.tasks[0]!
    await expect(fixture.command('editTask', { id: task.id, task: { ...taskFields(task), dependsOn: [fixture.tasks[1]!.id] } })).rejects.toThrow('cycle')
    await expect(fixture.studio.command({ action: 'template', input: { kind: 'full' }, expectedRevision: 0 })).rejects.toThrow('refresh')
    expect(fixture.studio.snapshot()).toEqual(before)
    expect(JSON.parse(await readFile(join(fixture.config.storageRoot, 'studio.v2.json'), 'utf8'))).toEqual(before)
    await expect(fixture.command('saveEmployee', { ...fixture.roster[0], id: '../bad' })).rejects.toThrow()
  })

  it('keeps interrupted work paused when the host restarts', async () => {
    const fixture = await setup({ async run() { throw new Error('must not run') } })
    await fixture.studio.close()
    const state = fixture.studio.snapshot()
    state.tasks[0]!.status = 'running'
    state.projects[0]!.status = 'running'
    await writeFile(join(fixture.config.storageRoot, 'studio.v2.json'), JSON.stringify(state))
    const run = vi.fn(async () => summary)
    const reopened = await Studio.open(fixture.config, { run })
    owners.push({ studio: reopened, root: await mkdtemp(join(tmpdir(), 'dsh-studio-reopen-')) })
    expect(reopened.snapshot().tasks[0]!.status).toBe('interrupted')
    expect(reopened.snapshot().projects[0]!.status).toBe('paused')
    expect(run).not.toHaveBeenCalled()
    expect(parseState(reopened.snapshot()).version).toBe(2)
    expect(() => parseState({ ...state, version: 3 })).toThrow()
  })

  it('refuses malformed durable relationships and extra private protocol fields', async () => {
    const fixture = await setup({ async run() { return summary } })
    const state = fixture.studio.snapshot()
    expect(() => parseState({ ...state, employees: [...state.employees, state.employees[0]] })).toThrow('duplicate')
    expect(() => parseState({ ...state, employees: [] })).toThrow('missing employee')
    const cyclic = structuredClone(state)
    cyclic.tasks[0]!.dependsOn = [cyclic.tasks[1]!.id]
    expect(() => parseState(cyclic)).toThrow('cycle')
    expect(() => parseState({ ...state, privateReasoning: 'PRIVATE_REASONING_SENTINEL' })).toThrow('Unexpected Studio field')
    expect(() => parseState({ ...state, employees: [{ ...state.employees[0], apiKey: 'private credential' }] })).toThrow('apiKey')
    await expect(fixture.command('saveEmployee', { ...fixture.roster[0], transcript: 'private history' })).rejects.toThrow('transcript')
    expect(fixture.studio.snapshot()).toEqual(state)
  })

  it('joins cancellation before disposal returns and shares no incomplete result', async () => {
    const started = Promise.withResolvers<undefined>()
    const stopped = Promise.withResolvers<undefined>()
    const fixture = await setup({ async run(_employee, _project, _task, signal) {
      started.resolve(undefined)
      await new Promise<void>((resolve) =>{  signal.addEventListener('abort', () =>{  resolve() }, { once: true }) })
      stopped.resolve(undefined)
      throw signal.reason
    } })
    await fixture.command('startProject', { id: fixture.project.id })
    await started.promise
    await fixture.studio.close()
    await stopped.promise
    expect(fixture.studio.snapshot().tasks[0]!.status).toBe('cancelled')
    expect(fixture.studio.snapshot().tasks[1]!.status).toBe('pending')
    expect(fixture.studio.snapshot().messages).toEqual([])
    expect(fixture.studio.snapshot().artifacts).toEqual([])
  })

  it('serializes employees editing the same directory even without task dependencies', async () => {
    const first = Promise.withResolvers<undefined>()
    const release = Promise.withResolvers<undefined>()
    const order: string[] = []
    const fixture = await setup({ async run(_employee, project, task, signal) {
      order.push(task.id)
      if (order.length === 1) {
        first.resolve(undefined)
        const cancel = (): void => { release.resolve(undefined) }
        signal.addEventListener('abort', cancel, { once: true })
        try { await release.promise }
        finally { signal.removeEventListener('abort', cancel) }
      }
      await report(project.cwd, task)
      return summary
    } })
    const second = fixture.tasks[1]!
    await fixture.command('editTask', { id: second.id, task: { ...taskFields(second), dependsOn: [] } })
    await fixture.command('startProject', { id: fixture.project.id })
    await first.promise
    await fixture.command('message', { projectId: fixture.project.id, to: 'team', message: 'Queue barrier' })
    expect(order).toHaveLength(1)
    release.resolve(undefined)
    await completed(fixture.studio, 2)
    expect(order).toEqual(fixture.tasks.map(t => t.id))
  })

  it('runs separate workspaces concurrently within the configured limit and pauses queued assignments', async () => {
    const started = Promise.withResolvers<undefined>()
    const release = Promise.withResolvers<undefined>()
    const starts: string[] = []
    const fixture = await setup({ async run(employee, project, task, signal) {
      starts.push(task.id)
      if (starts.length === 2) started.resolve(undefined)
      const cancel = (): void => { release.resolve(undefined) }
      signal.addEventListener('abort', cancel, { once: true })
      try { await release.promise }
      finally { signal.removeEventListener('abort', cancel) }
      await report(employee.cwd || project.cwd, task)
      return summary
    } })
    const roster = [...fixture.roster, teamTemplate('lean')[2]!]
    for (let index = 0; index < roster.length; index += 1) {
      const cwd = join(fixture.cwd, `employee-${index}`)
      await mkdir(cwd)
      await fixture.command('saveEmployee', { ...roster[index], cwd })
    }
    const second = fixture.tasks[1]!
    await fixture.command('editTask', { id: second.id, task: { ...taskFields(second), dependsOn: [] } })
    await fixture.command('createTask', { projectId: fixture.project.id, employeeId: roster[2]!.id,
      title: 'Third parallel candidate', instruction: 'Wait for capacity', dependsOn: [], outputFiles: [] })
    await fixture.command('startProject', { id: fixture.project.id })
    await started.promise
    await fixture.command('pauseProject', { id: fixture.project.id })
    expect(starts).toHaveLength(2)
    release.resolve(undefined)
    await completed(fixture.studio, 2)
    expect(fixture.studio.snapshot().tasks[2]!.status).toBe('pending')
    expect(fixture.studio.snapshot().projects[0]!.status).toBe('paused')
  })

  it('cleans staged artifacts when declared files exceed the aggregate budget', async () => {
    const fixture = await setup({ async run(_employee, project, task) {
      await report(project.cwd, task)
      await writeFile(join(project.cwd, task.outputFiles[0]!), 'x'.repeat(1024))
      return summary
    } }, { maxArtifactBytes: 1024 })
    await fixture.command('startProject', { id: fixture.project.id })
    await vi.waitFor(() =>{  expect(fixture.studio.snapshot().tasks[0]!.status).toBe('failed') })
    expect(fixture.studio.snapshot().tasks[0]!.error).toContain('configured limit')
    expect(fixture.studio.snapshot().artifacts).toEqual([])
    expect(await readdir(join(fixture.config.storageRoot, 'artifacts'))).toEqual([])
  })

  it('rejects symlink aliases into native private transcript directories', async () => {
    const fixture = await setup({ async run(_employee, project, task) {
      await report(project.cwd, task)
      return { ...summary, files: ['public-link/transcript.json'] }
    } })
    const privateDir = join(fixture.cwd, '.claude')
    await mkdir(privateDir)
    await writeFile(join(privateDir, 'transcript.json'), 'PRIVATE_REASONING_SENTINEL')
    await symlink(privateDir, join(fixture.cwd, 'public-link'), process.platform === 'win32' ? 'junction' : 'dir')
    await fixture.command('startProject', { id: fixture.project.id })
    await vi.waitFor(() =>{  expect(fixture.studio.snapshot().tasks[0]!.status).toBe('failed') })
    expect(fixture.studio.snapshot().tasks[0]!.error).toContain('Private files')
    expect(fixture.studio.snapshot().artifacts).toEqual([])
  })
})

describe('native result admission', () => {
  it('shares final structured fields while dropping private protocol metadata', async () => {
    const parsed = finalHandoff(JSON.stringify({ ...summary, reasoning: 'PRIVATE_REASONING_SENTINEL', toolCalls: ['private tool history'] }), 1024)
    await expect(JSON.stringify(parsed, null, 2)+'\n').toMatchFileSnapshot('./expected/handoff.json')
    expect(finalHandoff('Human final report', 1024).message).toBe('Human final report')
    expect(() => finalHandoff('{"message":"bad"}', 1024)).toThrow('message, files')
    expect(() => finalHandoff('x'.repeat(1025), 1024)).toThrow('text limit')
  })
  it.each(['../secrets', '.env', '.CLAUDE/transcript', 'C:\\secret.txt', '.git/config', '.codex/sessions/log',
    '.dsh/sessions/log', '.credentials.yaml', '.claude.json'])('refuses private output %s', (name) => {
    expect(() => outputName(name)).toThrow()
  })
})
