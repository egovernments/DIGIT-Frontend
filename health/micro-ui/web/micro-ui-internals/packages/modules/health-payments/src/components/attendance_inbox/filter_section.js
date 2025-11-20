import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import BoundaryComponent from "../BoundaryComponent";
import { Card, SVG, SubmitBar, Dropdown, Loader } from "@egovernments/digit-ui-components";
import { lowerBoundaryDefaultSet } from "../../utils/constants";
import { PaymentSetUpService } from "../../services/payment_setup/PaymentSetupServices";
import { getValidPeriods } from "../../utils/time_conversion";

const CustomFilter = ({ resetTable, isRequired, onFilterChange }) => {
  const { t } = useTranslation();
  const tenantId = Digit?.ULBService?.getCurrentTenantId();
  const lowestLevelBoundaryType = Digit.SessionStorage.get("paymentsConfig")?.lowestLevelBoundary || "DISTRICT";

  // State variables
  const [reset, setReset] = useState(false);
  const [boundary, setBoundary] = useState(Digit.SessionStorage.get("selectedBoundary") || "");
  const [project, setProject] = useState([]);
  const [isDistrictSelected, setIsDistrictSelected] = useState(false);
  const [projectSelected, setProjectSelected] = useState(() => Digit.SessionStorage.get("selectedProject") || {});

  // Billing period state
  const [periods, setPeriods] = useState(() => Digit.SessionStorage.get("projectPeriods") || []);
  const [selectedPeriod, setSelectedPeriod] = useState(() => Digit.SessionStorage.get("selectedPeriod") || null);
  const [loadingPeriods, setLoadingPeriods] = useState(false);
  const [billingConfigData, setBillingConfigData] = useState(null);

  const onChangeId = (value) => {
    setBoundary(value);
    Digit.SessionStorage.set("selectedBoundary", value);
    if (value?.boundaryType === lowestLevelBoundaryType) {
      setIsDistrictSelected(true);
    }
  };

  // const hasRun = useRef(false);

  // useEffect(() => {
  //   if (hasRun.current) return;
  //   hasRun.current = true;

  //   const periods = Digit.SessionStorage.get("projectPeriods") || [];

  //   if (periods.length > 0) {
  //     const currentTimestamp = Date.now();
  //     const currentPeriod =
  //       periods.find((p) => currentTimestamp >= p.periodStartDate && currentTimestamp <= p.periodEndDate) ||
  //       periods.find((p) => currentTimestamp < p.periodStartDate);

  //     if (currentPeriod) {
  //       setSelectedPeriod(currentPeriod);
  //       Digit.SessionStorage.set("selectedPeriod", currentPeriod);
  //     }
  //   }
  // }, []);

  // Format date for display
  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Fetch billing config and periods
  const fetchBillingPeriods = useCallback(
    async (projectId) => {
      if (!projectId) {
        setPeriods([]);
        setSelectedPeriod(null);
        return;
      }

      setLoadingPeriods(true);
      try {
        const body = {
          searchCriteria: {
            tenantId: tenantId,
            campaignNumber: projectId,
            includePeriods: true,
          },
        };

        const response = await PaymentSetUpService.billingConfigSearchByProjectId({ body });

        if (response && response.periods && response.periods.length > 0) {
          setBillingConfigData(response.billingConfig);

          // Transform periods into dropdown options
          const periodOptions = response.periods.map((period) => ({
            code: period.id,
            name: `Period ${period.periodNumber} (${formatDate(period.periodStartDate)} - ${formatDate(period.periodEndDate)})`,
            periodNumber: period.periodNumber,
            periodStartDate: period.periodStartDate,
            periodEndDate: period.periodEndDate,
            status: period.status,
            billingFrequency: period.billingFrequency,
            ...period,
          }));

          // Sort by period number
          periodOptions.sort((a, b) => a.periodNumber - b.periodNumber);

          //  Auto-select current or next period
          const currentTimestamp = Date.now();
          const currentPeriod =
            periodOptions.find((p) => currentTimestamp >= p.periodStartDate && currentTimestamp <= p.periodEndDate) ||
            periodOptions.find((p) => currentTimestamp < p.periodStartDate);
          const sPeriod = Digit.SessionStorage.get("selectedPeriod");

          if (sPeriod) {
            setSelectedPeriod(sPeriod);
            Digit.SessionStorage.set("selectedPeriod", sPeriod);
          } else {
            if (currentPeriod) {
              setSelectedPeriod(currentPeriod);
              Digit.SessionStorage.set("selectedPeriod", currentPeriod);
            } else {
              setSelectedPeriod(null);
            }
          }

          setPeriods(periodOptions);
          Digit.SessionStorage.set("projectPeriods", periodOptions);
        } else {
          setPeriods([]);
          setSelectedPeriod(null);
          setBillingConfigData(null);
        }
      } catch (error) {
        console.error("Error fetching billing periods:", error);
        setPeriods([]);
        setSelectedPeriod(null);
        setBillingConfigData(null);
      } finally {
        setLoadingPeriods(false);
      }
    },
    [tenantId, projectSelected]
  );

  // Handle period selection manually
  const handlePeriodSelect = useCallback((period) => {
    setSelectedPeriod(period);
    Digit.SessionStorage.set("selectedPeriod", period);
  }, []);

  const handleApplyFilter = () => {
    onFilterChange(boundary, isDistrictSelected, selectedPeriod);
  };

  // Fetch project data on mount
  useEffect(() => {
    const data = Digit.SessionStorage.get("paymentInbox");
    if (data?.selectedProject) {
      setProjectSelected(data?.selectedProject);
    }
  }, []);

  // Initialize projects from session storage
  useEffect(() => {
    if (project.length === 0) {
      const projectData =
        Digit?.SessionStorage.get("staffProjects") ||
        [].map((target) => ({
          code: target.id,
          projectType: target.projectType,
          name: target.name,
          boundary: target?.address?.boundary,
          boundaryType: target?.address?.boundaryType,
          projectHierarchy: target.projectHierarchy,
        }));
      setProject(projectData);
    }
  }, []);

  // Fetch periods when project is selected
  useEffect(() => {
    if (periods.length == 0) {
      if (projectSelected?.referenceID || projectSelected?.id) {
        fetchBillingPeriods(projectSelected.referenceID || projectSelected.id);
      }
    }
  }, [projectSelected, fetchBillingPeriods]);

  // Handle reset
  useEffect(() => {
    if (reset === true) {
      //setPeriods([]);
      setSelectedPeriod(null);
      setBillingConfigData(null);
      resetTable();
      setReset(false);
    }
  }, [reset, resetTable]);

  return (
    <Card
      className="inbox-search-links-container"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div style={{ flexGrow: 1, overflowY: "auto" }}>
        {/* Header */}
        <div
          style={{
            alignItems: "center",
            gap: ".75rem",
            marginBottom: "24px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <SVG.FilterAlt width={"32px"} height={"32px"} fill={"#c84c0e"} />
            <span className="custom-inbox-filter-heading">{t("HCM_AM_FILTER")}</span>
          </div>

          <span onClick={() => setReset(true)} style={{ border: "1px solid #e0e0e0", padding: "6px", marginBottom: "10px", cursor: "pointer" }}>
            <SVG.AutoRenew width={"24px"} height={"24px"} fill={"#c84c0e"} />
          </span>
        </div>

        {/* Boundary Component */}
        <div className="label-pair">{t(`HCM_AM_CHOOSE_BOUNDARY_DESCRIPTION`)}</div>

        {projectSelected?.address?.boundary && (
          <BoundaryComponent
            reset={reset}
            makeReset={() => setReset(false)}
            isRequired={isRequired}
            initialValue={Digit.SessionStorage.get("selectedValues")}
            updateSessionStorage={(newSelectedValues) => {
              Digit.SessionStorage.set("selectedValues", newSelectedValues);
            }}
            onChange={onChangeId}
            selectedProject={projectSelected}
            lowestLevel={Digit.SessionStorage.get("paymentsConfig")?.lowestLevelBoundary || lowerBoundaryDefaultSet}
          />
        )}

        {/* Billing Period Dropdown */}
        {projectSelected && (
          <div style={{ width: "100%", marginTop: "1.5rem" }}>
            <div className="comment-label">{t("HCM_AM_BILL_PERIOD_DATE")}<span className="required comment-label"> *</span></div>

            {loadingPeriods ? (
              <div style={{ padding: "1rem", textAlign: "center" }}>
                <Loader />
              </div>
            ) : periods.length > 0 ? (
              <Dropdown
                style={{ width: "100%" }}
                t={t}
                option={getValidPeriods(t, periods, false)}
                optionKey="name"
                selected={selectedPeriod}
                select={handlePeriodSelect}
              />
            ) : (
              <div style={{ padding: "0.5rem", color: "#666", fontSize: "14px" }}>{t("No billing periods available for this project")}</div>
            )}
          </div>
        )}

        {/* Display Billing Config Info */}
        {/* {billingConfigData && (
          <div style={{ marginTop: "1rem", padding: "0.5rem", backgroundColor: "#f0f0f0", borderRadius: "4px" }}>
            <div style={{ fontSize: "12px", color: "#666" }}>
              <strong>{t("Billing Frequency")}:</strong> {billingConfigData.billingFrequency}
            </div>
            {billingConfigData.customFrequencyDays && (
              <div style={{ fontSize: "12px", color: "#666", marginTop: "0.25rem" }}>
                <strong>{t("Custom Days")}:</strong> {billingConfigData.customFrequencyDays}
              </div>
            )}
          </div>
        )} */}
      </div>

      {/* Submit Button */}
      <div style={{ justifyContent: "center", marginTop: "auto", paddingTop: "16px" }}>
        <SubmitBar onSubmit={handleApplyFilter} className="w-fullwidth" label={t("HCM_AM_COMMON_APPLY")} disabled={!boundary} />
      </div>
    </Card>
  );
};

export default CustomFilter;
