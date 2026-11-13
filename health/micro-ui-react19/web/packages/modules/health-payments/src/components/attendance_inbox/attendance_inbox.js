import React, { useEffect, useState, useMemo, useRef} from "react";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import CustomFilter from "./filter_section";
import CustomInboxTable from "./table_inbox";
import { Toast, Card, Loader } from "@egovernments/digit-ui-components";
import { defaultRowsPerPage, ScreenTypeEnum, StatusEnum } from "../../utils/constants";
import SearchResultsPlaceholder from "../SearchResultsPlaceholder";
import { renderProjectPeriod } from "../../utils/time_conversion";
import { I18N_KEYS } from "../../utils/i18nKeyConstants";
import { useMyContext } from "../../utils/context";

/**
 * AttendanceInboxComponent: Displays a filterable and paginated inbox for attendance records.
 * It fetches data based on user interactions and selected criteria.
 */
const AttendanceInboxComponent = ({ fromBill = false }) => {
  const { t } = useTranslation();
  const latestRequestRef = useRef(0);

  // Invalidate pending requests when the component unmounts
  useEffect(() => {
    return () => {
      latestRequestRef.current += 1;
    };
  }, []);
  const { hierarchyType } = useMyContext();
  const stateCode = Digit.ULBService.getStateId();
  const language = Digit.StoreData.getCurrentLanguage();
  const boundaryModuleCode = useMemo(
    () => (hierarchyType ? [`boundary-${hierarchyType}`] : []),
    [hierarchyType]
  );
  const { isLoading: isBoundaryLocLoading } = Digit.Services.useStore({
    stateCode,
    moduleCode: boundaryModuleCode,
    language,
    modulePrefix: "hcm",
    enabled: boundaryModuleCode.length > 0,
  });

  // Context path for the attendance service
  const attendanceContextPath = window?.globalConfigs?.getConfig("ATTENDANCE_CONTEXT_PATH") || "health-attendance";

  // State variables for managing filters, pagination, and data
  const [showToast, setShowToast] = useState(null);
  const [filterCriteria, setFilterCriteria] = useState(null);
  const [selectedProject, setSelectedProject] = useState(() => Digit.SessionStorage.get("selectedProject") || {});
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [selectedStatus, setSelectedStatus] = useState(fromBill ? StatusEnum.APPROVED : StatusEnum.PENDING_FOR_APPROVAL);
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
  const triggerAttendanceSearch = async (
    filterData,
    status,
    pageSize = rowsPerPage,
    page = currentPage,
    userAssignedProject,
  ) => {
    const requestId = ++latestRequestRef.current;

    try {
      setChildrenDataLoading(true);

      const latestPeriod = Digit.SessionStorage.get("selectedPeriod");
      const periodId = latestPeriod?.id;

      setMarkPeriod(latestPeriod);

      // Normalize pagination values
      const effectivePageSize = Math.max(
        1,
        Number(pageSize) || defaultRowsPerPage,
      );
      const effectivePage = Math.max(1, Number(page) || 1);

      // Calculate zero-based offset
      const offset = (effectivePage - 1) * effectivePageSize;

      const params = {
        tenantId: Digit.ULBService.getStateId(),
        limit: effectivePageSize,
        offset,
        referenceId:
          (userAssignedProject?.id === undefined
            ? Digit.SessionStorage.get("paymentInbox")?.selectedProject?.id
            : selectedProject?.id) || selectedProject?.id,
        localityCode:
          filterData?.code == null
            ? filterCriteria?.code == null
              ? Digit.SessionStorage.get("paymentInbox")?.code
              : filterCriteria?.code
            : filterData?.code,
        registerPeriodStatus: status ?? selectedStatus,
        isChildrenRequired: true,
        billingPeriodId: periodId,
      };

      if (!fromBill) {
        params.staffId = Digit.SessionStorage.get("UserIndividual")?.[0]?.id;
      }
      const response = await fetchRegisters.mutateAsync({
        params,
      });

      // Ignore responses from older requests
      if (requestId !== latestRequestRef.current) {
        return;
      }

      const attendanceRegisters = Array.isArray(response?.attendanceRegister)
        ? response.attendanceRegister
        : [];

      const rowData = attendanceRegisters.map((item) => ({
        id: item?.registerNumber,
        registerId: item?.id,
        name: selectedProject?.name,
        boundary: item?.localityCode,
        boundaryType: item?.additionalDetails?.boundaryType,
        status: item?.attendees?.length || 0,
        markby: item?.staff?.[0]?.additionalDetails?.ownerName || "NA",
        approvedBy: item?.staff?.[0]?.additionalDetails?.staffName || "NA",
      }));

      setCard(true);

      setchildrenData({
        data: rowData,
        totalCount: response?.totalCount ?? 0,
        statusCount: response?.statusCount,
      });
    } catch (error) {
      // Ignore errors from older requests
      if (requestId !== latestRequestRef.current) {
        return;
      }

      setCard(true);

      setShowToast({
        key: "error",
        label: t(I18N_KEYS.COMMON.HCM_AM_ATTENDANCE_REGISTER_FETCH_FAILED),
        transitionTime: 3000,
      });
    } finally {
      // Only the latest request can update loading state
      if (requestId === latestRequestRef.current) {
        setChildrenDataLoading(false);
      }
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

      setShowToast({ key: "error", label: t(I18N_KEYS.COMPONENTS_ATTENDANCE.HCM_AM_ATTENDANCE_PERIOD_SELECT), transitionTime: 3000 });
      return;
    }

    const existingPaymentInbox = Digit.SessionStorage.get("paymentInbox");

    const isEmptyObject = (obj) => !obj || Object.keys(obj).length === 0;

    // Validation 1: Check if both `selectedProject` and `existingPaymentInbox.selectedProject` are empty
    if (isEmptyObject(selectedProject) && isEmptyObject(existingPaymentInbox?.selectedProject)) {
      setShowToast({ key: "error", label: t(I18N_KEYS.COMPONENTS_ATTENDANCE.HCM_AM_ATTENDANCE_PROJECT_SELECT), transitionTime: 3000 });
      return;
    }

    // Validation 2: Check if `newFilter` is null or undefined
    if ((!newFilter || isEmptyObject(newFilter)) && !existingPaymentInbox?.boundaryType) {
      setShowToast({ key: "error", label: t(I18N_KEYS.COMPONENTS_ATTENDANCE.HCM_AM_ATTENDANCE_BOUNDARY_SELECT), transitionTime: 3000 });
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
    setCurrentPage(1);
    triggerAttendanceSearch(newFilter, selectedStatus, rowsPerPage, 1);
  };

  const handlePaginationChange = (page) => {
    setCurrentPage(page);

    triggerAttendanceSearch(
      filterCriteria,
      selectedStatus,
      rowsPerPage,
      page
    );
  };

  const handleRowsPerPageChange = (newPerPage, page) => {
    const nextPageSize = Number(newPerPage) || defaultRowsPerPage;
    const nextPage = Math.max(1, Number(page) || 1);

    setRowsPerPage(nextPageSize);
    setCurrentPage(nextPage);

    triggerAttendanceSearch(
      filterCriteria,
      selectedStatus,
      nextPageSize,
      nextPage
    );
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

  if (isBoundaryLocLoading) {
    return <Loader variant={"PageLoader"} className={"digit-center-loader"} />;
  }

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
            <div className="inner-table-section" style={{ height: "60vh" }}>
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
                  currentPage={currentPage}
                  rowsPerPage={rowsPerPage}
                  customHandleRowsPerPageChange={handleRowsPerPageChange}
                  customHandlePaginationChange={handlePaginationChange}
                  isLoading={childrenDataLoading}
                  tableData={childrenData?.data}
                  totalCount={childrenData?.totalCount}
                  selectedProject={selectedProject}
                  selectedPeriod={markPeriod}
                  fromBill={fromBill}
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
