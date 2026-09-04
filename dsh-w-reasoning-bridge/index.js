/**
 * Host half of dsh-w-reasoning-bridge.
 *
 * The feature deliberately uses the official settings Remote from its Client
 * half. The adapter remains the sole owner of request validation and wire
 * serialization, so no Host request middleware is needed here.
 */

export const name = 'dsh-w-reasoning-bridge'

export function apply() {}
