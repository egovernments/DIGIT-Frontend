var globalConfigs = (function () {
    // defining tenant id
    var stateTenantId = 'mz'
    // set gmap key
    var gmaps_api_key = 'AIzaSyCslxyiD1nuQuoshbu_E3WkIV8J2SUA6KI';
    // set namespace
    var contextPath = 'sandbox-ui';
    var configModuleName = 'commonUiConfig';
    var centralInstanceEnabled = false;
    var localeRegion = "MZ";
    var localeDefault = "en";
    // set mdmsV1 path
    var mdmsContextV1 = "egov-mdms-service";
    // set mdmsV2 path
    var mdmsContextV2 = "mdms-v2";
    var footerBWLogoURL = 'https://unified-dev.digit.org/egov-dev-assets/mseva-white-logo.png';
    var footerLogoURL = 'https://unified-dev.digit.org/egov-dev-assets/digit-footer.png';
    var digitHomeURL = 'https://www.digit.org/';
    var assetS3Bucket = 'works-qa-asset';
    var invalidEmployeeRoles = []
    var getConfig = function (key) {
        if (key === 'STATE_LEVEL_TENANT_ID') {
            return stateTenantId;
        }
        else if (key === 'GMAPS_API_KEY') {
            return gmaps_api_key;
        }
        else if (key === 'ENABLE_SINGLEINSTANCE') {
            return centralInstanceEnabled;
        } else if (key === 'DIGIT_FOOTER_BW') {
            return footerBWLogoURL;
        } else if (key === 'DIGIT_FOOTER') {
            return footerLogoURL;
        } else if (key === 'DIGIT_HOME_URL') {
            return digitHomeURL;
        } else if (key === 'xstate-webchat-services') {
            return xstateWebchatServices;
        } else if (key === 'S3BUCKET') {
            return assetS3Bucket;
        } else if (key === 'CONTEXT_PATH') {
            return contextPath;
        } else if (key === 'UICONFIG_MODULENAME') {
            return configModuleName;
        } else if (key === "LOCALE_REGION") {
            return localeRegion;
        } else if (key === "LOCALE_DEFAULT") {
            return localeDefault;
        } else if (key === "MDMS_V1_CONTEXT_PATH") {
            return mdmsContextV1;
        } else if (key === "MDMS_V2_CONTEXT_PATH") {
            return mdmsContextV2;
        } if (key === 'INVALIDROLES') {
            return invalidEmployeeRoles;
        }
    };
    return {
        getConfig
    };
}());
