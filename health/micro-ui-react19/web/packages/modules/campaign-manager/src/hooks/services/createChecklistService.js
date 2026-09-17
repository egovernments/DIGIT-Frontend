const SERVICE_REQUEST_CONTEXT_PATH = window?.globalConfigs?.getConfig("SERVICE_REQUEST_CONTEXT_PATH") || "health-service-request";
const createChecklistService = async (req, tenantId) => {
  try {
    const response = await Digit.CustomService.getResponse({
      url: `/${SERVICE_REQUEST_CONTEXT_PATH}/service/definition/v1/_create`,
      body: {
        ServiceDefinition: req,
      },
    });
    return { success: true, data: response }; // Indicate success
  } catch (error) {
    const errorCode = error?.response?.data?.Errors[0]?.code || "Unknown error";
    const errorDescription = error?.response?.data?.Errors[0]?.description || "An error occurred";
    return { success: false, error: { code: errorCode, description: errorDescription } }; // Indicate failure
  }
};

export default createChecklistService;
