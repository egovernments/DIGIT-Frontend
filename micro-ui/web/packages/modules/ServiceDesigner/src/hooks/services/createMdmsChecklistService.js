const MDMS_CONTEXT_PATH = window?.globalConfigs?.getConfig("MDMS_CONTEXT_PATH") || "egov-mdms-service";

const createMdmsChecklistService = async (req,isUpdate) => {
  try {
    const response = await Digit.CustomService.getResponse({
      url: isUpdate ? `/${MDMS_CONTEXT_PATH}/v2/_update/Studio.Checklists` : `/${MDMS_CONTEXT_PATH}/v2/_create/Studio.Checklists`,
      body: {
        ...req
      },
    });
    return { success: true, data: response };
  } catch (error) {
    const errorCode = error?.response?.data?.Errors?.[0]?.code || "Unknown error";
    const errorDescription = error?.response?.data?.Errors?.[0]?.description || "An error occurred";
    return { success: false, error: { code: errorCode, description: errorDescription } };
  }
};

export default createMdmsChecklistService;