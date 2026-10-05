/** Export public company records into an owned directory inside the shared repository. */
import { mkdir, realpath, lstat, readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { join } from 'node:path'
import { writeFileAtomic } from '@deepseek-ai/dsh-atomic-write'
import type { Project, StudioState } from './types.ts'
import { withinDirectory } from './validation.ts'

/** Export the brief, board, and human handoffs without native private transcripts.
 * @param state - Detached public company data.
 * @param project - Project being exported.
 * @param storageRoot - Immutable public artifact storage.
 * @returns Completion after the public documents are written.
 */
export async function exportProject(state: StudioState, project: Project, storageRoot: string): Promise<void> {
  const workspace = state.workspaces.find(value => value.id === project.workspaceId)
  if (!workspace) throw new Error('Company workspace does not exist')
  const root = await realpath(workspace.path)
  let dir = root
  for (const part of ['.studio', 'projects', project.id]) {
    dir = join(dir, part)
    try { await mkdir(dir) }
    catch (error) { if (!(error instanceof Error && 'code' in error && error.code === 'EEXIST')) throw error }
    if ((await lstat(dir)).isSymbolicLink() || !withinDirectory(root, await realpath(dir))) throw new Error('Public export directory must stay inside the company workspace')
  }
  const tasks = state.tasks.filter(value => value.projectId === project.id)
  const messages = state.messages.filter(value => value.projectId === project.id)
  const artifacts = state.artifacts.filter(value => value.projectId === project.id)
  const artifactDir = join(dir, 'artifacts')
  try { await mkdir(artifactDir) }
  catch (error) { if (!(error instanceof Error && 'code' in error && error.code === 'EEXIST')) throw error }
  if ((await lstat(artifactDir)).isSymbolicLink() || !withinDirectory(root, await realpath(artifactDir))) throw new Error('Public artifact export must stay inside the company workspace')
  for (const artifact of artifacts) {
    const bytes = await readFile(join(storageRoot, 'artifacts', artifact.id))
    if (createHash('sha256').update(bytes).digest('hex') !== artifact.sha256) throw new Error('Stored result file hash does not match')
    const path = join(artifactDir, artifact.id)
    try { if ((await lstat(path)).isSymbolicLink()) throw new Error('Public artifact export cannot be a symbolic link') }
    catch (error) { if (!(error instanceof Error && 'code' in error && error.code === 'ENOENT')) throw error }
    try { await writeFile(path, bytes, { flag: 'wx', mode: 0o600 }) }
    catch (error) {
      if (!(error instanceof Error && 'code' in error && error.code === 'EEXIST')) throw error
      if (createHash('sha256').update(await readFile(path)).digest('hex') !== artifact.sha256) throw new Error('Existing exported artifact differs from its published result')
    }
  }
  const files = {
    'brief.md': `# ${project.name}\n\n${project.objective}\n\n## Acceptance criteria\n\n${project.acceptanceCriteria}\n`,
    'board.json': `${JSON.stringify({ project, tasks: tasks.map(({ assignment: _assignment, nativeSessions: _sessions, ...task }) => task), artifacts }, null, 2)}\n`,
    'handoffs.md': `# Handoffs\n\n${messages.map(value => `## ${value.createdAt} · ${value.from} → ${value.to}\n\n${value.message}`).join('\n\n')}\n`,
    'artifact-locations.json': `${JSON.stringify(artifacts.map(value => ({ ...value, path: `artifacts/${value.id}` })), null, 2)}\n`,
  }
  for (const [name, content] of Object.entries(files)) {
    const target = join(dir, name)
    try { if ((await lstat(target)).isSymbolicLink()) throw new Error('Public export file cannot be a symbolic link') }
    catch (error) { if (!(error instanceof Error && 'code' in error && error.code === 'ENOENT')) throw error }
    await writeFileAtomic(target, content, { mode: 0o600, dirMode: 0o700 })
  }
}
