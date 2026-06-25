# FormConfig Corrector - Setup Guide

A step-by-step guide to get the FormConfig Corrector running on your machine.

## Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Claude Code CLI** - For AI-enhanced localization messages (optional but recommended)

## Installation

### 1. Install Node.js

**Windows:** Download the `.msi` installer from [nodejs.org](https://nodejs.org/), run it, and ensure "Add to PATH" is checked.

**macOS:**
```bash
brew install node
```

**Linux:**
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Verify installation:
```bash
node --version   # v18 or higher
```

### 2. Install Claude Code CLI (optional)

```bash
npm install -g @anthropic-ai/claude-code
```

Authenticate (opens browser for Anthropic login):
```bash
claude
```

Verify:
```bash
claude -p "Reply OK" --output-format text
```

If Claude CLI is not installed, the tool still works -- AI enhancement is skipped and rule-based messages are used instead.

### 3. Verify Setup

Navigate to the tool directory and run the setup checker:

```bash
cd tools/form-config-corrector
node setup.js
```

All items should show `[OK]`.

## Launch

```bash
node corrector.js
```

The server starts and opens the UI in your default browser. If it doesn't open automatically, visit the URL printed in the terminal (usually `http://localhost:<port>`).

## Usage Modes

### File Mode (offline analysis)

1. Select **File** mode in the sidebar
2. Drop a FormConfig JSON file or click **Paste from Clipboard**
3. Click **Analyze**
4. Review results across 4 tabs: Summary, Localizations, Diff View, Corrected JSON
5. Edit localization messages inline if needed
6. Download corrected JSON or localization CSV sheet

**Accepted JSON formats:**
```
Single module:    { "name": "REGISTRATION", "flows": [...] }
MDMS response:    { "mdms": [{ "data": { ... } }] }
Array:            [{ "name": "...", "flows": [...] }, ...]
```

### Online Correct (live environment)

Connects to a DIGIT environment, fetches configs, analyzes, and pushes fixes back.

1. Select **Online Correct** mode
2. Enter environment details:
   - **Environment URL** - e.g. `https://unified-uat.digit.org`
   - **Username** and **Password** - your DIGIT credentials
   - **Tenant ID** - e.g. `mz`
   - **Project** - e.g. `MR-DN` (optional)
   - **Schema** - `FormConfigTemplate` or `FormConfig`
   - **Campaign Number** - required only for `FormConfig` schema
3. Click **Connect & Fetch**
4. **Select modules** to process from the picker dialog (all checked by default, uncheck any you want to skip)
5. Review results
6. **Push Config Fixes** - updates configs on the server
7. **Upsert Localizations** - pushes localization messages in batches of 50
8. **Download Localization Sheet** - exports CSV for Excel/Google Sheets

### Environment Migration (move configs between environments)

Migrates configs from a source environment to a target environment (e.g. UAT to Dev).

1. Select **Migrate Env** mode
2. Fill in **Source** environment credentials (URL, username, password, tenant, project, schema)
3. Fill in **Target** environment credentials
4. Click **Connect & Fetch Both**
5. **Select modules** to migrate from the picker dialog
6. Review -- the tool shows which modules will be created vs. updated on target
7. Click **Push All to Target**

The tool matches modules by name to decide create vs. update. Tenant/project references in the config data are automatically replaced.

### Schema Migration (between FormConfigTemplate and FormConfig)

Migrates configs between schemas on the same or different environments.

1. Select **Migrate Schema** mode
2. Fill in **Source** credentials and select source schema
3. Fill in **Target** details (defaults to source if blank) and select target schema
4. Click **Connect & Fetch**
5. **Select modules** to migrate
6. Review and push

## What Gets Fixed

| Rule | What it does |
|------|-------------|
| Missing `type` | Adds `type` to components with `format` |
| Missing `fieldName` | Generates fieldName from label/heading |
| Duplicate fieldNames | Renames duplicates within the same page (different pages can share names) |
| Missing `category` | Adds category to flows and pages |
| Action properties | Ensures primaryAction/secondaryAction have required fields |
| Empty error messages | Generates localization codes for empty errorMessage fields |
| Hardcoded validation messages | Replaces English strings with localization codes |
| Table headers | Replaces generic headers (HEADER_1_LABEL) with descriptive codes |
| Icon placement | Copies component-level icon into properties.icon |
| Missing localizations | Generates human-readable messages for all localization codes |

## AI Enhancement

When Claude CLI is available, localization messages go through a two-stage process:

1. **Rule-based generation** - Instant, uses domain word dictionaries and field type context to generate initial messages
2. **Claude AI refinement** - Sends messages in batches of 30 to Claude for improvement (you'll see per-batch progress with module name, batch count, and progress bar)

The AI produces more natural, context-aware labels. Examples:
- `REGISTRATION_HEAD_NAME_LABEL` -> "Head Name" (rule-based) -> "Name of Head of Household" (AI-refined)
- `STOCK_QUANTITY_RECEIVED_HELP_TEXT` -> "Enter the quantity received" (rule-based) -> "Enter the total quantity received from the warehouse" (AI-refined)

## CLI Usage

For scripting or CI/CD pipelines:

```bash
# Analyze a file
node cli.js --file config.json

# Fix and output
node cli.js --file config.json --fix --output corrected.json

# Fix with AI enhancement
node cli.js --file config.json --fix --ai claude

# Online mode
node cli.js --online --url https://your-env.digit.org \
  --tenant mz --project MR-DN \
  --user USERNAME --pass PASSWORD \
  --fix --upsert-locs --ai claude
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Claude not found" in status bar | Install CLI: `npm install -g @anthropic-ai/claude-code`, then authenticate: `claude` |
| "No records found" | Verify tenant, project, schema. FormConfig requires a Campaign Number |
| "Update failed (401)" | Token expired -- reconnect to the environment |
| Port already in use | Set a different port: `PORT=3456 node corrector.js` |
| CORS errors | Access via the Node.js server URL, not by opening the HTML file directly |
| AI enhancement slow | Each batch of 30 codes takes a few seconds. Progress bar shows current status |

## File Structure

```
form-config-corrector/
  corrector.js          Server (HTTP + CORS proxy + Claude CLI bridge)
  corrector.html        Web UI (all 4 modes, inline corrector engine)
  corrector-engine.js   Core validation library (used by CLI)
  cli.js                CLI interface
  setup.js              Prerequisites checker
  README.md             Full reference documentation
  SETUP_GUIDE.md        This file
```
