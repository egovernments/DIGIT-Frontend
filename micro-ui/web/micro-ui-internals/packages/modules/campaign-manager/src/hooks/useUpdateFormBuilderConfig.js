import { useMutation } from "@tanstack/react-query";

const updateFormBuilderConfig = async (req, tenantId) => {
  try {
    const mdms_context_path = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";

    const response = await Digit.CustomService.getResponse({
      url: `/${mdms_context_path}/v2/_update/${req.moduleName}.${req.masterName}`,
      body: {
        Mdms: {
          tenantId: tenantId,
          schemaCode: `${req.moduleName}.${req.masterName}`,
          id: req?.data?.id,
          uniqueIdentifier: req?.data?.uniqueIdentifier,
          isActive: req?.data?.isActive,
          data: { ...req.data.data },
          auditDetails: req?.data?.auditDetails,
        },
      },
    });
    return response;
  } catch (error) {
    throw new Error(error?.response?.data?.Errors?.[0].description);
  }
};

const useUpdateFormBuilderConfig = (tenantId) => {
  return useMutation({
    mutationFn: (reqData) => {
      return updateFormBuilderConfig(reqData, tenantId);
    },
  });
};

export default useUpdateFormBuilderConfig;
