/**
 * Command: digit-loc check <path> --env <url>
 *
 * Cross-references scanned t() keys against a DIGIT environment
 * to find keys that are used in code but missing from the backend.
 *
 * Usage:
 *   digit-loc check ./packages/modules/campaign-manager --env https://uat.digit.org
 *   digit-loc check ./packages/modules/campaign-manager --env https://uat.digit.org --module hcm-base-campaign
 *   digit-loc check ./packages/modules/campaign-manager --env https://uat.digit.org --format github
 */

"use strict";

const path = require("path");
const { scanDirectory } = require("../parser/react-parser");
const { createClient } = require("../utils/digit-client");
const { format } = require("../utils/output-formatters");
const { smartMessageFromCode } = require("../ai/smart-message");

module.exports = async function check({ positional, flags }) {
  const targetPath = positional[0];
  const envUrl = flags.env;

  if (!targetPath || !envUrl) {
    console.error("Usage: digit-loc check <path> --env <url>");
    console.error("  Cross-references keys against a DIGIT environment.");
    console.error("");
    console.error("Options:");
    console.error("  --env <url>      DIGIT environment base URL (required)");
    console.error("  --module <name>  Localization module name");
    console.error("  --format <type>  Output: table, json, github (default: table)");
    console.error("  --tenant <id>    Tenant ID (default: default)");
    console.error("  --locale <code>  Locale (default: en_IN)");
    process.exit(1);
  }

  const resolvedPath = path.resolve(targetPath);
  const outputFormat = flags.format || "table";

  console.log(`Scanning: ${resolvedPath}`);
  const scanResult = scanDirectory(resolvedPath);

  // Collect all unique keys used in code
  const usedKeys = new Set();
  for (const k of scanResult.rawKeys) usedKeys.add(k.key);
  for (const d of scanResult.constantDefs) usedKeys.add(d.key);

  console.log(`Found ${usedKeys.size} unique key(s) in ${scanResult.files} file(s)`);

  // Determine module name
  let moduleName = flags.module;
  if (!moduleName) {
    // Try to infer from path
    const parts = resolvedPath.replace(/\\/g, "/").split("/");
    const modulesIdx = parts.indexOf("modules");
    if (modulesIdx >= 0 && modulesIdx + 1 < parts.length) {
      moduleName = `hcm-base-${parts[modulesIdx + 1]}`;
    } else {
      moduleName = "hcm-base-campaign";
    }
    console.log(`Inferred module: ${moduleName}`);
  }

  // Fetch existing translations from env
  console.log(`Fetching translations from ${envUrl}...`);

  const client = createClient({
    envUrl,
    token: flags.token,
    tenant: flags.tenant,
    locale: flags.locale,
  });

  const existingMessages = await client.fetchAllMessages([moduleName]);
  console.log(`Fetched ${existingMessages.size} existing translation(s)`);

  // Find missing keys
  const missing = [];
  for (const key of usedKeys) {
    if (!existingMessages.has(key)) {
      // Find source location
      const source = scanResult.rawKeys.find((k) => k.key === key) ||
                     scanResult.constantDefs.find((d) => d.key === key);

      missing.push({
        key,
        file: source?.file || "",
        line: source?.line || 0,
        message: smartMessageFromCode(key, moduleName),
      });
    }
  }

  // Find keys that exist in env but not in code (potential dead keys)
  const envOnlyKeys = [];
  for (const [code] of existingMessages) {
    if (!usedKeys.has(code)) {
      envOnlyKeys.push(code);
    }
  }

  console.log("");

  if (outputFormat === "json") {
    console.log(JSON.stringify({
      scanned: resolvedPath,
      module: moduleName,
      env: envUrl,
      usedKeys: usedKeys.size,
      existingTranslations: existingMessages.size,
      missing,
      envOnlyKeys: envOnlyKeys.slice(0, 100),
    }, null, 2));
    return;
  }

  if (outputFormat === "github") {
    if (missing.length > 0) {
      console.log(format(missing, "github", { severity: "warning" }));
    }
    // Set output for GitHub Actions
    if (process.env.GITHUB_OUTPUT) {
      const fs = require("fs");
      fs.appendFileSync(process.env.GITHUB_OUTPUT, `missing_count=${missing.length}\n`);
    }
    process.exit(missing.length > 0 ? 1 : 0);
    return;
  }

  // Table output
  if (missing.length > 0) {
    console.log(format(missing, "table", {
      title: `Missing Translations (${missing.length} key(s) used in code but not in ${envUrl})`,
    }));
  } else {
    console.log("All keys have translations in the environment.");
  }

  if (envOnlyKeys.length > 0) {
    console.log(`\n${envOnlyKeys.length} key(s) exist in environment but not found in scanned code (potential dead keys).`);
    if (flags.verbose) {
      for (const k of envOnlyKeys.slice(0, 50)) {
        console.log(`  ${k}`);
      }
      if (envOnlyKeys.length > 50) {
        console.log(`  ... and ${envOnlyKeys.length - 50} more`);
      }
    }
  }

  console.log("");
  console.log(`Summary: ${missing.length} missing, ${envOnlyKeys.length} env-only`);

  if (missing.length > 0) {
    process.exit(1);
  }
};
