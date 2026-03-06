import { useMemo } from "react";
import useSimpleElasticsearch from "./useSimpleElasticsearch";
import { getKibanaDetails } from "../utils/getProjectServiceUrl";

// Source fields to fetch from the stock ES index
const STOCK_SOURCE_FIELDS = [
  "Data.id",
  "Data.clientReferenceId",
  "Data.productVariantId",
  "Data.senderId",
  "Data.receiverId",
  "Data.senderType",
  "Data.receiverType",
  "Data.transactionType",
  "Data.quantity",
  "Data.referenceId",
  "Data.referenceIdType",
  "Data.additionalFields",
  "Data.auditDetails",
];

// Transform an ES hit (_source.Data) into the same shape as /stock/v1/_search response
const transformHitToStock = (hit) => {
  const source = hit?._source?.Data || hit?._source || {};
  return {
    id: source.id,
    clientReferenceId: source.clientReferenceId,
    productVariantId: source.productVariantId,
    senderId: source.senderId,
    receiverId: source.receiverId,
    senderType: source.senderType,
    receiverType: source.receiverType,
    transactionType: source.transactionType,
    quantity: source.quantity,
    referenceId: source.referenceId,
    referenceIdType: source.referenceIdType,
    additionalFields: source.additionalFields || { fields: [] },
    auditDetails: source.auditDetails || {},
  };
};

const useKibanaStockSearch = ({ tenantId, dateRange, referenceId, enabled = true }) => {
  const indexName = getKibanaDetails("projectStockIndex") || "od-stock-index-v1";

  // Build the ES query from the same filters used by the stock API
  const query = useMemo(() => {
    const mustClauses = [];

    // Filter by referenceId (projectId)
    if (referenceId) {
      mustClauses.push({
        term: { "Data.referenceId.keyword": referenceId },
      });
    }

    // Date range filter on auditDetails.createdTime (epoch ms)
    if (dateRange?.startDate || dateRange?.endDate) {
      const rangeFilter = {};
      if (dateRange.startDate) {
        rangeFilter.gte = dateRange.startDate instanceof Date
          ? dateRange.startDate.getTime()
          : dateRange.startDate;
      }
      if (dateRange.endDate) {
        rangeFilter.lte = dateRange.endDate instanceof Date
          ? dateRange.endDate.getTime()
          : dateRange.endDate;
      }
      mustClauses.push({
        range: { "Data.auditDetails.createdTime": rangeFilter },
      });
    }

    // If no filters, match all
    if (mustClauses.length === 0) {
      return { match_all: {} };
    }

    return { bool: { must: mustClauses } };
  }, [referenceId, dateRange]);

  const esConfig = useMemo(() => ({
    indexName,
    query,
    sourceFields: STOCK_SOURCE_FIELDS,
    maxRecordLimit: 10000,
    maxBatchSize: 2500,
    parallelBatches: 4,
    enabled: enabled && !!tenantId,
    autoFetch: true,
  }), [indexName, query, tenantId, enabled]);

  const { data: esHits, loading, error, progress, refetch } = useSimpleElasticsearch(esConfig);

  // Normalize ES hits to stock API response shape
  const stockData = useMemo(() => {
    if (!esHits?.length) return [];
    return esHits.map(transformHitToStock);
  }, [esHits]);

  return {
    data: stockData,
    isLoading: loading,
    error,
    progress,
    refetch,
    source: "kibana",
  };
};

export default useKibanaStockSearch;
