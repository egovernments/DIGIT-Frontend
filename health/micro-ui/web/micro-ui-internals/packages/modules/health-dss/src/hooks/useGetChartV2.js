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
      },
    }),
    [aggregationRequestDto, tenantId, authToken, defaultSelect]
  );

  const { data, isLoading, isFetching, refetch } = Digit.Hooks.useCustomAPIHook(reqCriteria);

  return { data, isLoading, isFetching, refetch };
};

export default useGetChartV2;