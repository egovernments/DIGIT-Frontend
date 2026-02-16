import React, { useEffect, useState } from "react";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import CustomFilter from "./filter_section";
import CustomInboxTable from "./table_inbox";
import { Toast, Card } from "@egovernments/digit-ui-components";
import { defaultRowsPerPage, ScreenTypeEnum, StatusEnum } from "../../utils/constants";
import SearchResultsPlaceholder from "../SearchResultsPlaceholder";
import { renderProjectPeriod } from "../../utils/time_conversion";

/**
 * AttendanceInboxComponent: Displays a filterable and paginated inbox for attendance records.
 * It fetches data based on user interactions and selected criteria.
 */
const AttendanceInboxComponent = () => {
  const { t } = useTranslation();

  // Context path for the attendance service
  const attendanceContextPath = window?.globalConfigs?.getConfig("ATTENDANCE_CONTEXT_PATH") || "health-attendance";

  // State variables for managing filters, pagination, and data
  const [showToast, setShowToast] = useState(null);
  const [filterCriteria, setFilterCriteria] = useState(null);
  const [selectedProject, setSelectedProject] = useState(() => Digit.SessionStorage.get("selectedProject") || {});
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [selectedStatus, setSelectedStatus] = useState(StatusEnum.PENDING_FOR_APPROVAL);
  const [card, setCard] = useState(false);
  const [childrenDataLoading, setChildrenDataLoading] = useState(false);
  const [childrenData, setchildrenData] = useState([]);

  // State for selected period (for display purposes only)
  const [markPeriod, setMarkPeriod] = useState(() => Digit.SessionStorage.get("selectedPeriod") || null);

  // API hook for fetching attendance registers
  const fetchRegisters = Digit.Hooks.useCustomAPIMutationHook({
    url: `/${attendanceContextPath}/v1/_search`,
  });

  /**
   * Triggers the API call to fetch attendance registers based on the provided filter criteria,
   * selected project, and status. Updates the state variables accordingly.
   *
   * @param {object} filterData - Filter criteria for attendance registers
   * @param {string} status - Status of attendance registers (e.g. PENDING_FOR_APPROVAL)
   * @param {number} totalRows - Total number of rows to fetch
   * @param {number} totalNext - Offset for pagination
   * @param {object} selectedProject - Selected project object
   */
  const triggerAttendanceSearch = (filterData, status, totalRows, totalNext, userAssignedProject) => {
    try {
      setChildrenDataLoading(true);

      // FIX: Always get the latest period from session storage when function is called
      const latestPeriod = Digit.SessionStorage.get("selectedPeriod");
      const periodId = latestPeriod?.id;

      // Update display state with latest period
      setMarkPeriod(latestPeriod);

      fetchRegisters.mutateAsync(
        {
          params: {
            tenantId: Digit.ULBService.getStateId(),
            limit: totalRows || rowsPerPage,
            offset: totalNext == undefined ? (currentPage - 1) * rowsPerPage : (totalNext - 1) * totalRows,
            referenceId:
              (userAssignedProject?.id == undefined ? Digit.SessionStorage.get("paymentInbox").selectedProject?.id : selectedProject?.id) ||
              selectedProject?.id,
            staffId: Digit.SessionStorage.get("UserIndividual")?.[0]?.id,
            localityCode:
              filterData?.code == undefined || filterData?.code == null
                ? filterCriteria?.code == undefined || filterCriteria?.code == null
                  ? Digit.SessionStorage.get("paymentInbox").code
                  : filterCriteria?.code
                : filterData?.code,
            // reviewStatus: status == undefined ? selectedStatus : status,
            registerPeriodStatus: status == undefined ? selectedStatus : status,
            isChildrenRequired: true,
            billingPeriodId: periodId, // Use the latest period ID
          },
        },
        {
          /**
           * Success callback function
           * @param {object} data - Response data from API
           */
          onSuccess: (data) => {
            const rowData =
              data?.attendanceRegister.length > 0
                ? data?.attendanceRegister?.map((item, index) => {
                  return {
                    id: item?.registerNumber,
                    registerId: item?.id,
                    name: selectedProject?.name,
                    boundary: item?.localityCode,
                    boundaryType: item?.additionalDetails?.boundaryType,
                    status: item?.attendees == null ? 0 : item?.attendees.length || 0,
                    markby: item?.staff?.[0].additionalDetails?.ownerName || "NA",
                    approvedBy: item?.staff?.[0].additionalDetails?.staffName || "NA",
                  };
                })
                : [];
            setChildrenDataLoading(false);
            setCard(true);
            setchildrenData({
              data: rowData,
              totalCount: data?.totalCount,
              statusCount: data?.statusCount,
            });
          },
          /**
           * Error callback function
           * @param {object} error - Error object
           */
          onError: (error) => {
            setCard(true);
            setChildrenDataLoading(false);
            setShowToast({ key: "error", label: t("HCM_AM_ATTENDANCE_REGISTER_FETCH_FAILED"), transitionTime: 3000 });
          },
        }
      );
    } catch (error) {
      setShowToast({ key: "error", label: t("HCM_AM_ATTENDANCE_REGISTER_FETCH_FAILED"), transitionTime: 3000 });
    }
  };

  // Trigger initial data fetch when the component is mounted
  useEffect(() => {
    const data = Digit.SessionStorage.get("paymentInbox");
    const selectedArea = Digit.SessionStorage.get("selectedValues");

    const selectedPeriod = Digit.SessionStorage.get("selectedPeriod");

    if (data && selectedPeriod) {

      triggerAttendanceSearch(data);
    } else if (selectedArea) {
      const pp = Object.values(selectedArea).find((v) => v !== null);
      if (pp && selectedPeriod) {

        triggerAttendanceSearch(pp?.code);
      }
    }
  }, []);

  // useEffect(() => {
  //   let intervalId = null;

  //   const tryFetch = () => {
  //     const data = Digit.SessionStorage.get("paymentInbox");
  //     const selectedArea = Digit.SessionStorage.get("selectedValues");
  //     const selectedPeriod = Digit.SessionStorage.get("selectedPeriod");

  //     if (selectedPeriod && (data || selectedArea)) {
  //       if (data) {
  //         triggerAttendanceSearch(data);
  //       } else if (selectedArea) {
  //         const pp = Object.values(selectedArea).find((v) => v !== null);
  //         if (pp) {
  //           triggerAttendanceSearch(pp);
  //         }
  //       }

  //       //  Stop polling once data is available
  //       clearInterval(intervalId);
  //     }
  //   };

  //   // Try immediately
  //   tryFetch();

  //   // Retry every 300ms until value arrives
  //   intervalId = setInterval(tryFetch, 300);

  //   return () => clearInterval(intervalId);
  // }, []);

  /// Update filter criteria and fetch new data.
  const handleFilterUpdate = (newFilter, isSelectedData, selectedPeriod) => {
    setFilterCriteria(newFilter);

    // Update period in session storage and state
    if (selectedPeriod) {
      setMarkPeriod(selectedPeriod);
      Digit.SessionStorage.set("selectedPeriod", selectedPeriod);
    } else if (selectedPeriod === null) {
      setMarkPeriod(null);
      Digit.SessionStorage.del("selectedPeriod");

      setShowToast({ key: "error", label: t("HCM_AM_ATTENDANCE_PERIOD_SELECT"), transitionTime: 3000 });
      return;
    }

    const existingPaymentInbox = Digit.SessionStorage.get("paymentInbox");

    const isEmptyObject = (obj) => !obj || Object.keys(obj).length === 0;

    // Validation 1: Check if both `selectedProject` and `existingPaymentInbox.selectedProject` are empty
    if (isEmptyObject(selectedProject) && isEmptyObject(existingPaymentInbox?.selectedProject)) {
      setShowToast({ key: "error", label: t("HCM_AM_ATTENDANCE_PROJECT_SELECT"), transitionTime: 3000 });
      return;
    }

    // Validation 2: Check if `newFilter` is null or undefined
    if ((!newFilter || isEmptyObject(newFilter)) && !existingPaymentInbox?.boundaryType) {
      setShowToast({ key: "error", label: t("HCM_AM_ATTENDANCE_BOUNDARY_SELECT"), transitionTime: 3000 });
      return;
    }

    // Proceed with updating session storage if validations pass
    const existingData = existingPaymentInbox || {};

    // Ensure `selectedProject` is stored if missing
    if (!existingData.selectedProject) {
      existingData.selectedProject = selectedProject;
    }

    // Always update the object with `newFilter` data
    Object.assign(existingData, newFilter);

    // Save the updated object back to SessionStorage
    Digit.SessionStorage.set("paymentInbox", existingData);

    // Trigger search - it will automatically get the latest period from session storage
    triggerAttendanceSearch(newFilter, selectedStatus);
  };

  const handlePaginationChange = (page) => {
    setCurrentPage(page);
    // Will get latest period from session storage when called
    triggerAttendanceSearch(filterCriteria, selectedStatus, rowsPerPage, page);
  };

  const handleRowsPerPageChange = (newPerPage, page) => {
    setRowsPerPage(newPerPage);
    setCurrentPage(page);
    // Will get latest period from session storage when called
    triggerAttendanceSearch(filterCriteria, selectedStatus, newPerPage, page);
  };

  const callServiceOnTap = (status) => {
    if (status.code == StatusEnum.PENDING_FOR_APPROVAL) {
      setRowsPerPage(defaultRowsPerPage);
      setCurrentPage(1);
      setSelectedStatus(StatusEnum.PENDING_FOR_APPROVAL);
      // Will get latest period from session storage when called
      triggerAttendanceSearch(Digit.SessionStorage.get("paymentInbox"), StatusEnum.PENDING_FOR_APPROVAL, defaultRowsPerPage, 1);
    } else {
      setRowsPerPage(defaultRowsPerPage);
      setCurrentPage(1);
      setSelectedStatus(StatusEnum.APPROVED);
      // Will get latest period from session storage when called
      triggerAttendanceSearch(Digit.SessionStorage.get("paymentInbox"), StatusEnum.APPROVED, defaultRowsPerPage, 1);
    }
  };

  // Reset the table and clear filters including period
  const resetTable = () => {
    setSelectedStatus(StatusEnum.PENDING_FOR_APPROVAL);
    setchildrenData([]);
    setFilterCriteria(null);
    setCard(false);
    setMarkPeriod(null);
    Digit.SessionStorage.del("selectedPeriod");
  };

  const projectPeriodLabel = React.useMemo(() => {
    return renderProjectPeriod(t, selectedProject, markPeriod);
  }, [t, selectedProject, markPeriod]);

  return (
    <div>
      <div className="custom-register-inbox-screen">
        <div className="inner-div-row-section">
          <div className="custom-inbox-filter-section">
            <div className="custom-inbox-inner-filter-section" style={{ height: "60vh" }}>
              <CustomFilter resetTable={resetTable} isRequired={ScreenTypeEnum.REGISTER} onFilterChange={handleFilterUpdate}></CustomFilter>
            </div>
          </div>

          <div className="custom-inbox-outer-table-section">
            <div className="inner-table-section" style={{ height: "61vh" }}>
              {card == false ? (
                <Card className="card-overide" style={{ gap: "0.5rem" }}>
                  <div className="summary-sub-heading" style={{ display: "flex", flexDirection: "row", gap: "10px", alignItems: "center" }}>
                    {renderProjectPeriod(t, selectedProject, markPeriod)?.[0] || " "}
                    <div style={{ fontSize: "14px" }}>{renderProjectPeriod(t, selectedProject, markPeriod)?.[1] || ""}</div>
                  </div>
                  <div>{t(`ATTENDANCE_${Digit.SessionStorage.get("selectedProject")?.address?.boundaryType}`)}</div>
                  {<SearchResultsPlaceholder placeholderText={"HCM_AM_FILTER_AND_CHOOSE_BOUNDARY_PLACEHOLDER_TEXT"} />}
                </Card>
              ) : (
                <CustomInboxTable
                  statusCount={childrenData?.statusCount}
                  handleTabChange={callServiceOnTap}
                  rowsPerPage={rowsPerPage}
                  customHandleRowsPerPageChange={handleRowsPerPageChange}
                  customHandlePaginationChange={handlePaginationChange}
                  isLoading={childrenDataLoading}
                  tableData={childrenData?.data}
                  totalCount={childrenData?.totalCount}
                  selectedProject={selectedProject}
                  selectedPeriod={markPeriod}
                ></CustomInboxTable>
              )}
            </div>
          </div>
        </div>
      </div>
      {showToast && (
        <Toast
          style={{ zIndex: 10001 }}
          label={showToast.label}
          type={showToast.key}
          transitionTime={showToast.transitionTime}
          onClose={() => setShowToast(null)}
        />
      )}
    </div>
  );
};

export default AttendanceInboxComponent;
