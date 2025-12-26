/**
 * Helper utilities for working with field type master properties
 */

/**
 * Get the field type config from master data by format
 * @param {string} format - The format to search for (e.g., "card", "row", "column")
 * @param {Array} fieldTypeMasterData - Array of field type configurations
 * @returns {Object|null} - The matching field type config or null
 */
export const getFieldTypeConfig = (format, fieldTypeMasterData) => {
  if (!format || !fieldTypeMasterData || fieldTypeMasterData.length === 0) {
    return null;
  }

  return fieldTypeMasterData.find(
    (item) => item?.metadata?.format === format
  );
};

/**
 * Get property options from field type config
 * @param {string} format - The format (e.g., "card", "tag")
 * @param {string} propertyCode - The property code (e.g., "cardType", "tagType")
 * @param {Array} fieldTypeMasterData - Array of field type configurations
 * @returns {Array} - Array of options or empty array
 */
export const getPropertyOptions = (format, propertyCode, fieldTypeMasterData) => {
  const fieldTypeConfig = getFieldTypeConfig(format, fieldTypeMasterData);
  
  if (!fieldTypeConfig || !fieldTypeConfig.properties) {
    return [];
  }

  const property = fieldTypeConfig.properties.find(p => p.code === propertyCode);
  return property?.options || [];
};

/**
 * Get allowed children formats for a layout component
 * @param {string} format - The parent format (e.g., "Row", "Column", "card")
 * @param {Array} fieldTypeMasterData - Array of field type configurations
 * @returns {Array} - Array of allowed child formats or empty array (empty means all allowed)
 */
export const getAllowedChildren = (format, fieldTypeMasterData) => {
  return getPropertyOptions(format, "children", fieldTypeMasterData);
};

/**
 * Validate if a child format is allowed for a parent
 * @param {string} parentFormat - The parent format
 * @param {string} childFormat - The child format
 * @param {Array} fieldTypeMasterData - Array of field type configurations
 * @returns {boolean} - True if allowed or no restrictions defined
 */
export const isChildAllowed = (parentFormat, childFormat, fieldTypeMasterData) => {
  const allowedChildren = getAllowedChildren(parentFormat, fieldTypeMasterData);
  
  // If no children restriction defined, allow all
  if (allowedChildren.length === 0) {
    return true;
  }

  return allowedChildren.includes(childFormat);
};

/**
 * Get the component name from field type config
 * @param {string} format - The format
 * @param {Array} fieldTypeMasterData - Array of field type configurations
 * @returns {string|null} - Component name or null
 */
export const getComponentName = (format, fieldTypeMasterData) => {
  const fieldTypeConfig = getFieldTypeConfig(format, fieldTypeMasterData);
  return fieldTypeConfig?.component || null;
};

export const isEditableComponent = (format, fieldTypeMasterData) => {
  const fieldTypeConfig = getFieldTypeConfig(format, fieldTypeMasterData);  
  // If fieldTypeConfig.editable is explicitly false, return false
  if (fieldTypeConfig?.editable === false) {
    return false;
  }
  
  // Otherwise, return true (editable is true or undefined)
  return true;
};

/**
 * Get default value for a property
 * @param {string} format - The format
 * @param {string} propertyCode - The property code
 * @param {Array} fieldTypeMasterData - Array of field type configurations
 * @returns {any} - The first option as default or null
 */
export const getDefaultPropertyValue = (format, propertyCode, fieldTypeMasterData) => {
  const options = getPropertyOptions(format, propertyCode, fieldTypeMasterData);
  return null;
};

/**
 * Validate property value against allowed options
 * @param {string} format - The format
 * @param {string} propertyCode - The property code
 * @param {any} value - The value to validate
 * @param {Array} fieldTypeMasterData - Array of field type configurations
 * @returns {boolean} - True if valid or no restrictions
 */
export const isValidPropertyValue = (format, propertyCode, value, fieldTypeMasterData) => {
  const options = getPropertyOptions(format, propertyCode, fieldTypeMasterData);
  
  // If no options defined, accept any value
  if (options.length === 0) {
    return true;
  }

  return options.includes(value);
};

/**
 * Get property value from field with fallback to default
 * Checks both field.properties and field.additionalProps
 * @param {Object} field - The field object
 * @param {string} propertyCode - The property code
 * @param {Array} fieldTypeMasterData - Array of field type configurations
 * @returns {any} - The property value or default
 */
export const getFieldPropertyValue = (field, propertyCode, fieldTypeMasterData) => {
  // Check field.properties first
  const fromProperties = field?.properties?.[propertyCode];
  if (fromProperties !== undefined) {
    return fromProperties;
  }

  // Check field.additionalProps
  const fromAdditionalProps = field?.additionalProps?.[propertyCode];
  if (fromAdditionalProps !== undefined) {
    return fromAdditionalProps;
  }

  // Fallback to default from master config
  return getDefaultPropertyValue(field?.format, propertyCode, fieldTypeMasterData);
};

/**
 * Get all properties for a field type
 * @param {string} format - The format
 * @param {Array} fieldTypeMasterData - Array of field type configurations
 * @returns {Array} - Array of property definitions
 */
export const getFieldTypeProperties = (format, fieldTypeMasterData) => {
  const fieldTypeConfig = getFieldTypeConfig(format, fieldTypeMasterData);
  return fieldTypeConfig?.properties || [];
};
