/**
 * Rule: digit-i18n/require-constant-key
 *
 * Require t() calls to use I18N_KEYS constants instead of string literals.
 * This ensures all localization keys are centrally defined and discoverable.
 *
 * BAD:  t("HCM_SAVE_BUTTON")
 * GOOD: t(I18N_KEYS.COMMON.SAVE_BUTTON)
 *
 * Also catches useTranslation patterns like:
 *   const { t } = useTranslation();
 *   t("RAW_KEY")
 */

"use strict";

module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Require t() calls to use I18N_KEYS constants instead of raw string literals",
      category: "Internationalization",
      recommended: true,
    },
    schema: [
      {
        type: "object",
        properties: {
          // Names of translation functions to check (default: ["t"])
          translationFunctions: {
            type: "array",
            items: { type: "string" },
          },
          // Name of the constants object (default: "I18N_KEYS")
          constantsObjectName: {
            type: "string",
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      useConstant:
        'Use I18N_KEYS constant instead of string literal "{{key}}" in {{fn}}() call.',
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const translationFunctions = new Set(options.translationFunctions || ["t"]);
    const constantsName = options.constantsObjectName || "I18N_KEYS";

    /**
     * Check if a node is a reference to the constants object.
     * Matches: I18N_KEYS.X.Y, I18N_KEYS["X"]["Y"], etc.
     */
    function isConstantsReference(node) {
      if (!node) return false;
      if (node.type === "MemberExpression") {
        return isConstantsReference(node.object);
      }
      if (node.type === "Identifier" && node.name === constantsName) {
        return true;
      }
      return false;
    }

    /**
     * Check if this is a translation function call: t(...), i18nT(...)
     */
    function isTranslationCall(node) {
      if (node.type !== "CallExpression") return false;

      const callee = node.callee;

      // Direct call: t("KEY")
      if (callee.type === "Identifier" && translationFunctions.has(callee.name)) {
        return callee.name;
      }

      // Member call: this.t("KEY"), props.t("KEY")
      if (
        callee.type === "MemberExpression" &&
        callee.property.type === "Identifier" &&
        translationFunctions.has(callee.property.name)
      ) {
        return callee.property.name;
      }

      return null;
    }

    return {
      CallExpression(node) {
        const fnName = isTranslationCall(node);
        if (!fnName) return;

        // Check the first argument
        const firstArg = node.arguments[0];
        if (!firstArg) return;

        // String literal: t("HCM_SAVE")
        if (firstArg.type === "Literal" && typeof firstArg.value === "string") {
          const key = firstArg.value;
          // Only flag strings that look like localization codes
          if (/^[A-Z][A-Z0-9_]*$/.test(key) && key.length > 2) {
            context.report({
              node: firstArg,
              messageId: "useConstant",
              data: { key, fn: fnName },
            });
          }
          return;
        }

        // Template literal with no expressions: t(`HCM_SAVE`)
        if (
          firstArg.type === "TemplateLiteral" &&
          firstArg.expressions.length === 0 &&
          firstArg.quasis.length === 1
        ) {
          const key = firstArg.quasis[0].value.raw;
          if (/^[A-Z][A-Z0-9_]*$/.test(key) && key.length > 2) {
            context.report({
              node: firstArg,
              messageId: "useConstant",
              data: { key, fn: fnName },
            });
          }
          return;
        }

        // If the argument is already a constants reference, it's fine
        if (isConstantsReference(firstArg)) return;

        // Template literal with expressions: t(`HCM_${module}_SAVE`)
        // These are dynamic keys — can't easily be replaced with constants,
        // so we don't flag them to avoid false positives.
      },
    };
  },
};
