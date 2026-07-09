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

  // Check Claude Code CLI (REQUIRED)
  const claudeVersion = checkCommand('claude', ['--version']);
  if (claudeVersion) {
    ok(`Claude Code CLI: ${claudeVersion}`);
  } else {
    warn(`Claude Code CLI not found - attempting install...`);
    try {
      execSync('npm install -g @anthropic-ai/claude-code', { stdio: 'inherit', timeout: 120000 });
      const verifyVersion = checkCommand('claude', ['--version']);
      if (verifyVersion) {
        ok(`Claude Code CLI installed: ${verifyVersion}`);
      } else {
        fail(`Claude Code CLI not found (REQUIRED)`);
        log(`  Install manually: npm install -g @anthropic-ai/claude-code`);
        allGood = false;
      }
    } catch (e) {
      fail(`Claude Code CLI not found (REQUIRED)`);
      log(`  Install manually: npm install -g @anthropic-ai/claude-code`);
      allGood = false;
    }
  }

  // Check Claude authentication
  if (claudeVersion || checkCommand('claude', ['--version'])) {
    const authCheck = spawnSync('claude', ['-p', '--output-format', 'text'], {
      input: 'Reply with just the word OK',
      encoding: 'utf-8',
      timeout: 30000,
      shell: true,
    });
    if (authCheck.status === 0 && (authCheck.stdout || '').includes('OK')) {
      ok(`Claude CLI authenticated`);
    } else {
      fail(`Claude CLI not authenticated (REQUIRED)`);
      log(`  Run this command in your terminal to authenticate:`);
      log(`    claude`);
      log(`  This will open a browser window for Anthropic login.`);
      log(`  After authenticating, re-run: node setup.js`);
      allGood = false;
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

  const htmlPath = path.join(__dirname, 'corrector.html');
  if (fs.existsSync(htmlPath)) {
    ok(`corrector.html (web UI) found`);
  } else {
    fail(`corrector.html not found - web UI won't be available`);
    allGood = false;
  }

  // Summary
  console.log(`\n========================================`);
  if (allGood) {
    console.log(`  Setup complete! Ready to use.`);
  } else {
    console.log(`  Setup incomplete. Fix the issues above.`);
  }
  console.log(`========================================\n`);

  console.log(`USAGE:\n`);
  console.log(`  Web UI (recommended):`);
  console.log(`    node corrector.js\n`);
  console.log(`  CLI - Analyze a config file:`);
  console.log(`    node cli.js --file ../response.json\n`);
  console.log(`  CLI - Fix with AI-enhanced messages:`);
  console.log(`    node cli.js --file ../response.json --fix --ai claude\n`);
  console.log(`  CLI - Online mode:`);
  console.log(`    node cli.js --online --url https://unified-uat.digit.org --tenant mz --project MR-DN --user USER --pass PASS --fix --upsert-locs\n`);
}

main().catch(console.error);
