import BrowserUtil from "./browser";
import * as date from "./date";
import * as dss from "./dss";
import * as locale from "./locale";
import * as obps from "./obps";
import * as pt from "./pt";
import * as privacy from "./privacy";
import PDFUtil, { downloadReceipt ,downloadPDFFromLink,downloadBill ,getFileUrl} from "./pdf";
import getFileTypeFromFileStoreURL from "./fileType";
import preProcessMDMSConfig from "./preProcessMDMSConfig";
import preProcessMDMSConfigInboxSearch from "./preProcessMDMSConfigInboxSearch";
import * as parsingUtils from "../services/atoms/Utils/ParsingUtils"
import { iconRender } from "./iconRender";
import {getFieldIdName} from "./field";

const GetParamFromUrl = (key, fallback, search) => {
  if (typeof window !== "undefined") {
    search = search || window.location.search;
    const params = new URLSearchParams(search);
    return params.has(key) ? params.get(key) : fallback;
  }
  return fallback;
};

const getPattern = (type) => {
  // Check for MDMS validation config for MobileNo
  if (type === "MobileNo") {
    try {
      const mdmsPattern = window?.Digit?.MDMSValidationPatterns?.mobileNumberValidation?.pattern;
      if (mdmsPattern) {
        return new RegExp(mdmsPattern, 'i');
      }
    } catch (e) {
      // Silently fall back to default pattern
    }
  }

  switch (type) {
    case "Name":
      return /^[^0-9\$\"<>?\\~!@#$%^()+={}\[\]*,/_:;]{1,50}$/i;
    case "SearchOwnerName":
      return /^[^0-9\$\"<>?\\~!@#$%^()+={}\[\]*,/_:;]{3,50}$/i;
    case "MobileNo":
      return /^[6789][0-9]{9}$/i;
    case "Amount":
      return /^[0-9]{0,8}$/i;
    case "NonZeroAmount":
      return /^[1-9][0-9]{0,7}$/i;
    case "DecimalNumber":
      return /^\d{0,8}(\.\d{1,2})?$/i;
    case "Email":
      return /^(?=^.{1,64}$)((([^<>()\[\]\\.,;:\s$*@'"]+(\.[^<>()\[\]\\.,;:\s@'"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})))$/i;
    case "Address":
      return /^[^\$\"<>?\\~`!@$%^()+={}\[\]*:;]{1,500}$/i;
    case "PAN":
      return /^[A-Za-z]{5}\d{4}[A-Za-z]{1}$/i;
    case "TradeName":
      return /^[-@.\/#&+\w\s]*$/;
    case "Date":
      return /^[12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/i;
    case "UOMValue":
      return /^(0)*[1-9][0-9]{0,5}$/i;
    case "OperationalArea":
      return /^(0)*[1-9][0-9]{0,6}$/i;
    case "NoOfEmp":
      return /^(0)*[1-9][0-9]{0,6}$/i;
    case "GSTNo":
      return /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}\d[Z]{1}[A-Z\d]{1}$/i;
    case "DoorHouseNo":
      return /^[^\$\"'<>?~`!@$%^={}\[\]*:;“”‘’]{1,50}$/i;
    case "BuildingStreet":
      return /^[^\$\"'<>?\\\\~`!@$%^()+={}\[\]*.:;“”‘’]{1,64}$/i;
    case "Pincode":
      return /^[1-9][0-9]{5}$/i;
    case "Landline":
      return /^[0-9]{11}$/i;
    case "PropertyID":
      return /^[a-zA-z0-9\s\\/\-]$/i;
    case "ElectricityConnNo":
      return /^.{1,15}$/i;
    case "DocumentNo":
      return /^[0-9]{1,15}$/i;
    case "eventName":
      return /^[^\$\"<>?\\\\~`!@#$%^()+={}\[\]*,.:;“”]{1,65}$/i;
    case "eventDescription":
      return /^[^\$\"'<>?\\\\~`!@$%^()+={}\[\]*.:;“”‘’]{1,500}$/i;
    case "cancelChallan":
      return /^[^\$\"'<>?\\\\~`!@$%^()+={}\[\]*.:;“”‘’]{1,100}$/i;
    case "FireNOCNo":
      return /^[a-zA-Z0-9-]*$/i;
    case "consumerNo":
      return /^[a-zA-Z0-9/-]*$/i;
    case "AadharNo":
      return /^([0-9]){12}$/;
    case "ChequeNo":
      return /^(?!0{6})[0-9]{6}$/;
    case "Comments":
      return /^[^\$\"'<>?\\\\~`!@$%^()+={}\[\]*.:;“”‘’]{1,50}$/i;
    case "OldLicenceNo":
      return /^[a-zA-Z0-9-/]{0,64}$/;
    case "bankAccountNo":
      return /^\d{9,18}$/;
    case "IFSC":
      return /^[A-Z]{4}0[A-Z0-9]{6}$/;
    case "ApplicationNo":
      return /^[a-zA-z0-9\s\\/\-]$/i;
  }
};
/*  
Digit.Utils.getUnique()
get unique elements from an array */
const getUnique = (arr) => {
  return arr.filter((value, index, self) => self.indexOf(value) === index);
};

/*  
Digit.Utils.createFunction()
get function from a string */
const createFunction = (functionAsString) => {
  return Function("return " + functionAsString)();
};

const getStaticMapUrl = (latitude, longitude) => {
  const key = globalConfigs?.getConfig("GMAPS_API_KEY");
  return `https://maps.googleapis.com/maps/api/staticmap?markers=${latitude},${longitude}&zoom=15&size=400x400&key=${key}&style=element:geometry%7Ccolor:0xf5f5f5&style=element:labels.icon%7Cvisibility:off&style=element:labels.text.fill%7Ccolor:0x616161&style=element:labels.text.stroke%7Ccolor:0xf5f5f5&style=feature:administrative.land_parcel%7Celement:labels.text.fill%7Ccolor:0xbdbdbd&style=feature:poi%7Celement:geometry%7Ccolor:0xeeeeee&style=feature:poi%7Celement:labels.text.fill%7Ccolor:0x757575&style=feature:poi.park%7Celement:geometry%7Ccolor:0xe5e5e5&style=feature:poi.park%7Celement:labels.text.fill%7Ccolor:0x9e9e9e&style=feature:road%7Celement:geometry%7Ccolor:0xffffff&style=feature:road.arterial%7Celement:labels.text.fill%7Ccolor:0x757575&style=feature:road.highway%7Celement:geometry%7Ccolor:0xdadada&style=feature:road.highway%7Celement:labels.text.fill%7Ccolor:0x616161&style=feature:road.local%7Celement:labels.text.fill%7Ccolor:0x9e9e9e&style=feature:transit.line%7Celement:geometry%7Ccolor:0xe5e5e5&style=feature:transit.station%7Celement:geometry%7Ccolor:0xeeeeee&style=feature:water%7Celement:geometry%7Ccolor:0xc9c9c9&style=feature:water%7Celement:labels.text.fill%7Ccolor:0x9e9e9e`;
};

/**
 * Custom util to get the default region
 *
 * @author jagankumar-egov
 *
 * @example
 *   Digit.Hooks.Utils.getLocaleRegion()
 *
 * @returns {string} 
 */
const getLocaleRegion = () => {
  return window?.globalConfigs?.getConfig("LOCALE_REGION") || "IN";
};
const isContextPathMissing = (url) => {
  const contextPath = window?.contextPath || '';
  return url?.indexOf(`/${contextPath}`) === -1;
}
const getMultiRootTenant = () => {
  return window?.globalConfigs?.getConfig("MULTI_ROOT_TENANT") || false;
};

const getRoleBasedHomeCard = () => {
  return window?.globalConfigs?.getConfig("ROLE_BASED_HOMECARD") || false;
};

const getGlobalContext = () => {
  return window?.globalConfigs?.getConfig("CONTEXT_PATH") || null;
};

const getOTPBasedLogin = () => {
  return window?.globalConfigs?.getConfig("OTP_BASED_LOGIN") || false;
};
/**
 * Custom util to get the default locale
 *
 * @author jagankumar-egov
 *
 * @example
 *   Digit.Hooks.Utils.getLocaleDefault()
 *
 * @returns {string} 
 */
const getLocaleDefault = () => {
  return globalConfigs?.getConfig("LOCALE_DEFAULT")  || "en";
};

/**
 * Custom util to get the default language
 *
 * @author jagankumar-egov
 *
 * @example
 *   Digit.Utils.getDefaultLanguage()
 *
 * @returns {string} 
 */
const getDefaultLanguage = () => {
  return  `${getLocaleDefault()}_${getLocaleRegion()}`;
};

const detectDsoRoute = (pathname) => {
  const employeePages = ["search", "inbox", "dso-dashboard", "dso-application-details", "user"];

  return employeePages.some((url) => pathname.split("/").includes(url));
};

const routeSubscription = (pathname) => {
  let classname = "citizen";
  const isEmployeeUrl = detectDsoRoute(pathname);
  if (isEmployeeUrl && classname === "citizen") {
    return (classname = "employee");
  } else if (!isEmployeeUrl && classname === "employee") {
    return (classname = "citizen");
  }
};


/* to check the employee (loggedin user ) has given role  */
const didEmployeeHasRole = (role = "") => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const userInfo = Digit.UserService.getUser();
  const rolearray = userInfo?.info?.roles.filter((item) => {
    if (item.code === role && item.tenantId === tenantId) return true;
  });
  return rolearray?.length > 0;
};

/* for customization wether the user will have access for add button */
const didEmployeeisAllowed = (master, module) => {
  if (master === "WORKS-SOR" && module === "Composition") return false;
  return true;
};

/* to check the employee (loggedin user ) has given roles  */
const didEmployeeHasAtleastOneRole = (roles = []) => {
  return roles.some((role) => didEmployeeHasRole(role));
};

const pgrAccess = () => {
  const userInfo = Digit.UserService.getUser();
  const userRoles = userInfo?.info?.roles?.map((roleData) => roleData?.code);
  const pgrRoles = ["PGR_LME", "PGR-ADMIN", "CSR", "CEMP", "FEMP", "DGRO", "ULB Operator", "GRO", "GO", "RO", "GA"];
  if (Digit.Utils.getMultiRootTenant()) {
    pgrRoles.push("SUPERUSER");
  }
  const PGR_ACCESS = userRoles?.filter((role) => pgrRoles.includes(role));

  return PGR_ACCESS?.length > 0;
};

const fsmAccess = () => {
  const userInfo = Digit.UserService.getUser();
  const userRoles = userInfo?.info?.roles?.map((roleData) => roleData?.code);
  const fsmRoles = [
    "FSM_CREATOR_EMP",
    "FSM_EDITOR_EMP",
    "FSM_VIEW_EMP",
    "FSM_REPORT_VIEWER",
    "FSM_DASHBOARD_VIEWER",
    "FSM_ADMIN",
    "FSM_DSO",
    "FSM_DRIVER",
    "FSM_EMP_FSTPO",
    "FSM_COLLECTOR",
  ];

  const FSM_ACCESS = userRoles?.filter((role) => fsmRoles?.includes(role));

  return FSM_ACCESS?.length > 0;
};

const NOCAccess = () => {
  const userInfo = Digit.UserService.getUser();
  const userRoles = userInfo?.info?.roles?.map((roleData) => roleData?.code);

  const NOC_ROLES = [
    "FIRE_NOC_APPROVER"
  ]

  const NOC_ACCESS = userRoles?.filter((role) => NOC_ROLES?.includes(role));

  return NOC_ACCESS?.length > 0;
};

const BPAREGAccess = () => {
  const userInfo = Digit.UserService.getUser();
  const userRoles = userInfo?.info?.roles?.map((roleData) => roleData?.code);

  const BPAREG_ROLES = ["BPAREG_APPROVER", "BPAREG_DOC_VERIFIER"];

  const BPAREG_ACCESS = userRoles?.filter((role) => BPAREG_ROLES?.includes(role));

  return BPAREG_ACCESS?.length > 0;
};

const BPAAccess = () => {
  const userInfo = Digit.UserService.getUser();
  const userRoles = userInfo?.info?.roles?.map((roleData) => roleData?.code);

  const BPA_ROLES = [
    "BPA_VERIFIER",
    "CEMP",
    "BPA_APPROVER",
    "BPA_FIELD_INSPECTOR",
    "BPA_NOC_VERIFIER",
    "AIRPORT_AUTHORITY_APPROVER",
    "FIRE_NOC_APPROVER",
    "NOC_DEPT_APPROVER",
    "BPA_NOC_VERIFIER",
    "BPA_TOWNPLANNER",
    "BPA_ENGINEER",
    "BPA_BUILDER",
    "BPA_STRUCTURALENGINEER",
    "BPA_SUPERVISOR",
    "BPA_DOC_VERIFIER",
    "EMPLOYEE",
  ];

  const BPA_ACCESS = userRoles?.filter((role) => BPA_ROLES?.includes(role));

  return BPA_ACCESS?.length > 0;
};

const ptAccess = () => {
  const userInfo = Digit.UserService.getUser();
  const userRoles = userInfo?.info?.roles?.map((roleData) => roleData?.code);
  const ptRoles = ["PT_APPROVER", "PT_CEMP", "PT_DOC_VERIFIER", "PT_FIELD_INSPECTOR"];

  const PT_ACCESS = userRoles?.filter((role) => ptRoles?.includes(role));

  return PT_ACCESS?.length > 0;
};

const tlAccess = () => {
  const userInfo = Digit.UserService.getUser();
  const userRoles = userInfo?.info?.roles?.map((roleData) => roleData?.code);
  const tlRoles = ["TL_CEMP", "TL_APPROVER", "TL_FIELD_INSPECTOR", "TL_DOC_VERIFIER"];

  const TL_ACCESS = userRoles?.filter((role) => tlRoles?.includes(role));

  return TL_ACCESS?.length > 0;
};

const mCollectAccess = () => {
  const userInfo = Digit.UserService.getUser();
  const userRoles = userInfo?.info?.roles?.map((roleData) => roleData?.code);
  const mCollectRoles = ["UC_EMP"];

  const MCOLLECT_ACCESS = userRoles?.filter((role) => mCollectRoles?.includes(role));

  return MCOLLECT_ACCESS?.length > 0;
};

const receiptsAccess = () => {
  const userInfo = Digit.UserService.getUser();
  const userRoles = userInfo?.info?.roles.map((roleData) => roleData?.code);
  const receiptsRoles = ["CR_PT"];
  const RECEIPTS_ACCESS = userRoles?.filter((role) => receiptsRoles?.includes(role));
  return RECEIPTS_ACCESS?.length > 0;
};
const hrmsRoles = ["HRMS_ADMIN","SUPERUSER", "ADMIN"];
const hrmsAccess = () => {
  const userInfo = Digit.UserService.getUser();
  const userRoles = userInfo?.info?.roles?.map((roleData) => roleData?.code);
  const HRMS_ACCESS = userRoles?.filter((role) => hrmsRoles?.includes(role));
  return HRMS_ACCESS?.length > 0;
};

const sandboxAccess = () => {
  const sandboxRoles = ["SUPERUSER"];
  const userInfo = Digit.UserService.getUser();
  const userRoles = userInfo?.info?.roles?.map((roleData) => roleData?.code);
  const SANDBOX_ACCESS = userRoles?.filter((role) => sandboxRoles?.includes(role));
  return SANDBOX_ACCESS?.length > 0;
};

const wsAccess = () => {
  const userInfo = Digit.UserService.getUser();
  const userRoles = userInfo?.info?.roles?.map((roleData) => roleData?.code);
  const waterRoles = ["WS_CEMP", "WS_APPROVER", "WS_FIELD_INSPECTOR", "WS_DOC_VERIFIER","WS_CLERK"];

  const WS_ACCESS = userRoles?.filter((role) => waterRoles?.includes(role));

  return WS_ACCESS?.length > 0;
};

const swAccess = () => {
  const userInfo = Digit.UserService.getUser();
  const userRoles = userInfo?.info?.roles?.map((roleData) => roleData?.code);
  const sewerageRoles = ["SW_CEMP", "SW_APPROVER", "SW_FIELD_INSPECTOR", "SW_DOC_VERIFIER","SW_CLERK"];

  const SW_ACCESS = userRoles?.filter((role) => sewerageRoles?.includes(role));

  return SW_ACCESS?.length > 0;
};

const transformURL = (url = "", tenantId) => {
  if (url == "/") {
    return;
  }
  if (Digit.Utils.isContextPathMissing(url)) {
    let updatedUrl = null;
    if (getMultiRootTenant) {
      url = url.replace("/sandbox-ui/employee", `/sandbox-ui/${tenantId}/employee`);
      updatedUrl = url;
    } else {
      updatedUrl = url;
    }
    return updatedUrl;
  } else {
    return url;
  }
};

/* to get the MDMS config module name */
const getConfigModuleName = () => {
  return window?.globalConfigs?.getConfig("UICONFIG_MODULENAME") || "commonUiConfig";
};

const mdms_context_path = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";

/**
 * Generates criteria for fetching data from MDMS v1.
 * 
 * @param {string} tenantId - The tenant identifier for the MDMS request.
 * @param {string} moduleName - The name of the module whose data is to be fetched.
 * @param {Array} masterDetails - An array specifying the master details to fetch from the module.
 * @param {string} cacheKey - A unique key used for caching the query results.
 * 
 * @returns {Object} - A query object to be used with React Query or a similar data fetching utility.
 */
const getMDMSV1Criteria= (tenantId, moduleName, masterDetails, cacheKey="MDMS",config={}) => {
  const MDMSV1Criteria = {
    // API endpoint for MDMS v1 search
    url: `/${mdms_context_path}/v1/_search`,

    // Request payload with tenant and module/master details
    body: {
      MdmsCriteria: {
        tenantId: tenantId,
        moduleDetails: [
          {
            moduleName: moduleName,
            masterDetails: masterDetails
          }
        ]
      }
    },

    // Custom query name for React Query caching and identification
    changeQueryName: `MDMSv1-${cacheKey}`,

    // Query configuration for caching and data selection
    config: {
      enabled: true,              // Enables the query
      cacheTime: Infinity,        // Keeps cached data forever
      staleTime: Infinity,        // Data never becomes stale
      select: (data) => {
        // Select and return the module's data
        return data?.MdmsRes?.[moduleName];
      },
      ...config
    },
  };

  return MDMSV1Criteria;
}
/**
 * Generates criteria for fetching data from MDMS v2.
 * 
 * @param {string} tenantId - The tenant identifier for the MDMS request.
 * @param {string} schemaCode - The schema code for the MDMS v2 request.
 * @param {Object} filters - Filter criteria for the MDMS v2 search.
 * @param {string} cacheKey - A unique key used for caching the query results.
 * @param {Object} config - Additional configuration options for React Query.
 * 
 * @returns {Object} - A query object to be used with React Query or a similar data fetching utility.
 */
const getMDMSV2Criteria= (tenantId, schemaCode,filters={}, cacheKey="MDMS",config={}) => {
  const MDMSV2Criteria = {
    // API endpoint for MDMS v2 search
    url: `/${mdms_context_path}/v2/_search`,

    // Request payload with tenant and module/master details
    body: {
          MdmsCriteria: {
            tenantId: tenantId,
            schemaCode: schemaCode,
            isActive: true,
            filters
          },
    },

    // Custom query name for React Query caching and identification
    changeQueryName: `MDMSv2-${cacheKey}-${schemaCode}`,

    // Query configuration for caching and data selection
    config: {
      enabled: true,              // Enables the query
      cacheTime: Number.POSITIVE_INFINITY,        // Keeps cached data forever
      staleTime: Number.POSITIVE_INFINITY,        // Data never becomes stale
      select: (data) => {
        // Select and return the mdms's data
        return data?.mdms;
      },
      ...config
    },
  };

  return MDMSV2Criteria;
}

 const getMDMSV1Selector=(moduleName,masterName) =>{
  return {
    select: (data) => {
      // Select and return the module's data
      return data?.MdmsRes?.[moduleName]?.[masterName];
    }
  };
}

const mdms={
  getMDMSV1Criteria,
  getMDMSV2Criteria,
  getMDMSV1Selector
}

export default {
  pdf: PDFUtil,
  createFunction,
  downloadReceipt,
  downloadBill,
  downloadPDFFromLink,
  downloadBill,
  getFileUrl,
  mdms,
  getFileTypeFromFileStoreURL,
  browser: BrowserUtil,
  locale,
  date,
  GetParamFromUrl,
  getStaticMapUrl,
  detectDsoRoute,
  routeSubscription,
  pgrAccess,
  fsmAccess,
  BPAREGAccess,
  BPAAccess,
  dss,
  obps,
  pt,
  ptAccess,
  NOCAccess,
  mCollectAccess,
  receiptsAccess,
  didEmployeeHasRole,
  didEmployeeisAllowed,
  didEmployeeHasAtleastOneRole,
  hrmsAccess,
  getPattern,
  hrmsRoles,
  getUnique,
  tlAccess,
  wsAccess,
  swAccess,
  getConfigModuleName,
  preProcessMDMSConfig,
  preProcessMDMSConfigInboxSearch,
  parsingUtils,
  ...privacy,
  getDefaultLanguage,
  getLocaleDefault,
  getLocaleRegion,
  getMultiRootTenant,
  isContextPathMissing,
  getGlobalContext,
  getOTPBasedLogin,
  getRoleBasedHomeCard,
  sandboxAccess,
  iconRender,
  transformURL,
  getFieldIdName
};
