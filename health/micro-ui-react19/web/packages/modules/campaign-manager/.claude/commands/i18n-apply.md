---
description: Preview what `apply` would publish to the real backend — never sends anything from chat
argument-hint: [--to <l1,l2,...>] [--tenant-id <id>]
allowed-tools: Bash(command -v digit-i18n:*), Bash(digit-i18n apply --dry-run:*)
---

First run `command -v digit-i18n`. If that fails, stop and tell the user
plainly: "`digit-i18n` isn't installed/linked here yet — set it up first (see
digit-i18n-cli's README), then try again." Don't attempt the real command.

`apply` is the ONLY digit-i18n command that writes to a real backend. Treat
it with real caution and follow these rules exactly:

1. Always run `digit-i18n apply --dry-run $ARGUMENTS` — regardless of
   whether `--dry-run` or `--yes` appears in the arguments above, force
   `--dry-run` on this invocation. Show the user the full output: every real
   `_upsert` call it would make, for every module/locale.
2. Do **not** run `digit-i18n apply` without `--dry-run` yourself, under any
   circumstances, even if asked to. Actually sending requires a real
   interactive confirmation (and, usually, a fresh login) that only works in
   a real terminal the user is typing into directly — not through this chat.
3. If the user wants to actually publish after reviewing the dry-run output,
   tell them to run the real command themselves in their own terminal, and
   give them the exact command (including their intended `--to`/
   `--tenant-id` flags) to run.
4. If the dry-run shows nothing to apply, say so plainly.

If the dry-run itself fails, translate the error — don't paste it raw:
- `"Missing tenantId. Pass --tenant-id or set DIGIT_TENANT_ID in .env."` →
  neither was provided; ask the user for a tenant id or point them to
  `.env`. (This check happens even under `--dry-run` — it's required before
  anything else runs.)
- A per-entry translation failure under multi-locale `--to` is expected, not
  fatal — report which locale/entries failed and why.
- Any other unexpected error → quote the exact message, and note that since
  this is forced to `--dry-run`, no authentication or network write was
  attempted regardless.

This mirrors the tool's own design rule: `apply` is deliberately a separate,
explicitly human-run step, never something automated — including by an
assistant acting on the user's behalf.
