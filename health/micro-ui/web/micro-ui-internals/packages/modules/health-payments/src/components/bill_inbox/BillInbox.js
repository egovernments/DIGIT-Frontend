import React, { useEffect, useState } from "react";
import _ from "lodash";
import CustomInboxSearchLinks from "../custom_comp/link_section";
import { useTranslation } from "react-i18next";
const { fromViewScreen } = location.state || false;
import { ActionBar, Button, Card, InfoCard, Loader, Tab, Toast } from "@egovernments/digit-ui-components";
import BillBoundaryFilter from "./bill_boundary_filter";
import BillInboxTable from "./billInboxTable";
import { defaultRowsPerPage, ScreenTypeEnum } from "../../utils/constants";
import { LoaderWithGap } from "@egovernments/digit-ui-react-components";
import SearchResultsPlaceholder from "../SearchResultsPlaceholder";
import AlertPopUp from "../alertPopUp";
const CustomBillInbox = () => {
    const { t } = useTranslation();
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const [showToast, setShowToast] = useState(null);
    const [tableData, setTableData] = useState(null);
    const [showGenerateBillAction, setShowGenerateBillAction] = useState(false);
    const [selectedProject, setSelectedProject] = useState(() => Digit.SessionStorage.get("selectedProject") || {});
    const [selectedLevel, setSelectedLevel] = useState(() => Digit.SessionStorage.get("selectedLevel") || null);
    const [selectedBoundaryCode, setSelectedBoundaryCode] = useState(() => Digit.SessionStorage.get("selectedBoundaryCode") || null);
    const lowestLevelBoundaryType = Digit.SessionStorage.get("paymentConfig")?.lowestLevelBoundary || "DISTRICT";
    const [currentPage, setCurrentPage] = useState(1);
    const [updateFilters, setUpdateFilters] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
    const [approvalCount, setApprovalCount] = useState(null);
    const [totalCount, setTotalCount] = useState(0);
    const [infoDescription, setInfoDescription] = useState(null);
    const [pendingApprovalCount, setPendingApprovalCount] = useState(null);
    const [limitAndOffset, setLimitAndOffset] = useState({ limit: rowsPerPage, offset: (currentPage - 1) * rowsPerPage });
    const project = Digit?.SessionStorage.get("staffProjects");
    const [billGenerationStatus, setBillGenerationStatus] = useState(null);
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
                setInfoDescription("HCM_AM_PENDING_REGISTER_AND_APPROVAL_REGISTER_VALIDATION_FAILED_INFO_MESSAGE")
                setShowGenerateBillAction(false);
            }
        }
    }, [AttendanceData]);
    useEffect(() => {
        if (selectedBoundaryCode) {
            refetchAttendance();
        }
    }, [activeLink, limitAndOffset]);

    useEffect(() => {
        if (selectedBoundaryCode) {
            setInfoDescription(null);
            refetchAttendance();
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
            if (BillData?.bills?.length > 0) {
                setInfoDescription(`HCM_AM_BILL_IS_ALREADY_GENERATED_INFO_MESSAGE`);
            }
        }
    }, [BillData]);

    const handleFilterUpdate = (boundaryCode) => {

        setSelectedBoundaryCode(boundaryCode);
        Digit.SessionStorage.set("selectedBoundaryCode", boundaryCode);
    };

    const resetBoundaryFilter = () => {
        setTableData(null);
        setApprovalCount(null);
        setPendingApprovalCount(null);
        setSelectedBoundaryCode(null);
        setInfoDescription(null);
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
                <div style={{ display: "flex", flexDirection: "row", gap: "24px", marginBottom: showGenerateBillAction && BillData?.bills?.length === 0 && !isBillLoading && !isFetchingBill && billGenerationStatus == null ? "2.5rem" : "0px" }}>
                    <div style={{ width: "30%", display: "flex", flexDirection: "column", gap: "24px" }}>
                        <div style={{ display: "flex", flexDirection: "row" }}>
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
                                updateBoundaryFilters={updateFilters}
                                resetBoundaryFilter={resetBoundaryFilter}
                            ></BillBoundaryFilter>
                        </div>

                    </div>
                    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "24px" }}>
                        {infoDescription && <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
                            <InfoCard
                                variant="default"
                                style={{ margin: "0rem", width: "100%", maxWidth: "unset", height: "124px" }}
                                label={t(`HCM_AM_INFO`)}
                                text={t(infoDescription)}
                            />
                        </div>}
                        <div style={{ width: "100%", display: "flex", flexDirection: "row", height: infoDescription ? "60vh" : "74vh", minHeight: "60vh" }}>
                            {tableData == null && <Card style={{ height: infoDescription ? "60vh" : "74vh" }}>
                                <div className="summary-sub-heading">{t(selectedProject?.name)}</div>
                                <div style={{ color: "#0b4b66" }}>{t(selectedLevel?.name)}</div>

                                <SearchResultsPlaceholder placeholderText={t("HCM_AM_BILL_INBOX_PLACEHOLDER_IMAGE_TEXT")} /> </Card>}
                            {tableData && <Card style={{ width: "100%", }}>
                                {tableData != null && <div className="summary-sub-heading">{t(selectedProject?.name)}</div>}
                                {tableData != null && <div style={{ color: "#0b4b66" }}>{t(selectedLevel?.name)}</div>}
                                <div>
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
                                    {tableData && <div style={{ maxHeight: approvalCount !== null && pendingApprovalCount !== null ? infoDescription ? "60vh" : "74vh" : "30vh" }}> <Card>
                                        <BillInboxTable
                                            isFetching={isFetching}
                                            tableData={tableData}
                                            currentPage={currentPage}
                                            rowsPerPage={rowsPerPage}
                                            handlePageChange={handlePageChange}
                                            handlePerRowsChange={handlePerRowsChange}
                                            totalCount={totalCount}
                                            status={activeLink.code}
                                            infoDescription={infoDescription}
                                        ></BillInboxTable>
                                    </Card></div>}
                                </div>
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
                        setOpenAlertPopUp(false);
                        triggerGenerateBill();
                    }}
                />}

                {showGenerateBillAction && BillData?.bills?.length === 0 && !isBillLoading && !isFetchingBill && billGenerationStatus == null &&
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
