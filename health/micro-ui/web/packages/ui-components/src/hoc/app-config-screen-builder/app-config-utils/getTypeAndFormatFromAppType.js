export const getTypeAndFormatFromAppType = (field, fieldTypeMasterData = []) => {
  if (!field.appType) return {};
  const matched = fieldTypeMasterData.find((item) => item.type === field.appType);
  if (!matched) return {};
  const result = {
    type: matched.metadata?.type,
    format: matched.metadata?.format,
  };
  // Handle attributeToRename: { targetKey: sourceKey }
  if (matched.attributeToRename) {
    Object.entries(matched.attributeToRename).forEach(([targetKey, sourceKey]) => {
      if (sourceKey === "validations" || targetKey === "validations") {
        return;
      } else {
        result[sourceKey] = field[targetKey];
      }
    });
  }
  return result;
}; 