const SearchHRMSEmployeeConfig = async ({ tenantId, body = {}, limit, microplanId, filters, offset, roles = "" }) => {
  try {
    const response = await Digit.CustomService.getResponse({
      url: "/health-hrms/employees/_search",
      useCache: false,
      method: "POST",
      userService: false,
      // body: body,
      params: {
        tenantId: tenantId,
        limit: limit,
        offset: offset,
        sortOrder: "ASC",
        roles: roles,
        names: filters?.name,
        phone: filters?.number,
      },
    });
    if (response?.Employees?.length === 0) {
      throw new Error("Employee not found with the given role");
    }
    const employeeId = response?.Employees?.map((i) => i.user.userServiceUuid);

    const planSearch = await Digit.CustomService.getResponse({
      url: "/plan-service/employee/_search",
      useCache: false,
      method: "POST",
      userService: false,
      params: {},
      body: {
        PlanEmployeeAssignmentSearchCriteria: {
          tenantId: tenantId,
          planConfigurationId: microplanId,
          employeeId: employeeId,
        },
      },
    });

    return { Employees: response?.Employees, planData: planSearch?.PlanEmployeeAssignment, totalCount: response?.TotalCount };
  } catch (error) {
    if (error?.response?.data?.Errors) {
      throw new Error(error.response.data.Errors[0].message);
    }
    throw new Error("An unknown error occurred");
  }
};

export default SearchHRMSEmployeeConfig;
