/**
 * Command: digit-loc scan <path>
 *
 * Scans a module directory for all t() localization key usages.
 * Reports raw string keys, constant references, and constant definitions.
 *
 * Usage:
 *   digit-loc scan ./packages/modules/campaign-manager
 *   digit-loc scan ./packages/modules/campaign-manager --format json
 */

"use strict";

const path = require("path");
const { scanDirectory, findConstantsFiles } = require("../parser/react-parser");
const { format } = require("../utils/output-formatters");

module.exports = async function scan({ positional, flags }) {
  const targetPath = positional[0];
  if (!targetPath) {
    console.error("Usage: digit-loc scan <path>");
    console.error("  Scans a module directory for all t() key usages.");
    process.exit(1);
  }

  const resolvedPath = path.resolve(targetPath);
  const outputFormat = flags.format || "table";

  console.log(`Scanning: ${resolvedPath}`);
  console.log("");

  const result = scanDirectory(resolvedPath);

  console.log(`Scanned ${result.files} file(s)`);
  console.log("");

  // Unique raw keys
  const uniqueRawKeys = new Map();
  for (const k of result.rawKeys) {
    if (!uniqueRawKeys.has(k.key)) {
      uniqueRawKeys.set(k.key, k);
    }
  }

  // Unique constant references
  const uniqueConstantRefs = new Map();
  for (const r of result.constantRefs) {
    if (!uniqueConstantRefs.has(r.ref)) {
      uniqueConstantRefs.set(r.ref, r);
    }
  }

  // Unique constant definitions
  const uniqueConstantDefs = new Map();
  for (const d of result.constantDefs) {
    if (!uniqueConstantDefs.has(d.key)) {
      uniqueConstantDefs.set(d.key, d);
    }
  }

  // Find constants files
  const constantsFiles = findConstantsFiles(resolvedPath);

  if (outputFormat === "json") {
    console.log(JSON.stringify({
      path: resolvedPath,
      filesScanned: result.files,
      rawKeys: Array.from(uniqueRawKeys.values()),
      constantRefs: Array.from(uniqueConstantRefs.values()),
      constantDefs: Array.from(uniqueConstantDefs.values()),
      constantsFiles,
    }, null, 2));
    return;
  }

  // Table output
  if (uniqueRawKeys.size > 0) {
    console.log(format(
      Array.from(uniqueRawKeys.values()),
      "table",
      { title: `Raw String Keys (${uniqueRawKeys.size} unique — should use I18N_KEYS constants)` }
    ));
    console.log("");
  }

  if (uniqueConstantRefs.size > 0) {
    console.log(format(
      Array.from(uniqueConstantRefs.values()).map((r) => ({
        key: r.ref,
        file: r.file,
        line: r.line,
      })),
      "table",
      { title: `Constant References (${uniqueConstantRefs.size} unique)` }
    ));
    console.log("");
  }

  if (uniqueConstantDefs.size > 0) {
    console.log(format(
      Array.from(uniqueConstantDefs.values()),
      "table",
      { title: `Constant Definitions (${uniqueConstantDefs.size} unique)` }
    ));
    console.log("");
  }

  if (constantsFiles.length > 0) {
    console.log("Constants files found:");
    for (const f of constantsFiles) {
      console.log(`  ${path.relative(resolvedPath, f)}`);
    }
    console.log("");
  }

  // Summary
  const allKeys = new Set([
    ...Array.from(uniqueRawKeys.keys()),
    ...Array.from(uniqueConstantDefs.keys()),
  ]);
  console.log(`Summary: ${allKeys.size} unique key(s), ${result.rawKeys.length} raw string usage(s), ${result.constantRefs.length} constant reference(s)`);
};
