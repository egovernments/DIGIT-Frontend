/**
 * Claude AI client for enhanced message generation.
 *
 * Supports two modes:
 * 1. Claude CLI (local): Uses `claude` command-line tool (for developer workstations)
 * 2. Anthropic API (CI): Uses ANTHROPIC_API_KEY env var (for GitHub Actions)
 *
 * Reuses patterns from form-config-corrector/corrector.js
 */

"use strict";

const { execSync, spawnSync } = require("child_process");

const CLAUDE_MODEL = "claude-sonnet-4-20250514";
const MAX_TOKENS = 4096;
const TIMEOUT_MS = 120000;

/**
 * Check if Claude CLI is installed and available.
 * @returns {string|null} Version string or null
 */
function isClaudeCliInstalled() {
  try {
    const r = spawnSync("claude", ["--version"], {
      encoding: "utf-8",
      timeout: 10000,
      shell: true,
    });
    return r.status === 0 ? (r.stdout || "").trim() : null;
  } catch {
    return null;
  }
}

/**
 * Check if the Anthropic API key is configured.
 * @returns {boolean}
 */
function hasApiKey() {
  return !!process.env.ANTHROPIC_API_KEY;
}

/**
 * Determine the best available AI backend.
 * @returns {"cli"|"api"|null}
 */
function detectBackend() {
  if (hasApiKey()) return "api";
  if (isClaudeCliInstalled()) return "cli";
  return null;
}

/**
 * Call Claude via the CLI tool.
 *
 * @param {string} prompt - The prompt to send
 * @returns {string} Response text
 */
function callClaude(prompt) {
  const r = spawnSync("claude", ["-p", "--output-format", "text"], {
    input: prompt,
    encoding: "utf-8",
    timeout: TIMEOUT_MS,
    shell: true,
    maxBuffer: 4 * 1024 * 1024,
  });

  if (r.status !== 0) {
    throw new Error(`Claude CLI error: ${r.stderr || `exit code ${r.status}`}`);
  }

  let text = (r.stdout || "").trim();
  // Strip markdown code fences
  text = text.replace(/^```(?:json)?\s*\n?/gm, "").replace(/\n?```\s*$/gm, "").trim();
  return text;
}

/**
 * Call Claude via the Anthropic HTTP API.
 *
 * @param {string} prompt - The prompt to send
 * @returns {Promise<string>} Response text
 */
async function callClaudeApi(prompt) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY environment variable not set");

  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: MAX_TOKENS,
      messages: [
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`Anthropic API error ${resp.status}: ${errText}`);
  }

  const data = await resp.json();
  let text = (data.content?.[0]?.text || "").trim();
  text = text.replace(/^```(?:json)?\s*\n?/gm, "").replace(/\n?```\s*$/gm, "").trim();
  return text;
}

/**
 * Parse JSON from Claude's response text.
 * Handles cases where Claude wraps JSON in explanation text.
 *
 * @param {string} text - Raw response text
 * @returns {object|null} Parsed JSON or null
 */
function safeParseJSON(text) {
  // Try direct parse first
  try { return JSON.parse(text); } catch {}

  // Extract JSON object
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) return null;

  try { return JSON.parse(m[0]); } catch {}

  // Try progressively trimming from the end
  let s = m[0];
  for (let i = s.length; i > 0; i--) {
    try { return JSON.parse(s.substring(0, i)); } catch {}
  }

  return null;
}

/**
 * Send a prompt and get a parsed JSON response.
 * Automatically selects the best available backend.
 *
 * @param {string} prompt - The prompt
 * @returns {Promise<object|null>} Parsed JSON response
 */
async function queryJSON(prompt) {
  const backend = detectBackend();

  if (!backend) {
    throw new Error(
      "No AI backend available. Install Claude CLI or set ANTHROPIC_API_KEY."
    );
  }

  let text;
  if (backend === "api") {
    text = await callClaudeApi(prompt);
  } else {
    text = callClaude(prompt);
  }

  return safeParseJSON(text);
}

module.exports = {
  isClaudeCliInstalled,
  hasApiKey,
  detectBackend,
  callClaude,
  callClaudeApi,
  safeParseJSON,
  queryJSON,
};
