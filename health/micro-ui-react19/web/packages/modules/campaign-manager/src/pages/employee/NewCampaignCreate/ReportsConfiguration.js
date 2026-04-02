import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Card,
  HeaderComponent,
  Button,
  Footer,
  CheckBox,
  MultiSelectDropdown,
  // FieldV1, // TODO: Uncomment when CUSTOM frequency is re-enabled
  Loader,
  Toast,
  LabelFieldPair,
} from "@egovernments/digit-ui-components";
import { Assessment } from "@egovernments/digit-ui-svg-components";

const formatEpochToDate = (epoch, timezone) => {
  if (!epoch) return "";
  const date = new Date(epoch);
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  const tz = timezone || getTimezoneOffset(date);
  return `${dd}-${mm}-${yyyy} ${hh}:${min}:${ss}+${tz}`;
};

const getTimezoneOffset = (date) => {
  const offset = -date.getTimezoneOffset();
  const hours = String(Math.floor(Math.abs(offset) / 60)).padStart(2, "0");
  const minutes = String(Math.abs(offset) % 60).padStart(2, "0");
  return `${hours}${minutes}`;
};

const ALL_FREQUENCY_OPTIONS = [
  { code: "DAILY", label: "HCM_REPORT_FREQUENCY_DAILY" },
  { code: "WEEKLY", label: "HCM_REPORT_FREQUENCY_WEEKLY" },
  { code: "MONTHLY", label: "HCM_REPORT_FREQUENCY_MONTHLY" },
  { code: "END_OF_CAMPAIGN", label: "HCM_REPORT_FREQUENCY_END_OF_CAMPAIGN" },
  // TODO: Uncomment when CUSTOM frequency is re-enabled
  // { code: "CUSTOM", label: "HCM_REPORT_FREQUENCY_CUSTOM" },
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
  const tenantId =
    searchParams.get("tenantId") || Digit.ULBService.getCurrentTenantId();

  const [showToast, setShowToast] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const mdms_context_path =
    window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";

  // Fetch campaign data for start/end dates
  const { data: campaignData } = Digit.Hooks.useCustomAPIHook({
    url: `/project-factory/v1/project-type/search`,
    body: {
      CampaignDetails: {
        tenantId: tenantId,
        campaignNumber: campaignNumber,
      },
    },
    config: {
      enabled: !!campaignNumber,
      select: (data) => data?.CampaignDetails?.[0],
    },
  });

  const schemaCode = "custom-reports.project-type-reports";
  const {
    isLoading: isReportsLoading,
    data: mdmsData,
  } = Digit.Hooks.useCustomAPIHook(
    Digit.Utils.campaign.getMDMSV2Criteria(
      tenantId,
      schemaCode,
      {},
      `MDMSDATA-${schemaCode}`,
      {
        enabled: true,
      },
    ),
  );

  // Fetch existing report configs only in edit mode
  const isEditMode = searchParams.get("edit") === "true";
  const { isLoading: isExistingConfigLoading, data: existingConfigs } = Digit.Hooks.useCustomAPIHook({
    url: `/${mdms_context_path}/v2/_search`,
    body: {
      MdmsCriteria: {
        tenantId: tenantId,
        schemaCode: "airflow-configs.campaign-report-config",
        isActive: true,
        limit: 1000,
        filters: {
          campaignIdentifier: campaignNumber,
        },
      },
    },
    config: {
      enabled: !!campaignNumber && isEditMode,
      select: (data) => data?.mdms,
    },
  });

  const [currentStep, setCurrentStep] = useState(STEP_SELECTION);
  const [selectedReports, setSelectedReports] = useState({});
  const [frequencyConfig, setFrequencyConfig] = useState({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Pre-populate selected reports and frequency config from existing data (edit mode only)
  useEffect(() => {
    if (!isEditMode || isInitialized || !existingConfigs || existingConfigs.length === 0) return;

    const reports = {};
    const freqConfig = {};

    existingConfigs.forEach((item) => {
      const reportName = item?.data?.reportName;
      const freq = item?.data?.triggerFrequency;
      if (!reportName || !freq) return;

      reports[reportName] = true;

      if (!freqConfig[reportName]) {
        freqConfig[reportName] = { frequencies: [], customStartDate: "", customEndDate: "" };
      }

      if (!freqConfig[reportName].frequencies.includes(freq)) {
        freqConfig[reportName].frequencies.push(freq);
      }

      // TODO: Uncomment when CUSTOM frequency is re-enabled
      // If custom frequency, populate the date range
      // Convert MDMS format "DD-MM-YYYY HH:MM:SS+TZ" to "YYYY-MM-DD" for date input
      // if (freq === "CUSTOM" && item?.data?.customReportStartTime) {
      //   const mdmsToInputDate = (mdmsDate) => {
      //     if (!mdmsDate) return "";
      //     const datePart = mdmsDate.split(" ")?.[0];
      //     const parts = datePart?.split("-");
      //     if (parts?.length !== 3) return "";
      //     return `${parts[2]}-${parts[1]}-${parts[0]}`;
      //   };
      //   freqConfig[reportName].customStartDate = mdmsToInputDate(item.data.customReportStartTime);
      //   freqConfig[reportName].customEndDate = mdmsToInputDate(item.data.customReportEndTime);
      // }
    });

    setSelectedReports(reports);
    setFrequencyConfig(freqConfig);
    setIsInitialized(true);
  }, [existingConfigs, isInitialized]);

  // Find the MDMS entry matching the current campaign's projectType
  const projectTypeConfig = useMemo(() => {
    if (!mdmsData) return null;
    return mdmsData.find((item) => item?.data?.projectType === projectType);
  }, [mdmsData, projectType]);

  // Build available reports from reportsVsFrequency keys
  const applicableReports = useMemo(() => {
    const reportsVsFrequency =
      projectTypeConfig?.data?.reportsVsFrequency || {};
    return Object.keys(reportsVsFrequency).map((key) => ({
      code: key,
      label: `HCM_${key.toUpperCase()}`,
      allowedFrequencies: reportsVsFrequency[key]?.frequency || [],
      isApplicable: true,
    }));
  }, [projectTypeConfig]);

  // Get allowed frequency options for a specific report
  const getFrequencyOptionsForReport = useCallback(
    (reportCode) => {
      const report = applicableReports.find((r) => r.code === reportCode);
      if (!report?.allowedFrequencies?.length) return ALL_FREQUENCY_OPTIONS;
      return ALL_FREQUENCY_OPTIONS.filter((opt) =>
        report.allowedFrequencies.includes(opt.code),
      );
    },
    [applicableReports],
  );

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

  const handleFrequencyChange = useCallback((reportCode, selectedValues) => {
    const frequencies =
      selectedValues?.map((item) => item?.[1]?.code).filter(Boolean) || [];
    setFrequencyConfig((prev) => ({
      ...prev,
      [reportCode]: {
        ...prev[reportCode],
        frequencies,
      },
    }));
  }, []);

  // TODO: Uncomment when CUSTOM frequency is re-enabled
  // const handleCustomDateChange = useCallback((reportCode, field, value) => {
  //   const isValidDate = value && !isNaN(new Date(value).getTime());
  //   setFrequencyConfig((prev) => ({
  //     ...prev,
  //     [reportCode]: {
  //       ...prev[reportCode],
  //       [field]: isValidDate ? value : null,
  //     },
  //   }));
  // }, []);

  const getSelectedFrequencies = useCallback(
    (reportCode) => {
      return frequencyConfig[reportCode]?.frequencies || [];
    },
    [frequencyConfig],
  );

  const handleNext = async () => {
    if (currentStep === STEP_SELECTION) {
      // Initialize frequency config for newly selected reports
      const updatedConfig = { ...frequencyConfig };
      Object.keys(selectedReports).forEach((code) => {
        if (selectedReports[code] && !updatedConfig[code]) {
          updatedConfig[code] = {
            frequencies: [],
            // TODO: Uncomment when CUSTOM frequency is re-enabled
            // customStartDate: "",
            // customEndDate: "",
          };
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
      // Validate that all selected reports have at least one frequency
      const reportsWithNoFrequency = Object.keys(selectedReports)
        .filter((code) => selectedReports[code])
        .filter((code) => {
          const freqs = getSelectedFrequencies(code);
          return !freqs || freqs.length === 0;
        });

      if (reportsWithNoFrequency.length > 0) {
        setShowToast({
          key: "error",
          label: t("HCM_REPORTS_SELECT_FREQUENCY_ERROR"),
        });
        return;
      }

      const reportsVsFrequency =
        projectTypeConfig?.data?.reportsVsFrequency || {};
      const createSchemaCode = "airflow-configs.campaign-report-config";

      // Helper to build a payload for a report + frequency
      const buildPayload = (reportCode, freq) => {
        const triggerTime =
          reportsVsFrequency[reportCode]?.triggerTime || "00:45:00+0530";
        const tz = triggerTime.split("+")[1] || getTimezoneOffset(new Date());
        const campaignStartDate = formatEpochToDate(campaignData?.startDate, tz);
        const campaignEndDate = formatEpochToDate(campaignData?.endDate, tz);

        const payload = {
          tenantId: tenantId,
          reportName: reportCode,
          triggerTime: triggerTime,
          reportEndTime: `23:59:59+${tz}`,
          reportStartTime: `00:00:00+${tz}`,
          triggerFrequency: freq,
          campaignStartDate: campaignStartDate,
          campaignEndDate: campaignEndDate,
          campaignIdentifier: campaignNumber,
        };

        // TODO: Uncomment when CUSTOM frequency is re-enabled
        // if (freq === "CUSTOM") {
        //   const customStart = frequencyConfig[reportCode]?.customStartDate;
        //   const customEnd = frequencyConfig[reportCode]?.customEndDate;
        //   payload.customReportStartTime = customStart
        //     ? formatEpochToDate(new Date(customStart).getTime(), tz)
        //     : campaignStartDate;
        //   payload.customReportEndTime = customEnd
        //     ? formatEpochToDate(new Date(customEnd).getTime(), tz)
        //     : campaignEndDate;
        // }

        return payload;
      };

      setIsSaving(true);
      let apiCalls = [];

      if (!isEditMode) {
        // First time — just create all
        Object.keys(selectedReports)
          .filter((code) => selectedReports[code])
          .forEach((reportCode) => {
            const frequencies = getSelectedFrequencies(reportCode);
            frequencies.forEach((freq) => {
              apiCalls.push(
                Digit.CustomService.getResponse({
                  url: `/${mdms_context_path}/v2/_create/${createSchemaCode}`,
                  body: {
                    Mdms: {
                      tenantId: tenantId,
                      schemaCode: createSchemaCode,
                      data: buildPayload(reportCode, freq),
                      isActive: true,
                    },
                  },
                  useCache: false,
                }),
              );
            });
          });
      } else {
        // Edit mode — diff against existing configs
        const existingConfigMap = {};
        existingConfigs.forEach((item) => {
          const key = `${item?.data?.reportName}|${item?.data?.triggerFrequency}`;
          existingConfigMap[key] = item;
        });

        const newSelectionSet = new Set();
        Object.keys(selectedReports)
          .filter((code) => selectedReports[code])
          .forEach((reportCode) => {
            const frequencies = getSelectedFrequencies(reportCode);
            frequencies.forEach((freq) => {
              const key = `${reportCode}|${freq}`;
              newSelectionSet.add(key);

              // Create only if not already existing
              if (!existingConfigMap[key]) {
                apiCalls.push(
                  Digit.CustomService.getResponse({
                    url: `/${mdms_context_path}/v2/_create/${createSchemaCode}`,
                    body: {
                      Mdms: {
                        tenantId: tenantId,
                        schemaCode: createSchemaCode,
                        data: buildPayload(reportCode, freq),
                        isActive: true,
                      },
                    },
                    useCache: false,
                  }),
                );
              }
            });
          });

        // Deactivate removed configs
        Object.entries(existingConfigMap).forEach(([key, item]) => {
          if (!newSelectionSet.has(key)) {
            apiCalls.push(
              Digit.CustomService.getResponse({
                url: `/${mdms_context_path}/v2/_update/${createSchemaCode}`,
                body: {
                  Mdms: {
                    ...item,
                    isActive: false,
                  },
                },
                useCache: false,
              }),
            );
          }
        });
      }

      if (apiCalls.length === 0) {
        setIsSaving(false);
        setShowToast({
          key: "success",
          label: t("HCM_REPORTS_CONFIG_NO_CHANGES"),
        });
        setTimeout(() => {
          navigate(
            `/${window.contextPath}/employee/campaign/view-details?campaignNumber=${campaignNumber}&tenantId=${tenantId}`,
          );
        }, 1500);
        return;
      }

      const results = await Promise.allSettled(apiCalls);

      const total = results.length;
      const failed = results.filter((r) => r.status === "rejected").length;
      const succeeded = total - failed;
      setIsSaving(false);

      if (failed === 0) {
        setShowToast({
          key: "success",
          label: t("HCM_REPORTS_CONFIG_SAVED_SUCCESS"),
        });
        setTimeout(() => {
          navigate(
            `/${window.contextPath}/employee/campaign/view-details?campaignNumber=${campaignNumber}&tenantId=${tenantId}`,
          );
        }, 1500);
      } else if (succeeded === 0) {
        setShowToast({
          key: "error",
          label: `${t("HCM_REPORTS_CONFIG_SAVED_ERROR")} (${failed}/${total} ${t("HCM_FAILED")})`,
        });
      } else {
        setShowToast({
          key: "warning",
          label: `${succeeded}/${total} ${t("HCM_REPORTS_CONFIG_PARTIAL_SUCCESS")} (${failed} ${t("HCM_FAILED")})`,
        });
      }
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

  if (isReportsLoading || (isEditMode && isExistingConfigLoading)) return <Loader />;

  return (
    <div className="reports-configuration">
      {currentStep === STEP_SELECTION && (
        <Card>
          <HeaderComponent className="reports-configuration__heading">
            {t("HCM_REPORTS_SELECTION")}
          </HeaderComponent>
          <p className="reports-configuration__description">
            {t("HCM_REPORTS_SELECTION_DESC")}
          </p>

          <div className="reports-configuration__count">
            {t("HCM_REPORTS_AVAILABLE_REPORTS")} ({selectedCount}{" "}
            {t("HCM_REPORT_SELECTED_LABEL")})
          </div>

          <div className="reports-configuration__grid">
            {applicableReports.map((report) => (
              <div
                key={report.code}
                className={`reports-configuration__checkbox-item ${
                  !report.isApplicable
                    ? "reports-configuration__checkbox-item--disabled"
                    : ""
                }`}
              >
                <CheckBox
                  label={t(report.label)}
                  checked={!!selectedReports[report.code]}
                  onChange={() =>
                    handleCheckboxChange(report.code, report.isApplicable)
                  }
                  disabled={!report.isApplicable}
                />
                {!report.isApplicable && (
                  <span className="reports-configuration__not-applicable">
                    {t("HCM_REPORT_NOT_APPLICABLE")}
                  </span>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {currentStep === STEP_FREQUENCY && (
        <Card>
          <HeaderComponent className="reports-configuration__heading">
            {t("HCM_REPORTS_CONFIGURE_FREQUENCY")}
          </HeaderComponent>
          <p className="reports-configuration__description">
            {t("HCM_REPORTS_CONFIGURE_FREQUENCY_DESC")}
          </p>

          <div className="reports-configuration__count">
            {t("HCM_REPORTS_CONFIGURE_FREQUENCY_COUNT")} ({selectedCount}{" "}
            {t("HCM_REPORTS_SELECTED_SUFFIX")})
          </div>

          <Card
            className="reports-configuration__frequency-card"
            type="secondary"
          >
            {selectedReportsList.map((report, index) => {
              const selectedFrequencies = getSelectedFrequencies(report.code);
              // TODO: Uncomment when CUSTOM frequency is re-enabled
              // const hasCustom = selectedFrequencies.includes("CUSTOM");
              const frequencyOptions = getFrequencyOptionsForReport(
                report.code,
              );

              return (
                <div
                  key={report.code}
                  className={`reports-configuration__frequency-row ${
                    index < selectedReportsList.length - 1
                      ? "reports-configuration__frequency-row--bordered"
                      : ""
                  }`}
                >
                  <div className="reports-configuration__frequency-row-label">
                    {t(report.label)}
                  </div>
                  <div className="reports-configuration__frequency-row-controls">
                    <LabelFieldPair
                      removeMargin={true}
                      vertical={true}
                      className={`digit-formcomposer-fieldpair`}
                    >
                      <HeaderComponent className={`label`} styles={{width:"100%"}}>
                        <div className={`label-container`}>
                          <label className={`label-styles`}>
                            {t("HCM_SELECT_FREQUENCIES")}
                          </label>
                        </div>
                      </HeaderComponent>
                      <div className="digit-field">
                        <MultiSelectDropdown
                          props={{ className: "reports-frequency-dropdown" }}
                          t={t}
                          options={frequencyOptions}
                          optionsKey="label"
                          selected={frequencyOptions.filter((o) =>
                            selectedFrequencies.includes(o.code),
                          )}
                          onSelect={(value) =>
                            handleFrequencyChange(report.code, value)
                          }
                          style={{ minWidth: "25rem" }}
                          disablePortal={true}
                          config={{ isDropdownWithChip: false }}
                        />
                      </div>
                    </LabelFieldPair>

                    {/* TODO: Uncomment when CUSTOM frequency is re-enabled
                    {hasCustom && (
                      <div className="reports-configuration__custom-dates">
                        <FieldV1
                          withoutLabel={false}
                          label={t("HCM_CUSTOM_START_DATE")}
                          type="date"
                          value={frequencyConfig[report.code]?.customStartDate || null}
                          populators={{
                            newDateFormat: true,
                            min: campaignData?.startDate ? Digit.Utils.date.getDate(campaignData.startDate) : undefined,
                            max: campaignData?.endDate ? Digit.Utils.date.getDate(campaignData.endDate) : undefined,
                          }}
                          onChange={(d) => handleCustomDateChange(report.code, "customStartDate", d)}
                        />
                        <FieldV1
                          withoutLabel={false}
                          label={t("HCM_CUSTOM_END_DATE")}
                          type="date"
                          value={frequencyConfig[report.code]?.customEndDate || null}
                          populators={{
                            newDateFormat: true,
                            min: frequencyConfig[report.code]?.customStartDate || (campaignData?.startDate ? Digit.Utils.date.getDate(campaignData.startDate) : undefined),
                            max: campaignData?.endDate ? Digit.Utils.date.getDate(campaignData.endDate) : undefined,
                          }}
                          onChange={(d) => handleCustomDateChange(report.code, "customEndDate", d)}
                        />
                      </div>
                    )}
                    */}
                  </div>
                </div>
              );
            })}
          </Card>
        </Card>
      )}

      <Footer
        actionFields={[
          <Button
            key="back"
            label={t("HCM_BACK")}
            onClick={handleBack}
            variation="secondary"
            icon="ArrowBack"
            style={{
              marginLeft: "3rem",
              minWidth: "12.5rem",
            }}
          />,
          <Button
            key="next"
            label={
              currentStep === STEP_FREQUENCY
                ? t("HCM_SAVE_CONFIGURATION")
                : t("HCM_NEXT")
            }
            onClick={handleNext}
            variation="primary"
            icon={
              currentStep === STEP_FREQUENCY ? "CheckCircle" : "ArrowForward"
            }
            isDisabled={selectedCount === 0 || isSaving}
            style={{
              minWidth: "12.5rem",
            }}
          />,
        ]}
        maxActionFieldsAllowed={5}
      />
      {showToast && (
        <Toast
          type={showToast.key === "error" ? "error" : "success"}
          label={showToast.label}
          onClose={() => setShowToast(null)}
        />
      )}
    </div>
  );
};

export default ReportsConfiguration;
