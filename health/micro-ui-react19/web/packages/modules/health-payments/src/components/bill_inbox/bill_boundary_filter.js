import React, { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { CheckBox, SubmitBar, Loader, Dropdown } from "@egovernments/digit-ui-components";
import BoundaryComponent from "../BoundaryComponent";
import { Card, SVG, Toast } from "@egovernments/digit-ui-components";
import { PaymentSetUpService } from "../../services/payment_setup/PaymentSetupServices";
import { getValidPeriods,formatDate } from "../../utils/time_conversion";

/**
 * BillBoundaryFilter component allows users to filter boundaries
 * based on the selected project and level.
 *
 * @param {boolean} isRequired - Whether the filter is required.
 * @param {object} selectedProject - The currently selected project.
 * @param {object} selectedLevel - The currently selected boundary level.
 * @param {function} onFilterChange - Callback when a filter is applied.
 * @param {function} resetBoundaryFilter - Function to reset boundary filters.
 */
const BillBoundaryFilter = ({ isRequired, selectedProject, selectedLevel, onFilterChange, resetBoundaryFilter }) => {
  const { t } = useTranslation();
  const tenantId = Digit?.ULBService?.getCurrentTenantId();

  // State variables
  const [boundary, setBoundary] = useState(() => Digit.SessionStorage.get("boundary") || null);
  const [showToast, setShowToast] = useState(null);
  const [boundaryKey, setBoundaryKey] = useState(0);
  const [resetFilters, setResetFilters] = useState(false);

  // Billing period state
  const [periods, setPeriods] = useState(() => Digit.SessionStorage.get("projectPeriods") || []);
  const [selectedPeriod, setSelectedPeriod] = useState(() => Digit.SessionStorage.get("selectedPeriod") || null);
  const [loadingPeriods, setLoadingPeriods] = useState(false);
  const [billingConfigData, setBillingConfigData] = useState(null);

  /**
   * Applies the selected boundary filter.
   * Displays a toast if the boundary is not properly selected.
   */
  const handleApplyFilter = () => {
    //Clear the toast if the input is valid
    setShowToast(null);
    if (!boundary || boundary?.boundaryType !== selectedLevel?.code) {
      setShowToast({ key: "error", label: t("HCM_AM_SELECT_BOUNDARY_TILL_LAST_LEVEL"), transitionTime: 3000 });
      return;
    }

    if (periods.length > 0) {
      onFilterChange(boundary.code,"",selectedPeriod);
    } else {
      setShowToast({ key: "error", label: t("HCM_AM_ATTENDANCE_PAYMENT_PERIOD_FAILED"), transitionTime: 3000 });
      return;
    }
  };

  // Updates the boundary when changed in the BoundaryComponent.
  const onBoundaryChange = (boundary) => {
    if (boundary) {
      setBoundary(boundary);
      Digit.SessionStorage.set("boundary", boundary);
    } else {
      setBoundary(null);
      Digit.SessionStorage.set("boundary", null);
    }
  };

  // Clears all applied filters and resets the component state.
  const handleClearFilter = () => {
    setSelectedPeriod(null);
    setResetFilters(true);
    setBoundary(""); // Clear the boundary value
    setBoundaryKey((prevKey) => prevKey + 1); // Increment the key to re-render BoundaryComponent
    Digit.SessionStorage.set("boundary", null);
    Digit.SessionStorage.set("selectedBoundaryCode", null);
    Digit.SessionStorage.set("selectedValues", null);
    resetBoundaryFilter();
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
          const periodOptions = response.periods
            .sort((a, b) => a.periodNumber - b.periodNumber)
            .map((period, index) => ({
              code: period.id,
              name: `Period ${index + 1} (${formatDate(period.periodStartDate)} - ${formatDate(period.periodEndDate)})`,
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

          const sPeriod = Digit.SessionStorage.get("selectedPeriod", currentPeriod);

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
          Digit.SessionStorage.del("projectPeriods");
          setSelectedPeriod(null);
          setBillingConfigData(null);
        }
      } catch (error) {
        console.error("Error fetching billing periods:", error);
        setPeriods([]);
        Digit.SessionStorage.del("projectPeriods");
        setSelectedPeriod(null);
        setBillingConfigData(null);
      } finally {
        setLoadingPeriods(false);
      }
    },
    [tenantId, selectedProject]
  );

  // Fetch periods when project is selected
  useEffect(() => {
    if (periods.length == 0) {
      if (selectedProject?.referenceID || selectedProject?.id) {
        fetchBillingPeriods(selectedProject.referenceID || selectedProject.id);
      }
    }
  }, [selectedProject, fetchBillingPeriods]);

  // Handle period selection manually
  const handlePeriodSelect = (period) => {
    setSelectedPeriod(period);
    Digit.SessionStorage.set("selectedPeriod", period);
  };

  return (
    <Card
      className="inbox-search-links-container"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div
        style={{
          flexGrow: 1, // Ensures this section grows to take available space
          overflowY: "auto", // Enables scrolling if content exceeds available space
        }}
      >
        <div
          onClick={handleClearFilter}
          style={{
            cursor: "pointer",
            alignItems: "center",
            gap: ".75rem",
            marginBottom: "24px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <SVG.FilterAlt width={"32px"} height={"32px"} fill={"#C84C0E"} />
            <span className="custom-inbox-filter-heading">{t("HCM_AM_FILTER")}</span>
          </div>

          <span onClick={() => {}} style={{ border: "1px solid #E0E0E0", padding: "6px", marginBottom: "10px" }}>
            <SVG.AutoRenew width={"24px"} height={"24px"} fill={"#c84c0e"} />
          </span>
        </div>
        {selectedProject?.address?.boundary && selectedLevel && (
          <BoundaryComponent
            key={boundaryKey} // Add the key to force re-render
            isRequired={isRequired}
            reset={resetFilters}
            makeReset={() => {
              setResetFilters(false);
            }}
            initialValue={Digit.SessionStorage.get("selectedValues")}
            updateSessionStorage={(newSelectedValues) => {
              Digit.SessionStorage.set("selectedValues", newSelectedValues);
            }}
            onChange={onBoundaryChange}
            selectedProject={selectedProject}
            lowestLevel={selectedLevel.code}
          >
            disableChildOptions={true}
          </BoundaryComponent>
        )}

        {/* Billing Period Dropdown */}
        {selectedProject && (
          <div style={{ width: "100%", marginTop: "1.5rem" }}>
            <div className="comment-label">
              {t("HCM_AM_BILL_PERIOD_DATE")}
              <span className="required comment-label"> *</span>
            </div>

            {
              loadingPeriods ? (
                <div style={{ padding: "1rem", textAlign: "center" }}>
                  <Loader />
                </div>
              ) : (
                // periods.length > 0 ?
                <Dropdown
                  showToolTip={true}
                  style={{ width: "100%" }}
                  t={t}
                  option={periods.length > 0 ? getValidPeriods(t, periods, true) : []}
                  optionKey="name"
                  selected={selectedPeriod}
                  select={handlePeriodSelect}
                />
              )
              //  : (
              //   <div style={{ padding: "0.5rem", color: "#666", fontSize: "14px" }}>{t("")}</div>
              // )
            }
          </div>
        )}
      </div>
      <div
        style={{
          justifyContent: "center",
          marginTop: "auto", // Pushes this section to the bottom
          paddingTop: "16px", // Adds spacing above the button
        }}
      >
        {selectedProject?.address?.boundary && selectedLevel && (
          <SubmitBar onSubmit={handleApplyFilter} className="w-fullwidth" label={t("HCM_AM_COMMON_APPLY")} />
        )}
        {showToast && <Toast style={{ zIndex: 10001 }} label={showToast.label} type={showToast.key} onClose={() => setShowToast(null)} />}
      </div>
    </Card>
  );
};
export default BillBoundaryFilter;
