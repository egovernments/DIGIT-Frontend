import React, { useEffect, useReducer, useState, useMemo, use } from "react";

import _ from "lodash";
import CustomInboxSearchLinks from "./custom_comp/link_section";
import CustomSearchComponent from "./custom_comp/search_section";

import { useTranslation } from "react-i18next";
import CustomFilter from "./custom_comp/filter_section";
import CustomInboxTable from "./custom_comp/table_inbox";
import { FilterCard } from "@egovernments/digit-ui-components";
import Sample from "./sample";

const CustomInboxSearchComposer = () => {
  const { t } = useTranslation();

  const [filterCriteria, setFilterCriteria] = useState({});
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

  const triggerMusterRollApprove = async () => {
    try {
      setChildrenDataLoading(true);
      await fetchRegisters.mutateAsync(
        {
          params: {
            tenantId:Digit.ULBService.getStateId(),
            limit: rowsPerPage,
            offset: (currentPage - 1) * rowsPerPage,
            //  ids:'ec3ad628-54a0-4eaf-9101-d78f7869919d'
          },
        },
        {
          onSuccess: (data) => {
            debugger;
            const rowData = data?.attendanceRegister?.map((item, index) => {
              return {
                id: item?.registerNumber,
                name: item?.name,
                boundary: "locality",
                status: item?.status,
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
            // history.push(`/${window.contextPath}/employee/payments/attendance-approve-failed`, {
            //   state: "error",
            //   message: t(`HCM_AM_ATTENDANCE_APPROVE_FAILED`),
            //   back: t(`GO_BACK_TO_HOME`),
            //   backlink: `/${window.contextPath}/employee`,
            // });
          },
        }
      );
    } catch (error) {
      /// will show estimate data only
    }
  };

  //

  useEffect(() => {}, [selectedProject]);

  const handleProjectChange = (selectedProject) => {
    setSelectedProject(selectedProject);
  };

  const handleFilterUpdate = (newFilter) => {
    triggerMusterRollApprove();
    setFilterCriteria(newFilter); // Update the filter state
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

  return (
    <React.Fragment>
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <div style={{ width: "100%", display: "flex", flexDirection: "row" }}>
          <div style={{ width: "20%", display: "flex", flexDirection: "row" }}>
            <CustomInboxSearchLinks
              headerText={"links"}
              links={[
                {
                  text: "MB_SEARCH_MB",
                  url: "/employee/measurement/search",
                  roles: ["MB_CREATOR", "MB_VERIFIER", "MB_APPROVER", "MB_VIEWER"],
                },
                {
                  text: "MB_CREATE_MB",
                  url: "/employee/contracts/search-contract?status=ACCEPTED",
                  roles: ["MB_CREATOR"],
                },
              ]}
            ></CustomInboxSearchLinks>
          </div>
          <div style={{ width: "1%", display: "flex", flexDirection: "row" }} />
          <div style={{ width: "75%", display: "flex", flexDirection: "row" }}>
            <CustomSearchComponent onProjectSelect={handleProjectChange}></CustomSearchComponent>
          </div>
        </div>

        <div style={{ width: "100%", display: "flex", flexDirection: "row" }}>
          <div style={{ width: "20%", display: "flex", flexDirection: "row" ,
            height: "400px", // Fixed height
            maxHeight: "400px", // Maximum height
            overflowY: "auto", 
          }}>
             <CustomFilter projectData={selectedProject} onFilterChange={handleFilterUpdate}></CustomFilter>
          
          </div>
          <div style={{ width: "1%", display: "flex", flexDirection: "row" }} />
          <div style={{ width: "75%", display: "flex", flexDirection: "row" }}>
            <CustomInboxTable
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
    </React.Fragment>
  );
};

export default CustomInboxSearchComposer;
