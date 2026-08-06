var globalConfigs = (function () {
  var contextPath = "workbench-ui";
  var configModuleName = "commonHCMUiConfig";
  var stateTenantId = "demo";
  var gmaps_api_key = "AIzaSyCslxyiD1nuQuoshbu_E3WkIV8J2SUA6KI";
  var googleClientId = "872500707502-njkhj04vofa188tnele0nlhtn4pschru.apps.googleusercontent.com";
  var googleTenantId = "demo";
  var centralInstanceEnabled = false;
  var localeRegion = "DEMO";
  var localeDefault = "en";
  var coreLocale = "hcm";
  var hierarchyType = "MICROPLAN";

  // Service context paths
  var mdmsContext = "mdms-v2";
  var hrmsContext = "egov-hrms";
  var projectContext = "project";
  var individualContext = "individual";
  var attendanceContext = "health-attendance";
  var musterRollContext = "health-muster-roll";
  var expenseContext = "health-expense";
  var expenseCalculatorContext = "health-expense-calculator";
  var healthServiceRequestContext = "service-request";
  var pgrContext = "pgr-services";


  // Asset & branding URLs
  var assetS3Bucket = "egov-uat-asset";
  var footerBWLogoURL =
  "https://egov-uat-assets.s3.ap-south-1.amazonaws.com/digit-footer-bw.png";
  var footerLogoURL =
    "https://egov-uat-assets.s3.ap-south-1.amazonaws.com/digit-footer.png";
  var digitHomeURL = "https://www.digit.org/";
  var calculationPageAssets = "https://egov-health-dev-assets.s3.ap-south-1.amazonaws.com/calculation-page-assets/";

  // Role & feature configs
  var invalidEmployeeRoles = ["CBO_ADMIN", "ORG_ADMIN", "ORG_STAFF", "SYSTEM"];
  var mdmsFeatures = {
    bulkDownload: true,
    bulkUpload: true,
    JSONEdit: true
  };
  var uiThemeConfig = {
    headerTheme: "light",
    sideNavTheme: "light",
    sideNavVariant: "primary"
  };

  var getConfig = function (key) {
    if (key === "STATE_LEVEL_TENANT_ID") {
      return stateTenantId;
    } else if (key === "GMAPS_API_KEY") {
      return gmaps_api_key;
    } else if (key === "ROLE_BASED_HOMECARD") {
      return true;
    } else if (key === "HEADER_THEME") {
      return uiThemeConfig?.headerTheme;
    } else if (key === "SIDENAV_THEME") {
      return uiThemeConfig?.sideNavTheme;
    } else if (key === "SIDENAV_VARIANT") {
      return uiThemeConfig?.sideNavVariant;
    } else if (key === "ENABLE_SINGLEINSTANCE") {
      return centralInstanceEnabled;
    } else if (key === "DIGIT_FOOTER_BW") {
      return footerBWLogoURL;
    } else if (key === "DIGIT_FOOTER") {
      return footerLogoURL;
    } else if (key === "DIGIT_HOME_URL") {
      return digitHomeURL;
    } else if (key === "S3BUCKET") {
      return assetS3Bucket;
    } else if (key === "CONTEXT_PATH") {
      return contextPath;
    } else if (key === "UICONFIG_MODULENAME") {
      return configModuleName;
    } else if (key === "LOCALE_REGION") {
      return localeRegion;
    } else if (key === "LOCALE_DEFAULT") {
      return localeDefault;
    } else if (key === "ENABLE_JSON_EDIT") {
      return mdmsFeatures?.JSONEdit;
    } else if (key === "ENABLE_MDMS_BULK_UPLOAD") {
      return mdmsFeatures?.bulkUpload;
    } else if (key === "ENABLE_MDMS_BULK_DOWNLOAD") {
      return mdmsFeatures?.bulkDownload;
    } else if (key === "MDMS_CONTEXT_PATH") {
      return mdmsContext;
    } else if (key === "MDMS_V2_CONTEXT_PATH") {
      return mdmsContext;
    } else if (key === "MDMS_V1_CONTEXT_PATH") {
      return mdmsContext;
    } else if (key === "HRMS_CONTEXT_PATH") {
      return hrmsContext;
    } else if (key === "PROJECT_CONTEXT_PATH") {
      return projectContext;
    } else if (key === "PROJECT_SERVICE_PATH") {
      return projectContext;
    } else if (key === "HIERARCHY_TYPE") {
      return hierarchyType;
    } else if (key === "INDIVIDUAL_CONTEXT_PATH") {
      return individualContext;
    } else if (key === "ATTENDANCE_CONTEXT_PATH") {
      return attendanceContext;
    } else if (key === "MUSTER_ROLL_CONTEXT_PATH") {
      return musterRollContext;
    } else if (key === "EXPENSE_CONTEXT_PATH") {
      return expenseContext;
    } else if (key === "EXPENSE_CALCULATOR_CONTEXT_PATH") {
      return expenseCalculatorContext;
    } else if (key === "CALCULATION_PAGE_ASSETS") {
      return calculationPageAssets;
    } else if (key === "CORE_UI_MODULE_LOCALE_PREFIX") {
      return coreLocale;
    } else if (key === "INVALIDROLES") {
      return invalidEmployeeRoles;
    } else if (key === "GOOGLE_CLIENT_ID") {
      return googleClientId;
    } else if (key === "GOOGLE_TENANT_ID") {
      return googleTenantId;
    } else if(key === "SERVICE_REQUEST_CONTEXT_PATH"){
      return healthServiceRequestContext;
    } else if (key === "PGR_CONTEXT_PATH") {
      return pgrContext;
    } else if (key === "PGR_SERVICE_PATH") {
      return pgrContext;
    }
  };
  return {
    getConfig
  };
})();
