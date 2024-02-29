const ViewService = async (id, tenantId) => {
    try {
      const response = await CustomService.getResponse({
        url: "/individual/v1/_search",
        body: {
            Individual: {
              tenantId: "pg.citya",
              individualId: id,
            },
          },
      });
      return response;
    } catch (error) {
      throw new Error(error?.response?.data?.Errors[0].message);
    }
  };
  
  export default ViewService;
  