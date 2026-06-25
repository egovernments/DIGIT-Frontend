#!/usr/bin/env node

/**
 * FormConfig Corrector - Standalone Launcher
 *
 * Single-command launcher: `node corrector.js`
 *   - Starts a local HTTP server (no npm dependencies)
 *   - Opens the corrector UI in your default browser
 *   - Provides Claude CLI API for AI-enhanced message generation
 *
 * Requirements: Node.js 18+, Claude Code CLI (optional, for AI features)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');
const os = require('os');

const PORT = parseInt(process.env.PORT || '0'); // 0 = auto-assign
const HOST = '127.0.0.1';

// ─── Claude CLI helpers ───────────────────────────────────────

function isClaudeInstalled() {
  try {
    const r = spawnSync('claude', ['--version'], { encoding: 'utf-8', timeout: 10000, shell: true });
    return r.status === 0 ? (r.stdout || '').trim() : null;
  } catch { return null; }
}

function callClaude(prompt) {
  const r = spawnSync('claude', ['-p', '--output-format', 'text'], {
    input: prompt,
    encoding: 'utf-8',
    timeout: 120000,
    shell: true,
    maxBuffer: 4 * 1024 * 1024,
  });
  if (r.status !== 0) throw new Error(r.stderr || `Exit code ${r.status}`);
  let text = (r.stdout || '').trim();
  text = text.replace(/^```(?:json)?\s*\n?/gm, '').replace(/\n?```\s*$/gm, '').trim();
  return text;
}

// ─── HTTP Server ──────────────────────────────────────────────

function createServer() {
  const htmlPath = path.join(__dirname, 'corrector.html');
  if (!fs.existsSync(htmlPath)) {
    console.error(`Error: corrector.html not found in ${__dirname}`);
    process.exit(1);
  }

  return http.createServer((req, res) => {
    // CORS for local dev
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

    const url = new URL(req.url, `http://${HOST}`);

    // Serve HTML
    if (url.pathname === '/' || url.pathname === '/index.html') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(fs.readFileSync(htmlPath, 'utf-8'));
      return;
    }

    // API: Check Claude CLI status
    if (url.pathname === '/api/status' && req.method === 'GET') {
      const claudeVer = isClaudeInstalled();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        claude: !!claudeVer,
        claudeVersion: claudeVer || null,
        node: process.version,
        platform: `${os.platform()} ${os.arch()}`,
      }));
      return;
    }

    // API: Call Claude CLI for AI enhancement
    if (url.pathname === '/api/enhance' && req.method === 'POST') {
      let body = '';
      req.on('data', (c) => body += c);
      req.on('end', () => {
        try {
          const { codes, moduleName } = JSON.parse(body);
          if (!codes || !Array.isArray(codes) || codes.length === 0) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'No codes provided' }));
            return;
          }

          const codeList = codes.map(c => `  ${c.code}: "${c.message}"`).join('\n');
          const prompt = `You are a localization expert for a Health Campaign Management (HCM) mobile app used by health workers in the field.

Module: ${moduleName || 'UNKNOWN'}

These localization codes need proper human-readable messages. The current messages are auto-generated and may be poor quality.

Codes to improve:
${codeList}

Rules:
- Labels: short (1-4 words), Title Case (e.g. "Survey Date", "Lot Number")
- Error messages: clear, helpful, Sentence case (e.g. "Age is required")
- Help text: brief guidance (e.g. "Enter the batch number")
- Description text: concise 1-sentence descriptions
- Strip module/screen prefixes from messages (STOCKREPORTS_, REGISTRATION_, etc.)
- Keep domain acronyms as-is: OPV, AFP, LQA, IHM, MRN, QR, GPS, HCM
- "fieldName" type codes (camelCase): convert to readable (e.g. dateOfBirth -> "Date of Birth")
- TABLE_HEADER codes: short column headers (e.g. "Date of Entry", "Quantity")

Return ONLY valid JSON mapping code to improved message. No markdown, no explanation, no wrapping.
Example: {"CODE_1": "Better Message", "CODE_2": "Another"}`;

          const result = callClaude(prompt);
          const jsonMatch = result.match(/\{[\s\S]*\}/);
          if (!jsonMatch) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'No JSON in Claude response', raw: result.substring(0, 500) }));
            return;
          }

          const improved = JSON.parse(jsonMatch[0]);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ improved, count: Object.keys(improved).length }));
        } catch (e) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }

    res.writeHead(404);
    res.end('Not found');
  });
}

// ─── Open browser ─────────────────────────────────────────────

function openBrowser(url) {
  const platform = os.platform();
  try {
    if (platform === 'win32') execSync(`start "" "${url}"`, { stdio: 'ignore' });
    else if (platform === 'darwin') execSync(`open "${url}"`, { stdio: 'ignore' });
    else execSync(`xdg-open "${url}"`, { stdio: 'ignore' });
  } catch { console.log(`  Open ${url} in your browser`); }
}

// ─── Main ─────────────────────────────────────────────────────

const server = createServer();
server.listen(PORT, HOST, () => {
  const addr = server.address();
  const url = `http://${HOST}:${addr.port}`;
  const claudeVer = isClaudeInstalled();

  console.log(`\n  FormConfig Corrector`);
  console.log(`  ────────────────────────────────────`);
  console.log(`  URL:      ${url}`);
  console.log(`  Node:     ${process.version}`);
  console.log(`  Platform: ${os.platform()} ${os.arch()}`);
  console.log(`  Claude:   ${claudeVer || 'not installed (AI features disabled)'}`);
  console.log(`  ────────────────────────────────────`);
  console.log(`  Press Ctrl+C to stop\n`);

  openBrowser(url);
});
