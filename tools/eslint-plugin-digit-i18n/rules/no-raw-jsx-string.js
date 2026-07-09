/**
 * Rule: digit-i18n/no-raw-jsx-string
 *
 * Flags hardcoded user-facing strings in JSX. Developers should use t()
 * with an I18N_KEYS constant instead of embedding raw text.
 *
 * BAD:  <p>Save Changes</p>
 * BAD:  <input placeholder="Enter name" />
 * GOOD: <p>{t(I18N_KEYS.COMMON.SAVE)}</p>
 * GOOD: <input placeholder={t(I18N_KEYS.FORM.NAME_PLACEHOLDER)} />
 */

"use strict";

const {
  isNonTextContent,
  isNonTextComponent,
  isUserFacingAttribute,
  isInsideNonTextAncestor,
  isInsideTemplateLiteral,
} = require("../utils/jsx-helpers");

module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Disallow hardcoded user-facing strings in JSX; use t() with I18N_KEYS instead",
      category: "Internationalization",
      recommended: true,
    },
    schema: [
      {
        type: "object",
        properties: {
          // Additional attribute names to treat as user-facing
          extraAttributes: {
            type: "array",
            items: { type: "string" },
          },
          // Strings to ignore (e.g., brand names that shouldn't be translated)
          ignoreStrings: {
            type: "array",
            items: { type: "string" },
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      rawJsxText:
        "Hardcoded string \"{{text}}\" in JSX. Use t() with a key from I18N_KEYS instead.",
      rawJsxAttribute:
        "Hardcoded string in '{{attr}}' attribute. Use t() with a key from I18N_KEYS instead.",
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const ignoreStrings = new Set(options.ignoreStrings || []);
    const extraAttributes = new Set(options.extraAttributes || []);

    function shouldIgnore(text) {
      if (isNonTextContent(text)) return true;
      if (ignoreStrings.has(text.trim())) return true;
      return false;
    }

    function isUserFacingAttr(name) {
      if (extraAttributes.has(name)) return true;
      return isUserFacingAttribute(name);
    }

    return {
      // Detect: <p>Hello World</p>
      JSXText(node) {
        const text = node.value;
        if (shouldIgnore(text)) return;
        if (isInsideNonTextAncestor(node)) return;

        // Check that the parent JSX element is not a non-text component
        if (
          node.parent &&
          node.parent.type === "JSXElement" &&
          node.parent.openingElement &&
          isNonTextComponent(node.parent.openingElement)
        ) {
          return;
        }

        const trimmed = text.trim();
        const display = trimmed.length > 40 ? trimmed.substring(0, 37) + "..." : trimmed;

        context.report({
          node,
          messageId: "rawJsxText",
          data: { text: display },
        });
      },

      // Detect: <input placeholder="Enter name" />
      JSXAttribute(node) {
        if (!node.name || node.name.type !== "JSXIdentifier") return;
        const attrName = node.name.name;

        if (!isUserFacingAttr(attrName)) return;

        // String literal attribute: placeholder="text"
        if (node.value && node.value.type === "Literal" && typeof node.value.value === "string") {
          const text = node.value.value;
          if (shouldIgnore(text)) return;

          context.report({
            node: node.value,
            messageId: "rawJsxAttribute",
            data: { attr: attrName },
          });
          return;
        }

        // JSX expression with a string literal: placeholder={"text"}
        if (
          node.value &&
          node.value.type === "JSXExpressionContainer" &&
          node.value.expression &&
          node.value.expression.type === "Literal" &&
          typeof node.value.expression.value === "string"
        ) {
          const text = node.value.expression.value;
          if (shouldIgnore(text)) return;

          context.report({
            node: node.value.expression,
            messageId: "rawJsxAttribute",
            data: { attr: attrName },
          });
          return;
        }

        // Template literal in attribute: placeholder={`Enter ${name}`}
        if (
          node.value &&
          node.value.type === "JSXExpressionContainer" &&
          node.value.expression &&
          node.value.expression.type === "TemplateLiteral"
        ) {
          const quasis = node.value.expression.quasis || [];
          const hasText = quasis.some(
            (q) => q.value && q.value.raw && q.value.raw.trim().length > 0
          );
          if (hasText) {
            context.report({
              node: node.value.expression,
              messageId: "rawJsxAttribute",
              data: { attr: attrName },
            });
          }
        }
      },
    };
  },
};
