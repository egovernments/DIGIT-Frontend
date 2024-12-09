const planEmployeeUpdateService = async (body) => {
  try {
    const response = await Digit.CustomService.getResponse({
      url: "/plan-service/employee/_update",
      useCache: false,
      method: "POST",
      userService: true,
      body,
      body,
    });
    return response;
  } catch (error) {
    if (error?.response?.data?.Errors) {
      throw new Error(error.response.data.Errors[0].message);
    }
    throw new Error("An unknown error occurred");
  }
};

export default planEmployeeUpdateService;
