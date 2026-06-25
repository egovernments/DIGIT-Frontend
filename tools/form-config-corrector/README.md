# FormConfig Corrector

Standalone tool to analyze and fix HCM FormConfig JSON files. Detects structural issues, generates missing localization codes, and optionally uses Claude CLI for AI-enhanced message generation.

## Quick Start

### Web UI (recommended)
```bash
node corrector.js
```
Opens a browser-based UI where you can drop FormConfig JSON files, view analysis results, side-by-side diff, and download corrected configs.

### CLI
```bash
# Analyze only (no changes)
node cli.js --file response.json

# Analyze + fix
node cli.js --file response.json --fix

# Fix with AI-enhanced messages
node cli.js --file response.json --fix --ai claude

# Online mode (fetch from MDMS, analyze + fix + upsert)
node cli.js --online --url https://unified-uat.digit.org --tenant mz --project MR-DN --user USER --pass PASS --fix --upsert-locs
```

## Setup

```bash
node setup.js
```
Checks prerequisites (Node.js 18+, Claude CLI) and installs missing dependencies.

## Requirements

- **Node.js 18+** (no npm dependencies needed)
- **Claude Code CLI** (optional, for AI features) - install via `npm install -g @anthropic-ai/claude-code`

## What It Fixes (11 Rules)

| Rule | Description |
|------|-------------|
| missing-type | Adds `type: "template"` or `type: "string"` where format exists but type is missing |
| missing-fieldName | Generates fieldName from label/heading when missing |
| duplicate-fieldName | Renames duplicate fieldNames within the same screen |
| missing-category | Adds flow/page category when missing |
| primaryAction-props | Fixes broken primaryAction (adds type, format, fieldName, properties.type) |
| secondaryAction-props | Fixes broken secondaryAction |
| empty-errorMessage | Generates localization code for empty errorMessage fields |
| empty-validation-msg | Generates codes for empty validation messages |
| hardcoded-validation | Replaces hardcoded validation text with localization codes |
| hardcoded-table-header | Replaces hardcoded table headers with localization codes |
| icon-to-properties | Moves icon from component root into properties |

## Files

| File | Purpose |
|------|---------|
| `corrector.js` | Local HTTP server + browser launcher (standalone UI) |
| `corrector.html` | Web UI with dark theme, diff view, editable localizations |
| `corrector-engine.js` | Core validation/fix engine (used by CLI and embedded in HTML) |
| `cli.js` | Command-line interface with online/offline modes |
| `setup.js` | Cross-platform prerequisite checker and installer |

## Architecture

```
Browser (corrector.html)          corrector.js (Node.js server)
  |                                  |
  |-- Drop JSON -> analyzeAndFix()   |
  |-- /api/status ------------>      |-- checks Claude CLI
  |-- /api/enhance ----------->      |-- calls `claude -p` via CLI
  |                                  |
  (engine runs in-browser,           (server bridges browser to CLI)
   no server needed for analysis)
```

The web UI runs the analysis engine entirely in-browser. The local server is only needed for the optional AI enhancement feature (which calls `claude -p` via the CLI).
