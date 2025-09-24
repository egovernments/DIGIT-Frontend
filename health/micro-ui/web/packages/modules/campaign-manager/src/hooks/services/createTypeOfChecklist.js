const createTypeOfChecklist = async (req, tenantId) => {
    const mdms_context_path = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";

    try {
      const response = await Digit.CustomService.getResponse({
        url: `/${mdms_context_path}/v1/_search`,
        body: {
          MdmsCriteria: req,
        },
      });
      return response;
    } catch (error) {
      if (!error?.response?.data?.Errors[0].description) {
        throw new Error(error?.response?.data?.Errors[0].code);
      } else {
        throw new Error(error?.response?.data?.Errors[0].description);
      }
    }
  };
  
  export default createTypeOfChecklist;
  