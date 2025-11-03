const mergePlanAndCampaign = (planArr, key, CampaignArr) => {
  const newArray = planArr?.map((item, index) => {
    return {
      ...item,
      [key]: CampaignArr?.find((ele, inx) => ele.id === item.campaignId),
    };
  });

  return newArray;
};
const SearchSavedPlans = async (body) => {
  try {
    //here get response from both apis and process data and return
    const responsePlan = await Digit.CustomService.getResponse({
      url: "/plan-service/config/_search",
      useCache: false,
      method: "POST",
      userService: false,
      body,
    });

    const { PlanConfiguration } = responsePlan;
    if (!PlanConfiguration || PlanConfiguration.length === 0) return [];

    const executionPlanIds = PlanConfiguration?.map((row) => row?.campaignId)?.filter((item) => item);
    const CampaignDetails = {
      tenantId: Digit.ULBService.getCurrentTenantId(),
      ids: executionPlanIds,
    };

    const responseCampaign = await Digit.CustomService.getResponse({
      url: "/project-factory/v1/project-type/search",
      useCache: false,
      method: "POST",
      userService: false,
      body: {
        CampaignDetails,
      },
    });
    const finalResponse = {
      PlanConfiguration: mergePlanAndCampaign(responsePlan?.PlanConfiguration, "campaignDetails", responseCampaign?.CampaignDetails),
      TotalCount: responsePlan?.TotalCount
    };
    return finalResponse;
  } catch (error) {
    if (error?.response?.data?.Errors) {
      throw new Error(error.response.data.Errors[0].message);
    }
    throw new Error("An unknown error occurred");
  }
};

export default SearchSavedPlans;
