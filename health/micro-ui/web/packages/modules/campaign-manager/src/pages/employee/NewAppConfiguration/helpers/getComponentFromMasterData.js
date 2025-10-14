/**
 * Fetches the component from fieldTypeMasterData based on field type and format
 * @param {Object} field - The field object containing type and format
 * @param {Array} fieldTypeMasterData - The master data array containing field type configurations
 * @returns {string|null} - The component name or null if not found
 */
export const getComponentFromMasterData = (field, fieldTypeMasterData = []) => {
  if (!fieldTypeMasterData || !Array.isArray(fieldTypeMasterData)) {
    return null;
  }
  const matched = fieldTypeMasterData.find((item) => item?.metadata?.type === field.type && item?.metadata?.format === field.format);

  return matched?.component || null;
};
