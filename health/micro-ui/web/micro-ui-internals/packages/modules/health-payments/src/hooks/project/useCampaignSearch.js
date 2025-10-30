import { useQuery } from "react-query";

const searchCampaignService = async ({ tenantId, filter, pagination }) => {
  // Get default RequestInfo
  const requestInfo = Digit.Utils.getRequestInfo();

  // Inject a new role
  requestInfo.userInfo.roles.push({
    name: "Campaign Managers",
    code: "CAMPAIGN_MANAGER",
    tenantId: "dev",
  });

  const response = await Digit.CustomService.getResponse({
    url: "/project-factory/v1/project-type/search",
    body: {
      //RequestInfo: requestInfo,

      CampaignDetails: {
        tenantId: tenantId,
        ...filter,
        pagination: {
          ...pagination,
        },
      },
    },
    //overrideRequestInfo: true,
  });

  return response?.CampaignDetails;
};

export const useSearchCampaign = ({ tenantId, filter, pagination, config = {} }) => {
  return useQuery(["SEARCH_CAMPAIGN", tenantId, filter, pagination], () => searchCampaignService({ tenantId, filter, pagination }), {
    ...config,
    cacheTime: 0,
  });
};
