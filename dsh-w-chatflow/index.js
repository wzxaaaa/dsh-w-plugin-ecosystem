/**
 * dsh-w-chatflow — DeepSeek Harness plugin.
 *
 * Optimizes long assistant streams and optionally defers off-screen
 * chat-history rows via CSS content-visibility. It also publishes a page-local
 * configuration consumed by the client-side streaming optimizer.
 * The row wrapper carries a stable `data-chat-anchor-key` attribute (not a
 * hashed CSS-module class), so this selector survives any product CSS rebuild.
 *
 * The Host half only injects immutable page configuration and CSS. The client
 * half applies a reversible Conversation Definition patch at runtime.
 */

import Schema from '@deepseek-ai/schemastery'
import {
  buildConfigTag, buildStyleTag, injectConfig, injectStyle, normalizeHostConfig,
} from './host-core.js'

export {
  buildConfigTag, buildStyleTag, injectConfig, injectStyle, normalizeHostConfig,
} from './host-core.js'

export const name = 'dsh-w-chatflow'

// Hard dependency: the browser HTTP carrier whose index transform taps we extend.
export const inject = ['webServer']

/**
 * Tunable parameters (no hardcoded magic numbers):
 *   - intrinsicSize: placeholder height for not-yet-rendered rows (`auto` lets
 *     the browser remember the true height after first render).
 *   - enabled: turn every optimization off without uninstalling.
 *   - deferOffscreenRows: opt into CSS content-visibility. Disabled by default
 *     because guessed heights can make upward scrolling jump on tall rows.
 *   - optimizeStreaming: replace accumulated-text visibility scans with
 *     per-block incremental visibility tracking.
 * Override in the profile's cordis.patch.yml:
 *   - id: dsh-w-chatflow
 *     config:
 *       intrinsicSize: 400
 *       deferOffscreenRows: false
 *       optimizeStreaming: true
 */
export const Config = Schema.object({
  intrinsicSize: Schema.number().default(260),
  enabled: Schema.boolean().default(true),
  deferOffscreenRows: Schema.boolean().default(false),
  optimizeStreaming: Schema.boolean().default(true),
})

export function apply(ctx, config) {
  const normalized = normalizeHostConfig(config)
  const configTag = buildConfigTag(normalized)
  const styleTag = normalized.enabled && normalized.deferOffscreenRows
    ? buildStyleTag(normalized.intrinsicSize)
    : null
  ctx.effect(() => ctx.webServer.tapIndex((html) => {
    const configured = injectConfig(html, configTag)
    return styleTag === null ? configured : injectStyle(configured, styleTag)
  }))
}
