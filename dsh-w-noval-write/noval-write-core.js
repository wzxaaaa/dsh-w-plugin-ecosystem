const MAX_TEXT = 20_000
const MAX_SHORT = 240
const MAX_CHARACTERS = 80
const MAX_RELATIONSHIPS = 240
const MAX_PROGRESS = 500
const MAX_VOLUMES = 40
const MAX_CHAPTERS_PER_VOLUME = 500
const MAX_SCENES_PER_CHAPTER = 100
const MAX_EVENTS_PER_CHAPTER = 200
const MAX_CUSTOM_FIELDS = 100
const MAX_THREADS = 300
const MAX_THREAD_BEATS = 100
const MAX_THREAD_LINKS = 40
const MAX_SYSTEMS = 12
const MAX_TIERS = 60
const MAX_PROGRESSION_TEMPLATES = 100
const MAX_PROGRESSION_RECORDS = 3000

export const SCHEMA_VERSION = 7
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
  'threads',
  'progression',
  'world',
  'plot',
  'scene',
  'progress',
  'notes',
  'styleCorpusId',
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
  'endingHook', 'manuscriptFile', 'scenes', 'customFields',
])
const VOLUME_KEYS = Object.freeze(['id', 'title', 'summary', 'status', 'chapters', 'customFields'])
export const THREAD_KINDS = Object.freeze(['foreshadowing', 'mystery', 'promise', 'chekhov', 'subplot', 'other'])
export const THREAD_IMPORTANCE = Object.freeze(['core', 'major', 'minor'])
export const THREAD_STATUSES = Object.freeze(['open', 'partial', 'resolved', 'dropped'])
const THREAD_TEXT_KEYS = Object.freeze(['title', 'setup', 'truth', 'payoffPlan', 'resolution', 'notes'])
const THREAD_CHAPTER_KEYS = Object.freeze(['plantedChapterId', 'plannedPayoffChapterId', 'resolvedChapterId'])
const THREAD_ENUM_KEYS = Object.freeze({ kind: THREAD_KINDS, importance: THREAD_IMPORTANCE, status: THREAD_STATUSES })
const THREAD_KEYS = Object.freeze([
  'id', ...THREAD_TEXT_KEYS, 'kind', 'importance', 'status', ...THREAD_CHAPTER_KEYS,
  'characterIds', 'knownByIds', 'beats', 'customFields',
])
const THREAD_BEAT_KEYS = Object.freeze(['id', 'chapterId', 'note'])
// Progression systems, for any genre. A book tracks any number of systems
// (修为境界, 炼丹品级, 宗门职位, 位分, 军衔…), each an ordered tier ladder from low
// to high, plus a ledger of per-chapter state changes. A character's standing
// in every system at any chapter is folded from the ledger in outline order,
// so the canon never loses its history. Condition, holdings and revealed
// cards belong to the character, not to one system.
const PROGRESSION_SYSTEM_KEYS = Object.freeze(['id', 'name', 'notes', 'tiers'])
const TIER_KEYS = Object.freeze(['id', 'name', 'stages', 'advance', 'cost', 'gap', 'notes'])
const PROGRESSION_RECORD_KEYS = Object.freeze([
  'id', 'characterId', 'chapterId', 'systemId', 'tierId', 'stage', 'condition', 'conditionSet', 'holdings', 'holdingsSet', 'revealed', 'gained', 'lost', 'note',
])
export const PROGRESSION_TEMPLATE_STORE_VERSION = 1
/** A chapter counts as reached once its status says writing has begun. */
const UNSTARTED_CHAPTER_STATUS = /^(|planned|plan|todo|outline|计划|计划中|待写|未写|未开始|大纲)$/iu
export const THREAD_DUE_SOON_CHAPTERS = 3
export const THREAD_STALE_CHAPTERS = 10

export const NOVEL_TOOL_RETRY_PROTOCOL = Object.freeze([
  'Before every mutation, call novel_read and copy its revision into expected_revision.',
  'project, patch, and scene must be JSON objects, never JSON strings, Markdown, or an outer tool-argument wrapper.',
  'If a novel tool reports INVALID_NOVEL_ARGUMENTS or schema validation fails, call novel_schema, rebuild the arguments to match it, and retry the failed tool once.',
  'Do not claim that data was saved until the mutation tool returns ok: true with a newer revision.',
  'Prefer novel_patch for focused changes. Use novel_write only when every existing project field will be preserved or intentionally replaced.',
  'Use novel_character_patch, novel_relationship_patch, novel_volume_upsert, and novel_chapter_upsert for ID-targeted changes; do not resend whole arrays.',
  'Genre-specific data belongs in customFields as string key/value pairs. Structured long-form outlines belong in volumes[].chapters[], not one long chapterPlan string.',
  'When the user requests a chapter file, call novel_save_chapter with the full prose. Never claim a file exists unless it returns ok: true and verified: true.',
  'When saving prose for an outline chapter, pass volume_id and chapter_id to novel_save_chapter so the outline links the file and tracks its word count.',
  'When the outline contains chapter word targets, novel_save_chapter requires a chapter_id. Always choose the intended chapter with novel_outline_read; never omit chapter linkage or use another tool to bypass its length requirement.',
  'Before drafting a chapter, read that chapter with novel_outline_read, including its detailed outline, scenes and targetWords. Follow its outline rather than substituting a summary. Its targetWords controls this chapter; the project targetWords is the length of the entire book, never a per-chapter fallback.',
  'Meet the chapter target using the plugin manuscript word counter, not a self-estimate: a bare target such as 3000字 means at least 3000 words, a range sets both bounds, and an explicit maximum sets an upper bound. novel_save_chapter rejects prose outside those bounds before writing. Expand or revise the actual prose and retry until it passes; never report an under-length chapter as complete or bypass the check with another file tool.',
  'Foreshadowing, mysteries, and promises live in threads[]. Use novel_threads to see what is due and novel_thread_upsert / novel_thread_remove for targeted changes; chapter references are outline chapter ids.',
  'Books may track one or more progression systems (e.g. 修为境界, 炼丹品级, 宗门职位) in progression.systems, each an ordered tier ladder, lowest first; edit systems with novel_patch. Per-chapter character state lives in progression.records; use novel_progression_read, novel_progression_record and novel_progression_remove. novel_progression_templates lists reusable system templates.',
  'Use novel_search to find earlier details in the written chapters; it returns hits in outline order with chapter labels.',
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

function threadBeatSchema() {
  return {
    type: 'object',
    additionalProperties: false,
    properties: {
      id: { type: 'string' },
      chapterId: { type: 'string', description: 'Outline chapter id where the thread is echoed or reinforced.' },
      note: { type: 'string', required: true },
    },
  }
}

function threadProperties({ requireId }) {
  return {
    ...(requireId ? { id: { type: 'string', required: true } } : {}),
    title: { type: 'string', ...(requireId ? { required: true } : {}), description: 'Short name of the setup, mystery, or promise.' },
    kind: { type: 'string', enum: [...THREAD_KINDS], description: 'foreshadowing, mystery, promise, chekhov (planted object or skill), subplot, or other.' },
    importance: { type: 'string', enum: [...THREAD_IMPORTANCE], description: 'core = main line, major, minor.' },
    status: { type: 'string', enum: [...THREAD_STATUSES], description: 'open, partial (partly revealed), resolved, dropped.' },
    plantedChapterId: { type: 'string', description: 'Outline chapter id where it was planted.' },
    plannedPayoffChapterId: { type: 'string', description: 'Outline chapter id where it should pay off.' },
    resolvedChapterId: { type: 'string', description: 'Outline chapter id where it actually paid off.' },
    setup: { type: 'string', description: 'What the reader is shown when it is planted.' },
    truth: { type: 'string', description: 'The hidden answer or real meaning; never reveal it early.' },
    payoffPlan: { type: 'string', description: 'How the payoff is intended to land.' },
    resolution: { type: 'string', description: 'How it actually paid off.' },
    notes: { type: 'string' },
    characterIds: { type: 'array', items: { type: 'string' }, description: 'Character ids involved in this thread.' },
    knownByIds: { type: 'array', items: { type: 'string' }, description: 'Character ids who already know the truth.' },
    beats: { type: 'array', items: threadBeatSchema(), description: 'Mid-book echoes that keep the thread alive.' },
    customFields: customFieldsSchema(),
  }
}

export function threadPatchToolSchema({ required = true } = {}) {
  return {
    type: 'object',
    ...(required ? { required: true } : {}),
    additionalProperties: false,
    description: 'Partial thread. Omitted fields are preserved; arrays replace the stored array; customFields merge and an empty string deletes a key.',
    properties: threadProperties({ requireId: false }),
  }
}

function tierProperties() {
  return {
    id: { type: 'string', description: 'Stable tier id, unique within its system; defaults to the name.' },
    name: { type: 'string', required: true, description: 'Tier name in the system, e.g. 筑基, 一流高手, 贵人, 上尉.' },
    stages: { type: 'string', description: 'Sub-stages in order, e.g. 初期、中期、后期、圆满.' },
    advance: { type: 'string', description: 'What it takes to rise into this tier.' },
    cost: { type: 'string', description: 'Price, risk or bottleneck of rising.' },
    gap: { type: 'string', description: 'How far this tier stands above the previous one; what beating someone a tier higher needs.' },
    notes: { type: 'string', description: 'Anything else specific to this tier, e.g. lifespan, privileges, obligations.' },
  }
}

function systemProperties() {
  return {
    id: { type: 'string', description: 'Stable system id; defaults to the name.' },
    name: { type: 'string', required: true, description: 'System name, e.g. 修为境界, 炼丹品级, 宗门职位.' },
    notes: { type: 'string', description: 'How the system works overall.' },
    tiers: { type: 'array', description: 'Ordered ladder, lowest tier first.', items: { type: 'object', additionalProperties: false, properties: tierProperties() } },
  }
}

/** One per-chapter progression record; ids reference characters, outline chapters, systems and tiers. */
export function progressionRecordPatchToolSchema({ required = true } = {}) {
  return {
    type: 'object',
    ...(required ? { required: true } : {}),
    additionalProperties: false,
    description: 'Partial progression record. Omitted fields are preserved. systemId + tierId record a rise or fall in one system; condition, holdings and revealed describe the character. holdings is a full snapshot that replaces the previous one.',
    properties: {
      characterId: { type: 'string', description: 'Character id (or unique name).' },
      chapterId: { type: 'string', description: 'Outline chapter id where the change happens.' },
      systemId: { type: 'string', description: 'System id or name the tier or stage belongs to; required with tierId or stage.' },
      tierId: { type: 'string', description: 'Tier id or name within that system the character is in from this chapter on.' },
      stage: { type: 'string', description: 'Sub-stage within the tier, e.g. 中期.' },
      condition: { type: 'string', description: 'Injury, illness, curse, disgrace or other lasting condition from this chapter on; write the recovery when it ends.' },
      conditionSet: { type: 'boolean', description: 'True means condition is a snapshot, including an empty string to clear it. False means no condition change. Explicitly passing condition defaults this marker to true.' },
      holdings: { type: 'string', description: 'Complete snapshot of items, assets, subordinates or resources held after this chapter.' },
      holdingsSet: { type: 'boolean', description: 'True means holdings is a complete snapshot, including an empty string for no holdings. False means no holdings change. Explicitly passing holdings defaults this marker to true.' },
      revealed: { type: 'string', description: 'Hidden cards, abilities or secrets exposed to others in this chapter.' },
      gained: { type: 'string', description: 'What was gained in this chapter.' },
      lost: { type: 'string', description: 'What was spent, lost or destroyed in this chapter.' },
      note: { type: 'string', description: 'Why; required context for a tier drop or a skipped tier.' },
    },
  }
}

function progressionToolSchema() {
  return {
    type: 'object',
    additionalProperties: false,
    description: 'Progression systems, for any genre. enabled turns tracking on; systems lists each ladder; records is the per-chapter state ledger. Arrays replace the stored arrays; omitted keys are preserved.',
    properties: {
      enabled: { type: 'boolean', description: 'Whether this book tracks progression.' },
      systems: { type: 'array', items: { type: 'object', additionalProperties: false, properties: systemProperties() } },
      records: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          properties: {
            ...progressionRecordPatchToolSchema({ required: false }).properties,
            id: { type: 'string' },
            characterId: { type: 'string', required: true },
            chapterId: { type: 'string', required: true },
          },
        },
      },
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
      ...schemaProperties(['title', 'genre', 'premise', 'tone', 'pov', 'targetWords', 'audience', 'contentRating', 'styleGuide', 'constraints', 'styleCorpusId'], false),
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
      threads: {
        type: 'array',
        description: 'Foreshadowing and payoff ledger. Optional in complete projects; omitted threads are preserved by novel_write.',
        items: { type: 'object', additionalProperties: false, properties: threadProperties({ requireId: true }) },
      },
      progression: progressionToolSchema(),
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
    threadPatchSchema: threadPatchToolSchema(),
    threadEnums: { kind: [...THREAD_KINDS], importance: [...THREAD_IMPORTANCE], status: [...THREAD_STATUSES] },
    progressionRecordPatchSchema: progressionRecordPatchToolSchema(),
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
    else if (key === 'holdingsSet' || key === 'conditionSet') {
      if (typeof value[key] !== 'boolean') issues.push(`${path}.${key} must be a boolean; received ${receivedType(value[key])}`)
    } else if (typeof value[key] !== 'string') issues.push(`${path}.${key} must be a string; received ${receivedType(value[key])}`)
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

function validateIdList(value, path, issues) {
  if (!Array.isArray(value)) {
    issues.push(`${path} must be an array of ids; received ${receivedType(value)}`)
    return
  }
  value.forEach((entry, index) => {
    if (typeof entry !== 'string') issues.push(`${path}[${index}] must be a string; received ${receivedType(entry)}`)
  })
}

function validateThread(value, path, issues, { requireId = true } = {}) {
  if (!isPlainObject(value)) {
    issues.push(`${path} must be an object; received ${receivedType(value)}`)
    return
  }
  const allowed = new Set(THREAD_KEYS)
  for (const key of Object.keys(value)) if (!allowed.has(key)) issues.push(`${path}.${key} is not part of the canonical structure`)
  if (requireId && !Object.hasOwn(value, 'id')) issues.push(`${path}.id is required`)
  for (const key of ['id', ...THREAD_TEXT_KEYS, ...THREAD_CHAPTER_KEYS]) {
    if (Object.hasOwn(value, key) && typeof value[key] !== 'string') issues.push(`${path}.${key} must be a string; received ${receivedType(value[key])}`)
  }
  for (const [key, allowedValues] of Object.entries(THREAD_ENUM_KEYS)) {
    if (!Object.hasOwn(value, key)) continue
    if (typeof value[key] !== 'string') issues.push(`${path}.${key} must be a string; received ${receivedType(value[key])}`)
    else if (!allowedValues.includes(value[key])) issues.push(`${path}.${key} must be one of ${allowedValues.join(', ')}`)
  }
  for (const key of ['characterIds', 'knownByIds']) if (Object.hasOwn(value, key)) validateIdList(value[key], `${path}.${key}`, issues)
  if (Object.hasOwn(value, 'beats')) {
    if (!Array.isArray(value.beats)) issues.push(`${path}.beats must be an array; received ${receivedType(value.beats)}`)
    else value.beats.forEach((beat, index) => validateFlexibleRecord(beat, `${path}.beats[${index}]`, THREAD_BEAT_KEYS, ['note'], issues))
  }
  if (Object.hasOwn(value, 'customFields')) validateCustomFields(value.customFields, `${path}.customFields`, issues)
}

function validateTiers(value, path, issues) {
  if (!Array.isArray(value)) {
    issues.push(`${path} must be an array; received ${receivedType(value)}`)
    return
  }
  value.forEach((tier, index) => validateFlexibleRecord(tier, `${path}[${index}]`, TIER_KEYS, ['name'], issues))
}

function validateSystem(value, path, issues) {
  if (!isPlainObject(value)) {
    issues.push(`${path} must be an object; received ${receivedType(value)}`)
    return
  }
  for (const key of Object.keys(value)) if (!PROGRESSION_SYSTEM_KEYS.includes(key)) issues.push(`${path}.${key} is not part of the canonical structure`)
  if (!Object.hasOwn(value, 'name')) issues.push(`${path}.name is required`)
  for (const key of ['id', 'name', 'notes']) {
    if (Object.hasOwn(value, key) && typeof value[key] !== 'string') issues.push(`${path}.${key} must be a string; received ${receivedType(value[key])}`)
  }
  if (Object.hasOwn(value, 'tiers')) validateTiers(value.tiers, `${path}.tiers`, issues)
}

function validateProgression(value, path, issues) {
  if (!isPlainObject(value)) {
    issues.push(`${path} must be an object; received ${receivedType(value)}`)
    return
  }
  for (const key of Object.keys(value)) if (!['enabled', 'systems', 'records'].includes(key)) issues.push(`${path}.${key} is not part of the canonical structure`)
  if (Object.hasOwn(value, 'enabled') && typeof value.enabled !== 'boolean') issues.push(`${path}.enabled must be a boolean; received ${receivedType(value.enabled)}`)
  if (Object.hasOwn(value, 'systems')) {
    if (!Array.isArray(value.systems)) issues.push(`${path}.systems must be an array; received ${receivedType(value.systems)}`)
    else value.systems.forEach((system, index) => validateSystem(system, `${path}.systems[${index}]`, issues))
  }
  if (Object.hasOwn(value, 'records')) {
    if (!Array.isArray(value.records)) issues.push(`${path}.records must be an array; received ${receivedType(value.records)}`)
    else value.records.forEach((record, index) => validateFlexibleRecord(record, `${path}.records[${index}]`, PROGRESSION_RECORD_KEYS, ['characterId', 'chapterId'], issues))
  }
}

/** Report shape problems in a partial progression record before it is applied. */
export function progressionRecordPatchIssues(value) {
  const issues = []
  validateFlexibleRecord(value, 'patch', PROGRESSION_RECORD_KEYS, [], issues)
  if (isPlainObject(value) && Object.hasOwn(value, 'id')) issues.push('patch.id is not allowed; pass record_id instead')
  return issues
}

/** Report shape problems in a partial thread patch before it is applied. */
export function threadPatchIssues(value) {
  const issues = []
  validateThread(value, 'patch', issues, { requireId: false })
  if (isPlainObject(value) && Object.hasOwn(value, 'id')) issues.push('patch.id is not allowed; pass thread_id instead')
  return issues
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
  for (const key of ['title', 'genre', 'premise', 'tone', 'pov', 'targetWords', 'audience', 'contentRating', 'styleGuide', 'constraints', 'notes', 'styleCorpusId']) {
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
        const characterId = isPlainObject(character) ? text(character.id, 100) : ''
        if (name && characterId) names.set(name, [...(names.get(name) || []), characterId])
      }
      const resolveEndpoint = endpoint => ids.has(endpoint) ? endpoint : names.get(endpoint)?.length === 1 ? names.get(endpoint)[0] : ''
      value.relationships.forEach((relationship, index) => {
        if (!isPlainObject(relationship)) return
        const from = text(relationship.fromId, 100)
        const to = text(relationship.toId, 100)
        const fromId = resolveEndpoint(from)
        const toId = resolveEndpoint(to)
        if (from && !fromId) issues.push(`project.relationships[${index}].fromId does not identify a unique character`)
        if (to && !toId) issues.push(`project.relationships[${index}].toId does not identify a unique character`)
        if (fromId && toId && fromId === toId) issues.push(`project.relationships[${index}] must connect two distinct characters`)
      })
    }
  }
  if (Object.hasOwn(value, 'volumes')) {
    if (!Array.isArray(value.volumes)) issues.push(`project.volumes must be an array; received ${receivedType(value.volumes)}`)
    else value.volumes.forEach((volume, index) => validateVolume(volume, `project.volumes[${index}]`, issues))
  }
  if (Object.hasOwn(value, 'threads')) {
    if (!Array.isArray(value.threads)) issues.push(`project.threads must be an array; received ${receivedType(value.threads)}`)
    else value.threads.forEach((thread, index) => validateThread(thread, `project.threads[${index}]`, issues))
  }
  if (Object.hasOwn(value, 'progression')) validateProgression(value.progression, 'project.progression', issues)
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
  if (typeof value !== 'string') return ''
  const normalized = value.trim()
  if (normalized.length > limit) throw new RangeError(`novel text exceeds ${limit} characters; no data was written`)
  return normalized
}

function boundedArray(value, limit, field) {
  if (!Array.isArray(value)) return []
  if (value.length > limit) throw new RangeError(`${field} exceeds ${limit} entries; no data was written`)
  return value
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
    threads: [],
    progression: { enabled: true, systems: [], records: [] },
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
    // Which knowledge-base style corpus this book writes with: '' follows the
    // knowledge base's default, 'none' uses no corpus, anything else is an id.
    styleCorpusId: '',
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
  for (const [rawKey, rawValue] of boundedArray(Object.entries(value), MAX_CUSTOM_FIELDS, 'customFields')) {
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
    dialogueNotes: '', endingHook: '', manuscriptFile: '', scenes: [], customFields: {},
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

function wordTargetError(raw, message) {
  const error = new TypeError(`INVALID_NOVEL_WORD_TARGET: ${message}; received '${raw}'. Use a target such as 3000字, 3000-4000字, 至少3千字 or 最多1.5万字.`)
  error.code = 'INVALID_NOVEL_WORD_TARGET'
  error.rule = raw
  error.retryable = true
  return error
}

const WORD_TARGET_NUMBER = '(?:\\d+(?:\\.\\d+)?(?:[千万kK])?|[零〇一二两三四五六七八九十百千万]+)'
function wordTargetNumber(token, inheritedUnit = '') {
  const arabic = /^(\d+(?:\.\d+)?)([千万kK]?)$/u.exec(token)
  let value
  if (arabic) {
    const unit = arabic[2] || inheritedUnit
    value = Number(arabic[1]) * (unit === '万' ? 10000 : /[千kK]/u.test(unit) ? 1000 : 1)
  } else {
    const digits = { 零: 0, 〇: 0, 一: 1, 二: 2, 两: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9 }
    const units = { 十: 10, 百: 100, 千: 1000, 万: 10000 }
    // Digit-by-digit Chinese spelling is positional, just like 2026. It must
    // not enter the unit parser and accidentally reduce 二〇二六 to its last 6.
    if (![...token].some(char => Object.hasOwn(units, char))) {
      value = Number([...token].map(char => digits[char]).join(''))
      return Number.isSafeInteger(value) && value > 0 ? value : NaN
    }
    let total = 0
    let section = 0
    let digit = 0
    let hasDigit = false
    let lastUnit = 0
    let explicitZero = false
    let previousSmallUnit = Infinity
    for (const char of token) {
      if (Object.hasOwn(digits, char)) {
        const nextDigit = digits[char]
        // Within a unit expression adjacent nonzero digits are malformed;
        // explicit zeros, however, distinguish 三千零五 from 三千五.
        if (hasDigit && digit !== 0 && nextDigit !== 0) return NaN
        digit = nextDigit
        hasDigit = true
        if (digit === 0) explicitZero = true
        continue
      }
      const unit = units[char]
      if (!unit) return NaN
      if (unit === 10000) {
        if (total !== 0) return NaN
        total += (section + (hasDigit ? digit : 0) || 1) * unit
        section = 0
        previousSmallUnit = Infinity
      } else {
        if (unit >= previousSmallUnit) return NaN
        section += (hasDigit ? digit : 1) * unit
        previousSmallUnit = unit
      }
      lastUnit = unit
      digit = 0
      hasDigit = false
      explicitZero = false
    }
    // Common omitted-unit shorthand: 三千五=3500, 一万五=15000,
    // 一千二百三=1230. An explicit zero keeps the literal final units.
    const tail = hasDigit && !explicitZero && lastUnit >= 100 ? digit * (lastUnit / 10) : digit
    value = total + section + tail
  }
  return Number.isSafeInteger(value) && value > 0 ? value : NaN
}

/**
 * Parse an explicit per-chapter target. Bare numbers are minimums, without an
 * invented tolerance or ceiling. null means no chapter rule; nonempty rules
 * that cannot be interpreted fail closed rather than accidentally bypassing it.
 */
export function parseChapterWordTarget(value) {
  const raw = typeof value === 'string' ? value.trim() : value == null ? '' : String(value).trim()
  if (!raw) return null
  let rule = raw.normalize('NFKC').replace(/\s+/gu, '').replace(/(\d),(?=\d{3}(?:\D|$))/gu, '$1')
  rule = rule.replace(/^(?:(?:每章|本章|单章|章节|正文|目标|篇幅|字数|要求)[:：]?)+/u, '')
  const number = WORD_TARGET_NUMBER
  const range = new RegExp(`^(${number})(?:字|words?)?[-~～—–至到](${number})(?:字|words?)?$`, 'iu').exec(rule)
  let minWords = null
  let maxWords = null
  if (range) {
    const sharedUnit = /[千万kK]$/u.exec(range[2])?.[0] || ''
    const rightCoefficient = /^(\d+(?:\.\d+)?)[千万kK]$/u.exec(range[2])
    // A trailing unit is shared by compact coefficients (3-4千), not by
    // an already expressed absolute count (3000-4千 or 15000-2万).
    // Small reversed coefficients stay a reversed range and fail validation;
    // do not reinterpret 4-3千 as an unintended 4-to-3000-word requirement.
    const sharesUnit = rightCoefficient && /^\d+(?:\.\d+)?$/u.test(range[1]) &&
      (Number(range[1]) <= Number(rightCoefficient[1]) || Number(range[1]) < 100)
    const inheritedUnit = sharesUnit ? sharedUnit : ''
    minWords = wordTargetNumber(range[1], inheritedUnit)
    maxWords = wordTargetNumber(range[2])
  } else {
    const minimum = `(?:至少|最少|最低|不少于|不低于|最低不少于|大于等于|>=|≥)`
    const maximum = `(?:最多|至多|最高|不超过|不多于|上限|小于等于|<=|≤)`
    const clauses = rule.split(/[，,；;]/u)
    for (const clause of clauses) {
      let match = new RegExp(`^(${minimum}|${maximum})(${number})(?:字|words?)?$`, 'iu').exec(clause)
      if (match) {
        const amount = wordTargetNumber(match[2])
        if (new RegExp(`^${minimum}$`, 'u').test(match[1])) minWords = Math.max(minWords ?? 0, amount)
        else maxWords = Math.min(maxWords ?? Number.MAX_SAFE_INTEGER, amount)
        continue
      }
      match = new RegExp(`^(${number})(?:字|words?)?(以上|起|以内|以下)?$`, 'iu').exec(clause)
      if (!match || clauses.length > 1) throw wordTargetError(raw, 'the chapter word target is not a supported rule')
      const amount = wordTargetNumber(match[1])
      if (match[2] === '以内' || match[2] === '以下') maxWords = amount
      else minWords = amount
    }
  }
  if ((minWords !== null && !Number.isSafeInteger(minWords)) || (maxWords !== null && !Number.isSafeInteger(maxWords)) ||
      (minWords !== null && minWords <= 0) || (maxWords !== null && maxWords <= 0) ||
      (minWords !== null && maxWords !== null && minWords > maxWords)) {
    throw wordTargetError(raw, 'the target bounds must be positive whole word counts, with minimum no greater than maximum')
  }
  return { raw, minWords, maxWords }
}

/** Never substitute the whole-book project target for an unset chapter target. */
export function chapterWordRequirement(chapter) {
  try {
    return parseChapterWordTarget(chapter?.targetWords)
  } catch (error) {
    error.chapterId = chapter?.id || ''
    error.wordRequirement = { ok: false, chapterId: error.chapterId, rule: error.rule, minWords: null, maxWords: null }
    throw error
  }
}

export function validateChapterWordCount(chapter, actualWords) {
  if (!Number.isSafeInteger(actualWords) || actualWords < 0) throw new TypeError('actualWords must be a nonnegative integer from the plugin manuscript counter')
  let requirement
  try { requirement = chapterWordRequirement(chapter) } catch (error) {
    error.actualWords = actualWords
    error.wordRequirement.actualWords = actualWords
    throw error
  }
  const minWords = requirement?.minWords ?? null
  const maxWords = requirement?.maxWords ?? null
  const under = minWords !== null && actualWords < minWords
  const over = maxWords !== null && actualWords > maxWords
  return { ok: !under && !over, chapterId: chapter?.id || '', rule: requirement?.raw || '', actualWords, minWords, maxWords, missingWords: under ? minWords - actualWords : 0, excessWords: over ? actualWords - maxWords : 0 }
}

/** Throws before a caller writes a manuscript; includes actionable retry data. */
export function assertChapterWordCount(chapter, actualWords) {
  const result = validateChapterWordCount(chapter, actualWords)
  if (result.ok) return result
  const error = new RangeError(`NOVEL_CHAPTER_WORD_COUNT: no manuscript was written. Chapter '${result.chapterId}' requires ${result.rule}; the plugin counted ${actualWords} words. ${result.missingWords ? `Add at least ${result.missingWords} words of actual prose` : `Remove at least ${result.excessWords} words`}, then retry novel_save_chapter with the same chapter_id. Do not bypass the target with an unlinked file.`)
  Object.assign(error, result, { code: 'NOVEL_CHAPTER_WORD_COUNT', retryable: true, wordRequirement: result })
  throw error
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
    events: boundedArray(item.events, MAX_EVENTS_PER_CHAPTER, 'chapter.events').map(event => text(event)).filter(Boolean),
    dialogueNotes: text(item.dialogueNotes),
    endingHook: text(item.endingHook),
    manuscriptFile: text(item.manuscriptFile, MAX_SHORT),
    scenes: boundedArray(item.scenes, MAX_SCENES_PER_CHAPTER, 'chapter.scenes')
      .map((scene, sceneIndex) => normalizeOutlineScene(scene, sceneIndex, characterReferences)),
    customFields: normalizeCustomFields(item.customFields),
  }
}

function normalizeVolume(value, index, characterReferences) {
  const item = isPlainObject(value) ? value : {}
  const chapters = boundedArray(item.chapters, MAX_CHAPTERS_PER_VOLUME, 'volume.chapters')
    .map((chapter, chapterIndex) => normalizeChapter(chapter, chapterIndex, characterReferences))
  return {
    id: id(item.id, 'volume', index),
    title: text(item.title, MAX_SHORT),
    summary: text(item.summary),
    status: text(item.status, MAX_SHORT) || 'planned',
    chapters,
    customFields: normalizeCustomFields(item.customFields),
  }
}

/**
 * Older outlines guaranteed chapter ids only within a volume. Rename every
 * ambiguous chapter, including the first one, so an old bare id cannot quietly
 * become a reference to an arbitrarily chosen volume. Unique existing ids are
 * reserved before generating names, and the result is stable on subsequent reads.
 */
function normalizeOutlineChapterIds(volumes) {
  uniqueIds(volumes)
  const counts = new Map()
  for (const volume of volumes) for (const chapter of volume.chapters) counts.set(chapter.id, (counts.get(chapter.id) || 0) + 1)
  const ambiguousIds = new Set([...counts].filter(([, count]) => count > 1).map(([key]) => key))
  const used = new Set(counts.keys())
  for (const volume of volumes) {
    for (const chapter of volume.chapters) {
      if (!ambiguousIds.has(chapter.id)) continue
      const base = `${volume.id}-${chapter.id}`.slice(0, 100)
      let candidate = base
      let suffix = 2
      while (used.has(candidate)) {
        const tail = `-${suffix++}`
        candidate = base.slice(0, 100 - tail.length) + tail
      }
      chapter.id = candidate
      used.add(candidate)
    }
  }
  return ambiguousIds
}

const AMBIGUOUS_CHAPTER_PREFIX = 'ambiguous:'
export function isAmbiguousChapterReference(value) {
  return typeof value === 'string' && value.startsWith(AMBIGUOUS_CHAPTER_PREFIX)
}

function markAmbiguousChapterReferences(threads, records, ambiguousIds) {
  const resolve = reference => ambiguousIds.has(reference) ? AMBIGUOUS_CHAPTER_PREFIX + reference : reference
  for (const thread of threads) {
    for (const key of THREAD_CHAPTER_KEYS) thread[key] = resolve(thread[key])
    for (const beat of thread.beats) beat.chapterId = resolve(beat.chapterId)
  }
  for (const record of records) record.chapterId = resolve(record.chapterId)
}

export function defaultThread() {
  return {
    id: '', title: '', kind: 'foreshadowing', importance: 'major', status: 'open',
    plantedChapterId: '', plannedPayoffChapterId: '', resolvedChapterId: '',
    setup: '', truth: '', payoffPlan: '', resolution: '', notes: '',
    characterIds: [], knownByIds: [], beats: [], customFields: {},
  }
}

function enumValue(value, allowed, fallback) {
  return typeof value === 'string' && allowed.includes(value.trim()) ? value.trim() : fallback
}

// Chapter references are kept even when the chapter is later deleted, so a
// thread never silently forgets where it was planted; analysis ignores them.
function chapterReference(value) {
  // This reserved prefix contains a colon, which can never occur in a canonical
  // chapter id. Keep unresolved migration references intact until the user
  // selects the intended, now globally unique chapter.
  const raw = text(value, 110)
  if (isAmbiguousChapterReference(raw)) return raw
  return raw ? id(raw, 'chapter', 0) : ''
}

function characterList(value, characterReferences) {
  const ids = []
  for (const entry of boundedArray(value, MAX_THREAD_LINKS, 'thread character links')) {
    const resolved = characterReferences.get(text(entry, MAX_SHORT))
    if (resolved && !ids.includes(resolved)) ids.push(resolved)
  }
  return ids
}

function normalizeThread(value, index, characterReferences) {
  const item = isPlainObject(value) ? value : {}
  const base = defaultThread()
  const beats = boundedArray(item.beats, MAX_THREAD_BEATS, 'thread.beats')
    .map((beat, beatIndex) => {
      const entry = isPlainObject(beat) ? beat : {}
      return { id: id(entry.id, 'beat', beatIndex), chapterId: chapterReference(entry.chapterId), note: text(entry.note) }
    })
    .filter(beat => beat.note !== '' || beat.chapterId !== '')
  const usedBeats = new Set()
  for (const beat of beats) {
    while (usedBeats.has(beat.id)) beat.id = `${beat.id}-x`
    usedBeats.add(beat.id)
  }
  return {
    ...base,
    id: id(item.id, 'thread', index),
    title: text(item.title, MAX_SHORT),
    kind: enumValue(item.kind, THREAD_KINDS, base.kind),
    importance: enumValue(item.importance, THREAD_IMPORTANCE, base.importance),
    status: enumValue(item.status, THREAD_STATUSES, base.status),
    plantedChapterId: chapterReference(item.plantedChapterId),
    plannedPayoffChapterId: chapterReference(item.plannedPayoffChapterId),
    resolvedChapterId: chapterReference(item.resolvedChapterId),
    setup: text(item.setup),
    truth: text(item.truth),
    payoffPlan: text(item.payoffPlan),
    resolution: text(item.resolution),
    notes: text(item.notes),
    characterIds: characterList(item.characterIds, characterReferences),
    knownByIds: characterList(item.knownByIds, characterReferences),
    beats,
    customFields: normalizeCustomFields(item.customFields),
  }
}

function uniqueIds(items) {
  const used = new Set()
  items.forEach((item, index) => {
    let candidate = item.id
    while (used.has(candidate)) candidate = `${candidate}-${index + 1}`
    item.id = candidate
    used.add(candidate)
  })
  return items
}

function normalizeTier(value, index) {
  const item = isPlainObject(value) ? value : {}
  const name = text(item.name, MAX_SHORT)
  return {
    id: id(text(item.id, 100) || name, 'tier', index),
    name,
    stages: text(item.stages, MAX_SHORT),
    advance: text(item.advance),
    cost: text(item.cost),
    gap: text(item.gap),
    notes: text(item.notes),
  }
}

function normalizeTierList(value, field) {
  return uniqueIds(boundedArray(value, MAX_TIERS, field).map(normalizeTier))
}

function normalizeSystem(value, index) {
  const item = isPlainObject(value) ? value : {}
  const name = text(item.name, MAX_SHORT)
  return {
    id: id(text(item.id, 100) || name, 'system', index),
    name,
    notes: text(item.notes),
    tiers: normalizeTierList(item.tiers, 'progression system tiers'),
  }
}

/** Resolve an id-or-unique-name reference; unknown references are kept verbatim (as an id). */
function namedReference(value, items, prefix) {
  const raw = text(value, MAX_SHORT)
  if (!raw) return ''
  const byId = items.find(item => item.id === raw)
  if (byId) return byId.id
  const byName = items.filter(item => item.name === raw)
  return byName.length === 1 ? byName[0].id : id(raw, prefix, 0)
}

function normalizeProgression(value, characterReferences) {
  const input = isPlainObject(value) ? value : {}
  const systems = uniqueIds(boundedArray(input.systems, MAX_SYSTEMS, 'progression.systems').map(normalizeSystem))
  const records = uniqueIds(boundedArray(input.records, MAX_PROGRESSION_RECORDS, 'progression.records').map((record, index) => {
    const item = isPlainObject(record) ? record : {}
    const rawCharacter = text(item.characterId, MAX_SHORT)
    const systemId = namedReference(item.systemId, systems, 'system')
    const system = systems.find(candidate => candidate.id === systemId)
    return {
      id: id(item.id, 'record', index),
      // A record keeps its references even after the character, system or
      // tier is deleted, so the history stays readable; analysis flags them.
      characterId: characterReferences.get(rawCharacter) || id(rawCharacter, 'character', 0),
      chapterId: chapterReference(item.chapterId),
      systemId,
      tierId: namedReference(item.tierId, system ? system.tiers : [], 'tier'),
      stage: text(item.stage, MAX_SHORT),
      condition: text(item.condition),
      conditionSet: Object.hasOwn(item, 'conditionSet') ? item.conditionSet === true : text(item.condition) !== '',
      holdings: text(item.holdings),
      holdingsSet: Object.hasOwn(item, 'holdingsSet') ? item.holdingsSet === true : text(item.holdings) !== '',
      revealed: text(item.revealed),
      gained: text(item.gained),
      lost: text(item.lost),
      note: text(item.note),
    }
  }))
  // On by default; only an explicit false switches tracking off.
  return { enabled: input.enabled !== false, systems, records }
}

export function normalizeProject(value) {
  const input = value && typeof value === 'object' && !Array.isArray(value) ? value : {}
  const base = defaultProject()
  const characters = boundedArray(input.characters, MAX_CHARACTERS, 'characters').map(normalizeCharacter)
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
    characterReferences.set(characters[index].id, characters[index].id)
  }
  for (let index = 0; index < characters.length; index += 1) {
    const source = input.characters[index]
    const rawId = source && typeof source === 'object' ? text(source.id, 100) : ''
    if (rawId && !characterReferences.has(rawId)) characterReferences.set(rawId, characters[index].id)
  }
  for (let index = 0; index < characters.length; index += 1) {
    const source = input.characters[index]
    const rawName = source && typeof source === 'object' ? text(source.name, MAX_SHORT) : ''
    if (rawName && characterNameCounts.get(rawName) === 1 && !characterReferences.has(rawName)) {
      characterReferences.set(rawName, characters[index].id)
    }
  }
  const relationships = boundedArray(input.relationships, MAX_RELATIONSHIPS, 'relationships')
    .map((item, index) => normalizeRelationship(item, index, used, characterReferences))
  const world = input.world && typeof input.world === 'object' && !Array.isArray(input.world) ? input.world : {}
  const plot = input.plot && typeof input.plot === 'object' && !Array.isArray(input.plot) ? input.plot : {}
  const scene = input.scene && typeof input.scene === 'object' && !Array.isArray(input.scene) ? input.scene : {}
  const progress = boundedArray(input.progress, MAX_PROGRESS, 'progress').map(normalizeProgress)
  const threads = boundedArray(input.threads, MAX_THREADS, 'threads')
    .map((thread, index) => normalizeThread(thread, index, characterReferences))
  const volumes = boundedArray(input.volumes, MAX_VOLUMES, 'volumes')
    .map((volume, index) => normalizeVolume(volume, index, characterReferences))
  const ambiguousChapterIds = normalizeOutlineChapterIds(volumes)
  const progression = normalizeProgression(input.progression, characterReferences)
  markAmbiguousChapterReferences(threads, progression.records, ambiguousChapterIds)
  const usedThreads = new Set()
  for (let index = 0; index < threads.length; index += 1) {
    let candidate = threads[index].id
    while (usedThreads.has(candidate)) candidate = `${candidate}-${index + 1}`
    threads[index].id = candidate
    usedThreads.add(candidate)
  }
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
    volumes,
    threads,
    progression,
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
    styleCorpusId: text(input.styleCorpusId, 60),
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

/**
 * Schema 6 wrote `enabled: false` for every book because tracking started
 * off, so that false was never a choice. Data from before schema 7 turns
 * tracking on; from schema 7 on, an explicit false is respected.
 */
function progressionOnForLegacy(project, schemaVersion) {
  if (Number(schemaVersion) >= 7 || !isPlainObject(project) || !isPlainObject(project.progression)) return project
  return { ...project, progression: { ...project.progression, enabled: true } }
}

export function normalizeState(value, now = Date.now()) {
  const input = value && typeof value === 'object' && !Array.isArray(value) ? value : {}
  return {
    schemaVersion: SCHEMA_VERSION,
    revision: Number.isSafeInteger(input.revision) && input.revision >= 0 ? input.revision : 0,
    updatedAt: typeof input.updatedAt === 'string' ? input.updatedAt : new Date(now).toISOString(),
    project: normalizeProject(progressionOnForLegacy(input.project, input.schemaVersion)),
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
    project = progressionOnForLegacy(value.project, value.schemaVersion)
  }
  assertProjectShape(project, { partial: false })
  return normalizeProject(project)
}

/** Merge a model/UI patch without making omitted fields erase canon. */
export function mergeProject(currentValue, patchValue) {
  const current = normalizeProject(currentValue)
  const patch = patchValue && typeof patchValue === 'object' && !Array.isArray(patchValue) ? patchValue : {}
  const next = { ...current }
  for (const key of ['title', 'genre', 'premise', 'tone', 'pov', 'targetWords', 'audience', 'contentRating', 'styleGuide', 'constraints', 'notes', 'styleCorpusId']) {
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
  if (Object.hasOwn(patch, 'threads')) next.threads = patch.threads
  if (isPlainObject(patch.progression)) next.progression = { ...current.progression, ...patch.progression }
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
  assertProjectShape(next, { partial: false })
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
  let chapterKey = id(chapterId, 'chapter', project.volumes[volumeIndex].chapters.length)
  const usedChapterIds = new Set(chapterSequence(project).map(chapter => chapter.id))
  if (!project.volumes[volumeIndex].chapters.some(chapter => chapter.id === chapterKey) && usedChapterIds.has(chapterKey)) {
    if (text(chapterId, 100)) throw threadArgumentError([`chapter id '${chapterKey}' already belongs to another volume; choose a globally unique chapter id`])
    const base = `${volumeKey}-${chapterKey}`.slice(0, 100)
    chapterKey = base
    let suffix = 2
    while (usedChapterIds.has(chapterKey)) {
      const tail = `-${suffix++}`
      chapterKey = base.slice(0, 100 - tail.length) + tail
    }
  }
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

/** Flatten the structured outline into reading order. Expects a normalized project. */
export function chapterSequence(project) {
  const chapters = []
  for (const volume of project.volumes || []) {
    for (const chapter of volume.chapters || []) {
      chapters.push({
        id: chapter.id, index: chapters.length, volumeId: volume.id, volumeTitle: volume.title,
        number: chapter.number, title: chapter.title, status: chapter.status,
      })
    }
  }
  return chapters
}

/** The furthest outline chapter whose status shows that writing has begun, or -1. */
export function currentChapterIndex(chapters) {
  let current = -1
  chapters.forEach((chapter, index) => {
    if (!UNSTARTED_CHAPTER_STATUS.test(String(chapter.status || '').trim())) current = index
  })
  return current
}

export function chapterLabel(chapter) {
  if (!chapter) return ''
  return [chapter.number ? `#${chapter.number}` : '', chapter.title || chapter.id].filter(Boolean).join(' ')
}

const ACTIVE_THREAD_STATUSES = new Set(['open', 'partial'])
export const THREAD_STATE_ORDER = Object.freeze(['overdue', 'due', 'soon', 'unplanned', 'open', 'resolved', 'dropped'])
const IMPORTANCE_ORDER = Object.freeze({ core: 0, major: 1, minor: 2 })

/**
 * Place every thread on the outline timeline: where it was planted, when it
 * is due, how long it has gone without an echo, and whether it is late.
 */
export function analyzeThreads(projectValue) {
  const project = normalizeProject(projectValue)
  const chapters = chapterSequence(project)
  const position = new Map(chapters.map(chapter => [chapter.id, chapter.index]))
  const current = currentChapterIndex(chapters)
  const at = chapterId => (chapterId && position.has(chapterId) ? position.get(chapterId) : -1)
  const counts = { total: project.threads.length, active: 0, overdue: 0, due: 0, soon: 0, unplanned: 0, open: 0, stale: 0, partial: 0, resolved: 0, dropped: 0 }
  const threads = project.threads.map(thread => {
    const plantedIndex = at(thread.plantedChapterId)
    const payoffIndex = at(thread.plannedPayoffChapterId)
    const resolvedIndex = at(thread.resolvedChapterId)
    const beatIndexes = thread.beats.map(beat => at(beat.chapterId)).filter(index => index >= 0)
    const touches = [plantedIndex, ...beatIndexes].filter(index => index >= 0 && (current < 0 || index <= current))
    const lastTouchIndex = touches.length > 0 ? Math.max(...touches) : -1
    const active = ACTIVE_THREAD_STATUSES.has(thread.status)
    let state
    if (!active) state = thread.status
    else if (payoffIndex < 0) state = 'unplanned'
    else if (current < 0) state = 'open'
    else if (payoffIndex < current) state = 'overdue'
    else if (payoffIndex === current) state = 'due'
    else if (payoffIndex - current <= THREAD_DUE_SOON_CHAPTERS) state = 'soon'
    else state = 'open'
    const idleChapters = active && current >= 0 && lastTouchIndex >= 0 ? current - lastTouchIndex : -1
    const stale = idleChapters >= THREAD_STALE_CHAPTERS
    const warnings = []
    const referenced = [thread.plantedChapterId, thread.plannedPayoffChapterId, thread.resolvedChapterId, ...thread.beats.map(beat => beat.chapterId)]
    if (referenced.some(isAmbiguousChapterReference)) warnings.push('ambiguous-chapter')
    if (referenced.some(chapterId => chapterId && !isAmbiguousChapterReference(chapterId) && !position.has(chapterId))) warnings.push('missing-chapter')
    if (plantedIndex >= 0 && payoffIndex >= 0 && payoffIndex < plantedIndex) warnings.push('payoff-before-plant')
    if (thread.status === 'resolved' && !thread.resolvedChapterId) warnings.push('resolved-without-chapter')
    if (active) counts.active += 1
    if (thread.status === 'partial') counts.partial += 1
    counts[state] += 1
    if (stale) counts.stale += 1
    return { id: thread.id, state, active, plantedIndex, payoffIndex, resolvedIndex, lastTouchIndex, idleChapters, stale, warnings }
  })
  return { chapters, currentIndex: current, currentChapter: current >= 0 ? chapters[current] : null, counts, threads }
}

/** Sort key for the ledger: urgency first, then importance, then payoff order. */
export function compareThreadUrgency(left, right, byId) {
  const state = THREAD_STATE_ORDER.indexOf(left.state) - THREAD_STATE_ORDER.indexOf(right.state)
  if (state !== 0) return state
  const importance = (IMPORTANCE_ORDER[byId.get(left.id)?.importance] ?? 1) - (IMPORTANCE_ORDER[byId.get(right.id)?.importance] ?? 1)
  if (importance !== 0) return importance
  const payoff = (left.payoffIndex < 0 ? Infinity : left.payoffIndex) - (right.payoffIndex < 0 ? Infinity : right.payoffIndex)
  if (payoff !== 0 && Number.isFinite(payoff)) return payoff
  return left.plantedIndex - right.plantedIndex
}

/** Everything a writer should keep in mind while drafting one chapter. */
export function threadsForChapter(projectValue, chapterId) {
  const project = normalizeProject(projectValue)
  const insight = analyzeThreads(project)
  const chapter = insight.chapters.find(item => item.id === text(chapterId, 100))
  if (!chapter) throw new Error(`unknown chapter '${text(chapterId, 100)}'`)
  const byId = new Map(project.threads.map(thread => [thread.id, thread]))
  const pick = predicate => insight.threads.filter(predicate).sort((a, b) => compareThreadUrgency(a, b, byId)).map(info => ({ ...byId.get(info.id), insight: info }))
  const index = chapter.index
  return {
    chapter,
    payoffHere: pick(info => info.active && info.payoffIndex === index),
    overdueBefore: pick(info => info.active && info.payoffIndex >= 0 && info.payoffIndex < index),
    dueSoonAfter: pick(info => info.active && info.payoffIndex > index && info.payoffIndex - index <= THREAD_DUE_SOON_CHAPTERS),
    plantedHere: pick(info => info.plantedIndex === index),
    echoedHere: pick(info => byId.get(info.id).beats.some(beat => beat.chapterId === chapter.id)),
    idle: pick(info => info.active && info.stale),
  }
}

function threadArgumentError(lines) {
  const error = new TypeError(['INVALID_NOVEL_ARGUMENTS: no data was written.', ...lines.slice(0, 12).map(line => `- ${line}`)].join('\n'))
  error.code = 'INVALID_NOVEL_ARGUMENTS'
  error.retryable = true
  return error
}

/** Create or patch one thread by stable id, rejecting references the outline does not contain. */
export function upsertThread(projectValue, threadId, patchValue, { addBeat } = {}) {
  const project = normalizeProject(projectValue)
  const patch = isPlainObject(patchValue) ? patchValue : {}
  const beatInput = isPlainObject(addBeat) ? addBeat : null
  if (Object.keys(patch).length === 0 && !beatInput) throw new Error('thread patch must not be empty')
  const issues = threadPatchIssues(patch)
  if (issues.length > 0) throw threadArgumentError([...issues, 'Call novel_schema and rebuild the thread patch, then retry once.'])
  const chapterIds = new Set(chapterSequence(project).map(chapter => chapter.id))
  const names = new Map()
  for (const character of project.characters) if (character.name) names.set(character.name, [...(names.get(character.name) || []), character.id])
  const resolveCharacter = raw => {
    const key = text(raw, MAX_SHORT)
    if (project.characters.some(character => character.id === key)) return key
    return names.get(key)?.length === 1 ? names.get(key)[0] : ''
  }
  const problems = []
  const checkChapter = (raw, field) => {
    const reference = chapterReference(raw)
    if (reference && !chapterIds.has(reference)) problems.push(`${field} '${text(raw, 100)}' is not an outline chapter id; call novel_outline_read`)
  }
  for (const key of THREAD_CHAPTER_KEYS) if (Object.hasOwn(patch, key)) checkChapter(patch[key], key)
  for (const key of ['characterIds', 'knownByIds']) {
    for (const raw of Array.isArray(patch[key]) ? patch[key] : []) {
      if (!resolveCharacter(raw)) problems.push(`${key} entry '${text(raw, MAX_SHORT)}' does not identify a unique character`)
    }
  }
  for (const beat of Array.isArray(patch.beats) ? patch.beats : []) if (isPlainObject(beat)) checkChapter(beat.chapterId, 'beats[].chapterId')
  if (beatInput) {
    checkChapter(beatInput.chapterId, 'add_beat.chapter_id')
    if (!text(beatInput.note)) problems.push('add_beat.note must not be empty')
  }
  if (problems.length > 0) throw threadArgumentError(problems)
  const key = id(threadId, 'thread', project.threads.length)
  const threads = [...project.threads]
  const index = threads.findIndex(thread => thread.id === key)
  if (index < 0 && !text(patch.title, MAX_SHORT)) throw threadArgumentError(['a new thread needs a non-empty title'])
  const current = index >= 0 ? threads[index] : { ...defaultThread(), id: key }
  const next = {
    ...current,
    ...patch,
    id: key,
    customFields: mergeCustomFields(current.customFields, patch.customFields),
  }
  for (const listKey of ['characterIds', 'knownByIds']) {
    if (Array.isArray(patch[listKey])) next[listKey] = patch[listKey].map(resolveCharacter).filter(Boolean)
  }
  if (beatInput) {
    next.beats = [...next.beats, { id: `beat-${next.beats.length + 1}`, chapterId: text(beatInput.chapterId, 100), note: text(beatInput.note) }]
  }
  if (index >= 0) threads[index] = next
  else threads.push(next)
  const candidate = { ...project, threads }
  assertProjectShape(candidate, { partial: false })
  return normalizeProject(candidate)
}

export function removeThread(projectValue, threadId) {
  const project = normalizeProject(projectValue)
  const key = text(threadId, 100)
  const threads = project.threads.filter(thread => thread.id !== key)
  if (threads.length === project.threads.length) throw new Error(`unknown thread '${key}'`)
  return normalizeProject({ ...project, threads })
}

// ── progression systems ─────────────────────────────────────────────────

function isProgressionProject(project) {
  return project.progression.enabled || project.progression.systems.length > 0
}

/** Whether this book tracks progression: switched on, or a system exists. */
export function progressionActive(projectValue) {
  return isProgressionProject(normalizeProject(projectValue))
}

function uniqueCharacterResolver(project) {
  const names = new Map()
  for (const character of project.characters) if (character.name) names.set(character.name, [...(names.get(character.name) || []), character.id])
  return raw => {
    const key = text(raw, MAX_SHORT)
    if (project.characters.some(character => character.id === key)) return key
    return names.get(key)?.length === 1 ? names.get(key)[0] : ''
  }
}

/** Strict id-or-unique-name lookup: '' for empty input, null for unknown. */
function strictReference(raw, items) {
  const key = text(raw, MAX_SHORT)
  if (!key) return ''
  const byId = items.find(item => item.id === key)
  if (byId) return byId.id
  const byName = items.filter(item => item.name === key)
  return byName.length === 1 ? byName[0].id : null
}

function emptyProgressionState(characterId) {
  return { characterId, standings: new Map(), condition: '', holdings: '', revealed: [], changes: [], lastChapterIndex: -1, records: 0 }
}

/**
 * Fold the progression ledger in outline order. Warnings cover the whole
 * ledger; states include only records up to `asOfChapterId` (default: the
 * furthest chapter whose writing has begun, or every record when none has).
 */
export function analyzeProgression(projectValue, { asOfChapterId, characterIds } = {}) {
  const project = normalizeProject(projectValue)
  const chapters = chapterSequence(project)
  const position = new Map(chapters.map(chapter => [chapter.id, chapter.index]))
  let asOfIndex = currentChapterIndex(chapters)
  const asOfKey = text(asOfChapterId, 100)
  if (asOfKey) {
    if (!position.has(asOfKey)) throw new Error(`unknown chapter '${asOfKey}'; call novel_outline_read for chapter ids`)
    asOfIndex = position.get(asOfKey)
  }
  const limit = asOfIndex >= 0 ? asOfIndex : Infinity
  const systems = project.progression.systems
  const systemById = new Map(systems.map(system => [system.id, system]))
  const rankIn = new Map(systems.map(system => [system.id, new Map(system.tiers.map((tier, index) => [tier.id, index]))]))
  const rankOf = record => rankIn.get(record.systemId)?.get(record.tierId)
  const characters = new Map(project.characters.map(character => [character.id, character]))
  const label = index => (index >= 0 && chapters[index] ? chapterLabel(chapters[index]) : '')
  const warnings = []
  const entries = project.progression.records.map((record, order) => ({
    record, order, index: position.has(record.chapterId) ? position.get(record.chapterId) : -1,
  }))
  for (const { record, index } of entries) {
    const base = { recordId: record.id, characterId: record.characterId, chapterId: record.chapterId }
    if (index < 0) warnings.push({ code: isAmbiguousChapterReference(record.chapterId) ? 'ambiguous-chapter' : 'missing-chapter', ...base })
    if (!characters.has(record.characterId)) warnings.push({ code: 'missing-character', ...base })
    if (record.systemId && !systemById.has(record.systemId)) warnings.push({ code: 'missing-system', ...base, systemId: record.systemId })
    else if (record.tierId && rankOf(record) === undefined) warnings.push({ code: 'missing-tier', ...base, systemId: record.systemId, tierId: record.tierId })
    if (!record.systemId && (record.tierId || record.stage)) warnings.push({ code: 'tier-without-system', ...base })
  }
  const timeline = entries.filter(entry => entry.index >= 0).sort((a, b) => a.index - b.index || a.order - b.order)
  const lastRank = new Map()
  for (const { record, index } of timeline) {
    const rank = rankOf(record)
    if (rank === undefined) continue
    const key = `${record.characterId}\u0000${record.systemId}`
    const previous = lastRank.get(key)
    lastRank.set(key, rank)
    if (previous === undefined || record.note) continue
    const tiers = systemById.get(record.systemId).tiers
    const base = { recordId: record.id, characterId: record.characterId, chapterId: record.chapterId, chapter: label(index), systemId: record.systemId }
    if (rank < previous) warnings.push({ code: 'tier-regression', ...base, from: tiers[previous].name, to: tiers[rank].name })
    else if (rank > previous + 1) warnings.push({ code: 'tier-skip', ...base, from: tiers[previous].name, to: tiers[rank].name })
  }
  const states = new Map()
  for (const { record, index } of timeline) {
    if (index > limit) break
    const state = states.get(record.characterId) || emptyProgressionState(record.characterId)
    states.set(record.characterId, state)
    if (record.systemId && record.tierId) {
      state.standings.set(record.systemId, { tierId: record.tierId, stage: record.stage })
    } else if (record.systemId && record.stage) {
      const standing = state.standings.get(record.systemId) || { tierId: '', stage: '' }
      state.standings.set(record.systemId, { ...standing, stage: record.stage })
    }
    if (record.conditionSet) state.condition = record.condition
    if (record.holdingsSet) state.holdings = record.holdings
    if (record.revealed) state.revealed.push({ chapterId: record.chapterId, chapter: label(index), text: record.revealed })
    if (record.gained || record.lost || record.note) {
      state.changes.push({ chapterId: record.chapterId, chapter: label(index), gained: record.gained, lost: record.lost, note: record.note })
    }
    state.lastChapterIndex = index
    state.records += 1
  }
  const resolve = uniqueCharacterResolver(project)
  const requested = Array.isArray(characterIds) ? characterIds.map(resolve).filter(Boolean) : []
  const ids = requested.length > 0
    ? [...new Set(requested)]
    : [...states.values()].sort((a, b) => b.lastChapterIndex - a.lastChapterIndex).map(state => state.characterId)
  const view = characterId => {
    const state = states.get(characterId) || emptyProgressionState(characterId)
    const standings = []
    // Known systems in their own order, then standings in deleted systems.
    const keys = [...systems.map(system => system.id).filter(systemId => state.standings.has(systemId)),
      ...[...state.standings.keys()].filter(systemId => !systemById.has(systemId))]
    for (const systemId of keys) {
      const standing = state.standings.get(systemId)
      const system = systemById.get(systemId)
      const rank = rankIn.get(systemId)?.get(standing.tierId)
      standings.push({
        systemId,
        system: system ? system.name : systemId,
        tierId: standing.tierId,
        tier: rank !== undefined ? system.tiers[rank].name : standing.tierId,
        rank: rank !== undefined ? rank : -1,
        stage: standing.stage,
      })
    }
    return {
      characterId,
      name: characters.get(characterId)?.name || characterId,
      standings,
      condition: state.condition,
      holdings: state.holdings,
      revealed: state.revealed,
      recentChanges: state.changes.slice(-5),
      lastChapter: label(state.lastChapterIndex),
      records: state.records,
    }
  }
  const viewed = ids.map(view)
  const gaps = []
  if (requested.length >= 2) {
    for (const system of systems) {
      const ranked = viewed
        .map(state => ({ characterId: state.characterId, standing: state.standings.find(item => item.systemId === system.id) }))
        .filter(entry => entry.standing && entry.standing.rank >= 0)
        .slice(0, 8)
      for (let left = 0; left < ranked.length; left += 1) {
        for (let right = left + 1; right < ranked.length; right += 1) {
          gaps.push({
            systemId: system.id, system: system.name,
            from: ranked[left].characterId, to: ranked[right].characterId,
            tiers: ranked[left].standing.rank - ranked[right].standing.rank,
          })
        }
      }
    }
  }
  return {
    active: isProgressionProject(project),
    asOf: asOfIndex >= 0 ? chapters[asOfIndex] : null,
    systems: systems.map(system => ({ ...system, tiers: system.tiers.map((tier, index) => ({ ...tier, rank: index })) })),
    states: viewed,
    gaps,
    warnings,
    counts: { systems: systems.length, records: project.progression.records.length, warnings: warnings.length },
  }
}

/**
 * Create or patch one progression record. References must exist: the
 * character, the outline chapter, and (when given) the system and its tier.
 * @returns {{ project, recordId }}
 */
export function upsertProgressionRecord(projectValue, recordIdValue, patchValue) {
  const project = normalizeProject(projectValue)
  const patch = isPlainObject(patchValue) ? patchValue : {}
  if (Object.keys(patch).length === 0) throw new Error('progression record patch must not be empty')
  const issues = progressionRecordPatchIssues(patch)
  if (issues.length > 0) throw threadArgumentError([...issues, 'Call novel_schema and rebuild the record patch, then retry once.'])
  const records = [...project.progression.records]
  const requestedId = text(recordIdValue, 100)
  const index = requestedId ? records.findIndex(record => record.id === requestedId) : -1
  if (requestedId && index < 0) throw new Error(`unknown progression record '${requestedId}'; omit record_id to create a new record`)
  const current = index >= 0 ? records[index] : null
  const next = {
    ...(current || { id: '', characterId: '', chapterId: '', systemId: '', tierId: '', stage: '', condition: '', conditionSet: false, holdings: '', holdingsSet: false, revealed: '', gained: '', lost: '', note: '' }),
    ...patch,
  }
  for (const key of ['condition', 'holdings']) {
    if (Object.hasOwn(patch, key) && !Object.hasOwn(patch, `${key}Set`)) next[`${key}Set`] = true
  }
  const problems = []
  const character = uniqueCharacterResolver(project)(next.characterId)
  if (!character) problems.push(`characterId '${text(next.characterId, MAX_SHORT)}' does not identify a unique character; call novel_read for character ids`)
  const chapterIds = new Set(chapterSequence(project).map(chapter => chapter.id))
  const chapterId = chapterReference(next.chapterId)
  if (!chapterId || !chapterIds.has(chapterId)) problems.push(`chapterId '${text(next.chapterId, 100)}' is not an outline chapter id; call novel_outline_read`)
  const systemId = strictReference(next.systemId, project.progression.systems)
  if (systemId === null) problems.push(`systemId '${text(next.systemId, MAX_SHORT)}' is not a progression system; add it to progression.systems with novel_patch first`)
  const system = systemId ? project.progression.systems.find(item => item.id === systemId) : null
  let tierId = ''
  if (text(next.tierId, MAX_SHORT)) {
    if (!systemId) problems.push('tierId needs systemId: say which progression system the tier belongs to')
    else if (system) {
      tierId = strictReference(next.tierId, system.tiers)
      if (tierId === null) problems.push(`tierId '${text(next.tierId, MAX_SHORT)}' is not a tier of '${system.name}'`)
    }
  }
  if (text(next.stage, MAX_SHORT) && !systemId && systemId !== null) problems.push('stage needs systemId: say which progression system the stage belongs to')
  if (problems.length > 0) throw threadArgumentError(problems)
  let recordId = current ? current.id : ''
  if (!recordId) {
    const used = new Set(records.map(record => record.id))
    let counter = records.length + 1
    while (used.has(`record-${counter}`)) counter += 1
    recordId = `record-${counter}`
  }
  const record = { ...next, id: recordId, characterId: character, chapterId, systemId: systemId || '', tierId: tierId || '' }
  if (index >= 0) records[index] = record
  else records.push(record)
  const candidate = { ...project, progression: { ...project.progression, records } }
  assertProjectShape(candidate, { partial: false })
  return { project: normalizeProject(candidate), recordId }
}

export function removeProgressionRecord(projectValue, recordIdValue) {
  const project = normalizeProject(projectValue)
  const key = text(recordIdValue, 100)
  const records = project.progression.records.filter(record => record.id !== key)
  if (records.length === project.progression.records.length) throw new Error(`unknown progression record '${key}'`)
  return normalizeProject({ ...project, progression: { ...project.progression, records } })
}

// ── progression template library (shared by every book) ────────────────

function stagedTiers(names, stages = '') {
  return names.map(name => ({ id: name, name, stages, advance: '', cost: '', gap: '', notes: '' }))
}

/** Templates shipped with the plugin; users may edit, delete or restore them. */
export function builtInProgressionTemplates() {
  const fourStages = '初期、中期、后期、圆满'
  return [
    {
      id: 'builtin-xiuxian', name: '修仙境界', builtIn: true, description: '经典修仙大境界，每境分初期、中期、后期、圆满。',
      tiers: [{ id: '炼气', name: '炼气', stages: '一层至十三层', advance: '', cost: '', gap: '', notes: '' },
        ...stagedTiers(['筑基', '金丹', '元婴', '化神', '炼虚', '合体', '大乘'], fourStages), ...stagedTiers(['渡劫'])],
    },
    {
      id: 'builtin-wuxia', name: '武侠武学层次', builtIn: true, description: '江湖武者的实力层次。',
      tiers: stagedTiers(['不入流', '三流', '二流', '一流', '绝顶高手', '宗师', '大宗师']),
    },
    {
      id: 'builtin-magic', name: '西幻魔法位阶', builtIn: true, description: '法师的位阶体系。',
      tiers: stagedTiers(['魔法学徒', '初级法师', '中级法师', '高级法师', '大魔导师', '圣阶', '传奇'], '初阶、中阶、高阶'),
    },
    {
      id: 'builtin-esports', name: '网游段位', builtIn: true, description: '竞技游戏的段位，每段分若干小段。',
      tiers: stagedTiers(['青铜', '白银', '黄金', '铂金', '钻石', '大师', '王者'], 'IV、III、II、I'),
    },
    {
      id: 'builtin-harem', name: '后宫位分', builtIn: true, description: '清宫后妃位分，从低到高。',
      tiers: stagedTiers(['答应', '常在', '贵人', '嫔', '妃', '贵妃', '皇贵妃', '皇后']),
    },
    {
      id: 'builtin-military', name: '现代军衔', builtIn: true, description: '陆军军衔，从低到高。',
      tiers: stagedTiers(['列兵', '上等兵', '下士', '中士', '上士', '少尉', '中尉', '上尉', '少校', '中校', '上校', '大校', '少将', '中将', '上将']),
    },
  ]
}

function normalizeTemplate(value, index) {
  const item = isPlainObject(value) ? value : {}
  const name = text(item.name, MAX_SHORT)
  return {
    id: id(item.id, 'template', index),
    name,
    description: text(item.description),
    builtIn: item.builtIn === true,
    tiers: normalizeTierList(item.tiers, 'template tiers'),
  }
}

/** The shared template store; a missing store starts with the built-in templates. */
export function normalizeProgressionTemplates(value) {
  if (!isPlainObject(value) || !Array.isArray(value.templates)) {
    return { version: PROGRESSION_TEMPLATE_STORE_VERSION, templates: builtInProgressionTemplates().map(normalizeTemplate) }
  }
  const templates = uniqueIds(boundedArray(value.templates, MAX_PROGRESSION_TEMPLATES, 'progression templates').map(normalizeTemplate))
  return { version: PROGRESSION_TEMPLATE_STORE_VERSION, templates }
}

/** Create (no id) or replace (existing id) one template. */
export function saveProgressionTemplate(libraryValue, input, { newId } = {}) {
  const library = normalizeProgressionTemplates(libraryValue)
  if (!isPlainObject(input)) throw new TypeError('template must be an object')
  const name = text(input.name, MAX_SHORT)
  if (!name) throw new Error('template name must not be empty')
  if (Object.hasOwn(input, 'tiers')) {
    const issues = []
    validateTiers(input.tiers, 'template.tiers', issues)
    if (issues.length > 0) throw new TypeError(issues.slice(0, 6).join('; '))
  }
  const templates = [...library.templates]
  const key = text(input.id, 100)
  const index = key ? templates.findIndex(template => template.id === key) : -1
  if (key && index < 0) throw new Error(`unknown template '${key}'`)
  if (index < 0 && templates.length >= MAX_PROGRESSION_TEMPLATES) throw new RangeError(`at most ${MAX_PROGRESSION_TEMPLATES} templates`)
  const current = index >= 0 ? templates[index] : null
  const template = normalizeTemplate({
    id: current ? current.id : (text(newId, 100) || `template-${templates.length + 1}`),
    name,
    description: Object.hasOwn(input, 'description') ? input.description : current?.description,
    builtIn: current ? current.builtIn : false,
    tiers: Object.hasOwn(input, 'tiers') ? input.tiers : current?.tiers,
  }, index < 0 ? templates.length : index)
  if (index >= 0) templates[index] = template
  else {
    const used = new Set(templates.map(item => item.id))
    while (used.has(template.id)) template.id = `${template.id}-x`
    templates.push(template)
  }
  return { library: { version: PROGRESSION_TEMPLATE_STORE_VERSION, templates }, template }
}

export function deleteProgressionTemplate(libraryValue, templateId) {
  const library = normalizeProgressionTemplates(libraryValue)
  const key = text(templateId, 100)
  const templates = library.templates.filter(template => template.id !== key)
  if (templates.length === library.templates.length) throw new Error(`unknown template '${key}'`)
  return { version: PROGRESSION_TEMPLATE_STORE_VERSION, templates }
}

/** Put every built-in template back to its shipped version; user templates are kept. */
export function restoreBuiltInProgressionTemplates(libraryValue) {
  const library = normalizeProgressionTemplates(libraryValue)
  const builtIns = builtInProgressionTemplates().map(normalizeTemplate)
  const builtInIds = new Set(builtIns.map(template => template.id))
  const custom = library.templates.filter(template => !builtInIds.has(template.id))
  if (builtIns.length + custom.length > MAX_PROGRESSION_TEMPLATES) {
    throw new RangeError(`Cannot restore built-ins without deleting custom templates: ${custom.length} custom templates plus ${builtIns.length} built-ins exceeds the ${MAX_PROGRESSION_TEMPLATES} template limit. Remove unused custom templates first; no template was changed.`)
  }
  return normalizeProgressionTemplates({ templates: [...builtIns, ...custom] })
}

/** A new book system copied from a template, with an id unique among `existingSystems`. */
export function systemFromTemplate(template, existingSystems = []) {
  const source = normalizeTemplate(template, 0)
  const used = new Set(existingSystems.map(system => system.id))
  let systemId = id(source.name, 'system', existingSystems.length)
  while (used.has(systemId)) systemId = `${systemId}-2`
  return { id: systemId, name: source.name, notes: source.description, tiers: source.tiers.map(tier => ({ ...tier })) }
}

/** Locate one outline chapter; volumeId may be omitted when the chapter id is unique. */
export function findChapter(projectValue, volumeId, chapterId) {
  const project = normalizeProject(projectValue)
  const chapterKey = text(chapterId, 100)
  const volumeKey = text(volumeId, 100)
  const matches = []
  for (const volume of project.volumes) {
    if (volumeKey && volume.id !== volumeKey) continue
    for (const chapter of volume.chapters) if (chapter.id === chapterKey) matches.push({ volume, chapter })
  }
  if (volumeKey && !project.volumes.some(volume => volume.id === volumeKey)) throw new Error(`unknown volume '${volumeKey}'`)
  if (matches.length === 0) throw new Error(`unknown chapter '${chapterKey}'; call novel_outline_read for chapter ids`)
  if (matches.length > 1) throw new Error(`chapter '${chapterKey}' exists in several volumes; pass volume_id`)
  return matches[0]
}

/** Status given to a chapter the first time prose is linked, in the book's own language. */
export function draftedChapterStatus(projectValue) {
  const project = normalizeProject(projectValue)
  const chinese = project.volumes.some(volume => volume.chapters.some(chapter => /\p{Script=Han}/u.test(chapter.status)))
  return chinese ? '初稿' : 'drafted'
}

/**
 * Point an outline chapter at its manuscript file. A file belongs to one
 * chapter, so any other chapter holding it is unlinked. An unstarted chapter
 * moves to `status` (default: drafted) so the ledger knows it was reached.
 */
export function linkChapterManuscript(projectValue, volumeId, chapterId, filename, { status } = {}) {
  const project = normalizeProject(projectValue)
  const { volume, chapter } = findChapter(project, volumeId, chapterId)
  const file = text(filename, MAX_SHORT)
  const nextStatus = text(status, MAX_SHORT)
  const volumes = project.volumes.map(item => ({
    ...item,
    chapters: item.chapters.map(entry => {
      if (item.id === volume.id && entry.id === chapter.id) {
        const started = !UNSTARTED_CHAPTER_STATUS.test(entry.status.trim())
        return {
          ...entry,
          manuscriptFile: file,
          status: nextStatus || (file && !started ? draftedChapterStatus(project) : entry.status),
        }
      }
      return file && entry.manuscriptFile === file ? { ...entry, manuscriptFile: '' } : entry
    }),
  }))
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
    progress: [...current.progress, entry],
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

/**
 * `manuscripts` optionally maps a manuscript filename to its live word count
 * so the outline can show how much of each chapter is written.
 */
export function projectPrompt(projectValue, maxChars = 12_000, { manuscripts } = {}) {
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
        const written = chapter.manuscriptFile
          ? (manuscripts && Number.isFinite(manuscripts.get?.(chapter.manuscriptFile))
            ? `manuscript ${chapter.manuscriptFile} (${manuscripts.get(chapter.manuscriptFile)} words)`
            : `manuscript ${chapter.manuscriptFile}`)
          : ''
        const details = [chapter.status, chapter.targetWords ? `target ${chapter.targetWords} words` : '', written, compact(chapter.summary), chapter.endingHook ? `hook: ${compact(chapter.endingHook)}` : ''].filter(Boolean).join('; ')
        lines.push(`  - ${chapter.number || ''} ${chapter.title || chapter.id}${details ? ` — ${details}` : ''}`)
        remainingChapters -= 1
      }
    }
    if (outlineTruncated) lines.push('  - [More chapters omitted; use novel_outline_read with volume_id, offset, and limit.]')
  }
  if (project.threads.length > 0) {
    const insight = analyzeThreads(project)
    const label = index => (index >= 0 ? chapterLabel(insight.chapters[index]) : '')
    const clip = value => {
      const rendered = compact(value)
      return rendered.length > 160 ? `${rendered.slice(0, 157)}...` : rendered
    }
    const byId = new Map(project.threads.map(thread => [thread.id, thread]))
    const counts = insight.counts
    lines.push('', '## Story threads (foreshadowing ledger)')
    lines.push(`- Current chapter: ${label(insight.currentIndex) || 'not started'}; active ${counts.active}, overdue ${counts.overdue}, due now ${counts.due}, due soon ${counts.soon}, unplanned ${counts.unplanned}, idle ${counts.stale}; resolved ${counts.resolved}, dropped ${counts.dropped}.`)
    const active = insight.threads.filter(info => info.active).sort((a, b) => compareThreadUrgency(a, b, byId))
    for (const info of active.slice(0, 24)) {
      const thread = byId.get(info.id)
      const details = [
        `${thread.kind}/${thread.importance}`,
        thread.status === 'partial' ? 'partly revealed' : '',
        `planted ${label(info.plantedIndex) || '?'}`,
        `payoff ${label(info.payoffIndex) || 'unplanned'}`,
        info.stale ? `no echo for ${info.idleChapters} chapters` : '',
        thread.setup ? `setup: ${clip(thread.setup)}` : '',
        thread.truth ? `truth (hidden until payoff): ${clip(thread.truth)}` : '',
        thread.payoffPlan ? `plan: ${clip(thread.payoffPlan)}` : '',
      ].filter(Boolean).join('; ')
      lines.push(`- [${info.state.toUpperCase()}] ${thread.title || thread.id} (${thread.id}) — ${details}`)
    }
    if (active.length > 24) lines.push('- [More active threads omitted; call novel_threads.]')
  }
  if (isProgressionProject(project)) {
    const clip = (value, limit = 90) => {
      const rendered = compact(value)
      return rendered.length > limit ? `${rendered.slice(0, limit - 3)}...` : rendered
    }
    const insight = analyzeProgression(project)
    lines.push('', '## Progression systems (tier ladders and character state)')
    if (insight.systems.length === 0) {
      lines.push('- No progression system is defined. If the story has ranks, realms or levels worth tracking, you may suggest one once (the panel offers templates); otherwise ignore this.')
    }
    for (const system of insight.systems) {
      lines.push(`- ${system.name} (${system.id})${system.notes ? ` — ${clip(system.notes)}` : ''}; lowest to highest:`)
      for (const tier of system.tiers.slice(0, 30)) {
        const details = [
          tier.stages ? `stages ${clip(tier.stages, 40)}` : '',
          tier.advance ? `advance: ${clip(tier.advance)}` : '',
          tier.cost ? `cost: ${clip(tier.cost)}` : '',
          tier.gap ? `gap: ${clip(tier.gap)}` : '',
        ].filter(Boolean).join('; ')
        lines.push(`  ${tier.rank + 1}. ${tier.name} (${tier.id})${details ? ` — ${details}` : ''}`)
      }
      if (system.tiers.length > 30) lines.push('  - [More tiers omitted; call novel_progression_read.]')
    }
    if (insight.states.length > 0) {
      lines.push(`- Character state as of ${insight.asOf ? chapterLabel(insight.asOf) : 'the latest record'}:`)
      for (const state of insight.states.slice(0, 24)) {
        const details = [
          ...state.standings.map(standing => `${standing.system} ${[standing.tier, standing.stage].filter(Boolean).join(' ') || '?'}`),
          state.condition ? `condition: ${clip(state.condition, 60)}` : '',
          state.holdings ? `holdings: ${clip(state.holdings)}` : '',
          state.revealed.length ? `revealed: ${state.revealed.slice(-4).map(item => `${clip(item.text, 30)}${item.chapter ? ` (${item.chapter})` : ''}`).join(', ')}` : '',
        ].filter(Boolean).join('; ')
        lines.push(`  - ${state.name}: ${details || 'no state yet'}`)
      }
      if (insight.states.length > 24) lines.push('  - [More characters omitted; call novel_progression_read.]')
    }
    if (insight.warnings.length > 0) lines.push(`- Ledger warnings: ${insight.warnings.length} (tier drops or skips without a note, or broken references); call novel_progression_read to review.`)
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
    '- Preserve canon; surface conflicts and ask about material story decisions.',
    '- Use kb_search/kb_read for style; never copy distinctive wording, characters, or plot.',
    '- Draft actual prose; preserve voice, viewpoint, causality and continuity.',
    '- Save full prose with novel_save_chapter. Claim creation only after ok: true and verified: true; report path, bytes, sha256.',
    '- Before drafting, novel_outline_read the chapter detailed outline/scenes/targetWords and follow them; never use whole-book targetWords as a per-chapter fallback.',
    '- With outline targets, novel_save_chapter requires a chapter_id and volume_id.',
    '- Length: 3000字 means at least 3000, no ceiling; ranges obey min/max. Use plugin-counted words. If rejected, expand/revise prose and retry until it passes. No unlinked-file or other-tool bypass.',
    '- Persist canon/progress; use outline/character/relationship tools rather than replacing arrays.',
    ...(project.threads.length > 0 ? ['- Threads: novel_threads(chapter_id) before writing; pay off or reschedule. Afterwards novel_thread_upsert setups/echoes/payoffs; keep truths hidden.'] : []),
    ...(isProgressionProject(project) && project.progression.systems.length > 0 ? [
      '- Progression: novel_progression_read(as_of_chapter_id, character_ids of the cast) before writing; preserve state. Afterwards novel_progression_record changes; drops/skips need notes.',
    ] : []),
    '- Before reusing earlier details, novel_search the prose; prose wins over canon summaries. Fix conflicts.',
    '- Before every mutation, novel_read; pass its exact revision as expected_revision.',
    '- Arguments are direct JSON objects, never strings, Markdown or wrappers.',
    '- Prefer novel_patch. novel_write is complete canon replacement and preserves progress unless replace_progress is true.',
    '- Validation failure: novel_schema, rebuild, retry once. Success requires ok: true and a newer revision.',
    '- changed: false or stop: true: stop tool calls and answer the user.',
    '- novel_write and novel_advance are mutually exclusive per turn; advance only new story events.',
  ].join('\n')
  const facts = lines.join('\n')
  const result = facts + '\n' + protocol
  const limit = Number.isFinite(maxChars) ? Math.max(2_000, Math.floor(maxChars)) : 12_000
  if (result.length <= limit) return result
  const marker = '\n\n[Novel workspace facts truncated; open the right panel for full details.]\n'
  const factBudget = Math.max(0, limit - marker.length - protocol.length)
  return facts.slice(0, factBudget) + marker + protocol
}

const DIFF_SCALAR_KEYS = Object.freeze([
  'title', 'genre', 'premise', 'tone', 'pov', 'targetWords', 'audience', 'contentRating', 'styleGuide', 'constraints', 'notes', 'styleCorpusId',
])
const DIFF_LIST_LABELS = Object.freeze({
  characters: item => item.name || item.id,
  relationships: item => item.label || item.id,
  volumes: item => item.title || item.id,
  chapters: item => [item.number ? `#${item.number}` : '', item.title || (item.number ? '' : item.id)].filter(Boolean).join(' '),
  threads: item => item.title || item.id,
  progressionSystems: item => item.name || item.id,
  progressionRecords: item => [item.characterId, item.chapterId].filter(Boolean).join(' @ ') || item.id,
  progress: item => item.chapter || compactSnippet(item.summary, 24),
})

function compactSnippet(value, limit = 120) {
  const rendered = String(value ?? '').replace(/\s+/gu, ' ').trim()
  return rendered.length > limit ? `${rendered.slice(0, limit - 1)}…` : rendered
}

function flattenChapters(project) {
  return project.volumes.flatMap(volume => volume.chapters.map(chapter => ({ ...chapter, id: `${volume.id}/${chapter.id}` })))
}

function changedFields(before, after, ignore = []) {
  const keys = new Set([...Object.keys(before || {}), ...Object.keys(after || {})])
  return [...keys].filter(key => !ignore.includes(key) && JSON.stringify(before?.[key]) !== JSON.stringify(after?.[key]))
}

/**
 * What changed between two versions of a project, section by section.
 * Record sections report changed fields; list sections report items added,
 * removed, and changed (matched by id). With `detail`, labels and short
 * before/after snippets are included for the history compare view.
 */
export function describeProjectDiff(beforeValue, afterValue, { detail = false } = {}) {
  const before = normalizeProject(beforeValue)
  const after = normalizeProject(afterValue)
  const sections = []
  const scalars = DIFF_SCALAR_KEYS.filter(key => before[key] !== after[key])
  if (scalars.length > 0) {
    sections.push({
      section: 'project', changed: scalars.length, fields: scalars,
      ...(detail ? { values: scalars.map(field => ({ field, before: compactSnippet(before[field]), after: compactSnippet(after[field]) })) } : {}),
    })
  }
  const genreFields = changedFields(before.genreProfile, after.genreProfile)
  if (genreFields.length > 0) sections.push({ section: 'genreProfile', changed: genreFields.length, fields: genreFields })
  for (const key of ['world', 'plot', 'scene']) {
    const fields = changedFields(before[key], after[key])
    if (fields.length === 0) continue
    sections.push({
      section: key, changed: fields.length, fields,
      ...(detail ? { values: fields.map(field => ({ field, before: compactSnippet(before[key][field]), after: compactSnippet(after[key][field]) })) } : {}),
    })
  }
  const lists = {
    characters: [before.characters, after.characters],
    relationships: [before.relationships, after.relationships],
    volumes: [before.volumes, after.volumes],
    chapters: [flattenChapters(before), flattenChapters(after)],
    threads: [before.threads, after.threads],
    progressionSystems: [before.progression.systems, after.progression.systems],
    progressionRecords: [before.progression.records, after.progression.records],
    progress: [before.progress, after.progress],
  }
  for (const [key, [left, right]] of Object.entries(lists)) {
    const label = DIFF_LIST_LABELS[key]
    const leftById = new Map(left.map(item => [item.id, item]))
    const rightById = new Map(right.map(item => [item.id, item]))
    const added = right.filter(item => !leftById.has(item.id))
    const removed = left.filter(item => !rightById.has(item.id))
    const ignore = key === 'volumes' ? ['chapters'] : []
    const changed = right
      .filter(item => leftById.has(item.id))
      .map(item => ({ item, fields: changedFields(leftById.get(item.id), item, ignore) }))
      .filter(entry => entry.fields.length > 0)
    const moved = key === 'chapters' || key === 'volumes' || key === 'progressionSystems'
      ? JSON.stringify(left.map(item => item.id).filter(id => rightById.has(id))) !== JSON.stringify(right.map(item => item.id).filter(id => leftById.has(id)))
      : false
    if (added.length + removed.length + changed.length === 0 && !moved) continue
    sections.push({
      section: key, added: added.length, removed: removed.length, changed: changed.length, ...(moved ? { reordered: true } : {}),
      ...(detail ? {
        addedItems: added.map(label).slice(0, 50),
        removedItems: removed.map(label).slice(0, 50),
        changedItems: changed.slice(0, 50).map(entry => ({ label: label(entry.item), fields: entry.fields })),
      } : {}),
    })
  }
  return sections
}
