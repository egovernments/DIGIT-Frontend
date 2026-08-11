#!/usr/bin/env node

/**
 * FormConfig Corrector - CI entrypoint
 *
 * Designed for GitHub Actions (or any headless pipeline). Two commands:
 *
 *   validate  Analyze a config file. Exit 1 if it needs fixes, so a PR
 *             check can gate the merge. Writes the corrected JSON and a
 *             machine-readable report next to the input (or to --out-dir).
 *
 *   push      Validate + auto-fix a config file, then push it to MDMS
 *             (create or update, matched by data.name) and upsert the
 *             generated localizations. Exit 1 on any API failure.
 *
 * Usage:
 *   node ci.js validate --file form-configs/unified-uat/registration.json [--out-dir artifacts]
 *   node ci.js push --file form-configs/unified-uat/registration.json \
 *     --env unified-uat --env-file form-configs/environments.json \
 *     --user "$DIGIT_USERNAME" --pass "$DIGIT_PASSWORD" [--ai-key "$ANTHROPIC_API_KEY"] [--dry-run]
 *
 * Environment resolution: pass --url/--tenant/--locale directly, or
 * --env <name> + --env-file <environments.json> to look them up.
 *
 * Exit codes: 0 = ok/clean, 1 = validation issues or push failure, 2 = usage/parse error.
 */

const fs = require('fs');
const path = require('path');
const { analyzeAndFix } = require('./corrector-engine');

const DEFAULT_SCHEMA = 'HCM-ADMIN-CONSOLE.FormConfigTemplate';
const LOC_PATH = '/localization/messages/v1';
const LOC_BATCH = 50;

// ──────────────────────────────────────────────────────────────
// Args
// ──────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const opts = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    switch (a) {
      case '--file': opts.file = argv[++i]; break;
      case '--out-dir': opts.outDir = argv[++i]; break;
      case '--env': opts.env = argv[++i]; break;
      case '--env-file': opts.envFile = argv[++i]; break;
      case '--url': opts.url = argv[++i]; break;
      case '--tenant': opts.tenant = argv[++i]; break;
      case '--locale': opts.locale = argv[++i]; break;
      case '--project': opts.project = argv[++i]; break;
      case '--schema': opts.schema = argv[++i]; break;
      case '--context-path': opts.contextPath = argv[++i]; break;
      case '--user': opts.user = argv[++i]; break;
      case '--pass': opts.pass = argv[++i]; break;
      case '--token': opts.token = argv[++i]; break;
      case '--ai-key': opts.aiKey = argv[++i]; break;
      case '--dry-run': opts.dryRun = true; break;
      default: opts._.push(a);
    }
  }
  return opts;
}

function fail(msg, code = 2) {
  console.error(`ERROR: ${msg}`);
  process.exit(code);
}

// ──────────────────────────────────────────────────────────────
// Config file loading (same formats as cli.js)
// ──────────────────────────────────────────────────────────────

function loadConfigs(filePath) {
  const resolved = path.resolve(filePath);
  if (!fs.existsSync(resolved)) fail(`File not found: ${resolved}`);
  let raw;
  try {
    raw = JSON.parse(fs.readFileSync(resolved, 'utf-8'));
  } catch (e) {
    fail(`Invalid JSON in ${filePath}: ${e.message}`);
  }
  let configs;
  if (Array.isArray(raw)) configs = raw.map((r) => r.data || r);
  else if (raw.mdms && Array.isArray(raw.mdms)) configs = raw.mdms.map((r) => r.data);
  else if (raw.data && raw.data.flows) configs = [raw.data];
  else if (raw.flows) configs = [raw];
  else fail(`Unrecognized JSON format in ${filePath}: expected a FormConfig with "flows", an array of configs, or an MDMS response`);
  return configs.filter((c) => c && c.flows);
}

// ──────────────────────────────────────────────────────────────
// Environment resolution
// ──────────────────────────────────────────────────────────────

function resolveEnv(opts) {
  let env = { url: opts.url, tenant: opts.tenant, locale: opts.locale, schema: opts.schema, contextPath: opts.contextPath };
  if (opts.env) {
    const envFile = opts.envFile || path.join('form-configs', 'environments.json');
    if (!fs.existsSync(envFile)) fail(`Environment file not found: ${envFile}`);
    const all = JSON.parse(fs.readFileSync(envFile, 'utf-8'));
    const preset = all[opts.env];
    if (!preset) fail(`Environment "${opts.env}" not found in ${envFile}. Known: ${Object.keys(all).join(', ')}`);
    env = { ...preset, ...Object.fromEntries(Object.entries(env).filter(([, v]) => v != null)) };
  }
  if (!env.url || !env.tenant) fail('Missing environment: provide --url/--tenant or --env/--env-file');
  env.url = env.url.replace(/\/+$/, '');
  env.locale = env.locale || 'en_MZ';
  env.schema = env.schema || DEFAULT_SCHEMA;
  env.contextPath = env.contextPath || 'egov-mdms-service';
  return env;
}

// ──────────────────────────────────────────────────────────────
// DIGIT API helpers
// ──────────────────────────────────────────────────────────────

function ri(token, locale, action) {
  return { apiId: 'Rainmaker', ver: '.01', action, did: '1', key: '', msgId: `20170310130900|${locale}`, authToken: token, userInfo: { id: 0 } };
}

async function apiJson(url, body, label) {
  const resp = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const text = await resp.text();
  let data;
  try { data = JSON.parse(text); } catch { data = null; }
  if (!resp.ok && resp.status !== 202) {
    const msg = data?.Errors?.[0]?.message || data?.Errors?.[0]?.description || text.substring(0, 300);
    throw new Error(`${label} failed (${resp.status}): ${msg}`);
  }
  return data;
}

async function auth(env, user, pass) {
  const resp = await fetch(`${env.url}/user/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: 'Basic ZWdvdi11c2VyLWNsaWVudDo=' },
    body: `grant_type=password&scope=read&username=${encodeURIComponent(user)}&password=${encodeURIComponent(pass)}&tenantId=${encodeURIComponent(env.tenant)}&userType=EMPLOYEE`,
  });
  const data = await resp.json().catch(() => ({}));
  if (!data.access_token) throw new Error(`Authentication failed (${resp.status}): check DIGIT credentials/tenant`);
  return data.access_token;
}

async function searchMdms(env, filters, token) {
  const body = {
    MdmsCriteria: { tenantId: env.tenant, schemaCode: env.schema, filters: filters || {}, limit: 20000, isActive: true },
    RequestInfo: ri(token, env.locale, '_search'),
  };
  const data = await apiJson(`${env.url}/${env.contextPath}/v2/_search`, body, 'MDMS search');
  return data?.mdms || [];
}

async function updateMdms(env, rec, token) {
  const body = { Mdms: rec, RequestInfo: ri(token, env.locale, '_update') };
  return apiJson(`${env.url}/${env.contextPath}/v2/_update/${encodeURIComponent(env.schema)}`, body, 'MDMS update');
}

async function createMdms(env, rec, token) {
  const body = { Mdms: rec, RequestInfo: ri(token, env.locale, '_create') };
  return apiJson(`${env.url}/${env.contextPath}/v2/_create/${encodeURIComponent(env.schema)}`, body, 'MDMS create');
}

async function searchLoc(env, moduleName, token) {
  const url = `${env.url}${LOC_PATH}/_search?module=${encodeURIComponent(moduleName)}&tenantId=${encodeURIComponent(env.tenant)}&locale=${encodeURIComponent(env.locale)}`;
  const data = await apiJson(url, { RequestInfo: ri(token, env.locale, '_search') }, `Localization search (${moduleName})`);
  return data?.messages || [];
}

async function upsertLoc(env, moduleName, messages, token) {
  let count = 0;
  for (let i = 0; i < messages.length; i += LOC_BATCH) {
    const batch = messages.slice(i, i + LOC_BATCH).map((m) => ({ code: m.code, message: m.message, module: moduleName, locale: env.locale }));
    await apiJson(`${env.url}${LOC_PATH}/_upsert`, { RequestInfo: ri(token, env.locale, '_upsert'), tenantId: env.tenant, messages: batch }, `Localization upsert (${moduleName})`);
    count += batch.length;
  }
  return count;
}

// ──────────────────────────────────────────────────────────────
// AI enhancement (Anthropic API, headless)
// ──────────────────────────────────────────────────────────────

async function enhanceViaAPI(newLocalizations, configData, aiKey) {
  if (!newLocalizations.length) return newLocalizations;
  console.log(`  AI-enhancing ${newLocalizations.length} localization messages via Anthropic API...`);
  const BATCH = 30;
  let enhanced = 0;
  for (let i = 0; i < newLocalizations.length; i += BATCH) {
    const batch = newLocalizations.slice(i, i + BATCH);
    const codeList = batch.map((l) => `  ${l.code}: "${l.message}"`).join('\n');
    const prompt = `You are a localization expert for a Health Campaign Management (HCM) mobile app used by health workers in the field.
Module: ${configData.name || 'UNKNOWN'}

Improve these auto-generated localization messages:
${codeList}

Rules:
- Labels: short (1-4 words), Title Case
- Error messages: clear, helpful, Sentence case
- Strip module/screen prefixes from messages
- Keep domain acronyms as-is: OPV, AFP, LQA, IHM, MRN, QR, GPS, HCM
Return ONLY valid JSON mapping code to improved message. No markdown, no explanation.`;
    try {
      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': aiKey, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 4096, messages: [{ role: 'user', content: prompt }] }),
      });
      if (!resp.ok) { console.log(`  AI batch ${Math.floor(i / BATCH) + 1} failed (${resp.status}), keeping rule-based messages`); continue; }
      const result = await resp.json();
      const text = result.content?.[0]?.text || '';
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const improved = JSON.parse(jsonMatch[0]);
        for (const loc of batch) {
          if (improved[loc.code] && improved[loc.code] !== loc.code) { loc.message = improved[loc.code]; enhanced++; }
        }
      }
    } catch (e) {
      console.log(`  AI batch error: ${e.message} (keeping rule-based messages)`);
    }
  }
  console.log(`  AI enhanced ${enhanced}/${newLocalizations.length} messages`);
  return newLocalizations;
}

// ──────────────────────────────────────────────────────────────
// Reporting
// ──────────────────────────────────────────────────────────────

function printReport(report, newLocalizations) {
  console.log(`\n  Module: ${report.moduleName}`);
  console.log(`  Issues: ${report.totalIssues} (${report.fixes.length} auto-fixable, ${report.warnings.length} warnings)`);
  console.log(`  New localizations: ${newLocalizations.length}`);
  if (report.fixes.length) {
    console.log(`\n  FIXES NEEDED:`);
    for (const f of report.fixes) {
      const details = f.fixed || f.details || `${f.old || ''} -> ${f.new || ''}`;
      console.log(`    [${f.rule}] ${f.path || f.flow || f.location || ''}: ${details}`);
    }
  }
  if (report.warnings.length) {
    console.log(`\n  WARNINGS:`);
    for (const w of report.warnings) console.log(`    [${w.rule}] ${w.path || ''}`);
  }
}

function appendStepSummary(md) {
  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, md + '\n');
  }
}

function summaryMarkdown(file, results) {
  const lines = [`### \`${file}\``, '', '| Module | Fixes needed | Warnings | New localizations | Status |', '|---|---|---|---|---|'];
  for (const r of results) {
    const ok = r.report.fixes.length === 0 && r.report.warnings.length === 0;
    lines.push(`| ${r.report.moduleName} | ${r.report.fixes.length} | ${r.report.warnings.length} | ${r.newLocalizations.length} | ${ok ? ':white_check_mark: clean' : ':x: needs fixes'} |`);
  }
  const allFixes = results.flatMap((r) => r.report.fixes.map((f) => ({ module: r.report.moduleName, ...f })));
  if (allFixes.length) {
    lines.push('', '<details><summary>Fixes the corrector would apply</summary>', '');
    for (const f of allFixes) {
      const details = f.fixed || f.details || `${f.old || ''} -> ${f.new || ''}`;
      lines.push(`- **[${f.rule}]** \`${f.path || f.flow || f.location || f.module}\`: ${details}`);
    }
    lines.push('', '</details>');
  }
  return lines.join('\n');
}

// ──────────────────────────────────────────────────────────────
// validate command
// ──────────────────────────────────────────────────────────────

async function runValidate(opts) {
  if (!opts.file) fail('validate requires --file <path>');
  const configs = loadConfigs(opts.file);
  if (!configs.length) fail(`No FormConfig entries with "flows" found in ${opts.file}`);

  console.log(`FormConfig Corrector - validate`);
  console.log(`File: ${opts.file} (${configs.length} config${configs.length > 1 ? 's' : ''})`);

  const results = configs.map((c) => analyzeAndFix(c, { autoFix: true }));
  for (const r of results) printReport(r.report, r.newLocalizations);

  const outDir = opts.outDir || path.dirname(path.resolve(opts.file));
  fs.mkdirSync(outDir, { recursive: true });
  const base = path.basename(opts.file, '.json');
  const correctedPath = path.join(outDir, `${base}-corrected.json`);
  const reportPath = path.join(outDir, `${base}-report.json`);
  const corrected = results.length === 1 ? results[0].correctedData : results.map((r) => r.correctedData);
  fs.writeFileSync(correctedPath, JSON.stringify(corrected, null, 2));
  fs.writeFileSync(reportPath, JSON.stringify({
    file: opts.file,
    results: results.map((r) => ({ report: r.report, newLocalizations: r.newLocalizations })),
  }, null, 2));
  console.log(`\n  Corrected JSON: ${correctedPath}`);
  console.log(`  Report: ${reportPath}`);

  appendStepSummary(summaryMarkdown(opts.file, results));

  const dirty = results.some((r) => r.report.fixes.length > 0 || r.report.warnings.length > 0);
  if (dirty) {
    console.error(`\nVALIDATION FAILED: ${opts.file} needs fixes. Apply the corrected JSON (see artifact) or fix manually.`);
    process.exit(1);
  }
  console.log(`\nVALIDATION PASSED: ${opts.file} is clean.`);
}

// ──────────────────────────────────────────────────────────────
// push command
// ──────────────────────────────────────────────────────────────

function locModuleFor(env, configData, opts) {
  const moduleName = (configData.name || '').toLowerCase();
  if (env.schema.endsWith('.FormConfig')) {
    const campaign = opts.campaign || configData.campaignNumber;
    if (!campaign) fail('FormConfig schema requires a campaign number (config.campaignNumber)');
    return `hcm-${moduleName}-${campaign}`;
  }
  const project = (opts.project || configData.project || 'default').toLowerCase();
  return `hcm-base-${moduleName}-${project}`;
}

async function runPush(opts) {
  if (!opts.file) fail('push requires --file <path>');
  const env = resolveEnv(opts);
  const configs = loadConfigs(opts.file);
  if (!configs.length) fail(`No FormConfig entries with "flows" found in ${opts.file}`);

  console.log(`FormConfig Corrector - push${opts.dryRun ? ' (dry run)' : ''}`);
  console.log(`File: ${opts.file} (${configs.length} config${configs.length > 1 ? 's' : ''})`);
  console.log(`Target: ${env.url} | tenant=${env.tenant} | schema=${env.schema} | locale=${env.locale}`);

  let token = opts.token;
  if (!token) {
    if (!opts.user || !opts.pass) fail('push requires --token or --user/--pass');
    token = await auth(env, opts.user, opts.pass);
    console.log('Authenticated');
  }

  let failures = 0;

  for (const configData of configs) {
    const moduleName = configData.name;
    if (!moduleName) { console.error('  Skipping config without "name"'); failures++; continue; }
    const locModule = locModuleFor(env, configData, opts);
    console.log(`\nModule: ${moduleName} (loc module: ${locModule})`);

    // Only generate messages for codes that don't already exist on the target
    const existingLocCodes = new Map();
    for (const mod of [locModule, 'hcm-appconfiguration']) {
      try {
        for (const m of await searchLoc(env, mod, token)) existingLocCodes.set(m.code, m.message);
      } catch (e) {
        console.log(`  Localization search (${mod}) failed: ${e.message} - treating all codes as new`);
      }
    }

    const result = analyzeAndFix(configData, { autoFix: true, existingLocCodes });
    printReport(result.report, result.newLocalizations);

    if (opts.aiKey && result.newLocalizations.length > 0) {
      result.newLocalizations = await enhanceViaAPI(result.newLocalizations, configData, opts.aiKey);
    }

    // Match existing MDMS record by module name (and project when present)
    const filters = configData.project ? { project: configData.project } : {};
    const records = await searchMdms(env, filters, token);
    const existing = records.find((r) => r.data?.name === moduleName);

    if (opts.dryRun) {
      console.log(`  DRY RUN: would ${existing ? `update record ${existing.uniqueIdentifier || existing.id}` : 'create new record'} and upsert ${result.newLocalizations.length} localizations`);
      continue;
    }

    try {
      if (existing) {
        await updateMdms(env, {
          id: existing.id, tenantId: existing.tenantId, schemaCode: env.schema,
          uniqueIdentifier: existing.uniqueIdentifier, data: result.correctedData, isActive: true,
          auditDetails: existing.auditDetails || null,
        }, token);
        console.log(`  Updated MDMS record ${existing.uniqueIdentifier || existing.id}`);
      } else {
        await createMdms(env, { tenantId: env.tenant, schemaCode: env.schema, data: result.correctedData, isActive: true }, token);
        console.log(`  Created new MDMS record`);
      }
    } catch (e) {
      console.error(`  Config push failed: ${e.message}`);
      failures++;
      continue; // don't upsert localizations for a config that failed to push
    }

    if (result.newLocalizations.length > 0) {
      for (const mod of [locModule, 'hcm-appconfiguration']) {
        try {
          const count = await upsertLoc(env, mod, result.newLocalizations, token);
          console.log(`  Upserted ${count} localizations to ${mod}`);
        } catch (e) {
          console.error(`  Localization upsert (${mod}) failed: ${e.message}`);
          failures++;
        }
      }
    } else {
      console.log('  No new localizations to upsert');
    }

    appendStepSummary(`- :rocket: \`${moduleName}\` ${existing ? 'updated' : 'created'} on ${env.url} (${result.newLocalizations.length} localizations upserted)`);
  }

  if (failures > 0) {
    console.error(`\nPUSH FAILED: ${failures} error(s)`);
    process.exit(1);
  }
  console.log(`\nPUSH COMPLETE`);
}

// ──────────────────────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────────────────────

async function main() {
  const [command, ...rest] = process.argv.slice(2);
  const opts = parseArgs(rest);
  if (command === 'validate') await runValidate(opts);
  else if (command === 'push') await runPush(opts);
  else {
    console.log('Usage: node ci.js <validate|push> --file <config.json> [options]  (see file header for details)');
    process.exit(2);
  }
}

main().catch((e) => { console.error(e.message || e); process.exit(1); });
