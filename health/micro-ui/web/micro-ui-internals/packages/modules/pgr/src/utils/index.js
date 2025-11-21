import _ from "lodash";
import axios from "axios";
import { CustomisedHooks } from "../hooks";
import { UICustomizations } from "../configs/UIcustomizations";
import { downloadPdfWithCustomName } from "./downloadPDF";



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
  setupLibraries("Customizations", "commonUiConfig", { ...window?.Digit?.Customizations?.commonUiConfig, ...UICustomizations});
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
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
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

// pagination options for table
export const getCustomPaginationOptions = (t) => ({
  rowsPerPageText: t("HCM_AM_ROWS_PER_PAGE"),
  rangeSeparatorText: t("HCM_AM_OF"),
});

export const convertEpochToDate = (dateEpoch) => {
  // Returning null in else case because new Date(null) returns initial date from calender
  if (dateEpoch) {
    const dateFromApi = new Date(dateEpoch);
    let month = dateFromApi.getMonth() + 1;
    let day = dateFromApi.getDate();
    let year = dateFromApi.getFullYear();
    month = (month > 9 ? "" : "0") + month;
    day = (day > 9 ? "" : "0") + day;
    return `${year}-${month}-${day}`;
  } else {
    return null;
  }
};

export const convertEpochFormateToDate = (dateEpoch) => {
  // Returning null in else case because new Date(null) returns initial date from calender
  if (dateEpoch) {
    const dateFromApi = new Date(dateEpoch);
    let month = dateFromApi.getMonth() + 1;
    let day = dateFromApi.getDate();
    let year = dateFromApi.getFullYear();
    month = (month > 9 ? "" : "0") + month;
    day = (day > 9 ? "" : "0") + day;
    return `${day}/${month}/${year}`;
  } else {
    return null;
  }
};


export const formPayloadToCreateComplaint = (formData, tenantId, user) => {
  const userInfo = formData?.complaintUser?.code === "ANOTHER_USER" ? {
    "name": formData?.ComplainantName?.trim()?.length > 0 ? formData?.ComplainantName?.trim() : null,
    "mobileNumber": formData?.ComplainantContactNumber?.trim()?.length > 0 ? formData?.ComplainantContactNumber?.trim() : null,
    "userName": formData?.ComplainantContactNumber?.trim()?.length > 0 ? formData?.ComplainantContactNumber?.trim() : null,
    "type": "EMPLOYEE",
    "tenantId": tenantId,
  } : user;
  
  const boundaryCode = formData?.SelectedBoundary?.code;
  const localityCode = boundaryCode;

  const safeAdditionalDetail = {
    supervisorName : formData?.SupervisorName?.trim()?.length > 0 ? formData?.SupervisorName?.trim() : null,
    supervisorContactNumber : formData?.SupervisorContactNumber?.trim()?.length > 0 ? formData?.SupervisorContactNumber?.trim() : null,
    boundaryCode: boundaryCode || null
  };
  const additionalDetail= JSON.stringify(safeAdditionalDetail);
  const timestamp = Date.now();

  let complaint = {
    "service": {
      "active": true,
      "tenantId": tenantId,
      "serviceCode": formData?.SelectComplaintType?.serviceCode,
      "description": formData?.description,
      "applicationStatus": "CREATED",
      "source": "web",
      "user": userInfo,
      "isDeleted": false,
      "rowVersion": 1,
      "address": {
        "landmark": formData?.landmark,
        "buildingName": formData?.AddressOne,
        "street": formData?.AddressTwo,
        "pincode": formData?.postalCode,
        "locality": {
          "code": localityCode,
        },
        "geoLocation": {}
      },
      "additionalDetail": additionalDetail,
      "auditDetails": {
        "createdBy": user?.uuid,
        "createdTime": timestamp,
        "lastModifiedBy": user?.uuid,
        "lastModifiedTime": timestamp
      }
    },
    "workflow": {
      "action": "CREATE",
      "assignes": [],
      "hrmsAssignes": [],
      "comments": "",
      // Include documents array if complaint file is provided
      "verificationDocuments": formData?.complaintFile ? [formData.complaintFile] : null
    }
  }

  return complaint;
};


export default {};