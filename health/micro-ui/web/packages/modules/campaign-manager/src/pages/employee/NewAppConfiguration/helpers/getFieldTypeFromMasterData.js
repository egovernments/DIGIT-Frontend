export const getFieldTypeFromMasterData = (field, fieldTypeMasterData) => {
  if (!fieldTypeMasterData || !Array.isArray(fieldTypeMasterData)) {
    return "text";
  }

  // Find matching field type based on type and format
  const matched = fieldTypeMasterData.find((item) => {
    const typeMatches = item?.metadata?.type === field.type;
    const formatMatches = item?.metadata?.format === field.format;

    // Handle different matching scenarios:
    // 1. If field has both type and format, match both
    if (field?.format) {
      return typeMatches && formatMatches;
    }
    // 2. If field only has type, try to match where format equals the field's type
    // (e.g., field.type = "text" should match metadata: {type: "string", format: "text"})
    else {
      return typeMatches || (item?.metadata?.format === field?.type);
    }
  });

  return matched?.fieldType || "text";
};