import React, { useEffect, useReducer, useState, useMemo, use } from "react";

import _ from "lodash";
import CustomInboxSearchLinks from "./custom_comp/link_section";
import CustomSearchComponent from "./custom_comp/search_section";

import { useTranslation } from "react-i18next";
import CustomFilter from "./custom_comp/filter_section";
import CustomInboxTable from "./custom_comp/table_inbox";
import { FilterCard, Toast, Card } from "@egovernments/digit-ui-components";
import { ScreenTypeEnum, StatusEnum } from "../utils/constants";

/**
* Business Flow Description:
* 1. In the search section, a project select dropdown is provided.
*    - When a project is selected from the dropdown, the Boundary Search Service is invoked to fetch the boundary hierarchy.
* 2. On successful fetching of the boundary hierarchy from the service:
*    - A dynamic list of boundary selection dropdowns is rendered in the filter section.
* 3. When filters are applied:
*    - The Attendance Register Search API is called with the applied filter criteria.
*    - On receiving a successful response, the table data is rendered accordingly.
* 4. Tab Functionality:
*    - Tabs are implemented in the UI for additional functionality.
*    - Based on the tab selection, the Attendance Register Search API is triggered with a custom payload specific to the selected tab.

*/

/**
 * Reason for not using React Component - InboxComposer:
 * 1. Restrictions in InboxComposer:
 *    - The component requires showing "No Results" initially, which does not align with our requirement. 
 *    - Search should only be triggered after filters are applied.
 * 2. Dynamic Boundary Filters:
 *    - The boundary filter options need to be dynamically determined based on the selected project.
 * 3. Tab-Specific API Calls:
 *    - On tab selection, the same Attendance Register Search API must be called with different status filters, 
 *      which is not inherently supported by the InboxComposer component.

 
 */

const CustomInboxSearchComposer = () => {
  const { t } = useTranslation();
  const [showToast, setShowToast] = useState(null);
  const [filterCriteria, setFilterCriteria] = useState(null);
  const [selectedProject, setSelectedProject] = useState({});
  //-------//

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedStatus, setSelectedStatus] = useState(StatusEnum.PENDING_FOR_APPROVAL);

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
            limit: totalRows || rowsPerPage,
            offset: totalNext == undefined ? (currentPage - 1) * rowsPerPage : (totalNext - 1) * totalRows,
            referenceId: selectedProject?.id == undefined ? Digit.SessionStorage.get("paymentInbox").selectedProject?.id : selectedProject?.id,
            staffId: Digit.SessionStorage.get("UserIndividual")?.[0]?.id,
            localityCode:
              filterData?.code == undefined || filterData?.code == null
                ? filterCriteria?.code == undefined || filterCriteria?.code == null
                  ? Digit.SessionStorage.get("paymentInbox").code
                  : filterCriteria?.code
                : filterData?.code,
            reviewStatus: status == undefined ? selectedStatus : status,
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
                      markby: item?.staff?.[0].additionalDetails?.staffName || "",
                    };
                  })
                : [];
            setChildrenDataLoading(false);
            setCard(true);
            setchildrenData({
              data: rowData,
              totalCount: data?.totalCount,
              statusCount: data?.statusCount,
            });
          },
          onError: (error) => {
            setCard(true);
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

  const handleProjectChange = (selectedProject) => {
    setSelectedProject(selectedProject);
  };

  const handleFilterUpdate = (newFilter, isSelectedData) => {
    setFilterCriteria(newFilter);
    setSelectedStatus(StatusEnum.PENDING_FOR_APPROVAL);

    const existingPaymentInbox = Digit.SessionStorage.get("paymentInbox");

    const isEmptyObject = (obj) => !obj || Object.keys(obj).length === 0;

    // Validation 1: Check if both `selectedProject` and `existingPaymentInbox.selectedProject` are empty
    if (isEmptyObject(selectedProject) && isEmptyObject(existingPaymentInbox?.selectedProject)) {
      setShowToast({ key: "error", label: t("HCM_AM_ATTENDANCE_PROJECT_SELECT"), transitionTime: 3000 });
      return;
    }

    // Validation 2: Check if `newFilter` is null or undefined

    if ((!newFilter || isEmptyObject(newFilter)) && !existingPaymentInbox?.boundaryType) {
      setShowToast({ key: "error", label: t("HCM_AM_ATTENDANCE_BOUNDARY_SELECT"), transitionTime: 3000 });
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

    // Trigger the approval action
    triggerMusterRollApprove(newFilter, StatusEnum.PENDING_FOR_APPROVAL);
  };

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
    if (status.code == StatusEnum.PENDING_FOR_APPROVAL) {
      setRowsPerPage(5); // Update the rows per page state
      setCurrentPage(1);
      setSelectedStatus(StatusEnum.PENDING_FOR_APPROVAL);
      triggerMusterRollApprove(Digit.SessionStorage.get("paymentInbox"), StatusEnum.PENDING_FOR_APPROVAL, 5, 1);
    } else {
      setRowsPerPage(5); // Update the rows per page state
      setCurrentPage(1);
      setSelectedStatus(StatusEnum.APPROVED);
      triggerMusterRollApprove(Digit.SessionStorage.get("paymentInbox"), StatusEnum.APPROVED, 5, 1);
    }
  };

  const resetTable = () => {
    setchildrenData([]);
    setFilterCriteria(null);
    setSelectedProject({});
    setCard(false);
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
              <CustomFilter
                resetTable={resetTable}
                isRequired={ScreenTypeEnum.REGISTER}
                onProjectSelect={handleProjectChange}
                projectData={selectedProject}
                onFilterChange={handleFilterUpdate}
              ></CustomFilter>
            </div>
          </div>

          <div style={{ width: "100%", display: "flex", flexDirection: "row", gap: "24px" }}>
            <div style={{ width: "100%", display: "flex", flexDirection: "column", height: "60vh", minHeight: "60vh" }}>
              {card == false ? (
                <Card style={{ maxWidth: "100%", overflow: "auto", margin: "0px", padding: "0px" }}></Card>
              ) : (
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
