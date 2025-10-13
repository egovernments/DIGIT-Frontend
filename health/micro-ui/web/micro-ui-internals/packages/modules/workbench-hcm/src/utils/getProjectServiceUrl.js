const getProjectServiceUrl = () => {
  // Access the globalConfigs object and retrieve the PROJECT_SEERVICE_PATH configuration.
  // If not defined, fallback to default URL `/health-project`.
  let url = window.globalConfigs?.getConfig("PROJECT_SERVICE_PATH") || `health-project`;
  return `/${url}`;
};


export const getGeoJsonUrl = (boundaryType="ward") => {
  // Access the globalConfigs object and retrieve the PROJECT_SEERVICE_PATH configuration.
  // If not defined, fallback to default URL `/health-project`.
  let urls = window.globalConfigs?.getConfig("GEOJSONURLS") || {};
  return urls?.[boundaryType];
};

const defaultKibanaDetails = {
  kibanaPath:"kibana",
  username:"anonymous",
  password:"anonymous1",
  projectTaskIndex:"project-task-index-v1",
  projectStaffIndex:"project-staff-index-v1",
  projectHouseholdIndex:"household-index-v1",
  projectStockIndex:"stock-index-v1",
  // projectTaskIndex:"project-task-index-v2", --- IGNORE ---
  token:"VVRaZjE1Z0J0UjN1MDZQak9jNC06V25NZUEybWxUOTZ4QzM5dnItNDJsdw==",
  key:"name",
  value:"projectName"
};
export const getKibanaDetails = (key="username") => {
  // Access the globalConfigs object and retrieve the PROJECT_SEERVICE_PATH configuration.
  // If not defined, fallback to default URL `/health-project`.
  let details = window.globalConfigs?.getConfig("KIBANA") && {...defaultKibanaDetails, ...window.globalConfigs?.getConfig("KIBANA")} || defaultKibanaDetails;
  return details?.[key];
};


// Export the function to be used in other parts of the application.
export default getProjectServiceUrl;
