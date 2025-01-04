import React, { useEffect, useReducer, useState, useMemo, use } from "react";

import _ from "lodash";
import CustomInboxSearchLinks from "../custom_comp/link_section";
import CustomSearchComponent from "../custom_comp/search_section";

import { useTranslation } from "react-i18next";
import CustomFilter from "../custom_comp/filter_section";
import CustomInboxTable from "../custom_comp/table_inbox";
import { FilterCard, Toast } from "@egovernments/digit-ui-components";
import BillSearchBox from "./BillSearchBox";

const CustomBillInbox = () => {
    const { t } = useTranslation();
    const [showToast, setShowToast] = useState(null);
    const [filterCriteria, setFilterCriteria] = useState(null);
    const [selectedProject, setSelectedProject] = useState({});
    //-------//

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedStatus, setSelectedStatus] = useState("PENDINGFORAPPROVAL");

    const [searchQuery, setSearchQuery] = useState(null);

    //   useEffect(() => { }, [selectedProject]);

    const handleSearchChange = (selectedProject, selectedLevel) => {
        console.log(selectedProject, selectedLevel, 'sssssssssssssssss');
        // setSelectedProject(selectedProject);
    };

    const handleFilterUpdate = (newFilter) => {
        // setFilterCriteria(newFilter);
        // triggerMusterRollApprove(newFilter);
    };

    // useEffect(() => {
    //   // handleCreateRateAnalysis();
    //   // triggerMusterRollApprove();
    // }, [totalRows, currentPage, rowsPerPage, searchQuery]);

    // useEffect(() => {
    //   setTotalRows(childrenData?.totalCount);
    // }, [childrenData]);

    const handlePaginationChange = (page) => {
        setCurrentPage(page);

        // triggerMusterRollApprove(filterCriteria, selectedStatus, rowsPerPage, page);
    };
    const handleRowsPerPageChange = (newPerPage, page) => {
        setRowsPerPage(newPerPage); // Update the rows per page state
        setCurrentPage(page); // Optionally reset the current page or maintain it
        // refetchPlanEmployee();
        // handleCreateRateAnalysis();
        // triggerMusterRollApprove(filterCriteria, selectedStatus, newPerPage, page);
    };
    const callServiceOnTap = (status) => {
        if (status.code == "HCM_AM_PENDING_FOR_APPROVAL") {
            //   setRowsPerPage(5); // Update the rows per page state
            //   setCurrentPage(1);
            //   setSelectedStatus("PENDINGFORAPPROVAL");
            //   triggerMusterRollApprove(filterCriteria, "PENDINGFORAPPROVAL", 5, 1);
        } else {
            //   setRowsPerPage(5); // Update the rows per page state
            //   setCurrentPage(1);
            //   setSelectedStatus("APPROVED");
            //   triggerMusterRollApprove(filterCriteria, "APPROVED", 5, 1);
        }
    };

    return (
        <React.Fragment>
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <div style={{ width: "100%", display: "flex", flexDirection: "row", gap: "24px" }}>
                    <div style={{ width: "20%", display: "flex", flexDirection: "row" }}>
                        <CustomInboxSearchLinks
                            headerText={"HCM_AM_BILL_INBOX"}
                            links={[
                                {
                                    url: "/employee/payments/my-bills",
                                    text: "HCM_AM_MY_BILLS_LINK",
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
                        <CustomFilter projectData={selectedProject} onFilterChange={handleFilterUpdate}></CustomFilter>
                    </div>
                    <div style={{ width: "80%", display: "flex", flexDirection: "row", height: "60vh", minHeight: "60vh" }}>
                        <CustomInboxTable
                            // statusCount={childrenData?.statusCount}
                            handleTabChange={callServiceOnTap}
                            rowsPerPage={rowsPerPage}
                            customHandleRowsPerPageChange={handleRowsPerPageChange}
                        // customHandlePaginationChange={handlePaginationChange}
                        // isLoading={childrenDataLoading}
                        // tableData={childrenData?.data}
                        // totalCount={childrenData?.totalCount}
                        ></CustomInboxTable>
                    </div>
                </div>
            </div>
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
