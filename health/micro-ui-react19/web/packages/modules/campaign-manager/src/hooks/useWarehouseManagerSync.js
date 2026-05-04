import { useMemo } from "react";

/**
 * Fetches warehouse manager sync stats via getChartV2 API.
 *
 * Makes two calls:
 * 1. "commodityWarehouseManagerTotal" → totalManagers (from ba-project-staff-index-v1)
 * 2. "commodityWarehouseManagerSynced" → syncedManagers, syncRate
 *
 * Returns: { totalManagers, syncedManagers, syncRate, isLoading, error }
 */
const useWarehouseManagerSync = ({ enabled = true, dateRange, campaignNumber } = {}) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const commonReqFields = useMemo(() => {
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
    return { RequestInfo, startDate, endDate };
  }, [dateRange]);

  // --- Call 1: Total warehouse managers (commodityWarehouseManagerTotal) ---
  const totalReqCriteria = useMemo(() => {
    const { RequestInfo, startDate, endDate } = commonReqFields;
    return {
      url: `/dashboard-analytics/dashboard/getChartV2`,
      body: {
        aggregationRequestDto: {
          visualizationCode: "commodityWarehouseManagerTotal",
          visualizationType: "metric",
          queryType: "",
          requestDate: {
            startDate,
            endDate,
            interval: "day",
            title: "home",
          },
          filters: { campaignNumber: campaignNumber || "" },
          aggregationFactors: null,
        },
        headers: { tenantId: tenantId || "" },
        RequestInfo,
      },
      config: {
        enabled: enabled && !!tenantId && !!campaignNumber,
        select: (data) => data?.responseData?.customData?.rawResponse || {},
      },
      changeQueryName: `warehouseManagerTotal_${tenantId}_${campaignNumber}_${startDate}_${endDate}`,
    };
  }, [tenantId, enabled, commonReqFields, campaignNumber]);

  // --- Call 2: Synced warehouse managers (commodityWarehouseManagerSynced) ---
  const syncReqCriteria = useMemo(() => {
    const { RequestInfo, startDate, endDate } = commonReqFields;
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
          filters: { campaignNumber: campaignNumber || "" },
          aggregationFactors: null,
        },
        headers: { tenantId: tenantId || "" },
        RequestInfo,
      },
      config: {
        enabled: enabled && !!tenantId && !!campaignNumber,
        select: (data) => data?.responseData?.customData?.rawResponse || {},
      },
      changeQueryName: `warehouseManagerSync_${tenantId}_${campaignNumber}_${startDate}_${endDate}`,
    };
  }, [tenantId, enabled, commonReqFields, campaignNumber]);

  const { data: totalData, isLoading: totalLoading } = Digit.Hooks.useCustomAPIHook(totalReqCriteria);
  const { data: syncData, isLoading: syncLoading } = Digit.Hooks.useCustomAPIHook(syncReqCriteria);

  const isLoading = totalLoading || syncLoading;

  const result = useMemo(() => {
    const totalManagers = totalData?.totalManagers || 0;
    const syncedManagers = syncData?.syncedManagers || 0;
    const rawSyncRate = syncData?.syncRate || (totalManagers > 0 ? (syncedManagers / totalManagers) * 100 : 0);
    const syncRate = Math.round(rawSyncRate * 100) / 100;
    return { totalManagers, syncedManagers, syncRate };
  }, [totalData, syncData]);

  const error = (!isLoading && enabled && !!tenantId && totalData === undefined && syncData === undefined)
    ? new Error("getChartV2 WM sync request failed")
    : null;

  return {
    ...result,
    isLoading,
    error,
  };
};

export default useWarehouseManagerSync;
