import { useQuery } from "@tanstack/react-query";

const useComplaintTypes = (tenantId, config = {}) => {
  return useQuery({
    queryKey: ["pgr-complaint-types", tenantId],
    queryFn: () =>
      Digit.CustomService.getResponse({
        url: "/egov-mdms-service/v1/_search",
        useCache: true,
        method: "POST",
        userService: false,
        body: {
          MdmsCriteria: {
            tenantId,
            moduleDetails: [
              {
                moduleName: "RAINMAKER-PGR",
                masterDetails: [
                  { name: "ServiceDefs", filter: "[?(@.active==true)]" },
                ],
              },
            ],
          },
        },
      }),
    gcTime: Infinity,
    staleTime: Infinity,
    enabled: !!tenantId,
    select: (data) => data?.MdmsRes?.["RAINMAKER-PGR"]?.ServiceDefs || [],
    ...config,
  });
};

export default useComplaintTypes;
