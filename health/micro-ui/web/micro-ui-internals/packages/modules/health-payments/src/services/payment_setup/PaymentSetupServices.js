export const PaymentSetUpService = {
  // Context path variable from globalConfigs
  projectContextPath: window?.globalConfigs?.getConfig("PROJECT_CONTEXT_PATH") || "health-project",

  billingConfigSearchByProjectId: async ({ body, params }) => {
    try {
      const response = await Digit.CustomService.getResponse({
        url: `/health-expense-calculator/billing-config/v1/_search`,
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

  // info:: for fetching the rates given by user
  mdmsSkillWageRatesSearch: async ({ body, params }) => {
    try {
      const response = await Digit.CustomService.getResponse({
        url: `/egov-mdms-service/v2/_search`,
        useCache: false,
        method: "POST",
        userService: true,
        body,
        params,
      });

      return response?.mdms;
    } catch (error) {
      if (error?.response?.data?.Errors) {
        throw new Error(error.response.data.Errors[0].message);
      }
      throw new Error("An unknown error occurred");
    }
  },


  // info:: for creating the rates given by user
  mdmsSkillWageRatesCreate: async ({ body, params }) => {
    try {
      const response = await Digit.CustomService.getResponse({
        url: `/egov-mdms-service/v2/_create/HCM.WORKER_RATES`,
        useCache: false,
        method: "POST",
        userService: true,
        body,
        params,
      });

      return response?.mdms;
    } catch (error) {
      if (error?.response?.data?.Errors) {
        throw new Error(error.response.data.Errors[0].message);
      }
      throw new Error("An unknown error occurred");
    }
  },


   // info:: for updating the rates given by user
  mdmsSkillWageRatesUpdate: async ({ body, params }) => {
    try {
      const response = await Digit.CustomService.getResponse({
        url: `/egov-mdms-service/v2/_update/HCM.WORKER_RATES`,
        useCache: false,
        method: "POST",
        userService: true,
        body,
        params,
      });

      return response?.mdms;
    } catch (error) {
      if (error?.response?.data?.Errors) {
        throw new Error(error.response.data.Errors[0].message);
      }
      throw new Error("An unknown error occurred");
    }
  },
};

export default ProjectService;
