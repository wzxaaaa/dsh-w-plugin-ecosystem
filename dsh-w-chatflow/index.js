/**
 * dsh-w-chatflow — DeepSeek Harness plugin.
 *
 * Defers off-screen chat-history rows via CSS content-visibility, so opening a
 * long conversation and scrolling pay layout/paint only for the visible rows.
 * The row wrapper carries a stable `data-chat-anchor-key` attribute (not a
 * hashed CSS-module class), so this selector survives any product CSS rebuild.
 *
 * Host-only: taps the web index to inject one global <style>, so it needs no
 * client bundle and works for both `dsh web` and the desktop app.
 */

import Schema from '@deepseek-ai/schemastery'

export const name = 'dsh-w-chatflow'

// Hard dependency: the browser HTTP carrier whose index transform taps we extend.
export const inject = ['webServer']

/**
 * Tunable parameters (no hardcoded magic numbers):
 *   - intrinsicSize: placeholder height for not-yet-rendered rows (`auto` lets
 *     the browser remember the true height after first render).
 *   - enabled: turn the injected CSS off without uninstalling.
 * Override in the profile's cordis.patch.yml:
 *   - id: dsh-w-chatflow
 *     config:
 *       intrinsicSize: 400
 */
export const Config = Schema.object({
  intrinsicSize: Schema.number().default(260),
  enabled: Schema.boolean().default(true),
})

const DEFAULT_INTRINSIC_SIZE = 260
const MIN_INTRINSIC_SIZE = 40
const MAX_INTRINSIC_SIZE = 4000

export function normalizeIntrinsicSize(value) {
  const number = Number(value)
  if (!Number.isFinite(number)) return DEFAULT_INTRINSIC_SIZE
  return Math.max(MIN_INTRINSIC_SIZE, Math.min(MAX_INTRINSIC_SIZE, Math.round(number)))
}

export function buildStyleTag(intrinsicSize) {
  const css = [
    '[data-chat-anchor-key] {',
    '  content-visibility: auto;',
    `  contain-intrinsic-size: auto ${intrinsicSize}px;`,
    '}',
  ].join('\n')
  return `<style data-dsh-w-chatflow>${css}</style>`
}

/** Insert the style immediately after <head>; prepend when there is no <head>. */
export function injectStyle(html, styleTag) {
  if (/<style\b[^>]*\bdata-dsh-w-chatflow\b[^>]*>/iu.test(html)) return html
  const head = /<head\b[^>]*>/iu.exec(html)
  if (head !== null) {
    const after = head.index + head[0].length
    return html.slice(0, after) + styleTag + html.slice(after)
  }
  return styleTag + html
}

export function apply(ctx, config) {
  if (config.enabled === false) return
  const styleTag = buildStyleTag(normalizeIntrinsicSize(config.intrinsicSize))
  // tapIndex returns its own disposer; ctx.effect registers it for cleanup.
  ctx.effect(() => ctx.webServer.tapIndex(html => injectStyle(html, styleTag)))
}
