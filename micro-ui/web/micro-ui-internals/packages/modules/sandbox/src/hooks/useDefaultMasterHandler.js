import { useMutation } from "react-query";

const defaultMasterHandlerService = async (reqData, tenantId) => {
  try {
    const response = await Digit.CustomService.getResponse({
      url: "/default-data-handler/defaultdata/setup",
      body: {
        targetTenantId: tenantId,
        module: reqData?.module,
        onlySchemas: reqData?.onlySchemas,
      },
      params: {},
    });
    return response;
  } catch (error) {
    throw new Error(error?.response?.data?.Errors?.[0].description);
  }
};

const useDefaultMasterHandler = (tenantId) => {
  return useMutation((reqData) => {
    return defaultMasterHandlerService(reqData, tenantId);
  });
};

export default useDefaultMasterHandler;
