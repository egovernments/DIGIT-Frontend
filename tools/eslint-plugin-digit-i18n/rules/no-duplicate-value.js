/**
 * Rule: digit-i18n/no-duplicate-value
 *
 * Two constants in I18N_KEYS must not map to the same localization code string.
 * Duplicate values indicate copy-paste errors or redundant definitions.
 *
 * Only runs on files matching *i18nKeyConstants* pattern.
 *
 * BAD:
 *   SAVE_BTN: "HCM_SAVE_BUTTON",
 *   SAVE_ACTION: "HCM_SAVE_BUTTON",    // duplicate value!
 *
 * GOOD:
 *   SAVE_BTN: "HCM_SAVE_BUTTON",
 *   SUBMIT_BTN: "HCM_SUBMIT_BUTTON",
 */

"use strict";

const path = require("path");

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow duplicate localization code values in I18N_KEYS constants",
      category: "Internationalization",
      recommended: true,
    },
    schema: [
      {
        type: "object",
        properties: {
          filePattern: {
            type: "string",
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      duplicateValue:
        'Duplicate localization code "{{value}}". Already defined at {{existingPath}}.',
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const filePattern = options.filePattern || "i18nKeyConstants";
    const filename = context.getFilename ? context.getFilename() : context.filename || "";
    const basename = path.basename(filename, path.extname(filename));

    if (!basename.includes(filePattern)) return {};

    // Map: string value -> { path, node }
    const seenValues = new Map();

    /**
     * Walk object expression and collect all string literal values.
     */
    function collectValues(node, parentPath) {
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

          // Only check values that look like localization codes
          if (!/^[A-Z][A-Z0-9_]{3,}$/.test(value)) continue;

          if (seenValues.has(value)) {
            const existing = seenValues.get(value);
            context.report({
              node: prop.value,
              messageId: "duplicateValue",
              data: {
                value,
                existingPath: existing.path,
              },
            });
          } else {
            seenValues.set(value, { path: fullPath, node: prop.value });
          }
        } else if (prop.value.type === "ObjectExpression") {
          collectValues(prop.value, fullPath);
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
            collectValues(decl.init, "I18N_KEYS");
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
            collectValues(decl.init, "I18N_KEYS");
          }
        }
      },
    };
  },
};
