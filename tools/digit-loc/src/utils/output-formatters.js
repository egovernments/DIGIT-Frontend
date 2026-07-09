/**
 * Output formatters for CLI and CI.
 *
 * Supports: table (terminal), json, github (annotations for PR checks).
 */

"use strict";

/**
 * Format key results as a terminal table.
 *
 * @param {Array<{key, file, line, message?}>} items
 * @param {object} [options]
 * @param {string} [options.title] - Table title
 */
function formatTable(items, options = {}) {
  if (items.length === 0) {
    return options.title ? `${options.title}: (none)` : "(none)";
  }

  // Calculate column widths
  const cols = {
    key: "Key",
    file: "File",
    line: "Line",
  };
  if (items.some((i) => i.message)) {
    cols.message = "Message";
  }

  const widths = {};
  for (const col of Object.keys(cols)) {
    widths[col] = Math.max(
      cols[col].length,
      ...items.map((i) => String(i[col] || "").length)
    );
    widths[col] = Math.min(widths[col], col === "message" ? 50 : col === "file" ? 60 : 40);
  }

  const header = Object.keys(cols)
    .map((c) => cols[c].padEnd(widths[c]))
    .join("  ");
  const separator = Object.keys(cols)
    .map((c) => "-".repeat(widths[c]))
    .join("  ");

  const rows = items.map((item) =>
    Object.keys(cols)
      .map((c) => {
        const val = String(item[c] || "");
        return val.length > widths[c] ? val.substring(0, widths[c] - 3) + "..." : val.padEnd(widths[c]);
      })
      .join("  ")
  );

  const parts = [];
  if (options.title) parts.push(`\n${options.title}`);
  parts.push(header);
  parts.push(separator);
  parts.push(...rows);
  parts.push(`\n${items.length} item(s)`);

  return parts.join("\n");
}

/**
 * Format results as JSON.
 */
function formatJSON(items) {
  return JSON.stringify(items, null, 2);
}

/**
 * Format results as GitHub Actions annotations.
 * These show up inline in PR diff views.
 *
 * @param {Array<{key, file, line, message?, severity?}>} items
 * @param {string} [defaultSeverity] - "warning" or "error"
 */
function formatGitHubAnnotations(items, defaultSeverity = "warning") {
  return items
    .map((item) => {
      const severity = item.severity || defaultSeverity;
      const file = item.file || "";
      const line = item.line || 1;
      const msg = item.message
        ? `${item.key}: ${item.message}`
        : `Missing translation for ${item.key}`;
      return `::${severity} file=${file},line=${line}::${msg}`;
    })
    .join("\n");
}

/**
 * Format a upsert payload for PR comments (markdown table).
 *
 * @param {Array<{code, message, module?, context?}>} items
 * @returns {string} Markdown table
 */
function formatPRComment(items) {
  if (items.length === 0) return "No missing localizations detected.";

  const lines = [];
  lines.push(`## ${items.length} Missing Localization${items.length === 1 ? "" : "s"}`);
  lines.push("");
  lines.push("| Key | Suggested Message | Context |");
  lines.push("|-----|-------------------|---------|");

  for (const item of items) {
    const key = item.code || "";
    const msg = (item.message || "").replace(/\|/g, "\\|");
    const ctx = (item.context || item.module || "").replace(/\|/g, "\\|");
    lines.push(`| ${key} | ${msg} | ${ctx} |`);
  }

  // Add collapsible upsert payload
  lines.push("");
  lines.push("<details><summary>Upsert payload JSON</summary>");
  lines.push("");
  lines.push("```json");
  lines.push(JSON.stringify(
    items.map((i) => ({
      code: i.code,
      message: i.message,
      module: i.module || "",
      locale: i.locale || "en_IN",
    })),
    null,
    2
  ));
  lines.push("```");
  lines.push("</details>");

  return lines.join("\n");
}

/**
 * Format items using the specified format.
 *
 * @param {Array} items
 * @param {string} format - "table", "json", or "github"
 * @param {object} [options]
 */
function format(items, fmt, options = {}) {
  switch (fmt) {
    case "json":
      return formatJSON(items);
    case "github":
      return formatGitHubAnnotations(items, options.severity);
    case "pr-comment":
      return formatPRComment(items);
    case "table":
    default:
      return formatTable(items, options);
  }
}

module.exports = {
  formatTable,
  formatJSON,
  formatGitHubAnnotations,
  formatPRComment,
  format,
};
