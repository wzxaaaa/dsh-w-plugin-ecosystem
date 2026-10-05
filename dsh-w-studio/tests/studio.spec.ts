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
import { planTemplate, redundantEmployees, toMember } from '../src/roster.ts'
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
    expect(await readdir(fixture.config.storageRoot)).toEqual(['studio.v4.json'])
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
    await rm(join(fixture.config.storageRoot, 'studio.v4.json'))
    await writeFile(join(fixture.config.storageRoot, 'studio.v1.json'), bytes)
    const reopened = await Studio.open(fixture.config, { async run() { throw new Error('Migration must not start work') } })
    owners.push({ studio: reopened, root: await mkdtemp(join(tmpdir(), 'dsh-studio-migration-')) })
    expect(reopened.snapshot().employees).toEqual(current.employees)
    expect(reopened.snapshot().tasks.map(task => task.id)).toEqual(current.tasks.map(task => task.id))
    expect(reopened.snapshot().projects[0]!.sessionMode).toBe('new-task')
    expect(reopened.snapshot().workspaces[0]!.path).toBe(fixture.cwd)
    expect(await readFile(join(fixture.config.storageRoot, 'studio.v1.json'), 'utf8')).toBe(bytes)
    expect(parseState(JSON.parse(await readFile(join(fixture.config.storageRoot, 'studio.v4.json'), 'utf8'))).version).toBe(4)
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
    await expect(fixture.studio.command({ action: 'applyTemplate', input: { id: 'stale' }, expectedRevision: 0 })).rejects.toThrow('refresh')
    expect(fixture.studio.snapshot()).toEqual(before)
    expect(JSON.parse(await readFile(join(fixture.config.storageRoot, 'studio.v4.json'), 'utf8'))).toEqual(before)
    await expect(fixture.command('saveEmployee', { ...fixture.roster[0], id: '../bad' })).rejects.toThrow()
  })

  it('keeps interrupted work paused when the host restarts', async () => {
    const fixture = await setup({ async run() { throw new Error('must not run') } })
    await fixture.studio.close()
    const state = fixture.studio.snapshot()
    state.tasks[0]!.status = 'running'
    state.projects[0]!.status = 'running'
    await writeFile(join(fixture.config.storageRoot, 'studio.v4.json'), JSON.stringify(state))
    const run = vi.fn(async () => summary)
    const reopened = await Studio.open(fixture.config, { run })
    owners.push({ studio: reopened, root: await mkdtemp(join(tmpdir(), 'dsh-studio-reopen-')) })
    expect(reopened.snapshot().tasks[0]!.status).toBe('interrupted')
    expect(reopened.snapshot().projects[0]!.status).toBe('paused')
    expect(run).not.toHaveBeenCalled()
    expect(parseState(reopened.snapshot()).version).toBe(4)
    expect(() => parseState({ ...state, version: 5 })).toThrow()
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

describe('meeting room', () => {
  async function meeting(fixture: Awaited<ReturnType<typeof setup>>) {
    const [host, guest] = fixture.roster
    const state = await fixture.command('createMeeting', { workspaceId: fixture.project.workspaceId, title: 'Kickoff',
      agenda: 'A habit tracker app', hostId: host!.id, attendeeIds: [guest!.id] })
    return { host: host!, guest: guest!, id: state.meetings[0]!.id }
  }
  const spoken = (studio: Studio, count: number) => vi.waitFor(() => {
    const value = studio.snapshot().meetings[0]!
    expect(value.messages.filter(message => message.from !== 'user')).toHaveLength(count)
    expect(value.speaking).toBeNull()
  })

  it('migrates the v2 journal into the current file while preserving the predecessor bytes', async () => {
    const fixture = await setup({ async run() { return summary } })
    await fixture.studio.close()
    const { meetings: _meetings, templates: _templates, ...current } = fixture.studio.snapshot()
    const bytes = JSON.stringify({ ...current, version: 2 })+'\n'
    await rm(join(fixture.config.storageRoot, 'studio.v4.json'))
    await writeFile(join(fixture.config.storageRoot, 'studio.v2.json'), bytes)
    const reopened = await Studio.open(fixture.config, { async run() { throw new Error('Migration must not start work') } })
    owners.push({ studio: reopened, root: await mkdtemp(join(tmpdir(), 'dsh-studio-v2-')) })
    expect(reopened.snapshot().meetings).toEqual([])
    expect(reopened.snapshot().tasks).toEqual(current.tasks)
    expect(await readFile(join(fixture.config.storageRoot, 'studio.v2.json'), 'utf8')).toBe(bytes)
    expect((await readdir(fixture.config.storageRoot)).sort()).toEqual(['studio.v2.json', 'studio.v4.json'])
  })

  it('lets the host answer by default, follows mentions and handoffs, and runs every turn read-only in the company directory', async () => {
    const turns: { name: string; permission: string; cwd: string; prompt: string }[] = []
    const fixture = await setup({ async run(employee, project, task, _signal, execution) {
      turns.push({ name: employee.name, permission: employee.permission, cwd: employee.cwd || project.cwd, prompt: task.assignment })
      await execution.recordSession(`meeting-${turns.length}` as StudioNativeSessionId)
      const ask = turns.length === 1 ? [{ employeeId: fixture.roster[1]!.id, message: 'How long will it take?' }] : []
      return { message: `${employee.name} speaks ${turns.length}`, files: [], handoffs: ask }
    } })
    await fixture.command('saveEmployee', { ...fixture.roster[0], permission: 'full-access' })
    const { host, guest, id } = await meeting(fixture)
    await fixture.command('meetingMessage', { id, message: 'I need a habit tracker with reminders.', mentions: [] })
    await spoken(fixture.studio, 2)
    expect(turns.map(turn => turn.name)).toEqual([host.name, guest.name])
    expect(turns.every(turn => turn.permission === 'read-only' && turn.cwd === fixture.cwd)).toBe(true)
    expect(turns[0]!.prompt).toContain('主持人')
    expect(turns[1]!.prompt).toContain('I need a habit tracker with reminders.')
    expect(turns[1]!.prompt).toContain(`${host.name} speaks 1`)
    const record = fixture.studio.snapshot().meetings[0]!
    expect(record.messages[1]!.mentions).toEqual([guest.id])
    expect(record.messages[1]!.nativeSession?.id).toBe('meeting-1')
    await fixture.command('meetingMessage', { id, message: 'Only the second employee, please.', mentions: [guest.id] })
    await spoken(fixture.studio, 3)
    expect(turns.at(-1)!.name).toBe(guest.name)
    const visitor = teamTemplate('lean')[2]!
    await fixture.command('saveEmployee', visitor)
    await fixture.command('updateMeeting', { id, title: 'Kickoff', agenda: 'A habit tracker app', hostId: host.id, attendeeIds: [guest.id, visitor.id] })
    await expect(fixture.command('deleteEmployee', { id: visitor.id })).rejects.toThrow('meeting history')
    await expect(fixture.command('meetingMessage', { id, message: 'x', mentions: [fixture.project.id] })).rejects.toThrow('attendees')
    // Background turns advance the revision; chat messages must not fail as stale while other edits still do.
    await fixture.studio.command({ action: 'meetingMessage', input: { id, message: 'Sent from a stale view.', mentions: [guest.id] }, expectedRevision: 0 })
    await expect(fixture.studio.command({ action: 'applyTemplate', input: { id: 'stale' }, expectedRevision: 0 })).rejects.toThrow('refresh')
  })

  it('caps employee-to-employee chains so the floor returns to the client', async () => {
    let count = 0
    const fixture = await setup({ async run(employee) {
      count += 1
      const other = fixture.roster.find(value => value.id !== employee.id)!
      return { message: `turn ${count}`, files: [], handoffs: [{ employeeId: other.id, message: 'Your turn' }] }
    } })
    const { id } = await meeting(fixture)
    await fixture.command('meetingMessage', { id, message: 'Debate it.', mentions: [] })
    await spoken(fixture.studio, 6)
    await new Promise(resolve => setTimeout(resolve, 50))
    expect(count).toBe(6)
    expect(fixture.studio.snapshot().meetings[0]!.queue).toEqual([])
  })

  it('turns confirmed host minutes into a project with a task chain and shared minutes', async () => {
    const fixture = await setup({ async run(employee, _project, task) {
      if (!task.assignment.includes('会议纪要')) return { message: 'Noted.', files: [], handoffs: [] }
      return { files: [], handoffs: [], message: JSON.stringify({ summary: 'Build an MVP habit tracker.', decisions: ['Mobile first'],
        projectName: 'Habit MVP', objective: 'Ship reminders', acceptanceCriteria: 'Reminders fire on time',
        tasks: [{ employeeId: fixture.roster[0]!.id, title: 'Write PRD', instruction: 'Document reminders' },
          { employeeId: fixture.roster[1]!.id, title: 'Design UI', instruction: 'Design the reminder screen' },
          { employeeId: 'not-an-attendee', title: 'Dropped', instruction: 'Ignored' }] }) }
    } })
    const { id } = await meeting(fixture)
    await expect(fixture.command('draftMinutes', { id })).rejects.toThrow('Discuss')
    await fixture.command('meetingMessage', { id, message: 'Reminders are a must.', mentions: [] })
    await spoken(fixture.studio, 1)
    await fixture.command('draftMinutes', { id })
    await vi.waitFor(() => { expect(fixture.studio.snapshot().meetings[0]!.status).toBe('review') })
    const minutes = fixture.studio.snapshot().meetings[0]!.minutes!
    expect(minutes.tasks.map(task => task.title)).toEqual(['Write PRD', 'Design UI'])
    await expect(fixture.command('meetingMessage', { id, message: 'late', mentions: [] })).rejects.toThrow('not open')
    const state = await fixture.command('meetingProject', { id, minutes: { ...minutes, projectName: 'Habit MVP v1' }, cwd: '', sessionMode: 'employee-project' })
    const project = state.projects.find(value => value.name === 'Habit MVP v1')!
    const tasks = state.tasks.filter(task => task.projectId === project.id)
    expect(tasks.map(task => task.title)).toEqual(['Write PRD', 'Design UI'])
    expect(tasks[1]!.dependsOn).toEqual([tasks[0]!.id])
    expect(project.acceptanceCriteria).toBe('Reminders fire on time')
    expect(state.messages.find(message => message.projectId === project.id)!.message).toContain('Mobile first')
    expect(state.meetings[0]!).toMatchObject({ status: 'closed', projectId: project.id })
    expect(parseState(state).meetings).toHaveLength(1)
  })

  it('lets an ended meeting without a project still draft minutes, reopen, and create its project', async () => {
    const fixture = await setup({ async run(_employee, _project, task) {
      if (!task.assignment.includes('会议纪要')) return { message: '开干！', files: [], handoffs: [] }
      return { files: [], handoffs: [], message: JSON.stringify({ summary: 'Agreed scope.', decisions: [], projectName: 'After meeting',
        objective: 'Ship it', acceptanceCriteria: '', tasks: [{ employeeId: fixture.roster[0]!.id, title: 'Write PRD', instruction: 'Write it' }] }) }
    } })
    const { id } = await meeting(fixture)
    await fixture.command('meetingMessage', { id, message: 'OK, start working.', mentions: [] })
    await spoken(fixture.studio, 1)
    await fixture.command('closeMeeting', { id })
    await expect(fixture.command('meetingMessage', { id, message: 'late', mentions: [] })).rejects.toThrow('not open')
    // Ended without a project: minutes can still be drafted.
    await fixture.command('draftMinutes', { id })
    await vi.waitFor(() => { expect(fixture.studio.snapshot().meetings[0]!.status).toBe('review') })
    // Ending again keeps the minutes; they can be reopened for editing without redrafting, or the meeting reopened.
    await fixture.command('closeMeeting', { id })
    expect((await fixture.command('reviewMinutes', { id })).meetings[0]!.status).toBe('review')
    await fixture.command('closeMeeting', { id })
    expect((await fixture.command('resumeMeeting', { id })).meetings[0]!.status).toBe('open')
    await fixture.command('closeMeeting', { id })
    await fixture.command('reviewMinutes', { id })
    const minutes = fixture.studio.snapshot().meetings[0]!.minutes!
    const state = await fixture.command('meetingProject', { id, minutes, cwd: '', sessionMode: 'new-task' })
    expect(state.projects.some(project => project.name === 'After meeting')).toBe(true)
    // Once a project exists the meeting is final.
    await expect(fixture.command('draftMinutes', { id })).rejects.toThrow('already created a project')
    await expect(fixture.command('resumeMeeting', { id })).rejects.toThrow()
    await expect(fixture.command('reviewMinutes', { id })).rejects.toThrow()
  })

  it('keeps unstructured minutes as text, and stops or restarts a speaker without leaving a stale turn', async () => {
    const started = Promise.withResolvers<undefined>()
    let block = false
    const fixture = await setup({ async run(_employee, _project, task, signal) {
      if (block) {
        started.resolve(undefined)
        await new Promise<void>((resolve) => { signal.addEventListener('abort', () => { resolve() }, { once: true }) })
        throw signal.reason
      }
      return { message: task.assignment.includes('会议纪要') ? 'Plain prose minutes.' : 'Hello.', files: [], handoffs: [] }
    } })
    const { id } = await meeting(fixture)
    await fixture.command('meetingMessage', { id, message: 'Start.', mentions: [] })
    await spoken(fixture.studio, 1)
    await fixture.command('draftMinutes', { id })
    await vi.waitFor(() => { expect(fixture.studio.snapshot().meetings[0]!.status).toBe('review') })
    const record = fixture.studio.snapshot().meetings[0]!
    expect(record.minutes).toMatchObject({ summary: 'Plain prose minutes.', projectName: 'Kickoff', tasks: [] })
    expect(record.error).toContain('structured')
    await expect(fixture.command('meetingProject', { id, minutes: record.minutes, cwd: '', sessionMode: 'new-task' })).rejects.toThrow('task')
    await fixture.command('resumeMeeting', { id })
    block = true
    await fixture.command('meetingMessage', { id, message: 'One more thing.', mentions: [] })
    await started.promise
    expect(fixture.studio.snapshot().meetings[0]!.speaking).toBe(fixture.roster[0]!.id)
    await fixture.command('stopMeeting', { id })
    await vi.waitFor(() => { expect(fixture.studio.snapshot().meetings[0]!.speaking).toBeNull() })
    expect(fixture.studio.snapshot().meetings[0]!.error).toContain('stopped')
    const crashed = fixture.studio.snapshot()
    crashed.meetings[0]!.speaking = fixture.roster[0]!.id
    crashed.meetings[0]!.queue = [fixture.roster[1]!.id]
    await fixture.studio.close()
    await writeFile(join(fixture.config.storageRoot, 'studio.v4.json'), JSON.stringify(crashed))
    const run = vi.fn(async () => summary)
    const reopened = await Studio.open(fixture.config, { run })
    owners.push({ studio: reopened, root: await mkdtemp(join(tmpdir(), 'dsh-studio-meeting-')) })
    expect(reopened.snapshot().meetings[0]).toMatchObject({ speaking: null, queue: [] })
    expect(run).not.toHaveBeenCalled()
  })
})

describe('team templates', () => {
  it('replaces the roster instead of appending, so applying twice changes nothing', async () => {
    const fixture = await setup({ async run(_employee, project, task) {
      await report(project.cwd, task)
      return summary
    } })
    const templates = fixture.studio.snapshot().templates
    expect(templates.map(value => value.members.length)).toEqual([4, 7])
    const [product, designer] = fixture.roster
    // The fixture roster already worked on a project; give the product seat a custom model to prove it is kept.
    await fixture.command('saveEmployee', { ...product, model: 'custom-model' })
    const stray = { ...teamTemplate('full')[1]!, name: 'Temporary helper' }
    await fixture.command('saveEmployee', stray)
    const first = await fixture.command('applyTemplate', { id: templates[0]!.id })
    expect(first.employees.map(value => value.name)).toEqual(['产品负责人', 'UI设计师', '全栈工程师', '测试工程师'])
    expect(first.employees.find(value => value.id === product!.id)).toMatchObject({ model: 'custom-model', enabled: true })
    expect(first.employees.some(value => value.id === stray.id)).toBe(false)
    const again = await fixture.command('applyTemplate', { id: templates[0]!.id })
    expect(again.employees).toEqual(first.employees)
    const full = await fixture.command('applyTemplate', { id: templates[1]!.id })
    expect(full.employees.filter(value => value.enabled)).toHaveLength(7)
    // Employees with task history stay as disabled records; those without history are removed.
    expect(full.employees.find(value => value.id === designer!.id)?.enabled).toBe(true)
    expect(full.employees.some(value => value.name === '全栈工程师')).toBe(false)
    expect(parseState(full).employees).toHaveLength(7)
    const lean = planTemplate(full, templates[0]!)
    expect(lean.add.map(value => value.name)).toEqual(['全栈工程师'])
    expect(lean.disable).toEqual([])
    expect(lean.remove.map(value => value.name)).toEqual(['技术负责人', '前端工程师', '后端工程师', '交付负责人'])
  })

  it('disables leaving employees with history and refuses to replace a team member who is working', async () => {
    const started = Promise.withResolvers<undefined>()
    const fixture = await setup({ async run(_employee, _project, _task, signal) {
      started.resolve(undefined)
      await new Promise<void>((resolve) => { signal.addEventListener('abort', () => { resolve() }, { once: true }) })
      throw signal.reason
    } })
    const solo = await fixture.command('saveTemplate', { id: 'solo-template', name: 'Solo', description: '', createdAt: '',
      members: [toMember({ ...fixture.roster[1]!, name: 'Reviewer', role: 'Reviewer' })] })
    const id = solo.templates.at(-1)!.id
    await fixture.command('startProject', { id: fixture.project.id })
    await started.promise
    await expect(fixture.command('applyTemplate', { id })).rejects.toThrow('Stop running tasks')
    await fixture.command('stopProject', { id: fixture.project.id })
    // The run leaves the active set just after its cancellation is recorded.
    const state = await vi.waitFor(() => fixture.command('applyTemplate', { id }))
    expect(state.employees.map(value => [value.name, value.enabled])).toEqual([['产品负责人', false], ['UI设计师', false], ['Reviewer', true]])
  })

  it('edits, validates, and deletes templates, and migrates v3 with seeded templates', async () => {
    const fixture = await setup({ async run() { return summary } })
    const member = toMember(fixture.roster[0]!)
    await expect(fixture.command('saveTemplate', { id: 'empty', name: 'Empty', description: '', createdAt: '', members: [] })).rejects.toThrow('at least one member')
    await expect(fixture.command('saveTemplate', { id: 'bad', name: 'Bad', description: '', createdAt: '',
      members: [{ ...member, engine: 'compatible', model: '' }] })).rejects.toThrow()
    await expect(fixture.command('saveTemplate', { id: 'private', name: 'Private', description: '', createdAt: '',
      members: [{ ...member, apiKey: 'secret' }] })).rejects.toThrow('apiKey')
    await fixture.command('saveTemplate', { id: 'mine', name: 'Mine', description: 'v1', createdAt: '', members: [member] })
    const edited = await fixture.command('saveTemplate', { id: 'mine', name: 'Mine', description: 'v2', createdAt: '', members: [member, { ...member, name: 'Second' }] })
    expect(edited.templates.filter(value => value.id === 'mine')).toHaveLength(1)
    expect(edited.templates.find(value => value.id === 'mine')).toMatchObject({ description: 'v2' })
    expect(edited.templates.find(value => value.id === 'mine')!.createdAt).not.toBe('')
    expect((await fixture.command('deleteTemplate', { id: 'mine' })).templates.some(value => value.id === 'mine')).toBe(false)

    await fixture.studio.close()
    const { templates: _templates, ...current } = fixture.studio.snapshot()
    const bytes = JSON.stringify({ ...current, version: 3 })+'\n'
    await rm(join(fixture.config.storageRoot, 'studio.v4.json'))
    await writeFile(join(fixture.config.storageRoot, 'studio.v3.json'), bytes)
    const reopened = await Studio.open(fixture.config, { async run() { throw new Error('Migration must not start work') } })
    owners.push({ studio: reopened, root: await mkdtemp(join(tmpdir(), 'dsh-studio-v3-')) })
    expect(reopened.snapshot().templates.map(value => value.name)).toEqual(['精简产品团队', '完整研发团队'])
    expect(reopened.snapshot().employees).toEqual(current.employees)
    expect(await readFile(join(fixture.config.storageRoot, 'studio.v3.json'), 'utf8')).toBe(bytes)
  })

  it('bulk-deletes redundant copies but never employees with history', async () => {
    const fixture = await setup({ async run() { return summary } })
    const copies = [teamTemplate('lean')[0]!, teamTemplate('lean')[0]!, teamTemplate('lean')[0]!]
    for (const copy of copies) await fixture.command('saveEmployee', copy)
    const redundant = redundantEmployees(fixture.studio.snapshot())
    // The fixture's own product lead has task history, so all three later copies are redundant.
    expect(redundant.map(value => value.id)).toEqual(copies.map(value => value.id))
    await expect(fixture.command('deleteEmployees', { ids: [...redundant.map(value => value.id), fixture.roster[0]!.id] })).rejects.toThrow('history')
    expect(fixture.studio.snapshot().employees).toHaveLength(5)
    const state = await fixture.command('deleteEmployees', { ids: redundant.map(value => value.id) })
    expect(state.employees.map(value => value.id)).toEqual(fixture.roster.map(value => value.id))
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
