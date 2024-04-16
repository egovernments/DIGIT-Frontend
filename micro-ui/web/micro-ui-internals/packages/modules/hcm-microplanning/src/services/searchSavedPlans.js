const SearchSavedPlans = async (body) => {
  try {
    //here get response from both apis and process data and return
    const response = await Digit.CustomService.getResponse({
      url: "/plan-service/config/_search",
      useCache: false,
      method: "POST",
      userService: true,
      body,
    });
    return response
  } catch (error) {
    throw new Error(error?.response?.data?.Errors[0].message);
  }
};

export default SearchSavedPlans;
