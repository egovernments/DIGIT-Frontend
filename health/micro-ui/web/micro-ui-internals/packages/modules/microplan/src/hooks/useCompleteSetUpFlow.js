const searchPlanConfig = async (body) => {
  //assuming it will be success
  const response = await Digit.CustomService.getResponse({
    url: "/plan-service/config/_search",
    useCache: false,
    method: "POST",
    userService: true,
    body,
  });
  return response?.PlanConfiguration?.[0];
};
const updatePlan = async (req) => {
  const planRes = await Digit.CustomService.getResponse({
    url: "/plan-service/config/_update",
    body: {
      PlanConfiguration: req,
    },
  });
  return planRes;
};
const useCompleteSetUpFlow = async ({ microplanId, tenantId, triggeredFrom }) => {
  const fetchedPlanForSummary = await searchPlanConfig({
    PlanConfigurationSearchCriteria: {
      tenantId,
      id: microplanId,
    },
  });
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
      isError : true
    }
    return response
  }
};

export default useCompleteSetUpFlow;
