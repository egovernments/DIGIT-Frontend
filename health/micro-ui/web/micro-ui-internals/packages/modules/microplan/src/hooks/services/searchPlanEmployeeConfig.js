const searchPlanEmployeeConfig = async ({ tenantId, body, limit, offset, roles = "" }) => {
  try {
    const response = await Digit.CustomService.getResponse({
      url: "/plan-service/employee/_search",
      useCache: false,
      method: "POST",
      userService: false,
      params: {},
      body: body,
    });
    if (!response) {
      throw new Error("Employee not found with the given role");
    }
    return response;
  } catch (error) {
    if (error?.response?.data?.Errors) {
      throw new Error(error.response.data.Errors[0].message);
    }
    throw new Error("An unknown error occurred");
  }
};

export default searchPlanEmployeeConfig;
