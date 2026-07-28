import { useState, useEffect } from "react";
import useKibanaStockSearch from "./useKibanaStockSearch";
import useStockSearch from "./useStockSearch";

/**
 * Unified stock data hook with Kibana-first strategy and fallback to stock API.
 *
 * @param {Object} params
 * @param {string} params.tenantId - Tenant ID
 * @param {Object} params.dateRange - { startDate, endDate } (Date objects or epoch ms)
 * @param {string} params.referenceId - Project ID used as referenceId filter
 * @param {boolean} params.useKibana - Whether to try Kibana/ES first (default: true)
 * @param {Function} params.transformFn - Optional transform for stock API fallback
 * @param {Object} params.filters - Additional getChartV2 filter keys (e.g. { stockEntryType, status }),
 *   forwarded to useKibanaStockSearch only — the stock API fallback has no equivalent filter support.
 * @param {boolean} params.enabled - Extra gate ANDed into both underlying hooks' enabled state
 *   (e.g. to hold off firing until a required filter value like facilityId is known).
 * @returns {{ data: Array, isLoading: boolean, error: any, source: string }}
 */
const useStockData = ({ tenantId, dateRange, referenceId, campaignId, campaignNumber, useKibana = true, transformFn, filters, enabled = true }) => {
  const [kibanaFailed, setKibanaFailed] = useState(false);
  const useKibanaActive = useKibana && !kibanaFailed;

  // Kibana hook — always called (React rules) but only enabled when active
  const kibanaResult = useKibanaStockSearch({
    tenantId,
    dateRange,
    referenceId,
    campaignId,
    campaignNumber,
    enabled: useKibanaActive && enabled,
    filters,
  });

  // Stock API hook — enabled when Kibana is not active
  const apiResult = useStockSearch({
    tenantId,
    dateRange,
    referenceId,
    transformFn,
    enabled: !useKibanaActive && enabled,
  });

  // If Kibana errors out, flip to stock API fallback
  useEffect(() => {
    if (useKibanaActive && kibanaResult.error) {
      console.warn("Kibana stock search failed, falling back to stock API:", kibanaResult.error);
      setKibanaFailed(true);
    }
  }, [useKibanaActive, kibanaResult.error]);

  if (useKibanaActive) {
    return {
      data: kibanaResult.data,
      isLoading: kibanaResult.isLoading,
      error: kibanaResult.error,
      metadata: kibanaResult.metadata,
      refetch: kibanaResult.refetch,
      source: "kibana",
    };
  }

  return {
    data: apiResult.data,
    isLoading: apiResult.isLoading,
    error: apiResult.error,
    metadata: null,
    refetch: apiResult.refetch,
    source: "stockApi",
  };
};

export default useStockData;
