import { useMemo } from "react";

/**
 * Computes per-(facility, productVariant) stock metrics (totalReceived/Issued/Rejected/Returned/
 * balance) for a given list of facility IDs, via two real Elasticsearch aggregation queries merged
 * client-side. No raw-document dump, no per-record classification loop.
 *
 * Two getChartV2 calls, both scoped to campaignNumber + the given facilityIds:
 * 1. commodityFacilityStockMetricsBySender — per (facility, productVariant) metrics from the
 *    facilityId side: totalReceivedIn, totalLess, totalIssued, totalReturnedOut, totalRejectedSender.
 * 2. commodityFacilityStockMetricsByReceiver — complementary metrics from the transactingFacilityId
 *    side: totalReceivedFromIssue, totalReceivedFromReturn, totalRejectedReceiver.
 *
 * Merge formula (verified against the original per-record classification rules):
 *   totalReceived = A.totalReceivedIn - A.totalLess + B.totalReceivedFromIssue + B.totalReceivedFromReturn
 *   totalIssued   = A.totalIssued
 *   totalReturned = A.totalReturnedOut
 *   totalRejected = A.totalRejectedSender + B.totalRejectedReceiver
 *   balance       = totalReceived - totalIssued - totalReturned
 *
 * Shared by useStockSummaryAggregate.js (scoped to a user's full descendant facility tree) and
 * NewShipmentPopup.js (scoped to a single "From" facility, for stock-availability validation).
 *
 * @param {Object} params
 * @param {string} params.tenantId
 * @param {string} params.campaignNumber
 * @param {Array} params.facilityIds - facility IDs to scope both aggregation queries to
 * @param {string} [params.cycle] - Optional cycle code (e.g. "01") to scope both queries to a single campaign cycle
 * @param {boolean} params.enabled
 * @returns {{ rows: Array, isLoading: boolean, error: any, refetch: Function }}
 */
const useFacilityStockMetrics = ({ tenantId, campaignNumber, facilityIds, cycle, enabled = true }) => {
  const facilityIdsKey = JSON.stringify(facilityIds || []);

  const senderReqCriteria = useMemo(() => ({
    url: `/dashboard-analytics/dashboard/getChartV2`,
    body: {
      aggregationRequestDto: {
        visualizationCode: "commodityFacilityStockMetricsBySender",
        visualizationType: "table",
        queryType: "",
        requestDate: { startDate: 0, endDate: Date.now(), interval: "day", title: "home" },
        filters: { campaignNumber: campaignNumber || "", facilityId: JSON.parse(facilityIdsKey), ...(cycle ? { cycle } : {}) },
        aggregationFactors: null,
      },
      headers: { tenantId: tenantId || "" },
    },
    config: {
      enabled: enabled && !!tenantId && !!campaignNumber && JSON.parse(facilityIdsKey).length > 0,
      refetchOnMount: "always",
      select: (data) => data?.responseData?.data || [],
    },
    changeQueryName: `facilityStockMetricsSender_${tenantId}_${campaignNumber}_${facilityIdsKey}_${cycle || ""}`,
  }), [tenantId, campaignNumber, facilityIdsKey, cycle, enabled]);

  const receiverReqCriteria = useMemo(() => ({
    url: `/dashboard-analytics/dashboard/getChartV2`,
    body: {
      aggregationRequestDto: {
        visualizationCode: "commodityFacilityStockMetricsByReceiver",
        visualizationType: "table",
        queryType: "",
        requestDate: { startDate: 0, endDate: Date.now(), interval: "day", title: "home" },
        filters: { campaignNumber: campaignNumber || "", transactingFacilityId: JSON.parse(facilityIdsKey), ...(cycle ? { cycle } : {}) },
        aggregationFactors: null,
      },
      headers: { tenantId: tenantId || "" },
    },
    config: {
      enabled: enabled && !!tenantId && !!campaignNumber && JSON.parse(facilityIdsKey).length > 0,
      refetchOnMount: "always",
      select: (data) => data?.responseData?.data || [],
    },
    changeQueryName: `facilityStockMetricsReceiver_${tenantId}_${campaignNumber}_${facilityIdsKey}_${cycle || ""}`,
  }), [tenantId, campaignNumber, facilityIdsKey, cycle, enabled]);

  const { data: senderRows = [], isLoading: senderLoading, isFetching: senderFetching, error: senderError, refetch: refetchSender } = Digit.Hooks.useCustomAPIHook(senderReqCriteria);
  const { data: receiverRows = [], isLoading: receiverLoading, isFetching: receiverFetching, error: receiverError, refetch: refetchReceiver } = Digit.Hooks.useCustomAPIHook(receiverReqCriteria);

  const rows = useMemo(() => {
    const getPlot = (row, name) => row?.plots?.find((p) => p.name === name);
    const getValue = (row, name) => getPlot(row, name)?.value || 0;
    const getLabel = (row, name) => getPlot(row, name)?.label;

    const statsMap = {};
    const getOrInit = (facilityId, productVariantId) => {
      const key = `${facilityId}::${productVariantId}`;
      if (!statsMap[key]) {
        statsMap[key] = { facilityId, productVariantId, totalReceived: 0, totalIssued: 0, totalRejected: 0, totalReturned: 0 };
      }
      return statsMap[key];
    };

    (senderRows || []).forEach((row) => {
      const facilityId = getLabel(row, "Facility");
      const productVariantId = getLabel(row, "Product Variant");
      if (!facilityId || !productVariantId) return;
      const stats = getOrInit(facilityId, productVariantId);
      stats.totalReceived += getValue(row, "totalReceivedIn | Quantity") - getValue(row, "totalLess | Quantity");
      stats.totalIssued += getValue(row, "totalIssued | Quantity");
      stats.totalReturned += getValue(row, "totalReturnedOut | Quantity");
      stats.totalRejected += getValue(row, "totalRejectedSender | Quantity");
    });

    (receiverRows || []).forEach((row) => {
      const facilityId = getLabel(row, "Facility");
      const productVariantId = getLabel(row, "Product Variant");
      if (!facilityId || !productVariantId) return;
      const stats = getOrInit(facilityId, productVariantId);
      stats.totalReceived += getValue(row, "totalReceivedFromIssue | Quantity") + getValue(row, "totalReceivedFromReturn | Quantity");
      stats.totalRejected += getValue(row, "totalRejectedReceiver | Quantity");
    });

    return Object.values(statsMap).map((s) => ({ ...s, balance: s.totalReceived - s.totalIssued - s.totalReturned }));
  }, [senderRows, receiverRows]);

  const isLoading = senderLoading || senderFetching || receiverLoading || receiverFetching;
  const error = senderError || receiverError || null;
  const refetch = () => {
    refetchSender?.();
    refetchReceiver?.();
  };

  return { rows, isLoading, error, refetch };
};

export default useFacilityStockMetrics;
