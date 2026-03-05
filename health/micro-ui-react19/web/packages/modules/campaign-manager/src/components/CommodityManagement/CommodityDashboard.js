import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Toggle, HeaderComponent,LabelFieldPair } from "@egovernments/digit-ui-components";
import TransactionSummaryTab from "./TransactionSummaryTab";
import StockSummaryTab from "./StockSummaryTab";
import DateRangePicker from "./DateRangePicker";
import { useLocation } from "react-router-dom";


const CommodityDashboard = () => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const tenantName = tenantId?.split(".")?.[1] || tenantId;
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const campaignId = searchParams.get("campaignId");
  const campaignNumber = searchParams.get("campaignNumber");

  // Read campaign data from navigation state (passed from HCMMyCampaignRowCard)
  const { projectId, campaignStartDate: campaignStartEpoch, campaignEndDate: campaignEndEpoch } = location.state || {};
  const campaignStartDate = useMemo(
    () => (campaignStartEpoch ? new Date(campaignStartEpoch) : null),
    [campaignStartEpoch]
  );
  const campaignEndDate = useMemo(
    () => (campaignEndEpoch ? new Date(campaignEndEpoch) : null),
    [campaignEndEpoch]
  );

  const [activeTab, setActiveTab] = useState("transaction");
  // Default to cumulative: campaign start date → today
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: new Date(),
    preset: "cumulative",
  });

  // Compute effective date range, resolving cumulative/null start dates to campaign start
  const effectiveDateRange = useMemo(() => {
    if (dateRange.preset === "cumulative") {
      return {
        startDate: campaignStartDate || dateRange.startDate,
        endDate: new Date(),
        preset: "cumulative",
      };
    }
    return {
      ...dateRange,
      startDate: dateRange.startDate || campaignStartDate,
    };
  }, [dateRange, campaignStartDate]);

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
    if (code === "today") {
      const today = new Date();
      const startOfDay = new Date(today);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(today);
      endOfDay.setHours(23, 59, 59, 999);
      setDateRange({ startDate: startOfDay, endDate: endOfDay, preset: "today" });
    } else if (code === "cumulative") {
      setDateRange({ startDate: null, endDate: null, preset: "cumulative" });
    } else {
      // When switching to custom, default to campaign start date → today
      setDateRange((prev) => ({
        startDate: prev.startDate || campaignStartDate || new Date(),
        endDate: prev.endDate || new Date(),
        preset: "custom",
      }));
    }
  };

  const tabs = [
    { key: "transaction", label: t("HCM_TRANSACTION_SUMMARY") },
    { key: "stock", label: t("HCM_STOCK_SUMMARY") },
  ];

  return (
    <div className="cm-dashboard">
      <HeaderComponent className="cm-header">
        {t("HCM_COMMODITY_MANAGEMENT_MODULE")}{" "}
        <span className="cm-header-tenant">({tenantName})</span>
      </HeaderComponent>

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
            minDate={campaignStartDate}
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
        <TransactionSummaryTab dateRange={effectiveDateRange} tenantId={tenantId} campaignId={campaignId} projectId={projectId}/>
      ) : (
        <StockSummaryTab dateRange={effectiveDateRange} tenantId={tenantId} campaignId={campaignId} campaignNumber={campaignNumber} projectId={projectId}/>
      )}
    </div>
  );
};

export default CommodityDashboard;
