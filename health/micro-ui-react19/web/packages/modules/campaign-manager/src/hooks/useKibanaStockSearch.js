import { useMemo } from "react";

/**
 * Fetches stock transaction data via getChartV2 API (visualizationCode: "commodityStockSummary").
 *
 * Replaces the previous Kibana/ES proxy implementation. Returns the same interface
 * so that useStockData and downstream consumers (computeFromRawData) work unchanged.
 *
 * @param {Object} params
 * @param {string} params.tenantId
 * @param {Object} params.dateRange - { startDate, endDate } (Date objects)
 * @param {string} params.referenceId - Project ID (unused by getChartV2, kept for interface compat)
 * @param {string} params.campaignId - (unused by getChartV2, kept for interface compat)
 * @param {string} params.campaignNumber - Campaign number used as filter for getChartV2
 * @param {boolean} params.enabled
 * @returns {{ data: Array, isLoading: boolean, error: any, metadata: Object, refetch: Function, source: string }}
 */
const useKibanaStockSearch = ({ tenantId, dateRange, referenceId, campaignId, campaignNumber, enabled = true }) => {
  const reqCriteria = useMemo(() => {
    const startDate = dateRange?.startDate instanceof Date ? dateRange.startDate.getTime() : dateRange?.startDate;
    const endDate = dateRange?.endDate instanceof Date ? dateRange.endDate.getTime() : dateRange?.endDate;

    return {
      url: `/dashboard-analytics/dashboard/getChartV2`,
      body: {
        aggregationRequestDto: {
          visualizationCode: "commodityFacilityStockBalance",
          visualizationType: "metric",
          queryType: "",
          requestDate: {
            startDate: startDate || 0,
            endDate: endDate || Date.now(),
            interval: "day",
            title: "home",
          },
          filters: { campaignId: campaignId || "" },
          aggregationFactors: null,
        },
        headers: { tenantId: tenantId || "" },
      },
      config: {
        enabled: enabled && !!tenantId && !!campaignId,
        select: (data) => data?.responseData?.customData?.rawResponse?.stockBalanceTransformer || [],
      },
      changeQueryName: `stockSummary_${campaignId}_${startDate}_${endDate}`,
    };
  }, [tenantId, dateRange, campaignId, enabled]);

  const { data: rawRecords, isLoading, refetch } = Digit.Hooks.useCustomAPIHook(reqCriteria);

  // Transform getChartV2 records to match the shape expected by downstream consumers
  const stockData = useMemo(() => {
    if (!rawRecords?.length) return [];
    return rawRecords.map((record) => {
      const stockEntryType = record.stockEntryType || "";
      const eventType = record.eventType || record.transactionType || "";

      // RETURNED: facilityId is always the returner (sender),
      // transactingFacilityId is always the receiver (original sender getting stock back)
      // For other types, direction based on transactionType:
      // RECEIVED: facilityId is receiver, transactingFacilityId is sender
      // DISPATCHED: facilityId is sender/dispatcher, transactingFacilityId is receiver
      let senderId, receiverId;
      if (stockEntryType === "RETURNED") {
        senderId = record.facilityId;
        receiverId = record.transactingFacilityId;
      } else {
        const isInbound = eventType === "RECEIVED";
        senderId = isInbound ? record.transactingFacilityId : record.facilityId;
        receiverId = isInbound ? record.facilityId : record.transactingFacilityId;
      }

      return {
        id: record.id,
        productVariantId: record.productVariantId,
        senderId,
        receiverId,
        transactionType: record.transactionType || record.eventType,
        stockEntryType,
        quantity: record.quantity,
        facilityId: record.facilityId,
        facilityName: record.facilityName,
        transactingFacilityId: record.transactingFacilityId,
        transactingFacilityName: record.transactingFacilityName,
        productName: record.productName,
        userName: record.userName,
        nameOfUser: record.nameOfUser,
        status: record.status || "",
        additionalFields: record.additionalFields || null,
        auditDetails: {
          createdTime: record.createdTime || record.dateOfEntry,
        },
      };
    });
  }, [rawRecords]);

  // Return error as null when loading or when there's no explicit error from the hook
  const error = (!isLoading && enabled && !!tenantId && !!campaignId && rawRecords === undefined) ? new Error("getChartV2 stock request failed") : null;

  return {
    data: stockData,
    isLoading,
    error,
    metadata: { aggregations: null }, // Forces computeStockSummary to use computeFromRawData path
    refetch,
    source: "kibana",
  };
};

export default useKibanaStockSearch;
