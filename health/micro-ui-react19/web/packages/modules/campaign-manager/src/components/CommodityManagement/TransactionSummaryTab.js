import React, { useState, useMemo, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Loader, Button, Toast } from "@egovernments/digit-ui-components";
import DataSyncCard from "./DataSyncCard";
import SummaryCard from "./SummaryCard";
import ReusableTableWrapper from "./ReusableTableWrapper";
import UserDetails from "./UserDetails";
import { applyGenericFilters } from "../../utils/genericFilterUtils";
import GenericChart from "./GenericChart";
import { useCommodityProject } from "./CommodityProjectContext";
import getProjectServiceUrl from "../../utils/getProjectServiceUrl";

const normalizeStock = (stock) => stock?._source?.Data || stock?.Data || stock || {};

const getStockPartyIds = (stock) => {
  const normalizedStock = normalizeStock(stock);
  if (normalizedStock.senderId || normalizedStock.receiverId) {
    return {
      senderId: normalizedStock.senderId || "",
      receiverId: normalizedStock.receiverId || "",
    };
  }

  if (normalizedStock.stockEntryType === "RETURNED") {
    return {
      senderId: normalizedStock.facilityId || "",
      receiverId: normalizedStock.transactingFacilityId || "",
    };
  }

  const eventType = normalizedStock.eventType || normalizedStock.transactionType;
  const isInbound = eventType === "RECEIVED";
  return {
    senderId: isInbound ? normalizedStock.transactingFacilityId || "" : normalizedStock.facilityId || "",
    receiverId: isInbound ? normalizedStock.facilityId || "" : normalizedStock.transactingFacilityId || "",
  };
};

const transformStock = (stock, facilityNameMap = {}, productNameMap = {}, stockDetailsById = {}) => {
  const normalizedStock = normalizeStock(stock);
  const detailStock = stockDetailsById[normalizedStock?.id] || {};

  const getFieldValue = (fieldKey) => {
    const fields =
      normalizedStock?.additionalFields?.fields ||
      detailStock?.additionalFields?.fields ||
      [];
    const field = fields.find(
      (f) => f.key === fieldKey,
    );
    return field?.value || "N/A";
  };

  const { senderId, receiverId } = getStockPartyIds(
    Object.keys(detailStock).length ? detailStock : normalizedStock,
  );

  const productVariantId =
    normalizedStock?.productVariantId ||
    normalizedStock?.productVariant ||
    detailStock?.productVariantId ||
    detailStock?.productVariant;
  const productName =
    productNameMap[productVariantId] ||
    normalizedStock?.productName ||
    detailStock?.productName ||
    getFieldValue("productName");
  const quantity = normalizedStock?.quantity || detailStock?.quantity || 0;
  const quantitySent = getFieldValue("quantitySent");
  const quantityReceived = getFieldValue("quantityReceived");
  const comments =
    normalizedStock?.comments ||
    detailStock?.comments ||
    normalizedStock?.reason ||
    detailStock?.reason ||
    normalizedStock?.additionalDetails?.comments ||
    detailStock?.additionalDetails?.comments ||
    normalizedStock?.additionalDetails?.comment ||
    detailStock?.additionalDetails?.comment ||
    normalizedStock?.additionalDetails?.remarks ||
    detailStock?.additionalDetails?.remarks ||
    normalizedStock?.additionalDetails?.remark ||
    detailStock?.additionalDetails?.remark ||
    normalizedStock?.additionalDetails?.note ||
    detailStock?.additionalDetails?.note ||
    getFieldValue("comments") ||
    getFieldValue("comment") ||
    getFieldValue("remarks") ||
    getFieldValue("remark") ||
    getFieldValue("note");

  // Build commodity string
  const commodity =
    productName !== "N/A" ? productName : "N/A";

  // Derive display status from stockEntryType + status
  // Fall back to additionalFields for stock API responses where these are not top-level
  const stockEntryType =
    normalizedStock?.stockEntryType ||
    detailStock?.stockEntryType ||
    normalizedStock?.additionalDetails?.stockEntryType ||
    detailStock?.additionalDetails?.stockEntryType ||
    getFieldValue("stockEntryType");
  const rawStatus =
    normalizedStock?.status ||
    detailStock?.status ||
    normalizedStock?.additionalDetails?.status ||
    detailStock?.additionalDetails?.status ||
    getFieldValue("status");
  let status = "N/A";
  if (stockEntryType === "ISSUED") {
    if (rawStatus === "ACCEPTED") status = "Completed";
    else if (rawStatus === "REJECTED") status = "Rejected";
    else status = "In-Transit"; // IN_TRANSIT or unset
  } else if (stockEntryType === "RETURNED") {
    if (rawStatus === "ACCEPTED") status = "Returned";
    else if (rawStatus === "REJECTED") status = "Return Rejected";
    else status = "Return Initiated"; // IN_TRANSIT or unset
  }

  // Transaction type: RETURNED → "Reverse - Logistics", everything else → "Logistics"
  const txType =
    stockEntryType === "RETURNED" ? "Reverse - Logistics" : "Logistics";

  const trn =
    normalizedStock?.id ||
    detailStock?.id ||
    normalizedStock?.clientReferenceId ||
    detailStock?.clientReferenceId ||
    "N/A";

  // Format creation date
  const createdTime =
    normalizedStock?.auditDetails?.createdTime ||
    detailStock?.auditDetails?.createdTime ||
    normalizedStock?.createdTime ||
    detailStock?.createdTime ||
    normalizedStock?.dateOfEntry ||
    detailStock?.dateOfEntry;
  const creationDate = createdTime
    ? new Date(createdTime).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })
    : "N/A";

  return {
    trn,
    creationDate,
    createdTime,
    sentFrom: facilityNameMap[senderId] || senderId || "N/A",
    sentTo: facilityNameMap[receiverId] || receiverId || "N/A",
    senderId,
    receiverId,
    nameOfUser: normalizedStock?.nameOfUser || detailStock?.nameOfUser || "",
    userName: normalizedStock?.userName || detailStock?.userName || "",
    createdBy:
      normalizedStock?.auditDetails?.createdBy ||
      detailStock?.auditDetails?.createdBy ||
      normalizedStock?.createdBy ||
      detailStock?.createdBy ||
      "N/A",
    status,
    commodity,
    transactionType: txType,
    rawTransactionType:
      normalizedStock?.transactionType ||
      detailStock?.transactionType ||
      normalizedStock?.eventType ||
      detailStock?.eventType ||
      "N/A",
    productName,
    quantity,
    quantitySent: quantitySent !== "N/A" ? parseInt(quantitySent) || 0 : 0,
    quantityReceived:
      quantityReceived !== "N/A" ? parseInt(quantityReceived) || 0 : 0,
    comments: comments && comments !== "N/A" ? comments : "N/A",
  };
};

const TransactionSummaryTab = ({ rawStockData, stockLoading, stockSummary, tenantId, campaignId, projectId, userBoundary, userBoundaries, isTopLevel }) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showToast, setShowToast] = useState(null);
  const fullPageRef = useRef();

  // Get user's staff project from context
  const { projects: contextProjects } = useCommodityProject();
  const userStaffProjectId = useMemo(() => {
    if (!contextProjects?.length) return null;
    const match = contextProjects.find(p => p.address?.boundary === userBoundary?.boundary);
    return match?.id || contextProjects[0]?.id || null;
  }, [contextProjects, userBoundary]);

  // Fetch project facilities using user's staff project
  const projectFacilityCriteria = useMemo(() => ({
    url: `${getProjectServiceUrl()}/facility/v1/_search`,
    params: { tenantId, limit: 100, offset: 0 },
    body: { ProjectFacility: { projectId: [userStaffProjectId] } },
    config: {
      enabled: !!userStaffProjectId && !!tenantId,
      select: (data) => {
        const ids = new Set();
        (data?.ProjectFacilities || []).forEach(pf => {
          if (pf.facilityId) ids.add(pf.facilityId);
        });
        return ids;
      },
    },
  }), [tenantId, userStaffProjectId]);
  const { data: projectFacilityIds = new Set(), isLoading: projectFacilitiesLoading } = Digit.Hooks.useCustomAPIHook(projectFacilityCriteria);

  // Enrich chart rows with stock API details by transaction IDs (comments are often absent in chart response)
  const stockIds = useMemo(() => {
    const ids = new Set();
    (rawStockData || []).forEach((stock) => {
      const normalizedStock = normalizeStock(stock);
      if (normalizedStock?.id) ids.add(normalizedStock.id);
    });
    return [...ids];
  }, [rawStockData]);

  const stockDetailsCriteria = useMemo(
    () => ({
      url: `/stock/v1/_search`,
      params: { tenantId, limit: stockIds.length || 10, offset: 0 },
      body: { Stock: { id: stockIds } },
      config: {
        enabled: !!tenantId && !!stockIds.length,
        select: (data) => {
          const detailMap = {};
          (data?.Stock || []).forEach((s) => {
            if (s?.id) detailMap[s.id] = s;
          });
          return detailMap;
        },
      },
    }),
    [tenantId, stockIds],
  );
  const { data: stockDetailsById = {}, isLoading: stockDetailsLoading } = Digit.Hooks.useCustomAPIHook(stockDetailsCriteria);

  // Extract unique facility IDs and product variant IDs from stock data
  const { facilityIds, productVariantIds } = useMemo(() => {
    const stocks = rawStockData || [];
    const fIds = new Set();
    const pvIds = new Set();
    stocks.forEach(stock => {
      const normalizedStock = normalizeStock(stock);
      const { senderId, receiverId } = getStockPartyIds(normalizedStock);
      if (senderId) fIds.add(senderId);
      if (receiverId) fIds.add(receiverId);
      const productVariantId = normalizedStock?.productVariantId || normalizedStock?.productVariant;
      if (productVariantId) pvIds.add(productVariantId);
    });
    return { facilityIds: [...fIds], productVariantIds: [...pvIds] };
  }, [rawStockData]);

  // Fetch facility details by IDs and build name lookup map
  const facilitySearchCriteria = useMemo(() => ({
    url: `/facility/v1/_search`,
    params: { tenantId, limit: facilityIds.length || 10, offset: 0 },
    body: { Facility: { id: facilityIds } },
    config: {
      enabled: !!facilityIds.length && !!tenantId,
      select: (data) => {
        const nameMap = {};
        const boundaryMap = {};
        (data?.Facilities || []).forEach(f => {
          if (f.id) {
            nameMap[f.id] = f.name || f.id;
            boundaryMap[f.id] = f.address?.locality?.code || "";
          }
        });
        // Disambiguate duplicate facility names by appending short ID suffix
        const nameCount = {};
        Object.values(nameMap).forEach(name => {
          nameCount[name] = (nameCount[name] || 0) + 1;
        });
        Object.entries(nameMap).forEach(([id, name]) => {
          if (nameCount[name] > 1) {
            const shortId = id.split("-").pop();
            nameMap[id] = `${name} (${shortId})`;
          }
        });
        return { nameMap, boundaryMap };
      },
    },
  }), [tenantId, facilityIds]);
  const { data: facilityMaps, isLoading: facilitiesLoading } = Digit.Hooks.useCustomAPIHook(facilitySearchCriteria);
  const facilityNameMap = facilityMaps?.nameMap || {};

  // Fetch product variants
  const variantSearchCriteria = useMemo(() => ({
    url: `/product/variant/v1/_search`,
    params: { tenantId, limit: productVariantIds.length || 10, offset: 0 },
    body: { ProductVariant: { id: productVariantIds } },
    config: {
      enabled: !!productVariantIds.length && !!tenantId,
      select: (data) => data?.ProductVariant || [],
    },
  }), [tenantId, productVariantIds]);
  const { data: productVariants = [], isLoading: variantsLoading } = Digit.Hooks.useCustomAPIHook(variantSearchCriteria);

  // Fetch products by productIds from variants
  const productIds = useMemo(() => {
    return [...new Set(productVariants.map(v => v.productId).filter(Boolean))];
  }, [productVariants]);
  const productSearchCriteria = useMemo(() => ({
    url: `/product/v1/_search`,
    params: { tenantId, limit: productIds.length || 10, offset: 0 },
    body: { Product: { id: productIds } },
    config: {
      enabled: !!productIds.length && !!tenantId,
      select: (data) => data?.Product || [],
    },
  }), [tenantId, productIds]);
  const { data: products = [], isLoading: productsLoading } = Digit.Hooks.useCustomAPIHook(productSearchCriteria);

  // Build product name map: variantId -> "ProductName - Variation"
  const productNameMap = useMemo(() => {
    const map = {};
    productVariants.forEach(variant => {
      const product = products.find(p => p.id === variant.productId);
      const name = product?.name || "";
      const variation = variant?.variation || "";
      map[variant.id] = name && variation ? `${name} - ${variation}` : name || variation || variant.sku || variant.id;
    });
    return map;
  }, [productVariants, products]);

  // Transform stock data with resolved names, sorted by createdTime descending
  // Filter to only show transactions involving the user's project facility
  const tableData = useMemo(() => {
    if (!rawStockData?.length) return [];
    return rawStockData
      .filter(stock => {
        if (projectFacilityIds.size === 0) return false;
        const { senderId, receiverId } = getStockPartyIds(stock);
        return projectFacilityIds.has(senderId) || projectFacilityIds.has(receiverId);
      })
      .map(stock => transformStock(stock, facilityNameMap, productNameMap, stockDetailsById))
      .sort((a, b) => (b.createdTime || 0) - (a.createdTime || 0));
  }, [rawStockData, facilityNameMap, productNameMap, projectFacilityIds, stockDetailsById]);

  // Compute summary stats from the facility-filtered tableData (not the unfiltered stockSummary)
  const filteredSummaryStats = useMemo(() => {
    const stats = { total: 0, completed: 0, pending: 0, rejected: 0, returned: 0 };
    if (!tableData?.length) return stats;
    tableData.forEach((row) => {
      stats.total++;
      if (row.status === "Completed") stats.completed++;
      else if (row.status === "In-Transit" || row.status === "Return Initiated") stats.pending++;
      else if (row.status === "Rejected" || row.status === "Return Rejected") stats.rejected++;
      else if (row.status === "Returned") stats.returned++;
    });
    return stats;
  }, [tableData]);

  const isLoading =
    stockLoading ||
    facilitiesLoading ||
    variantsLoading ||
    productsLoading ||
    projectFacilitiesLoading ||
    stockDetailsLoading;

  const { dataSyncStats: syncStats } = stockSummary || {};
  const dataSyncStats = {
    totalManagers: syncStats?.totalFacilities || 0,
    syncedManagers: syncStats?.syncedFacilities || 0,
    syncRate: syncStats?.syncRate || 0,
  };

  const filteredData = useMemo(() => {
    if (!tableData?.length) return [];
    return applyGenericFilters(tableData, { searchText: searchQuery });
  }, [tableData, searchQuery]);

  // Download table data as Excel
  const handleExcelDownload = useCallback(() => {
    if (!filteredData?.length) return;
    try {
      const XLSX = require("xlsx");
      const exportData = filteredData.map((row) => {
        const exportRow = {};
        columns.forEach((col) => {
          exportRow[col.label] =
            row[col.key] !== undefined && row[col.key] !== null
              ? String(row[col.key])
              : "N/A";
        });
        return exportRow;
      });
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Transactions");
      const timestamp = new Date().toISOString().split("T")[0];
      XLSX.writeFile(wb, `transaction_summary_${timestamp}.xlsx`);
    } catch (error) {
      console.error("Error exporting transactions:", error);
    }
  }, [filteredData]);

  // Share options - DSS pattern
  const shareOptions = navigator.share
    ? [
        { code: "ES_DSS_SHARE_PDF", label: t("ES_DSS_SHARE_PDF") },
        { code: "ES_DSS_SHARE_IMAGE", label: t("ES_DSS_SHARE_IMAGE") },
      ]
    : [
        {
          icon: "EmailIcon",
          code: "ES_DSS_SHARE_PDF_EMAIL",
          label: t("ES_DSS_SHARE_PDF"),
        },
        {
          icon: "WhatsappIcon",
          code: "ES_DSS_SHARE_PDF_WHATSAPP",
          label: t("ES_DSS_SHARE_PDF"),
        },
        {
          icon: "EmailIcon",
          code: "ES_DSS_SHARE_IMAGE_EMAIL",
          label: t("ES_DSS_SHARE_IMAGE"),
        },
        {
          icon: "WhatsappIcon",
          code: "ES_DSS_SHARE_IMAGE_WHATSAPP",
          label: t("ES_DSS_SHARE_IMAGE"),
        },
      ];

  // Download options - DSS pattern (Image, PDF, and Excel)
  const downloadOptions = [
    {
      icon: "ImageIcon",
      code: "ES_DSS_DOWNLOAD_IMAGE",
      label: t("ES_DSS_DOWNLOAD_IMAGE"),
    },
    {
      icon: "PDFSvg",
      code: "ES_DSS_DOWNLOAD_PDF",
      label: t("ES_DSS_DOWNLOAD_PDF"),
    },
    {
      icon: "FileDownload",
      code: "ES_DSS_DOWNLOAD_EXCEL",
      label: t("ES_DSS_DOWNLOAD_EXCEL"),
    },
  ];

  // Handle share/download action selection - DSS pattern
  const onActionSelect = useCallback(
    (item) => {
      const title = t("HCM_TRANSACTION_SUMMARY");
      switch (item?.code) {
        case "ES_DSS_DOWNLOAD_IMAGE":
          setTimeout(() => Digit.Download.Image(fullPageRef, title), 500);
          break;
        case "ES_DSS_DOWNLOAD_PDF":
          setTimeout(
            () => Digit.ShareFiles.PDF(tenantId, fullPageRef, title),
            500,
          );
          break;
        case "ES_DSS_DOWNLOAD_EXCEL":
          handleExcelDownload();
          break;
        case "ES_DSS_SHARE_PDF_EMAIL":
          setTimeout(
            () => Digit.ShareFiles.PDF(tenantId, fullPageRef, title, "mail"),
            500,
          );
          break;
        case "ES_DSS_SHARE_PDF_WHATSAPP":
          setTimeout(
            () =>
              Digit.ShareFiles.PDF(tenantId, fullPageRef, title, "whatsapp"),
            500,
          );
          break;
        case "ES_DSS_SHARE_IMAGE_EMAIL":
          setTimeout(
            () => Digit.ShareFiles.Image(tenantId, fullPageRef, title, "mail"),
            500,
          );
          break;
        case "ES_DSS_SHARE_IMAGE_WHATSAPP":
          setTimeout(
            () =>
              Digit.ShareFiles.Image(tenantId, fullPageRef, title, "whatsapp"),
            500,
          );
          break;
        case "ES_DSS_SHARE_PDF":
          setTimeout(
            () => Digit.ShareFiles.PDF(tenantId, fullPageRef, title),
            500,
          );
          break;
        case "ES_DSS_SHARE_IMAGE":
          setTimeout(
            () => Digit.ShareFiles.Image(tenantId, fullPageRef, title),
            500,
          );
          break;
      }
    },
    [tenantId, t, handleExcelDownload],
  );

  const columns = [
  { label: t("HCM_TRN"), key: "trn", grow: 1, minWidth: "120px", sortable: false },
  { label: t("HCM_CREATION_DATE"), key: "creationDate", sortKey: "createdTime", sortType: "numeric", grow: 1.5, minWidth: "200px", sortable: true },
  { label: t("HCM_SENT_FROM"), key: "sentFrom", grow: 1, minWidth: "160px", sortable: false },
  { label: t("HCM_SENT_TO"), key: "sentTo", grow: 1, minWidth: "160px", sortable: false },
  { label: t("HCM_CREATED_BY"), key: "createdBy", grow: 1, sortable: false },
  { label: t("HCM_STATUS"), key: "status", grow: 0.8, minWidth: "120px", sortable: false },
  { label: t("HCM_COMMODITY"), key: "commodity", grow: 0.8, sortable: false },
  { label: t("HCM_QUANTITY"), key: "quantity", sortType: "numeric", grow: 0.6, minWidth: "100px", sortable: true },
  { label: t("HCM_TRANSACTION_TYPE"), key: "transactionType", grow: 1, sortable: false },
  { label: t("HCM_COMMENTS"), key: "comments", grow: 1.2, minWidth: "180px", sortable: false },
];

  // Helper to map status to CSS class
  const getStatusClass = (status) => {
    const classMap = {
      Completed: "cm-status-badge--completed",
      "In-Transit": "cm-status-badge--in-transit",
      Rejected: "cm-status-badge--rejected",
      Returned: "cm-status-badge--completed",
      "Return Initiated": "cm-status-badge--in-transit",
      "Return Rejected": "cm-status-badge--rejected",
    };
    return classMap[status] || "cm-status-badge--default";
  };

  const customCellRenderer = {
    status: (row) => (
      <span className={`cm-status-badge ${getStatusClass(row.status)}`}>
        {row.status}
      </span>
    ),
    sentFrom: (row) => (
      <div>
        <div className="cm-cell-link">{row.sentFrom}</div>
        <div style={{ fontSize: "0.75rem", color: "#505A5F" }}>{row.senderId}</div>
      </div>
    ),
    sentTo: (row) => (
      <div>
        <div className="cm-cell-link">{row.sentTo}</div>
        <div style={{ fontSize: "0.75rem", color: "#505A5F" }}>{row.receiverId}</div>
      </div>
    ),
    createdBy: (row) => {
      const maskName = (name) => {
        if (!name) return "";
        if (name.length >= 4) return "****" + name.slice(-4);
        if (name.length >= 2) return "**" + name.slice(-2);
        return name;
      };

      const displayName = row?.nameOfUser || "";
      const loginName = row?.userName || "";

      if (displayName || loginName) {
        return (
          <div>
            <div>{displayName || maskName(loginName)}</div>
            {displayName && loginName && (
              <div style={{ fontSize: "0.75rem", color: "#505A5F" }}>{maskName(loginName)}</div>
            )}
          </div>
        );
      }

      const userId = row?.createdBy;
      if (userId && userId !== "N/A") {
        return (
          <UserDetails
            uuid={userId}
            style={{ fontSize: "inherit" }}
            iconSize="14px"
            tooltipPosition="top"
            showIcon={false}
          />
        );
      }

      return "N/A";
    },
    transactionType: (row) => (
      <span
        className={`cm-tx-type-badge ${
          row.transactionType === "Reverse - Logistics"
            ? "cm-tx-type-badge--reverse"
            : "cm-tx-type-badge--logistics"
        }`}
      >
        {row.transactionType}
      </span>
    ),
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  if (isLoading) {
    return <Loader page={true} variant={"PageLoader"} />;
  }

  return (
    <div ref={fullPageRef}>
      {/* Data Sync Card */}
      <DataSyncCard
        items={[
          {
            label: "HCM_TOTAL_WAREHOUSE_MANAGERS",
            value: dataSyncStats.totalManagers.toLocaleString(),
          },
          {
            label: "HCM_TOTAL_WH_MANAGERS_SYNCED",
            value: dataSyncStats.syncedManagers.toLocaleString(),
          },
          { label: "HCM_SYNC_RATE", value: `${dataSyncStats.syncRate}%` },
        ]}
      />

      {/* Transaction Summary Card */}
      <SummaryCard
        title="HCM_TRANSACTION_SUMMARY"
        items={[
          { label: "HCM_TOTAL_TRANSACTIONS", value: filteredSummaryStats.total },
          { label: "HCM_TOTAL_COMPLETED", value: filteredSummaryStats.completed },
          { label: "HCM_TOTAL_PENDING", value: filteredSummaryStats.pending },
          { label: "HCM_TOTAL_REJECTED", value: filteredSummaryStats.rejected },
          { label: "HCM_TOTAL_RETURNED", value: filteredSummaryStats.returned },
        ]}
      />

      {/* Transaction List */}
      {/* <div className="cm-table-card">
        <div className="cm-table-header">
          <h3 className="cm-table-title">{t("HCM_TRANSACTION_LIST")}</h3>
          <input
            type="text"
            className="cm-search-input"
            placeholder={t("ES_COMMON_SEARCH")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <ReusableTableWrapper
          data={filteredData}
          columns={columns}
          isLoading={false}
          noDataMessage="HCM_NO_TRANSACTIONS_FOUND"
          pagination={true}
          manualPagination={true}
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 20, 50, 100]}
          customCellRenderer={customCellRenderer}
          enableExcelDownload={false}
          excelFileName="transaction_summary"
          className=""
          headerClassName=""
        />
        <div className="cm-table-footer">
          <Button
            type="actionButton"
            variation="teritiary"
            label={t("ES_DSS_SHARE")}
            options={shareOptions}
            optionsKey="label"
            showBottom={true}
            size={"medium"}
            className={"digit-dss-options-header-option-button"}
            isSearchable={false}
            wrapperClassName={"digit-dss-options-header-options-button-wrapper"}
            onOptionSelect={onActionSelect}
            icon={"Share"}
            iconFill={"#505a5f"}
          />
          <Button
            type="actionButton"
            variation="teritiary"
            label={t("ES_DSS_DOWNLOAD")}
            options={downloadOptions}
            optionsKey="label"
            showBottom={true}
            size={"medium"}
            className={"digit-dss-options-header-option-button"}
            isSearchable={false}
            wrapperClassName={"digit-dss-options-header-options-button-wrapper"}
            onOptionSelect={onActionSelect}
            icon={"FileDownload"}
            iconFill={"#505a5f"}
          />
        </div>
      </div> */}

      <GenericChart
        header={t("HCM_TRANSACTION_LIST")}
        showSearch={true}
        className={"digit-stock-transactions-summary-tab"}
        subHeader={""}
        onChange={handleSearch}
      >
        <ReusableTableWrapper
          data={filteredData}
          columns={columns}
          isLoading={false}
          noDataMessage="HCM_NO_TRANSACTIONS_FOUND"
          pagination={true}
          manualPagination={true}
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 20, 50, 100]}
          customCellRenderer={customCellRenderer}
          enableExcelDownload={false}
          excelFileName="transaction_summary"
          className=""
          headerClassName=""
          defaultSortField="creationDate"
          defaultSortAsc={false}
        />
      </GenericChart>

      {showToast && (
        <Toast
          label={showToast?.label}
          type={showToast?.key === "error" ? "error" : "success"}
          isDleteBtn={true}
          onClose={() => setShowToast(null)}
          transitionTime={5000}
        />
      )}
    </div>
  );
};

export default TransactionSummaryTab;
