const PLUGIN_ID = 'dsh-w-route-primer'
const PRESET_ID = 'route-primer'
const PRESET_MARKER = '# Managed by dsh-w-route-primer. Manual edits will be replaced.'
const MODULE_MARKER = '// Managed by dsh-w-route-primer. Manual edits will be replaced.'
const EDITOR_PACKAGE = '@deepseek-ai/dsh-tool-str-replace-editor'
const ROUTER_BOOTSTRAP_FILE = 'route-primer-bootstrap.mjs'
const ROUTER_CORE_FILE = 'router-core.mjs'

const EDITOR_PRESET_ROW = [
  '',
  '# RL-shaped editor added by dsh-w-route-primer.',
  '- id: route-primer-str-replace-editor',
  `  name: '${EDITOR_PACKAGE}'`,
].join('\n')

const ROUTER_PRESET_ROW = [
  '',
  '# Task-aware reasoning router derived from dsh-router-standard v0.2.0.',
  '- id: route-primer-router-bootstrap',
  `  name: ./${ROUTER_BOOTSTRAP_FILE}`,
  '  config:',
  '    routerMode: standard',
].join('\n')

function managedPresetComposition(standardComposition) {
  if (typeof standardComposition !== 'string' || standardComposition.trim() === '') {
    throw new Error('standard preset composition is empty')
  }
  const editorRow = standardComposition.includes(EDITOR_PACKAGE) ? '' : EDITOR_PRESET_ROW
  const routerRow = standardComposition.includes(ROUTER_BOOTSTRAP_FILE) ? '' : ROUTER_PRESET_ROW
  return `${PRESET_MARKER}\n${standardComposition.trimEnd()}${editorRow}${routerRow}\n`
}

function managedModuleSource(source) {
  if (typeof source !== 'string' || source.trim() === '') throw new Error('router module source is empty')
  return `${MODULE_MARKER}\n${source.trimStart()}`
}

function managedPresetMetadata() {
  return [
    PRESET_MARKER,
    'name: 路由预热模式',
    'description: 对齐 routing-suite：任务分类、近场引导、模式工具与首工具调用放行；首段 RL 锚点后叠加 w-persona。',
    'order: 2.5',
    '',
  ].join('\n')
}

export {
  EDITOR_PACKAGE,
  EDITOR_PRESET_ROW,
  MODULE_MARKER,
  PLUGIN_ID,
  PRESET_ID,
  PRESET_MARKER,
  ROUTER_BOOTSTRAP_FILE,
  ROUTER_CORE_FILE,
  ROUTER_PRESET_ROW,
  managedModuleSource,
  managedPresetComposition,
  managedPresetMetadata,
}
