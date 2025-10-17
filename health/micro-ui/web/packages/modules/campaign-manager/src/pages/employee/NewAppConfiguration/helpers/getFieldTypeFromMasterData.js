export const getFieldTypeFromMasterData = (field, fieldTypeMasterData) => {
  console.log("getFieldTypeFromMasterData", { field, fieldTypeMasterData });
  if (!fieldTypeMasterData || !Array.isArray(fieldTypeMasterData)) {
    return "text";
  }

    // Special check for template type fields
  // Match by metadata.type === field.type AND fieldType === field.fieldName
  if (field.type === "template" && field.fieldName) {
    const templateMatch = fieldTypeMasterData.find(
      (item) => item?.metadata?.type === field.type && item?.metadata?.format === field.format && item?.fieldType === field.fieldName
    );
    if (templateMatch?.fieldType) {
      console.log("Template match found:", templateMatch.fieldType);
      return templateMatch.fieldType;
    }
  }

  // Find matching field type based on type and format
  const matched = fieldTypeMasterData.find((item) => item?.metadata?.type === field.type && item?.metadata?.format === field.format);

  return matched?.fieldType || "text";
};