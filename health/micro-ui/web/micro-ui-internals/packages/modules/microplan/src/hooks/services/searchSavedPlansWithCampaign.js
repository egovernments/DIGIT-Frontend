function mergeArrays(array1, key1, array2, key2) {
  const mergedArray = [];

  // Create a map of values from array2 using key2
  const map = new Map();
  array2.forEach((item) => {
    map.set(item[key2], item);
  });

  // Iterate over array1 and merge with matching items from array2
  array1.forEach((item) => {
    const matchingItem = map.get(item[key1]);
    if (matchingItem) {
      // Merge properties from both items and append to 'CampaignDetails'
      const mergedItem = { ...item, CampaignDetails: { ...matchingItem } };
      mergedArray.push(mergedItem);
    } else {
      // No matching item found in array2, add array1 item with empty 'CampaignDetails'
      const mergedItem = { ...item, CampaignDetails: {} };
      mergedArray.push(mergedItem);
    }
  });
  return mergedArray;
}

const SearchSavedPlansWithCampaign = async (body) => {
  try {
    const uuid = Digit.UserService.getUser().info.uuid;
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const planEmployeeSearch = await Digit.CustomService.getResponse({
      url: "/plan-service/employee/_search",
      useCache: false,
      method: "POST",
      userService: false,
      body: {
        PlanEmployeeAssignmentSearchCriteria: {
          tenantId: tenantId,
          // employeeId: [uuid],
          filterUniqueByPlanConfig: true
        },
      },
    });

    const listOfPlans = planEmployeeSearch?.PlanEmployeeAssignment?.map((i) => i.planConfigurationId);
    if(listOfPlans.length===0){
      return []
    }

    //here get response from both apis and process data and return
    const responsePlan = await Digit.CustomService.getResponse({
      url: "/plan-service/config/_search",
      useCache: false,
      method: "POST",
      userService: false,
      body: {
        PlanConfigurationSearchCriteria: {
          tenantId: tenantId,
          status: body?.PlanConfigurationSearchCriteria?.status,
          limit: body?.PlanConfigurationSearchCriteria?.limit,
          offset: body?.PlanConfigurationSearchCriteria?.offset,
          ids: listOfPlans,
        },
      },
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
    const finalResult = {
      PlanConfiguration: mergeArrays(responsePlan?.PlanConfiguration, "campaignId", responseCampaign?.CampaignDetails, "id"),
    };
    return finalResult;
  } catch (error) {
    if (error?.response?.data?.Errors) {
      throw new Error(error.response.data.Errors[0].message);
    }
    throw new Error("An unknown error occurred");
  }
};

export default SearchSavedPlansWithCampaign;
