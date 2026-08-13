#!/usr/bin/env node
/**
 * Pushes localization messages from health/configs/Localisations/<locale>/<module>.json
 * to the DIGIT localization service (/localization/messages/v1/_upsert).
 *
 * Usage:
 *   node push-localization.js [--dry-run] [file1.json file2.json ...]
 *
 * With no file arguments, every *.json under health/configs/Localisations is pushed.
 * --dry-run validates the files and prints what would be pushed without calling the API.
 *
 * Required environment variables (unless --dry-run):
 *   DIGIT_BASE_URL   e.g. https://unified-dev.digit.org
 *   DIGIT_USERNAME   employee user with localization upsert access
 *   DIGIT_PASSWORD
 * Optional:
 *   DIGIT_TENANT_ID  state tenant (default: mz)
 *   DIGIT_USER_TYPE  default: EMPLOYEE
 *   LOCALE_FILTER    comma-separated locales to push (e.g. en_MZ,pt_MZ); others skipped
 *
 * Requires Node 18+ (uses global fetch).
 */

const fs = require("fs");
const path = require("path");

const LOCALISATIONS_DIR = path.resolve(__dirname, "..", "Localisations");
const UPSERT_PATH = "/localization/messages/v1/_upsert";
const OAUTH_PATH = "/user/oauth/token";
// Standard DIGIT client id "egov-user-client" with empty secret, base64 encoded
const OAUTH_BASIC_AUTH = "Basic ZWdvdi11c2VyLWNsaWVudDo=";
const CHUNK_SIZE = 300;

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const fileArgs = args.filter((a) => a !== "--dry-run");

const baseUrl = (process.env.DIGIT_BASE_URL || "").replace(/\/+$/, "");
const tenantId = process.env.DIGIT_TENANT_ID || "mz";
const localeFilter = (process.env.LOCALE_FILTER || "")
  .split(",")
  .map((l) => l.trim())
  .filter(Boolean);

function listJsonFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listJsonFiles(full));
    else if (entry.isFile() && entry.name.endsWith(".json")) out.push(full);
  }
  return out;
}

function loadMessages(file) {
  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (err) {
    throw new Error(`${file}: invalid JSON - ${err.message}`);
  }
  if (!Array.isArray(parsed)) {
    throw new Error(`${file}: expected a top-level array of messages`);
  }
  parsed.forEach((msg, i) => {
    for (const key of ["code", "message", "module", "locale"]) {
      if (typeof msg?.[key] !== "string" || msg[key] === "") {
        throw new Error(`${file}: entry ${i} is missing a non-empty "${key}"`);
      }
    }
  });
  return parsed;
}

async function authenticate() {
  const username = process.env.DIGIT_USERNAME;
  const password = process.env.DIGIT_PASSWORD;
  if (!baseUrl || !username || !password) {
    throw new Error(
      "DIGIT_BASE_URL, DIGIT_USERNAME and DIGIT_PASSWORD must be set (or use --dry-run)"
    );
  }
  const body = new URLSearchParams({
    grant_type: "password",
    scope: "read",
    username,
    password,
    tenantId,
    userType: process.env.DIGIT_USER_TYPE || "EMPLOYEE",
  });
  const res = await fetch(baseUrl + OAUTH_PATH, {
    method: "POST",
    headers: {
      Authorization: OAUTH_BASIC_AUTH,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  if (!res.ok) {
    throw new Error(`Authentication failed: HTTP ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  if (!data.access_token) {
    throw new Error("Authentication response did not contain an access_token");
  }
  return { authToken: data.access_token, userInfo: data.UserRequest };
}

async function upsert(auth, module, locale, messages) {
  const res = await fetch(baseUrl + UPSERT_PATH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      RequestInfo: {
        apiId: "Rainmaker",
        ver: ".01",
        action: "_upsert",
        msgId: `localization-push|${locale}`,
        authToken: auth.authToken,
        userInfo: auth.userInfo,
      },
      tenantId,
      module,
      locale,
      messages,
    }),
  });
  if (!res.ok) {
    throw new Error(
      `Upsert failed for ${module}/${locale}: HTTP ${res.status} ${await res.text()}`
    );
  }
}

async function main() {
  const files = fileArgs.length ? fileArgs.map((f) => path.resolve(f)) : listJsonFiles(LOCALISATIONS_DIR);
  if (!files.length) {
    console.log("No localization files to push.");
    return;
  }

  // Validate everything up front so a bad file aborts before any partial push
  const groups = new Map(); // "module|locale" -> messages[]
  let skipped = 0;
  for (const file of files) {
    for (const msg of loadMessages(file)) {
      if (localeFilter.length && !localeFilter.includes(msg.locale)) {
        skipped++;
        continue;
      }
      const key = `${msg.module}|${msg.locale}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(msg);
    }
  }

  console.log(`Validated ${files.length} file(s):`);
  for (const [key, messages] of groups) {
    const [module, locale] = key.split("|");
    console.log(`  ${module} [${locale}]: ${messages.length} message(s)`);
  }
  if (skipped) console.log(`  (skipped ${skipped} message(s) outside LOCALE_FILTER)`);

  if (dryRun) {
    console.log("Dry run - nothing pushed.");
    return;
  }

  const auth = await authenticate();
  for (const [key, messages] of groups) {
    const [module, locale] = key.split("|");
    for (let i = 0; i < messages.length; i += CHUNK_SIZE) {
      const chunk = messages.slice(i, i + CHUNK_SIZE);
      await upsert(auth, module, locale, chunk);
      console.log(
        `Pushed ${module} [${locale}] ${Math.min(i + CHUNK_SIZE, messages.length)}/${messages.length}`
      );
    }
  }
  console.log("Localization push complete.");
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
