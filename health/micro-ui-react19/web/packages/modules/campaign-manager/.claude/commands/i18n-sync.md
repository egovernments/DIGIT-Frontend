---
description: Pull the latest translations from the backend into the local digit-i18n registry
argument-hint: --modules <m1,m2,...> [--locale <l1,l2,...>] [--tenant-id <id>]
allowed-tools: Bash(command -v digit-i18n:*), Bash(digit-i18n sync:*)
---

First run `command -v digit-i18n`. If that fails (nothing printed / non-zero
exit), stop immediately and tell the user plainly: "`digit-i18n` isn't
installed/linked in this project yet — set it up first (see digit-i18n-cli's
README: `yarn install` + `yarn link` from that project), then try again." Do
not attempt the real command in that case.

Run `digit-i18n sync $ARGUMENTS` from the current directory — this must be the
specific module folder whose `localizations/` registry you want to update
(not the workspace root; `digit-i18n` reads `.env`/`digit-i18n.config.json`
relative to the current working directory).

`--modules` is required (comma-separated real backend module tags, e.g.
`hcm-common,hcm-campaignmanager`) — if it's missing from the arguments above,
ask the user which modules to sync rather than guessing.

After running, summarize: how many keys were synced per module/locale
combination, and call out explicitly any whitespace-duplicate-key groups the
command reports (these are a real, confirmed characteristic of production
data, not a bug).

If it fails, never just paste the raw error — translate it plainly and give
the concrete fix:
- `"DIGIT_API_BASE_URL is not set..."` → `.env` is missing or not filled in.
  Tell them to `cp .env.example .env` in the module folder and fill in the
  backend URL.
- `"No tenantId provided..."` → pass `--tenant-id <id>` in the arguments, or
  set `DIGIT_TENANT_ID` in `.env`.
- A module reported `FAILED` with an `HTTP ###` status → this is a real
  backend/auth/network issue for that specific module, not a bug in the
  command — say which module(s) failed and the exact status/message shown.
- `0 keys` synced for a module with no error → the module's `backendModule`
  tag in `digit-i18n.config.json` is probably wrong; tell them to check it
  against that module's real backend module tag.
