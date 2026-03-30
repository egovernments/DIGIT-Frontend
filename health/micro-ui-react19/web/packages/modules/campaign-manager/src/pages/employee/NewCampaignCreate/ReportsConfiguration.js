import React, { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, HeaderComponent, Button, Footer, CheckBox, Dropdown, TextInput } from "@egovernments/digit-ui-components";
import { Assessment } from "@egovernments/digit-ui-svg-components";

const AVAILABLE_REPORTS = [
  { code: "HOUSEHOLD_REGISTRATION_REPORT", label: "HCM_REPORT_HOUSEHOLD_REGISTRATION", applicableTypes: ["SMC", "MDA"] },
  { code: "REGISTRATION_AND_DISTRIBUTION_DATA", label: "HCM_REPORT_REGISTRATION_AND_DISTRIBUTION" },
  { code: "COHORT_DATA_REUSE_TRACKING_CYCLEWISE", label: "HCM_REPORT_COHORT_DATA_REUSE_CYCLEWISE" },
  { code: "CHILDREN_TREATED_SINGLE_CYCLE", label: "HCM_REPORT_CHILDREN_TREATED_SINGLE_CYCLE" },
  { code: "COHORT_CHILDREN_TREATED_ALL_CYCLES", label: "HCM_REPORT_COHORT_CHILDREN_TREATED_ALL_CYCLES" },
  { code: "RESOURCE_SCANNING_DISTRIBUTION", label: "HCM_REPORT_RESOURCE_SCANNING_DISTRIBUTION" },
  { code: "STOCK_TRANSACTIONS", label: "HCM_REPORT_STOCK_TRANSACTIONS" },
  { code: "RESOURCE_SCANNING_INVENTORY", label: "HCM_REPORT_RESOURCE_SCANNING_INVENTORY" },
  { code: "DUPLICATE_REPORTS", label: "HCM_REPORT_DUPLICATE_REPORTS" },
  { code: "SUSPECTED_ANOMALIES", label: "HCM_REPORT_SUSPECTED_ANOMALIES" },
  { code: "ATTENDANCE", label: "HCM_REPORT_ATTENDANCE" },
  { code: "DUPLICATE_VOUCHER_USAGE", label: "HCM_REPORT_DUPLICATE_VOUCHER_USAGE", applicableTypes: ["SMC"] },
  { code: "SUPERVISION_CHECKLIST_RESPONSES", label: "HCM_REPORT_SUPERVISION_CHECKLIST_RESPONSES" },
  { code: "REFERRAL", label: "HCM_REPORT_REFERRAL" },
  { code: "ADVERSE_EFFECTS", label: "HCM_REPORT_ADVERSE_EFFECTS" },
  { code: "DATA_REUSE_CAMPAIGNWISE", label: "HCM_REPORT_DATA_REUSE_CAMPAIGNWISE" },
];

const FREQUENCY_OPTIONS = [
  { code: "DAILY", label: "HCM_REPORT_FREQUENCY_DAILY" },
  { code: "WEEKLY", label: "HCM_REPORT_FREQUENCY_WEEKLY" },
  { code: "MONTHLY", label: "HCM_REPORT_FREQUENCY_MONTHLY" },
  { code: "END_OF_CAMPAIGN", label: "HCM_REPORT_FREQUENCY_END_OF_CAMPAIGN" },
  { code: "CUSTOM", label: "HCM_REPORT_FREQUENCY_CUSTOM" },
];

const STEP_SELECTION = 0;
const STEP_FREQUENCY = 1;

const ReportsConfiguration = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const campaignNumber = searchParams.get("campaignNumber");
  const projectType = searchParams.get("projectType");
  const tenantId = searchParams.get("tenantId") || Digit.ULBService.getCurrentTenantId();

  const [currentStep, setCurrentStep] = useState(STEP_SELECTION);
  const [selectedReports, setSelectedReports] = useState({});
  const [frequencyConfig, setFrequencyConfig] = useState({});

  const applicableReports = useMemo(() => {
    return AVAILABLE_REPORTS.map((report) => {
      const isApplicable = !report.applicableTypes || report.applicableTypes.includes(projectType);
      return { ...report, isApplicable };
    });
  }, [projectType]);

  const selectedCount = useMemo(() => {
    return Object.values(selectedReports).filter(Boolean).length;
  }, [selectedReports]);

  const handleCheckboxChange = useCallback((reportCode, isApplicable) => {
    if (!isApplicable) return;
    setSelectedReports((prev) => ({
      ...prev,
      [reportCode]: !prev[reportCode],
    }));
  }, []);

  const handleFrequencyChange = useCallback((reportCode, selectedOption) => {
    setFrequencyConfig((prev) => ({
      ...prev,
      [reportCode]: {
        ...prev[reportCode],
        frequency: selectedOption.code,
      },
    }));
  }, []);

  const handleCustomDaysChange = useCallback((reportCode, value) => {
    setFrequencyConfig((prev) => ({
      ...prev,
      [reportCode]: {
        ...prev[reportCode],
        customDays: value,
      },
    }));
  }, []);

  const getSelectedFrequency = useCallback(
    (reportCode) => {
      return frequencyConfig[reportCode]?.frequency || "DAILY";
    },
    [frequencyConfig]
  );

  const handleNext = () => {
    if (currentStep === STEP_SELECTION) {
      // Initialize frequency config for newly selected reports
      const updatedConfig = { ...frequencyConfig };
      Object.keys(selectedReports).forEach((code) => {
        if (selectedReports[code] && !updatedConfig[code]) {
          updatedConfig[code] = { frequency: "DAILY", customDays: "" };
        }
      });
      // Remove unselected reports from config
      Object.keys(updatedConfig).forEach((code) => {
        if (!selectedReports[code]) {
          delete updatedConfig[code];
        }
      });
      setFrequencyConfig(updatedConfig);
      setCurrentStep(STEP_FREQUENCY);
    } else {
      // Save and navigate back
      const reportsData = Object.keys(selectedReports)
        .filter((code) => selectedReports[code])
        .map((code) => ({
          code,
          frequency: getSelectedFrequency(code),
          customDays: frequencyConfig[code]?.customDays || null,
        }));

      // Store in session storage
      Digit.SessionStorage.set("HCM_CAMPAIGN_REPORTS_CONFIG", reportsData);
      navigate(`/${window.contextPath}/employee/campaign/view-details?campaignNumber=${campaignNumber}&tenantId=${tenantId}`);
    }
  };

  const handleBack = () => {
    if (currentStep === STEP_FREQUENCY) {
      setCurrentStep(STEP_SELECTION);
    } else {
      navigate(-1);
    }
  };

  const selectedReportsList = useMemo(() => {
    return applicableReports.filter((r) => selectedReports[r.code]);
  }, [applicableReports, selectedReports]);

  return (
    <div className="reports-configuration">
      {currentStep === STEP_SELECTION && (
        <Card>
          <HeaderComponent className="reports-configuration__heading">{t("HCM_REPORTS_SELECTION")}</HeaderComponent>
          <p className="reports-configuration__description">{t("HCM_REPORTS_SELECTION_DESC")}</p>

          <div className="reports-configuration__count">
            {t("HCM_REPORTS_AVAILABLE_REPORTS")} ({selectedCount} {t("HCM_REPORT_SELECTED_LABEL")})
          </div>

          <div className="reports-configuration__grid">
            {applicableReports.map((report) => (
              <div key={report.code} className={`reports-configuration__checkbox-item ${!report.isApplicable ? "reports-configuration__checkbox-item--disabled" : ""}`}>
                <CheckBox
                  label={t(report.label)}
                  checked={!!selectedReports[report.code]}
                  onChange={() => handleCheckboxChange(report.code, report.isApplicable)}
                  disabled={!report.isApplicable}
                />
                {!report.isApplicable && <span className="reports-configuration__not-applicable">{t("HCM_REPORT_NOT_APPLICABLE")}</span>}
              </div>
            ))}
          </div>
        </Card>
      )}

      {currentStep === STEP_FREQUENCY && (
        <Card>
          <HeaderComponent className="reports-configuration__heading">{t("HCM_REPORTS_CONFIGURE_FREQUENCY")}</HeaderComponent>
          <p className="reports-configuration__description">{t("HCM_REPORTS_CONFIGURE_FREQUENCY_DESC")}</p>

          <div className="reports-configuration__count">
            {t("HCM_REPORTS_CONFIGURE_FREQUENCY_COUNT")} ({selectedCount} {t("HCM_REPORTS_SELECTED_SUFFIX")})
          </div>

          <Card className="reports-configuration__frequency-card" type="secondary">
            {selectedReportsList.map((report, index) => {
              const currentFrequency = getSelectedFrequency(report.code);
              const hasCustom = currentFrequency === "CUSTOM";

              return (
                <div key={report.code} className={`reports-configuration__frequency-row ${index < selectedReportsList.length - 1 ? "reports-configuration__frequency-row--bordered" : ""}`}>
                  <div className="reports-configuration__frequency-row-label">{t(report.label)}</div>
                  <div className="reports-configuration__frequency-row-controls">
                    <Dropdown
                      style={{ minWidth: "25rem" }}
                      t={t}
                      option={FREQUENCY_OPTIONS}
                      optionKey="label"
                      selected={FREQUENCY_OPTIONS.find((o) => o.code === currentFrequency)}
                      select={(value) => handleFrequencyChange(report.code, value)}
                    />
                    {hasCustom && (
                      <TextInput
                        type="number"
                        value={frequencyConfig[report.code]?.customDays || ""}
                        onChange={(e) => handleCustomDaysChange(report.code, e.target.value)}
                        placeholder={t("HCM_REPORT_CUSTOM_DAYS")}
                        style={{ width: "10rem" }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </Card>
        </Card>
      )}

      <Footer
        actionFields={[
          <Button key="back" label={t("HCM_BACK")} onClick={handleBack} variation="secondary" icon="ArrowBack"             style={{
              marginLeft: "3rem",
              minWidth: "12.5rem",
            }} />,
          <Button
            key="next"
            label={currentStep === STEP_FREQUENCY ? t("HCM_SAVE_CONFIGURATION") : t("HCM_NEXT")}
            onClick={handleNext}
            variation="primary"
            icon={currentStep === STEP_FREQUENCY ? "CheckCircle" : "ArrowForward"}
            isDisabled={selectedCount === 0}
            style={{
              minWidth: "12.5rem",
            }}
          />,
        ]}
        maxActionFieldsAllowed={5}
      />
    </div>
  );
};

export default ReportsConfiguration;
