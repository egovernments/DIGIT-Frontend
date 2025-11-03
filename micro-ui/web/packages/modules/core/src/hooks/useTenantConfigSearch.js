import { useQuery } from "@tanstack/react-query";

const tenantConfigSearchService = async ({ tenantId, filter, pagination }) => {
  const response = await Digit.CustomService.getResponse({
    url: "/tenant-management/tenant/config/_search",
    body: {},
    params: {
      code: tenantId,
    },
  });
  return response?.tenantConfigs;
};

export const useTenantConfigSearch = ({ tenantId, filter, pagination, config = {} }) => {
  return useQuery({
    queryKey : ["SEARCH_TENANT_CONFIG", tenantId, filter, pagination],
    queryFn : () => tenantConfigSearchService({ tenantId, filter, pagination }),
    ...config
  }
  );
};
