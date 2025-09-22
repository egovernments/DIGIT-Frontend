export const useProductList = (tenantId,projectType) => {
  const reqCriteriaVariant = {
    url: `/product/variant/v1/_search`,
    params: { tenantId: tenantId, limit: 1000, offset: 0 },
    body: {
      ProductVariant: {},
    },
    config: {
      enabled: true,
      select: (data) => {
        if (projectType === "DEFAULT") {
          return data?.ProductVariant;
        }
        const filteredData = data?.ProductVariant?.filter(item => 
          item.additionalFields?.fields?.some(field => field.key === "projectType" && field.value === projectType)
        );
        return filteredData;
      },
    },
  };

  const { isLoading, data: productVariant, isFetching } = Digit.Hooks.useCustomAPIHook(reqCriteriaVariant);


  const reqCriteriaProduct = {
    url: `/product/v1/_search`,
    params: { tenantId: tenantId, limit: 1000, offset: 0 },
    body: {
      Product: {
        id: productVariant?.map((i) => i?.productId),
      },
    },
    config: {
      enabled: productVariant?.length > 0 && !isLoading ? true : false,
      select: (data) => {
        return data?.Product;
      },
    },
  };

  const { isLoading: isProductLoading, data: product } = Digit.Hooks.useCustomAPIHook(reqCriteriaProduct);


  let productList;
  if (productVariant && product) {
    productList = productVariant
      ?.map((item) => {
        const target = product?.find((j) => j.id === item.productId);
        if (!target?.name || !item?.variation) {
          return null;
        }
        return {
          ...item,
          displayName: `${target?.name} - ${item?.variation}`,
        };
      })
      ?.filter((i) => i !== null);
  }


  return {isLoading: isProductLoading || isLoading , productList: productList};
};
