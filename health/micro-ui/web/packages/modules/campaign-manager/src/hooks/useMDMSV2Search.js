import { useQuery } from "@tanstack/react-query";

const mdmsV2Search = async ({ tenantId, moduleName, masterName, formId }) => {
  const response = await Digit.CustomService.getResponse({
    url: "/egov-mdms-service/v2/_search",
    body: {
      MdmsCriteria: {
        tenantId: tenantId,
        schemaCode: `${moduleName}.${masterName}`,
        ids: [formId],
      },
    },
  });
  return response?.mdms;
};

export const useMDMSV2Search = ({ tenantId, moduleName, masterName, formId, config = {} }) => {
  return useQuery({
    queryKey: ["MDMS_V2_SEARCH", tenantId, moduleName, masterName, formId, config],
    queryFn: () => mdmsV2Search({ tenantId, moduleName, masterName, formId }),
    ...config,
  });
};
