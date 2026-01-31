import { useQuery } from "@tanstack/react-query";

const searchCampaignService = async ({ tenantId, filter, pagination }) => {
  const response = await Digit.CustomService.getResponse({
    url: "/project-factory/v1/project-type/search",
    body: {
      CampaignDetails: {
        tenantId: tenantId,
        ...filter,
        pagination: {
          ...pagination,
        },
      },
    },
  });
  return response?.CampaignDetails;
};

export const useSearchCampaign = ({ tenantId, filter, pagination, config = {} }) => {
  return useQuery({
    queryKey: ["SEARCH_CAMPAIGN", tenantId, filter, pagination],
    queryFn: () => searchCampaignService({ tenantId, filter, pagination }),
    cacheTime: 0,
    staleTime: 0,
    refetchOnMount: "always",
    ...config,
  });
};
