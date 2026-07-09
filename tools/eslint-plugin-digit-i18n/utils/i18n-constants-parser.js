/**
 * Lightweight parser to read I18N_KEYS from a constants file.
 *
 * Scans for the I18N_KEYS object exported from i18nKeyConstants.js files
 * and extracts all key-value mappings (constant name -> localization code string).
 *
 * Works with both formats:
 *   export const I18N_KEYS = { CATEGORY: { KEY: "HCM_CODE" } }
 *   module.exports.I18N_KEYS = { ... }
 */

"use strict";

const fs = require("fs");
const path = require("path");

/**
 * Extract all string values from an I18N_KEYS-style object AST node.
 * Walks nested ObjectExpression nodes and collects Property nodes
 * whose value is a Literal string.
 *
 * @param {object} objectNode - ESTree ObjectExpression node
 * @param {string} prefix - Dot-separated path prefix for nested keys
 * @returns {Map<string, string>} Map of dotted-path -> string value
 */
function extractKeysFromObjectExpression(objectNode, prefix = "") {
  const keys = new Map();

  if (!objectNode || objectNode.type !== "ObjectExpression") return keys;

  for (const prop of objectNode.properties) {
    if (prop.type === "SpreadElement") continue;

    const propName =
      prop.key.type === "Identifier"
        ? prop.key.name
        : prop.key.type === "Literal"
        ? String(prop.key.value)
        : null;

    if (!propName) continue;

    const fullPath = prefix ? `${prefix}.${propName}` : propName;

    if (prop.value.type === "Literal" && typeof prop.value.value === "string") {
      keys.set(fullPath, prop.value.value);
    } else if (prop.value.type === "ObjectExpression") {
      const nested = extractKeysFromObjectExpression(prop.value, fullPath);
      for (const [k, v] of nested) keys.set(k, v);
    }
  }

  return keys;
}

/**
 * Find all I18N_KEYS exports in an ESTree Program AST.
 *
 * @param {object} ast - ESTree Program node (from ESLint's sourceCode.ast)
 * @returns {{ keys: Map<string, string>, node: object|null }}
 */
function findI18NKeysInAST(ast) {
  const result = { keys: new Map(), node: null };

  for (const stmt of ast.body) {
    // export const I18N_KEYS = { ... }
    if (
      stmt.type === "ExportNamedDeclaration" &&
      stmt.declaration &&
      stmt.declaration.type === "VariableDeclaration"
    ) {
      for (const decl of stmt.declaration.declarations) {
        if (
          decl.id &&
          decl.id.name === "I18N_KEYS" &&
          decl.init &&
          decl.init.type === "ObjectExpression"
        ) {
          result.node = decl.init;
          result.keys = extractKeysFromObjectExpression(decl.init);
          return result;
        }
      }
    }

    // const I18N_KEYS = { ... }
    if (stmt.type === "VariableDeclaration") {
      for (const decl of stmt.declarations) {
        if (
          decl.id &&
          decl.id.name === "I18N_KEYS" &&
          decl.init &&
          decl.init.type === "ObjectExpression"
        ) {
          result.node = decl.init;
          result.keys = extractKeysFromObjectExpression(decl.init);
          return result;
        }
      }
    }
  }

  return result;
}

/**
 * Parse an i18nKeyConstants.js file from disk and extract all key mappings.
 * Falls back to regex parsing if the file can't be found or parsed via AST.
 *
 * @param {string} filePath - Absolute path to i18nKeyConstants.js
 * @returns {Map<string, string>} Map of dotted-path -> string value
 */
function parseConstantsFile(filePath) {
  const keys = new Map();

  if (!filePath || !fs.existsSync(filePath)) return keys;

  const content = fs.readFileSync(filePath, "utf-8");

  // Simple regex extraction: find all quoted string values in key: "VALUE" patterns
  const regex = /["']([A-Z][A-Z0-9_]+)["']/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const value = match[1];
    // Only collect values that look like localization codes (uppercase with underscores)
    if (/^[A-Z][A-Z0-9_]{3,}$/.test(value)) {
      keys.set(value, value);
    }
  }

  return keys;
}

/**
 * Find the nearest i18nKeyConstants.js file by walking up from a given directory.
 *
 * @param {string} startDir - Directory to start searching from
 * @returns {string|null} Absolute path or null
 */
function findConstantsFile(startDir) {
  const candidates = [
    "i18nKeyConstants.js",
    "i18nKeyConstants.ts",
    "constants/i18nKeyConstants.js",
    "constants/i18nKeyConstants.ts",
    "src/i18nKeyConstants.js",
    "src/constants/i18nKeyConstants.js",
  ];

  let dir = startDir;
  const root = path.parse(dir).root;

  while (dir !== root) {
    for (const candidate of candidates) {
      const fullPath = path.join(dir, candidate);
      if (fs.existsSync(fullPath)) return fullPath;
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }

  return null;
}

/**
 * Collect all key string values from an AST (for use in rules that need
 * to know what keys are defined in the current file).
 *
 * @param {object} ast - ESTree Program node
 * @returns {Set<string>} All string literal values that look like i18n codes
 */
function collectAllCodeValues(ast) {
  const values = new Set();

  function walk(node) {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }

    if (
      node.type === "Literal" &&
      typeof node.value === "string" &&
      /^[A-Z][A-Z0-9_]{3,}$/.test(node.value)
    ) {
      values.add(node.value);
    }

    for (const key of Object.keys(node)) {
      if (key === "parent") continue;
      const child = node[key];
      if (child && typeof child === "object") walk(child);
    }
  }

  walk(ast);
  return values;
}

// Common keys that should come from a shared common module, not per-module definitions.
const COMMON_KEY_PATTERNS = [
  "SAVE", "CANCEL", "SUBMIT", "DELETE", "EDIT", "CLOSE", "BACK",
  "NEXT", "SEARCH", "SELECT", "ADD", "REMOVE", "VIEW", "OPEN",
  "CONFIRM", "YES", "NO", "OK", "DONE", "APPLY", "RESET",
  "CLEAR", "LOADING", "ERROR", "SUCCESS", "WARNING", "INFO",
  "REQUIRED", "OPTIONAL", "NA", "NONE", "TOTAL", "HOME",
  "LOGOUT", "LOGIN", "DOWNLOAD", "UPLOAD", "EXPORT", "IMPORT",
  "FILTER", "SORT", "REFRESH", "RETRY", "UPDATE", "CREATE",
];

module.exports = {
  extractKeysFromObjectExpression,
  findI18NKeysInAST,
  parseConstantsFile,
  findConstantsFile,
  collectAllCodeValues,
  COMMON_KEY_PATTERNS,
};
