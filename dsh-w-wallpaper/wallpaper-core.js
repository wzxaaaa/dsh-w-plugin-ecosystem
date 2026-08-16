export const MIN_PLAYBACK_RATE = 0.25
export const MAX_PLAYBACK_RATE = 4
export const DEFAULT_PLAYBACK_RATE = 1

const IMAGE_EXTENSIONS = new Set(['avif', 'bmp', 'gif', 'jpeg', 'jpg', 'png', 'svg', 'webp'])
const VIDEO_EXTENSIONS = new Set(['m4v', 'mov', 'mp4', 'ogv', 'webm'])

function extensionOf(name) {
  const match = typeof name === 'string' ? name.toLowerCase().match(/\.([a-z0-9]+)$/u) : null
  return match === null ? '' : match[1]
}

export function normalizePlaybackRate(value) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return DEFAULT_PLAYBACK_RATE
  return Math.min(MAX_PLAYBACK_RATE, Math.max(MIN_PLAYBACK_RATE, parsed))
}

export function classifyWallpaper(input) {
  if (!input || typeof input !== 'object') throw new Error('wallpaper file is required')
  const size = Number(input.size)
  if (!Number.isFinite(size) || size <= 0) throw new Error('wallpaper file is empty')
  const type = typeof input.type === 'string' ? input.type.toLowerCase() : ''
  const extension = extensionOf(input.name)
  if (type.startsWith('image/') || IMAGE_EXTENSIONS.has(extension)) return 'image'
  if (type.startsWith('video/') || VIDEO_EXTENSIONS.has(extension)) return 'video'
  throw new Error('wallpaper must be an image or video file')
}
