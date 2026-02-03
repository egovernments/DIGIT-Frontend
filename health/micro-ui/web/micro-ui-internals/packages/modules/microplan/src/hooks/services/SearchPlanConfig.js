const shouldSkipApiCall = (obj) => {
  let count = 0;

  for (const key in obj) {
    if (obj[key]) count++; // Count only truthy values
    if (count > 1) return false; // Early exit if more than one defined key
  }

  return true;
};

const SearchPlanConfig = async (body) => {
  try {
    //added this to prevent unneccesary api calls being made to plan service with just tenantId in the request body
    if(shouldSkipApiCall(body.PlanConfigurationSearchCriteria)) {
      return []
     }
    const response = await Digit.CustomService.getResponse({
      url: "/plan-service/config/_search",
      useCache: false,
      method: "POST",
      userService: true,
      body,
    });
    return response?.PlanConfiguration?.[0];
  } catch (error) {
    if (error?.response?.data?.Errors) {
      throw new Error(error.response.data.Errors[0].message);
    }
    throw new Error("An unknown error occurred");
  }
};

export default SearchPlanConfig;
