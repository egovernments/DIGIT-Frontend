export const ProjectService = {
  // Context path variable from globalConfigs
  projectContextPath: window?.globalConfigs?.getConfig("PROJECT_CONTEXT_PATH") || "health-project",

  staffSearch: async ({ body, params }) => {
    try {
      const response = await Digit.CustomService.getResponse({
        url: `/${projectContextPath}/staff/v1/_search`,
        useCache: false,
        method: "POST",
        userService: true,
        body,
        params,
      });
      return response?.ProjectStaff;
    } catch (error) {
      if (error?.response?.data?.Errors) {
        throw new Error(error.response.data.Errors[0].message);
      }
      throw new Error("An unknown error occurred");
    }
  },

  projectSearch: async ({ body, params }) => {
    try {
      const response = await Digit.CustomService.getResponse({
        url: `/${projectContextPath}/v1/_search`,
        useCache: false,
        method: "POST",
        userService: true,
        body,
        params,
      });
      return response?.Project;
    } catch (error) {
      if (error?.response?.data?.Errors) {
        throw new Error(error.response.data.Errors[0].message);
      }
      throw new Error("An unknown error occurred");
    }
  },

  mdmsSkillWageSearch: async ({ body, params }) => {
    try {
      const response = await Digit.CustomService.getResponse({
        url: `/egov-mdms-service/v1/_search`,
        useCache: false,
        method: "POST",
        userService: true,
        body,
        params,
      });

      return response;
    } catch (error) {
      if (error?.response?.data?.Errors) {
        throw new Error(error.response.data.Errors[0].message);
      }
      throw new Error("An unknown error occurred");
    }
  },
};

export default ProjectService;
