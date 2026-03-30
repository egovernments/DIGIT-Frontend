/**
 * Unified stock data processor.
 *
 * Produces the same summary shape regardless of data source:
 * - Kibana/ES: reads pre-computed aggregations from metadata.aggregations
 * - Stock API: computes the same stats client-side from raw hits
 *
 * Output shape:
 * {
 *   transactionSummary: { total, completed, pending, rejected },
 *   commoditySummaries: [{ name, totalReceived, totalIssued, totalReturned, balance }],
 *   dataSyncStats: { totalFacilities, syncedFacilities, syncRate },
 * }
 */

// ---------------------------------------------------------------------------
// From ES aggregations (Kibana source)
// ---------------------------------------------------------------------------

const computeFromAggregations = (aggregations) => {
  const byEventType = aggregations?.by_event_type?.buckets || [];
  const byProduct = aggregations?.by_product?.buckets || [];
  const uniqueFacilities = aggregations?.unique_facilities?.value || 0;

  // Transaction summary
  const total = byEventType.reduce((sum, b) => sum + b.doc_count, 0);
  const completed = byEventType
    .filter((b) => b.key === "RECEIVED" || b.key === "RETURNED")
    .reduce((sum, b) => sum + b.doc_count, 0);
  const pending = byEventType
    .filter((b) => b.key === "DISPATCHED")
    .reduce((sum, b) => sum + b.doc_count, 0);
  const rejected = byEventType
    .filter((b) => b.key === "DAMAGED" || b.key === "LOST")
    .reduce((sum, b) => sum + b.doc_count, 0);

  const transactionSummary = { total, completed, pending, rejected };

  // Commodity summaries
  const commoditySummaries = byProduct.map((bucket) => {
    const eventBuckets = bucket.by_event_type?.buckets || [];
    const getQty = (...keys) =>
      eventBuckets
        .filter((b) => keys.includes(b.key))
        .reduce((sum, b) => sum + (b.total_quantity?.value || 0), 0);

    const totalReceived = getQty("RECEIVED");
    const totalIssued = getQty("DISPATCHED", "ISSUE");
    const totalReturned = getQty("RETURNED", "REJECTED");

    return {
      name: bucket.key,
      totalReceived,
      totalIssued,
      totalReturned,
      balance: totalReceived - totalIssued + totalReturned,
    };
  });

  // Data sync stats
  const dataSyncStats = {
    totalFacilities: uniqueFacilities,
    syncedFacilities: uniqueFacilities,
    syncRate: 0, // overridden by useWarehouseManagerSync with real ES data
  };

  return { transactionSummary, commoditySummaries, dataSyncStats };
};

// ---------------------------------------------------------------------------
// From raw hits (Stock API source)
// ---------------------------------------------------------------------------

const computeFromRawData = (stockData, productNameMap = {}) => {
  if (!stockData?.length) {
    return {
      transactionSummary: { total: 0, completed: 0, pending: 0, rejected: 0 },
      commoditySummaries: [],
      dataSyncStats: { totalFacilities: 0, syncedFacilities: 0, syncRate: 0 },
    };
  }

  // Transaction summary
  const statusMap = {
    RECEIVED: "completed",
    RETURNED: "completed",
    DISPATCHED: "pending",
    DAMAGED: "rejected",
    LOST: "rejected",
  };

  let completed = 0;
  let pending = 0;
  let rejected = 0;

  // Commodity aggregation
  const commodityMap = {};

  // Facility tracking
  const facilitySet = new Set();

  stockData.forEach((stock) => {
    const txType = stock.transactionType;
    const stockEntryType = stock.stockEntryType || stock.additionalDetails?.stockEntryType || "";

    // Use stockEntryType as primary for categorization, fallback to transactionType
    if (stockEntryType === "RECEIPT") completed++;
    else if (stockEntryType === "ISSUED") pending++;
    else if (stockEntryType === "REJECTED") completed++;
    else if (stockEntryType === "RETURNED") completed++;
    else {
      const category = statusMap[txType];
      if (category === "completed") completed++;
      else if (category === "pending") pending++;
      else if (category === "rejected") rejected++;
    }

    // Commodity
    const productName =
      productNameMap[stock?.productVariantId] ||
      stock?.additionalFields?.fields?.find((f) => f.key === "productName")?.value ||
      stock?.productName ||
      "Unknown";

    if (!commodityMap[productName]) {
      commodityMap[productName] = { name: productName, totalReceived: 0, totalIssued: 0, totalReturned: 0 };
    }

    const qty = stock.quantity || 0;
    const entryType = stockEntryType || txType; // fallback
    switch (entryType) {
      case "ISSUED":
      case "DISPATCHED":
      case "ISSUE":
        commodityMap[productName].totalIssued += qty;
        break;
      case "RECEIPT":
      case "RECEIVED":
        commodityMap[productName].totalReceived += qty;
        break;
      case "REJECTED":
      case "RETURNED":
        commodityMap[productName].totalReturned += qty;
        break;
      default:
        break;
    }

    // Facilities
    if (stock.senderId) facilitySet.add(stock.senderId);
    if (stock.receiverId) facilitySet.add(stock.receiverId);
  });

  const transactionSummary = {
    total: stockData.length,
    completed,
    pending,
    rejected,
  };

  const commoditySummaries = Object.values(commodityMap).map((c) => ({
    ...c,
    balance: c.totalReceived - c.totalIssued - c.totalReturned,
  }));

  const totalFacilities = facilitySet.size;
  const dataSyncStats = {
    totalFacilities,
    syncedFacilities: totalFacilities,
    syncRate: 0, // overridden by useWarehouseManagerSync with real ES data
  };

  return { transactionSummary, commoditySummaries, dataSyncStats };
};

// ---------------------------------------------------------------------------
// Main entry point: picks the right strategy based on source
// ---------------------------------------------------------------------------

export const computeStockSummary = ({ source, metadata, data, productNameMap }) => {
  if (source === "kibana" && metadata?.aggregations) {
    return computeFromAggregations(metadata.aggregations);
  }
  return computeFromRawData(data, productNameMap);
};
