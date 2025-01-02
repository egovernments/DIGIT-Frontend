import React, { useEffect, useReducer, useState, useMemo, use } from "react";

import _ from "lodash";
import CustomInboxSearchLinks from "./custom_comp/link_section";
import CustomSearchComponent from "./custom_comp/search_section";

import { useTranslation } from "react-i18next";
import CustomFilter from "./custom_comp/filter_section";
import CustomInboxTable from "./custom_comp/table_inbox";
import { FilterCard, Toast, Card } from "@egovernments/digit-ui-components";

const CustomInboxSearchComposer = () => {
  const { t } = useTranslation();
  const [showToast, setShowToast] = useState(null);
  const [filterCriteria, setFilterCriteria] = useState(null);
  const [selectedProject, setSelectedProject] = useState({});
  //-------//

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedStatus, setSelectedStatus] = useState("PENDINGFORAPPROVAL");

  const [card, setCard] = useState(false);

  const [childrenDataLoading, setChildrenDataLoading] = useState(false);
  const [childrenData, setchildrenData] = useState([]);

  const fetchRegisters = Digit.Hooks.useCustomAPIMutationHook({
    url: "/health-attendance/v1/_search",
  });

  const triggerMusterRollApprove = (filterData, status, totalRows, totalNext, selectedProject) => {
    try {
      setChildrenDataLoading(true);
      fetchRegisters.mutateAsync(
        {
          params: {
            tenantId: Digit.ULBService.getStateId(),
            limit: rowsPerPage,
            offset: totalNext == undefined ? (currentPage - 1) * rowsPerPage : (totalNext - 1) * totalRows,
            referenceId: selectedProject?.id == undefined ? Digit.SessionStorage.get("paymentInbox").selectedProject?.id : selectedProject?.id,
            staffId: Digit.SessionStorage.get("UserIndividual")?.[0]?.id,
            localityCode: filterData?.code == undefined || filterData?.code == null ? filterCriteria?.code : filterData?.code,
            paymentStatus: status == undefined ? null : status,
          },
        },
        {
          onSuccess: (data) => {
            const rowData =
              data?.attendanceRegister.length > 0
                ? data?.attendanceRegister?.map((item, index) => {
                    return {
                      id: item?.registerNumber,
                      //name: item?.name,
                      name: selectedProject?.name,
                      boundary: item?.localityCode,
                      status: item?.attendees == null ? 0 : item?.attendees.length || 0,
                      markby: item?.staff?.[0].additionalDetails?.staffUserName || "",
                    };
                  })
                : [];
            setChildrenDataLoading(false);
            setCard(data?.totalCount > 0 ? true : false);
            setchildrenData({
              data: rowData,
              totalCount: data?.totalCount,
              statusCount: data?.statusCount,
            });
          },
          onError: (error) => {
            setCard(false);
            setChildrenDataLoading(false);
            setShowToast({ key: "error", label: t("HCM_AM_ATTENDANCE_REGISTER_FETCH_FAILED"), transitionTime: 3000 });
          },
        }
      );
    } catch (error) {
      /// will show estimate data only
    }
  };

  //

  useEffect(() => {
    const data = Digit.SessionStorage.get("paymentInbox");

    if (data) {
      triggerMusterRollApprove(data);
    }
  }, []);

  // Clear `paymentInbox` on browser back/forward navigation or page close
  useEffect(() => {
    const handlePopState = () => {
      sessionStorage.removeItem("Digit.paymentInbox");
      sessionStorage.removeItem("selectedValues");
    };

    const handleBeforeUnload = () => {
      sessionStorage.removeItem("Digit.paymentInbox");
      sessionStorage.removeItem("selectedValues");
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => { }, [selectedProject]);

  const handleProjectChange = (selectedProject) => {
    setSelectedProject(selectedProject);
  };

  const handleFilterUpdate = (newFilter, isSelectedData) => {
    setFilterCriteria(newFilter);

    if (isSelectedData) {
      Digit.SessionStorage.set("paymentInbox", {
        ...newFilter,
        selectedProject: selectedProject,
      });

      triggerMusterRollApprove(newFilter);
    } else {
      setShowToast({ key: "error", label: t("error"), transitionTime: 3000 });
    }
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

    triggerMusterRollApprove(filterCriteria, selectedStatus, rowsPerPage, page);
  };
  const handleRowsPerPageChange = (newPerPage, page) => {
    setRowsPerPage(newPerPage); // Update the rows per page state
    setCurrentPage(page); // Optionally reset the current page or maintain it
    // refetchPlanEmployee();
    // handleCreateRateAnalysis();
    triggerMusterRollApprove(filterCriteria, selectedStatus, newPerPage, page);
  };
  const callServiceOnTap = (status) => {
    if (status.code == "HCM_AM_PENDING_FOR_APPROVAL") {
      setRowsPerPage(5); // Update the rows per page state
      setCurrentPage(1);
      setSelectedStatus("PENDINGFORAPPROVAL");
      triggerMusterRollApprove(Digit.SessionStorage.get("paymentInbox"), "PENDINGFORAPPROVAL", 5, 1);
    } else {
      setRowsPerPage(5); // Update the rows per page state
      setCurrentPage(1);
      setSelectedStatus("APPROVED");
      triggerMusterRollApprove(Digit.SessionStorage.get("paymentInbox"), "APPROVED", 5, 1);
    }
  };

  return (
    <React.Fragment>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "24px" }}>
        <div style={{ width: "100%", display: "flex", flexDirection: "row", gap: "24px" }}>
          <div style={{ width: "30%", display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ width: "100%", display: "flex", flexDirection: "row" }}>
              <CustomInboxSearchLinks headerText={"ATTENDANCE_INBOX_CARD"}></CustomInboxSearchLinks>
            </div>
            {/*<div style={{ width: "80%", display: "flex", flexDirection: "row" }}>
            <CustomSearchComponent onProjectSelect={handleProjectChange}></CustomSearchComponent>
          </div>*/}

            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                height: "60vh",
                overflowY: "auto",
              }}
            >
              <CustomFilter onProjectSelect={handleProjectChange} projectData={selectedProject} onFilterChange={handleFilterUpdate}></CustomFilter>
            </div>
          </div>

          <div style={{ width: "100%", display: "flex", flexDirection: "row", gap: "24px" }}>
            <div style={{ width: "100%", display: "flex", flexDirection: "column", height: "60vh", minHeight: "60vh" }}>
              {card == false?  <Card style={{ maxWidth: "100%", overflow: "auto", margin: "0px", padding: "0px" }}></Card>:
              childrenData?.totalCount > 0 && (
                <CustomInboxTable
                  statusCount={childrenData?.statusCount}
                  handleTabChange={callServiceOnTap}
                  rowsPerPage={rowsPerPage}
                  customHandleRowsPerPageChange={handleRowsPerPageChange}
                  customHandlePaginationChange={handlePaginationChange}
                  isLoading={childrenDataLoading}
                  tableData={childrenData?.data}
                  totalCount={childrenData?.totalCount}
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
          // error={showToast.key === "error"}
          transitionTime={showToast.transitionTime}
          onClose={() => setShowToast(null)}
        />
      )}
    </React.Fragment>
  );
};

export default CustomInboxSearchComposer;
