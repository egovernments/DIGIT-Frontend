import { useMemo } from "react";

/**
 * Fetches the campaign-wide stock summary via getChartV2 API (visualizationCode: "commodityStockSummary"),
 * which now runs real Elasticsearch aggregations (terms + sum + cardinality) instead of a raw-document dump.
 *
 * Returns the same `{ by_event_type: { buckets }, by_product: { buckets }, unique_facilities: { value } }`
 * shape that `stockDataProcessor.js`'s `computeFromAggregations()` expects, adapted from the backend's
 * flat response (`eventTypeAgg`/`productAgg` arrays, `uniqueFacilities` number) so downstream code doesn't change.
 *
 * @param {Object} params
 * @param {string} params.tenantId
 * @param {string} params.campaignNumber
 * @param {string} [params.cycle] - Optional cycle code (e.g. "01") to scope the aggregation to a single campaign cycle
 * @param {boolean} params.enabled
 * @returns {{ aggregations: Object|null, isLoading: boolean, error: any, refetch: Function }}
 */
const useCommodityStockSummaryAggregate = ({ tenantId, campaignNumber, cycle, enabled = true }) => {
  const reqCriteria = useMemo(() => ({
    url: `/dashboard-analytics/dashboard/getChartV2`,
    body: {
      aggregationRequestDto: {
        visualizationCode: "commodityStockSummary",
        visualizationType: "metric",
        queryType: "",
        requestDate: {
          startDate: 0,
          endDate: Date.now(),
          interval: "day",
          title: "home",
        },
        filters: { campaignNumber: campaignNumber || "", ...(cycle ? { cycle } : {}) },
        aggregationFactors: null,
      },
      headers: { tenantId: tenantId || "" },
    },
    config: {
      enabled: enabled && !!tenantId && !!campaignNumber,
      refetchOnMount: "always",
      select: (data) => data?.responseData?.customData?.rawResponse || null,
    },
    changeQueryName: `commodityStockSummaryAgg_${tenantId}_${campaignNumber}_${cycle || ""}`,
  }), [tenantId, campaignNumber, cycle, enabled]);

  const { data: rawResponse, isLoading, refetch } = Digit.Hooks.useCustomAPIHook(reqCriteria);

  // Adapt the backend's flat shape back into the nested { buckets } shape computeFromAggregations() expects,
  // so that function keeps reading `by_event_type.buckets` / `by_product.buckets` / `unique_facilities.value`.
  const aggregations = useMemo(() => {
    if (!rawResponse) return null;
    return {
      by_event_type: { buckets: rawResponse.eventTypeAgg || [] },
      by_product: {
        buckets: (rawResponse.productAgg || []).map((p) => ({
          key: p.key,
          doc_count: p.doc_count,
          total_quantity: { value: p.total_quantity },
          by_event_type: { buckets: p.eventTypeBreakdown || [] },
        })),
      },
      unique_facilities: { value: rawResponse.uniqueFacilities || 0 },
    };
  }, [rawResponse]);

  const error = (!isLoading && enabled && !!tenantId && !!campaignNumber && rawResponse === undefined)
    ? new Error("getChartV2 commodityStockSummary request failed")
    : null;

  return { aggregations, isLoading, error, refetch };
};

export default useCommodityStockSummaryAggregate;
