const getProjectServiceUrl = () => {
  // Access the globalConfigs object and retrieve the PROJECT_SEERVICE_PATH configuration.
  // If not defined, fallback to default URL `/health-project`.
  let url = window.globalConfigs?.getConfig("PROJECT_SERVICE_PATH") || `project`;
  return `/${url}`;
};

// Export the function to be used in other parts of the application.

export const getGeoJsonUrl = (boundaryType="ward") => {
  let urls = window.globalConfigs?.getConfig("GEOJSONURLS") || {};
  return urls?.[boundaryType];
};

//uat
// const defaultKibanaDetails = {
//   kibanaPath:"kibana/api/console/proxy",
//   username:"elastic",
//   password:"mGmmzUOEBYAcJO6DbkEfmuvE",
//   projectTaskIndex:"project-task-index-v1",
//   projectStaffIndex:"project-staff-index-v1",
//   projectStockIndex:"stock-index-v1",
//   userSyncIndex:"user-sync-index-v1",
//   token:"ZWxhc3RpYzptR21telVPRUJZQWNKTzZEYmtFZm11dkU=",
//   key:"name",
//   value:"projectName"
// };


//nigeria-uat
const defaultKibanaDetails = {
  kibanaPath:"/kibana-upgrade/s/bauchi-dashboard/api/console/proxy",
  kibanaBaseUrl:"https://mc-nigeria-uat.digit.org",
  username:"elastic",
  password:"oVEHNUM2ub5TBjDhRvlAT0rU",
  projectTaskIndex:"ba-project-task-index-v1",
  projectStaffIndex:"ba-project-staff-index-v1",
  projectStockIndex:"ba-stock-index-v1",
  userSyncIndex:"ba-user-sync-index-v1",
  token:"ZWxhc3RpYzpvVkVITlVNMnViNVRCakRoUnZsQVQwclU=",
  key:"name",
  value:"projectName"
};

export const getKibanaDetails = (key="username") => {
  let details = window.globalConfigs?.getConfig("KIBANA") && {...defaultKibanaDetails, ...window.globalConfigs?.getConfig("KIBANA")} || defaultKibanaDetails;
  return details?.[key];
};

export default getProjectServiceUrl;
