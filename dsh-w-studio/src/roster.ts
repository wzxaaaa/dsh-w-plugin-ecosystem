/** Browser-safe roster rules shared by the Host commands and the UI previews. */
import type { Employee, StudioState, TeamTemplate, TemplateMember } from './types.ts'

/** Whether an employee is referenced by tasks or meetings and therefore can only be disabled.
 * @param state - Company records.
 * @param id - Employee identity.
 * @returns True when deleting would orphan history.
 */
export function hasHistory(state: Pick<StudioState, 'tasks' | 'meetings'>, id: string): boolean {
  return state.tasks.some(task => task.employeeId === id)
    || state.meetings.some(meeting => meeting.attendeeIds.some(value => value === id) || meeting.messages.some(message => message.from === id)
      || meeting.minutes?.tasks.some(task => task.employeeId === id) === true)
}
/** Seat identity used to match template members to employees: the same name and role.
 * @param value - Employee or template member.
 * @returns Normalized key.
 */
export function seat(value: Pick<TemplateMember, 'name' | 'role'>): string {
  return `${value.name.trim()}\u0000${value.role.trim()}`
}
/** Effects of replacing the roster with a template. */
export interface TemplatePlan {
  /** Employees matching a member; they stay (and are re-enabled) with their own settings. */
  keep: Employee[]
  /** Members without a matching employee; they are created. */
  add: TemplateMember[]
  /** Other employees without history; they are deleted. */
  remove: Employee[]
  /** Other employees with history; they are disabled. */
  disable: Employee[]
}
/** Compute the replacement: applying the same template twice changes nothing.
 * @param state - Company records.
 * @param template - Team to apply.
 * @returns Per-employee outcome.
 */
export function planTemplate(state: Pick<StudioState, 'employees' | 'tasks' | 'meetings'>, template: Pick<TeamTemplate, 'members'>): TemplatePlan {
  const plan: TemplatePlan = { keep: [], add: [], remove: [], disable: [] }
  const claimed = new Set<string>()
  for (const member of template.members) {
    const match = state.employees.find(employee => !claimed.has(employee.id) && seat(employee) === seat(member))
    if (match) {
      claimed.add(match.id)
      plan.keep.push(match)
    } else plan.add.push(member)
  }
  for (const employee of state.employees) {
    if (claimed.has(employee.id)) continue
    if (hasHistory(state, employee.id)) { if (employee.enabled) plan.disable.push(employee) }
    else plan.remove.push(employee)
  }
  return plan
}
/** The job an employee does; copies differing only in model or effort fill the same job. */
function settings(employee: Employee): string {
  return JSON.stringify([employee.name.trim(), employee.role.trim(), employee.responsibilities.trim(), employee.engine])
}
/** Employees doing the same job as an earlier one and without history, e.g. repeated template additions.
 * @param state - Company records.
 * @returns Safe-to-delete duplicates; the earliest copy, which carries the user's own model choices, stays.
 */
export function redundantEmployees(state: Pick<StudioState, 'employees' | 'tasks' | 'meetings'>): Employee[] {
  const seen = new Set<string>()
  const result: Employee[] = []
  for (const employee of state.employees) {
    const key = settings(employee)
    if (seen.has(key) && !hasHistory(state, employee.id)) result.push(employee)
    seen.add(key)
  }
  return result
}
/** Template member taken from an employee's portable settings.
 * @param employee - Roster record.
 * @returns Member without identity, directory, or enablement.
 */
export function toMember(employee: Employee): TemplateMember {
  const { id: _id, cwd: _cwd, enabled: _enabled, ...member } = employee
  return member
}
