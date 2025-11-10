var globalConfigs = (function () {
    var stateTenantId = "pb";
    var contextPath = "mseva-ui";
    var gmaps_api_key_old = "AIzaSyAQOd09-vjmk1sXFb_ZQYDz2nlfhXq7Wf8";
    var gmaps_api_key_old1 = "AIzaSyASqkAr3d494ihZaJeCOg4CJ3xnQ_83e2s";
    var gmaps_api_key = "AIzaSyDjSk-Bw1OuiOE-5K7jsP6KGN2rbcN7iBk";
    var finEnv = "uat";
    var centralInstanceEnabled = false;
    var footerBWLogoURL =
      "https://s3.ap-south-1.amazonaws.com/egov-uat-assets/digit-footer-bw.png";
    var footerLogoURL =
      "https://s3.ap-south-1.amazonaws.com/egov-uat-assets/digit-footer.png";
    var digitHomeURL = "https://mseva-uat.lgpunjab.gov.in/";
    var assetS3Bucket = "pg-egov-assets";
    var getConfig = function (key) {
      if (key === "STATE_LEVEL_TENANT_ID") {
        return stateTenantId;
      } else if (key === "GMAPS_API_KEY") {
        return gmaps_api_key;
      } else if (key === "FIN_ENV") {
        return finEnv;
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
      } else if (key === "JWT_TOKEN") {
        return "ZWdvdi11c2VyLWNsaWVudDplZ292LXVzZXItc2VjcmV0";
      } else if (key === "CONTEXT_PATH") {
        return contextPath;
      }
    };
    return {
      getConfig,
    };
  })();


export const initGlobalConfigs = (stateCode) => {
  window.globalConfigs = window.globalConfigs || globalConfigs;
  console.log("window.globalConfigs:", window.globalConfigs);
};