const getProjectServiceUrl = () => {
    // Access the globalConfigs object and retrieve the PROJECT_SERVICE_PATH configuration.
    // If not defined, fallback to default URL `/health-project`.
    const url = window.globalConfigs?.getConfig("PROJECT_SEERVICE_PATH") || `/health-project`;
    return url;
  };
  
  export default getProjectServiceUrl;