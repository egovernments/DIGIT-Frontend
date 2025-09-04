import { useMutation } from "@tanstack/react-query";

const updateAppConfigService = async (req, tenantId) => {
  try {
    const mdms_context_path = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";

    const response = req?.data?.id
      ? await Digit.CustomService.getResponse({
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
        })
      : await Digit.CustomService.getResponse({
          url: `/${mdms_context_path}/v2/_create/${req.moduleName}.${req.masterName}`,
          body: {
            Mdms: {
              uniqueIdentifier: `${req.data.data.campaignNumber}.${req.data.data.projectType}.${req.data.data.flow}`,
              tenantId: tenantId,
              schemaCode: `${req.moduleName}.${req.masterName}`,
              isActive: true,
              data: { ...req.data.data },
            },
          },
        });
    return response;
  } catch (error) {
    throw error;
  }
};

const useUpdateAppConfig = (tenantId) => {
  return useMutation({
    mutationFn: (reqData) => updateAppConfigService(reqData, tenantId),
  });
};

export default useUpdateAppConfig;
