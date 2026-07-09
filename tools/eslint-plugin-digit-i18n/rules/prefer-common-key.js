/**
 * Rule: digit-i18n/prefer-common-key
 *
 * Warns when a module defines its own localization key for a concept that
 * should come from the common/shared module (e.g., SAVE, CANCEL, SEARCH).
 *
 * Only runs on files matching *i18nKeyConstants* pattern.
 *
 * BAD (in campaign-manager's constants):
 *   CANCEL_BTN: "HCM_CAMPAIGN_CANCEL"    // CANCEL is a common concept
 *
 * GOOD:
 *   // Import from common: I18N_KEYS_COMMON.CANCEL
 *   // Or reference the common key: "COMMON_CANCEL"
 */

"use strict";

const path = require("path");
const { COMMON_KEY_PATTERNS } = require("../utils/i18n-constants-parser");

module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Prefer keys from the common module for generic concepts like SAVE, CANCEL, etc.",
      category: "Internationalization",
      recommended: true,
    },
    schema: [
      {
        type: "object",
        properties: {
          // Additional common words to flag
          extraCommonWords: {
            type: "array",
            items: { type: "string" },
          },
          // Patterns to consider "common" (file path patterns for common modules)
          commonFilePatterns: {
            type: "array",
            items: { type: "string" },
          },
          filePattern: {
            type: "string",
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      preferCommon:
        '"{{word}}" is a common concept. Consider using the shared common module key instead of defining "{{value}}" in this module.',
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const filePattern = options.filePattern || "i18nKeyConstants";
    const filename = context.getFilename ? context.getFilename() : context.filename || "";
    const basename = path.basename(filename, path.extname(filename));

    if (!basename.includes(filePattern)) return {};

    // If this IS the common module's constants file, don't flag anything
    const commonPatterns = options.commonFilePatterns || ["common", "shared"];
    const normalizedPath = filename.replace(/\\/g, "/").toLowerCase();
    const isCommonModule = commonPatterns.some((p) => normalizedPath.includes(p));
    if (isCommonModule) return {};

    const commonWords = new Set([
      ...COMMON_KEY_PATTERNS,
      ...(options.extraCommonWords || []).map((w) => w.toUpperCase()),
    ]);

    /**
     * Check if a key value represents a "common" concept by checking if
     * the trailing portion (after module prefix) exactly matches a common word.
     */
    function findCommonWord(value) {
      // Strip known module prefixes to get the semantic part
      const stripped = value
        .replace(/^(HCM_|DIGIT_|APPONE_|APP_CONFIG_|CLF_)/, "")
        .replace(/^[A-Z]+_/, ""); // Strip any remaining module prefix

      // Check if the remaining value is exactly a common word
      if (commonWords.has(stripped)) return stripped;

      // Check if the value ends with a common word (e.g., HCM_CAMPAIGN_SAVE -> SAVE)
      const parts = value.split("_");
      const lastPart = parts[parts.length - 1];
      if (commonWords.has(lastPart)) return lastPart;

      // Check last two parts (e.g., GO_BACK)
      if (parts.length >= 2) {
        const lastTwo = parts.slice(-2).join("_");
        if (commonWords.has(lastTwo)) return lastTwo;
      }

      return null;
    }

    function checkObjectExpression(node, parentPath) {
      if (!node || node.type !== "ObjectExpression") return;

      for (const prop of node.properties) {
        if (prop.type === "SpreadElement") continue;

        const propName =
          prop.key.type === "Identifier"
            ? prop.key.name
            : prop.key.type === "Literal"
            ? String(prop.key.value)
            : null;

        if (!propName) continue;

        const fullPath = parentPath ? `${parentPath}.${propName}` : propName;

        if (prop.value.type === "Literal" && typeof prop.value.value === "string") {
          const value = prop.value.value;
          if (!/^[A-Z][A-Z0-9_]{3,}$/.test(value)) continue;

          // Skip values that already reference the common module
          if (value.startsWith("COMMON_") || value.startsWith("DIGIT_COMMON_")) continue;

          const commonWord = findCommonWord(value);
          if (commonWord) {
            context.report({
              node: prop.value,
              messageId: "preferCommon",
              data: {
                word: commonWord,
                value,
              },
            });
          }
        } else if (prop.value.type === "ObjectExpression") {
          checkObjectExpression(prop.value, fullPath);
        }
      }
    }

    return {
      ExportNamedDeclaration(node) {
        if (!node.declaration || node.declaration.type !== "VariableDeclaration") return;
        for (const decl of node.declaration.declarations) {
          if (
            decl.id &&
            decl.id.name === "I18N_KEYS" &&
            decl.init &&
            decl.init.type === "ObjectExpression"
          ) {
            checkObjectExpression(decl.init, "I18N_KEYS");
          }
        }
      },

      VariableDeclaration(node) {
        if (node.parent && node.parent.type === "ExportNamedDeclaration") return;
        for (const decl of node.declarations) {
          if (
            decl.id &&
            decl.id.name === "I18N_KEYS" &&
            decl.init &&
            decl.init.type === "ObjectExpression"
          ) {
            checkObjectExpression(decl.init, "I18N_KEYS");
          }
        }
      },
    };
  },
};
