import { useMutation } from "react-query";

const upsertSchemaConfig = async (req, tenantId) => {
  try {
    const mdms_context_path = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";

    const response = await Digit.CustomService.getResponse({
      url: `/${mdms_context_path}/v2/_create/${req.moduleName}.${req.masterName}`,
      body: {
        Mdms: {
          tenantId: tenantId,
          schemaCode: `${req.moduleName}.${req.masterName}`,
          data: { ...req.data },
        },
      },
    });
    return response;
  } catch (error) {
    throw new Error(error?.response?.data?.Errors?.[0].description);
  }
};

const useUpsertSchemaConfig = (tenantId) => {
  return useMutation((reqData) => {
    return upsertSchemaConfig(reqData, tenantId);
  });
};

export default useUpsertSchemaConfig;
