/**
 * Builds localization messages for the MDMS submission process.
 * Used when creating new complaint types from the workbench to handle localization upserts.
 * 
 * @param {Object} additionalProperties - The properties containing localization data
 * @param {string} moduleName - The name of the module to be localized
 * @param {string} locale - The locale identifier
 * @returns {Array<Object>} Array of localization message objects
 */
export const buildLocalizationMessages = (additionalProperties, moduleName, locale) => {
    if (!additionalProperties || typeof additionalProperties !== "object") return [];
  
    const transformedModuleName = tranformLocModuleName(moduleName).toLowerCase();
    const messages = [];
  
    for (const fieldName in additionalProperties) {
      if (Object.hasOwn(additionalProperties, fieldName)) {
        const fieldProps = additionalProperties[fieldName] || {};
        const { localizationCode, localizationMessage } = fieldProps;
        const transformedLocCode = tranformLocModuleName(localizationCode);

        if (localizationCode && localizationMessage) {
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