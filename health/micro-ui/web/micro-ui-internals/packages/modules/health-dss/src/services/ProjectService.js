export const ProjectService = {
  staffSearch: async ({ body, params }) => {
    try {
      const response = await Digit.CustomService.getResponse({
        url:
          window?.globalConfigs?.getConfig("PROJECT_SERVICE_PATH")
            ? `/${String(window.globalConfigs.getConfig("PROJECT_SERVICE_PATH"))}/staff/v1/_search`
            : "/health-project/staff/v1/_search",
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
        url:
          window?.globalConfigs?.getConfig("PROJECT_SERVICE_PATH")
            ? `/${String(window.globalConfigs.getConfig("PROJECT_SERVICE_PATH"))}/v1/_search`
            : "/health-project/v1/_search",
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
};

export default ProjectService;
