#!/usr/bin/env node

/**
 * CI Script: check-localizations.js
 *
 * Full localization scan for GitHub Actions. Runs on pull requests to:
 * 1. Scan changed files for new/modified localization keys
 * 2. Cross-reference against environment (if URL provided)
 * 3. Generate suggested messages (rule-based + optional AI)
 * 4. Post PR comment with results table + upsert payload
 * 5. Emit GitHub annotations for inline PR feedback
 *
 * Environment variables:
 *   INPUT_MODULE         - Localization module name
 *   INPUT_ENV_URL        - DIGIT env URL (optional, for cross-referencing)
 *   INPUT_SCAN_PATH      - Path to scan (default: ".")
 *   INPUT_FAIL_ON_MISSING - "true" to fail check on missing keys
 *   INPUT_BASE_REF       - Base git ref (auto-detected from PR if empty)
 *   ANTHROPIC_API_KEY    - For AI enhancement (optional)
 *   GITHUB_TOKEN         - For posting PR comments
 *   GITHUB_EVENT_PATH    - Path to event payload JSON
 *   GITHUB_OUTPUT        - Path to output file
 *   GITHUB_STEP_SUMMARY  - Path to step summary file
 */

"use strict";

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Import from the digit-loc package
const srcDir = path.join(__dirname, "..", "src");
const { scanDirectory } = require(path.join(srcDir, "parser", "react-parser"));
const { smartMessageFromCode } = require(path.join(srcDir, "ai", "smart-message"));
const { enhanceAll, checkAvailability } = require(path.join(srcDir, "ai", "enhance"));
const { formatPRComment, formatGitHubAnnotations } = require(path.join(srcDir, "utils", "output-formatters"));

async function main() {
  const moduleName = process.env.INPUT_MODULE || "";
  const envUrl = process.env.INPUT_ENV_URL || "";
  const scanPath = process.env.INPUT_SCAN_PATH || ".";
  const failOnMissing = process.env.INPUT_FAIL_ON_MISSING !== "false";
  let baseRef = process.env.INPUT_BASE_REF || "";

  console.log("=== DIGIT Localization Check ===");
  console.log(`Module: ${moduleName}`);
  console.log(`Scan path: ${scanPath}`);

  // Auto-detect base ref from PR
  if (!baseRef) {
    try {
      const eventPath = process.env.GITHUB_EVENT_PATH;
      if (eventPath && fs.existsSync(eventPath)) {
        const event = JSON.parse(fs.readFileSync(eventPath, "utf-8"));
        baseRef = event.pull_request?.base?.sha || "HEAD~1";
      } else {
        baseRef = "HEAD~1";
      }
    } catch {
      baseRef = "HEAD~1";
    }
  }

  console.log(`Base ref: ${baseRef}`);
  console.log("");

  // Step 1: Get changed files from diff
  let diffOutput;
  try {
    diffOutput = execSync(
      `git diff ${baseRef} --name-only -- "*.js" "*.jsx" "*.ts" "*.tsx"`,
      { encoding: "utf-8" }
    );
  } catch {
    diffOutput = "";
  }

  const changedFiles = diffOutput.trim().split("\n").filter(Boolean);
  console.log(`Changed files: ${changedFiles.length}`);

  // Step 2: Scan for localization keys
  const resolvedPath = path.resolve(scanPath);
  const scanResult = scanDirectory(resolvedPath);

  const allKeys = new Set();
  for (const k of scanResult.rawKeys) allKeys.add(k.key);
  for (const d of scanResult.constantDefs) allKeys.add(d.key);

  console.log(`Total keys in codebase: ${allKeys.size}`);

  // Step 3: Get newly added keys from diff
  let fullDiff;
  try {
    fullDiff = execSync(
      `git diff ${baseRef} -- "*.js" "*.jsx" "*.ts" "*.tsx"`,
      { encoding: "utf-8", maxBuffer: 10 * 1024 * 1024 }
    );
  } catch {
    fullDiff = "";
  }

  const newCodes = new Set();
  const addedLineRegex = /^\+.*["']([A-Z][A-Z0-9_]{3,})["']/gm;
  let match;
  while ((match = addedLineRegex.exec(fullDiff)) !== null) {
    newCodes.add(match[1]);
  }

  console.log(`New codes in diff: ${newCodes.size}`);

  // Step 4: Cross-reference with environment (if URL provided)
  let existingMessages = new Map();
  if (envUrl) {
    try {
      const { createClient } = require(path.join(srcDir, "utils", "digit-client"));
      const client = createClient({ envUrl, token: process.env.DIGIT_AUTH_TOKEN });
      existingMessages = await client.fetchAllMessages([moduleName]);
      console.log(`Existing translations in env: ${existingMessages.size}`);
    } catch (err) {
      console.warn(`Could not fetch from env: ${err.message}`);
    }
  }

  // Step 5: Find missing keys
  const missingKeys = [];
  for (const code of newCodes) {
    if (!existingMessages.has(code)) {
      const source = scanResult.rawKeys.find((k) => k.key === code) ||
                     scanResult.constantDefs.find((d) => d.key === code);

      missingKeys.push({
        code,
        message: smartMessageFromCode(code, moduleName),
        file: source?.file || "",
        line: source?.line || 0,
        module: moduleName,
        locale: "en_IN",
      });
    }
  }

  console.log(`Missing translations: ${missingKeys.length}`);

  // Step 6: AI enhancement (if available)
  if (missingKeys.length > 0) {
    const { available, backend } = checkAvailability();
    if (available) {
      console.log(`Enhancing with AI (${backend})...`);
      try {
        const enhanced = await enhanceAll(
          missingKeys.map((k) => ({ code: k.code, message: k.message })),
          { moduleName }
        );

        for (const item of enhanced) {
          const existing = missingKeys.find((k) => k.code === item.code);
          if (existing && item.aiEnhanced) {
            existing.message = item.message;
            existing.aiEnhanced = true;
          }
        }

        const aiCount = enhanced.filter((e) => e.aiEnhanced).length;
        console.log(`AI enhanced: ${aiCount}/${missingKeys.length}`);
      } catch (err) {
        console.warn(`AI enhancement failed: ${err.message}`);
      }
    }
  }

  // Step 7: Output GitHub annotations
  if (missingKeys.length > 0) {
    const annotations = missingKeys
      .filter((k) => k.file)
      .map((k) => ({
        key: k.code,
        file: k.file,
        line: k.line,
        message: `Missing translation: ${k.code}. Suggested: "${k.message}"`,
        severity: "warning",
      }));

    if (annotations.length > 0) {
      console.log("");
      console.log(formatGitHubAnnotations(annotations));
    }
  }

  // Step 8: Write step summary (GitHub Actions job summary)
  if (process.env.GITHUB_STEP_SUMMARY) {
    const summary = formatPRComment(missingKeys);
    try {
      fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary + "\n");
    } catch {}
  }

  // Step 9: Write payload file
  const payloadPath = path.join(process.cwd(), "loc-payload.json");
  if (missingKeys.length > 0) {
    const payload = missingKeys.map((k) => ({
      code: k.code,
      message: k.message,
      module: k.module,
      locale: k.locale,
    }));
    fs.writeFileSync(payloadPath, JSON.stringify(payload, null, 2) + "\n");
    console.log(`\nPayload written to: ${payloadPath}`);
  }

  // Step 10: Write GitHub outputs
  if (process.env.GITHUB_OUTPUT) {
    const outputs = [
      `missing-count=${missingKeys.length}`,
      `payload-file=${payloadPath}`,
    ];
    fs.appendFileSync(process.env.GITHUB_OUTPUT, outputs.join("\n") + "\n");
  }

  // Step 11: Post PR comment (if GITHUB_TOKEN available)
  if (process.env.GITHUB_TOKEN && missingKeys.length > 0) {
    await postPRComment(missingKeys);
  }

  // Exit code
  console.log(`\n=== Result: ${missingKeys.length} missing translation(s) ===`);

  if (failOnMissing && missingKeys.length > 0) {
    process.exit(1);
  }
}

/**
 * Post a PR comment with the missing translations table.
 */
async function postPRComment(missingKeys) {
  try {
    const eventPath = process.env.GITHUB_EVENT_PATH;
    if (!eventPath || !fs.existsSync(eventPath)) return;

    const event = JSON.parse(fs.readFileSync(eventPath, "utf-8"));
    const prNumber = event.pull_request?.number;
    const repo = event.repository?.full_name;

    if (!prNumber || !repo) return;

    const body = formatPRComment(missingKeys);

    const resp = await fetch(
      `https://api.github.com/repos/${repo}/issues/${prNumber}/comments`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          "Content-Type": "application/json",
          Accept: "application/vnd.github.v3+json",
        },
        body: JSON.stringify({ body }),
      }
    );

    if (resp.ok) {
      console.log("Posted PR comment with localization results.");
    } else {
      console.warn(`Failed to post PR comment: ${resp.status}`);
    }
  } catch (err) {
    console.warn(`Could not post PR comment: ${err.message}`);
  }
}

main().catch((err) => {
  console.error(`Fatal error: ${err.message}`);
  process.exit(1);
});
