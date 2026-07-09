# FormConfig Corrector

Validates and auto-fixes HCM FormConfig/FormConfigTemplate JSON with AI-enhanced localization message generation. Supports file-based analysis, live environment correction, cross-environment migration, and schema migration.

## Prerequisites

| Requirement | Version | Purpose |
|-------------|---------|---------|
| Node.js | 18+ | Runtime (uses built-in `fetch` API) |
| npm | comes with Node.js | Installing Claude Code CLI |
| Claude Code CLI | latest | AI-enhanced localization messages (required) |
| Anthropic account | — | Authentication for Claude CLI |
| Git | any | Only needed if pushing to GitHub |

### Step 1: Install Node.js

Download and install from [nodejs.org](https://nodejs.org/) (LTS recommended).

**Windows:** Download the `.msi` installer, run it, and follow the wizard. Ensure "Add to PATH" is checked.

**macOS:**
```bash
brew install node
```

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Verify:
```bash
node --version   # should be v18 or higher
npm --version
```

### Step 2: Install Claude Code CLI

```bash
npm install -g @anthropic-ai/claude-code
```

### Step 3: Authenticate Claude Code CLI

```bash
claude
```

This opens a browser window for Anthropic login. Complete the sign-in, then return to your terminal. The CLI stores credentials locally — you only need to do this once.

To verify authentication works:
```bash
claude -p "Reply OK" --output-format text
```

Should print `OK` or similar response.

### Step 4: Verify Setup

```bash
node setup.js
```

This checks all prerequisites and reports any issues. All items should show `[OK]`.

## Quick Start

```bash
# 1. Verify prerequisites
node setup.js

# 2. Launch the web UI
node corrector.js
```

The server starts on a random port and opens the UI in your default browser.

## Features

### 1. File Mode

Drop a FormConfig JSON file, analyze it, review fixes in a VS Code-style diff view, and download the corrected JSON.

**Accepted input formats:**

```
Single module:           { "name": "REGISTRATION", "project": "MR-DN", "flows": [...] }
MDMS response wrapper:   { "mdms": [{ "data": { "name": "...", "flows": [...] } }] }
Array of modules:        [{ "name": "...", "flows": [...] }, ...]
```

**Steps:**
1. Select **File** mode in the sidebar
2. Drop a JSON file or paste from clipboard
3. Click **Analyze**
4. Review results in 4 tabs: Summary, Localizations, Diff View, Corrected JSON
5. Edit localization messages inline if needed
6. Download corrected JSON or localization sheet

### 2. Online Correct

Connect to a live DIGIT environment, fetch FormConfig records, analyze and fix them, then push fixes and upsert localizations directly.

**Steps:**
1. Select **Online Correct** mode
2. Enter environment URL, credentials, tenant, project, and schema
3. For `FormConfig` schema, provide the Campaign Number
4. Click **Connect & Fetch**
5. Review analysis results (same tabs as File mode)
6. Click **Push Config Fixes** to update configs on the server
7. Click **Upsert Localizations** to push localization messages (batches of 50)
8. Download Localization Sheet for a CSV snapshot

**Localization module naming:**
- FormConfigTemplate: `hcm-base-{module}-{project}` (e.g., `hcm-base-registration-mr-dn`)
- FormConfig: `hcm-{module}-{campaignNumber}` (e.g., `hcm-registration-CMP-2026-06-15-006194`)

### 3. Environment Migration

Migrate FormConfig records from one environment to another (e.g., UAT to Dev).

**Steps:**
1. Select **Migrate Env** mode
2. Fill in Source credentials (URL, user, password, tenant, project, schema)
3. Fill in Target credentials
4. Click **Connect & Fetch Both**
5. Review — the tool shows which modules will be created vs. updated on target
6. Click **Push All to Target** — configs are created/updated and localizations upserted
7. Download Localization Sheet

The tool matches modules by `data.name` to decide create vs. update. Tenant/project references in the config data are automatically replaced.

### 4. Schema Migration

Migrate configs between schemas (e.g., FormConfigTemplate to FormConfig or vice versa) on the same or different environments.

**Steps:**
1. Select **Migrate Schema** mode
2. Fill in Source credentials and select the source schema
3. Fill in Target details (defaults to source if left empty) and select the target schema
4. Click **Connect & Fetch**
5. Review and push

Source localizations are fetched using the source schema's module naming convention and upserted to the target using the target schema's convention.

### 5. Localization Sheet

After any operation, click **Download Localization Sheet** to get a CSV file with all localization codes:

```
Module,Code,Message,Locale
hcm-base-registration-mr-dn,REGISTRATION_HEAD_NAME,Head Name,en_MZ
hcm-base-registration-mr-dn,REGISTRATION_HEAD_AGE,Head Age,en_MZ
```

Opens directly in Excel/Google Sheets.

## Validation Rules

| # | Rule | Description |
|---|------|-------------|
| 1 | Missing `type` | Components with `format` need `type` (TEMPLATE screens get `"template"`) |
| 2 | Missing `fieldName` | Components with `format` need a `fieldName` |
| 3 | Duplicate fieldNames | Renames duplicates within a page/screen (appends suffix) |
| 4 | Missing flow `category` | Flows and pages with content need a `category` |
| 5 | Action properties | `primaryAction`/`secondaryAction` need type, format, fieldName, properties.type |
| 6 | Empty errorMessage | Components with validations need a non-empty `errorMessage` |
| 7 | Validation messages | Empty or hardcoded English messages get replaced with localization codes |
| 8 | Table headers | Generic numbered headers (HEADER_1_LABEL) get descriptive codes derived from cellValue |
| 9 | Icon in properties | Copies component-level `icon` into `properties.icon` |
| 10 | Missing localizations | Collects all text codes and generates smart messages for missing ones |
| 11 | LabelPairList keys | Ensures labelPairList key/label values have localization entries |

## CLI Usage

```bash
# Analyze only
node cli.js --file config.json

# Analyze + fix
node cli.js --file config.json --fix

# Fix with AI-enhanced messages
node cli.js --file config.json --fix --ai claude

# Fix with output to specific file
node cli.js --file config.json --fix --output corrected.json

# Online mode: fetch, fix, upsert
node cli.js --online --url https://unified-uat.digit.org \
  --tenant mz --project MR-DN \
  --user SATYA --pass PASSWORD \
  --fix --upsert-locs --ai claude
```

**CLI flags:**

| Flag | Description |
|------|-------------|
| `--file <path>` | Input JSON file |
| `--fix` | Apply auto-fixes (default: analyze only) |
| `--output <path>` | Write corrected JSON to file |
| `--online` | Use MDMS API mode |
| `--url <url>` | Environment URL |
| `--tenant <id>` | Tenant ID (e.g., `mz`) |
| `--project <code>` | Project code (e.g., `MR-DN`) |
| `--user <username>` | Auth username |
| `--pass <password>` | Auth password |
| `--token <token>` | Auth token (alternative to user/pass) |
| `--module <name>` | Process specific module only |
| `--upsert-locs` | Upsert generated localizations (online mode) |
| `--json` | Output report as JSON |
| `--ai claude` | Use Claude Code CLI for AI-enhanced messages |
| `--ai-key <key>` | Anthropic API key (alternative to CLI) |

## Architecture

```
form-config-corrector/
  corrector.js          Server: HTTP + CORS proxy + Claude CLI bridge
  corrector.html        Web UI: all 4 modes, inline corrector engine
  corrector-engine.js   Core library: 11 validation rules (used by CLI)
  cli.js                CLI interface for offline/online processing
  setup.js              Prerequisites checker + installer
  README.md             This file
```

**Data flow:**
1. Input (file drop, MDMS fetch, or migration fetch)
2. `analyzeAndFix()` runs in-browser (corrector engine)
3. AI enhancement via server -> Claude CLI (`/api/enhance`)
4. Results displayed (Summary, Localizations, Diff, JSON tabs)
5. Optional: push configs via server proxy (`/api/mdms/update` or `/api/mdms/create`)
6. Optional: upsert localizations via server proxy (`/api/loc/upsert`)

The server is stateless — credentials/tokens are held in browser JS only and never persisted. The server acts as a CORS proxy to DIGIT APIs and a bridge to the Claude CLI.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `Claude not found` in status bar | Run `npm install -g @anthropic-ai/claude-code` then `claude` to authenticate |
| `Claude CLI not authenticated` | Run `claude` in terminal, complete browser login, then re-run `node setup.js` |
| `No records found` | Check tenant, project, and schema. FormConfig requires a Campaign Number |
| `Update failed (401)` | Token expired — reconnect to the environment |
| `Upsert failed` | Check tenant ID matches the environment. Localizations are batched in 50s |
| Port already in use | Set a specific port: `PORT=3456 node corrector.js` |
| AI enhancement slow | Claude CLI processes in batches of 30 codes. Large modules may need several batches |
| CORS errors in browser | The tool must be accessed via the Node.js server, not opened as a local file |
