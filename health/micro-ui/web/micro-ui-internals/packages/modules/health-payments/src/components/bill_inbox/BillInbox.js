import React, { useEffect, useReducer, useState, useMemo, use } from "react";

import _ from "lodash";
import CustomInboxSearchLinks from "../custom_comp/link_section";
import CustomSearchComponent from "../custom_comp/search_section";

import { useTranslation } from "react-i18next";
import CustomFilter from "../custom_comp/filter_section";
import CustomInboxTable from "../custom_comp/table_inbox";
import { ActionBar, Button, Card, FilterCard, LoaderScreen, Tab, Toast } from "@egovernments/digit-ui-components";
import BillSearchBox from "./BillSearchBox";
import BillBoundaryFilter from "./bill_boundary_filter";
import BillInboxTable from "./billInboxTable";

const CustomBillInbox = () => {
    const { t } = useTranslation();
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const [showToast, setShowToast] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [showGenerateBillAction, setShowGenerateBillAction] = useState(false);
    const [filterCriteria, setFilterCriteria] = useState(null);
    const [selectedProject, setSelectedProject] = useState({});
    const [selectedBoundaryCode, setSelectedBoundaryCode] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [limitAndOffset, setLimitAndOffset] = useState({ limit: rowsPerPage, offset: (currentPage - 1) * rowsPerPage });

    const [selectedLevel, setSelectedLevel] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState("PENDINGFORAPPROVAL");

    const [searchQuery, setSearchQuery] = useState(null);

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
        },
        config: {
            enabled: selectedBoundaryCode && selectedProject ? true : false,
        },
    };

    const { isLoading: isAttendanceLoading, data: AttendanceData, refetch: refetchAttendance, isFetching } = Digit.Hooks.useCustomAPIHook(registerSearchCri);

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
                    markedBy: owner?.additionalDetails?.staffName || "NA"
                };
            });

            setTableData(formattedList);
            if (AttendanceData?.statusCount.PENDINGFORAPPROVAL === 0 && AttendanceData?.statusCount.APPROVED > 0) {
                setShowGenerateBillAction(true);
            } else {
                setShowGenerateBillAction(false);
            }
        }
    }, [AttendanceData])

    useEffect(() => {
        if (selectedBoundaryCode) {
            refetchAttendance();
        }
    }, [activeLink, limitAndOffset])


    const handleSearchChange = (selectedProject, selectedLevel) => {
        setSelectedLevel(selectedLevel);
        setSelectedProject(selectedProject);
    };

    const handleFilterUpdate = (boundaryCode) => {
        setSelectedBoundaryCode(boundaryCode);
    };

    const handlePageChange = (page, totalRows) => {
        setCurrentPage(page);
        setLimitAndOffset({ ...limitAndOffset, offset: (page - 1) * rowsPerPage })
    }

    const handlePerRowsChange = (currentRowsPerPage, currentPage) => {
        setRowsPerPage(currentRowsPerPage);
        setCurrentPage(1);
        setLimitAndOffset({ limit: currentRowsPerPage, offset: (currentPage - 1) * rowsPerPage })
    }


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
                            referenceId: selectedProject.id
                        }
                    },
                },
                {
                    onSuccess: (data) => {
                        setShowToast({ key: "success", label: t("HCM_AM_BILL_GENERATED_SUCCESSFULLY"), transitionTime: 3000 });
                    },
                    onError: (error) => {
                        setShowToast({ key: "error", label: t(error?.response?.data?.Errors?.[0]?.message), transitionTime: 3000 });
                    }
                }
            );
        } catch (error) {
            /// will show estimate data only
        }
    };

    return (
        <React.Fragment>
            <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginBottom: showGenerateBillAction ? "2.5rem" : "0px" }}>
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
                    <div style={{ width: "80%", display: "flex", flexDirection: "row" }}>
                        <BillSearchBox onLevelSelect={handleSearchChange}></BillSearchBox>
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
                        <BillBoundaryFilter selectedProject={selectedProject} selectedLevel={selectedLevel} onFilterChange={handleFilterUpdate}></BillBoundaryFilter>
                    </div>
                    <div style={{ width: "80%", display: "flex", flexDirection: "row", height: "60vh", minHeight: "60vh" }}>
                        <div style={{ width: "100%" }}>
                            {AttendanceData && <Tab
                                activeLink={activeLink?.code}
                                configItemKey="code"
                                configDisplayKey="name"
                                itemStyle={{ width: "400px" }}
                                configNavItems={[
                                    {
                                        code: "APPROVED",
                                        name: `${`${t(`HCM_AM_APPROVED_REGISTER`)} (${AttendanceData?.statusCount?.APPROVED})`}`,
                                    },
                                    {
                                        code: "PENDINGFORAPPROVAL",
                                        name: `${`${t(`HCM_AM_PENDING_REGISTER`)} (${AttendanceData?.statusCount?.PENDINGFORAPPROVAL})`}`,
                                    },
                                ]}
                                navStyles={{}}
                                onTabClick={(e) => {
                                    setLimitAndOffset((prev) => {
                                        return {
                                            limit: prev.limit,
                                            offset: 0
                                        }
                                    });
                                    setCurrentPage(1);
                                    setActiveLink(e);
                                }}
                                setActiveLink={setActiveLink}
                                showNav={true}
                                style={{}}
                            />}
                            <Card>
                                <BillInboxTable
                                    isFetching={isFetching}
                                    tableData={tableData}
                                    currentPage={currentPage}
                                    rowsPerPage={rowsPerPage}
                                    handlePageChange={handlePageChange}
                                    handlePerRowsChange={handlePerRowsChange}
                                    totalCount={AttendanceData?.totalCount}
                                    status={activeLink.code}
                                ></BillInboxTable>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
            {showGenerateBillAction && <ActionBar
                actionFields={[
                    <Button
                        icon="CheckCircle"
                        label={t(`HCM_AM_GENERATE_BILL_LABEL`)}
                        onClick={() => {
                            triggerGenerateBill();
                        }}
                        style={{ minWidth: "14rem" }}
                        type="button"
                        variation="primary"
                    //   isDisabled={updateMutation.isLoading || updateDisabled}
                    />

                ]}
                className=""
                maxActionFieldsAllowed={5}
                setactionFieldsToRight
                sortActionFields
                style={{}}
            />}
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
};

export default CustomBillInbox;
