/** Browser-only assistant refresh action. */
export const name = 'dsh-w-assistant-refresh'
export const inject = []

/** The client half owns the UI and session branch/replay flow. */
export function apply() {
  // Intentionally empty: the plugin must not mutate Harness source or Host session state.
}
