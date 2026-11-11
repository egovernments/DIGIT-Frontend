---
description: Stage a new DIGIT_{MODULE}_{KEY} localization key locally (never touches the backend)
argument-hint: <KEY> --module <PREFIX> --message "<text>" [--locale <l>]
allowed-tools: Bash(command -v digit-i18n:*), Bash(digit-i18n search:*), Bash(digit-i18n stage:*)
---

First run `command -v digit-i18n`. If that fails, stop and tell the user
plainly: "`digit-i18n` isn't installed/linked here yet — set it up first (see
digit-i18n-cli's README), then try again." Don't attempt the real command.

Before staging, run `digit-i18n search "<the message text>"` once first (even
if the user didn't ask for it) to check for an existing key this would
duplicate — `stage` is for genuinely new keys, not ones that already exist
under a different name.

Then run `digit-i18n stage $ARGUMENTS`. `--module <PREFIX>` and
`--message "<text>"` are both required by the CLI itself — if either is
missing from the arguments above, ask the user for it rather than guessing a
module prefix or inventing message text.

Report back: the exact key that was created (`DIGIT_{PREFIX}_{KEY}`), and
whether the command warned about a likely duplicate or nudged toward the
common module for a generic word. Make clear this only writes a local
pending file — nothing has reached the backend.

If it fails, translate the error plainly rather than pasting it raw:
- `"Missing required option: --module <PREFIX>"` / `"--message <text>"` → one
  of the required arguments wasn't provided; ask the user for it directly,
  don't guess a module or invent message text.
- `"Unknown module prefix \"X\". Registered prefixes: ..."` → the `--module`
  value isn't registered in `digit-i18n.config.json`; show the user the
  actual list of registered prefixes the error prints, and ask them to pick
  one (or add a new one to that config file — this command can't do that).
