import { useMemo } from "react";

/**
 * Fetches warehouse manager sync stats via getChartV2 API
 * (visualizationCode: "commodityWarehouseManagerSynced").
 *
 * Replaces the previous dual-ES-query implementation. The getChartV2 response
 * provides totalManagers, syncedManagers, and syncRate in a single call.
 *
 * Returns: { totalManagers, syncedManagers, syncRate, isLoading, error }
 */
const useWarehouseManagerSync = ({ enabled = true, dateRange, campaignId } = {}) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const reqCriteria = useMemo(() => {
    const user = Digit.UserService.getUser();
    const RequestInfo = {
      apiId: "Rainmaker",
      authToken: user?.access_token,
      userInfo: user?.info,
      msgId: `${Date.now()}|${Digit.StoreData?.getCurrentLanguage?.() || "en_IN"}`,
      plainAccessRequest: {},
    };

    const startDate = dateRange?.startDate instanceof Date ? dateRange.startDate.getTime() : dateRange?.startDate || 0;
    const endDate = dateRange?.endDate instanceof Date ? dateRange.endDate.getTime() : dateRange?.endDate || Date.now();

    return {
      url: `/dashboard-analytics/dashboard/getChartV2`,
      body: {
        aggregationRequestDto: {
          visualizationCode: "commodityWarehouseManagerSynced",
          visualizationType: "metric",
          queryType: "",
          requestDate: {
            startDate,
            endDate,
            interval: "day",
            title: "home",
          },
          filters: { campaignId: campaignId || "" },
          aggregationFactors: null,
        },
        headers: { tenantId: tenantId || "" },
        RequestInfo,
      },
      config: {
        enabled: enabled && !!tenantId,
        select: (data) => data?.responseData?.customData?.rawResponse || {},
      },
      changeQueryName: `warehouseManagerSync_${tenantId}_${campaignId}_${startDate}_${endDate}`,
    };
  }, [tenantId, enabled, dateRange, campaignId]);

  const { data: syncData, isLoading, refetch } = Digit.Hooks.useCustomAPIHook(reqCriteria);

  const result = useMemo(() => {
    const totalManagers = syncData?.totalManagers || 0;
    const syncedManagers = syncData?.syncedManagers || 0;
    const rawSyncRate = syncData?.syncRate || (totalManagers > 0 ? (syncedManagers / totalManagers) * 100 : 0);
    const syncRate = Math.round(rawSyncRate * 100) / 100;
    return { totalManagers, syncedManagers, syncRate };
  }, [syncData]);

  const error = (!isLoading && enabled && !!tenantId && syncData === undefined) ? new Error("getChartV2 WM sync request failed") : null;

  return {
    ...result,
    isLoading,
    error,
  };
};

export default useWarehouseManagerSync;
