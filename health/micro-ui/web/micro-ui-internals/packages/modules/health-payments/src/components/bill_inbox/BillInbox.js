import _ from "lodash";
import { useTranslation } from "react-i18next";
import BillBoundaryFilter from "./bill_boundary_filter";
import BillInboxTable from "./billInboxTable";
import { defaultRowsPerPage, ScreenTypeEnum } from "../../utils/constants";
import SearchResultsPlaceholder from "../SearchResultsPlaceholder";
import AlertPopUp from "../alertPopUp";
import InboxSearchLinkHeader from "../InboxSearchLinkHeader";

/**
 * @returns {React.ReactElement} BillInboxComponent
 * @description
 *  This component renders the bill inbox screen with a filter panel and a table.
 *  It fetches the attendance register data for the selected project and boundary.
 *  It also fetches the bill data for the selected project.
 *  It displays the attendance register data in a table and the bill data as a button.
 *  It also handles the bill generation process.
 */
const BillInboxComponent = () => {
  const shouldFetchRef = useRef(false);

  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { state: locationState } = window.location || {};
  const fromViewScreen = locationState?.fromViewScreen || false;

  // context path variables
  const attendanceContextPath = window?.globalConfigs?.getConfig("ATTENDANCE_CONTEXT_PATH") || "health-attendance";
  const expenseContextPath = window?.globalConfigs?.getConfig("EXPENSE_CONTEXT_PATH") || "health-expense";
  const expenseCalculatorContextPath = window?.globalConfigs?.getConfig("EXPENSE_CALCULATOR_CONTEXT_PATH") || "health-expense-calculator";

  const hierachyTypeContextPath = window?.globalConfigs?.getConfig("HIERARCHY_TYPE") || "MICROPLAN";

  // State Variables
  const [showToast, setShowToast] = useState(null);
  const [tableData, setTableData] = useState(null);
  const [showGenerateBillAction, setShowGenerateBillAction] = useState(false);
  const [selectedProject, setSelectedProject] = useState(() => Digit.SessionStorage.get("selectedProject") || {});
  const [selectedLevel, setSelectedLevel] = useState(() => Digit.SessionStorage.get("selectedLevel") || null);
  const [selectedBoundaryCode, setSelectedBoundaryCode] = useState(() => Digit.SessionStorage.get("selectedBoundaryCode") || null);

  // FIX: Make selectedPeriod a state variable
  const [selectedPeriod, setSelectedPeriod] = useState(() => Digit.SessionStorage.get("selectedPeriod") || null);

  const lowestLevelBoundaryType = Digit.SessionStorage.get("paymentsConfig")?.lowestLevelBoundary || "DISTRICT";
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [approvalCount, setApprovalCount] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [infoDescription, setInfoDescription] = useState(null);
  const [pendingApprovalCount, setPendingApprovalCount] = useState(null);

  const [limitAndOffset, setLimitAndOffset] = useState({
    limit: rowsPerPage,
    offset: (currentPage - 1) * rowsPerPage,
  });

  const project = Digit?.SessionStorage.get("staffProjects");
  const [billGenerationStatus, setBillGenerationStatus] = useState(null);
  const [openAlertPopUp, setOpenAlertPopUp] = useState(false);
  const [activeLink, setActiveLink] = useState({
    code: "APPROVED",
    name: "HCM_AM_APPROVED_REGISTER",
  });

  const pId = selectedPeriod?.id;

  // FIX: Listen for period changes from session storage
  useEffect(() => {
    const checkPeriodUpdate = () => {
      const sessionPeriod = Digit.SessionStorage.get("selectedPeriod");
      if (sessionPeriod && (!selectedPeriod || sessionPeriod.id !== selectedPeriod?.id)) {
        setSelectedPeriod(sessionPeriod);
      }
    };

    const interval = setInterval(checkPeriodUpdate, 500);
    return () => clearInterval(interval);
  }, [selectedPeriod]);

  /**
   * Query to fetch the attendance register data
   */
  const registerSearchCri = {
    url: `/${attendanceContextPath}/v1/_search`,
    params: {
      tenantId: Digit.ULBService.getStateId(),
      limit: limitAndOffset?.limit,
      offset: limitAndOffset?.offset,
      referenceId: selectedProject == undefined ? Digit.SessionStorage.get("paymentInbox").selectedProject?.id : selectedProject?.id,
      localityCode: selectedBoundaryCode,
      //reviewStatus: activeLink.code,
      registerPeriodStatus: activeLink.code === "APPROVED" ? activeLink.code : pId === "AGGREGATE" ? "PENDINGFORAPPROVAL" : activeLink.code,
      isChildrenRequired: selectedLevel != null && selectedLevel?.code === lowestLevelBoundaryType ? true : false,
      billingPeriodId: pId,
    },
    config: {
//      enabled: false,
      enabled: selectedBoundaryCode && selectedProject ? true : false,
      onError: (error) => {
        setApprovalCount(0);
        setPendingApprovalCount(0);
        setTotalCount(0);
        setTableData([]);
        setShowGenerateBillAction(false);
        setShowToast({ key: "error", label: t("HCM_AM_ATTENDANCE_REGISTER_FETCH_FAILED"), transitionTime: 3000 });
      },
      changeQueryName: "inbox",
    },
  };

  const { isLoading: isAttendanceLoading, data: AttendanceData, refetch: refetchAttendance, isFetching } = Digit.Hooks.useCustomAPIHook(
    registerSearchCri
  );

  /**
   * Query to fetch the bill data
   */

  const BillSearchCri = {
    url: `/${expenseContextPath}/bill/v1/_search`,
    body: {
      billCriteria: {
        tenantId: tenantId,
        localityCode: selectedBoundaryCode,
        referenceIds: [project?.[0]?.id],
        billingPeriodIds: pId === "AGGREGATE" ? [] : [pId],
        // TODO: added condtion to pass data in case of aggregate
        ...(pId === "AGGREGATE"
          ? {
              // isAggregate: pId === "AGGREGATE" ? true : false,
              billingType: "FINAL_AGGREGATE",
            }
          : {}),
      },
    },
    config: {
//      enabled: false,
      enabled: selectedBoundaryCode ? true : false,
      select: (data) => {
        return data;
      },
    },
  };

    // Fetch configurations for bill data
    const { isLoading: isBillLoading, data: BillData, refetch: refetchBill, isFetching: isFetchingBill } = Digit.Hooks.useCustomAPIHook(BillSearchCri);

    // Update attendance table data after attendance data is loaded
    useEffect(() => {
        if (AttendanceData?.attendanceRegister) {

            const formattedList = AttendanceData?.attendanceRegister.map((item) => {
                // Find the staff with type 'APPROVER' and 'OWNER'
                const approver = item?.staff?.find((staff) => staff?.staffType?.includes("APPROVER"));
                const owner = item?.staff?.find((staff) => staff?.staffType?.includes("OWNER"));
                return {
                    id: item?.registerNumber,
                    registerId: item?.id,
                    name: selectedProject?.name,
                    boundary: item?.localityCode,
                    boundaryType: item?.additionalDetails?.boundaryType,
                    noOfAttendees: item?.attendees == null ? 0 : item?.attendees.length || 0,
                    approvedBy: approver?.additionalDetails?.staffName || "NA",
                    markedBy: owner?.additionalDetails?.ownerName || "NA",
                };
            });

            setApprovalCount(AttendanceData?.statusCount?.APPROVED);
            setPendingApprovalCount(AttendanceData?.statusCount?.PENDINGFORAPPROVAL);
            setTotalCount(AttendanceData?.totalCount);
            setTableData(formattedList);

      if (AttendanceData?.statusCount.PENDINGFORAPPROVAL === 0 && AttendanceData?.statusCount.APPROVED > 0) {
        setShowGenerateBillAction(true);
      } else {
        setInfoDescription("HCM_AM_PENDING_REGISTER_AND_APPROVAL_REGISTER_VALIDATION_FAILED_INFO_MESSAGE");
        setShowGenerateBillAction(false);
      }
    }
  }, [AttendanceData]);

  // Refetch data when active link or limit and offset changes
  useEffect(() => {
    if (selectedBoundaryCode) {
      refetchAttendance();
    }
  }, [activeLink, limitAndOffset]);

  // Refetch data and bill when boundary code or period changes
  useEffect(() => {
    if (selectedBoundaryCode) {
      setInfoDescription(null);
      refetchAttendance();
      refetchBill();
    }
  }, [selectedBoundaryCode]);

    // Refetch data when navigating back from the view screen
    useEffect(() => {
        if (fromViewScreen) {
            refetchAttendance();
            refetchBill();
        }
    }, []);

  // update bill generation info message when bill data is loaded
  useEffect(() => {
    if (BillData) {
      if (BillData?.bills?.length > 0) {
        setInfoDescription(`HCM_AM_BILL_IS_ALREADY_GENERATED_INFO_MESSAGE`);
      }
    }
  }, [BillData]);

  // FIX: Update handleFilterUpdate to accept period
  // const handleFilterUpdate = (boundaryCode, isDistrictSelected, period) => {
  //   setSelectedBoundaryCode(()=>boundaryCode);
  //   Digit.SessionStorage.set("selectedBoundaryCode", boundaryCode);
  //   // Update period in session storage and state
  //   if (period) {
  //     setSelectedPeriod(period);
  //     Digit.SessionStorage.set("selectedPeriod", period);
  //   } else if (period === null) {
  //     setSelectedPeriod(null);
  //     Digit.SessionStorage.del("selectedPeriod");
  //   }

  //   refetchAttendance();
  //   refetchBill();

  //   //setSelectedBoundaryCode(boundaryCode);
  //   // Digit.SessionStorage.set("selectedBoundaryCode", boundaryCode);

  //   // if (period) {
  //   //   setSelectedPeriod(period);
  //   //   Digit.SessionStorage.set("selectedPeriod", period);
  //   // }
  // };

  useEffect(() => {
    if (!shouldFetchRef.current) return;
    if (!selectedBoundaryCode) return;

    shouldFetchRef.current = false;

    setInfoDescription(null);
    refetchAttendance();
    refetchBill();
  }, [selectedBoundaryCode, selectedPeriod]);

  const handleFilterUpdate = (boundaryCode, isDistrictSelected, period) => {
    if (!boundaryCode) return;

        setSelectedBoundaryCode(boundaryCode);
        Digit.SessionStorage.set("selectedBoundaryCode", boundaryCode);
    };

    if (period) {
      setSelectedPeriod(period);
      Digit.SessionStorage.set("selectedPeriod", period);
    } else {
      setSelectedPeriod(null);
      Digit.SessionStorage.del("selectedPeriod");
    }

    //  mark fetch intent
    shouldFetchRef.current = true;
  };

  // FIX: Update resetBoundaryFilter to clear period
  const resetBoundaryFilter = () => {
    setTableData(null);
    setApprovalCount(null);
    setPendingApprovalCount(null);
    setSelectedBoundaryCode(null);
    setInfoDescription(null);
    setSelectedPeriod(null);
    Digit.SessionStorage.del("selectedPeriod");
  };

  const handlePageChange = (page, totalRows) => {
    setCurrentPage(page);
    setLimitAndOffset({ ...limitAndOffset, offset: (page - 1) * rowsPerPage });
  };

  const handlePerRowsChange = (currentRowsPerPage, currentPage) => {
    setRowsPerPage(currentRowsPerPage);
    setCurrentPage(1);
    setLimitAndOffset({ limit: currentRowsPerPage, offset: (currentPage - 1) * rowsPerPage });
  };

  const generateBillMutation = Digit.Hooks.useCustomAPIMutationHook({
    url: `/${expenseCalculatorContextPath}/v1/_calculate`,
  });

  const triggerGenerateBill = async () => {
    try {
      await generateBillMutation.mutateAsync(
        {
          body: {
            criteria: {
              tenantId: tenantId,
              localityCode: selectedBoundaryCode,
              referenceId: selectedProject.id,
              billingPeriodId: pId,
              hierarchyType: hierachyTypeContextPath,
              //billingType: pId === "FINAL_AGGREGATE" ? "FINAL_AGGREGATE" : "INTERMEDIATE",
            },
          },
        },
        {
          onSuccess: (data) => {
            setBillGenerationStatus(data?.statusCode);
            if (data?.statusCode === "SUCCESSFUL") {
              setShowToast({ key: "success", label: t("HCM_AM_BILL_GENERATED_SUCCESSFULLY"), transitionTime: 3000 });
              refetchBill();
            } else {
              setInfoDescription(`HCM_AM_${data?.statusCode}_INFO_MESSAGE`);
              setShowToast({ key: "success", label: t(`HCM_AM_BILL_GENERATE_${data?.statusCode}`), transitionTime: 3000 });
            }
          },
          onError: (error) => {
            setShowToast({ key: "error", label: t(error?.response?.data?.Errors?.[0]?.message), transitionTime: 3000 });
          },
        }
      );
    } catch (error) {
      setShowToast({ key: "error", label: t(`HCM_AM_BILL_GENERATE_ERROR`), transitionTime: 3000 });
    }
  };

  if (generateBillMutation.isLoading) {
    return <LoaderWithGap />;
  }
  if (isAttendanceLoading || isBillLoading) {
    return <Loader variant={"OverlayLoader"} className={"digit-center-loader"} />;
  }

  // Rest of the JSX remains the same...
  return (
    <React.Fragment>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "24px",
          marginBottom:
            showGenerateBillAction && BillData?.bills?.length === 0 && !isBillLoading && !isFetchingBill && billGenerationStatus == null
              ? "2.5rem"
              : "0px",
        }}
      >
        <div style={{ width: "30%", display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <InboxSearchLinkHeader
              headerText={"HCM_AM_BILL_INBOX"}
              links={[
                {
                  url: "/employee/payments/my-bills",
                  text: "HCM_AM_MY_BILLS",
                },
              ]}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              height: "60vh",
              overflowY: "auto",
            }}
          >
            <BillBoundaryFilter
              isRequired={ScreenTypeEnum.BILL}
              selectedProject={selectedProject}
              selectedLevel={selectedLevel}
              onFilterChange={handleFilterUpdate}
              resetBoundaryFilter={resetBoundaryFilter}
            />
          </div>
        </div>
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "24px" }}>
          {infoDescription && (
            <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
              <InfoCard
                populators={{
                  name: "infocard",
                }}
                variant="default"
                style={{ margin: "0rem", width: "100%", maxWidth: "unset", height: "124px" }}
                label={t(`HCM_AM_INFO`)}
                text={t(infoDescription)}
              />
            </div>
          )}
          <div style={{ width: "100%", display: "flex", flexDirection: "row", height: infoDescription ? "60vh" : "74vh", minHeight: "60vh" }}>
            {tableData == null && (
              <Card style={{ height: infoDescription ? "60vh" : "74vh" }}>
                <div className="summary-sub-heading" style={{ display: "flex", flexDirection: "row", gap: "10px", alignItems: "center" }}>
                  {renderProjectPeriod(t, selectedProject, selectedPeriod)?.[0]}
                  <div style={{ fontSize: "14px" }}>{renderProjectPeriod(t, selectedProject, selectedPeriod)?.[1] || ""}</div>
                </div>
                <div style={{ color: "#0b4b66" }}>{t(selectedLevel?.name || "")}</div>
                <SearchResultsPlaceholder placeholderText={t("HCM_AM_BILL_INBOX_PLACEHOLDER_IMAGE_TEXT")} />
              </Card>
            )}
            {tableData && (
              <Card style={{ width: "100%" }}>
                {tableData != null && (
                  <div className="summary-sub-heading" style={{ display: "flex", flexDirection: "row", gap: "10px", alignItems: "center" }}>
                    {renderProjectPeriod(t, selectedProject, selectedPeriod)?.[0]}
                    <div style={{ fontSize: "14px" }}>{renderProjectPeriod(t, selectedProject, selectedPeriod)?.[1]}</div>
                  </div>
                )}
                {tableData != null && <div style={{ color: "#0b4b66" }}>{t(selectedLevel?.name || "")}</div>}
                <div>
                  {approvalCount !== null && pendingApprovalCount !== null && (
                    <Tab
                      activeLink={activeLink?.code}
                      configItemKey="code"
                      configDisplayKey="name"
                      itemStyle={{ width: "400px" }}
                      configNavItems={[
                        {
                          code: "APPROVED",
                          name: `${`${t(`HCM_AM_APPROVED_REGISTER`)} (${approvalCount})`}`,
                        },
                        {
                          code: "PENDING",
                          name: `${`${t(`HCM_AM_PENDING_REGISTER`)} (${pendingApprovalCount})`}`,
                        },
                      ]}
                      navStyles={{}}
                      onTabClick={(e) => {
                        setLimitAndOffset((prev) => {
                          return {
                            limit: prev.limit,
                            offset: 0,
                          };
                        });
                        setCurrentPage(1);
                        setActiveLink(e);
                      }}
                      setActiveLink={setActiveLink}
                      showNav={true}
                      style={{}}
                    />
                  )}
                  {tableData && (
                    <div
                      style={{ maxHeight: approvalCount !== null && pendingApprovalCount !== null ? (infoDescription ? "60vh" : "74vh") : "30vh" }}
                    >
                      <Card>
                        <BillInboxTable
                          isFetching={isFetching}
                          tableData={tableData}
                          currentPage={currentPage}
                          rowsPerPage={rowsPerPage}
                          handlePageChange={handlePageChange}
                          handlePerRowsChange={handlePerRowsChange}
                          totalCount={totalCount}
                          status={selectedPeriod?.id === "AGGREGATE" ? "PENDING" : activeLink.code}
                          infoDescription={infoDescription}
                          selectedPeriod={selectedPeriod}
                        />
                      </Card>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {openAlertPopUp && (
        <AlertPopUp
          onClose={() => {
            setOpenAlertPopUp(false);
          }}
          alertHeading={t(`HCM_AM_BILL_GENERATION_ALERT_HEADING`)}
          alertMessage={t(`HCM_AM_BILL_GENERATION_ALERT_DESCRIPTION`)}
          submitLabel={t(`HCM_AM_GENERATE_BILL`)}
          cancelLabel={t(`HCM_AM_CANCEL`)}
          onPrimaryAction={() => {
            setOpenAlertPopUp(false);
            triggerGenerateBill();
          }}
        />
      )}

      {showGenerateBillAction && BillData?.bills?.length === 0 && !isBillLoading && !isFetchingBill && billGenerationStatus == null && (
        <ActionBar
          className="mc_back"
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            icon="CheckCircle"
            label={t(`HCM_AM_GENERATE_BILL_LABEL`)}
            onClick={() => {
              setOpenAlertPopUp(true);
            }}
            style={{
              minWidth: "14rem",
              opacity: billGenerationStatus != null ? 0.5 : 1,
            }}
            type="button"
            variation="primary"
            isDisabled={generateBillMutation.isLoading}
          />
        </ActionBar>
      )}
      {showToast && (
        <Toast
          style={{ zIndex: 10001 }}
          label={showToast.label}
          type={showToast.key}
          transitionTime={showToast.transitionTime}
          onClose={() => setShowToast(null)}
        />
      )}
    </React.Fragment>
  );
};

export default BillInboxComponent;
