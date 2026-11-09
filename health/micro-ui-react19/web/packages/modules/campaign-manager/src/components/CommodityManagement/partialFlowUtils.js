// Partial-flow fields come flattened from the chart (camelCase or snake_case),
// or from additionalDetails / additionalFields on stock API records
export const getStockField = (stock, key, sourceKey = key) =>
  stock?.[key] ??
  stock?.[sourceKey] ??
  stock?.additionalDetails?.[key] ??
  stock?.additionalDetails?.[sourceKey] ??
  stock?.additionalFields?.fields?.find((f) => f?.key === key || f?.key === sourceKey)?.value;

// True for any record created by the mobile partial-accept flow
export const isPartialFlow = (stock) => String(getStockField(stock, "partialFlow", "partial_flow")).toLowerCase() === "true";
