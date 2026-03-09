import { useMemo } from "react";
import useSimpleElasticsearch from "./useSimpleElasticsearch";
import { getKibanaDetails } from "../utils/getProjectServiceUrl";

// Source fields to fetch from the stock ES index
const STOCK_SOURCE_FIELDS = [
  "Data.*",
];

// Aggregations: summary stats computed server-side by ES
const STOCK_AGGS = {
  // Count by transaction type (RECEIVED, DISPATCHED, RETURNED, DAMAGED)
  by_event_type: {
    terms: { field: "Data.eventType.keyword", size: 20 },
    aggs: {
      total_quantity: { sum: { field: "Data.physicalCount" } },
    },
  },
  // Per-product breakdown with quantity sums per event type
  by_product: {
    terms: { field: "Data.productName.keyword", size: 100 },
    aggs: {
      by_event_type: {
        terms: { field: "Data.eventType.keyword", size: 20 },
        aggs: {
          total_quantity: { sum: { field: "Data.physicalCount" } },
        },
      },
      total_quantity: { sum: { field: "Data.physicalCount" } },
    },
  },
  // Unique facility count
  unique_facilities: {
    cardinality: { field: "Data.facilityId.keyword" },
  },
  // Per-facility breakdown
  by_facility: {
    terms: { field: "Data.facilityId.keyword", size: 500 },
    aggs: {
      facility_name: {
        terms: { field: "Data.facilityName.keyword", size: 1 },
      },
      by_event_type: {
        terms: { field: "Data.eventType.keyword", size: 20 },
        aggs: {
          total_quantity: { sum: { field: "Data.physicalCount" } },
        },
      },
    },
  },
  // Per-project breakdown
  by_projectId: {
    terms: { field: "Data.projectId.keyword", size: 20 },
  },
  // Total record count
  total_quantity: { sum: { field: "Data.physicalCount" } },
};

// Transform an ES hit (_source.Data) into the same shape as /stock/v1/_search response
const transformHitToStock = (hit) => {
  const source = hit?._source?.Data || hit?._source || {};

  // Build additionalFields from flat ES fields (ES index has additionalFields: null)
  const fields = [];
  if (source.productName) fields.push({ key: "productName", value: source.productName });
  if (source.waybillNumber) fields.push({ key: "waybillNumber", value: source.waybillNumber });

  return {
    id: source.id,
    clientReferenceId: source.clientReferenceId,
    productVariantId: source.productVariant,
    senderId: source.transactingFacilityId,
    receiverId: source.facilityId,
    senderType: source.transactingFacilityType,
    receiverType: source.facilityType,
    transactionType: source.eventType,
    quantity: source.physicalCount,
    referenceId: source.projectId,
    referenceIdType: "PROJECT",
    facilityId: source.facilityId,
    facilityName: source.facilityName,
    transactingFacilityId: source.transactingFacilityId,
    transactingFacilityName: source.transactingFacilityName,
    additionalFields: { fields },
    auditDetails: {
      createdTime: source.createdTime || source.dateOfEntry,
      lastModifiedTime: source.lastModifiedTime,
      createdBy: source.createdBy,
    },
    // Extra fields from ES that may be useful
    campaignId: source.campaignId,
    projectId: source.projectId,
    projectName: source.projectName,
    userName: source.userName,
    taskDates: source.taskDates,
  };
};

const useKibanaStockSearch = ({ tenantId, dateRange, referenceId, campaignId,enabled = true }) => {
  const indexName = getKibanaDetails("projectStockIndex") || "od-stock-index-v1";

  // Build the ES query from the same filters used by the stock API
  const query = useMemo(() => {
    const mustClauses = [];

    // Filter by referenceId (projectId)
    if (referenceId) {
      mustClauses.push({
        // term: { "Data.projectId.keyword": referenceId },
        term: { "Data.campaignId.keyword": campaignId },
      });
    }

    // Date range filter on dateOfEntry (epoch ms)
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
        range: { "Data.dateOfEntry": rangeFilter },
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
    aggs: STOCK_AGGS,
    maxRecordLimit: 10000,
    enabled: enabled && !!tenantId,
    autoFetch: true,
  }), [indexName, query, tenantId, enabled]);

  const { data: esHits, loading, error, progress, metadata, refetch } = useSimpleElasticsearch(esConfig);

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
    metadata,
    refetch,
    source: "kibana",
  };
};

export default useKibanaStockSearch;
