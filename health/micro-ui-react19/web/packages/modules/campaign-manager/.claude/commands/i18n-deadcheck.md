---
description: Find known keys that are no longer referenced anywhere in code (report only, never deletes)
argument-hint: [--path <glob>] [--max-age <minutes>]
allowed-tools: Bash(command -v digit-i18n:*), Bash(digit-i18n deadcheck:*)
---

First run `command -v digit-i18n`. If that fails, stop and tell the user
plainly: "`digit-i18n` isn't installed/linked here yet — set it up first (see
digit-i18n-cli's README), then try again." Don't attempt the real command.

Run `digit-i18n deadcheck $ARGUMENTS` from the current module directory.

List dead-key candidates grouped by module. Separately surface any
dynamically-built `t(...)` call sites the command found — a key that's
*only* ever referenced dynamically can be wrongly flagged as dead here, so
explicitly tell the user to cross-check those specific call sites before
removing anything.

Never suggest actually deleting a key yourself, and don't edit any source
file to remove one — this command (and this slash command) is a report for
a human to act on, nothing more.

If `--max-age` triggered an auto-resync that then failed, say so plainly and
note that the "dead" list may be based on stale local data as a result.
