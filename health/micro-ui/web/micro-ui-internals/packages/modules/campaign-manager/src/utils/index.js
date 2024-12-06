import _ from "lodash";
import { downloadExcelWithCustomName } from "./downloadExcel";

export default {
  downloadExcelWithCustomName,
  getModuleName: () => {
    return window?.Digit?.Customizations?.commonUiConfig?.["HCM_MODULE_NAME"] || "console";
  },
};
export { downloadExcelWithCustomName };
export const PRIMARY_COLOR = "#C84C0E";
