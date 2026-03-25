import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Toggle, HeaderComponent, LabelFieldPair, Loader, Button, Toast } from "@egovernments/digit-ui-components";
import TransactionSummaryTab from "./TransactionSummaryTab";
import StockSummaryTab from "./StockSummaryTab";
import DateRangePicker from "./DateRangePicker";
import { useLocation } from "react-router-dom";
import useStockData from "../../hooks/useStockData";
import { computeStockSummary } from "../../utils/stockDataProcessor";
import useWarehouseManagerSync from "../../hooks/useWarehouseManagerSync";
import { useCommodityProject } from "./CommodityProjectContext";
import NewShipmentPopup from "./NewShipmentPopup";


const CommodityDashboard = () => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const tenantName = tenantId?.split(".")?.[1] || tenantId;
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const campaignNumber = searchParams.get("campaignNumber");

  // Backward compat: still check URL for campaignId first
  const campaignIdFromUrl = searchParams.get("campaignId");

  // Read campaign data from navigation state (passed from HCMCommodityRowCard)
  const { projectId, campaignStartDate: campaignStartEpoch, campaignEndDate: campaignEndEpoch, isCompleted } = location.state || {};

  // Read userBoundary and isTopLevel from context
  const { userBoundary, isTopLevel } = useCommodityProject();

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
    () => (campaignSearchData?.createdTime ? new Date(campaignSearchData.createdTime) : null),
    [campaignSearchData?.createdTime]
  );

  const campaignStartDate = useMemo(
    () => (campaignStartEpoch ? new Date(campaignStartEpoch) : null),
    [campaignStartEpoch]
  );
  const campaignEndDate = useMemo(
    () => (campaignEndEpoch ? new Date(campaignEndEpoch) : null),
    [campaignEndEpoch]
  );

  // Stock data source: true = Kibana/ES first (with stock API fallback), false = stock API only
  const useKibanaFlag = true;

  const [activeTab, setActiveTab] = useState("transaction");
  const [showNewShipmentPopup, setShowNewShipmentPopup] = useState(false);
  const [showToast, setShowToast] = useState(null);
  // Default to cumulative: campaign start date → today
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: new Date(),
    preset: "cumulative",
  });

  // Compute effective date range, resolving cumulative/null start dates to campaign start
  const effectiveDateRange = useMemo(() => {
    const now = new Date();
    // Fallback start: campaignStartDate, or 90 days ago if campaign start is unavailable
    const fallbackStart = campaignStartDate || new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

    if (dateRange.preset === "cumulative") {
      return {
        startDate: fallbackStart,
        endDate: now,
        preset: "cumulative",
      };
    }
    if (dateRange.preset === "today") {
      return { ...dateRange };
    }
    return {
      ...dateRange,
      startDate: dateRange.startDate || fallbackStart,
      endDate: dateRange.endDate || now,
    };
  }, [dateRange, campaignStartDate]);

  // Centralized stock data fetch (single call for both tabs)
  const { data: rawStockData, isLoading: stockLoading, metadata, source, refetch: refetchStockData } = useStockData({
    tenantId,
    dateRange: effectiveDateRange,
    referenceId: projectId,
    campaignId,
    campaignNumber,
    useKibana: useKibanaFlag,
  });

  // Compute summary stats from either ES aggregations or raw data
  const stockSummary = useMemo(
    () => computeStockSummary({ source, metadata, data: rawStockData }),
    [source, metadata, rawStockData]
  );

  // Warehouse manager sync stats from project-staff + user-sync ES indexes
  const { totalManagers, syncedManagers, syncRate, isLoading: syncLoading } = useWarehouseManagerSync({
    enabled: useKibanaFlag,
    dateRange: effectiveDateRange,
    campaignId,
  });

  // Override stockSummary.dataSyncStats with real ES data when available
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

  // Date range preset toggle options
  const datePresetOptions = [
    { code: "custom", name: t("HCM_CUSTOM_DATE_RANGE") },
    { code: "today", name: t("HCM_TODAY") },
    { code: "cumulative", name: t("HCM_CUMULATIVE") },
  ];

  const handlePresetSelect = (code) => {
    const now = new Date();
    const fallbackStart = campaignStartDate || new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

    if (code === "today") {
      const startOfDay = new Date(now);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);
      setDateRange({ startDate: startOfDay, endDate: endOfDay, preset: "today" });
    } else if (code === "cumulative") {
      setDateRange({ startDate: fallbackStart, endDate: now, preset: "cumulative" });
    } else {
      // Custom: inherit current effective dates so the picker doesn't reset
      setDateRange((prev) => ({
        startDate: prev.startDate || fallbackStart,
        endDate: prev.endDate || now,
        preset: "custom",
      }));
    }
  };

  const tabs = [
    { key: "transaction", label: t("HCM_TRANSACTION_SUMMARY") },
    { key: "stock", label: t("HCM_STOCK_SUMMARY") },
  ];

  // Show loader while campaignId is being fetched
  if (campaignIdLoading) {
    return <Loader page={true} variant={"PageLoader"} />;
  }

  return (
    <div className="cm-dashboard">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <HeaderComponent className="cm-header">
          {t("HCM_COMMODITY_MANAGEMENT_MODULE")}{" "}
          <span className="cm-header-tenant">({tenantName})</span>
        </HeaderComponent>
        {!isCompleted && (
          <Button
            type="button"
            variation="secondary"
            label={t("HCM_NEW_SHIPMENT")}
            icon="AddIcon"
            onClick={() => setShowNewShipmentPopup(true)}
          />
        )}
      </div>

      <div className="cm-date-section">
        <LabelFieldPair vertical={true} removeMargin={true}>
          <label className="label-styles cm-date-label">{t("HCM_DATE_RANGE")}</label>
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

      <div className="digit-dss-switch-tabs">
        <div className="digit-dss-switch-tab-wrapper">
          {tabs.map((tab) => (
            <div
              key={tab.key}
              className={
                activeTab === tab.key
                  ? "digit-dss-switch-tab-selected"
                  : "digit-dss-switch-tab-unselected"
              }
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </div>
          ))}
        </div>
      </div>

      {activeTab === "transaction" ? (
        <TransactionSummaryTab
          rawStockData={rawStockData}
          stockLoading={stockLoading}
          stockSummary={enrichedStockSummary}
          tenantId={tenantId}
          campaignId={campaignId}
          projectId={projectId}
          userBoundary={userBoundary}
          isTopLevel={isTopLevel}
        />
      ) : (
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
          isTopLevel={isTopLevel}
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
            setShowToast({ key: "success", label: t("HCM_STOCK_UPLOAD_SUCCESS") });
            refetchStockData?.();
          }}
        />
      )}

      {showToast && (
        <Toast
          label={showToast.label}
          type={showToast.key === "error" ? "error" : "success"}
          isDleteBtn={true}
          onClose={() => setShowToast(null)}
          transitionTime={5000}
        />
      )}
    </div>
  );
};

export default CommodityDashboard;
