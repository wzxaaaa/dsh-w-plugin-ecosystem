const MAX_TEXT = 20_000
const MAX_SHORT = 240
const MAX_CHARACTERS = 80
const MAX_RELATIONSHIPS = 240
const MAX_PROGRESS = 500

export const SCHEMA_VERSION = 3
export const PROJECT_EXPORT_FORMAT = 'dsh-w-noval-write/project'
export const PROJECT_EXPORT_VERSION = 1

const PROJECT_KEYS = Object.freeze([
  'title',
  'genre',
  'premise',
  'tone',
  'pov',
  'targetWords',
  'audience',
  'contentRating',
  'styleGuide',
  'constraints',
  'characters',
  'relationships',
  'world',
  'plot',
  'scene',
  'progress',
  'notes',
])
const CHARACTER_KEYS = Object.freeze([
  'id', 'name', 'aliases', 'age', 'identity', 'role', 'status', 'appearance', 'traits', 'background',
  'goal', 'motivation', 'stakes', 'conflict', 'abilities', 'weaknesses', 'secret', 'knowledge',
  'possessions', 'voice', 'habits', 'arc',
])
const RELATIONSHIP_KEYS = Object.freeze([
  'id', 'fromId', 'toId', 'label', 'status', 'history', 'dynamic', 'powerBalance', 'publicFace',
  'privateTruth', 'sharedSecret', 'tension', 'turningPoints', 'futureDirection',
])
const WORLD_KEYS = Object.freeze([
  'era', 'chronology', 'geography', 'environment', 'locations', 'rules', 'factions', 'politics',
  'society', 'culture', 'economy', 'beliefs', 'technology', 'conflicts', 'lore',
])
const PLOT_KEYS = Object.freeze([
  'themes', 'storyQuestion', 'coreConflict', 'protagonistGoal', 'stakes', 'antagonisticForce', 'opening',
  'midpoint', 'climax', 'ending', 'subplots', 'foreshadowing', 'reveals', 'pacing', 'chapterPlan', 'outline',
])
const SCENE_KEYS = Object.freeze([
  'chapter', 'time', 'location', 'povCharacterId', 'participants', 'goal', 'conflict', 'beats', 'emotionalTurn',
  'sensoryAnchor', 'outcome', 'knowledgeChanges', 'propChanges', 'continuity', 'nextHook',
])
const PROGRESS_KEYS = Object.freeze(['id', 'chapter', 'summary', 'canonChanges', 'openThreads', 'at'])

export const NOVEL_TOOL_RETRY_PROTOCOL = Object.freeze([
  'Before every mutation, call novel_read and copy its revision into expected_revision.',
  'project, patch, and scene must be JSON objects, never JSON strings, Markdown, or an outer tool-argument wrapper.',
  'If a novel tool reports INVALID_NOVEL_ARGUMENTS or schema validation fails, call novel_schema, rebuild the arguments to match it, and retry the failed tool once.',
  'Do not claim that data was saved until the mutation tool returns ok: true with a newer revision.',
  'Prefer novel_patch for focused changes. Use novel_write only when every existing project field will be preserved or intentionally replaced.',
  'When the user requests a chapter file, call novel_save_chapter with the full prose. Never claim a file exists unless it returns ok: true and verified: true.',
])

function schemaProperties(keys, required) {
  return Object.fromEntries(keys.map(key => [key, {
    type: 'string',
    ...(required ? { required: true } : {}),
  }]))
}

function recordSchema(keys, required) {
  return {
    type: 'object',
    ...(required ? { required: true } : {}),
    additionalProperties: false,
    properties: schemaProperties(keys, required),
  }
}

function arraySchema(properties, required) {
  return {
    type: 'array',
    ...(required ? { required: true } : {}),
    items: {
      type: 'object',
      additionalProperties: false,
      properties,
    },
  }
}

/** Build the exact DSH tool parameter schema for a complete project or partial patch. */
export function projectToolSchema({ partial = false, required = true } = {}) {
  const leafRequired = !partial
  return {
    type: 'object',
    required,
    additionalProperties: false,
    description: partial
      ? 'Partial canonical novel project object. Omitted top-level fields are preserved.'
      : 'Complete canonical novel project object. Send this object directly; never stringify or wrap it.',
    properties: {
      ...schemaProperties(['title', 'genre', 'premise', 'tone', 'pov', 'targetWords', 'audience', 'contentRating', 'styleGuide', 'constraints'], leafRequired),
      characters: arraySchema(schemaProperties(CHARACTER_KEYS, true), leafRequired),
      relationships: arraySchema(schemaProperties(RELATIONSHIP_KEYS, true), leafRequired),
      world: recordSchema(WORLD_KEYS, leafRequired),
      plot: recordSchema(PLOT_KEYS, leafRequired),
      scene: recordSchema(SCENE_KEYS, leafRequired),
      progress: arraySchema({
        ...schemaProperties(PROGRESS_KEYS, true),
      }, leafRequired),
      notes: { type: 'string', ...(leafRequired ? { required: true } : {}) },
    },
  }
}

/** Build the scene-only patch schema used by novel_advance. */
export function scenePatchToolSchema({ required = false } = {}) {
  return {
    ...recordSchema(SCENE_KEYS, false),
    ...(required ? { required: true } : {}),
    description: 'Partial current-scene object. Send an object, never a JSON string.',
  }
}

export function novelToolContract() {
  return {
    schemaVersion: SCHEMA_VERSION,
    projectSchema: projectToolSchema({ partial: false }),
    patchSchema: projectToolSchema({ partial: true }),
    scenePatchSchema: scenePatchToolSchema(),
    emptyProjectExample: defaultProject(),
    retryProtocol: [...NOVEL_TOOL_RETRY_PROTOCOL],
    manuscriptFileProtocol: {
      tool: 'novel_save_chapter',
      filename: 'A single .md or .txt filename in the Harness Workspace root; no directories or absolute paths.',
      content: 'The complete manuscript prose, not a summary or project-state object.',
      success: 'Claim file creation only after ok: true and verified: true; report the returned path, bytes, and sha256.',
    },
  }
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function receivedType(value) {
  if (value === null) return 'null'
  if (Array.isArray(value)) return 'array'
  return typeof value
}

function validateRecord(value, path, keys, complete, issues) {
  if (!isPlainObject(value)) {
    issues.push(`${path} must be an object; received ${receivedType(value)}`)
    return
  }
  const allowed = new Set(keys)
  for (const key of Object.keys(value)) {
    if (!allowed.has(key)) issues.push(`${path}.${key} is not part of the canonical structure`)
  }
  for (const key of keys) {
    if (complete && !Object.hasOwn(value, key)) issues.push(`${path}.${key} is required`)
    if (Object.hasOwn(value, key) && typeof value[key] !== 'string') {
      issues.push(`${path}.${key} must be a string; received ${receivedType(value[key])}`)
    }
  }
}

function validateRecords(value, path, keys, complete, issues) {
  if (!Array.isArray(value)) {
    issues.push(`${path} must be an array; received ${receivedType(value)}`)
    return
  }
  value.forEach((item, index) => validateRecord(item, `${path}[${index}]`, keys, complete, issues))
}

/** Validate model-facing project input before any destructive normalization or write. */
export function projectShapeIssues(value, { partial = false } = {}) {
  const issues = []
  if (!isPlainObject(value)) {
    const hint = typeof value === 'string'
      ? '; do not stringify JSON or place the whole tool argument object inside project/patch'
      : ''
    return [`project payload must be an object; received ${receivedType(value)}${hint}`]
  }
  const allowed = new Set(PROJECT_KEYS)
  for (const key of Object.keys(value)) {
    if (!allowed.has(key)) issues.push(`project.${key} is not part of the canonical structure`)
  }
  if (partial && Object.keys(value).length === 0) issues.push('project patch must change at least one canonical field')
  for (const key of PROJECT_KEYS) {
    if (!partial && !Object.hasOwn(value, key)) issues.push(`project.${key} is required`)
  }
  for (const key of ['title', 'genre', 'premise', 'tone', 'pov', 'targetWords', 'audience', 'contentRating', 'styleGuide', 'constraints', 'notes']) {
    if (Object.hasOwn(value, key) && typeof value[key] !== 'string') {
      issues.push(`project.${key} must be a string; received ${receivedType(value[key])}`)
    }
  }
  if (Object.hasOwn(value, 'characters')) validateRecords(value.characters, 'project.characters', CHARACTER_KEYS, true, issues)
  if (Object.hasOwn(value, 'relationships')) validateRecords(value.relationships, 'project.relationships', RELATIONSHIP_KEYS, true, issues)
  if (Object.hasOwn(value, 'world')) validateRecord(value.world, 'project.world', WORLD_KEYS, !partial, issues)
  if (Object.hasOwn(value, 'plot')) validateRecord(value.plot, 'project.plot', PLOT_KEYS, !partial, issues)
  if (Object.hasOwn(value, 'scene')) validateRecord(value.scene, 'project.scene', SCENE_KEYS, !partial, issues)
  if (Object.hasOwn(value, 'progress')) validateRecords(value.progress, 'project.progress', PROGRESS_KEYS, true, issues)
  return issues
}

export function assertProjectShape(value, options) {
  const issues = projectShapeIssues(value, options)
  if (issues.length === 0) return value
  const error = new TypeError([
    'INVALID_NOVEL_ARGUMENTS: no data was written.',
    ...issues.slice(0, 12).map(issue => `- ${issue}`),
    '- Call novel_schema, rebuild the object exactly as documented, then retry once.',
  ].join('\n'))
  error.code = 'INVALID_NOVEL_ARGUMENTS'
  error.retryable = true
  error.issues = issues
  throw error
}

function text(value, limit = MAX_TEXT) {
  return typeof value === 'string' ? value.trim().slice(0, limit) : ''
}

function id(value, prefix, index) {
  const cleaned = text(value, 100)
    .normalize('NFKC')
    .replace(/[^\p{L}\p{N}_-]+/gu, '-')
    .replace(/-+/gu, '-')
    .replace(/^-|-$/gu, '')
  return cleaned || `${prefix}-${index + 1}`
}

export function defaultProject() {
  return {
    title: '',
    genre: '',
    premise: '',
    tone: '',
    pov: '',
    targetWords: '',
    audience: '',
    contentRating: '',
    styleGuide: '',
    constraints: '',
    characters: [],
    relationships: [],
    world: {
      era: '',
      chronology: '',
      geography: '',
      environment: '',
      locations: '',
      rules: '',
      factions: '',
      politics: '',
      society: '',
      culture: '',
      economy: '',
      beliefs: '',
      technology: '',
      conflicts: '',
      lore: '',
    },
    plot: {
      themes: '',
      storyQuestion: '',
      coreConflict: '',
      protagonistGoal: '',
      stakes: '',
      antagonisticForce: '',
      opening: '',
      midpoint: '',
      climax: '',
      ending: '',
      subplots: '',
      foreshadowing: '',
      reveals: '',
      pacing: '',
      chapterPlan: '',
      outline: '',
    },
    scene: {
      chapter: '',
      time: '',
      location: '',
      povCharacterId: '',
      participants: '',
      goal: '',
      conflict: '',
      beats: '',
      emotionalTurn: '',
      sensoryAnchor: '',
      outcome: '',
      knowledgeChanges: '',
      propChanges: '',
      continuity: '',
      nextHook: '',
    },
    progress: [],
    notes: '',
  }
}

function normalizeCharacter(value, index) {
  const item = value && typeof value === 'object' && !Array.isArray(value) ? value : {}
  return {
    id: id(item.id, 'character', index),
    name: text(item.name, MAX_SHORT),
    aliases: text(item.aliases),
    age: text(item.age, MAX_SHORT),
    identity: text(item.identity, MAX_SHORT),
    role: text(item.role, MAX_SHORT),
    status: text(item.status, MAX_SHORT),
    appearance: text(item.appearance),
    traits: text(item.traits),
    background: text(item.background),
    goal: text(item.goal),
    motivation: text(item.motivation),
    stakes: text(item.stakes),
    conflict: text(item.conflict),
    abilities: text(item.abilities),
    weaknesses: text(item.weaknesses),
    secret: text(item.secret),
    knowledge: text(item.knowledge),
    possessions: text(item.possessions),
    voice: text(item.voice),
    habits: text(item.habits),
    arc: text(item.arc),
  }
}

function normalizeRelationship(value, index, characterIds, characterReferences) {
  const item = value && typeof value === 'object' && !Array.isArray(value) ? value : {}
  const rawFromId = text(item.fromId, 100)
  const rawToId = text(item.toId, 100)
  const fromId = characterReferences.get(rawFromId) || (characterIds.has(rawFromId) ? rawFromId : '')
  const toId = characterReferences.get(rawToId) || (characterIds.has(rawToId) ? rawToId : '')
  return {
    id: id(item.id, 'relationship', index),
    fromId,
    toId,
    label: text(item.label, MAX_SHORT),
    status: text(item.status, MAX_SHORT),
    history: text(item.history),
    dynamic: text(item.dynamic),
    powerBalance: text(item.powerBalance),
    publicFace: text(item.publicFace),
    privateTruth: text(item.privateTruth),
    sharedSecret: text(item.sharedSecret),
    tension: text(item.tension),
    turningPoints: text(item.turningPoints),
    futureDirection: text(item.futureDirection),
  }
}

function normalizeProgress(value, index) {
  const item = value && typeof value === 'object' && !Array.isArray(value) ? value : {}
  return {
    id: id(item.id, 'progress', index),
    chapter: text(item.chapter, MAX_SHORT),
    summary: text(item.summary),
    canonChanges: text(item.canonChanges),
    openThreads: text(item.openThreads),
    at: typeof item.at === 'string' && item.at.trim() !== '' ? item.at : new Date(0).toISOString(),
  }
}

export function normalizeProject(value) {
  const input = value && typeof value === 'object' && !Array.isArray(value) ? value : {}
  const base = defaultProject()
  const characters = Array.isArray(input.characters)
    ? input.characters.slice(0, MAX_CHARACTERS).map(normalizeCharacter)
    : []
  const used = new Set()
  for (let index = 0; index < characters.length; index += 1) {
    let candidate = characters[index].id
    while (used.has(candidate)) candidate = `${candidate}-${index + 1}`
    characters[index].id = candidate
    used.add(candidate)
  }
  const characterReferences = new Map()
  for (let index = 0; index < characters.length; index += 1) {
    const source = input.characters[index]
    const rawId = source && typeof source === 'object' ? text(source.id, 100) : ''
    const rawName = source && typeof source === 'object' ? text(source.name, MAX_SHORT) : ''
    characterReferences.set(characters[index].id, characters[index].id)
    if (rawId && !characterReferences.has(rawId)) characterReferences.set(rawId, characters[index].id)
    if (rawName && !characterReferences.has(rawName)) characterReferences.set(rawName, characters[index].id)
  }
  const relationships = Array.isArray(input.relationships)
    ? input.relationships.slice(0, MAX_RELATIONSHIPS).map((item, index) => normalizeRelationship(item, index, used, characterReferences))
    : []
  const world = input.world && typeof input.world === 'object' && !Array.isArray(input.world) ? input.world : {}
  const plot = input.plot && typeof input.plot === 'object' && !Array.isArray(input.plot) ? input.plot : {}
  const scene = input.scene && typeof input.scene === 'object' && !Array.isArray(input.scene) ? input.scene : {}
  const progress = Array.isArray(input.progress)
    ? input.progress.slice(-MAX_PROGRESS).map(normalizeProgress)
    : []
  return {
    ...base,
    title: text(input.title, MAX_SHORT),
    genre: text(input.genre, MAX_SHORT),
    premise: text(input.premise),
    tone: text(input.tone, MAX_SHORT),
    pov: text(input.pov, MAX_SHORT),
    targetWords: text(input.targetWords, MAX_SHORT),
    audience: text(input.audience, MAX_SHORT),
    contentRating: text(input.contentRating, MAX_SHORT),
    styleGuide: text(input.styleGuide),
    constraints: text(input.constraints),
    characters,
    relationships,
    world: Object.fromEntries(Object.keys(base.world).map(key => [key, text(world[key])])),
    plot: Object.fromEntries(Object.keys(base.plot).map(key => [key, text(plot[key])])),
    scene: {
      chapter: text(scene.chapter, MAX_SHORT),
      time: text(scene.time, MAX_SHORT),
      location: text(scene.location, MAX_SHORT),
      povCharacterId: characterReferences.get(text(scene.povCharacterId, 100)) || '',
      participants: text(scene.participants),
      goal: text(scene.goal),
      conflict: text(scene.conflict),
      beats: text(scene.beats),
      emotionalTurn: text(scene.emotionalTurn),
      sensoryAnchor: text(scene.sensoryAnchor),
      outcome: text(scene.outcome),
      knowledgeChanges: text(scene.knowledgeChanges),
      propChanges: text(scene.propChanges),
      continuity: text(scene.continuity),
      nextHook: text(scene.nextHook),
    },
    progress,
    notes: text(input.notes),
  }
}

export function defaultState(now = Date.now()) {
  return {
    schemaVersion: SCHEMA_VERSION,
    revision: 0,
    updatedAt: new Date(now).toISOString(),
    project: defaultProject(),
  }
}

export function normalizeState(value, now = Date.now()) {
  const input = value && typeof value === 'object' && !Array.isArray(value) ? value : {}
  return {
    schemaVersion: SCHEMA_VERSION,
    revision: Number.isSafeInteger(input.revision) && input.revision >= 0 ? input.revision : 0,
    updatedAt: typeof input.updatedAt === 'string' ? input.updatedAt : new Date(now).toISOString(),
    project: normalizeProject(input.project),
  }
}

/** Create a portable, versioned document without binding it to a local workspace id or path. */
export function projectExportDocument(stateValue, workspaceValue = {}, now = Date.now()) {
  const state = normalizeState(stateValue, now)
  const workspace = isPlainObject(workspaceValue) ? workspaceValue : {}
  return {
    format: PROJECT_EXPORT_FORMAT,
    version: PROJECT_EXPORT_VERSION,
    schemaVersion: SCHEMA_VERSION,
    exportedAt: new Date(now).toISOString(),
    workspace: { title: text(workspace.title, MAX_SHORT) },
    project: state.project,
  }
}

/** Read an exported document or a raw complete project and reject lossy/partial data. */
export function projectFromImportDocument(value) {
  if (!isPlainObject(value)) throw new TypeError('import document must be a JSON object')
  let project = value
  if (Object.hasOwn(value, 'format') || Object.hasOwn(value, 'project')) {
    if (value.format !== PROJECT_EXPORT_FORMAT) throw new TypeError(`unsupported import format: ${String(value.format || '')}`)
    if (value.version !== PROJECT_EXPORT_VERSION) throw new TypeError(`unsupported import version: ${String(value.version)}`)
    project = value.project
  }
  assertProjectShape(project, { partial: false })
  return normalizeProject(project)
}

/** Merge a model/UI patch without making omitted fields erase canon. */
export function mergeProject(currentValue, patchValue) {
  const current = normalizeProject(currentValue)
  const patch = patchValue && typeof patchValue === 'object' && !Array.isArray(patchValue) ? patchValue : {}
  const next = { ...current }
  for (const key of ['title', 'genre', 'premise', 'tone', 'pov', 'targetWords', 'audience', 'contentRating', 'styleGuide', 'constraints', 'notes']) {
    if (Object.hasOwn(patch, key)) next[key] = patch[key]
  }
  if (Object.hasOwn(patch, 'characters')) next.characters = patch.characters
  if (Object.hasOwn(patch, 'relationships')) next.relationships = patch.relationships
  if (Object.hasOwn(patch, 'progress')) next.progress = patch.progress
  if (patch.world && typeof patch.world === 'object' && !Array.isArray(patch.world)) {
    next.world = { ...current.world, ...patch.world }
  }
  if (patch.plot && typeof patch.plot === 'object' && !Array.isArray(patch.plot)) {
    next.plot = { ...current.plot, ...patch.plot }
  }
  if (patch.scene && typeof patch.scene === 'object' && !Array.isArray(patch.scene)) {
    next.scene = { ...current.scene, ...patch.scene }
  }
  return normalizeProject(next)
}

/** Advance the story ledger and optionally move the current-scene cursor. */
export function advanceProject(currentValue, inputValue, now = Date.now()) {
  const current = normalizeProject(currentValue)
  const input = inputValue && typeof inputValue === 'object' && !Array.isArray(inputValue) ? inputValue : {}
  const summary = text(input.summary)
  if (summary === '') throw new Error('summary must not be empty')
  const chapter = text(input.chapter, MAX_SHORT)
  const canonChanges = text(input.canonChanges)
  const openThreads = text(input.openThreads)
  const nextScene = input.scene && typeof input.scene === 'object' && !Array.isArray(input.scene)
    ? normalizeProject({ ...current, scene: { ...current.scene, ...input.scene } }).scene
    : current.scene
  const latest = current.progress[current.progress.length - 1]
  if (latest
    && latest.chapter === chapter
    && latest.summary === summary
    && latest.canonChanges === canonChanges
    && latest.openThreads === openThreads) {
    return normalizeProject({ ...current, scene: nextScene })
  }
  const entry = normalizeProgress({
    id: input.id,
    chapter,
    summary,
    canonChanges,
    openThreads,
    at: new Date(now).toISOString(),
  }, current.progress.length)
  return normalizeProject({
    ...current,
    scene: nextScene,
    progress: [...current.progress, entry].slice(-MAX_PROGRESS),
  })
}

/** Parse the goal-like grammar owned by /write. */
export function parseWriteCommand(rawInput) {
  const input = typeof rawInput === 'string' ? rawInput.trim() : ''
  if (input === '') return { kind: 'show' }
  const control = input.toLowerCase()
  if (control === 'clear') return { kind: 'clear' }
  if (control === 'edit') return { kind: 'invalid-edit' }
  if (/^edit(?=\s)/iu.test(input)) return { kind: 'edit', objective: input.slice(4).trim() }
  return { kind: 'create', objective: input }
}

/** Validate and detach one projected per-conversation writing link. */
export function normalizeWriteLink(value) {
  const link = value && typeof value === 'object' && !Array.isArray(value) ? value : null
  if (!link) return null
  const revision = Number.isSafeInteger(link.revision) && link.revision > 0 ? link.revision : 0
  const objective = text(link.objective)
  const workspaceId = text(link.workspaceId, 200)
  const workspaceTitle = text(link.workspaceTitle, MAX_SHORT)
  if (revision === 0 || objective === '' || workspaceId === '') return null
  return {
    revision,
    objective,
    workspaceId,
    workspaceTitle,
    updatedAt: Number.isFinite(link.updatedAt) ? Number(link.updatedAt) : 0,
  }
}

/** Last-wins projection of durable novel-write link events. */
export function applyWriteLinkProjection(state, event) {
  if (!event || event.type !== 'noval-write/change' || !event.data || event.data.version !== 1) return state
  if (event.data.operation === 'clear') return null
  const link = normalizeWriteLink(event.data.link)
  return link || state
}

/** Rebuild the current writing link from one session's durable event log. */
export function writeLinkFromEvents(events) {
  let state = null
  if (!Array.isArray(events)) return state
  for (const event of events) state = applyWriteLinkProjection(state, event)
  return state
}

export function isWriteSession(events) {
  return writeLinkFromEvents(events) !== null
}

function compact(value) {
  return text(value).replace(/\s+/gu, ' ')
}

function add(lines, label, value) {
  const rendered = compact(value)
  if (rendered) lines.push(`- ${label}: ${rendered}`)
}

export function projectPrompt(projectValue, maxChars = 12_000) {
  const project = normalizeProject(projectValue)
  const lines = ['# Novel writing workspace', '', 'The right-side Novel Writing panel is the source of truth for this book. Preserve its facts and continuity.']
  add(lines, 'Title', project.title)
  add(lines, 'Genre', project.genre)
  add(lines, 'Premise', project.premise)
  add(lines, 'Tone', project.tone)
  add(lines, 'Point of view', project.pov)
  add(lines, 'Target length', project.targetWords)
  add(lines, 'Audience', project.audience)
  add(lines, 'Content boundary / rating', project.contentRating)
  add(lines, 'Style guide', project.styleGuide)
  add(lines, 'Creative constraints', project.constraints)
  if (project.characters.length > 0) {
    lines.push('', '## Characters')
    for (const character of project.characters) {
      const details = []
      add(details, 'aliases', character.aliases)
      add(details, 'age', character.age)
      add(details, 'identity', character.identity)
      add(details, 'role', character.role)
      add(details, 'status', character.status)
      add(details, 'appearance', character.appearance)
      add(details, 'traits', character.traits)
      add(details, 'background', character.background)
      add(details, 'goal', character.goal)
      add(details, 'motivation', character.motivation)
      add(details, 'stakes', character.stakes)
      add(details, 'conflict', character.conflict)
      add(details, 'abilities', character.abilities)
      add(details, 'weaknesses', character.weaknesses)
      add(details, 'secret', character.secret)
      add(details, 'knowledge', character.knowledge)
      add(details, 'possessions', character.possessions)
      add(details, 'voice', character.voice)
      add(details, 'habits', character.habits)
      add(details, 'arc', character.arc)
      lines.push(`- ${character.name || character.id}${details.length ? ` — ${details.map(item => item.slice(2)).join('; ')}` : ''}`)
    }
  }
  if (project.relationships.length > 0) {
    const names = new Map(project.characters.map(character => [character.id, character.name || character.id]))
    lines.push('', '## Relationships')
    for (const relation of project.relationships) {
      const from = names.get(relation.fromId) || relation.fromId || '?'
      const to = names.get(relation.toId) || relation.toId || '?'
      const details = [
        relation.label, relation.status, relation.history, relation.dynamic, relation.powerBalance,
        relation.publicFace, relation.privateTruth, relation.sharedSecret, relation.tension,
        relation.turningPoints, relation.futureDirection,
      ].map(compact).filter(Boolean).join('; ')
      lines.push(`- ${from} → ${to}${details ? `: ${details}` : ''}`)
    }
  }
  const worldLines = []
  add(worldLines, 'Era', project.world.era)
  add(worldLines, 'Chronology', project.world.chronology)
  add(worldLines, 'Geography', project.world.geography)
  add(worldLines, 'Environment', project.world.environment)
  add(worldLines, 'Locations', project.world.locations)
  add(worldLines, 'Rules', project.world.rules)
  add(worldLines, 'Factions', project.world.factions)
  add(worldLines, 'Politics', project.world.politics)
  add(worldLines, 'Society', project.world.society)
  add(worldLines, 'Culture', project.world.culture)
  add(worldLines, 'Economy', project.world.economy)
  add(worldLines, 'Beliefs', project.world.beliefs)
  add(worldLines, 'Technology / magic', project.world.technology)
  add(worldLines, 'Systemic conflicts', project.world.conflicts)
  add(worldLines, 'Lore', project.world.lore)
  if (worldLines.length) lines.push('', '## World', ...worldLines)
  const plotLines = []
  add(plotLines, 'Themes', project.plot.themes)
  add(plotLines, 'Dramatic question', project.plot.storyQuestion)
  add(plotLines, 'Core conflict', project.plot.coreConflict)
  add(plotLines, 'Protagonist goal', project.plot.protagonistGoal)
  add(plotLines, 'Stakes', project.plot.stakes)
  add(plotLines, 'Antagonistic force', project.plot.antagonisticForce)
  add(plotLines, 'Opening', project.plot.opening)
  add(plotLines, 'Midpoint', project.plot.midpoint)
  add(plotLines, 'Climax', project.plot.climax)
  add(plotLines, 'Ending', project.plot.ending)
  add(plotLines, 'Subplots', project.plot.subplots)
  add(plotLines, 'Foreshadowing', project.plot.foreshadowing)
  add(plotLines, 'Reveals', project.plot.reveals)
  add(plotLines, 'Pacing', project.plot.pacing)
  add(plotLines, 'Chapter plan', project.plot.chapterPlan)
  add(plotLines, 'Outline', project.plot.outline)
  if (plotLines.length) lines.push('', '## Plot', ...plotLines)
  const sceneLines = []
  const povName = project.characters.find(character => character.id === project.scene.povCharacterId)?.name
  add(sceneLines, 'Chapter / scene', project.scene.chapter)
  add(sceneLines, 'Time', project.scene.time)
  add(sceneLines, 'Location', project.scene.location)
  add(sceneLines, 'POV character', povName || project.scene.povCharacterId)
  add(sceneLines, 'Participants', project.scene.participants)
  add(sceneLines, 'Scene goal', project.scene.goal)
  add(sceneLines, 'Scene conflict', project.scene.conflict)
  add(sceneLines, 'Beat sequence', project.scene.beats)
  add(sceneLines, 'Emotional turn', project.scene.emotionalTurn)
  add(sceneLines, 'Sensory anchor', project.scene.sensoryAnchor)
  add(sceneLines, 'Intended outcome', project.scene.outcome)
  add(sceneLines, 'Knowledge changes', project.scene.knowledgeChanges)
  add(sceneLines, 'Object / state changes', project.scene.propChanges)
  add(sceneLines, 'Continuity ledger', project.scene.continuity)
  add(sceneLines, 'Next hook', project.scene.nextHook)
  if (sceneLines.length) lines.push('', '## Current scene', ...sceneLines)
  if (project.progress.length > 0) {
    lines.push('', '## Recent story progress')
    for (const entry of project.progress.slice(-12)) {
      const details = [compact(entry.canonChanges), compact(entry.openThreads)].filter(Boolean).join('; ')
      lines.push(`- ${entry.chapter || 'Progress'}: ${compact(entry.summary)}${details ? ` — ${details}` : ''}`)
    }
  }
  add(lines, 'Additional notes', project.notes)
  const protocol = [
    '',
    'Writing protocol:',
    '- Established facts are canon. Surface conflicts before changing them; ask when a missing decision materially changes the story.',
    '- Use kb_search/kb_read for stylistic texture when useful, but never copy distinctive wording, characters, or plot.',
    '- Draft requested prose directly; preserve viewpoint, voice, causality, and continuity.',
    '- If the user asks to create/save/export a chapter file, call novel_save_chapter with the complete prose. Project mutations do not create manuscript files.',
    '- Never say a file was created or provide a path unless novel_save_chapter returned ok: true and verified: true. Report its exact returned path, bytes, and sha256.',
    '- Durable canon and story progress must be written back with novel_read, novel_patch, novel_write, or novel_advance.',
    '- Before every mutation, novel_read; pass its exact revision as expected_revision.',
    '- Object arguments are direct JSON objects, never strings, Markdown, or nested outer arguments.',
    '- Prefer novel_patch. novel_write is complete canon replacement and preserves progress unless replace_progress is true.',
    '- Validation failure: novel_schema, rebuild, retry once. Success requires ok: true and a newer revision.',
    '- changed: false or stop: true: stop tool calls and answer the user.',
    '- novel_write and novel_advance are mutually exclusive inside one model turn; plan one canonical mutation and never oscillate between them.',
    '- Never alternate novel_write and novel_advance for one change; advance only an actual new story event.',
  ].join('\n')
  const facts = lines.join('\n')
  const result = facts + '\n' + protocol
  const limit = Number.isFinite(maxChars) ? Math.max(2_000, Math.floor(maxChars)) : 12_000
  if (result.length <= limit) return result
  const marker = '\n\n[Novel workspace facts truncated; open the right panel for full details.]\n'
  const factBudget = Math.max(0, limit - marker.length - protocol.length)
  return facts.slice(0, factBudget) + marker + protocol
}
