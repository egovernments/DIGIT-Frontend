var globalConfigs = (function () {
    var stateTenantId = 'pg'
     var gmaps_api_key = 'AIzaSyAASfCFja6YxwDzEAzhHFc8B-17TNTCV0g';
     var contextPath = 'works-ui'; 
     var configModuleName = 'commonMuktaUiConfig'; 
     var centralInstanceEnabled = false;
     var footerBWLogoURL = 'https://s3.ap-south-1.amazonaws.com/works-dev-asset/digit-footer-bw.png';
     var footerLogoURL = 'https://s3.ap-south-1.amazonaws.com/works-dev-asset/digit-footer.png';
     var digitHomeURL = 'https://www.digit.org/';
     var xstateWebchatServices = 'wss://dev.digit.org/xstate-webchat/';
     var assetS3Bucket = 'works-dev-asset';
     var invalidEmployeeRoles = ["CBO_ADMIN","SYSTEM","ORG_ADMIN","ORG_STAFF"] 
  
   
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
       } else if (key === 'CONTEXT_PATH'){
      return contextPath;
       } else if (key === 'UICONFIG_MODULENAME'){
      return configModuleName;
       } else if (key === 'INVALIDROLES'){
      return invalidEmployeeRoles;
       }
     };
   
   
     return {
       getConfig
     };
   }());
   export default globalConfigs;