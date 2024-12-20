export const buildLocalizationMessages = (additionalProperties, moduleName, locale) => {
    if (!additionalProperties || typeof additionalProperties !== "object") return [];
  
    const transformedModuleName = tranformLocModuleName(moduleName).toLowerCase();
    const messages = [];
  
    for (const fieldName in additionalProperties) {
      if (Object.hasOwn(additionalProperties, fieldName)) {
        const fieldProps = additionalProperties[fieldName];
        const transformedLocCode = tranformLocModuleName(fieldProps?.localizationCode);
  
        if (fieldProps?.localizationCode && fieldProps?.localizationMessage) {
          messages.push({
            code: transformedLocCode,
            message: fieldProps.localizationMessage,
            module: transformedModuleName,
            locale: locale,
          });
        }
      }
    }
  
    return messages;
  };
  
  // Utility function to transform a localization module name
  export const tranformLocModuleName = (moduleName) => {
    if (!moduleName) return null;
    return moduleName.replace(/[^a-zA-Z0-9]/g, "-").toUpperCase();
  };