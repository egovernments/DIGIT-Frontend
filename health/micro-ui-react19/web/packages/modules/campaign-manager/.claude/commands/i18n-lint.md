---
description: Check source code for naming-convention violations and likely common-module key duplicates (warn-only)
argument-hint: [--path <glob>] [--strict]
allowed-tools: Bash(command -v digit-i18n:*), Bash(digit-i18n lint:*)
---

First run `command -v digit-i18n`. If that fails, stop and tell the user
plainly: "`digit-i18n` isn't installed/linked here yet — set it up first (see
digit-i18n-cli's README), then try again." Don't attempt the real command.

Run `digit-i18n lint $ARGUMENTS` from the current module directory.

Summarize: files scanned, naming-convention violations (with file:line),
likely duplicates of an existing common-module key, and how many
dynamically-built `t(...)` calls couldn't be checked at all (report this gap
honestly — it's a real, permanent limitation of static scanning, not
something to gloss over).

This is warn-only by default — don't describe any finding as blocking unless
`--strict` was explicitly passed in the arguments above.

If a file is reported as `[skip] ... could not parse (...)`, that's a
genuine syntax/parse issue in that one file (not a tool bug) — name the
specific file and parse error rather than burying it in the summary.
