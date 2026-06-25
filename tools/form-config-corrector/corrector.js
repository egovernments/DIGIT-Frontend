#!/usr/bin/env node

/**
 * FormConfig Corrector - Standalone Launcher
 *
 * Single-command launcher: `node corrector.js`
 *   - Starts a local HTTP server (no npm dependencies)
 *   - Opens the corrector UI in your default browser
 *   - Provides Claude CLI API for AI-enhanced message generation
 *   - Proxies DIGIT API requests (auth, MDMS, localization)
 *
 * Requirements: Node.js 18+, Claude Code CLI (required for AI features)
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

// ─── Proxy helper (stateless) ─────────────────────────────────

async function proxyRequest(url, method, headers, body) {
  const opts = { method, headers: headers || {} };
  if (body !== undefined && body !== null) {
    opts.body = typeof body === 'string' ? body : JSON.stringify(body);
  }
  const resp = await fetch(url, opts);
  const contentType = resp.headers.get('content-type') || '';
  let data;
  if (contentType.includes('json')) {
    data = await resp.json();
  } else {
    data = await resp.text();
  }
  return { status: resp.status, data };
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (c) => body += c);
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

// ─── HTTP Server ──────────────────────────────────────────────

function createServer() {
  const htmlPath = path.join(__dirname, 'corrector.html');
  if (!fs.existsSync(htmlPath)) {
    console.error(`Error: corrector.html not found in ${__dirname}`);
    process.exit(1);
  }

  return http.createServer(async (req, res) => {
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
      const body = await readBody(req);
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
      return;
    }

    // API: Call Claude CLI for translation
    if (url.pathname === '/api/translate' && req.method === 'POST') {
      const body = await readBody(req);
      try {
        const { messages, targetLanguage, targetLocale } = JSON.parse(body);
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'No messages provided' }));
          return;
        }

        const codeList = messages.map(m => `  "${m.code}": "${m.message}"`).join('\n');
        const isRTL = ['ARABIC', 'HEBREW', 'URDU', 'PERSIAN', 'FARSI'].includes((targetLanguage || '').toUpperCase());
        const rtlNote = isRTL ? '\n- This is an RTL language. Ensure translated text reads naturally in right-to-left direction.' : '';

        const prompt = `You are a professional translator for a Health Campaign Management (HCM) mobile app used by health workers.

Translate the following English localization messages to ${targetLanguage} (locale: ${targetLocale}).

Messages to translate (JSON key = code, value = English message):
{
${codeList}
}

Rules:
- Keep all codes (keys) exactly as-is. Only translate the message values.
- Preserve technical terms and acronyms as-is: OPV, AFP, LQA, QR, GPS, HCM, MRN, ID, IHM
- Labels should remain concise (1-4 words where possible)
- Error messages should be clear and helpful
- Help text should be brief guidance
- Maintain the same tone: labels are concise Title Case, errors are Sentence case
- Do not add or remove any codes${rtlNote}

Return ONLY valid JSON mapping each code to its translated message. No markdown, no explanation, no wrapping.
Example: {"CODE_1": "Translated message", "CODE_2": "Another translation"}`;

        const result = callClaude(prompt);
        const jsonMatch = result.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'No JSON in Claude response', raw: result.substring(0, 500) }));
          return;
        }

        const translated = JSON.parse(jsonMatch[0]);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ translated, count: Object.keys(translated).length }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
      return;
    }

    // ─── Proxy: Authenticate ─────────────────────────────────
    if (url.pathname === '/api/auth' && req.method === 'POST') {
      const body = await readBody(req);
      try {
        const { envUrl, username, password, tenantId } = JSON.parse(body);
        const targetUrl = `${envUrl.replace(/\/+$/, '')}/user/oauth/token`;
        const formBody = `grant_type=password&scope=read&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&tenantId=${encodeURIComponent(tenantId)}&userType=EMPLOYEE`;
        const result = await proxyRequest(targetUrl, 'POST', {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ZWdvdi11c2VyLWNsaWVudDo=',
        }, formBody);
        res.writeHead(result.status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result.data));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
      return;
    }

    // ─── Proxy: MDMS Search ──────────────────────────────────
    if (url.pathname === '/api/mdms/search' && req.method === 'POST') {
      const body = await readBody(req);
      try {
        const { envUrl, tenantId, schemaCode, filters, token, locale, contextPath } = JSON.parse(body);
        const mdmsPath = contextPath || 'egov-mdms-service';
        const targetUrl = `${envUrl.replace(/\/+$/, '')}/${mdmsPath}/v2/_search`;
        const payload = {
          MdmsCriteria: { tenantId, schemaCode, filters: filters || {}, limit: 20000, isActive: true },
          RequestInfo: { apiId: 'Rainmaker', ver: '.01', action: '_search', did: '1', key: '', msgId: `20170310130900|${locale || 'en_IN'}`, authToken: token, userInfo: { id: 0 } },
        };
        const result = await proxyRequest(targetUrl, 'POST', { 'Content-Type': 'application/json' }, payload);
        res.writeHead(result.status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result.data));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
      return;
    }

    // ─── Proxy: MDMS Update ──────────────────────────────────
    if (url.pathname === '/api/mdms/update' && req.method === 'POST') {
      const body = await readBody(req);
      try {
        const { envUrl, schemaCode, record, token, locale, contextPath } = JSON.parse(body);
        const mdmsPath = contextPath || 'egov-mdms-service';
        const targetUrl = `${envUrl.replace(/\/+$/, '')}/${mdmsPath}/v2/_update/${encodeURIComponent(schemaCode)}`;
        const payload = {
          Mdms: record,
          RequestInfo: { apiId: 'Rainmaker', ver: '.01', action: '_update', did: '1', key: '', msgId: `20170310130900|${locale || 'en_IN'}`, authToken: token, userInfo: { id: 0 } },
        };
        const result = await proxyRequest(targetUrl, 'POST', { 'Content-Type': 'application/json' }, payload);
        res.writeHead(result.status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result.data));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
      return;
    }

    // ─── Proxy: MDMS Create ──────────────────────────────────
    if (url.pathname === '/api/mdms/create' && req.method === 'POST') {
      const body = await readBody(req);
      try {
        const { envUrl, schemaCode, record, token, locale, contextPath } = JSON.parse(body);
        const mdmsPath = contextPath || 'egov-mdms-service';
        const targetUrl = `${envUrl.replace(/\/+$/, '')}/${mdmsPath}/v2/_create/${encodeURIComponent(schemaCode)}`;
        const payload = {
          Mdms: record,
          RequestInfo: { apiId: 'Rainmaker', ver: '.01', action: '_create', did: '1', key: '', msgId: `20170310130900|${locale || 'en_IN'}`, authToken: token, userInfo: { id: 0 } },
        };
        const result = await proxyRequest(targetUrl, 'POST', { 'Content-Type': 'application/json' }, payload);
        res.writeHead(result.status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result.data));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
      return;
    }

    // ─── Proxy: Localization Search ──────────────────────────
    if (url.pathname === '/api/loc/search' && req.method === 'POST') {
      const body = await readBody(req);
      try {
        const { envUrl, module: moduleName, tenantId, locale, token } = JSON.parse(body);
        const targetUrl = `${envUrl.replace(/\/+$/, '')}/localization/messages/v1/_search?module=${encodeURIComponent(moduleName)}&tenantId=${encodeURIComponent(tenantId)}&locale=${encodeURIComponent(locale)}`;
        const payload = {
          RequestInfo: { apiId: 'Rainmaker', ver: '.01', action: '_search', did: '1', key: '', msgId: `20170310130900|${locale}`, authToken: token, userInfo: { id: 0 } },
        };
        const result = await proxyRequest(targetUrl, 'POST', { 'Content-Type': 'application/json' }, payload);
        res.writeHead(result.status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result.data));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
      return;
    }

    // ─── Proxy: Localization Upsert ──────────────────────────
    if (url.pathname === '/api/loc/upsert' && req.method === 'POST') {
      const body = await readBody(req);
      try {
        const { envUrl, tenantId, messages, token, locale } = JSON.parse(body);
        const targetUrl = `${envUrl.replace(/\/+$/, '')}/localization/messages/v1/_upsert`;
        const payload = {
          RequestInfo: { apiId: 'Rainmaker', ver: '.01', action: '_upsert', did: '1', key: '', msgId: `20170310130900|${locale}`, authToken: token, userInfo: { id: 0 } },
          tenantId,
          messages,
        };
        const result = await proxyRequest(targetUrl, 'POST', { 'Content-Type': 'application/json' }, payload);
        res.writeHead(result.status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result.data));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
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
  console.log(`  Claude:   ${claudeVer || 'NOT INSTALLED (AI features will fail - run: npm i -g @anthropic-ai/claude-code)'}`);
  console.log(`  ────────────────────────────────────`);
  console.log(`  Press Ctrl+C to stop\n`);

  openBrowser(url);
});
