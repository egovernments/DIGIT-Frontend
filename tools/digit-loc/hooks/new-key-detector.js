#!/usr/bin/env node

/**
 * Git pre-commit hook: New Key Detector
 *
 * Reads the staged diff of i18nKeyConstants.js files and prints newly
 * added localization keys. Non-blocking — just prints awareness info.
 *
 * Called by lint-staged when i18nKeyConstants.js is modified.
 * The staged file paths are passed as arguments by lint-staged.
 */

"use strict";

const { execSync } = require("child_process");
const path = require("path");

// Regex to find added lines with localization codes
const ADDED_CODE_REGEX = /^\+\s*\w+:\s*["']([A-Z][A-Z0-9_]{3,})["']/;

function main() {
  const files = process.argv.slice(2);

  if (files.length === 0) {
    // No files passed — try to detect from staged changes
    return;
  }

  const newKeys = [];

  for (const filePath of files) {
    // Get staged diff for this file
    let diff;
    try {
      diff = execSync(`git diff --cached -- "${filePath}"`, {
        encoding: "utf-8",
        maxBuffer: 1024 * 1024,
      });
    } catch {
      // If git diff fails, try reading the file directly for new additions
      continue;
    }

    if (!diff.trim()) continue;

    // Parse diff for newly added lines
    const lines = diff.split("\n");
    const moduleName = inferModuleName(filePath);

    for (const line of lines) {
      if (!line.startsWith("+") || line.startsWith("+++")) continue;

      const match = line.match(ADDED_CODE_REGEX);
      if (match) {
        newKeys.push({
          key: match[1],
          module: moduleName,
          file: path.relative(process.cwd(), filePath),
        });
      }
    }
  }

  if (newKeys.length === 0) return;

  // Print summary (non-blocking)
  console.log("");
  console.log(`  \x1b[36m${newKeys.length} new localization key(s) detected in this commit:\x1b[0m`);
  for (const k of newKeys) {
    console.log(`    \x1b[32m+\x1b[0m ${k.key}${k.module ? ` \x1b[90m(${k.module})\x1b[0m` : ""}`);
  }
  console.log("");
  console.log(`  Run \x1b[33mnpx digit-loc generate --diff HEAD~1\x1b[0m to create an upsert payload.`);
  console.log("");
}

/**
 * Try to infer the module name from the file path.
 * e.g., packages/modules/campaign-manager/src/i18nKeyConstants.js -> campaign-manager
 */
function inferModuleName(filePath) {
  const normalized = filePath.replace(/\\/g, "/");
  const parts = normalized.split("/");
  const modulesIdx = parts.indexOf("modules");
  if (modulesIdx >= 0 && modulesIdx + 1 < parts.length) {
    return parts[modulesIdx + 1];
  }
  return null;
}

// Run (always exits 0 — non-blocking)
try {
  main();
} catch (err) {
  // Silently fail — never block a commit
  if (process.env.DEBUG) {
    console.error(`new-key-detector error: ${err.message}`);
  }
}
process.exit(0);
