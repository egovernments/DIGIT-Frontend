---
description: Install a warn-only pre-commit hook (lint + scan + export) scoped to the current module
argument-hint: (no arguments — run from inside the module folder you want to scope the hook to)
allowed-tools: Bash(command -v digit-i18n:*), Bash(digit-i18n install-hooks:*)
---

First run `command -v digit-i18n`. If that fails, stop and tell the user
plainly: "`digit-i18n` isn't installed/linked here yet — set it up first (see
digit-i18n-cli's README), then try again." Don't attempt the real command.

Before running anything, confirm with the user that the current directory is
the specific module folder they want the hook scoped to — `install-hooks`
scopes itself to wherever it's run from, and refuses outright if run from
the git repo root itself (that would defeat the point).

Then run `digit-i18n install-hooks`. In your summary, state concretely what
this changed: it set local git config (`core.hooksPath=.githooks`, for this
clone only — not shared by cloning or pulling) and wrote/updated
`.githooks/pre-commit`, scoped to this module's path. Mention that every
other developer working on this module needs to run this same command
themselves once, after pulling.

This hook is warn-only by design — it never blocks a commit, regardless of
what `lint`/`scan`/`export` report when it fires.

If it fails, translate the error plainly:
- `"Could not find a .git directory above the current folder..."` → the
  current directory isn't inside a git repo at all; tell the user to run
  this from inside a real module folder that's part of a git clone.
- `"Refusing to install a hook scoped to the git root itself..."` → the
  current directory *is* the repo's root — tell the user to `cd` into the
  specific module subfolder first, then re-run.
