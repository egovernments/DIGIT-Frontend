/**
 * Command: digit-loc dead <path>
 *
 * Finds unused/dead localization keys — keys defined in i18nKeyConstants.js
 * that are never referenced anywhere else in the module's source code.
 *
 * Usage:
 *   digit-loc dead ./packages/modules/campaign-manager
 *   digit-loc dead ./packages/modules/campaign-manager --format json
 */

"use strict";

const fs = require("fs");
const path = require("path");
const { scanDirectory, findConstantsFiles } = require("../parser/react-parser");
const { format } = require("../utils/output-formatters");

/**
 * Extract all defined localization codes from a constants file.
 * Returns a map of code -> { line, file }.
 */
function extractDefinedKeys(filePath) {
  const defined = new Map();
  const source = fs.readFileSync(filePath, "utf-8");
  const lines = source.split("\n");
  const codeRegex = /["']([A-Z][A-Z0-9_]{3,})["']/g;

  for (let i = 0; i < lines.length; i++) {
    let match;
    codeRegex.lastIndex = 0;
    while ((match = codeRegex.exec(lines[i])) !== null) {
      const code = match[1];
      if (!defined.has(code)) {
        defined.set(code, { line: i + 1, file: filePath });
      }
    }
  }

  return defined;
}

/**
 * Check if a key is referenced anywhere in the source files (excluding
 * the constants file itself).
 */
function isKeyReferenced(key, sourceDir, constantsFilePaths) {
  const constantsSet = new Set(constantsFilePaths.map((f) => path.resolve(f)));

  function searchDir(dir) {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return false;
    }

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        if (entry.name === "node_modules" || entry.name === ".git" || entry.name === "dist" || entry.name === "build") continue;
        if (searchDir(fullPath)) return true;
        continue;
      }

      if (!entry.isFile()) continue;

      const ext = path.extname(entry.name);
      if (![".js", ".jsx", ".ts", ".tsx"].includes(ext)) continue;

      // Skip the constants file itself
      if (constantsSet.has(path.resolve(fullPath))) continue;

      let source;
      try {
        source = fs.readFileSync(fullPath, "utf-8");
      } catch {
        continue;
      }

      // Check if the key appears in this file
      if (source.includes(key)) return true;
    }

    return false;
  }

  return searchDir(sourceDir);
}

module.exports = async function dead({ positional, flags }) {
  const targetPath = positional[0];

  if (!targetPath) {
    console.error("Usage: digit-loc dead <path>");
    console.error("  Finds unused localization keys defined in i18nKeyConstants.js.");
    process.exit(1);
  }

  const resolvedPath = path.resolve(targetPath);
  const outputFormat = flags.format || "table";

  console.log(`Scanning for dead keys in: ${resolvedPath}`);
  console.log("");

  // Find all constants files
  const constantsFiles = findConstantsFiles(resolvedPath);

  if (constantsFiles.length === 0) {
    console.log("No i18nKeyConstants files found.");
    return;
  }

  console.log(`Found ${constantsFiles.length} constants file(s):`);
  for (const f of constantsFiles) {
    console.log(`  ${path.relative(resolvedPath, f)}`);
  }
  console.log("");

  // Collect all defined keys
  const allDefined = new Map();
  for (const filePath of constantsFiles) {
    const keys = extractDefinedKeys(filePath);
    for (const [code, info] of keys) {
      if (!allDefined.has(code)) {
        allDefined.set(code, {
          ...info,
          file: path.relative(resolvedPath, info.file),
        });
      }
    }
  }

  console.log(`Found ${allDefined.size} defined key(s). Checking for references...`);

  // Check each key for references
  const deadKeys = [];
  let checked = 0;

  for (const [code, info] of allDefined) {
    checked++;
    if (checked % 50 === 0) {
      process.stdout.write(`\r  Checked ${checked}/${allDefined.size}...`);
    }

    if (!isKeyReferenced(code, resolvedPath, constantsFiles)) {
      deadKeys.push({
        key: code,
        file: info.file,
        line: info.line,
      });
    }
  }

  if (checked >= 50) console.log(""); // newline after progress
  console.log("");

  if (deadKeys.length === 0) {
    console.log("No dead keys found. All defined keys are referenced in code.");
    return;
  }

  if (outputFormat === "json") {
    console.log(JSON.stringify({
      path: resolvedPath,
      totalDefined: allDefined.size,
      deadKeys,
    }, null, 2));
    return;
  }

  console.log(format(deadKeys, "table", {
    title: `Dead Keys (${deadKeys.length} defined but never referenced)`,
  }));

  console.log("");
  console.log(`${deadKeys.length} dead key(s) out of ${allDefined.size} total defined.`);
  console.log("These keys can likely be removed from i18nKeyConstants.js and the backend.");
};
