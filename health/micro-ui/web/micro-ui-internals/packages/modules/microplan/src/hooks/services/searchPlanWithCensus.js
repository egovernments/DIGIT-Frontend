const searchPlanWithCensus = async ({ tenantId, microplanId, body, limit, offset, roles = "" }) => {
  try {
    const response = await Digit.CustomService.getResponse({
      url: "/plan-service/plan/_search",
      useCache: false,
      method: "POST",
      userService: false,
      params: {},
      body: body,
    });

    if (!response) {
      throw new Error("Employee not found with the given role");
    }

    const localityArray = [...new Set(response?.Plan?.map((item) => item?.locality))];

    const fetchCensusData = await Digit.CustomService.getResponse({
      url: `/census-service/_search`,
      useCache: false,
      method: "POST",
      userService: false,
      params: {},
      body: {
        CensusSearchCriteria: {
          tenantId: tenantId,
          source: microplanId,
          limit: body?.PlanSearchCriteria?.limit,
          jurisdiction: localityArray,
        },
      },
    });

    if (!fetchCensusData) {
      throw new Error("Employee not found with the given role");
    }

    return {
      planData: response?.Plan,
      censusData: fetchCensusData?.Census,
      StatusCount: response?.StatusCount,
      TotalCount: response?.TotalCount,
    };
  } catch (error) {
    if (error?.response?.data?.Errors) {
      throw new Error(error.response.data.Errors[0].message);
    }
    throw new Error("An unknown error occurred");
  }
};

export default searchPlanWithCensus;
