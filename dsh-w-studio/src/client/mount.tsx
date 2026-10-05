/** Browser plugin registering Studio as a global application mode. */
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type {} from '@deepseek-ai/dsh-client-ui-layout/client'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar/client'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type {} from '@deepseek-ai/dsh-client-ui-workspace/client'
import type { PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import { StudioController } from './controller.ts'
import { StudioPanel } from './StudioPanel.tsx'
import { zh, en, type StudioKey } from './locales.ts'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** Employee configuration, tasks, and public result handoffs. */
    wStudio: StudioKey
  }
}

/** Services used for global navigation and localized copy. */
export const inject = ['slots', 'locale', 'layout', 'uiWorkspace']
function StudioIcon({ size }: PropsRuntime<'sidebar.panellist'>) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
    <circle cx="9" cy="7" r="3" /><path d="M3 20v-3a6 6 0 0 1 12 0v3M16 4a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 4v2" />
  </svg>
}
/** Register Studio's sidebar entry and main-panel presentation.
 * @param ctx - Browser plugin context.
 */
export function apply(ctx: Context): void {
  const controller = new StudioController()
  ctx.effect(() => ctx.locale.register('wStudio', { zh, en }), 'studio: dictionaries')
  ctx.effect(() => controller.start(), 'studio: public company state')
  const t = ctx.locale.bind('wStudio')
  ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({ name: 'sidebar.panellist', id: 'w-studio', order: 5, label: () => t('title') }, StudioIcon))
  ctx.slots.inject('main', () => ctx.slots.register({ name: 'main', key: 'w-studio', locale: 'wStudio', inject: () => ({
    hooks: { studio: controller }, command: controller.command, refresh: controller.refresh, checkHealth: controller.checkHealth,
    pickDirectory: () => ctx.uiWorkspace.pickDirectory(),
  }) }, StudioPanel))
}
