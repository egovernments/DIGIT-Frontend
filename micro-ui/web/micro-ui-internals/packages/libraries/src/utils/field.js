/* 
 * Utility function to generate a unique field identifier or name for form fields.
 * It combines a screen-specific prefix, a unique field name, and/or an identifier.
 * 
 * @author jagankumar-egov
 *
 *
 * @example
 * 
 * Usage: Digit.Utils.getFieldIdName(fieldName = "", fieldId = "TO_OVERRIDE_ID_WITHTHIS_VALUE", screenPrefix = "TO_OVERRIDE_PREFIX_WITHTHIS_VALUE")
*/
export const getFieldIdName = (fieldName = "", fieldId = "", screenPrefix = "") => {
  // Generate a unique field name if none is provided
  fieldName = fieldName ? fieldName : generateUniqueString(10);

  // Use the provided fieldId if available, otherwise generate a sanitized HTML ID
  return fieldId
    ? fieldId
    : sanitizeToHtmlId(`${getScreenPrefix(screenPrefix)}-${fieldName}`);
};

/*
  Helper function to derive a screen-specific prefix from the current URL path.
  If a custom prefix is provided, it is used directly; otherwise, the prefix is generated
  by concatenating the last two segments of the URL path (e.g., "/parent/child").
*/
const getScreenPrefix = (prefix = "") => {
  const screenPaths = window.location.pathname
    .split("/")
    .filter(Boolean) // removes empty segments
    .slice(2); // ignores the first segment

  return prefix
    ? prefix
    : `${screenPaths.join("-")}`;
};
  
/*
  Helper function to generate a random unique string of a given length.
  Default length is 10. The string includes alphanumeric characters.
*/
const generateUniqueString = (length = 10) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
};

/*
  Sanitizes a string to be used as a valid HTML ID:
  1. Converts the string to lowercase.
  2. Replaces invalid characters (anything other than letters, numbers, hyphens, and underscores) with hyphens.
  3. Trims leading or trailing hyphens.
  4. If the input is empty or invalid, defaults to "id".
*/
const sanitizeToHtmlId = (input) => {
  if (!input) return "id"; // Default to 'id' if input is empty or invalid

  return input
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-") // Replace invalid characters with hyphens
    .replace(/^-+|-+$/g, ""); // Trim leading/trailing hyphens
};
