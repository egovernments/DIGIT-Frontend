/**
 * Unified stock data processor.
 *
 * Produces the same summary shape regardless of data source:
 * - Kibana/ES: reads pre-computed aggregations from metadata.aggregations
 * - Stock API: computes the same stats client-side from raw hits
 *
 * Output shape:
 * {
 *   transactionSummary: { total, completed, pending, rejected, returned },
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

  const transactionSummary = { total, completed, pending, rejected, returned: 0 };

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
      transactionSummary: { total: 0, completed: 0, pending: 0, rejected: 0, returned: 0 },
      commoditySummaries: [],
      dataSyncStats: { totalFacilities: 0, syncedFacilities: 0, syncRate: 0 },
    };
  }

  let completed = 0;
  let pending = 0;
  let rejected = 0;
  let returned = 0;

  // Commodity aggregation
  const commodityMap = {};

  // Facility tracking
  const facilitySet = new Set();

  stockData.forEach((stock) => {
    const stockEntryType = stock.stockEntryType || "";
    const status = stock.status || "";

    // Transaction summary categorization (status-based, no pair-matching)
    if (stockEntryType === "ISSUED") {
      if (status === "ACCEPTED") {
        completed++;
      } else if (status === "REJECTED") {
        rejected++;
      } else {
        // IN_TRANSIT or unset
        pending++;
      }
    } else if (stockEntryType === "RETURNED") {
      if (status === "ACCEPTED") {
        returned++;
      } else if (status === "REJECTED") {
        // Return rejected by receiver, counted as rejected
        rejected++;
      } else {
        // IN_TRANSIT or unset — Return Initiated, counted as pending
        pending++;
      }
    }
    // RECEIPT, EXCESS, LESS: not counted in transaction summary (auxiliary records)

    // Commodity
    const productName =
      productNameMap[stock?.productVariantId] ||
      stock?.additionalFields?.fields?.find((f) => f.key === "productName")?.value ||
      stock?.productName ||
      "Unknown";

    if (!commodityMap[productName]) {
      commodityMap[productName] = { name: productName, totalReceived: 0, totalIssued: 0, totalReturned: 0, totalRejected: 0 };
    }

    const qty = stock.quantity || 0;
    if (stockEntryType === "RECEIPT") {
      commodityMap[productName].totalReceived += qty;
    } else if (stockEntryType === "EXCESS") {
      commodityMap[productName].totalReceived += qty;
    } else if (stockEntryType === "LESS") {
      commodityMap[productName].totalReceived -= qty;
    } else if (stockEntryType === "ISSUED") {
      if (status === "ACCEPTED") {
        commodityMap[productName].totalIssued += qty;
      } else if (status === "REJECTED") {
        commodityMap[productName].totalRejected += qty;
      }
      // IN_TRANSIT: not counted in commodity summary
    } else if (stockEntryType === "RETURNED") {
      if (status === "ACCEPTED") {
        commodityMap[productName].totalReturned += qty;
      }
      // IN_TRANSIT: return not confirmed yet, don't count in commodity
      // REJECTED: return rejected, stock stays with returner, no commodity impact
    }

    // Facilities
    if (stock.senderId) facilitySet.add(stock.senderId);
    if (stock.receiverId) facilitySet.add(stock.receiverId);
  });

  const transactionSummary = {
    total: completed + pending + rejected + returned,
    completed,
    pending,
    rejected,
    returned,
  };

  const commoditySummaries = Object.values(commodityMap).map((c) => ({
    ...c,
    balance: c.totalReceived - Math.max(0, c.totalIssued - c.totalReturned - c.totalRejected),
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
