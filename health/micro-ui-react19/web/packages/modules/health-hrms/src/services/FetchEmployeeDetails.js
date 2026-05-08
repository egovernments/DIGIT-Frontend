import Urls from "./urls";

const employeeDetailsFetch = async (userCode, tenantId) => {
  try {
    const empResponse = await Digit.CustomService.getResponse({
      url: Urls.hcm.searchStaff,
      useCache: false,
      method: "POST",
      userService: false,
      params: { tenantId, offset: 0, limit: 100 },
      body: { ProjectStaff: { staffId: [userCode] } },
    });

    const resData = empResponse?.ProjectStaff;

    const response = await Digit.CustomService.getResponse({
      url: Urls.hcm.searchProject,
      useCache: false,
      method: "POST",
      userService: false,
      params: {
        tenantId,
        offset: 0,
        limit: 100,
        includeAncestors: false,
        includeDescendants: false,
      },
      body: {
        Projects: resData?.map((data) => ({
          id: data.projectId,
          tenantId,
        })),
      },
    });

    if (!response) {
      throw new Error("No Staff found");
    }

    return response;
  } catch (error) {
    if (error?.response?.data?.Errors) {
      throw new Error(error.response.data.Errors[0].message);
    }
    throw new Error("An unknown error occurred");
  }
};

export default employeeDetailsFetch;
