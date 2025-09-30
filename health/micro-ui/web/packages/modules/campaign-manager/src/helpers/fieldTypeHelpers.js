/**
 * Determines the field type for a given field based on field type master data
 * @param {Object} field - The field object containing type and format properties
 * @param {Array} fieldTypeMasterData - Array of field type master data
 * @returns {string} The matched field type or "text" as default
 */
export const getFieldTypeFromMasterData = (field, fieldTypeMasterData) => {
  if (!fieldTypeMasterData || !Array.isArray(fieldTypeMasterData)) {
    return "text";
  }

  // Find matching field type based on type and format
  const matched = fieldTypeMasterData.find((item) => item?.metadata?.type === field.type && item?.metadata?.format === field.format);

  return matched?.fieldType || "text";
};