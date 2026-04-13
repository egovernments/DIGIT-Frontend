const getProjectServiceUrl = () => {
  // Access the globalConfigs object and retrieve the PROJECT_SEERVICE_PATH configuration.
  // If not defined, fallback to default URL `/health-project`.
  let url = window.globalConfigs?.getConfig("PROJECT_SERVICE_PATH") || `health-project`;
  return `/${url}`;
};

// Export the function to be used in other parts of the application.

export const getGeoJsonUrl = (boundaryType="ward") => {
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
