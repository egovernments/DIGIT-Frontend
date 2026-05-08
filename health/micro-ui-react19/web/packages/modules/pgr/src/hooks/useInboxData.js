import { useQuery } from "@tanstack/react-query";

const useInboxData = (searchParams, config = {}) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();

  return useQuery({
    queryKey: ["pgr-inbox", tenantId, searchParams],
    queryFn: () =>
      Digit.CustomService.getResponse({
        url: "/inbox/v2/_search",
        useCache: false,
        method: "POST",
        userService: true,
        body: {
          inbox: {
            tenantId,
            processSearchCriteria: {
              tenantId: tenantId.split(".")[0],
              businessService: ["PGR"],
              moduleName: "pgr-services",
            },
            moduleSearchCriteria: {
              ...searchParams?.filters,
              tenantId,
            },
            limit: searchParams?.limit || 10,
            offset: searchParams?.offset || 0,
          },
        },
      }),
    gcTime: 0,
    staleTime: 0,
    enabled: !!tenantId,
    select: (data) => data?.items || [],
    ...config,
  });
};

export default useInboxData;
