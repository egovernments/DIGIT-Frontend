export const useProductVariantSearch = async ({ variantId, tenantId }) => {
  const data = await Digit.CustomService.getResponse({
    url: `/product/variant/v1/_search`,
    params: {
      tenantId: tenantId,
      limit: 100,
      offset: 0
    },
    body: {
      ProductVariant: {
        id: [variantId],
      },
    },
    config: {
      enabled: variantId ? true : false,
    },
  });
  return data?.ProductVariant?.[0]?.sku;
};
