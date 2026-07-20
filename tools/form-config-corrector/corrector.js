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

function safeParseJSON(text) {
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) return null;
  try { return JSON.parse(m[0]); } catch (_) {}
  // Trailing garbage — try trimming from the end
  let s = m[0];
  for (let i = s.length; i > 0; i--) {
    try { return JSON.parse(s.substring(0, i)); } catch (_) {}
  }
  return null;
}

// ─── Proxy helper (stateless) ─────────────────────────────────

async function proxyRequest(url, method, headers, body) {
  const opts = { method, headers: headers || {} };
  if (body !== undefined && body !== null) {
    opts.body = typeof body === 'string' ? body : JSON.stringify(body);
  }
  let host;
  try { host = new URL(url).hostname; } catch { host = url; }
  let resp;
  try {
    resp = await fetch(url, opts);
  } catch (e) {
    const msg = e.message || String(e);
    if (msg.includes('ENOTFOUND') || msg.includes('getaddrinfo'))
      throw new Error(`Cannot resolve host "${host}" - check the URL`);
    if (msg.includes('ECONNREFUSED'))
      throw new Error(`Connection refused by ${host} - the service may be down`);
    if (msg.includes('ETIMEDOUT') || msg.includes('TIMEOUT') || msg.includes('UND_ERR_CONNECT_TIMEOUT'))
      throw new Error(`Connection to ${host} timed out - the service may be slow or unreachable`);
    if (msg.includes('ECONNRESET'))
      throw new Error(`Connection to ${host} was reset - the service may have crashed`);
    if (msg.includes('CERT') || msg.includes('SSL') || msg.includes('certificate'))
      throw new Error(`SSL/certificate error connecting to ${host}: ${msg}`);
    throw new Error(`Cannot connect to ${host}: ${msg}`);
  }
  const contentType = resp.headers.get('content-type') || '';
  let data;
  try {
    if (contentType.includes('json')) {
      data = await resp.json();
    } else {
      data = await resp.text();
    }
  } catch (e) {
    throw new Error(`Invalid response from ${host} (HTTP ${resp.status})`);
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
        const { codes, moduleName, configSummary, existingLocs } = JSON.parse(body);
        if (!codes || !Array.isArray(codes) || codes.length === 0) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'No codes provided' }));
          return;
        }

        const codeList = codes.map(c => `  ${c.code}: "${c.message}"`).join('\n');

        let configSection = '';
        if (configSummary) {
          try {
            const flows = (configSummary.flows || []).map(f => {
              const pages = (f.pages || []).map(p => {
                const fields = (p.fields || []).map(fd => {
                  let info = `      - ${fd.fieldName} (${fd.format})`;
                  if (fd.label) { info += ` label=${fd.label}`; if (fd.labelMsg) info += ` ("${fd.labelMsg}")`; }
                  if (fd.heading && !fd.label) { info += ` heading=${fd.heading}`; if (fd.headingMsg) info += ` ("${fd.headingMsg}")`; }
                  if (fd.validations && fd.validations.length > 0) {
                    const vStr = fd.validations.map(v => v.value != null ? `${v.type}=${v.value}` : v.type).join(', ');
                    info += ` validations=[${vStr}]`;
                  }
                  // Show placeholder keys so AI generates messages with named placeholders
                  for (const pf of ['label', 'heading', 'description', 'title']) {
                    if (fd[pf + 'Placeholders'] && fd[pf + 'Placeholders'].length > 0) {
                      info += ` ${pf}Placeholders=[${fd[pf + 'Placeholders'].map(k => '{' + k + '}').join(', ')}]`;
                    }
                  }
                  return info;
                }).join('\n');
                let pageHeader = `    Page: ${p.page} [${p.screenType}]`;
                if (p.label) { pageHeader += ` label=${p.label}`; if (p.labelMsg) pageHeader += ` ("${p.labelMsg}")`; }
                if (p.heading) { pageHeader += ` heading=${p.heading}`; if (p.headingMsg) pageHeader += ` ("${p.headingMsg}")`; }
                if (p.descriptionMsg) pageHeader += ` desc="${p.descriptionMsg}"`;
                return `${pageHeader}\n${fields}`;
              }).join('\n');
              return `  Flow: ${f.name} [${f.screenType}] category=${f.category}\n${pages}`;
            }).join('\n');
            configSection = `\nForm Config Structure:\n${flows}\n`;
          } catch (e) { /* ignore malformed summary */ }
        }

        let existingLocsSection = '';
        if (existingLocs && Object.keys(existingLocs).length > 0) {
          const entries = Object.entries(existingLocs).slice(0, 50).map(([k, v]) => `  ${k}: "${v}"`).join('\n');
          existingLocsSection = `\nExisting localizations already in the system (for reference style/quality):\n${entries}\n`;
        }

        const prompt = `You are a localization expert for a Health Campaign Management (HCM) mobile app used by health workers in the field.

Module: ${moduleName || 'UNKNOWN'}
${configSection}${existingLocsSection}
These localization codes need proper human-readable messages. The current messages are auto-generated and may be poor quality.

Codes to improve:
${codeList}

Rules:
- Labels: short (1-4 words), Title Case (e.g. "Survey Date", "Lot Number")
- Button/action labels (primaryActionLabel, secondaryActionLabel, actionLabel, codes ending in _CLEAR_LABEL, _FILTER_LABEL, _APPLY_LABEL, _SUBMIT_LABEL, _CANCEL_LABEL, _BACK_LABEL, _NEXT_LABEL, _SAVE_LABEL, _DONE_LABEL, _DELETE_LABEL, _CLOSE_LABEL, _RETRY_LABEL, _OK_LABEL, _YES_LABEL, _NO_LABEL, _CONTINUE_LABEL, _SEARCH_LABEL): very short (1-2 words), e.g. "Clear", "Apply", "Submit", "Back", "Next", "Save", "Cancel", "Search", "Delete", "Done", "Retry". These appear on small mobile buttons, so keep them concise
- Error/validation messages: clear, helpful, Sentence case (e.g. "Age is required"). Use the field's validation parameters from the config structure to generate specific messages. For example, if a field has maxLength=10, the error message should say "Must not exceed 10 characters". If min=1 and max=99, say "Must be between 1 and 99"
- Help text: brief guidance (e.g. "Enter the batch number")
- Description text: concise 1-sentence descriptions
- Strip module/screen prefixes from messages (STOCKREPORTS_, REGISTRATION_, etc.)
- Keep domain acronyms as-is: OPV, AFP, LQA, IHM, MRN, QR, GPS, HCM
- "fieldName" type codes (camelCase): convert to readable (e.g. dateOfBirth -> "Date of Birth")
- TABLE_HEADER codes: short column headers (e.g. "Date of Entry", "Quantity")
- LABEL_PAIR_CATEGORY codes: clean human-readable entity/category name (e.g. LABEL_PAIR_CATEGORY_LQAMODEL -> "LQA Model")
- LABEL_PAIR_ codes (from LabelFieldPairConfig): readable field label (e.g. LABEL_PAIR_LQA_SURVEY_DATE_LABEL -> "Survey Date")
- Reference data codes (from MDMS schemas like HCM.HOUSE_STRUCTURE_TYPES, HCM.REFERRAL_REASONS, etc.): keep as clean readable names (e.g. HOUSE_TYPE_PUCCA -> "Pucca", GENDER_MALE -> "Male")
- Cross-reference codes against the form config fields above; if a code maps to a specific fieldName, label, or heading, use that context to generate an accurate message
- If the config shows a field is a date picker, GPS, scanner, etc., tailor the message accordingly
- Match the style and quality of existing localizations when available. If an existing message is clearly human-written and domain-specific, use it as-is. Code names are technical identifiers that do NOT always describe the intended message (e.g. CLOSED_HOUSEHOLD means "Missed Children" in health campaigns)
- APP_CONFIG_PAGE_* codes: derive the message from the corresponding page's label or heading localization message shown in the config structure. If a page has label=SOME_CODE ("Display Name"), then APP_CONFIG_PAGE_* for that page should use "Display Name". Do NOT naively humanize the page name from the code.
- APP_CONFIG_FLOW_* codes: derive the message from the flow's context and the labels/headings of its pages. Use the resolved messages shown in the config structure.
- APP_CONFIG_CATEGORY_* codes: clean human-readable category name
- POPUP_TITLE codes (from popupConfig.title): these are intentionally blank — always keep the message as a single space " ". Never generate a readable title for these
- If a code has an empty or whitespace-only message, keep it as a single space " " — it was intentionally left empty
- Messages with named placeholders like {selectedIndividualIdentifierId}, {name}, {id} — these represent dynamic runtime values. Preserve ALL placeholders exactly as-is and improve ONLY the surrounding text. If a field in the config has descriptionPlaceholders=[{selectedIndividualIdentifierId}], the message MUST include {selectedIndividualIdentifierId}. Use the placeholder name to understand what data it represents and write a natural message around it (e.g. "Your registration ID is {selectedIndividualIdentifierId}")
- Legacy numbered placeholders {1}, {2} should also be preserved as-is

Return ONLY valid JSON mapping code to improved message. No markdown, no explanation, no wrapping.
Example: {"CODE_1": "Better Message", "CODE_2": "Another"}`;

        const result = callClaude(prompt);
        const improved = safeParseJSON(result);
        if (!improved) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'No valid JSON in Claude response', raw: result.substring(0, 500) }));
          return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ improved, count: Object.keys(improved).length }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
      return;
    }

    // API: Review existing localizations for poor quality
    if (url.pathname === '/api/review-locs' && req.method === 'POST') {
      const body = await readBody(req);
      try {
        const { existingCodes, moduleName, configSummary } = JSON.parse(body);
        if (!existingCodes || !Array.isArray(existingCodes) || existingCodes.length === 0) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'No codes provided' }));
          return;
        }

        const codeList = existingCodes.map(c => `  ${c.code}: "${c.message}"`).join('\n');

        let configSection = '';
        if (configSummary) {
          try {
            const flows = (configSummary.flows || []).map(f => {
              const pages = (f.pages || []).map(p => {
                const fields = (p.fields || []).map(fd => {
                  let info = `      - ${fd.fieldName} (${fd.format})`;
                  if (fd.label) { info += ` label=${fd.label}`; if (fd.labelMsg) info += ` ("${fd.labelMsg}")`; }
                  if (fd.heading && !fd.label) { info += ` heading=${fd.heading}`; if (fd.headingMsg) info += ` ("${fd.headingMsg}")`; }
                  if (fd.validations && fd.validations.length > 0) {
                    const vStr = fd.validations.map(v => v.value != null ? `${v.type}=${v.value}` : v.type).join(', ');
                    info += ` validations=[${vStr}]`;
                  }
                  for (const pf of ['label', 'heading', 'description', 'title']) {
                    if (fd[pf + 'Placeholders'] && fd[pf + 'Placeholders'].length > 0) {
                      info += ` ${pf}Placeholders=[${fd[pf + 'Placeholders'].map(k => '{' + k + '}').join(', ')}]`;
                    }
                  }
                  return info;
                }).join('\n');
                let pageHeader = `    Page: ${p.page} [${p.screenType}]`;
                if (p.label) { pageHeader += ` label=${p.label}`; if (p.labelMsg) pageHeader += ` ("${p.labelMsg}")`; }
                if (p.heading) { pageHeader += ` heading=${p.heading}`; if (p.headingMsg) pageHeader += ` ("${p.headingMsg}")`; }
                if (p.descriptionMsg) pageHeader += ` desc="${p.descriptionMsg}"`;
                return `${pageHeader}\n${fields}`;
              }).join('\n');
              return `  Flow: ${f.name} [${f.screenType}] category=${f.category}\n${pages}`;
            }).join('\n');
            configSection = `\nForm Config Structure:\n${flows}\n`;
          } catch (e) { /* ignore malformed summary */ }
        }

        const prompt = `You are a localization expert for a Health Campaign Management (HCM) mobile app used by health workers in the field.

Module: ${moduleName || 'UNKNOWN'}
${configSection}
The following localization messages ALREADY EXIST in the system and were SET BY ADMINISTRATORS. Review each one and identify ONLY those with CLEARLY POOR QUALITY that absolutely need improvement.

CRITICAL: Be EXTREMELY conservative. These are PRODUCTION messages — changing a correct message is WORSE than leaving a mediocre one. When in doubt, DO NOT change it. Most messages should be SKIPPED.

Clearly poor quality (the ONLY cases to change):
- Auto-generated mangled text like "Gpsfirsthousehold", "Dateofbirth", "Quantityreceived" (concatenated words with no spaces)
- Messages that are just the raw code name repeated (e.g. code "FIELD_ERROR" with message "FIELD_ERROR")
- Empty strings that should have content (but NOT intentionally blank ones marked with single space " ")
- Validation messages with mangled field names (e.g. "dateOfEntry validation failed" instead of "Date of Entry is required")

DO NOT CHANGE (skip these even if imperfect):
- Any message that reads like natural language with proper spacing, even if you'd phrase it differently
- Domain-specific terminology you may not understand. Code names are technical identifiers — they do NOT describe the intended message. Example: REGISTRATION_CLOSED_HOUSEHOLD → "Missed Children" is CORRECT (health campaign domain term). Do NOT change this.
- Messages that seem short or unusual — administrators set them intentionally for their mobile UI
- Messages you'd only change for style preference (e.g. "Enter name" vs "Please enter the name" — both are fine)
- Action/button labels — administrators chose these for their specific mobile UI context
- Any message that is clearly human-written, regardless of whether it matches the code name

Existing messages to review:
${codeList}

If you DO find a genuinely poor message, follow these rules:
- Labels: short (1-4 words), Title Case (e.g. "Survey Date", "Lot Number")
- Button/action labels: very short (1-2 words), e.g. "Clear", "Submit", "Back"
- Error/validation messages: clear, actionable, Sentence case (e.g. "Location is required"). Use the field's validation parameters from the config structure to generate specific messages (e.g. maxLength=10 → "Must not exceed 10 characters")
- Keep domain acronyms as-is: OPV, AFP, LQA, IHM, MRN, QR, GPS, HCM
- APP_CONFIG_PAGE_* codes: derive from the page's label/heading message in the config structure above
- APP_CONFIG_FLOW_* codes: derive from the flow's context and page labels
- POPUP_TITLE codes: SKIP — intentionally blank
- Empty/whitespace messages: SKIP — intentionally left empty
- Messages with named placeholders like {selectedIndividualIdentifierId}, {name} — preserve ALL placeholders exactly. Legacy {1}, {2} should also be preserved

IMPORTANT: Return {} for most batches. Only include codes that are CLEARLY broken (mangled text, raw code names). If all messages are acceptable, return: {}

Return ONLY valid JSON. No markdown, no explanation.
Example: {"MANGLED_CODE": "Proper Message"}`;

        const result = callClaude(prompt);
        const improved = safeParseJSON(result) || {};
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
        const translated = safeParseJSON(result);
        if (!translated) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'No valid JSON in Claude response', raw: result.substring(0, 500) }));
          return;
        }
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
        // LFPC shares the FormConfig URL path for authorization — use FormConfig in URL, keep actual schema in body
        const urlSchema = schemaCode.includes('LabelFieldPairConfig') ? schemaCode.replace('LabelFieldPairConfig', 'FormConfig') : schemaCode;
        const targetUrl = `${envUrl.replace(/\/+$/, '')}/${mdmsPath}/v2/_update/${encodeURIComponent(urlSchema)}`;
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
        // LFPC shares the FormConfig URL path for authorization — use FormConfig in URL, keep actual schema in body
        const urlSchema = schemaCode.includes('LabelFieldPairConfig') ? schemaCode.replace('LabelFieldPairConfig', 'FormConfig') : schemaCode;
        const targetUrl = `${envUrl.replace(/\/+$/, '')}/${mdmsPath}/v2/_create/${encodeURIComponent(urlSchema)}`;
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
