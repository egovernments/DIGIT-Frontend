const searchPlanConfig = async (body) => {
  try {
    //assuming it will be success
    const response = await Digit.CustomService.getResponse({
      url: "/plan-service/config/_search",
      useCache: false,
      method: "POST",
      userService: true,
      body,
    });
    return response?.PlanConfiguration?.[0];
  } catch (error) {
    console.error("Error searching plan config:", error);
    throw error;
  }
};
const updatePlan = async (req) => {
  try {
    const planRes = await Digit.CustomService.getResponse({
      url: "/plan-service/config/_update",
      body: {
        PlanConfiguration: req,
      },
    });
    return planRes;
  } catch (error) {
    console.error("Error updating plan:", error);
    throw error;
  }
};
const useCompleteSetUpFlow = async ({ microplanId, tenantId, triggeredFrom }) => {
  try {
    const fetchedPlanForSummary = await searchPlanConfig({
      PlanConfigurationSearchCriteria: {
        tenantId,
        id: microplanId,
      },
    });
    if (!fetchedPlanForSummary) {
      throw new Error("Plan configuration not found");
    }

    const updatedReqForCompleteSetup = {
      ...fetchedPlanForSummary,
      workflow: {
        action: "INITIATE",
      },
      additionalDetails: {
        ...fetchedPlanForSummary.additionalDetails,
        setupCompleted: true,
      },
    };
    const planResForCompleteSetup = await updatePlan(updatedReqForCompleteSetup);

    if (planResForCompleteSetup?.PlanConfiguration?.[0]?.id) {
      const response = {
        triggeredFrom,
        redirectTo: `/${window.contextPath}/employee/microplan/setup-completed-response`,
        isState: true,
        state: {
          message: "SETUP_COMPLETED",
          back: "BACK_TO_HOME",
          backlink: `/${window.contextPath}/employee`,
          responseId: planResForCompleteSetup?.PlanConfiguration?.[0]?.name,
          info: "SETUP_MICROPLAN_SUCCESS_NAME",
        },
      };
      return response;
    } else {
      const response = {
        isError: true,
      };
      return response;
    }
  } catch (error) {
    console.error("Error in useCompleteSetUpFlow:", error);
    return {
      isError: true,
      errorMessage: error.message || "Failed to complete setup flow",
    };
  }
};

export default useCompleteSetUpFlow;
