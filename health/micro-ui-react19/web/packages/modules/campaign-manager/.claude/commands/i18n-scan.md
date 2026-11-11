---
description: Find every key referenced in code that has no translation anywhere (synced or pending)
argument-hint: [--path <glob>] [--max-age <minutes>]
allowed-tools: Bash(command -v digit-i18n:*), Bash(digit-i18n scan:*)
---

First run `command -v digit-i18n`. If that fails, stop and tell the user
plainly: "`digit-i18n` isn't installed/linked here yet — set it up first (see
digit-i18n-cli's README), then try again." Don't attempt the real command.

Run `digit-i18n scan $ARGUMENTS` from the current module directory.

List every missing key with its file:line locations. Separately call out any
dynamically-built `t(...)` call sites the command couldn't resolve — these
are a real coverage gap, not something that was checked and passed.

If anything is missing, suggest running `/i18n-export` next to draft a
review-ready payload for it.

If `--max-age` was passed and triggers an auto-resync that then fails (e.g.
no `.env` configured), the command still shows results from whatever local
data exists but exits non-zero — explain that the results you're showing may
be stale because the refresh attempt itself failed, and say why (from the
printed error), rather than presenting stale results as current.
