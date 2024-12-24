import React, { useEffect, useReducer, useState, useMemo, use } from "react";

import _ from "lodash";
import CustomInboxSearchLinks from "./custom_comp/link_section";
import CustomSearchComponent from "./custom_comp/search_section";

import { useTranslation } from "react-i18next";
import CustomFilter from "./custom_comp/filter_section";
import CustomInboxTable from "./custom_comp/table_inbox";

const CustomInboxSearchComposer = () => {
  const { t } = useTranslation();

  const [filterCriteria, setFilterCriteria] = useState({});
  const [selectedProject, setSelectedProject] = useState({});
  //-------//

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);

  const [searchQuery, setSearchQuery] = useState(null);

  //------//

  // const reqCriteriaResource = useMemo(() => ({
  //   url: `/health-attendance/v1/_search`,
  //   params: {
  //     tenantId: "mz",
  //     ...filterCriteria, // Merge filter criteria into params
  //   },
  //   config: {
  //     enabled: true,
  //     select: (data) => {
  //       const rowData = data?.attendanceRegister?.map((item) => ({
  //         id: item?.registerNumber,
  //         name: item?.name,
  //         boundary: item?.user?.emailId,
  //         status: item?.status,
  //       }));
  //       return {
  //         data: rowData,
  //         totalCount: data?.totalCount,
  //       };
  //     },
  //   },
  // }), [filterCriteria]);

  const reqCriteriaResource = {
    url: `/health-attendance/v1/_search`,
    params: {
      tenantId: "mz",
      limit: rowsPerPage,
      offset: (currentPage - 1) * rowsPerPage,
      //  ids:'ec3ad628-54a0-4eaf-9101-d78f7869919d'
    },
    config: {
      enabled: true,
      select: (data) => {
        const rowData = data?.attendanceRegister?.map((item, index) => {
          return {
            id: item?.registerNumber,
            name: item?.name,
            boundary: "locality",
            status: item?.status,
          };
        });
        return {
          data: rowData,
          totalCount: data?.totalCount,
          statusCount: data?.statusCount,
        };
      },
    },
  };

  const {
    isLoading: childrenDataLoading,
    data: childrenData,
    error: planEmployeeError,
    refetch: refetchPlanEmployee,
  } = Digit.Hooks.payments.useAttendanceBoundaryRegisterSearch(reqCriteriaResource);

  useEffect(() => {}, [selectedProject]);

  const handleProjectChange = (selectedProject) => {
    setSelectedProject(selectedProject);
  };

  const handleFilterUpdate = (newFilter) => {
    setFilterCriteria(newFilter); // Update the filter state
  };

  useEffect(() => {
    refetchPlanEmployee();
  }, [totalRows, currentPage, rowsPerPage, searchQuery]);

  useEffect(() => {
    setTotalRows(childrenData?.totalCount);
  }, [childrenData]);

  const handlePaginationChange = (page) => {
    setCurrentPage(page);
    refetchPlanEmployee();
  };
  const handleRowsPerPageChange = (newPerPage, page) => {
    setRowsPerPage(newPerPage); // Update the rows per page state
    setCurrentPage(page); // Optionally reset the current page or maintain it
    refetchPlanEmployee();
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
          <div style={{ width: "20%", display: "flex", flexDirection: "row" }}>
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
