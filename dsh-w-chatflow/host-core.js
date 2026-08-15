const DEFAULT_INTRINSIC_SIZE = 260
const MIN_INTRINSIC_SIZE = 40
const MAX_INTRINSIC_SIZE = 4000

export function normalizeIntrinsicSize(value) {
  const number = Number(value)
  if (!Number.isFinite(number)) return DEFAULT_INTRINSIC_SIZE
  return Math.max(MIN_INTRINSIC_SIZE, Math.min(MAX_INTRINSIC_SIZE, Math.round(number)))
}

export function normalizeHostConfig(config = {}) {
  return {
    enabled: config.enabled !== false,
    optimizeStreaming: config.optimizeStreaming !== false,
    // A guessed intrinsic row height can fight Harness scroll anchoring when
    // very tall messages enter the viewport, so this optimization is opt-in.
    deferOffscreenRows: config.deferOffscreenRows === true,
    intrinsicSize: normalizeIntrinsicSize(config.intrinsicSize),
  }
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

/** Build the fail-closed page configuration consumed by client.js. */
export function buildConfigTag(config) {
  const payload = JSON.stringify({
    enabled: config.enabled !== false,
    optimizeStreaming: config.optimizeStreaming !== false,
  }).replaceAll('<', '\\u003c')
  return `<script data-dsh-w-chatflow-config>window.__DSH_W_CHATFLOW__=${payload}</script>`
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

/** Insert client configuration once, adjacent to the other head assets. */
export function injectConfig(html, configTag) {
  if (/<script\b[^>]*\bdata-dsh-w-chatflow-config\b[^>]*>/iu.test(html)) return html
  const head = /<head\b[^>]*>/iu.exec(html)
  if (head !== null) {
    const after = head.index + head[0].length
    return html.slice(0, after) + configTag + html.slice(after)
  }
  return configTag + html
}
