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
