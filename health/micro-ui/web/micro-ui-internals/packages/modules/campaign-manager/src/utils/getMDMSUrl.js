const getMDMSUrl = (v2=false) => {
  if(v2){
    let url = window.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || window.globalConfigs?.getConfig("MDMS_CONTEXT_PATH") || "mdms-v2";
    return `/${url}`;
  }
    let url = window.globalConfigs?.getConfig("MDMS_V1_CONTEXT_PATH") ||  "egov-mdms-service";
    return `/${url}`;
  };
  export default getMDMSUrl;
