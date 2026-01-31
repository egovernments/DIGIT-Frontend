import { useMutation } from "@tanstack/react-query";

const createProductService = async (req, tenantId) => {
  try {
    const response = await Digit.CustomService.getResponse({
      url: "/product/v1/_create",
      body: {
        Product: req,
        apiOperation: "CREATE",
      },
    });
    return response;
  } catch (error) {
    throw new Error(error?.response?.data?.Errors?.[0].description);
  }
};

const useCreateProduct = (tenantId) => {
  return useMutation({
    mutationFn:(reqData) => {
    return createProductService(reqData, tenantId);
  }
  });
};

export default useCreateProduct;
