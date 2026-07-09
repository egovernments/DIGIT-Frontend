/**
 * React/JSX parser for localization key extraction.
 *
 * Scans JS/JSX files for:
 * - t("KEY") calls (translation function)
 * - I18N_KEYS constant definitions
 * - Hardcoded strings in JSX
 */

"use strict";

const fs = require("fs");
const path = require("path");

// Regex patterns for extracting translation keys from source code.
// These work on raw source text — no AST needed — for speed in CLI scanning.

// Matches: t("KEY"), t('KEY'), t(`KEY`)
const T_CALL_REGEX = /\bt\s*\(\s*["'`]([A-Z][A-Z0-9_]+)["'`]\s*\)/g;

// Matches: t(I18N_KEYS.CATEGORY.NAME) — extracts the member expression
const T_CONSTANT_REGEX = /\bt\s*\(\s*(I18N_KEYS(?:\.[A-Za-z_][A-Za-z0-9_]*)+)\s*\)/g;

// Matches: key constant definitions like: KEY_NAME: "HCM_CODE_VALUE"
const CONSTANT_DEF_REGEX = /["']([A-Z][A-Z0-9_]{3,})["']/g;

// File extensions to scan
const SCANNABLE_EXTENSIONS = new Set([".js", ".jsx", ".ts", ".tsx"]);

/**
 * Extract all t() key usages from a source string.
 * Returns both raw string keys and constant references.
 *
 * @param {string} source - File content
 * @param {string} filePath - File path (for reporting)
 * @returns {{ rawKeys: Array<{key, line, col}>, constantRefs: Array<{ref, line}> }}
 */
function extractKeysFromSource(source, filePath) {
  const rawKeys = [];
  const constantRefs = [];
  const lines = source.split("\n");

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    let match;

    // Find raw string t() calls
    T_CALL_REGEX.lastIndex = 0;
    while ((match = T_CALL_REGEX.exec(line)) !== null) {
      rawKeys.push({
        key: match[1],
        line: lineIdx + 1,
        col: match.index + 1,
        file: filePath,
      });
    }

    // Find constant reference t() calls
    T_CONSTANT_REGEX.lastIndex = 0;
    while ((match = T_CONSTANT_REGEX.exec(line)) !== null) {
      constantRefs.push({
        ref: match[1],
        line: lineIdx + 1,
        file: filePath,
      });
    }
  }

  return { rawKeys, constantRefs };
}

/**
 * Extract I18N_KEYS constant definitions from source.
 * Finds all string values that look like localization codes.
 *
 * @param {string} source - File content
 * @param {string} filePath - File path
 * @returns {Array<{key: string, line: number}>}
 */
function extractConstantDefinitions(source, filePath) {
  const definitions = [];

  // Check if this file contains I18N_KEYS
  if (!source.includes("I18N_KEYS")) return definitions;

  const lines = source.split("\n");
  let insideI18NKeys = false;
  let braceDepth = 0;

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];

    if (line.includes("I18N_KEYS")) insideI18NKeys = true;

    if (insideI18NKeys) {
      for (const ch of line) {
        if (ch === "{") braceDepth++;
        if (ch === "}") braceDepth--;
      }

      let match;
      CONSTANT_DEF_REGEX.lastIndex = 0;
      while ((match = CONSTANT_DEF_REGEX.exec(line)) !== null) {
        definitions.push({
          key: match[1],
          line: lineIdx + 1,
          file: filePath,
        });
      }

      if (braceDepth <= 0 && insideI18NKeys) {
        insideI18NKeys = false;
      }
    }
  }

  return definitions;
}

/**
 * Recursively scan a directory for JS/JSX files and extract all t() keys.
 *
 * @param {string} dirPath - Directory to scan
 * @param {object} [options]
 * @param {Set<string>} [options.excludeDirs] - Directory names to skip
 * @returns {{ rawKeys: Array, constantRefs: Array, constantDefs: Array, files: number }}
 */
function scanDirectory(dirPath, options = {}) {
  const excludeDirs = options.excludeDirs || new Set([
    "node_modules", ".git", "dist", "build", "coverage", "__tests__", "__mocks__",
  ]);

  const result = { rawKeys: [], constantRefs: [], constantDefs: [], files: 0 };

  function walkDir(dir) {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        if (!excludeDirs.has(entry.name)) {
          walkDir(fullPath);
        }
        continue;
      }

      if (!entry.isFile()) continue;

      const ext = path.extname(entry.name);
      if (!SCANNABLE_EXTENSIONS.has(ext)) continue;

      let source;
      try {
        source = fs.readFileSync(fullPath, "utf-8");
      } catch {
        continue;
      }

      result.files++;
      const relativePath = path.relative(dirPath, fullPath);

      const { rawKeys, constantRefs } = extractKeysFromSource(source, relativePath);
      result.rawKeys.push(...rawKeys);
      result.constantRefs.push(...constantRefs);

      const defs = extractConstantDefinitions(source, relativePath);
      result.constantDefs.push(...defs);
    }
  }

  walkDir(path.resolve(dirPath));
  return result;
}

/**
 * Find all i18nKeyConstants files in a directory.
 *
 * @param {string} dirPath - Directory to search
 * @returns {string[]} Array of absolute file paths
 */
function findConstantsFiles(dirPath) {
  const results = [];

  function walkDir(dir) {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory() && entry.name !== "node_modules" && entry.name !== ".git") {
        walkDir(fullPath);
      } else if (entry.isFile() && entry.name.includes("i18nKeyConstants")) {
        results.push(fullPath);
      }
    }
  }

  walkDir(path.resolve(dirPath));
  return results;
}

module.exports = {
  extractKeysFromSource,
  extractConstantDefinitions,
  scanDirectory,
  findConstantsFiles,
  T_CALL_REGEX,
  T_CONSTANT_REGEX,
  SCANNABLE_EXTENSIONS,
};
