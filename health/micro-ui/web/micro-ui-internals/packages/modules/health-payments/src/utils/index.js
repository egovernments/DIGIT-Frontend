import _ from "lodash";
import axios from "axios";
import { CustomisedHooks } from "../hooks";



export const overrideHooks = () => {
  Object.keys(CustomisedHooks).map((ele) => {
    if (ele === "Hooks") {
      Object.keys(CustomisedHooks[ele]).map((hook) => {
        Object.keys(CustomisedHooks[ele][hook]).map((method) => {
          setupHooks(hook, method, CustomisedHooks[ele][hook][method]);
        });
      });
    } else if (ele === "Utils") {
      Object.keys(CustomisedHooks[ele]).map((hook) => {
        Object.keys(CustomisedHooks[ele][hook]).map((method) => {
          setupHooks(hook, method, CustomisedHooks[ele][hook][method], false);
        });
      });
    } else {
      Object.keys(CustomisedHooks[ele]).map((method) => {
        setupLibraries(ele, method, CustomisedHooks[ele][method]);
      });
    }
  });
};
const setupHooks = (HookName, HookFunction, method, isHook = true) => {
  window.Digit = window.Digit || {};
  window.Digit[isHook ? "Hooks" : "Utils"] = window.Digit[isHook ? "Hooks" : "Utils"] || {};
  window.Digit[isHook ? "Hooks" : "Utils"][HookName] = window.Digit[isHook ? "Hooks" : "Utils"][HookName] || {};
  window.Digit[isHook ? "Hooks" : "Utils"][HookName][HookFunction] = method;
};
/* To Overide any existing libraries  we need to use similar method */
const setupLibraries = (Library, service, method) => {
  window.Digit = window.Digit || {};
  window.Digit[Library] = window.Digit[Library] || {};
  window.Digit[Library][service] = method;
};

/* To Overide any existing config/middlewares  we need to use similar method */
export const updateCustomConfigs = () => {
  setupLibraries("Customizations", "commonUiConfig", { ...window?.Digit?.Customizations?.commonUiConfig });
  // setupLibraries("Utils", "parsingUtils", { ...window?.Digit?.Utils?.parsingUtils, ...parsingUtils });
};

/// Util function to downloads files with type as pdf or excel
export const downloadFileWithName = ({ fileStoreId = null, customName = null, type = "excel" }) => {
  const downloadFile = (blob, fileName, extension) => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}.${extension}`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 7000);
  };

  if (fileStoreId) {
    const fileTypeMapping = {
      excel: {
        mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        extension: "xlsx",
      },
      pdf: {
        mimeType: "application/pdf",
        extension: "pdf",
      },
      png: {
        mimeType: "image/png",
        extension: "png",
      },
      jpg: {
        mimeType: "image/jpeg",
        extension: "jpg",
      },
      jpeg: {
        mimeType: "image/jpeg",
        extension: "jpeg",
      },
    };

    const { mimeType, extension } = fileTypeMapping[type] || fileTypeMapping["excel"]; // Default to Excel if type is invalid

    axios
      .get("/filestore/v1/files/id", {
        responseType: "arraybuffer",
        headers: {
          "Content-Type": "application/json",
          Accept: mimeType,
          "auth-token": Digit.UserService.getUser()?.["access_token"],
        },
        params: {
          tenantId: Digit.ULBService.getCurrentTenantId(),
          fileStoreId: fileStoreId,
        },
      })
      .then((res) => {
        downloadFile(
          new Blob([res.data], { type: mimeType }),
          customName || "download",
          extension
        );
      });
  }
};


export function formatTimestampToDate(timestamp) {
  // Check if the timestamp is valid
  if (!timestamp || typeof timestamp !== "number") {
    return "Invalid timestamp";
  }

  // Convert timestamp to a JavaScript Date object
  const date = new Date(timestamp);

  // Define an array of month abbreviations
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Extract day, month, and year from the date
  const day = date.getDate().toString().padStart(2, "0");
  const month = monthNames[date.getMonth()]; // getMonth() returns 0-11
  const year = date.getFullYear();

  // Return the formatted date string
  return `${day} ${month} ${year}`;
}

export function formatTimestampToDateTime(timestamp) {
  // Check if the timestamp is valid
  if (!timestamp || typeof timestamp !== "number") {
    return "Invalid timestamp";
  }

  // Convert timestamp to a JavaScript Date object
  const date = new Date(timestamp);

  // Define an array of month abbreviations
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Extract day, month, and year
  const day = date.getDate().toString().padStart(2, "0");
  const month = monthNames[date.getMonth()]; // getMonth() returns 0-11
  const year = date.getFullYear();

  // Extract hours and minutes
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");

  // Determine AM or PM
  const amPm = hours >= 12 ? "PM" : "AM";

  // Convert hours to 12-hour format
  hours = hours % 12 || 12;

  // Return the formatted date and time string
  return `${day} ${month} ${year}  ${hours}:${minutes} ${amPm}`;
}
// pagination options for table
export const getCustomPaginationOptions = (t) => ({
  rowsPerPageText: t("HCM_AM_ROWS_PER_PAGE"),
  rangeSeparatorText: t("HCM_AM_OF"),
});



export default {};