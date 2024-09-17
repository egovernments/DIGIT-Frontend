const createChecklistService = async (req, tenantId) => {
  try {
    const response = await Digit.CustomService.getResponse({
      url: "/service-request/service/definition/v1/_create",
      body: {
        ServiceDefinition: req,
      },
    });
    return response;
  } catch (error) {
    if (!error?.response?.data?.Errors[0].description) {
      throw new Error(error?.response?.data?.Errors[0].code);
    } else {
      throw new Error(error?.response?.data?.Errors[0].description);
    }
  }
};

export default createChecklistService;
