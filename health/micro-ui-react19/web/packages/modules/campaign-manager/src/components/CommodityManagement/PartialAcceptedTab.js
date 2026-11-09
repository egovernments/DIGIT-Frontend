import React from "react";
import PendingTransactionsTab from "./PendingTransactionsTab";
import { getStockField, isPartialFlow } from "./partialFlowUtils";

const isPresent = (value) => value !== undefined && value !== null && String(value).trim() !== "";

// Returns created by the mobile partial-accept flow that are still awaiting action
const isPartialReturn = (stock) =>
  stock.stockEntryType === "RETURNED" &&
  stock.status === "IN_TRANSIT" &&
  isPartialFlow(stock) &&
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
