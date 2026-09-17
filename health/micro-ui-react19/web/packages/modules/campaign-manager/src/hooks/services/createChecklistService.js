const SERVICE_REQUEST_CONTEXT_PATH = window?.globalConfigs?.getConfig("SERVICE_REQUEST_CONTEXT_PATH") || "health-service-request";

const getServiceRequestContextCandidates = () => {
  const configured = (SERVICE_REQUEST_CONTEXT_PATH || "").replace(/^\/+|\/+$/g, "");
  const defaults = ["health-service-request", "service-request"];
  const ordered = configured ? [configured, ...defaults] : defaults;
  return [...new Set(ordered)];
};

const isLocalProxyCannotPost = (error) => {
  const responseData = error?.response?.data;
  if (typeof responseData === "string") {
    return responseData.includes("Cannot POST");
  }
  return false;
};

const createChecklistService = async (req, tenantId) => {
  try {
    const contextPaths = getServiceRequestContextCandidates();
    let lastError = null;

    for (const contextPath of contextPaths) {
      try {
        const response = await Digit.CustomService.getResponse({
          url: `/${contextPath}/service/definition/v1/_create`,
          body: {
            ServiceDefinition: req,
          },
        });
        return { success: true, data: response };
      } catch (error) {
        lastError = error;
        if (!isLocalProxyCannotPost(error)) break;
      }
    }

    throw lastError;
  } catch (error) {
    const errorCode = error?.response?.data?.Errors[0]?.code || "Unknown error";
    const errorDescription = error?.response?.data?.Errors[0]?.description || "An error occurred";
    return { success: false, error: { code: errorCode, description: errorDescription } };
  }
};

export default createChecklistService;
