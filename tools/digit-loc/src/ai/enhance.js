/**
 * Batch enhancement prompt builder for Claude AI.
 *
 * Takes rule-based message suggestions and uses Claude to improve them
 * based on surrounding context, domain knowledge, and code patterns.
 */

"use strict";

const { queryJSON, detectBackend } = require("./claude-client");

const BATCH_SIZE = 30;

/**
 * Build the enhancement prompt for a batch of codes.
 *
 * @param {Array<{code, message, context?}>} codes - Codes with rule-based messages
 * @param {object} [options]
 * @param {string} [options.moduleName] - Module name for context
 * @param {Map<string, string>} [options.existingLocs] - Existing localizations for style reference
 * @returns {string} Prompt text
 */
function buildEnhancementPrompt(codes, options = {}) {
  const { moduleName, existingLocs } = options;

  const codeList = codes
    .map((c) => `  ${c.code}: "${c.message}"`)
    .join("\n");

  let existingSection = "";
  if (existingLocs && existingLocs.size > 0) {
    const entries = Array.from(existingLocs.entries())
      .slice(0, 50)
      .map(([k, v]) => `  ${k}: "${v}"`)
      .join("\n");
    existingSection = `
Existing localizations already in the system (for reference style/quality):
${entries}
`;
  }

  let contextSection = "";
  const contextEntries = codes
    .filter((c) => c.context && Object.keys(c.context).length > 0)
    .map((c) => {
      const ctx = c.context;
      const parts = [];
      if (ctx.fieldName) parts.push(`fieldName=${ctx.fieldName}`);
      if (ctx.fieldType) parts.push(`type=${ctx.fieldType}`);
      if (ctx.pageName) parts.push(`page=${ctx.pageName}`);
      if (ctx.componentType) parts.push(`component=${ctx.componentType}`);
      return parts.length > 0 ? `  ${c.code}: ${parts.join(", ")}` : null;
    })
    .filter(Boolean);

  if (contextEntries.length > 0) {
    contextSection = `
Code context from source files:
${contextEntries.join("\n")}
`;
  }

  return `You are a localization expert for a Health Campaign Management (HCM) mobile app used by health workers in the field.

Module: ${moduleName || "UNKNOWN"}
${existingSection}${contextSection}
These localization codes need proper human-readable messages. The current messages are auto-generated and may be poor quality.

Codes to improve:
${codeList}

Rules:
- Labels: short (1-4 words), Title Case (e.g. "Survey Date", "Lot Number")
- Error messages: clear, helpful, Sentence case (e.g. "Age is required")
- Help text: brief guidance (e.g. "Enter the batch number")
- Description text: concise 1-sentence descriptions
- Strip module/screen prefixes from messages (STOCKREPORTS_, REGISTRATION_, etc.)
- Keep domain acronyms as-is: OPV, AFP, LQA, IHM, MRN, QR, GPS, HCM
- "fieldName" type codes (camelCase): convert to readable (e.g. dateOfBirth -> "Date of Birth")
- TABLE_HEADER codes: short column headers (e.g. "Date of Entry", "Quantity")
- Match the style and quality of existing localizations when available
- If a code has an empty or whitespace-only message, keep it as a single space " "

Return ONLY valid JSON mapping code to improved message. No markdown, no explanation, no wrapping.
Example: {"CODE_1": "Better Message", "CODE_2": "Another"}`;
}

/**
 * Enhance a batch of codes using Claude AI.
 *
 * @param {Array<{code, message, context?}>} codes
 * @param {object} [options]
 * @returns {Promise<Map<string, string>>} Map of code -> improved message
 */
async function enhanceBatch(codes, options = {}) {
  const prompt = buildEnhancementPrompt(codes, options);
  const result = await queryJSON(prompt);

  if (!result || typeof result !== "object") {
    return new Map();
  }

  return new Map(Object.entries(result));
}

/**
 * Enhance all codes, processing in batches of BATCH_SIZE.
 * Falls back to rule-based messages for any codes that fail AI enhancement.
 *
 * @param {Array<{code, message, context?}>} allCodes
 * @param {object} [options]
 * @param {Function} [options.onProgress] - Called with (completed, total) after each batch
 * @returns {Promise<Array<{code, message, aiEnhanced: boolean}>>}
 */
async function enhanceAll(allCodes, options = {}) {
  const backend = detectBackend();
  if (!backend) {
    console.warn("No AI backend available — using rule-based messages only.");
    return allCodes.map((c) => ({ ...c, aiEnhanced: false }));
  }

  const results = [];
  const batches = [];

  for (let i = 0; i < allCodes.length; i += BATCH_SIZE) {
    batches.push(allCodes.slice(i, i + BATCH_SIZE));
  }

  for (let bi = 0; bi < batches.length; bi++) {
    const batch = batches[bi];

    try {
      const improved = await enhanceBatch(batch, options);

      for (const code of batch) {
        if (improved.has(code.code)) {
          results.push({
            code: code.code,
            message: improved.get(code.code),
            aiEnhanced: true,
          });
        } else {
          results.push({
            code: code.code,
            message: code.message,
            aiEnhanced: false,
          });
        }
      }
    } catch (err) {
      console.warn(`AI enhancement failed for batch ${bi + 1}: ${err.message}`);
      // Fallback: use rule-based messages
      for (const code of batch) {
        results.push({
          code: code.code,
          message: code.message,
          aiEnhanced: false,
        });
      }
    }

    if (options.onProgress) {
      options.onProgress(Math.min((bi + 1) * BATCH_SIZE, allCodes.length), allCodes.length);
    }

    // Rate limiting between batches
    if (bi + 1 < batches.length) {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  return results;
}

/**
 * Check if AI enhancement is available.
 * @returns {{ available: boolean, backend: string|null }}
 */
function checkAvailability() {
  const backend = detectBackend();
  return { available: !!backend, backend };
}

module.exports = {
  buildEnhancementPrompt,
  enhanceBatch,
  enhanceAll,
  checkAvailability,
  BATCH_SIZE,
};
