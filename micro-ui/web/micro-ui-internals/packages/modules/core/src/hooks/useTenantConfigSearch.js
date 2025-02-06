import { useQuery } from '@tanstack/react-query'; // Change to the correct import path for TanStack Query

const tenantConfigSearchService = async ({ tenantId, filter, pagination }) => {
  const response = await Digit.CustomService.getResponse({
    url: '/tenant-management/tenant/config/_search',
    body: {},
    params: {
      code: tenantId,
    },
  });
  return response?.tenantConfigs;
};

export const useTenantConfigSearch = ({ tenantId, filter, pagination, config = {} }) => {
  return useQuery(
    ['SEARCH_TENANT_CONFIG', tenantId, filter, pagination], // Ensure the query key uses the new format
    () => tenantConfigSearchService({ tenantId, filter, pagination }),
    config
  );
};
