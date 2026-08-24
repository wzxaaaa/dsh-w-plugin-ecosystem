/**
 * dsh-w-whale-tail — Core pure module.
 *
 * Pure helpers shared by the Host half (persistence + model tools) and tested
 * independently: lewdness clamping, memory normalization, and the pixel-art
 * data kept as a compatibility export for older callers.
 *
 * No host/client imports: this module is imported by `index.js` and can be
 * imported by unit tests without a running DSH process.
 */

/** Transparent pixel. */
export const P = '.'

/** Legacy pixel-art palette retained for callers of the original core export. */
export const WHALE_PALETTE = {
  H: '#253457', // hair (deep navy)
  h: '#405f91', // hair shade
  l: '#79aee8', // hair highlight
  S: '#f3d5d7', // warm skin
  s: '#d9aeb9', // skin shade
  E: '#4f86c6', // whale fin (outer)
  e: '#b9dcf5', // whale fin (inner)
  B: '#26304d', // eyes
  W: '#ffffff', // eye glint
  C: '#f08fa6', // blush
  M: '#7d405d', // mouth
  T: '#ef8da8', // tongue
  D: '#315a8c', // sailor dress
  d: '#203e68', // dress shade
  A: '#d9efff', // sailor collar
  Q: '#f5cc75', // pendant
  U: '#4a88c7', // whale tail
  u: '#2e679f', // whale tail shade
}

/**
 * 24x24 pixel grid of the whale-girl avatar: blue hair, whale-fin hair clips,
 * large anime eyes, blush, sailor collar, pendant, and a whale-tail silhouette.
 * Every row is exactly 24 characters; `P` is transparent.
 */
export const WHALE_GIRL_ROWS = [
  '........................',
  '....EEE..........EEE....',
  '...EEeE..........EeEE...',
  '..EEeeHHHHHHHHHHHHeeEE..',
  '...EEHHhhhHHHHHHHHHEE...',
  '.....HhhllHHHHHHHHH.....',
  '.....hlhhllhhlhhhlh.....',
  '....HHSShhhShhhSSSlH....',
  '....HHSSSSSSSSSSSSHh....',
  '....HHSSWBSSSSWBSSHH....',
  '....HHsSBBSSSSBBSsHH....',
  '....HHSSBBSSSSBBSSHH....',
  '...HHHCCSSSSSSSSCCHHH...',
  '...HhHHsSSSMMSSSsHHhH...',
  '...HHhHHsSMTTMSsHHhHH...',
  '...HHlHHHsSSSSsHHHlHH...',
  '...HHHH...SSSS...HHHH...',
  '...HhHH.AAAAAAAA.HHhH...',
  '...HHUUUDddQQddDUUUHH...',
  '...HuuU.dDDDDDDd.UuuH...',
  '...uuUH.dDDDDDDd.HUuu...',
  '..uuU...DdDDDDdD...Uuu..',
  '.UUU................UUU.',
  '........................',
]

/** Sanity guard for the legacy avatar export. */
export function validateAvatarRows(rows = WHALE_GIRL_ROWS) {
  if (!Array.isArray(rows) || rows.length !== 24) throw new Error('WHALE_GIRL_ROWS must be a 24-row grid')
  for (const row of rows) {
    if (typeof row !== 'string' || row.length !== 24) throw new Error('every WHALE_GIRL_ROWS entry must be exactly 24 characters')
    for (const ch of row) {
      if (ch !== P && !(ch in WHALE_PALETTE)) throw new Error(`unknown avatar pixel "${ch}"`)
    }
  }
  return true
}

/**
 * SVG path of a classic pixel-style heart in a 24x24 viewBox. Used both as
 * the outline (stroke) and as the clip path for the filling liquid.
 */
export const HEART_PATH = 'M12 21C6 16 1 11 1 6C1 2 4 0 7 0C9 0 11 1 12 3C13 1 15 0 17 0C20 0 23 2 23 6C23 11 18 16 12 21Z'

/** Clamp a value to the 0..100 lewdness range, tolerating numeric strings. */
export function clampLewdness(value) {
  const n = Number(value)
  if (!Number.isFinite(n)) return 0
  return Math.max(0, Math.min(100, Math.round(n)))
}

/** Default state for a conversation that has never been touched. */
export function defaultState(now = Date.now()) {
  return { lewdness: 0, memories: [], updatedAt: now }
}

/**
 * Normalize a loaded persisted value into the canonical state shape; unknown
 * or malformed fields fall back to defaults instead of throwing.
 */
export function normalizeState(raw, now = Date.now()) {
  if (!raw || typeof raw !== 'object') return defaultState(now)
  const lewdness = clampLewdness(raw.lewdness)
  const memories = Array.isArray(raw.memories)
    ? raw.memories
      .filter((m) => m && typeof m === 'object' && typeof m.text === 'string')
      .slice(-512)
      .map((m, index) => ({
        id: typeof m.id === 'string' ? m.id : `m${index}-${now}`,
        at: Number.isFinite(m.at) ? m.at : now,
        text: m.text.slice(0, 2000),
      }))
    : []
  const updatedAt = Number.isFinite(raw.updatedAt) ? raw.updatedAt : now
  return { lewdness, memories, updatedAt }
}

/**
 * Append one memory entry; the newest entry is inserted at the front.
 * Returns a NEW state object (immutable update); the caller persists it.
 */
export function appendMemory(state, text, now = Date.now()) {
  const clean = typeof text === 'string' ? text.trim() : ''
  if (clean.length === 0) throw new Error('memory text must be a non-empty string')
  const current = normalizeState(state, now)
  const entry = {
    id: `m${now}-${Math.random().toString(36).slice(2, 8)}`,
    at: now,
    text: clean.slice(0, 2000),
  }
  return {
    ...current,
    memories: [entry, ...current.memories].slice(0, 512),
    updatedAt: now,
  }
}

/** Human-readable relative timestamp for the memory list. */
export function formatMemoryTime(at, now = Date.now()) {
  if (!Number.isFinite(at)) return ''
  const diff = Math.max(0, now - at)
  const minute = 60_000
  const hour = 60 * minute
  const day = 24 * hour
  if (diff < minute) return '刚刚'
  if (diff < hour) return `${Math.floor(diff / minute)} 分钟前`
  if (diff < day) return `${Math.floor(diff / hour)} 小时前`
  const d = Math.floor(diff / day)
  if (d < 7) return `${d} 天前`
  const date = new Date(at)
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

/** Project a state into the JSON shape sent to the client. */
export function toView(state, now = Date.now()) {
  const current = normalizeState(state, now)
  return {
    lewdness: current.lewdness,
    updatedAt: current.updatedAt,
    memories: current.memories.map((m) => ({ id: m.id, at: m.at, text: m.text, timeLabel: formatMemoryTime(m.at, now) })),
  }
}

export default {
  P,
  WHALE_PALETTE,
  WHALE_GIRL_ROWS,
  HEART_PATH,
  clampLewdness,
  defaultState,
  normalizeState,
  appendMemory,
  formatMemoryTime,
  toView,
  validateAvatarRows,
}
