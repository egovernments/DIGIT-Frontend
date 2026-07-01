import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Toggle, HeaderComponent, LabelFieldPair, Loader, Button, Card, Toast } from "@egovernments/digit-ui-components";
import TransactionSummaryTab from "./TransactionSummaryTab";
import StockSummaryTab from "./StockSummaryTab";
import PendingTransactionsTab from "./PendingTransactionsTab";
import DateRangePicker from "./DateRangePicker";
import { useLocation } from "react-router-dom";
import useStockData from "../../hooks/useStockData";
import { computeStockSummary } from "../../utils/stockDataProcessor";
import { I18N_KEYS } from "../../utils/i18nKeyConstants";
import useWarehouseManagerSync from "../../hooks/useWarehouseManagerSync";
import { useCommodityProject } from "./CommodityProjectContext";
import NewShipmentPopup from "./NewShipmentPopup";
import useBatchStockCreation from "../../hooks/useBatchStockCreation";

const SHEET_SESSION_KEY = "HCM_BATCH_SHEET_DATA";

/**
 * Persist sheet data + clientRefToRowIndex to sessionStorage
 * so the result sheet can be regenerated after page refresh.
 */
const saveSheetToSession = (sheetData, clientRefToRowIndex) => {
  try {
    sessionStorage.setItem(SHEET_SESSION_KEY, JSON.stringify({ sheetData, clientRefToRowIndex }));
  } catch (e) {
    // ignore
  }
};

const loadSheetFromSession = () => {
  try {
    const raw = sessionStorage.getItem(SHEET_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

const clearSheetSession = () => {
  try {
    sessionStorage.removeItem(SHEET_SESSION_KEY);
  } catch (e) {
    // ignore
  }
};

/**
 * Helper to resolve a statusKey + statusParams from the batch hook
 * into a human-readable translated string.
 */
const resolveStatusText = (t, statusKey, statusParams = {}) => {
  const { current, total, attempt, maxAttempts, failedCount } = statusParams;
  switch (statusKey) {
    case "HCM_BATCH_STARTING":
      return t(I18N_KEYS.COMMODITY_MANAGEMENT.HCM_BATCH_STARTING);
    case "HCM_BATCH_CREATING":
      return t(I18N_KEYS.COMMODITY_MANAGEMENT.HCM_BATCH_CREATING, { current, total });
    case "HCM_BATCH_VERIFYING":
      return t(I18N_KEYS.COMMODITY_MANAGEMENT.HCM_BATCH_VERIFYING, { current, total, attempt, maxAttempts });
    case "HCM_BATCH_ALL_SUCCESS":
      return t(I18N_KEYS.COMMODITY_MANAGEMENT.HCM_BATCH_ALL_SUCCESS);
    case "HCM_BATCH_PROCESSING_COMPLETE":
      return t(I18N_KEYS.COMMODITY_MANAGEMENT.HCM_BATCH_PROCESSING_COMPLETE, { failedCount });
    default:
      return statusKey ? t(statusKey) : "";
  }
};

const CommodityDashboard = () => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const tenantName = tenantId?.split(".")?.[1] || tenantId;
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const campaignNumber = searchParams.get("campaignNumber");
  const projectIdFromUrl = searchParams.get("projectId");

  // Backward compat: still check URL for campaignId first
  const campaignIdFromUrl = searchParams.get("campaignId");

  // Read campaign data from navigation state (passed from HCMCommodityRowCard)
  const { projectId: projectIdFromState, campaignStartDate: campaignStartEpoch, campaignEndDate: campaignEndEpoch, projectCreatedTime, isCompleted } = location.state || {};

  // Read userBoundary, userBoundaries, and isTopLevel from context
  const { userBoundary, userBoundaries, isTopLevel, projects: contextProjects } = useCommodityProject();

  // Resolve projectId: URL param > navigation state > sessionStorage > context fallback
  // Key is scoped per campaign so switching campaigns never reuses a stale projectId
  const sessionProjectKey = campaignNumber ? `HCM_COMMODITY_SELECTED_PROJECT_ID_${campaignNumber}` : null;
  const projectId = useMemo(() => {
    const fromSession = sessionProjectKey ? sessionStorage.getItem(sessionProjectKey) : null;
    const resolved = projectIdFromUrl || projectIdFromState || fromSession || contextProjects?.find((p) => p.referenceId === campaignNumber)?.id;
    if (resolved && sessionProjectKey) {
      sessionStorage.setItem(sessionProjectKey, resolved);
    }
    return resolved;
  }, [projectIdFromUrl, projectIdFromState, contextProjects, campaignNumber, sessionProjectKey]);

  // Fetch campaign details (for campaignId fallback + auditDetails.createdTime)
  const campaignReqCriteria = useMemo(() => ({
    url: `/project-factory/v1/project-type/search`,
    body: {
      CampaignDetails: {
        tenantId,
        campaignNumber,
      },
    },
    config: {
      enabled: !!campaignNumber,
      select: (data) => {
        const campaign = data?.CampaignDetails?.[0];
        return {
          id: campaign?.id,
          createdTime: campaign?.auditDetails?.createdTime,
        };
      },
    },
  }), [tenantId, campaignNumber]);

  const { data: campaignSearchData, isLoading: campaignIdLoading } = Digit.Hooks.useCustomAPIHook(campaignReqCriteria);

  const campaignId = campaignIdFromUrl || campaignSearchData?.id;
  const campaignCreatedDate = useMemo(
    () => {
      if (projectCreatedTime) return new Date(projectCreatedTime);
      if (campaignSearchData?.createdTime) return new Date(campaignSearchData.createdTime);
      return null;
    },
    [projectCreatedTime, campaignSearchData?.createdTime]
  );
  const campaignEndDate = useMemo(
    () => (campaignEndEpoch ? new Date(campaignEndEpoch) : null),
    [campaignEndEpoch]
  );

  const useKibanaFlag = true;

  const [activeTab, setActiveTab] = useState("transaction");
  const [showNewShipmentPopup, setShowNewShipmentPopup] = useState(false);
  const [showToast, setShowToast] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: new Date(),
    preset: "cumulative",
  });

  // --- Batch stock creation (lives here so it persists after popup closes) ---
  const {
    processBatches,
    batchStatus,
    isProcessing,
    failedRecords: batchFailedRecords,
    isComplete,
    result: batchResult,
    reset: resetBatchState,
    abort: abortBatchProcessing,
    isRecovered,
  } = useBatchStockCreation({ tenantId });

  // Store original sheet data and clientRef mapping for result sheet generation
  const originalSheetDataRef = useRef(null);
  const clientRefToRowIndexRef = useRef({});

  // On mount, restore sheet data from sessionStorage if we have recovered batch data
  useEffect(() => {
    if (isRecovered) {
      const saved = loadSheetFromSession();
      if (saved) {
        originalSheetDataRef.current = saved.sheetData;
        clientRefToRowIndexRef.current = saved.clientRefToRowIndex;
      }
    }
  }, [isRecovered]);

  // --- beforeunload warning: prevent accidental refresh/tab close during processing ---
  useEffect(() => {
    if (!isProcessing) return;
    const handler = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isProcessing]);

  // --- Back/forward navigation warning during processing ---
  // Uses popstate since this app uses legacy BrowserRouter (useBlocker requires data router)
  useEffect(() => {
    if (!isProcessing) return;

    // Push a duplicate entry so pressing back triggers popstate instead of leaving
    window.history.pushState(null, "", window.location.href);

    const handler = () => {
      const confirmed = window.confirm(t(I18N_KEYS.COMMODITY_MANAGEMENT.HCM_BATCH_LEAVE_WARNING));
      if (!confirmed) {
        // User chose to stay — re-push so back button can be caught again
        window.history.pushState(null, "", window.location.href);
      }
      // If confirmed, the browser navigates away naturally
    };

    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, [isProcessing, t]);

  // Abort batch processing on unmount
  useEffect(() => {
    return () => {
      abortBatchProcessing();
    };
  }, [abortBatchProcessing]);

  // Handle batch completion — refetch stock data on success
  useEffect(() => {
    if (!isComplete || !batchResult) return;
    // Don't show toasts for recovered data (user already saw it before refresh)
    if (isRecovered) return;

    if (batchResult === "success") {
      setShowToast({ key: "success", label: t(I18N_KEYS.COMMODITY_MANAGEMENT.HCM_STOCK_UPLOAD_SUCCESS) });
      refetchStockData?.();
    } else if (batchResult === "partial_failure") {
      setShowToast({
        key: "warning",
        label: t(I18N_KEYS.COMMODITY_MANAGEMENT.HCM_BATCH_PARTIAL_FAILURE_TOAST, {
          succeeded: batchStatus.totalRecords - batchStatus.failedRecords,
          total: batchStatus.totalRecords,
          failed: batchStatus.failedRecords,
        }),
      });
      refetchStockData?.();
    } else if (batchResult === "all_failed") {
      setShowToast({ key: "error", label: t(I18N_KEYS.COMMODITY_MANAGEMENT.HCM_BATCH_ALL_FAILED_TOAST) });
    }
  }, [isComplete, batchResult]);

  // Called by NewShipmentPopup after validation passes
  const handleBatchStart = useCallback(({ stockPayload, sheetData, clientRefToRowIndex }) => {
    originalSheetDataRef.current = sheetData;
    clientRefToRowIndexRef.current = clientRefToRowIndex;

    // Persist sheet data to sessionStorage for recovery
    saveSheetToSession(sheetData, clientRefToRowIndex);

    // Close popup, start batch processing in background
    setShowNewShipmentPopup(false);
    processBatches(stockPayload);
  }, [processBatches]);

  // Clear both session stores on reset
  const handleReset = useCallback(() => {
    resetBatchState();
    clearSheetSession();
    originalSheetDataRef.current = null;
    clientRefToRowIndexRef.current = {};
  }, [resetBatchState]);

  // Download result sheet with SUCCESS/CREATION_FAILED per row
  const downloadResultSheet = useCallback(async () => {
    const sheetData = originalSheetDataRef.current;
    const clientRefToRowIndex = clientRefToRowIndexRef.current;
    if (!sheetData) {
      setShowToast({ key: "error", label: t(I18N_KEYS.COMMODITY_MANAGEMENT.HCM_NO_SHIPMENT_DATA) });
      return;
    }

    const XLSX = (await import("xlsx")).default;
    const { headers, dataRows, variantIdRow } = sheetData;

    const failedClientRefIds = new Set(batchFailedRecords.map((f) => f.stockRecord.clientReferenceId));

    const failedRowIndices = new Set();
    Object.entries(clientRefToRowIndex).forEach(([clientRefId, rowIndex]) => {
      if (failedClientRefIds.has(clientRefId)) {
        failedRowIndices.add(rowIndex);
      }
    });

    const newHeaders = [...headers, "CREATION_STATUS"];
    const newVariantIdRow = [...variantIdRow, ""];
    const newDataRows = dataRows.map((row, idx) => {
      const paddedRow = [...row];
      while (paddedRow.length < headers.length) {
        paddedRow.push("");
      }
      const hasRecords = Object.values(clientRefToRowIndex).includes(idx);
      let status;
      if (!hasRecords) {
        status = "SKIPPED";
      } else if (failedRowIndices.has(idx)) {
        status = "CREATION_FAILED";
      } else {
        status = "SUCCESS";
      }
      return [...paddedRow, status];
    });

    const wsData = [newHeaders, newVariantIdRow, ...newDataRows];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    ws["!cols"] = newHeaders.map(() => ({ wch: 30 }));
    ws["!rows"] = [null, { hidden: true }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Stock Data");

    XLSX.writeFile(wb, `Shipment_Result_${campaignNumber || "campaign"}_${new Date().toISOString().slice(0, 10)}.xlsx`);
  }, [batchFailedRecords, campaignNumber, t]);

  const hasBatchActivity = isProcessing || isComplete;

  const effectiveDateRange = useMemo(() => {
    const now = new Date();
    const fallbackStart = campaignCreatedDate || new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    const fallbackEnd = campaignEndDate && now < campaignEndDate ? now : (campaignEndDate || now);

    if (dateRange.preset === "cumulative") {
      return { startDate: fallbackStart, endDate: fallbackEnd, preset: "cumulative" };
    }
    if (dateRange.preset === "today") {
      return { ...dateRange };
    }
    return {
      ...dateRange,
      startDate: dateRange.startDate || fallbackStart,
      endDate: dateRange.endDate || fallbackEnd,
    };
  }, [dateRange, campaignCreatedDate, campaignEndDate]);

  const { data: rawStockData, isLoading: stockLoading, metadata, source, refetch: refetchStockData } = useStockData({
    tenantId,
    dateRange: effectiveDateRange,
    referenceId: projectId,
    campaignId,
    campaignNumber,
    useKibana: useKibanaFlag,
  });

  const stockSummary = useMemo(
    () => computeStockSummary({ source, metadata, data: rawStockData }),
    [source, metadata, rawStockData]
  );

  const { totalManagers, syncedManagers, syncRate, isLoading: syncLoading } = useWarehouseManagerSync({
    enabled: useKibanaFlag,
    dateRange: effectiveDateRange,
    campaignNumber,
  });

  const enrichedStockSummary = useMemo(() => {
    if (!syncLoading && (totalManagers > 0 || syncedManagers > 0)) {
      return {
        ...stockSummary,
        dataSyncStats: { totalFacilities: totalManagers, syncedFacilities: syncedManagers, syncRate },
      };
    }
    return stockSummary;
  }, [stockSummary, syncLoading, totalManagers, syncedManagers, syncRate]);

  const handleDateRangeSelect = (name, { startDate, endDate }) => {
    setDateRange({
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      preset: "custom",
    });
  };

  const datePresetOptions = [
    { code: "custom", name: t(I18N_KEYS.COMMODITY_MANAGEMENT.HCM_CUSTOM_DATE_RANGE) },
    { code: "today", name: t(I18N_KEYS.COMMODITY_MANAGEMENT.HCM_TODAY) },
    { code: "cumulative", name: t(I18N_KEYS.COMMODITY_MANAGEMENT.HCM_CUMULATIVE) },
  ];

  const handlePresetSelect = (code) => {
    const now = new Date();
    const fallbackStart = campaignCreatedDate || new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    const fallbackEnd = campaignEndDate && now < campaignEndDate ? now : (campaignEndDate || now);

    if (code === "today") {
      const startOfDay = new Date(now);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);
      setDateRange({ startDate: startOfDay, endDate: endOfDay, preset: "today" });
    } else if (code === "cumulative") {
      setDateRange({ startDate: fallbackStart, endDate: fallbackEnd, preset: "cumulative" });
    } else {
      setDateRange((prev) => ({
        startDate: prev.startDate || fallbackStart,
        endDate: prev.endDate || fallbackEnd,
        preset: "custom",
      }));
    }
  };

  const tabs = [
    { key: "transaction", label: t(I18N_KEYS.COMMODITY_MANAGEMENT.HCM_TRANSACTION_SUMMARY) },
    { key: "stock", label: t(I18N_KEYS.COMMODITY_MANAGEMENT.HCM_STOCK_SUMMARY) },
    { key: "pending", label: t(I18N_KEYS.COMMODITY_MANAGEMENT.HCM_PENDING_TRANSACTIONS) },
  ];

  if (campaignIdLoading) {
    return <Loader page={true} variant={"PageLoader"} />;
  }

  const statusText = resolveStatusText(t, batchStatus.statusKey, batchStatus.statusParams);

  return (
    <div className="cm-dashboard">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <HeaderComponent className="cm-header">
          {t(I18N_KEYS.COMMODITY_MANAGEMENT.HCM_COMMODITY_MANAGEMENT_MODULE)}{" "}
          <span className="cm-header-tenant">({tenantName})</span>
        </HeaderComponent>
        {!isCompleted && (
          <Button
            type="button"
            variation="secondary"
            label={t(I18N_KEYS.COMMODITY_MANAGEMENT.HCM_NEW_SHIPMENT)}
            icon="AddIcon"
            onClick={() => setShowNewShipmentPopup(true)}
            isDisabled={isProcessing}
          />
        )}
      </div>

      {/* Inline Batch Processing Status Card */}
      {hasBatchActivity && (
        <Card style={{ marginBottom: "1rem", padding: "1.5rem" }}>
          {isProcessing && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <span style={{ fontWeight: "600", fontSize: "1rem" }}>{statusText}</span>
                <span style={{ fontSize: "0.875rem", color: "#505A5F" }}>
                  {t(I18N_KEYS.COMMODITY_MANAGEMENT.HCM_BATCH_PROGRESS_LABEL, { current: batchStatus.currentBatch, total: batchStatus.total })}
                </span>
              </div>
              <div style={{ width: "100%", backgroundColor: "#E0E0E0", borderRadius: "4px", height: "8px", marginBottom: "0.75rem" }}>
                <div
                  style={{
                    width: `${batchStatus.total > 0 ? (batchStatus.completed / batchStatus.total) * 100 : 0}%`,
                    backgroundColor: "#F47738",
                    height: "8px",
                    borderRadius: "4px",
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
              <p style={{ fontSize: "0.875rem", color: "#505A5F" }}>
                {t(I18N_KEYS.COMMODITY_MANAGEMENT.HCM_BATCH_RECORDS_STATUS, {
                  processed: batchStatus.processedRecords,
                  total: batchStatus.totalRecords,
                  failed: batchStatus.failedRecords,
                })}
              </p>
            </div>
          )}
          {isComplete && batchResult === "success" && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ color: "#00703C", fontWeight: "600" }}>
                {isRecovered && <span style={{ marginRight: "0.5rem", color: "#505A5F", fontWeight: "400" }}>{t(I18N_KEYS.COMMODITY_MANAGEMENT.HCM_BATCH_RECOVERED_LABEL)}</span>}
                {t(I18N_KEYS.COMMODITY_MANAGEMENT.HCM_BATCH_SUCCESS_MSG, { total: batchStatus.totalRecords })}
              </p>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Button
                  label={t(I18N_KEYS.COMMODITY_MANAGEMENT.HCM_DOWNLOAD_RESULT_SHEET)}
                  variation="secondary"
                  type="button"
                  icon="FileDownload"
                  onClick={downloadResultSheet}
                />
                <Button
                  label={t(I18N_KEYS.COMMODITY_MANAGEMENT.HCM_CLOSE)}
                  variation="secondary"
                  type="button"
                  onClick={handleReset}
                />
              </div>
            </div>
          )}
          {isComplete && batchResult === "partial_failure" && (
            <div>
              <p style={{ color: "#B4762B", fontWeight: "600", marginBottom: "0.75rem" }}>
                {isRecovered && <span style={{ marginRight: "0.5rem", color: "#505A5F", fontWeight: "400" }}>{t(I18N_KEYS.COMMODITY_MANAGEMENT.HCM_BATCH_RECOVERED_LABEL)}</span>}
                {t(I18N_KEYS.COMMODITY_MANAGEMENT.HCM_BATCH_PARTIAL_FAILURE_MSG, { failed: batchStatus.failedRecords, total: batchStatus.totalRecords })}
              </p>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Button
                  label={t(I18N_KEYS.COMMODITY_MANAGEMENT.HCM_DOWNLOAD_RESULT_SHEET)}
                  variation="primary"
                  type="button"
                  icon="FileDownload"
                  onClick={downloadResultSheet}
                />
                <Button
                  label={t(I18N_KEYS.COMMODITY_MANAGEMENT.HCM_CLOSE)}
                  variation="secondary"
                  type="button"
                  onClick={handleReset}
                />
              </div>
            </div>
          )}
          {isComplete && batchResult === "all_failed" && (
            <div>
              <p style={{ color: "#D4351C", fontWeight: "600", marginBottom: "0.75rem" }}>
                {isRecovered && <span style={{ marginRight: "0.5rem", color: "#505A5F", fontWeight: "400" }}>{t(I18N_KEYS.COMMODITY_MANAGEMENT.HCM_BATCH_RECOVERED_LABEL)}</span>}
                {t(I18N_KEYS.COMMODITY_MANAGEMENT.HCM_BATCH_ALL_FAILED_MSG, { total: batchStatus.totalRecords })}
              </p>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Button
                  label={t(I18N_KEYS.COMMODITY_MANAGEMENT.HCM_DOWNLOAD_RESULT_SHEET)}
                  variation="primary"
                  type="button"
                  icon="FileDownload"
                  onClick={downloadResultSheet}
                />
                <Button
                  label={t(I18N_KEYS.COMMODITY_MANAGEMENT.HCM_CLOSE)}
                  variation="secondary"
                  type="button"
                  onClick={handleReset}
                />
              </div>
            </div>
          )}
          {/* Recovered mid-processing state: batch was interrupted, show last known progress */}
          {isRecovered && !isComplete && !isProcessing && batchStatus.completed > 0 && (
            <div>
              <p style={{ color: "#B4762B", fontWeight: "600", marginBottom: "0.5rem" }}>
                {t(I18N_KEYS.COMMODITY_MANAGEMENT.HCM_BATCH_INTERRUPTED_MSG)}
              </p>
              <p style={{ fontSize: "0.875rem", color: "#505A5F", marginBottom: "0.75rem" }}>
                {t(I18N_KEYS.COMMODITY_MANAGEMENT.HCM_BATCH_INTERRUPTED_DETAIL, {
                  completed: batchStatus.completed,
                  total: batchStatus.total,
                  processed: batchStatus.processedRecords,
                  totalRecords: batchStatus.totalRecords,
                })}
              </p>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {originalSheetDataRef.current && (
                  <Button
                    label={t(I18N_KEYS.COMMODITY_MANAGEMENT.HCM_DOWNLOAD_RESULT_SHEET)}
                    variation="primary"
                    type="button"
                    icon="FileDownload"
                    onClick={downloadResultSheet}
                  />
                )}
                <Button
                  label={t(I18N_KEYS.COMMODITY_MANAGEMENT.HCM_DISMISS)}
                  variation="secondary"
                  type="button"
                  onClick={handleReset}
                />
              </div>
            </div>
          )}
        </Card>
      )}

      <div className="cm-date-section">
        <LabelFieldPair vertical={true} removeMargin={true}>
          <label className="label-styles cm-date-label">{t(I18N_KEYS.COMMODITY_MANAGEMENT.HCM_DATE_RANGE)}</label>
          <DateRangePicker
            t={t}
            formData={{
              dateRange: {
                startDate: effectiveDateRange.startDate,
                endDate: effectiveDateRange.endDate,
              },
            }}
            onSelect={handleDateRangeSelect}
            props={{ name: "dateRange" }}
            minDate={campaignCreatedDate}
            maxDate={campaignEndDate}
          />
        </LabelFieldPair>
        <Toggle
          options={datePresetOptions}
          optionsKey="name"
          selectedOption={dateRange.preset}
          onSelect={handlePresetSelect}
          style={{}}
        />
      </div>

      <div className="digit-dss-switch-tabs" style={{width:"100%"}}>
        <div className="digit-dss-switch-tab-wrapper">
          {tabs.map((tab) => (
            <div
              key={tab.key}
              className={
                activeTab === tab.key
                  ? "digit-dss-switch-tab-selected"
                  : "digit-dss-switch-tab-unselected"
              }
              onClick={() => {
                setActiveTab(tab.key);
                if (refetchStockData) refetchStockData();
              }}
            >
              {tab.label}
            </div>
          ))}
        </div>
      </div>

      {activeTab === "transaction" && (
        <TransactionSummaryTab
          rawStockData={rawStockData}
          stockLoading={stockLoading}
          stockSummary={enrichedStockSummary}
          tenantId={tenantId}
          campaignId={campaignId}
          projectId={projectId}
          userBoundary={userBoundary}
          userBoundaries={userBoundaries}
          isTopLevel={isTopLevel}
        />
      )}
      {activeTab === "stock" && (
        <StockSummaryTab
          rawStockData={rawStockData}
          stockLoading={stockLoading}
          stockSummary={enrichedStockSummary}
          tenantId={tenantId}
          campaignId={campaignId}
          campaignNumber={campaignNumber}
          projectId={projectId}
          refetchStockData={refetchStockData}
          isCompleted={isCompleted}
          userBoundary={userBoundary}
          userBoundaries={userBoundaries}
          isTopLevel={isTopLevel}
        />
      )}
      {activeTab === "pending" && (
        <PendingTransactionsTab
          rawStockData={rawStockData}
          stockLoading={stockLoading}
          tenantId={tenantId}
          campaignId={campaignId}
          projectId={projectId}
          userBoundary={userBoundary}
          isTopLevel={isTopLevel}
          refetchStockData={refetchStockData}
        />
      )}

      {showNewShipmentPopup && (
        <NewShipmentPopup
          campaignNumber={campaignNumber}
          campaignId={campaignId}
          tenantId={tenantId}
          projectId={projectId}
          userBoundary={userBoundary}
          isTopLevel={isTopLevel}
          onClose={() => setShowNewShipmentPopup(false)}
          onSuccess={() => {
            setShowNewShipmentPopup(false);
            setShowToast({ key: "success", label: t(I18N_KEYS.COMMODITY_MANAGEMENT.HCM_STOCK_UPLOAD_SUCCESS) });
            refetchStockData?.();
          }}
          onBatchStart={handleBatchStart}
        />
      )}

      {showToast && (
        <Toast
          label={showToast.label}
          type={showToast.key === "error" ? "error" : showToast.key === "warning" ? "warning" : "success"}
          isDleteBtn={true}
          onClose={() => setShowToast(null)}
          transitionTime={5000}
        />
      )}
    </div>
  );
};

export default CommodityDashboard;
