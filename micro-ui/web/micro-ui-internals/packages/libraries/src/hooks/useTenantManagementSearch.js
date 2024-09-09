import { useQuery } from "react-query";

const tenantManagementSearchService = async ({ stateId, includeSubTenants = true, filter, pagination }) => {
  const response = await Digit.CustomService.getResponse({
    url: "/tenant-management/tenant/_search",
    body: {
      apiOperation: "SEARCH",
    },
    params: {
      code: stateId,
      includeSubTenants: includeSubTenants,
    },
  });
  return response?.Tenants;
};

export const useTenantManagementSearch = ({ stateId, includeSubTenants = true, filter, pagination, config = {} }) => {
  return useQuery(
    ["SEARCH_TENANT_MANAGEMENT", stateId, filter, includeSubTenants, pagination],
    () => tenantManagementSearchService({ stateId, includeSubTenants, filter, pagination }),
    config
  );
};
