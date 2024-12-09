const useFcilityCatchmentMapping = (props) => {
  const user = Digit.UserService.getUser();
  const url = Digit.Hooks.useQueryParams();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const {
    isLoading: isPlanLoading,
    data: planEmployee,
    error: planEmployeeError,
    refetch: refetchPlanEmployee,
  } = Digit.Hooks.microplanv1.usePlanSearchEmployeeWithTagging({
    tenantId: tenantId,
    body: {
      PlanEmployeeAssignmentSearchCriteria: {
        tenantId: tenantId,
        planConfigurationId: url?.microplanId,
        active: true,
        employeeId: [user?.info?.uuid],
      },
    },
    config: {
      enabled: true,
    },
  });

  const { facilityName, facilityType, residingBoundaries, status } = props?.state?.searchForm || {};
  var residingBoundariesCodes = residingBoundaries?.map?.((i) => i.code);

  const reqCriteria = {
    url: `/plan-service/plan/facility/_search`,
    params: {},
    body: {
      PlanFacilitySearchCriteria: {
        limit: props?.state?.tableForm?.limit || 10,
        offset: props?.state?.tableForm?.offset || 0,
        tenantId: tenantId,
        planConfigurationId: url?.microplanId,
        jurisdiction: planEmployee?.planData?.[0]?.jurisdiction,
        facilityName: facilityName,
        facilityType: facilityType?.name,
        facilityStatus: status?.name,
        residingBoundaries: residingBoundariesCodes,
      },
    },
    config: {
      enabled: !!planEmployee,
      select: (data) => data,
    },
    changeQueryName: `${facilityName}${facilityType?.name}${residingBoundariesCodes?.map((code) => code).join(', ')}${status?.name}${props?.state?.tableForm?.limit}${props?.state?.tableForm?.offset}`,
  };
  const { isLoading, data, isFetching, refetch, revalidate } = Digit.Hooks.useCustomAPIHook(reqCriteria);
  return {
    isLoading,
    isFetching,
    data,
    refetch,
    revalidate: () => {},
  };
};

export default useFcilityCatchmentMapping;
