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
    return responseData.includes("Cannot POST") || responseData.includes("Cannot GET");
  }
  return false;
};

const shouldTryNextContext = (error) => {
  const status = error?.response?.status;

  // Transport-level failures can be retried against alternate context paths.
  if (!error?.response) return true;
  if (isLocalProxyCannotPost(error)) return true;

  // Path/method mismatch in one context path can succeed in the other.
  if (status === 404 || status === 405) return true;

  // Do not retry validation/authz/client errors across contexts.
  if (status === 401 || status === 403) return false;
  if (status >= 400 && status < 500) return false;

  // Retry server-side temporary failures once on the alternate context.
  if (status >= 500) return true;

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
        if (!shouldTryNextContext(error)) break;
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
