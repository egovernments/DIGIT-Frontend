export const useGenerateIdCampaign = (type ,hierarchyType="ADMIN", filters) => {
  const reqCriteriaFacility = {
    url: `/project-factory/v1/data/_generate`,
    changeQueryName :   `${type}-${hierarchyType}`,
    params: {
      tenantId: "mz",
      type: type,
      forceUpdate: true,
      hierarchyType: hierarchyType,
    },
    body: {},
  };

  const { isLoading, data: Data } = Digit.Hooks.useCustomAPIHook(reqCriteriaFacility);

  return Data?.GeneratedResource?.[0]?.id;
};
