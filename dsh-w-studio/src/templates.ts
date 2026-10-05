/** Built-in team definitions, seeded once as editable templates. */
import { randomUUID } from 'node:crypto'
import type { Employee, StudioEmployeeId, StudioTemplateId, TeamTemplate, TemplateMember } from './types.ts'

const lean: [string, Employee['engine'], string][] = [
  ['产品负责人', 'codex', '明确用户、目标、范围和验收标准，编写产品文档；为后续岗位交接可执行任务。'],
  ['UI设计师', 'claude', '根据产品文档设计页面、交互和视觉规范，交付可供工程师使用的设计文件。'],
  ['全栈工程师', 'codex', '根据产品和设计文档实现软件，运行构建与相关测试，交付可启动的代码。'],
  ['测试工程师', 'harness', '验证功能与验收标准，复现缺陷，修复授权范围内的问题，交付测试报告。'],
]
const full: [string, Employee['engine'], string][] = [
  ['产品负责人', 'codex', '梳理产品目标、用户流程、需求优先级和验收标准，交付产品文档。'],
  ['技术负责人', 'codex', '定义技术方案、模块分工、数据接口和风险，交付架构与接口文档。'],
  ['UI设计师', 'claude', '设计界面、交互、响应式布局和组件规范，交付设计文件。'],
  ['前端工程师', 'claude', '实现页面和交互，对接接口，验证响应式布局、无障碍和前端构建。'],
  ['后端工程师', 'codex', '实现服务、存储和接口，处理错误路径，运行后端测试。'],
  ['测试工程师', 'harness', '执行功能和集成验收，复现并修复缺陷，交付测试与剩余问题报告。'],
  ['交付负责人', 'harness', '检查交付物、运行方式和测试证据，编写部署说明与交付清单。'],
]
function members(roles: [string, Employee['engine'], string][]): TemplateMember[] {
  return roles.map(([role, engine, responsibilities]) => ({
    name: role, role, responsibilities, engine, model: engine === 'claude' ? 'sonnet' : '', effort: '',
    permission: 'workspace-write', baseURL: '', apiKeyEnv: '', thinkingFormat: 'none', contextWindow: 262_144, maxTokens: 32_768,
  }))
}

/** Fresh employees for one built-in team, used by tests and fixtures.
 * @param kind - Product team or full delivery team.
 * @returns Fresh employees in delivery order.
 */
export function teamTemplate(kind: 'lean' | 'full'): Employee[] {
  return members(kind === 'lean' ? lean : full).map(member => ({ ...member, id: randomUUID() as StudioEmployeeId, cwd: '', enabled: true }))
}
/** Editable copies of the built-in teams for a new or migrated company.
 * @returns Lean and full templates.
 */
export function defaultTemplates(): TeamTemplate[] {
  const createdAt = new Date().toISOString()
  return [
    { id: randomUUID() as StudioTemplateId, name: '精简产品团队', description: '4 人：产品、UI 设计、全栈开发、测试', members: members(lean), createdAt },
    { id: randomUUID() as StudioTemplateId, name: '完整研发团队', description: '7 人：产品、技术负责人、UI 设计、前端、后端、测试、交付', members: members(full), createdAt },
  ]
}
