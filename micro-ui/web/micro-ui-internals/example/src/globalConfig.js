// src/globalConfig.js

var globalConfigs = (function () {
    var stateTenantId = "mz";
    var gmaps_api_key = "AIzaSyCslxyiD1nuQuoshbu_E3WkIV8J2SUA6KI";
    var contextPath = "workbench-ui";
    var configModuleName = "commonMuktaUiConfig";
    var centralInstanceEnabled = false;
    var localeRegion = "MZ";
    var localeDefault = "en";
    var mdmsContext = "mdms-v2";
    var footerBWLogoURL = "https://unified-dev.digit.org/egov-dev-assets/mseva-white-logo.png";
    var footerLogoURL = "https://unified-dev.digit.org/egov-dev-assets/digit-footer.png";
    var digitHomeURL = "https://www.digit.org/";
    var xstateWebchatServices = "wss://dev.digit.org/xstate-webchat/";
    var assetS3Bucket = "works-qa-asset";
    var hrmsContext = "health-hrms";
    var projectContext = "health-project";
    var invalidEmployeeRoles = ["CBO_ADMIN", "ORG_ADMIN", "ORG_STAFF", "SYSTEM"];
  
    var getConfig = function (key) {
      const configs = {
        STATE_LEVEL_TENANT_ID: stateTenantId,
        GMAPS_API_KEY: gmaps_api_key,
        ENABLE_SINGLEINSTANCE: centralInstanceEnabled,
        DIGIT_FOOTER_BW: footerBWLogoURL,
        DIGIT_FOOTER: footerLogoURL,
        DIGIT_HOME_URL: digitHomeURL,
        "xstate-webchat-services": xstateWebchatServices,
        S3BUCKET: assetS3Bucket,
        CONTEXT_PATH: contextPath,
        UICONFIG_MODULENAME: configModuleName,
        LOCALE_REGION: localeRegion,
        LOCALE_DEFAULT: localeDefault,
        MDMS_CONTEXT_PATH: mdmsContext,
        PROJECT_SERVICE_PATH: projectContext,
        HRMS_CONTEXT_PATH: hrmsContext,
        MDMS_V2_CONTEXT_PATH: mdmsContext,
        INVALIDROLES: invalidEmployeeRoles,
      };
      return configs[key];
    };
  
    return { getConfig };
  })();
  
 export  const initGlobalConfigs = (stateCode) => {
    window.globalConfigs = window.globalConfigs || globalConfigs;
    console.log("window.globalConfigs:", window.globalConfigs);
  };
  

  