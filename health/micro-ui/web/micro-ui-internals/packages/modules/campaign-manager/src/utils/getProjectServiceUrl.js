const getProjectServiceUrl = () => {
  // Access the globalConfigs object and retrieve the PROJECT_SEERVICE_PATH configuration.
  // If not defined, fallback to default URL `/health-project`.
  const url = window.globalConfigs?.getConfig("PROJECT_SEERVICE_PATH") || `/health-project`;
  
  // Return the constructed URL.
  return url;
};

// Export the function to be used in other parts of the application.
export default getProjectServiceUrl;