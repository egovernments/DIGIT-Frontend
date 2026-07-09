/**
 * Command: digit-loc sync --env <url> --module <name>
 *
 * Pulls translations from a DIGIT environment and writes them to local
 * JSON files in a localizations/ directory (one per locale).
 *
 * This creates a local source of truth that developers can search/diff.
 *
 * Usage:
 *   digit-loc sync --env https://uat.digit.org --module hcm-base-campaign
 *   digit-loc sync --env https://uat.digit.org --module hcm-base-campaign --locale en_IN,fr_ML
 *   digit-loc sync --env https://uat.digit.org --module hcm-base-campaign --out ./localizations
 */

"use strict";

const fs = require("fs");
const path = require("path");
const { createClient } = require("../utils/digit-client");

module.exports = async function sync({ positional, flags }) {
  const envUrl = flags.env;
  const moduleName = flags.module;

  if (!envUrl || !moduleName) {
    console.error("Usage: digit-loc sync --env <url> --module <name>");
    console.error("  Pulls translations from a DIGIT environment to local JSON files.");
    console.error("");
    console.error("Options:");
    console.error("  --env <url>        DIGIT environment base URL (required)");
    console.error("  --module <name>    Localization module name (required)");
    console.error("  --locale <codes>   Comma-separated locale codes (default: en_IN)");
    console.error("  --out <dir>        Output directory (default: ./localizations/<module>)");
    console.error("  --tenant <id>      Tenant ID (default: default)");
    process.exit(1);
  }

  const locales = (flags.locale || "en_IN").split(",").map((l) => l.trim());
  const outDir = flags.out
    ? path.resolve(flags.out)
    : path.resolve("localizations", moduleName);

  const client = createClient({
    envUrl,
    token: flags.token,
    tenant: flags.tenant,
  });

  // Ensure output directory exists
  fs.mkdirSync(outDir, { recursive: true });

  console.log(`Syncing module "${moduleName}" from ${envUrl}`);
  console.log(`Locales: ${locales.join(", ")}`);
  console.log(`Output: ${outDir}`);
  console.log("");

  let totalMessages = 0;

  for (const locale of locales) {
    console.log(`  Fetching ${locale}...`);

    const messages = await client.searchMessages(moduleName, { locale });

    // Sort by code for stable diffs
    messages.sort((a, b) => a.code.localeCompare(b.code));

    // Write as { "CODE": "message" } format for easy lookup
    const obj = {};
    for (const m of messages) {
      obj[m.code] = m.message;
    }

    const filePath = path.join(outDir, `${locale}.json`);
    fs.writeFileSync(filePath, JSON.stringify(obj, null, 2) + "\n", "utf-8");

    console.log(`  Wrote ${messages.length} message(s) to ${path.relative(process.cwd(), filePath)}`);
    totalMessages += messages.length;
  }

  console.log("");
  console.log(`Synced ${totalMessages} total message(s) across ${locales.length} locale(s).`);
  console.log(`Files are at: ${outDir}`);
};
