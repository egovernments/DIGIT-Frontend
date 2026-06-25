#!/usr/bin/env node

/**
 * FormConfig Corrector - Cross-Platform Setup
 *
 * Detects OS, checks prerequisites, installs missing dependencies.
 * Run: node setup.js
 */

const { execSync, spawnSync } = require('child_process');
const os = require('os');
const fs = require('fs');
const path = require('path');

const PLATFORM = os.platform();
const IS_WIN = PLATFORM === 'win32';
const IS_MAC = PLATFORM === 'darwin';
const IS_LINUX = PLATFORM === 'linux';

function log(msg) { console.log(`  ${msg}`); }
function ok(msg) { console.log(`  [OK] ${msg}`); }
function warn(msg) { console.log(`  [!!] ${msg}`); }
function fail(msg) { console.error(`  [FAIL] ${msg}`); }

function checkCommand(cmd, args = ['--version']) {
  try {
    const result = spawnSync(cmd, args, { encoding: 'utf-8', timeout: 10000, shell: true });
    return result.status === 0 ? (result.stdout || '').trim() : null;
  } catch { return null; }
}

async function main() {
  console.log(`\n========================================`);
  console.log(`  FormConfig Corrector - Setup`);
  console.log(`========================================\n`);

  // Detect OS
  const osName = IS_WIN ? 'Windows' : IS_MAC ? 'macOS' : 'Linux';
  const arch = os.arch();
  log(`OS: ${osName} (${arch})`);
  log(`Platform: ${PLATFORM}`);
  log(`Node.js: ${process.version}`);

  let allGood = true;

  // Check Node.js version
  const nodeVersion = parseInt(process.version.replace('v', '').split('.')[0]);
  if (nodeVersion >= 18) {
    ok(`Node.js ${process.version} (fetch API supported)`);
  } else {
    fail(`Node.js ${process.version} - need v18+ for fetch API`);
    log(`  Install from: https://nodejs.org/`);
    allGood = false;
  }

  // Check Claude Code CLI
  const claudeVersion = checkCommand('claude', ['--version']);
  if (claudeVersion) {
    ok(`Claude Code CLI: ${claudeVersion}`);
  } else {
    warn(`Claude Code CLI not found`);
    log(`  Installing Claude Code CLI...`);
    try {
      execSync('npm install -g @anthropic-ai/claude-code', { stdio: 'inherit', timeout: 120000 });
      ok(`Claude Code CLI installed`);
    } catch (e) {
      fail(`Could not install Claude Code CLI: ${e.message}`);
      log(`  Install manually: npm install -g @anthropic-ai/claude-code`);
      log(`  The tool will still work without AI - just use rule-based message generation`);
    }
  }

  // Check if corrector-engine.js exists
  const enginePath = path.join(__dirname, 'corrector-engine.js');
  if (fs.existsSync(enginePath)) {
    ok(`corrector-engine.js found`);
  } else {
    fail(`corrector-engine.js not found in ${__dirname}`);
    allGood = false;
  }

  const cliPath = path.join(__dirname, 'cli.js');
  if (fs.existsSync(cliPath)) {
    ok(`cli.js found`);
  } else {
    fail(`cli.js not found in ${__dirname}`);
    allGood = false;
  }

  const htmlPath = path.join(__dirname, 'index.html');
  if (fs.existsSync(htmlPath)) {
    ok(`index.html (web UI) found`);
  } else {
    warn(`index.html not found - web UI won't be available`);
  }

  // Summary
  console.log(`\n========================================`);
  if (allGood) {
    console.log(`  Setup complete! Ready to use.`);
  } else {
    console.log(`  Setup incomplete. Fix the issues above.`);
  }
  console.log(`========================================\n`);

  console.log(`USAGE EXAMPLES:\n`);
  console.log(`  Analyze a config file (no changes):`);
  console.log(`    node cli.js --file ../response.json\n`);
  console.log(`  Analyze + fix a config file:`);
  console.log(`    node cli.js --file ../response.json --fix\n`);
  console.log(`  Fix with AI-enhanced messages (uses Claude Code CLI):`);
  console.log(`    node cli.js --file ../response.json --fix --ai claude\n`);
  console.log(`  Online mode (fetch from MDMS, analyze + fix + upsert):`);
  console.log(`    node cli.js --online --url https://unified-uat.digit.org --tenant mz --project MR-DN --user SATYA --pass eGov@123 --fix --upsert-locs\n`);
  console.log(`  Online mode with AI enhancement:`);
  console.log(`    node cli.js --online --url https://unified-uat.digit.org --tenant mz --project MR-DN --user SATYA --pass eGov@123 --fix --upsert-locs --ai claude\n`);
  console.log(`  Web UI:`);
  console.log(`    Open index.html in your browser\n`);
}

main().catch(console.error);
