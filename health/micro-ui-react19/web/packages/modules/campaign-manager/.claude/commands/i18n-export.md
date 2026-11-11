---
description: Draft messages for missing keys and write a review-ready upload payload (never touches the backend)
argument-hint: [--tenant-id <id>] [--translate-to <l1,l2,...>] [--out <file>]
allowed-tools: Bash(command -v digit-i18n:*), Bash(digit-i18n export:*)
---

First run `command -v digit-i18n`. If that fails, stop and tell the user
plainly: "`digit-i18n` isn't installed/linked here yet — set it up first (see
digit-i18n-cli's README), then try again." Don't attempt the real command.

Run `digit-i18n export $ARGUMENTS` from the current module directory.

Report: where the output file was written, how many entries came from
`stage` (developer-authored, `source: "pending"`) versus auto-drafted from
the key name (`source: "drafted"`, always `_needsReview: true`), and any
`--translate-to` locale files it wrote (these are additionally tagged
`_machineTranslated: true` and need even more review than the English
draft).

State plainly that this command never calls the backend — it only writes a
local JSON file. Do not follow up by running `/i18n-apply` yourself; actually
publishing is a deliberate, separate, human-invoked step, never something to
chain automatically after a draft.

If it fails, explain plainly rather than pasting the raw error:
- A per-locale translation failure under `--translate-to` is expected
  behavior, not fatal — the free/unofficial translation endpoint has no SLA.
  Report which locale/entries failed and why, and confirm the rest still
  wrote successfully.
- If `--max-age` triggered an auto-resync that then failed, say so and
  explain the draft may be based on stale local data.
- `"Nothing to export"` is a normal no-op (nothing pending or missing), not
  an error — say so plainly.
