const searchPlanEmployeeWithTaggingConfig = async ({ tenantId, body, limit, offset, sortOrder = "ASC", names }) => {
  try {
    const response = await Digit.CustomService.getResponse({
      url: "/plan-service/employee/_search",
      useCache: false,
      method: "POST",
      userService: false,
      params: {
        tenantId: tenantId,
        limit: limit,
        offset: offset,
        sortOrder: sortOrder,
      },
      body: body,
    });
    if (!response) {
      throw new Error("Employee not found with the given role");
    }
    const uuids = response?.PlanEmployeeAssignment?.map((i) => i.employeeId);
    if (!uuids || uuids?.length === 0) {
      return null;
    }
    const fetchEmployeeData = await Digit.CustomService.getResponse({
      url: "/health-hrms/employees/_search",
      useCache: false,
      method: "POST",
      userService: false,
      params: {
        tenantId: tenantId,
        limit: limit,
        offset: offset,
        sortOrder: sortOrder,
        userServiceUuids: uuids.join(","),
        names: names
      },
    });
    if (!fetchEmployeeData) {
      throw new Error("Employee not found with the given role");
    }
    return {
      data: fetchEmployeeData?.Employees,
      planData: response?.PlanEmployeeAssignment,
      totalCount: response?.TotalCount,
    };
  } catch (error) {
    if (error?.response?.data?.Errors) {
      throw new Error(error.response.data.Errors[0].message);
    }
    throw new Error("An unknown error occurred");
  }
};

export default searchPlanEmployeeWithTaggingConfig;