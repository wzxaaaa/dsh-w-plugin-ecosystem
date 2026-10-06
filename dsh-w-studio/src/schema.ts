/** Browser-safe parsers for Studio HTTP and durable records. */
import z from '@deepseek-ai/schemastery'

function knownFields(input: unknown, schema: Pick<z<unknown>, 'type' | 'dict' | 'inner'>): void {
  if (schema.type === 'object' && typeof input === 'object' && input !== null && !Array.isArray(input)) {
    for (const key of Object.keys(schema.dict ?? {})) {
      if (!Object.hasOwn(input, key)) throw new Error(`Missing Studio field: ${key}`)
    }
    for (const [key, value] of Object.entries(input)) {
      if (!schema.dict || !Object.hasOwn(schema.dict, key)) throw new Error(`Unexpected Studio field: ${key}`)
      const member = schema.dict[key]
      if (member === undefined) throw new Error(`Missing Studio field validator: ${key}`)
      knownFields(value, member)
    }
  } else if (schema.type === 'array' && Array.isArray(input) && schema.inner) {
    for (const value of input) knownFields(value, schema.inner)
  }
}

/** Decode Studio JSON while rejecting extra object fields, including nested records.
 * @param schema - Complete expected fields and value validators.
 * @param input - HTTP or durable-file JSON.
 * @returns Validated fields without private protocol extensions.
 */
export function parseFields<T>(schema: z<T>, input: unknown): T {
  knownFields(input, schema)
  return z.resolve(input, schema, {})[0] as T
}

const id = z.string().pattern(/^[A-Za-z0-9][A-Za-z0-9_-]{0,99}$/).required()
const text = z.string().max(100_000).required()
const short = z.string().max(500).required()
const engine = z.union(['codex', 'claude', 'harness', 'compatible'] as const).required()
const permission = z.union(['read-only', 'workspace-write', 'full-access'] as const).required()

const memberFields = {
  name: short, role: short, responsibilities: text, engine, model: short,
  effort: short, permission, baseURL: short, apiKeyEnv: short,
  thinkingFormat: z.union(['none', 'deepseek', 'zai'] as const).required(),
  contextWindow: z.number().step(1).min(1024).max(10_000_000).required(),
  maxTokens: z.number().step(1).min(1).max(1_000_000).required(),
}
/** Complete employee parser; credentials are referenced by name, never stored as values. */
export const employeeSchema = z.object({ ...memberFields, id, cwd: short, enabled: z.boolean().required() })
/** Template member parser: employee settings without identity, directory, or enablement. */
export const memberSchema = z.object(memberFields)

const projectFields = { id, name: short, objective: text, cwd: short,
  status: z.union(['paused', 'running', 'completed'] as const).required(), createdAt: short }
const taskFields = { id, projectId: id, employeeId: id, title: short, instruction: text,
  dependsOn: z.array(id).required(), outputFiles: z.array(short).required(),
  status: z.union(['pending', 'running', 'completed', 'failed', 'cancelled', 'interrupted'] as const).required(),
  attempt: z.natural().required(), result: text, error: text, startedAt: short, finishedAt: short, assignment: text }
const stateV1Fields = {
  version: z.const(1).required(), revision: z.natural().required(),
  employees: z.array(employeeSchema).required(),
  projects: z.array(z.object(projectFields)).required(),
  tasks: z.array(z.object(taskFields)).required(),
  messages: z.array(z.object({ id, projectId: id, taskId: z.union([id, z.const(null)]),
    from: id, to: id, message: text, createdAt: short })).required(),
  artifacts: z.array(z.object({ id, projectId: id, taskId: id, name: short,
    size: z.natural().required(), sha256: short })).required(),
}

/** Frozen v1 fields used only to read the predecessor journal. */
export const stateV1Schema = z.object(stateV1Fields)

/** Native identity of one employee run; transcripts are never recorded. */
export const nativeSessionSchema = z.object({ id, engine, cwd: short,
  attempt: z.natural().min(1).required(), continued: z.boolean().required() })
const nativeSession = nativeSessionSchema
const taskV2Fields = { ...taskFields,
  nativeSessions: z.array(nativeSession).required(),
  reviewStatus: z.union(['pending', 'accepted', 'superseded'] as const).required(),
}
const stateV2Fields = {
  ...stateV1Fields,
  version: z.const(2).required(),
  workspaces: z.array(z.object({ id, name: short, path: short, createdAt: short })).required(),
  activeWorkspaceId: z.union([id, z.const(null)]),
  projects: z.array(z.object({ ...projectFields,
    workspaceId: id, acceptanceCriteria: text,
    sessionMode: z.union(['employee-project', 'new-task'] as const).required(),
    status: z.union(['paused', 'running', 'review', 'completed'] as const).required(),
  })).required(),
  tasks: z.array(z.object(taskV2Fields)).required(),
}

/** Frozen v2 fields used only to read the predecessor journal. */
export const stateV2Schema = z.object(stateV2Fields)

/** Editable meeting outcome; also the `saveMinutes` input. */
export const minutesSchema = z.object({ summary: text, decisions: z.array(text).required(), projectName: short, objective: text,
  acceptanceCriteria: text, tasks: z.array(z.object({ employeeId: id, title: short, instruction: text })).required() })
const meetingV3Fields = { id, workspaceId: id, title: short, agenda: text, hostId: id, attendeeIds: z.array(id).required(),
  status: z.union(['open', 'drafting', 'review', 'closed'] as const).required(),
  queue: z.array(id).required(), speaking: z.union([id, z.const(null)]), error: text,
  messages: z.array(z.object({ id, from: id, message: text, mentions: z.array(id).required(), createdAt: short,
    nativeSession: z.union([nativeSession, z.const(null)]) })).required(),
  minutes: z.union([minutesSchema, z.const(null)]),
  projectId: z.union([id, z.const(null)]), createdAt: short }
const meeting = z.object(meetingV3Fields)

const stateV3Fields = { ...stateV2Fields, version: z.const(3).required(), meetings: z.array(meeting).required() }
/** Frozen v3 fields (v2 plus meetings) used only to read the predecessor journal. */
export const stateV3Schema = z.object(stateV3Fields)

/** Editable team template; also the `saveTemplate` input. */
export const templateSchema = z.object({ id, name: short, description: text, members: z.array(memberSchema).required(), createdAt: short })
const stateV4Fields = { ...stateV3Fields, version: z.const(4).required(), templates: z.array(templateSchema).required() }
/** Frozen v4 fields (v3 plus editable team templates) used only to read the predecessor journal. */
export const stateV4Schema = z.object(stateV4Fields)
const stateV5Fields = { ...stateV4Fields, version: z.const(5).required(),
  tasks: z.array(z.object({ ...taskV2Fields,
    status: z.union(['pending', 'running', 'waiting', 'completed', 'failed', 'cancelled', 'interrupted'] as const).required(),
    question: text, reply: text })).required() }
/** Frozen v5 fields (v4 plus tasks that wait for the user) used only to read the predecessor journal. */
export const stateV5Schema = z.object(stateV5Fields)
/** Current document: v5 plus the project each meeting is about. */
export const stateSchema = z.object({ ...stateV5Fields, version: z.const(6).required(),
  meetings: z.array(z.object({ ...meetingV3Fields, topicProjectId: z.union([id, z.const(null)]) })).required() })
