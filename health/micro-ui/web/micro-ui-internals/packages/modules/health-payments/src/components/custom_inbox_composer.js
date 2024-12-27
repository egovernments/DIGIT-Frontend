import React, { useEffect, useReducer, useState, useMemo, use } from "react";

import _ from "lodash";
import CustomInboxSearchLinks from "./custom_comp/link_section";
import CustomSearchComponent from "./custom_comp/search_section";

import { useTranslation } from "react-i18next";
import CustomFilter from "./custom_comp/filter_section";
import CustomInboxTable from "./custom_comp/table_inbox";
import { FilterCard, Toast } from "@egovernments/digit-ui-components";

const CustomInboxSearchComposer = () => {
  const { t } = useTranslation();
  const [showToast, setShowToast] = useState(null);
  const [filterCriteria, setFilterCriteria] = useState(null);
  const [selectedProject, setSelectedProject] = useState({});
  //-------//

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);

  const [searchQuery, setSearchQuery] = useState(null);

  const [childrenDataLoading, setChildrenDataLoading] = useState(false);
  const [childrenData, setchildrenData] = useState([]);

  const fetchRegisters = Digit.Hooks.useCustomAPIMutationHook({
    url: "/health-attendance/v1/_search",
  });

  const triggerMusterRollApprove = async (filterData) => {
    try {
      setChildrenDataLoading(true);
      await fetchRegisters.mutateAsync(
        {
          params: {
            tenantId: Digit.ULBService.getStateId(),
            limit: rowsPerPage,
            offset: (currentPage - 1) * rowsPerPage,
            referenceId: selectedProject?.id,
            staffId: Digit.SessionStorage.get("UserIndividual")?.[0]?.id,
            localityCode: filterData?.code == undefined || filterData?.code == null ? filterCriteria?.code : filterData?.code,
            //paymentStatus:"APPROVAL_PENDING"
          },
        },
        {
          onSuccess: (data) => {
            const rowData = data?.attendanceRegister?.map((item, index) => {
              return {
                id: item?.registerNumber,
                name: item?.name,
                boundary: item?.localityCode,
                status: item?.staff.length || 0,
              };
            });
            setChildrenDataLoading(false);
            setchildrenData({
              data: rowData,
              totalCount: data?.totalCount,
              statusCount: data?.statusCount,
            });
          },
          onError: (error) => {
            setShowToast({ key: "error", label: t("HCM_AM_ATTENDANCE_REGISTER_FETCH_FAILED"), transitionTime: 3000 });
          },
        }
      );
    } catch (error) {
      /// will show estimate data only
    }
  };

  //

  useEffect(() => { }, [selectedProject]);

  const handleProjectChange = (selectedProject) => {
    setSelectedProject(selectedProject);
  };

  const handleFilterUpdate = (newFilter) => {
    setFilterCriteria(newFilter);
    triggerMusterRollApprove(newFilter);
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

    triggerMusterRollApprove();
  };
  const handleRowsPerPageChange = (newPerPage, page) => {
    setRowsPerPage(newPerPage); // Update the rows per page state
    setCurrentPage(page); // Optionally reset the current page or maintain it
    // refetchPlanEmployee();
    // handleCreateRateAnalysis();
    triggerMusterRollApprove();
  };
  const callServiceOnTap = (status) => {
    triggerMusterRollApprove();
  };

  return (
    <React.Fragment>
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div style={{ width: "100%", display: "flex", flexDirection: "row", gap: "24px" }}>
          <div style={{ width: "20%", display: "flex", flexDirection: "row" }}>
            <CustomInboxSearchLinks headerText={"ATTENDANCE_INBOX_CARD"}></CustomInboxSearchLinks>
          </div>
          <div style={{ width: "80%", display: "flex", flexDirection: "row" }}>
            <CustomSearchComponent onProjectSelect={handleProjectChange}></CustomSearchComponent>
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
          <div style={{ width: "80%", display: "flex", flexDirection: "row", height: "60vh" }}>
            <CustomInboxTable
              handleTabChange={callServiceOnTap}
              rowsPerPage={rowsPerPage}
              customHandleRowsPerPageChange={handleRowsPerPageChange}
              customHandlePaginationChange={handlePaginationChange}
              isLoading={childrenDataLoading}
              tableData={childrenData?.data}
              totalCount={childrenData?.totalCount}
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

export default CustomInboxSearchComposer;
