/**
 * Extracts a value from a nested object using a dot-notation path
 * @param {Object} source - The source object to extract value from
 * @param {string} path - Dot-notation path (e.g., "user.profile.name")
 * @param {*} defaultValue - Default value to return if path is not found
 * @returns {*} The value at the path or defaultValue
 */
export const getFieldValueByPath = (source, path, defaultValue = "") => {
  if (!path || typeof path !== "string") return defaultValue;
  
  // Check if path is "hidden" or contains ".hidden"
  const isHiddenField = path === "hidden" || path.includes(".hidden");
  
  // Get the actual value from the source
  let value;
  if (!path.includes(".")) {
    value = source?.[path];
  } else {
    const keys = path.split(".");
    value = source;
    for (const key of keys) {
      value = value?.[key];
      if (value === undefined || value === null) {
        value = defaultValue;
        break;
      }
    }
  }
  
  // Handle undefined/null values
  if (value === undefined || value === null) {
    value = defaultValue;
  }
  
  // For hidden fields, invert the boolean value
  // hidden: true → return false (toggle OFF)
  // hidden: false → return true (toggle ON)
  if (isHiddenField && typeof value === "boolean") {
    return !value;
  }
  
  return value;
};