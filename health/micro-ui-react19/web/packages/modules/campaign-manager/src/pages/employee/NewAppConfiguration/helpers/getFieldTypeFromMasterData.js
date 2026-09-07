export const getFieldTypeFromMasterData = (field, fieldTypeMasterData) => {
  if (!fieldTypeMasterData || !Array.isArray(fieldTypeMasterData)) {
    return "text";
  }

  // Find matching field type based on type and format
  const matched = fieldTypeMasterData.find((item) => {
    const typeMatches = item?.metadata?.type === field.type;
    const formatMatches = item?.metadata?.format === field.format;

    // Special handling for custom format with fieldName
    if (field?.format === "custom" && field?.fieldName) {
      const fieldNameMatches = item?.type === field?.fieldName;
      return typeMatches && formatMatches && fieldNameMatches;
    }

    // Handle different matching scenarios:
    // 1. If field has both type and format, match both
    if (field?.format) {
      return typeMatches && formatMatches;
    }
    // 2. If field only has type, try to match where format equals the field's type
    // (e.g., field.type = "text" should match metadata: {type: "string", format: "text"})
    else {
      return typeMatches || item?.metadata?.format === field?.type;
    }
  });

  return matched?.fieldType || "text";
};

export const getAppTypeFromMasterData = (field, fieldTypeMasterData) => {
  const matched = fieldTypeMasterData.find((item) => item?.metadata?.type === field.type && item?.metadata?.format === field.format);
  return matched?.type || null;
};
export const getFieldTypeFromMasterData2 = (field, fieldTypeMasterData) => {
  if (!fieldTypeMasterData || !Array.isArray(fieldTypeMasterData)) {
    return "text";
  }

  // Find matching field type based on type, format, and fieldName
  const matched = fieldTypeMasterData.find((item) => {
    const typeMatches = item?.metadata?.type === field.type;
    const formatMatches = item?.metadata?.format === field.format;

    // Special handling for custom format with fieldName
    if (field?.format === "custom" && field?.fieldName) {
      const fieldNameMatches = item?.type === field?.fieldName;
      return typeMatches && formatMatches && fieldNameMatches;
    }

    return typeMatches && formatMatches;
  });

  return matched?.type || "text";
};

/**
 * Find the matching field type option object from master data for dropdown selection
 * Returns the full field type option object (not just the type string)
 * Used in fieldTypeDropdown to get the currently selected option
 *
 * @param {Object} selectedField - The selected field object
 * @param {Array} fieldTypeMasterData - Array of field type options from master data
 * @returns {Object|undefined} - The matched field type option object or undefined
 */
export const getFieldTypeOptionFromMasterData = (selectedField, fieldTypeMasterData) => {
  if (!fieldTypeMasterData || !Array.isArray(fieldTypeMasterData) || !selectedField) {
    return undefined;
  }

  const matched = fieldTypeMasterData.find((item) => {
    const typeMatches = item?.metadata?.type === selectedField?.type;
    const formatMatches = item?.metadata?.format === selectedField?.format;

    // Special handling for custom format with fieldName
    if (selectedField?.format === "custom" && selectedField?.fieldName) {
      const fieldNameMatches = item?.type === selectedField?.fieldName;
      return typeMatches && formatMatches && fieldNameMatches;
    }

    // Handle different matching scenarios:
    // 1. If field has both type and format, match both
    if (selectedField?.format) {
      return typeMatches && formatMatches;
    }
    // 2. If field only has type, try to match where format equals the field's type
    // (e.g., field.type = "text" should match metadata: {type: "string", format: "text"})
    else {
      return typeMatches || item?.metadata?.format === selectedField?.type;
    }
  });
  if (matched) return matched;

  // Without a match the drawer renders a blank field type AND skips the compatibleTypes
  // restriction, letting a field be converted to a type its data model can't store.
  // A custom component with no master entry of its own (e.g. fieldName "stockReconciliationCard")
  // is represented as a synthetic component entry: the drawer then shows the component name and,
  // for dynamic types, keeps the dropdown disabled.
  if (selectedField?.format === "custom" && selectedField?.fieldName) {
    return {
      type: selectedField.fieldName,
      category: "advanced",
      metadata: { type: selectedField.type, format: selectedField.format },
      fieldType: "component",
    };
  }

  // Some seeded configs use the mobile-app fieldType where the master expects a format
  // (e.g. {type: "integer", format: "number"} vs the master's number = {integer, text}),
  // so fall back to matching the format against fieldType within the same data type.
  return fieldTypeMasterData.find((item) => item?.metadata?.type === selectedField?.type && item?.fieldType === selectedField?.format);
};
