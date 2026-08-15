# dsh-w-computer-use

Windows computer-control tools for DeepSeek Harness. Vision is provided by
`dsh-w-vision`.

## Coordinate Contract

Every screen, cursor, mouse, screenshot, and window rectangle uses physical
Windows virtual-desktop pixels:

- No DPI conversion is needed.
- Coordinates returned by `look_at_screen` can be passed directly to mouse
  tools.
- A monitor left of or above the primary monitor can have negative `x` or `y`.
- `screen_layout` reports the virtual desktop and all monitor rectangles.
- `cursor_position` can verify the result of a mouse move.

## Reliability

- Per-monitor DPI awareness v2 with a fallback for older Windows versions.
- Bounds checking with actionable errors.
- `SendInput` for mouse buttons, wheel events, and keyboard shortcuts.
- Interpolated drag movement.
- Clipboard contents are restored after Unicode text insertion.
- Case-insensitive window matching and exact-handle targeting.
- Multi-monitor, click-through safety borders that do not take keyboard focus.
- Serialized controller requests and automatic temporary-directory cleanup.

## Development

Run the non-clicking controller smoke test without installing peer dependencies:

```powershell
node test/controller-smoke.mjs
```

The test reads screen/window state, moves the cursor to its current position,
checks an invalid coordinate, and briefly opens/closes the safety overlay.
