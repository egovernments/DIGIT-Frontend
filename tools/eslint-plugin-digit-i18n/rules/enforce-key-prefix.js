/**
 * Rule: digit-i18n/enforce-key-prefix
 *
 * Key values defined in i18nKeyConstants.js must start with the correct
 * module prefix (e.g., HCM_, DIGIT_CAMPAIGN_, etc.).
 *
 * Only runs on files matching *i18nKeyConstants* pattern.
 *
 * BAD:  SAVE_BUTTON: "SAVE_BUTTON"          // no module prefix
 * GOOD: SAVE_BUTTON: "HCM_CAMPAIGN_SAVE_BUTTON"  // has module prefix
 */

"use strict";

const path = require("path");

module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Key values in i18nKeyConstants must start with the module prefix",
      category: "Internationalization",
      recommended: true,
    },
    schema: [
      {
        type: "object",
        properties: {
          // Expected prefix(es). If not set, attempts auto-detection from file path.
          prefixes: {
            type: "array",
            items: { type: "string" },
          },
          // File pattern to match (default: files containing "i18nKeyConstants")
          filePattern: {
            type: "string",
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      missingPrefix:
        'Key value "{{value}}" should start with a module prefix (e.g., "{{suggestedPrefix}}"). Found in constant {{name}}.',
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const filePattern = options.filePattern || "i18nKeyConstants";
    const filename = context.getFilename ? context.getFilename() : context.filename || "";
    const basename = path.basename(filename, path.extname(filename));

    // Only run on key constants files
    if (!basename.includes(filePattern)) return {};

    // Determine expected prefixes
    let prefixes = options.prefixes || [];

    if (prefixes.length === 0) {
      // Auto-detect from directory path
      // e.g., packages/modules/campaign-manager -> HCM_CAMPAIGN_
      // e.g., packages/modules/health -> HCM_
      const parts = filename.replace(/\\/g, "/").split("/");
      const modulesIdx = parts.indexOf("modules");
      if (modulesIdx >= 0 && modulesIdx + 1 < parts.length) {
        const moduleName = parts[modulesIdx + 1];
        const prefix = moduleName
          .replace(/-/g, "_")
          .toUpperCase();
        prefixes = [`HCM_${prefix}_`, `HCM_`, `DIGIT_${prefix}_`, `DIGIT_`];
      } else {
        // Fallback: allow HCM_ and DIGIT_ prefixes
        prefixes = ["HCM_", "DIGIT_", "COMMON_"];
      }
    }

    /**
     * Check if a string value has a valid prefix.
     */
    function hasValidPrefix(value) {
      return prefixes.some((p) => value.startsWith(p));
    }

    /**
     * Walk an object expression looking for string literal values
     * that should be localization codes.
     */
    function checkObjectExpression(node, parentName) {
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

        const fullName = parentName ? `${parentName}.${propName}` : propName;

        if (prop.value.type === "Literal" && typeof prop.value.value === "string") {
          const value = prop.value.value;

          // Only check values that look like localization codes
          if (/^[A-Z][A-Z0-9_]{3,}$/.test(value) && !hasValidPrefix(value)) {
            context.report({
              node: prop.value,
              messageId: "missingPrefix",
              data: {
                value,
                suggestedPrefix: prefixes[0] || "MODULE_",
                name: fullName,
              },
            });
          }
        } else if (prop.value.type === "ObjectExpression") {
          checkObjectExpression(prop.value, fullName);
        }
      }
    }

    return {
      // export const I18N_KEYS = { ... }
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

      // const I18N_KEYS = { ... }
      VariableDeclaration(node) {
        // Skip if this was already handled as an export
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
