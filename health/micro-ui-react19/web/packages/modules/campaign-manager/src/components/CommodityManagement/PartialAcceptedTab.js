import React from "react";
import PendingTransactionsTab from "./PendingTransactionsTab";

// Partial-flow fields come flattened from the chart, or from additionalDetails / additionalFields on stock API records
const getStockField = (stock, key, sourceKey = key) =>
  stock?.[key] ??
  stock?.additionalDetails?.[sourceKey] ??
  stock?.additionalFields?.fields?.find((f) => f?.key === sourceKey)?.value;

const isPresent = (value) => value !== undefined && value !== null && String(value).trim() !== "";

// Returns created by the mobile partial-accept flow that are still awaiting action
const isPartialReturn = (stock) =>
  stock.stockEntryType === "RETURNED" &&
  stock.status === "IN_TRANSIT" &&
  String(getStockField(stock, "partialFlow", "partial_flow")) === "true" &&
  isPresent(getStockField(stock, "discrepancyReason")) &&
  isPresent(getStockField(stock, "originalIssueClientReferenceId"));

// quantity holds Data.physicalCount for chart records; physicalCount is checked first for other sources
const getPhysicalCount = (stock) => Number(getStockField(stock, "physicalCount") ?? stock?.quantity) || 0;

const PartialAcceptedTab = (props) => (
  <PendingTransactionsTab
    {...props}
    header="HCM_PARTIALLY_ACCEPTED"
    noDataMessage="HCM_NO_PARTIALLY_ACCEPTED"
    excelFileName="partially_accepted"
    secondaryAction="partialAccept"
    filterStock={isPartialReturn}
    getQuantity={getPhysicalCount}
  />
);

export default PartialAcceptedTab;
