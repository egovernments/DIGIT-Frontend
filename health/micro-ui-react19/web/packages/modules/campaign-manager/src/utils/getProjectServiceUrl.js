const getProjectServiceUrl = () => {
  // Access the globalConfigs object and retrieve the PROJECT_SEERVICE_PATH configuration.
  // If not defined, fallback to default URL `/health-project`.
  let url = window.globalConfigs?.getConfig("PROJECT_SERVICE_PATH") || `health-project`;
  return `/${url}`;
};

// Export the function to be used in other parts of the application.

export default getProjectServiceUrl;
