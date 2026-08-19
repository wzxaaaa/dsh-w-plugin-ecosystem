# Repository Instructions

## Repository scope

- This Git repository and its GitHub remote maintain only the `dsh-w-*` W-series plugins.
- A tracked plugin directory at the repository root must start with `dsh-w-`.
- Root-level repository metadata such as `README.md`, `LICENSE`, `.gitignore`, and `AGENTS.md` may be tracked.
- Never add, stage, commit, or push third-party plugin/source directories, including `dsh-anchored-standard`, `dsh-deep-whale`, or `maid-atelier`.

## Local-only dependencies

- Third-party dependencies needed by the local Harness profile live under `.local-only/`.
- `.local-only/` is intentionally ignored by Git. Do not force-add it and do not move its contents into a tracked directory.
- Do not delete or replace `.local-only/` unless the user explicitly requests it.
- `AI_study` is a legacy workspace, not a source of truth for this repository. When migrating accidental edits from it, compare versions, timestamps, and content, and copy only confirmed `dsh-w-*` changes into the matching tracked plugin directory.

## Commit and push checklist

Before every commit or push:

1. Run `git status --short` and review every changed and untracked path.
2. Confirm every tracked top-level plugin directory starts with `dsh-w-`.
3. Confirm `.local-only/`, `.reasonix/`, profile state, and third-party sources are not staged.
4. Run `git diff --check` and the affected plugin's tests or syntax checks.
5. Stage explicit intended paths; do not blindly include unrelated local files.
6. After pushing, verify the remote branch and confirm no third-party path is tracked.

If a requested commit would violate these rules, stop and explain the conflict instead of uploading the files.
