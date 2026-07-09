/**
 * Command: digit-loc generate --diff <ref>
 *
 * Creates a localization upsert payload from a git diff. Detects newly
 * added keys and generates human-readable messages using:
 *   - Tier 1: Rule-based smart messages (always)
 *   - Tier 2: Claude AI enhancement (with --ai flag)
 *
 * Usage:
 *   digit-loc generate --diff HEAD~1
 *   digit-loc generate --diff HEAD~1 --ai
 *   digit-loc generate --diff main --module hcm-base-campaign
 *   digit-loc generate --diff HEAD~1 --out payload.json
 */

"use strict";

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const { smartMessageFromCode } = require("../ai/smart-message");
const { enhanceAll, checkAvailability } = require("../ai/enhance");
const { formatPRComment } = require("../utils/output-formatters");

// Regex to find newly added localization codes in diff output
const ADDED_CODE_REGEX = /^\+.*["']([A-Z][A-Z0-9_]{3,})["']/gm;

module.exports = async function generate({ positional, flags }) {
  const diffRef = flags.diff;

  if (!diffRef) {
    console.error("Usage: digit-loc generate --diff <git-ref>");
    console.error("  Creates upsert payload from git diff with auto-generated messages.");
    console.error("");
    console.error("Options:");
    console.error("  --diff <ref>     Git reference to diff against (required, e.g., HEAD~1, main)");
    console.error("  --ai             Enable Claude AI message enhancement");
    console.error("  --module <name>  Localization module name (for upsert payload)");
    console.error("  --locale <code>  Locale code (default: en_IN)");
    console.error("  --out <file>     Write payload to file (default: stdout)");
    console.error("  --format <type>  Output: json, pr-comment (default: json)");
    process.exit(1);
  }

  const useAI = flags.ai === true;
  const moduleName = flags.module || "";
  const locale = flags.locale || "en_IN";
  const outputFormat = flags.format || "json";

  // Get git diff
  let diffOutput;
  try {
    diffOutput = execSync(`git diff ${diffRef} -- "*.js" "*.jsx" "*.ts" "*.tsx"`, {
      encoding: "utf-8",
      maxBuffer: 10 * 1024 * 1024,
    });
  } catch (err) {
    console.error(`Failed to get git diff: ${err.message}`);
    console.error("Make sure you're in a git repository and the ref is valid.");
    process.exit(1);
  }

  if (!diffOutput.trim()) {
    console.log("No changes found in diff.");
    return;
  }

  // Extract newly added localization codes from diff
  const newCodes = new Set();
  let match;
  while ((match = ADDED_CODE_REGEX.exec(diffOutput)) !== null) {
    newCodes.add(match[1]);
  }

  // Also look for codes added in t() calls specifically
  const tCallRegex = /^\+.*\bt\s*\(\s*["'`]([A-Z][A-Z0-9_]{3,})["'`]/gm;
  while ((match = tCallRegex.exec(diffOutput)) !== null) {
    newCodes.add(match[1]);
  }

  // Also look for codes added in I18N_KEYS definitions
  const keyDefRegex = /^\+\s*\w+:\s*["']([A-Z][A-Z0-9_]{3,})["']/gm;
  while ((match = keyDefRegex.exec(diffOutput)) !== null) {
    newCodes.add(match[1]);
  }

  if (newCodes.size === 0) {
    console.log("No new localization codes detected in diff.");
    return;
  }

  console.log(`Found ${newCodes.size} new localization code(s) in diff.`);

  // Generate rule-based messages (Tier 1)
  let codes = Array.from(newCodes).map((code) => ({
    code,
    message: smartMessageFromCode(code, moduleName),
    module: moduleName,
    locale,
  }));

  // AI enhancement (Tier 2)
  if (useAI) {
    const { available, backend } = checkAvailability();
    if (available) {
      console.log(`Enhancing messages with Claude AI (${backend})...`);
      const enhanced = await enhanceAll(
        codes.map((c) => ({ code: c.code, message: c.message })),
        {
          moduleName,
          onProgress: (done, total) => {
            process.stdout.write(`\r  Progress: ${done}/${total}`);
          },
        }
      );
      console.log(""); // newline after progress

      // Merge AI improvements
      for (const item of enhanced) {
        const existing = codes.find((c) => c.code === item.code);
        if (existing && item.aiEnhanced) {
          existing.message = item.message;
          existing.aiEnhanced = true;
        }
      }

      const aiCount = enhanced.filter((e) => e.aiEnhanced).length;
      console.log(`AI enhanced ${aiCount}/${codes.length} message(s).`);
    } else {
      console.warn("AI not available (no Claude CLI or ANTHROPIC_API_KEY). Using rule-based messages.");
    }
  }

  // Output
  if (outputFormat === "pr-comment") {
    console.log("");
    console.log(formatPRComment(codes));
    return;
  }

  // JSON output
  const payload = codes.map((c) => ({
    code: c.code,
    message: c.message,
    module: c.module,
    locale: c.locale,
  }));

  const jsonOutput = JSON.stringify(payload, null, 2);

  if (flags.out) {
    const outPath = path.resolve(flags.out);
    fs.writeFileSync(outPath, jsonOutput + "\n", "utf-8");
    console.log(`\nPayload written to ${outPath}`);
  } else {
    console.log("");
    console.log(jsonOutput);
  }

  console.log(`\n${codes.length} code(s) ready for upsert.`);
};
