const censusSearchConfig = async (body) => {
    try {
      const response = await Digit.CustomService.getResponse({
        url: "/census-service/_search",
        useCache: false,
        method: "POST",
        userService: true,
        body,
      });
      return response?.Census;
    } catch (error) {
      if (error?.response?.data?.Errors) {
        throw new Error(error.response.data.Errors[0].message);
      }
      throw new Error("An unknown error occurred");
    }
  };
  
  export default censusSearchConfig;