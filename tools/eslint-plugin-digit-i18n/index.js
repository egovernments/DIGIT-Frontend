/**
 * eslint-plugin-digit-i18n
 *
 * ESLint plugin for DIGIT localization enforcement.
 * Catches hardcoded strings, requires constant-based keys, enforces naming
 * conventions, prevents duplicates, and encourages common module reuse.
 *
 * Usage in eslintConfig:
 *   "extends": ["plugin:digit-i18n/recommended"]
 *
 * Or individually:
 *   "plugins": ["digit-i18n"],
 *   "rules": { "digit-i18n/no-raw-jsx-string": "warn" }
 */

"use strict";

const noRawJsxString = require("./rules/no-raw-jsx-string");
const requireConstantKey = require("./rules/require-constant-key");
const enforceKeyPrefix = require("./rules/enforce-key-prefix");
const noDuplicateValue = require("./rules/no-duplicate-value");
const preferCommonKey = require("./rules/prefer-common-key");

const rules = {
  "no-raw-jsx-string": noRawJsxString,
  "require-constant-key": requireConstantKey,
  "enforce-key-prefix": enforceKeyPrefix,
  "no-duplicate-value": noDuplicateValue,
  "prefer-common-key": preferCommonKey,
};

const configs = {
  recommended: {
    plugins: ["digit-i18n"],
    rules: {
      "digit-i18n/no-raw-jsx-string": "warn",
      "digit-i18n/require-constant-key": "warn",
      "digit-i18n/enforce-key-prefix": "warn",
      "digit-i18n/no-duplicate-value": "error",
      "digit-i18n/prefer-common-key": "warn",
    },
  },
};

module.exports = { rules, configs };
