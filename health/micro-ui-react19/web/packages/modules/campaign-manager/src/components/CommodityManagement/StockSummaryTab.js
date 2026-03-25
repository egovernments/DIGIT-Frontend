import React, { useState, useMemo, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Loader, Button, Toast } from "@egovernments/digit-ui-components";
import DataSyncCard from "./DataSyncCard";
import SummaryCard from "./SummaryCard";
import ReusableTableWrapper from "./ReusableTableWrapper";
import { applyGenericFilters } from "../../utils/genericFilterUtils";
import GenericChart from "./GenericChart";
import CommodityShipmentPopup from "./CommodityShipmentPopup";

const StockSummaryTab = ({ rawStockData, stockLoading, stockSummary, tenantId, campaignId, campaignNumber, projectId, refetchStockData, isCompleted, userBoundary, userBoundaries, isTopLevel }) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [shipmentFacility, setShipmentFacility] = useState(null); // { id, name } for CommodityShipmentPopup
  const [showToast, setShowToast] = useState(null);
  const fullPageRef = useRef();

  const finalStockData = rawStockData?.length ? rawStockData : undefined;

  // Extract unique facility IDs and product variant IDs from stock data
  const { facilityIds, productVariantIds } = useMemo(() => {
    const stocks = finalStockData || [];
    const fIds = new Set();
    const pvIds = new Set();
    stocks.forEach(stock => {
      if (stock.senderId) fIds.add(stock.senderId);
      if (stock.receiverId) fIds.add(stock.receiverId);
      if (stock.productVariantId) pvIds.add(stock.productVariantId);
    });
    return { facilityIds: [...fIds], productVariantIds: [...pvIds] };
  }, [finalStockData]);

  // Fetch facility details by IDs (name + boundary from address.locality.code)
  const facilitySearchCriteria = useMemo(() => ({
    url: `/facility/v1/_search`,
    params: { tenantId, limit: facilityIds.length || 10, offset: 0 },
    body: { Facility: { id: facilityIds } },
    config: {
      enabled: !!facilityIds.length && !!tenantId,
      select: (data) => {
        const nameMap = {};
        const boundaryMap = {};
        const boundaryTypeMap = {};
        (data?.Facilities || []).forEach(f => {
          if (f.id) {
            nameMap[f.id] = f.name || f.id;
            boundaryMap[f.id] = f.address?.locality?.code || "";
            boundaryTypeMap[f.id] = f.address?.locality?.type || f.address?.boundaryType || "";
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
        return { nameMap, boundaryMap, boundaryTypeMap };
      },
    },
  }), [tenantId, facilityIds]);
  const { data: facilityMaps, isLoading: facilitiesLoading } = Digit.Hooks.useCustomAPIHook(facilitySearchCriteria);
  const facilityNameMap = facilityMaps?.nameMap || {};
  const facilityBoundaryMap = facilityMaps?.boundaryMap || {};
  const facilityBoundaryTypeMap = facilityMaps?.boundaryTypeMap || {};

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

  // Determine user's facility IDs from boundary matching (match against ALL descendant boundaries)
  const userFacilityIds = useMemo(() => {
    if ((!userBoundaries?.size && !userBoundary?.boundary) || !Object.keys(facilityBoundaryMap).length) return new Set();
    const ids = new Set();
    Object.entries(facilityBoundaryMap).forEach(([fId, bCode]) => {
      if (userBoundaries?.size > 0 ? userBoundaries.has(bCode) : bCode === userBoundary?.boundary) {
        ids.add(fId);
      }
    });
    return ids;
  }, [userBoundary, userBoundaries, facilityBoundaryMap]);

  // Compute per-facility commodity summaries for SummaryCards (non-top-level users)
  const facilityCommoditySummaries = useMemo(() => {
    if (isTopLevel || !finalStockData?.length || !userFacilityIds.size) return [];
    const commodityMap = {};
    finalStockData.forEach((stock) => {
      const stockEntryType = stock.stockEntryType || "";
      const qty = stock.quantity || 0;
      const productName =
        productNameMap[stock?.productVariantId] ||
        stock?.additionalFields?.fields?.find((f) => f.key === "productName")?.value ||
        "Unknown";
      if (!commodityMap[productName]) {
        commodityMap[productName] = { name: productName, totalReceived: 0, totalIssued: 0, totalReturned: 0 };
      }
      if (stockEntryType === "RECEIPT" && userFacilityIds.has(stock.receiverId)) {
        commodityMap[productName].totalReceived += qty;
      } else if (stockEntryType === "ISSUED" && userFacilityIds.has(stock.senderId)) {
        commodityMap[productName].totalIssued += qty;
      } else if ((stockEntryType === "RETURNED" || stockEntryType === "REJECTED") && userFacilityIds.has(stock.senderId)) {
        commodityMap[productName].totalReturned += qty;
      }
    });
    return Object.values(commodityMap).map((c) => ({
      ...c,
      balance: c.totalReceived - c.totalIssued - c.totalReturned,
    }));
  }, [finalStockData, userFacilityIds, isTopLevel, productNameMap]);

  // Use per-facility summaries when available, otherwise fall back to global
  const { commoditySummaries: globalCommoditySummaries = [], dataSyncStats: syncStats } = stockSummary || {};
  const commoditySummaries = facilityCommoditySummaries.length > 0 ? facilityCommoditySummaries : globalCommoditySummaries;
  const dataSyncStats = {
    total: syncStats?.totalFacilities || 0,
    synced: syncStats?.syncedFacilities || 0,
    syncRate: syncStats?.syncRate || 0,
  };

  // Helper: build boundary display string with type in brackets
  const getBoundaryDisplay = useCallback((facilityId) => {
    const boundaryCode = facilityBoundaryMap[facilityId];
    if (!boundaryCode) return "N/A";
    let boundaryType = facilityBoundaryTypeMap[facilityId];
    // Fallback: if this facility's boundary matches userBoundary, use its type
    if (!boundaryType && boundaryCode === userBoundary?.boundary) {
      boundaryType = userBoundary.boundaryType;
    }
    return boundaryType
      ? `${t(boundaryCode)} (${t(boundaryType)})`
      : t(boundaryCode);
  }, [facilityBoundaryMap, facilityBoundaryTypeMap, userBoundary, t]);

  // Per-transaction rows filtered to user's facility
  const warehouseData = useMemo(() => {
    if (!finalStockData?.length) return [];

    // Find the first user facility ID for the action button
    const userFacId = userFacilityIds.size > 0 ? [...userFacilityIds][0] : null;

    const rows = [];
    finalStockData.forEach((stock) => {
      const senderId = stock.senderId;
      const receiverId = stock.receiverId;

      // Filter: only show transactions involving user's facility
      // If no user facility found (top-level or loading), show all
      if (userFacilityIds.size > 0 && !userFacilityIds.has(senderId) && !userFacilityIds.has(receiverId)) {
        return;
      }

      const productName =
        productNameMap[stock?.productVariantId] ||
        stock?.additionalFields?.fields?.find((f) => f.key === "productName")
          ?.value || "Unknown";
      const qty = stock.quantity || 0;
      const stockEntryType = stock.stockEntryType || "";

      // Compute effective quantity from user's facility perspective:
      // ISSUED where user is receiver = 0 (in transit, not yet received)
      // RECEIPT where user is receiver = qty (confirmed received)
      // Otherwise show raw qty
      let effectiveQty = qty;
      if (userFacilityIds.size > 0) {
        if (stockEntryType === "ISSUED" && userFacilityIds.has(receiverId) && !userFacilityIds.has(senderId)) {
          effectiveQty = 0;
        }
      }

      rows.push({
        warehouseName: facilityNameMap[senderId] || senderId || "N/A",
        toFacility: facilityNameMap[receiverId] || receiverId || "N/A",
        type:
          stock.senderType === "WAREHOUSE" || stock.receiverType === "WAREHOUSE"
            ? "Warehouse"
            : "Facility",
        boundary: getBoundaryDisplay(senderId),
        commodity: productName,
        quantity: Math.max(0, effectiveQty),
        facilityId: userFacId || senderId,
        productVariantId: stock.productVariantId,
      });
    });

    return rows;
  }, [finalStockData, facilityNameMap, productNameMap, userFacilityIds, getBoundaryDisplay]);

  // Compute per-facility stock map: { facilityId: { productVariantId: currentStock } }
  const facilityStockMap = useMemo(() => {
    if (!finalStockData?.length) return {};
    const map = {};
    const init = (fId, pvId) => {
      if (!map[fId]) map[fId] = {};
      if (!map[fId][pvId]) map[fId][pvId] = 0;
    };
    finalStockData.forEach((stock) => {
      const stockEntryType = stock.stockEntryType || "";
      const pvId = stock.productVariantId;
      const qty = stock.quantity || 0;
      if (!pvId) return;

      if (stockEntryType === "ISSUED") {
        // Sender loses stock (in transit, not yet received by receiver)
        if (stock.senderId) { init(stock.senderId, pvId); map[stock.senderId][pvId] -= qty; }
      } else if (stockEntryType === "RECEIPT") {
        // Receiver confirms receipt → gains stock
        if (stock.receiverId) { init(stock.receiverId, pvId); map[stock.receiverId][pvId] += qty; }
      } else if (stockEntryType === "RETURNED" || stockEntryType === "REJECTED") {
        // Dual-attribution: Returner loses, Original sender gains
        if (stock.senderId) { init(stock.senderId, pvId); map[stock.senderId][pvId] -= qty; }
        if (stock.receiverId) { init(stock.receiverId, pvId); map[stock.receiverId][pvId] += qty; }
      } else {
        // Fallback to existing transactionType logic
        const facilityId = stock.transactionType === "RECEIVED" ? stock.receiverId : stock.senderId;
        if (!facilityId) return;
        init(facilityId, pvId);
        if (stock.transactionType === "RECEIVED" || stock.transactionType === "RETURNED") {
          map[facilityId][pvId] += qty;
        } else if (stock.transactionType === "DISPATCHED" || stock.transactionType === "ISSUE") {
          map[facilityId][pvId] -= qty;
        }
      }
    });
    return map;
  }, [finalStockData]);

  // Build product variant list for the commodity dropdown
  const productVariantList = useMemo(() => {
    return productVariants.map((v) => ({
      productVariantId: v.id,
      name: productNameMap[v.id] || v.sku || v.id,
    }));
  }, [productVariants, productNameMap]);

  const filteredData = useMemo(() => {
    if (!warehouseData?.length) return [];
    return applyGenericFilters(warehouseData, { searchText: searchQuery });
  }, [warehouseData, searchQuery]);

  const columns = [
    {
      label: t("HCM_FROM_FACILITY"),
      key: "warehouseName",
      grow: 1.5,
      minWidth: "180px",
      sortable: true,
    },
    {
      label: t("HCM_TO_FACILITY"),
      key: "toFacility",
      grow: 1.5,
      minWidth: "180px",
      sortable: true,
    },
    {
      label: t("HCM_TYPE"),
      key: "type",
      grow: 0.7,
      minWidth: "110px",
      sortable: true,
    },
    {
      label: t("HCM_BOUNDARY"),
      key: "boundary",
      grow: 1.5,
      minWidth: "200px",
      sortable: true,
    },
    {
      label: t("HCM_COMMODITY"),
      key: "commodity",
      grow: 1,
      minWidth: "140px",
      sortable: true,
    },
    {
      label: t("HCM_QUANTITY"),
      key: "quantity",
      grow: 0.8,
      minWidth: "130px",
      sortable: true,
    },
    ...(!isCompleted ? [{
      label: t("HCM_ACTION"),
      key: "action",
      grow: 1,
      minWidth: "200px",
      sortable: false,
    }] : []),
  ];

  // Download table data as Excel
  const handleExcelDownload = useCallback(() => {
    if (!filteredData?.length) return;
    try {
      const XLSX = require("xlsx");
      const exportColumns = columns.filter((col) => col.key !== "action");
      const exportData = filteredData.map((row) => {
        const exportRow = {};
        exportColumns.forEach((col) => {
          exportRow[col.label] =
            row[col.key] !== undefined && row[col.key] !== null
              ? String(row[col.key])
              : "N/A";
        });
        return exportRow;
      });
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Stock Summary");
      const timestamp = new Date().toISOString().split("T")[0];
      XLSX.writeFile(wb, `stock_summary_${timestamp}.xlsx`);
    } catch (error) {
      console.error("Error exporting stock summary:", error);
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
      const title = t("HCM_STOCK_SUMMARY");
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

  const customCellRenderer = {
    quantity: (row) => (
      <span className="cm-cell-stock">
        {row.quantity?.toLocaleString()}
      </span>
    ),
    action: (row) => (
      <Button
        onClick={() =>
          setShipmentFacility({ id: row.facilityId, name: row.warehouseName, productVariantId: row.productVariantId })
        }
        title={t("HCM_SHIP_COMMODITY")}
        icon={"Add"}
        label={t("HCM_SHIP_COMMODITY")}
        variation={"secondary"}
      />
    ),
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  const allLoading = stockLoading || facilitiesLoading || variantsLoading || productsLoading;

  if (allLoading) {
    return <Loader page={true} variant={"PageLoader"} />;
  }

  return (
    <div ref={fullPageRef}>
      <DataSyncCard
        items={[
          {
            label: "HCM_TOTAL_WAREHOUSES",
            value: dataSyncStats.total.toLocaleString(),
          },
          {
            label: "HCM_TOTAL_WH_MANAGERS_SYNCED",
            value: dataSyncStats.synced.toLocaleString(),
          },
          { label: "HCM_SYNC_RATE", value: `${dataSyncStats.syncRate}%` },
        ]}
      />

      {!isTopLevel && commoditySummaries.map((commodity, index) => (
        <SummaryCard
          key={index}
          title="HCM_STOCK_SUMMARY"
          subtitle={commodity.name}
          items={[
            { label: "HCM_TOTAL_RECEIVED", value: commodity.totalReceived },
            { label: "HCM_TOTAL_ISSUED", value: commodity.totalIssued },
            { label: "HCM_TOTAL_RETURNED", value: commodity.totalReturned },
            { label: "HCM_BALANCE", value: commodity.balance },
          ]}
        />
      ))}

      {/* <div className="cm-table-card">
        <div className="cm-table-header">
          <div className="cm-table-title">{t("HCM_TRANSACTION_LIST")}</div>
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
          noDataMessage="HCM_NO_STOCK_DATA_FOUND"
          pagination={true}
          manualPagination={true}
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 20, 50, 100]}
          customCellRenderer={customCellRenderer}
          enableExcelDownload={false}
          excelFileName="stock_summary"
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
          noDataMessage="HCM_NO_STOCK_DATA_FOUND"
          pagination={true}
          manualPagination={true}
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 20, 50, 100]}
          customCellRenderer={customCellRenderer}
          enableExcelDownload={false}
          excelFileName="stock_summary"
          className=""
          headerClassName=""
        />
      </GenericChart>

      {shipmentFacility && (
        <CommodityShipmentPopup
          tenantId={tenantId}
          campaignId={campaignId}
          campaignNumber={campaignNumber}
          fromFacility={shipmentFacility}
          selectedCommodity={shipmentFacility.productVariantId}
          productVariants={productVariantList}
          warehouseStock={facilityStockMap[shipmentFacility.id] || {}}
          onClose={() => setShipmentFacility(null)}
          onSuccess={() => {
            setShipmentFacility(null);
            setShowToast({ key: "success", label: t("HCM_SHIPMENT_CREATED_SUCCESS") });
            if (refetchStockData) {
              setTimeout(() => refetchStockData(), 2000);
            }
          }}
        />
      )}

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

export default StockSummaryTab;
