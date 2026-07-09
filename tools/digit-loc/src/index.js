#!/usr/bin/env node

/**
 * digit-loc CLI
 *
 * Usage:
 *   npx digit-loc scan <path>             Scan module for all t() keys
 *   npx digit-loc check <path> --env <url> Cross-reference keys against env
 *   npx digit-loc sync --env <url> --module <m> Pull translations from env
 *   npx digit-loc generate --diff <ref>   Create upsert payload from git diff
 *   npx digit-loc generate --diff <ref> --ai  + Claude AI enhancement
 *   npx digit-loc dead <path>             Find unused keys in constants
 *   npx digit-loc push --file <f> --env <url>  Upsert payload to env
 */

"use strict";

const COMMANDS = {
  scan: "./commands/scan",
  check: "./commands/check",
  sync: "./commands/sync",
  generate: "./commands/generate",
  dead: "./commands/dead",
  push: "./commands/push",
};

function parseArgs(argv) {
  const args = argv.slice(2);
  const command = args[0];
  const positional = [];
  const flags = {};

  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      // Boolean flags (no value following) or flags with values
      if (i + 1 < args.length && !args[i + 1].startsWith("--")) {
        flags[key] = args[i + 1];
        i++;
      } else {
        flags[key] = true;
      }
    } else {
      positional.push(arg);
    }
  }

  return { command, positional, flags };
}

function printUsage() {
  console.log(`
digit-loc — DIGIT Localization CLI

Usage:
  digit-loc <command> [options]

Commands:
  scan <path>                     Scan module directory for all t() key usages
  check <path> --env <url>        Cross-reference scanned keys against a DIGIT env
  sync --env <url> --module <m>   Pull translations from env to local JSON files
  generate --diff <ref>           Create upsert payload from git diff (rule-based)
  generate --diff <ref> --ai      Create upsert payload with AI-enhanced messages
  dead <path>                     Find unused keys defined in i18nKeyConstants.js
  push --file <f> --env <url>     Upsert a payload JSON file to a DIGIT environment

Options:
  --env <url>         DIGIT environment base URL (e.g., https://uat.digit.org)
  --module <name>     Localization module name (e.g., hcm-base-campaign)
  --diff <git-ref>    Git reference for diff (e.g., HEAD~1, main)
  --ai                Enable Claude AI enhancement for message generation
  --file <path>       Path to payload JSON file (for push command)
  --format <type>     Output format: table, json, github (default: table)
  --tenant <id>       Tenant ID for API calls (default: default)
  --locale <code>     Locale code (default: en_IN)
  --token <token>     Auth token for DIGIT API (or set DIGIT_AUTH_TOKEN env var)

Examples:
  digit-loc scan ./packages/modules/campaign-manager
  digit-loc check ./packages/modules/campaign-manager --env https://uat.digit.org
  digit-loc sync --env https://uat.digit.org --module hcm-base-campaign
  digit-loc generate --diff HEAD~1
  digit-loc generate --diff HEAD~1 --ai
  digit-loc dead ./packages/modules/campaign-manager
  digit-loc push --file payload.json --env https://uat.digit.org
`);
}

async function main() {
  const { command, positional, flags } = parseArgs(process.argv);

  if (!command || command === "help" || flags.help) {
    printUsage();
    process.exit(0);
  }

  if (!COMMANDS[command]) {
    console.error(`Unknown command: ${command}`);
    console.error(`Run "digit-loc help" for usage information.`);
    process.exit(1);
  }

  try {
    const handler = require(COMMANDS[command]);
    await handler({ positional, flags });
  } catch (err) {
    console.error(`Error: ${err.message}`);
    if (flags.verbose) {
      console.error(err.stack);
    }
    process.exit(1);
  }
}

main();
