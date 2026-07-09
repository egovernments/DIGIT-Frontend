# DIGIT Localization Toolchain

Pluggable tooling that catches localization issues at every stage of development: in the editor, on commit, and in pull requests.

## Architecture

```
Developer writes code
        |
        v
+-----------------------------------------------+
| STAGE 1: EDITOR (real-time)                   |
|                                               |
|  ESLint plugin runs on every save.            |
|  Shows warnings for:                          |
|    - Hardcoded strings: <p>Save</p>           |
|    - Raw string keys: t("HCM_SAVE")          |
|    - Bad key naming, duplicates, etc.         |
+-----------------------------------------------+
        |
        v
+-----------------------------------------------+
| STAGE 2: COMMIT (pre-commit hook)             |
|                                               |
|  lint-staged runs ESLint on staged files.     |
|  Detects new keys added to i18nKeyConstants.  |
|  Prints summary (non-blocking):               |
|    "3 new keys detected. Run digit-loc        |
|     generate to create upsert payload."       |
+-----------------------------------------------+
        |
        v
+-----------------------------------------------+
| STAGE 3: PULL REQUEST (GitHub Action)         |
|                                               |
|  Full scan of changed modules.                |
|  Cross-references against DIGIT environment.  |
|  For missing keys:                            |
|    - Generates messages (rule-based)          |
|    - Enhances with Claude AI (if configured)  |
|  Posts PR comment with:                       |
|    - Missing translations table               |
|    - Ready-to-use upsert payload JSON         |
+-----------------------------------------------+
        |
        v
+-----------------------------------------------+
| STAGE 4: CLI (on-demand)                      |
|                                               |
|  digit-loc scan    - Find all t() keys        |
|  digit-loc check   - Cross-ref against env    |
|  digit-loc sync    - Pull translations local  |
|  digit-loc generate - Create upsert payload   |
|  digit-loc dead    - Find unused keys         |
|  digit-loc push    - Upsert to environment    |
+-----------------------------------------------+
```

## Components

### 1. ESLint Plugin (`tools/eslint-plugin-digit-i18n/`)

A zero-config ESLint plugin that adds 5 localization rules. Installs via a `file:` dependency — no npm publishing needed.

```
eslint-plugin-digit-i18n/
  index.js                    Plugin entry, exports rules + recommended config
  rules/
    no-raw-jsx-string.js      Flags <p>Hello</p> and placeholder="Enter"
    require-constant-key.js   Flags t("HCM_X"), requires t(I18N_KEYS.X.Y)
    enforce-key-prefix.js     Key values must match MODULE_ prefix convention
    no-duplicate-value.js     Two constants can't map to the same code string
    prefer-common-key.js      Warns when defining SAVE/CANCEL in a module
  utils/
    jsx-helpers.js            JSX AST helpers for user-facing text detection
    i18n-constants-parser.js  Parser for I18N_KEYS constant files
```

#### Rules

| Rule | Severity | What it catches |
|------|----------|-----------------|
| `no-raw-jsx-string` | warn | `<p>Hello</p>`, `placeholder="Enter"` — hardcoded user-facing text |
| `require-constant-key` | warn | `t("HCM_X")` should be `t(I18N_KEYS.CATEGORY.HCM_X)` |
| `enforce-key-prefix` | warn | Key value in constants must start with module prefix |
| `no-duplicate-value` | error | Same string mapped to multiple constants |
| `prefer-common-key` | warn | SAVE, CANCEL, etc. should come from common module |

#### How it works in VS Code

Once installed, the ESLint extension picks up the rules automatically. Violations appear as inline warnings:

```
                         +---------------------------------------+
  <p>Save Changes</p>   | Warning: Hardcoded string in JSX.     |
  ~~~~~~~~~~~~~~~~~~~~   | Use t() with I18N_KEYS instead.       |
                         | (digit-i18n/no-raw-jsx-string)        |
                         +---------------------------------------+
```

### 2. CLI Tool (`tools/digit-loc/`)

Command-line tool for scanning, checking, and generating localization payloads.

```
digit-loc/
  src/
    index.js              CLI entry with arg parsing
    commands/
      scan.js             Scan module for all t() keys
      check.js            Cross-reference keys against DIGIT env
      sync.js             Pull translations to local JSON files
      generate.js         Create upsert payload from git diff
      dead.js             Find unused keys in constants
      push.js             Upsert payload to DIGIT environment
    parser/
      react-parser.js     Fast regex scanner for t() calls
    ai/
      smart-message.js    Rule-based message generator (Tier 1)
      claude-client.js    Claude AI client - CLI + API modes (Tier 2)
      enhance.js          Batch prompt builder for AI enhancement
    utils/
      digit-client.js     DIGIT localization API client
      output-formatters.js  Table, JSON, GitHub annotation formatters
  hooks/
    new-key-detector.js   Pre-commit hook for new key awareness
  ci/
    action.yml            GitHub composite action
    check-localizations.js  Full CI check script
    example-workflow.yml  Example GitHub Actions workflow
```

#### CLI Commands

```bash
# Scan a module for all localization keys
npx digit-loc scan ./packages/modules/campaign-manager

# Cross-reference keys against a DIGIT environment
npx digit-loc check ./packages/modules/campaign-manager --env https://uat.digit.org

# Pull translations from env to local JSON files
npx digit-loc sync --env https://uat.digit.org --module hcm-base-campaign

# Create upsert payload from git diff (rule-based messages)
npx digit-loc generate --diff HEAD~1

# Create upsert payload with AI-enhanced messages
npx digit-loc generate --diff HEAD~1 --ai

# Find dead/unused keys
npx digit-loc dead ./packages/modules/campaign-manager

# Push a payload to a DIGIT environment
npx digit-loc push --file payload.json --env https://uat.digit.org
```

### 3. Message Generation (Two Tiers)

**Tier 1: Smart-message engine (always runs, no dependencies)**

Parses key names using a domain dictionary of 168+ health campaign terms and 90+ field label mappings. Context-aware: validation keys get error messages, labels get humanized field names.

```
HCM_CAMPAIGN_SAVE_BUTTON          ->  "Save"
HCM_HOUSEHOLD_TOTAL_MEMBERS_LABEL ->  "Household Total Members"
HCM_REGISTRATION_DOB_PLACEHOLDER  ->  "Enter the date of birth"
COMMON_CANCEL                     ->  "Cancel"
```

**Tier 2: Claude AI enhancement (optional)**

Takes rule-based suggestions plus surrounding code context and improves them. Processes in batches of 30 codes. Requires either Claude CLI locally or `ANTHROPIC_API_KEY` in CI.

| Context | Tier 1 (rules) | Tier 2 (AI) |
|---------|----------------|-------------|
| ESLint (editor) | Lint only | No |
| Pre-commit hook | Prints new keys | No |
| CLI `generate` | Always | With `--ai` flag |
| GitHub Action | Always | If `ANTHROPIC_API_KEY` set |

### 4. GitHub Action (`tools/digit-loc/ci/`)

Composite action that runs on pull requests. Scans changed files, generates missing translation suggestions, and posts a PR comment with a ready-to-use upsert payload.

See `ci/example-workflow.yml` for setup.

## Setup

### One-time repo setup

**1. Install the ESLint plugin** (already configured in `web/package.json`):

```bash
cd health/micro-ui-react19/web
npm install
```

This picks up the `file:../../../tools/eslint-plugin-digit-i18n` dependency and the `plugin:digit-i18n/recommended` ESLint config.

**2. Verify it works** — open any `.jsx` file in VS Code. If you add `<p>Test</p>`, you should see a warning from `digit-i18n/no-raw-jsx-string`.

**3. (Optional) Set up CI** — copy `tools/digit-loc/ci/example-workflow.yml` to `.github/workflows/localization-check.yml` and adjust the module name and scan path.

### What developers see

Developers don't need to do anything extra. After `npm install`, the ESLint plugin runs automatically in VS Code. The pre-commit hook runs automatically via husky + lint-staged.

## File Structure

```
DIGIT-Frontend/
  tools/
    eslint-plugin-digit-i18n/   ESLint plugin (5 rules)
    digit-loc/                  CLI tool + hooks + CI action
    form-config-corrector/      Existing FormConfig corrector tool
  health/
    micro-ui-react19/
      web/
        package.json            Updated: plugin dep + eslint config + lint-staged
```

## Problems Addressed

| Problem | Solution |
|---------|----------|
| No naming convention | `enforce-key-prefix` rule enforces MODULE_ prefix |
| Duplicate common keys | `prefer-common-key` warns on SAVE/CANCEL in modules |
| No reuse check | `sync` command creates searchable local JSON files |
| No single source of truth | `sync` creates local `localizations/` folders |
| No enforcement | ESLint + lint-staged + CI action at every stage |
| Missing translations in UI | `check` + CI action catches before merge |
| Dead keys never cleaned | `dead` command finds unused keys |
