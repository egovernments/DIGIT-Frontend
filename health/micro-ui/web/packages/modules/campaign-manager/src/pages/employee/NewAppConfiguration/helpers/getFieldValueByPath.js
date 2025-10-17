/**
 * Extracts a value from a nested object using a dot-notation path
 * @param {Object} source - The source object to extract value from
 * @param {string} path - Dot-notation path (e.g., "user.profile.name")
 * @param {*} defaultValue - Default value to return if path is not found
 * @returns {*} The value at the path or defaultValue
 */
export const getFieldValueByPath = (source, path, defaultValue = "") => {
  if (!path || typeof path !== "string") return defaultValue;
  if (!path.includes(".")) return source?.[path] || defaultValue;
  const keys = path.split(".");
  let value = source;
  for (const key of keys) {
    value = value?.[key];
    if (value === undefined || value === null) return defaultValue;
  }
  return value;
};