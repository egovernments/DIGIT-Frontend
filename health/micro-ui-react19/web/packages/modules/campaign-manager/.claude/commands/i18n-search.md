---
description: Fuzzy-search the local digit-i18n registry for an existing key before creating a new one
argument-hint: "<text to search for>" [--module <m>] [--limit <n>]
allowed-tools: Bash(command -v digit-i18n:*), Bash(digit-i18n search:*)
---

First run `command -v digit-i18n`. If that fails, stop and tell the user
plainly: "`digit-i18n` isn't installed/linked here yet — set it up first (see
digit-i18n-cli's README), then try again." Don't attempt the real command.

Run `digit-i18n search $ARGUMENTS` from the current module directory.

Summarize the top matches: module, key, message, and match confidence. Call
out anything tagged `[pending, not yet uploaded]` (staged locally, not live
yet) or flagged with a whitespace-variant duplicate warning.

If nothing is a good match, say so plainly — don't talk the user into reusing
a loose match just to avoid creating a new key. In that case, suggest
`/i18n-stage` for a genuinely new key instead.

If it prints `"No local data found for locale ..."`, that's not an error —
tell the user plainly that nothing has been synced for that locale/module
yet, and point them to `/i18n-sync` first.
