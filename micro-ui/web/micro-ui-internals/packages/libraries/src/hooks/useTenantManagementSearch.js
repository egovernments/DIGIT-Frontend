
import { useQuery } from "@tanstack/react-query";

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

  const tenants = response?.Tenants || [];
  const modifiedTenants = tenants.map(tenant => {
    const tenantName = tenant?.code || ' ';
    return {
      ...tenant,
      i18nKey: Digit.Utils.locale.getTransformedLocale(`TENANT_TENANTS_${tenantName}`),
    };
  });

  return modifiedTenants;
};

export const useTenantManagementSearch = ({ stateId, includeSubTenants = true, filter, pagination, config = {} }) => {
  return useQuery({
    queryKey: ["SEARCH_TENANT_MANAGEMENT", stateId, filter, includeSubTenants, pagination],
    queryFn: () => tenantManagementSearchService({ stateId, includeSubTenants, filter, pagination }),
    ...config,
  });
};

