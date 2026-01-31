/**
 * Campaign Name Validation Utilities
 * Real-time validation functions matching the original regex from CreateCampaign.js:
 * /^(?!.*[ _-]{2})(?!^[\s_-])(?!.*[\s_-]$)(?=^[A-Za-z][A-Za-z0-9 _\-\(\)]{4,29}$)^.*$/
 *
 * MDMS rules (display text only - in order):
 * 0: Campaign name must be between 5 and 30 characters
 * 1: Campaign name must start with a letter and end with a letter or number
 * 2: Campaign name must not contain emojis or symbols
 * 3: Campaign name must not have two or more consecutive spaces, hyphens (-), or underscores (_)
 */

/**
 * Rule 0: Length between 5 and 30 characters
 * From regex: [A-Za-z][A-Za-z0-9 _\-\(\)]{4,29} = 1 + (4 to 29) = 5 to 30 chars
 */
export const isValidLength = (name) => {
  if (!name) return false;
  return name.length >= 5 && name.length <= 30;
};

/**
 * Rule 1: Must start with a letter and end with a letter or number
 * From regex: ^[A-Za-z] and (?!.*[\s_-]$)
 */
export const startsWithLetterEndsWithAlphanumeric = (name) => {
  if (!name || name.length === 0) return false;
  // Starts with letter and ends with letter or number only
  return /^[A-Za-z]/.test(name) && /[A-Za-z0-9]$/.test(name);
};

/**
 * Rule 2: Must not contain emojis or symbols
 * From regex: [A-Za-z0-9 _\-\(\)] - only these characters allowed
 */
export const noEmojisOrSymbols = (name) => {
  if (!name) return false;
  return /^[A-Za-z0-9 _\-\(\)]+$/.test(name);
};

/**
 * Rule 3: No two or more consecutive spaces, hyphens, or underscores
 * From regex: (?!.*[ _-]{2}) - any combination of space/underscore/hyphen consecutively is invalid
 */
export const noConsecutiveSpecialChars = (name) => {
  if (!name) return false;
  return !/[ _-]{2}/.test(name);
};

/**
 * Array of validation functions mapped by rule index (matching MDMS order)
 */
export const VALIDATION_FUNCTIONS = [
  isValidLength,
  startsWithLetterEndsWithAlphanumeric,
  noEmojisOrSymbols,
  noConsecutiveSpecialChars,
];

/**
 * Validate campaign name against all rules from MDMS
 */
export const validateCampaignName = (name, rules) => {
  if (!rules || !Array.isArray(rules)) return [];

  return rules.map((translationKey, index) => {
    const validator = VALIDATION_FUNCTIONS[index];
    const isValid = validator ? validator(name) : true;

    return {
      translationKey,
      index,
      isValid,
    };
  });
};

/**
 * Check if all validation rules are met
 */
export const allRulesMet = (validationResults) => {
  if (!validationResults || validationResults.length === 0) return false;
  return validationResults.every((result) => result.isValid);
};
