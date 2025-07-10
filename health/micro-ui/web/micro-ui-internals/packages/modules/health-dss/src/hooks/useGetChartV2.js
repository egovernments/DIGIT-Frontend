import { useMemo } from "react";
import { defaultSelect } from "../utils/defaultSelect";

const useGetChartV2 = (aggregationRequestDto) => {
  const tenantId = Digit?.ULBService?.getCurrentTenantId();
  const authToken = Digit.UserService.getUser()?.access_token || null;

  const reqCriteria = useMemo(
    () => ({
      url: `/dashboard-analytics/dashboard/getChartV2`,
      body: {
        aggregationRequestDto: {
          ...aggregationRequestDto,
        },
        headers: {
          tenantId,
        },
      },
      params: {},
      headers: {
        "auth-token": authToken,
      },
      config: {
        select: defaultSelect,
        staleTime: 5 * 60 * 1000, 
        cacheTime: 30 * 30 * 1000
      },
    }),
    [aggregationRequestDto, tenantId, authToken, defaultSelect]
  );

  const { data, isLoading, refetch } = Digit.Hooks.useCustomAPIHook(reqCriteria);

  return { data, isLoading, refetch };
};

export default useGetChartV2;