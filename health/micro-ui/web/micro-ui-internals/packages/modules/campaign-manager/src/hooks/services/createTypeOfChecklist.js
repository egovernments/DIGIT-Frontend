const createTypeOfChecklist = async (req, tenantId) => {
    try {
      const response = await Digit.CustomService.getResponse({
        url: "/mdms-v2/v1/_search",
        body: {
          MdmsCriteria: req,
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
  
  export default createTypeOfChecklist;
  