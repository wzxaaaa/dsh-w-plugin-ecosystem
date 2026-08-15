/**
 * dsh-w-easy-upload — Host marker.
 *
 * The working half is browser-side: it intercepts the conversation's draft
 * image submission, asks dsh-w-vision to describe the images, and sends the
 * primary model text-only context. This no-op Host entry gives the package a
 * normal DSH bundle lifecycle and inventory row.
 */

export const name = 'dsh-w-easy-upload'

export function apply() {
  // Browser client owns the behavior.
}

export default apply
