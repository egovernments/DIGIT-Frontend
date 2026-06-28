const getProjectServiceUrl = () => {
  let url = window.globalConfigs?.getConfig("PROJECT_SERVICE_PATH") || `health-project`;
  return `/${url}`;
};

export const getGeoJsonUrl = (boundaryType = "ward") => {
  let urls = window.globalConfigs?.getConfig("GEOJSONURLS") || {};
  return urls?.[boundaryType];
};

export const getKibanaDetails = (key = "username") => {
  const config = window.globalConfigs?.getConfig("KIBANA");
  if (!config) {
    console.error("KIBANA config is missing");
    return undefined;
  }
  return config[key];
};

export default getProjectServiceUrl;
