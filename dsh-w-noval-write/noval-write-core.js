const MAX_TEXT = 20_000
const MAX_SHORT = 240
const MAX_CHARACTERS = 80
const MAX_RELATIONSHIPS = 240
const MAX_PROGRESS = 500
const MAX_VOLUMES = 40
const MAX_CHAPTERS_PER_VOLUME = 500
const MAX_SCENES_PER_CHAPTER = 100
const MAX_CUSTOM_FIELDS = 100

export const SCHEMA_VERSION = 4
export const PROJECT_EXPORT_FORMAT = 'dsh-w-noval-write/project'
export const PROJECT_EXPORT_VERSION = 1
export const WRITE_LINK_STORE_VERSION = 1

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
  'genreProfile',
  'characters',
  'relationships',
  'volumes',
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
const GENRE_PROFILE_KEYS = Object.freeze(['type', 'customFields'])
const OUTLINE_SCENE_KEYS = Object.freeze([
  'id', 'title', 'time', 'location', 'povCharacterId', 'participants', 'goal', 'conflict', 'beats',
  'emotionalTurn', 'sensoryAnchor', 'outcome', 'knowledgeChanges', 'propChanges', 'continuity', 'nextHook',
  'customFields',
])
const CHAPTER_KEYS = Object.freeze([
  'id', 'number', 'title', 'targetWords', 'status', 'summary', 'locations', 'events', 'dialogueNotes',
  'endingHook', 'scenes', 'customFields',
])
const VOLUME_KEYS = Object.freeze(['id', 'title', 'summary', 'status', 'chapters', 'customFields'])

export const NOVEL_TOOL_RETRY_PROTOCOL = Object.freeze([
  'Before every mutation, call novel_read and copy its revision into expected_revision.',
  'project, patch, and scene must be JSON objects, never JSON strings, Markdown, or an outer tool-argument wrapper.',
  'If a novel tool reports INVALID_NOVEL_ARGUMENTS or schema validation fails, call novel_schema, rebuild the arguments to match it, and retry the failed tool once.',
  'Do not claim that data was saved until the mutation tool returns ok: true with a newer revision.',
  'Prefer novel_patch for focused changes. Use novel_write only when every existing project field will be preserved or intentionally replaced.',
  'Use novel_character_patch, novel_relationship_patch, novel_volume_upsert, and novel_chapter_upsert for ID-targeted changes; do not resend whole arrays.',
  'Genre-specific data belongs in customFields as string key/value pairs. Structured long-form outlines belong in volumes[].chapters[], not one long chapterPlan string.',
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

function customFieldsSchema(required = false) {
  return {
    type: 'object',
    ...(required ? { required: true } : {}),
    additionalProperties: true,
    description: 'Genre-specific free-form string fields. Keys are user-defined and preserved.',
  }
}

export function characterPatchToolSchema({ required = true } = {}) {
  return {
    type: 'object',
    ...(required ? { required: true } : {}),
    additionalProperties: false,
    properties: {
      ...schemaProperties(CHARACTER_KEYS.filter(key => key !== 'id'), false),
      customFields: customFieldsSchema(),
    },
  }
}

export function relationshipPatchToolSchema({ required = true } = {}) {
  return {
    type: 'object',
    ...(required ? { required: true } : {}),
    additionalProperties: false,
    properties: {
      ...schemaProperties(RELATIONSHIP_KEYS.filter(key => key !== 'id'), false),
      customFields: customFieldsSchema(),
    },
  }
}

function outlineSceneToolSchema(required = false) {
  return {
    type: 'object',
    ...(required ? { required: true } : {}),
    additionalProperties: false,
    properties: {
      ...schemaProperties(OUTLINE_SCENE_KEYS.filter(key => key !== 'customFields'), false),
      id: { type: 'string', required: true },
      customFields: customFieldsSchema(),
    },
  }
}

export function chapterToolSchema({ required = true, requireId = true } = {}) {
  return {
    type: 'object',
    ...(required ? { required: true } : {}),
    additionalProperties: false,
    properties: {
      ...schemaProperties(CHAPTER_KEYS.filter(key => !['events', 'scenes', 'customFields'].includes(key)), false),
      id: { type: 'string', ...(requireId ? { required: true } : {}) },
      events: { type: 'array', items: { type: 'string' } },
      scenes: { type: 'array', items: outlineSceneToolSchema() },
      customFields: customFieldsSchema(),
    },
  }
}

export function chapterPatchToolSchema({ required = true } = {}) {
  return chapterToolSchema({ required, requireId: false })
}

export function volumePatchToolSchema({ required = true } = {}) {
  return {
    type: 'object',
    ...(required ? { required: true } : {}),
    additionalProperties: false,
    properties: {
      ...schemaProperties(['title', 'summary', 'status'], false),
      customFields: customFieldsSchema(),
    },
  }
}

function volumeToolSchema(required = false) {
  return {
    type: 'object',
    ...(required ? { required: true } : {}),
    additionalProperties: false,
    properties: {
      ...schemaProperties(['id', 'title', 'summary', 'status'], false),
      id: { type: 'string', required: true },
      chapters: { type: 'array', items: chapterToolSchema({ required: false }) },
      customFields: customFieldsSchema(),
    },
  }
}

/** Build the exact DSH tool parameter schema for a complete project or partial patch. */
export function projectToolSchema({ partial = false, required = true } = {}) {
  return {
    type: 'object',
    required,
    additionalProperties: false,
    description: partial
      ? 'Partial canonical novel project object. Omitted top-level fields are preserved.'
      : 'Complete canonical novel project object. Send this object directly; never stringify or wrap it.',
    properties: {
      ...schemaProperties(['title', 'genre', 'premise', 'tone', 'pov', 'targetWords', 'audience', 'contentRating', 'styleGuide', 'constraints'], false),
      genreProfile: {
        ...volumeToolSchema(false),
        properties: { type: { type: 'string' }, customFields: customFieldsSchema() },
      },
      characters: arraySchema({
        ...schemaProperties(CHARACTER_KEYS, false),
        id: { type: 'string', required: true },
        name: { type: 'string', required: true },
        customFields: customFieldsSchema(),
      }, !partial),
      relationships: arraySchema({
        ...schemaProperties(RELATIONSHIP_KEYS, false),
        id: { type: 'string', required: true },
        fromId: { type: 'string', required: true },
        toId: { type: 'string', required: true },
        customFields: customFieldsSchema(),
      }, !partial),
      volumes: { type: 'array', items: volumeToolSchema(), ...(!partial ? { required: true } : {}) },
      world: recordSchema(WORLD_KEYS, !partial),
      plot: recordSchema(PLOT_KEYS, !partial),
      scene: recordSchema(SCENE_KEYS, !partial),
      progress: arraySchema({
        ...schemaProperties(PROGRESS_KEYS, false),
        id: { type: 'string', required: true },
        summary: { type: 'string', required: true },
      }, !partial),
      notes: { type: 'string' },
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
    chapterSchema: chapterToolSchema(),
    characterPatchSchema: characterPatchToolSchema(),
    relationshipPatchSchema: relationshipPatchToolSchema(),
    volumePatchSchema: volumePatchToolSchema(),
    chapterPatchSchema: chapterPatchToolSchema(),
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

function validateCustomFields(value, path, issues) {
  if (!isPlainObject(value)) {
    issues.push(`${path} must be an object; received ${receivedType(value)}`)
    return
  }
  for (const [key, fieldValue] of Object.entries(value)) {
    if (key.trim() === '') issues.push(`${path} contains an empty key`)
    if (typeof fieldValue !== 'string') issues.push(`${path}.${key} must be a string; received ${receivedType(fieldValue)}`)
  }
}

function validateFlexibleRecord(value, path, keys, requiredKeys, issues) {
  if (!isPlainObject(value)) {
    issues.push(`${path} must be an object; received ${receivedType(value)}`)
    return
  }
  const allowed = new Set(keys)
  for (const key of Object.keys(value)) {
    if (!allowed.has(key)) issues.push(`${path}.${key} is not part of the canonical structure`)
  }
  for (const key of requiredKeys) {
    if (!Object.hasOwn(value, key)) issues.push(`${path}.${key} is required`)
  }
  for (const key of keys) {
    if (!Object.hasOwn(value, key)) continue
    if (key === 'customFields') validateCustomFields(value[key], `${path}.customFields`, issues)
    else if (typeof value[key] !== 'string') issues.push(`${path}.${key} must be a string; received ${receivedType(value[key])}`)
  }
}

function validateOutlineScene(value, path, issues) {
  validateFlexibleRecord(value, path, OUTLINE_SCENE_KEYS, ['id'], issues)
}

function validateChapter(value, path, issues) {
  if (!isPlainObject(value)) {
    issues.push(`${path} must be an object; received ${receivedType(value)}`)
    return
  }
  const allowed = new Set(CHAPTER_KEYS)
  for (const key of Object.keys(value)) if (!allowed.has(key)) issues.push(`${path}.${key} is not part of the canonical structure`)
  if (!Object.hasOwn(value, 'id')) issues.push(`${path}.id is required`)
  for (const key of CHAPTER_KEYS.filter(key => !['events', 'scenes', 'customFields'].includes(key))) {
    if (Object.hasOwn(value, key) && typeof value[key] !== 'string') issues.push(`${path}.${key} must be a string; received ${receivedType(value[key])}`)
  }
  if (Object.hasOwn(value, 'events')) {
    if (!Array.isArray(value.events)) issues.push(`${path}.events must be an array; received ${receivedType(value.events)}`)
    else value.events.forEach((event, index) => {
      if (typeof event !== 'string') issues.push(`${path}.events[${index}] must be a string; received ${receivedType(event)}`)
    })
  }
  if (Object.hasOwn(value, 'scenes')) {
    if (!Array.isArray(value.scenes)) issues.push(`${path}.scenes must be an array; received ${receivedType(value.scenes)}`)
    else value.scenes.forEach((scene, index) => validateOutlineScene(scene, `${path}.scenes[${index}]`, issues))
  }
  if (Object.hasOwn(value, 'customFields')) validateCustomFields(value.customFields, `${path}.customFields`, issues)
}

function validateVolume(value, path, issues) {
  if (!isPlainObject(value)) {
    issues.push(`${path} must be an object; received ${receivedType(value)}`)
    return
  }
  const allowed = new Set(VOLUME_KEYS)
  for (const key of Object.keys(value)) if (!allowed.has(key)) issues.push(`${path}.${key} is not part of the canonical structure`)
  if (!Object.hasOwn(value, 'id')) issues.push(`${path}.id is required`)
  for (const key of ['id', 'title', 'summary', 'status']) {
    if (Object.hasOwn(value, key) && typeof value[key] !== 'string') issues.push(`${path}.${key} must be a string; received ${receivedType(value[key])}`)
  }
  if (Object.hasOwn(value, 'chapters')) {
    if (!Array.isArray(value.chapters)) issues.push(`${path}.chapters must be an array; received ${receivedType(value.chapters)}`)
    else value.chapters.forEach((chapter, index) => validateChapter(chapter, `${path}.chapters[${index}]`, issues))
  }
  if (Object.hasOwn(value, 'customFields')) validateCustomFields(value.customFields, `${path}.customFields`, issues)
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
  for (const key of ['title', 'characters', 'relationships', 'world', 'plot', 'scene', 'progress']) {
    if (!partial && !Object.hasOwn(value, key)) issues.push(`project.${key} is required`)
  }
  for (const key of ['title', 'genre', 'premise', 'tone', 'pov', 'targetWords', 'audience', 'contentRating', 'styleGuide', 'constraints', 'notes']) {
    if (Object.hasOwn(value, key) && typeof value[key] !== 'string') {
      issues.push(`project.${key} must be a string; received ${receivedType(value[key])}`)
    }
  }
  if (Object.hasOwn(value, 'genreProfile')) {
    if (!isPlainObject(value.genreProfile)) issues.push(`project.genreProfile must be an object; received ${receivedType(value.genreProfile)}`)
    else {
      for (const key of Object.keys(value.genreProfile)) if (!GENRE_PROFILE_KEYS.includes(key)) issues.push(`project.genreProfile.${key} is not part of the canonical structure`)
      if (Object.hasOwn(value.genreProfile, 'type') && typeof value.genreProfile.type !== 'string') issues.push(`project.genreProfile.type must be a string; received ${receivedType(value.genreProfile.type)}`)
      if (Object.hasOwn(value.genreProfile, 'customFields')) validateCustomFields(value.genreProfile.customFields, 'project.genreProfile.customFields', issues)
    }
  }
  if (Object.hasOwn(value, 'characters')) {
    if (!Array.isArray(value.characters)) issues.push(`project.characters must be an array; received ${receivedType(value.characters)}`)
    else value.characters.forEach((item, index) => validateFlexibleRecord(item, `project.characters[${index}]`, [...CHARACTER_KEYS, 'customFields'], ['id', 'name'], issues))
  }
  if (Object.hasOwn(value, 'relationships')) {
    if (!Array.isArray(value.relationships)) issues.push(`project.relationships must be an array; received ${receivedType(value.relationships)}`)
    else value.relationships.forEach((item, index) => validateFlexibleRecord(item, `project.relationships[${index}]`, [...RELATIONSHIP_KEYS, 'customFields'], ['id', 'fromId', 'toId'], issues))
    if (Array.isArray(value.characters) && Array.isArray(value.relationships)) {
      const ids = new Set(value.characters.map(character => isPlainObject(character) ? text(character.id, 100) : '').filter(Boolean))
      const names = new Map()
      for (const character of value.characters) {
        const name = isPlainObject(character) ? text(character.name, MAX_SHORT) : ''
        if (name) names.set(name, (names.get(name) || 0) + 1)
      }
      const resolves = endpoint => ids.has(endpoint) || names.get(endpoint) === 1
      value.relationships.forEach((relationship, index) => {
        if (!isPlainObject(relationship)) return
        const from = text(relationship.fromId, 100)
        const to = text(relationship.toId, 100)
        if (from && !resolves(from)) issues.push(`project.relationships[${index}].fromId does not identify a unique character`)
        if (to && !resolves(to)) issues.push(`project.relationships[${index}].toId does not identify a unique character`)
        if (from && to && from === to) issues.push(`project.relationships[${index}] must connect two distinct characters`)
      })
    }
  }
  if (Object.hasOwn(value, 'volumes')) {
    if (!Array.isArray(value.volumes)) issues.push(`project.volumes must be an array; received ${receivedType(value.volumes)}`)
    else value.volumes.forEach((volume, index) => validateVolume(volume, `project.volumes[${index}]`, issues))
  }
  if (Object.hasOwn(value, 'world')) validateRecord(value.world, 'project.world', WORLD_KEYS, false, issues)
  if (Object.hasOwn(value, 'plot')) validateRecord(value.plot, 'project.plot', PLOT_KEYS, false, issues)
  if (Object.hasOwn(value, 'scene')) validateRecord(value.scene, 'project.scene', SCENE_KEYS, false, issues)
  if (Object.hasOwn(value, 'progress')) {
    if (!Array.isArray(value.progress)) issues.push(`project.progress must be an array; received ${receivedType(value.progress)}`)
    else value.progress.forEach((item, index) => validateFlexibleRecord(item, `project.progress[${index}]`, PROGRESS_KEYS, ['id', 'summary'], issues))
  }
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
    genreProfile: {
      type: '',
      customFields: {},
    },
    characters: [],
    relationships: [],
    volumes: [],
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
    customFields: normalizeCustomFields(item.customFields),
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
    customFields: normalizeCustomFields(item.customFields),
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

function normalizeCustomFields(value) {
  if (!isPlainObject(value)) return {}
  const fields = {}
  for (const [rawKey, rawValue] of Object.entries(value).slice(0, MAX_CUSTOM_FIELDS)) {
    const key = text(rawKey, MAX_SHORT)
    if (key && typeof rawValue === 'string') fields[key] = text(rawValue)
  }
  return fields
}

export function defaultOutlineScene() {
  return {
    id: '', title: '', time: '', location: '', povCharacterId: '', participants: '', goal: '', conflict: '',
    beats: '', emotionalTurn: '', sensoryAnchor: '', outcome: '', knowledgeChanges: '', propChanges: '',
    continuity: '', nextHook: '', customFields: {},
  }
}

export function defaultChapter() {
  return {
    id: '', number: '', title: '', targetWords: '', status: 'planned', summary: '', locations: '', events: [],
    dialogueNotes: '', endingHook: '', scenes: [], customFields: {},
  }
}

export function defaultVolume() {
  return { id: '', title: '', summary: '', status: 'planned', chapters: [], customFields: {} }
}

function normalizeOutlineScene(value, index, characterReferences) {
  const item = isPlainObject(value) ? value : {}
  const base = defaultOutlineScene()
  return {
    ...base,
    ...Object.fromEntries(OUTLINE_SCENE_KEYS.filter(key => !['id', 'povCharacterId', 'customFields'].includes(key)).map(key => [key, text(item[key])])),
    id: id(item.id, 'scene', index),
    povCharacterId: characterReferences.get(text(item.povCharacterId, 100)) || '',
    customFields: normalizeCustomFields(item.customFields),
  }
}

function normalizeChapter(value, index, characterReferences) {
  const item = isPlainObject(value) ? value : {}
  return {
    id: id(item.id, 'chapter', index),
    number: text(item.number, MAX_SHORT),
    title: text(item.title, MAX_SHORT),
    targetWords: text(item.targetWords, MAX_SHORT),
    status: text(item.status, MAX_SHORT) || 'planned',
    summary: text(item.summary),
    locations: text(item.locations),
    events: Array.isArray(item.events) ? item.events.slice(0, 200).map(event => text(event)).filter(Boolean) : [],
    dialogueNotes: text(item.dialogueNotes),
    endingHook: text(item.endingHook),
    scenes: Array.isArray(item.scenes)
      ? item.scenes.slice(0, MAX_SCENES_PER_CHAPTER).map((scene, sceneIndex) => normalizeOutlineScene(scene, sceneIndex, characterReferences))
      : [],
    customFields: normalizeCustomFields(item.customFields),
  }
}

function normalizeVolume(value, index, characterReferences) {
  const item = isPlainObject(value) ? value : {}
  const chapters = Array.isArray(item.chapters)
    ? item.chapters.slice(0, MAX_CHAPTERS_PER_VOLUME).map((chapter, chapterIndex) => normalizeChapter(chapter, chapterIndex, characterReferences))
    : []
  const used = new Set()
  for (let chapterIndex = 0; chapterIndex < chapters.length; chapterIndex += 1) {
    let candidate = chapters[chapterIndex].id
    while (used.has(candidate)) candidate = `${candidate}-${chapterIndex + 1}`
    chapters[chapterIndex].id = candidate
    used.add(candidate)
  }
  return {
    id: id(item.id, 'volume', index),
    title: text(item.title, MAX_SHORT),
    summary: text(item.summary),
    status: text(item.status, MAX_SHORT) || 'planned',
    chapters,
    customFields: normalizeCustomFields(item.customFields),
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
  const characterNameCounts = new Map()
  for (const source of Array.isArray(input.characters) ? input.characters : []) {
    const rawName = isPlainObject(source) ? text(source.name, MAX_SHORT) : ''
    if (rawName) characterNameCounts.set(rawName, (characterNameCounts.get(rawName) || 0) + 1)
  }
  for (let index = 0; index < characters.length; index += 1) {
    const source = input.characters[index]
    const rawId = source && typeof source === 'object' ? text(source.id, 100) : ''
    const rawName = source && typeof source === 'object' ? text(source.name, MAX_SHORT) : ''
    characterReferences.set(characters[index].id, characters[index].id)
    if (rawId && !characterReferences.has(rawId)) characterReferences.set(rawId, characters[index].id)
    if (rawName && characterNameCounts.get(rawName) === 1) characterReferences.set(rawName, characters[index].id)
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
    genreProfile: {
      type: text(isPlainObject(input.genreProfile) ? input.genreProfile.type : '', MAX_SHORT),
      customFields: normalizeCustomFields(isPlainObject(input.genreProfile) ? input.genreProfile.customFields : null),
    },
    characters,
    relationships,
    volumes: Array.isArray(input.volumes)
      ? input.volumes.slice(0, MAX_VOLUMES).map((volume, index) => normalizeVolume(volume, index, characterReferences))
      : [],
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
  if (Object.hasOwn(patch, 'genreProfile')) {
    next.genreProfile = {
      ...current.genreProfile,
      ...patch.genreProfile,
      customFields: {
        ...current.genreProfile.customFields,
        ...(isPlainObject(patch.genreProfile?.customFields) ? patch.genreProfile.customFields : {}),
      },
    }
  }
  if (Object.hasOwn(patch, 'characters')) next.characters = patch.characters
  if (Object.hasOwn(patch, 'relationships')) next.relationships = patch.relationships
  if (Object.hasOwn(patch, 'volumes')) next.volumes = patch.volumes
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

function mergeCustomFields(current, patch) {
  if (!isPlainObject(patch)) return current
  const next = { ...current }
  for (const [key, value] of Object.entries(patch)) {
    if (value === '') delete next[key]
    else next[key] = value
  }
  return next
}

/** Patch one existing character without resending the complete character array. */
export function patchCharacterById(projectValue, characterId, patchValue) {
  const project = normalizeProject(projectValue)
  const key = text(characterId, 100)
  const index = project.characters.findIndex(character => character.id === key)
  if (index < 0) throw new Error(`unknown character '${key}'`)
  const patch = isPlainObject(patchValue) ? patchValue : {}
  if (Object.keys(patch).length === 0) throw new Error('character patch must not be empty')
  const characters = [...project.characters]
  characters[index] = {
    ...characters[index],
    ...patch,
    id: characters[index].id,
    customFields: mergeCustomFields(characters[index].customFields, patch.customFields),
  }
  const candidate = { ...project, characters }
  assertProjectShape(candidate, { partial: false })
  return normalizeProject(candidate)
}

/** Patch one existing relationship without resending the complete relationship array. */
export function patchRelationshipById(projectValue, relationshipId, patchValue) {
  const project = normalizeProject(projectValue)
  const key = text(relationshipId, 100)
  const index = project.relationships.findIndex(relationship => relationship.id === key)
  if (index < 0) throw new Error(`unknown relationship '${key}'`)
  const patch = isPlainObject(patchValue) ? patchValue : {}
  if (Object.keys(patch).length === 0) throw new Error('relationship patch must not be empty')
  const relationships = [...project.relationships]
  relationships[index] = {
    ...relationships[index],
    ...patch,
    id: relationships[index].id,
    customFields: mergeCustomFields(relationships[index].customFields, patch.customFields),
  }
  const candidate = { ...project, relationships }
  assertProjectShape(candidate, { partial: false })
  return normalizeProject(candidate)
}

/** Create or patch a volume by stable id. */
export function upsertVolume(projectValue, volumeId, patchValue) {
  const project = normalizeProject(projectValue)
  const key = id(volumeId, 'volume', project.volumes.length)
  const patch = isPlainObject(patchValue) ? patchValue : {}
  if (Object.keys(patch).length === 0) throw new Error('volume patch must not be empty')
  const volumes = [...project.volumes]
  const index = volumes.findIndex(volume => volume.id === key)
  const current = index >= 0 ? volumes[index] : { ...defaultVolume(), id: key }
  const next = {
    ...current,
    ...patch,
    id: key,
    chapters: current.chapters,
    customFields: mergeCustomFields(current.customFields, patch.customFields),
  }
  if (index >= 0) volumes[index] = next
  else volumes.push(next)
  const candidate = { ...project, volumes }
  assertProjectShape(candidate, { partial: false })
  return normalizeProject(candidate)
}

/** Create or patch a chapter inside one volume by stable id. */
export function upsertChapter(projectValue, volumeId, chapterId, patchValue) {
  const project = normalizeProject(projectValue)
  const volumeKey = text(volumeId, 100)
  const volumeIndex = project.volumes.findIndex(volume => volume.id === volumeKey)
  if (volumeIndex < 0) throw new Error(`unknown volume '${volumeKey}'`)
  const chapterKey = id(chapterId, 'chapter', project.volumes[volumeIndex].chapters.length)
  const patch = isPlainObject(patchValue) ? patchValue : {}
  if (Object.keys(patch).length === 0) throw new Error('chapter patch must not be empty')
  const volumes = [...project.volumes]
  const chapters = [...volumes[volumeIndex].chapters]
  const chapterIndex = chapters.findIndex(chapter => chapter.id === chapterKey)
  const current = chapterIndex >= 0 ? chapters[chapterIndex] : { ...defaultChapter(), id: chapterKey }
  const next = {
    ...current,
    ...patch,
    id: chapterKey,
    customFields: mergeCustomFields(current.customFields, patch.customFields),
  }
  if (chapterIndex >= 0) chapters[chapterIndex] = next
  else chapters.push(next)
  volumes[volumeIndex] = { ...volumes[volumeIndex], chapters }
  const candidate = { ...project, volumes }
  assertProjectShape(candidate, { partial: false })
  return normalizeProject(candidate)
}

export function removeChapter(projectValue, volumeId, chapterId) {
  const project = normalizeProject(projectValue)
  const volumeIndex = project.volumes.findIndex(volume => volume.id === text(volumeId, 100))
  if (volumeIndex < 0) throw new Error(`unknown volume '${text(volumeId, 100)}'`)
  const volumes = [...project.volumes]
  const chapters = volumes[volumeIndex].chapters.filter(chapter => chapter.id !== text(chapterId, 100))
  if (chapters.length === volumes[volumeIndex].chapters.length) throw new Error(`unknown chapter '${text(chapterId, 100)}'`)
  volumes[volumeIndex] = { ...volumes[volumeIndex], chapters }
  return normalizeProject({ ...project, volumes })
}

export function reorderChapter(projectValue, volumeId, chapterId, targetIndexValue) {
  const project = normalizeProject(projectValue)
  const volumeIndex = project.volumes.findIndex(volume => volume.id === text(volumeId, 100))
  if (volumeIndex < 0) throw new Error(`unknown volume '${text(volumeId, 100)}'`)
  const volumes = [...project.volumes]
  const chapters = [...volumes[volumeIndex].chapters]
  const sourceIndex = chapters.findIndex(chapter => chapter.id === text(chapterId, 100))
  if (sourceIndex < 0) throw new Error(`unknown chapter '${text(chapterId, 100)}'`)
  const targetIndex = Math.max(0, Math.min(chapters.length - 1, Number.isSafeInteger(targetIndexValue) ? targetIndexValue : sourceIndex))
  const [chapter] = chapters.splice(sourceIndex, 1)
  chapters.splice(targetIndex, 0, chapter)
  volumes[volumeIndex] = { ...volumes[volumeIndex], chapters }
  return normalizeProject({ ...project, volumes })
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

/** Normalize the plugin-owned, per-session /write link table. */
export function normalizeWriteLinkStore(value) {
  const links = {}
  if (value && typeof value === 'object' && value.links && typeof value.links === 'object' && !Array.isArray(value.links)) {
    for (const [sessionId, candidate] of Object.entries(value.links)) {
      const key = String(sessionId).trim()
      const link = normalizeWriteLink(candidate)
      if (key && link) links[key] = link
    }
  }
  return { version: WRITE_LINK_STORE_VERSION, links }
}

export function writeLinkForSession(store, sessionId) {
  const key = String(sessionId ?? '').trim()
  if (!key) return null
  if (!store || typeof store !== 'object' || !store.links || typeof store.links !== 'object') return null
  return normalizeWriteLink(store.links[key])
}

export function updateWriteLinkStore(store, sessionId, nextValue) {
  const key = String(sessionId ?? '').trim()
  if (!key) throw new TypeError('sessionId must be a non-empty string')
  const current = normalizeWriteLinkStore(store)
  const links = { ...current.links }
  if (nextValue === null) {
    delete links[key]
  } else {
    const link = normalizeWriteLink(nextValue)
    if (!link) throw new TypeError('invalid novel writing task')
    links[key] = link
  }
  return { version: WRITE_LINK_STORE_VERSION, links }
}

function compact(value) {
  return text(value).replace(/\s+/gu, ' ')
}

function add(lines, label, value) {
  const rendered = compact(value)
  if (rendered) lines.push(`- ${label}: ${rendered}`)
}

function addCustomFields(lines, fields) {
  for (const [key, value] of Object.entries(fields || {})) add(lines, key, value)
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
  add(lines, 'Genre profile', project.genreProfile.type)
  addCustomFields(lines, project.genreProfile.customFields)
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
      addCustomFields(details, character.customFields)
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
      const custom = Object.entries(relation.customFields || {}).map(([key, value]) => `${key}: ${compact(value)}`).filter(Boolean).join('; ')
      lines.push(`- ${from} → ${to}${details || custom ? `: ${[details, custom].filter(Boolean).join('; ')}` : ''}`)
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
  if (project.volumes.length > 0) {
    lines.push('', '## Structured outline')
    let remainingChapters = 80
    let outlineTruncated = false
    for (const volume of project.volumes) {
      lines.push(`- Volume ${volume.title || volume.id}${volume.summary ? `: ${compact(volume.summary)}` : ''}`)
      for (const chapter of volume.chapters) {
        if (remainingChapters <= 0) {
          outlineTruncated = true
          break
        }
        const details = [chapter.status, chapter.targetWords ? `${chapter.targetWords} words` : '', compact(chapter.summary), chapter.endingHook ? `hook: ${compact(chapter.endingHook)}` : ''].filter(Boolean).join('; ')
        lines.push(`  - ${chapter.number || ''} ${chapter.title || chapter.id}${details ? ` — ${details}` : ''}`)
        remainingChapters -= 1
      }
    }
    if (outlineTruncated) lines.push('  - [More chapters omitted; use novel_outline_read with volume_id, offset, and limit.]')
  }
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
    '- Durable canon and story progress must be written back with the novel tools. Use outline/character/relationship tools for targeted changes instead of replacing arrays.',
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
