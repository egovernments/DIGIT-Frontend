import React, { useEffect, useReducer, useState, useMemo, use } from "react";
import _ from "lodash";
import CustomInboxSearchLinks from "../custom_comp/link_section";
import { useTranslation } from "react-i18next";
const { fromViewScreen } = location.state || false;
import { ActionBar, Button, Card, FilterCard, InfoCard, Loader, LoaderScreen, Tab, Toast } from "@egovernments/digit-ui-components";
import BillSearchBox from "./BillSearchBox";
import BillBoundaryFilter from "./bill_boundary_filter";
import BillInboxTable from "./billInboxTable";
import { ScreenTypeEnum } from "../../utils/constants";
import { LoaderWithGap } from "@egovernments/digit-ui-react-components";
import SearchResultsPlaceholder from "../SearchResultsPlaceholder";
const CustomBillInbox = () => {
    const { t } = useTranslation();
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const [showToast, setShowToast] = useState(null);
    const [tableData, setTableData] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [showGenerateBillAction, setShowGenerateBillAction] = useState(false);
    const [filterCriteria, setFilterCriteria] = useState(null);
    const [selectedProject, setSelectedProject] = useState(() => Digit.SessionStorage.get("selectedProject") || {});
    const [selectedLevel, setSelectedLevel] = useState(() => Digit.SessionStorage.get("selectedLevel") || null);
    const [selectedBoundaryCode, setSelectedBoundaryCode] = useState(() => Digit.SessionStorage.get("selectedBoundaryCode") || null);
    const lowestLevelBoundaryType = Digit.SessionStorage.get("paymentConfig")?.lowestLevelBoundary || "DISTRICT";
    const [currentPage, setCurrentPage] = useState(1);
    const [updateFilters, setUpdateFilters] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [approvalCount, setApprovalCount] = useState(null);
    const [totalCount, setTotalCount] = useState(0);
    const [infoDescription, setInfoDescription] = useState("HCM_AM_DEFUALT_BILL_INBOX_INFO_MESSAGE");
    const [pendingApprovalCount, setPendingApprovalCount] = useState(null);
    const [limitAndOffset, setLimitAndOffset] = useState({ limit: rowsPerPage, offset: (currentPage - 1) * rowsPerPage });
    const project = Digit?.SessionStorage.get("staffProjects");
    const [billGenerationStatus, setBillGenerationStatus] = useState(null);
    const [searchQuery, setSearchQuery] = useState(null);
    const [openAlertPopUp, setOpenAlertPopUp] = useState(null);
    const [activeLink, setActiveLink] = useState({
        code: "APPROVED",
        name: "HCM_AM_APPROVED_REGISTER",
    });
    const registerSearchCri = {
        url: `/health-attendance/v1/_search`,
        params: {
            tenantId: Digit.ULBService.getStateId(),
            limit: limitAndOffset?.limit,
            offset: limitAndOffset?.offset,
            referenceId: selectedProject == undefined ? Digit.SessionStorage.get("paymentInbox").selectedProject?.id : selectedProject?.id,
            // staffId: Digit.SessionStorage.get("UserIndividual")?.[0]?.id,
            localityCode: selectedBoundaryCode,
            reviewStatus: activeLink.code,
            isChildrenRequired: selectedLevel != null && selectedLevel?.code === lowestLevelBoundaryType ? true : false,
        },
        config: {
            enabled: selectedBoundaryCode && selectedProject ? true : false,
        },
    };
    const { isLoading: isAttendanceLoading, data: AttendanceData, refetch: refetchAttendance, isFetching } = Digit.Hooks.useCustomAPIHook(
        registerSearchCri
    );
    const BillSearchCri = {
        url: `/health-expense/bill/v1/_search`,
        body: {
            billCriteria: {
                tenantId: tenantId,
                // ids: ["6eaf462a-4d9a-44c9-9ef7-e127e3fb33f1"],
                localityCode: selectedBoundaryCode,
                referenceIds: [project?.[0]?.id],
            },
        },
        config: {
            enabled: selectedBoundaryCode ? true : false,
            select: (data) => {
                return data;
            },
        },
    };
    const { isLoading: isBillLoading, data: BillData, refetch: refetchBill, isFetching: isFetchingBill } = Digit.Hooks.useCustomAPIHook(BillSearchCri);
    useEffect(() => {
        if (AttendanceData?.attendanceRegister) {
            const formattedList = AttendanceData?.attendanceRegister.map((item) => {
                // Find the staff with type 'APPROVER' and 'OWNER'
                const approver = item?.staff?.find((staff) => staff?.staffType?.includes("APPROVER"));
                const owner = item?.staff?.find((staff) => staff?.staffType?.includes("OWNER"));
                return {
                    id: item?.registerNumber,
                    name: selectedProject?.name,
                    boundary: item?.localityCode,
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
                setShowGenerateBillAction(false);
            }
        }
    }, [AttendanceData]);
    useEffect(() => {
        if (selectedBoundaryCode) {
            refetchAttendance();
        }
    }, [activeLink, limitAndOffset, selectedBoundaryCode]);

    useEffect(() => {
        if (selectedBoundaryCode) {
            refetchBill();
        }
    }, [selectedBoundaryCode]);

    useEffect(() => {
        if (fromViewScreen) {
            refetchAttendance();
            refetchBill();
        }
    }, []);

    useEffect(() => {
        if (BillData) {
            if (BillData?.bills) {
                setInfoDescription(`HCM_AM_BILL_IS_ALREADY_GENERATED_INFO_MESSAGE`);
            } else {
                triggerGenerateBill();
            }
        }
    }, [BillData]);

    // Handlers
    const handleSearchChange = (project, level) => {
        setSelectedProject(project);
        setSelectedLevel(level);
        setUpdateFilters(true);
        setTableData(null);
        setApprovalCount(null);
        setPendingApprovalCount(null);

        // Store in SessionStorage
        Digit.SessionStorage.set("selectedProject", project);
        Digit.SessionStorage.set("selectedLevel", level);
    };
    const handleFilterUpdate = (boundaryCode) => {

        setSelectedBoundaryCode(boundaryCode);
        Digit.SessionStorage.set("selectedBoundaryCode", boundaryCode);
    };

    const resetBoundaryFilter = () => {
        setTableData(null);
        setApprovalCount(null);
        setPendingApprovalCount(null);
        setSelectedBoundaryCode(null);
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
        url: "/health-expense-calculator/v1/_calculate",
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
            /// will show estimate data only
        }
    };

    if (generateBillMutation.isLoading) {
        return <LoaderWithGap />
    }
    if (isAttendanceLoading || isBillLoading) {
        return <Loader />
    }
    else {
        return (
            <React.Fragment>
                <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginBottom: "2.5rem" }}>
                    <div style={{ width: "100%", display: "flex", flexDirection: "row", gap: "24px" }}>
                        <div style={{ width: "20%", display: "flex", flexDirection: "row" }}>
                            <CustomInboxSearchLinks
                                headerText={"HCM_AM_BILL_INBOX"}
                                links={[
                                    {
                                        url: "/employee/payments/my-bills",
                                        text: "HCM_AM_MY_BILLS",
                                    },
                                ]}
                            ></CustomInboxSearchLinks>
                        </div>
                        <div style={{ display: "flex", flexDirection: "row", width: "80%" }}>
                            <InfoCard
                                variant="default"
                                style={{ margin: "0rem", width: "100%", maxWidth: "unset" }}
                                label={t(`HCM_AM_INFO`)}
                                text={t(infoDescription)}
                            />
                        </div>
                    </div>
                    <div style={{ width: "100%", display: "flex", flexDirection: "row", gap: "24px" }}>
                        <div
                            style={{
                                width: "20%",
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
                                updateBoundaryFilters={updateFilters}
                                resetBoundaryFilter={resetBoundaryFilter}
                            ></BillBoundaryFilter>
                        </div>
                        <div style={{ width: "80%", display: "flex", flexDirection: "row", height: "60vh", minHeight: "60vh" }}>
                            {tableData == null && <Card style={{ height: "60vh" }}>
                                <div className="summary-sub-heading">{t(selectedProject?.name)}</div>
                                <div style={{ color: "#0b4b66" }}>{t(selectedLevel?.name)}</div>

                                <SearchResultsPlaceholder placeholderText={"HCM_AM_BILL_INBOX_PLACEHOLDER_IMAGE_TEXT"} /> </Card>}
                            {tableData && <Card style={{ width: "100%" }}>
                                {tableData != null && <div className="summary-sub-heading">{t(selectedProject?.name)}</div>}
                                {tableData != null && <div style={{ color: "#0b4b66" }}>{t(selectedLevel?.name)}</div>}
                                {(approvalCount !== null && pendingApprovalCount !== null) && (
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
                                                code: "PENDINGFORAPPROVAL",
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
                                {tableData && <div style={{ overflow: "auto", maxHeight: approvalCount !== null && pendingApprovalCount !== null ? "50vh" : "30vh" }}> <Card
                                    style={{
                                        WebkitBoxShadow: "0 0.063rem 0.125rem 0 rgba(0, 0, 0, 0.16078)",
                                        boxShadow: "0 0.063rem 0.125rem 0 rgba(0, 0, 0, 0.16078)",
                                        // -webkit-box-shadow: 0 0.063rem 0.125rem 0 rgba(0, 0, 0, 0.16078);
                                        // box-shadow: 0 0.063rem 0.125rem 0 rgba(0, 0, 0, 0.1607
                                    }}
                                >
                                    <BillInboxTable
                                        isFetching={isFetching}
                                        tableData={tableData}
                                        currentPage={currentPage}
                                        rowsPerPage={rowsPerPage}
                                        handlePageChange={handlePageChange}
                                        handlePerRowsChange={handlePerRowsChange}
                                        totalCount={totalCount}
                                        status={activeLink.code}
                                    ></BillInboxTable>
                                </Card></div>}
                            </Card>}
                        </div>
                    </div>
                </div>

                {openAlertPopUp && <AlertPopUp
                    onClose={() => {
                        setOpenAlertPopUp(false);
                    }}
                    alertHeading={t(`HCM_AM_BILL_GENERATION_ALERT_HEADING`)}
                    alertMessage={t(`HCM_AM_BILL_GENERATION_ALERT_DESCRIPTION`)}
                    submitLabel={t(`HCM_AM_GENERATE_BILL`)}
                    cancelLabel={t(`HCM_AM_CANCEL`)}
                    onPrimaryAction={() => {
                        triggerGenerateBill();
                    }}
                />}

                {showGenerateBillAction && BillData?.bills?.length === 0 && !isBillLoading && !isFetchingBill && setBillGenerationStatus == null &&
                    < ActionBar
                        actionFields={[
                            <Button
                                icon="CheckCircle"
                                label={t(`HCM_AM_GENERATE_BILL_LABEL`)}
                                onClick={() => {
                                    setOpenAlertPopUp(true);
                                    // triggerGenerateBill();
                                }}
                                style={{
                                    minWidth: "14rem",
                                    opacity: billGenerationStatus != null ? 0.5 : 1,
                                }}
                                type="button"
                                variation="primary"
                                isDisabled={generateBillMutation.isLoading}
                            />,
                        ]}
                        className=""
                        maxActionFieldsAllowed={5}
                        setactionFieldsToRight
                        sortActionFields
                        style={{}}
                    />
                }
                {showToast && (
                    <Toast
                        style={{ zIndex: 10001 }}
                        label={showToast.label}
                        type={showToast.key}
                        // error={showToast.key === "error"}
                        transitionTime={showToast.transitionTime}
                        onClose={() => setShowToast(null)}
                    />
                )}
            </React.Fragment>
        );
    }
};
export default CustomBillInbox;
