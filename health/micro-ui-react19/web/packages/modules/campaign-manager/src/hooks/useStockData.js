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
 * @returns {{ data: Array, isLoading: boolean, error: any, source: string }}
 */
const useStockData = ({ tenantId, dateRange, referenceId, campaignId,useKibana = true, transformFn }) => {
  const [kibanaFailed, setKibanaFailed] = useState(false);
  const useKibanaActive = useKibana && !kibanaFailed;

  // Kibana hook — always called (React rules) but only enabled when active
  const kibanaResult = useKibanaStockSearch({
    tenantId,
    dateRange,
    referenceId,
    campaignId,
    enabled: useKibanaActive,
  });

  // Stock API hook — enabled when Kibana is not active
  const apiResult = useStockSearch({
    tenantId,
    dateRange,
    referenceId,
    transformFn,
    enabled: !useKibanaActive,
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
      source: "kibana",
    };
  }

  return {
    data: apiResult.data,
    isLoading: apiResult.isLoading,
    error: apiResult.error,
    metadata: null,
    source: "stockApi",
  };
};

export default useStockData;
