import { useMemo, useRef, useEffect } from "react";
import { useQuery } from "react-query";
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
    tenantId,
    body: {
      PlanEmployeeAssignmentSearchCriteria: {
        tenantId,
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
  const residingBoundariesCodes = residingBoundaries?.map?.((i) => i.code);

  const changeQueryName = useMemo(() => {
    return `${facilityName || ""}${facilityType?.name || ""}${residingBoundariesCodes?.join(",") || ""}${status?.name || ""}${props?.state?.tableForm?.limit || 10}${props?.state?.tableForm?.offset || 0}`;
  }, [facilityName, facilityType?.name, residingBoundariesCodes, status?.name, props?.state?.tableForm?.limit, props?.state?.tableForm?.offset]);

  const lastCallTimeRef = useRef(0);

  const throttledFetch = async () => {
    const now = Date.now();
    const waitTime = Math.max(0, 2000 - (now - lastCallTimeRef.current));
    if (waitTime > 0) await new Promise((r) => setTimeout(r, waitTime));
    lastCallTimeRef.current = Date.now();
  
    const body = {
      PlanFacilitySearchCriteria: {
        limit: props?.state?.tableForm?.limit || 10,
        offset: props?.state?.tableForm?.offset || 0,
        tenantId,
        planConfigurationId: url?.microplanId,
        jurisdiction: planEmployee?.planData?.[0]?.jurisdiction,
        facilityName,
        facilityType: facilityType?.name,
        facilityStatus: status?.name,
        residingBoundaries: residingBoundariesCodes,
      },
    };
  
    const response = await Digit.CustomService.getResponse({
      url: "/plan-service/plan/facility/_search",
      body,
      tenantId,
    });
  
    return response;
  };
  
  const { isLoading, data, isFetching, refetch } = useQuery(
    ["FACILITY_CATCHMENT", changeQueryName],
    throttledFetch,
    {
      enabled: false, // Disabling initial auto-call
      cacheTime: 0,
      staleTime: 0,
    }
  );

  // Triggering initial fetch manually when planEmployee is ready
  useEffect(() => {
    if (planEmployee) {
      refetch();
    }
  }, [planEmployee, changeQueryName]);

  return {
    isLoading,
    isFetching,
    data,
    refetch,
    revalidate: () => {},
  };
};

export default useFcilityCatchmentMapping;
