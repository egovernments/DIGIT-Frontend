// Internal variables (not exported directly)
let MODULE_CONSTANTS = "HCM-ADMIN-CONSOLE";
let TEMPLATE_BASE_CONFIG_MASTER = "FormConfigTemplate";
let PRIMARY_COLOR = "#C84C0E";

// Exported getters
export { MODULE_CONSTANTS, TEMPLATE_BASE_CONFIG_MASTER, PRIMARY_COLOR };

// Setter function to overwrite values
export function setConstantsforAppConfig(newConfig = {}) {
  if (newConfig.MODULE_CONSTANTS !== undefined) MODULE_CONSTANTS = newConfig.MODULE_CONSTANTS;
  if (newConfig.TEMPLATE_BASE_CONFIG_MASTER !== undefined) TEMPLATE_BASE_CONFIG_MASTER = newConfig.TEMPLATE_BASE_CONFIG_MASTER;
  if (newConfig.PRIMARY_COLOR !== undefined) PRIMARY_COLOR = newConfig.PRIMARY_COLOR;
}