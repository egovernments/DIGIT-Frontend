import React, { Fragment, useState, useEffect, useMemo } from "react";
import SearchJurisdiction from "../../components/SearchJurisdiction";
import { useHistory } from "react-router-dom";
import { Card, Tab, Button, SVG, Loader, ActionBar, Toast } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import InboxFilterWrapper from "../../components/InboxFilterWrapper";
import DataTable from "react-data-table-component";
import { CheckBox } from "@egovernments/digit-ui-components";
import WorkflowCommentPopUp from "../../components/WorkflowCommentPopUp";
import { tableCustomStyle } from "../../components/tableCustomStyle";

const PlanInbox = () => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const url = Digit.Hooks.useQueryParams();
  const microplanId = url?.microplanId;
  const campaignId = url?.campaignId;
  const history = useHistory();
  const [villagesSlected, setVillagesSelected] = useState(0);
  const [showTab, setShowTab] = useState(true);
  const user = Digit.UserService.getUser();
  const [jurisdiction, setjurisdiction] = useState([]);
  const [hierarchyLevel, setHierarchyLevel] = useState("");
  const [censusData, setCensusData] = useState([]);
  const [boundaries, setBoundaries] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [activeFilter, setActiveFilter] = useState({});
  const [actionBarPopUp, setactionBarPopUp] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [workFlowPopUp, setworkFlowPopUp] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [showToast, setShowToast] = useState(null);
  const [availableActionsForUser, setAvailableActionsForUser] = useState([]);
  const [limitAndOffset, setLimitAndOffset] = useState({ limit: rowsPerPage, offset: (currentPage - 1) * rowsPerPage });
  const [activeLink, setActiveLink] = useState({
    code: "ASSIGNED_TO_ME",
    name: "ASSIGNED_TO_ME",
  });

  const userRoles = user?.info?.roles?.map((roleData) => roleData?.code);

  // Check if the user has the 'rootapprover' role
  const isRootApprover = userRoles?.includes("ROOT_PLAN_ESTIMATION_APPROVER");

  const { isLoading: isLoadingPlanObject, data: planObject, error: errorPlan, refetch: refetchPlan } = Digit.Hooks.microplanv1.useSearchPlanConfig(
    {
      PlanConfigurationSearchCriteria: {
        tenantId,
        id: microplanId,
      },
    },
    {
      enabled: isRootApprover ? true : false,
      //   queryKey: currentKey,
    }
  );

  useEffect(() => {
    if (selectedFilter === "PENDING_FOR_VALIDATION") {
      setActiveLink({ code: "", name: "" });
      setShowTab(false);
    }
  }, [selectedFilter]);

  const selectProps = {
    hideLabel: true,
    // isIntermediate: isIntermediate,
    mainClassName: "data-table-select-checkbox",
  };

  const handlePageChange = (page, totalRows) => {
    setCurrentPage(page);
    setLimitAndOffset({ ...limitAndOffset, offset: (page - 1) * rowsPerPage });
  };

  const handleRowSelect = (event) => {
    setSelectedRows(event?.selectedRows);
    setVillagesSelected(event?.selectedCount);
  };

  const handlePerRowsChange = (currentRowsPerPage, currentPage) => {
    setRowsPerPage(currentRowsPerPage);
    setCurrentPage(1);
    setLimitAndOffset({ limit: currentRowsPerPage, offset: (currentPage - 1) * currentRowsPerPage });
  };

  const {
    isLoading: isPlanWithCensusLoading,
    data: planWithCensus,
    error: planWithCensusError,
    refetch: refetchPlanWithCensus,
  } = Digit.Hooks.microplanv1.usePlanSearchWithCensus({
    tenantId: tenantId,
    microplanId: microplanId,
    body: {
      PlanSearchCriteria: {
        tenantId: tenantId,
        active: true,
        jurisdiction: jurisdiction,
        status: selectedFilter !== null && selectedFilter !== undefined ? selectedFilter : "",
        assignee: activeLink.code === "ASSIGNED_TO_ME" && selectedFilter !== "PENDING_FOR_VALIDATION" ? user?.info?.uuid : "",
        // assignee: activeLink.code === "ASSIGNED_TO_ME" ? user?.info?.uuid : "",
        planConfigurationId: microplanId, //list of plan ids
        limit: limitAndOffset?.limit,
        offset: limitAndOffset?.offset,
      },
    },
    config: {
      enabled: jurisdiction?.length > 0 ? true : false,
      select: (data) => {
        const tableData = data?.planData?.map((item, index) => {
          const filteredCensus = data?.censusData?.find((d) => d?.boundaryCode === item?.locality);
          const dynamicSecurityData = Object.keys(filteredCensus?.additionalDetails?.securityDetails || {}).reduce((acc, key) => {
            acc[`securityDetail_${key}`] = filteredCensus?.additionalDetails?.securityDetails[key]?.code || "NA"; // Correctly referencing securityDetails
            return acc;
          }, {});

          return {
            original: item,
            village: filteredCensus?.boundaryCode || "NA",
            villageRoadCondition: filteredCensus?.additionalDetails?.accessibilityDetails?.roadCondition?.code || "NA",
            villageTerrain: filteredCensus?.additionalDetails?.accessibilityDetails?.terrain?.code || "NA",
            villageTransportMode: filteredCensus?.additionalDetails?.accessibilityDetails?.transportationMode?.code || "NA",
            totalPop: filteredCensus?.additionalDetails?.totalPopulation || "NA",
            targetPop: filteredCensus?.additionalDetails?.targetPopulation || "NA",
            ...dynamicSecurityData,
          };
        });
        return {
          planData: data?.planData,
          censusData: data?.censusData,
          StatusCount: data?.StatusCount,
          TotalCount: data?.TotalCount,
          tableData,
        };
      },
    },
  });

  const onSearch = (selectedBoundaries) => {
    // Extract the list of codes from the selectedBoundaries array
    const boundaryCodes = selectedBoundaries.map((boundary) => boundary.code);

    // Set jurisdiction with the list of boundary codes
    setjurisdiction(boundaryCodes);
  };

  // need to add table and filter card

  const {
    isLoading: isLoadingCampaignObject,
    data: campaignObject,
    error: errorCampaign,
    refetch: refetchCampaign,
  } = Digit.Hooks.microplanv1.useSearchCampaign(
    {
      CampaignDetails: {
        tenantId,
        ids: [campaignId],
      },
    },
    {
      enabled: url?.campaignId ? true : false,
      // queryKey: currentKey,
    }
  );

  // Effect to update boundary based on campaign data
  useEffect(() => {
    if (campaignObject?.boundaries) {
      setBoundaries(campaignObject?.boundaries);
    }
  }, [campaignObject]);

  const {
    isLoading: isPlanEmpSearchLoading,
    data: planEmployee,
    error: planEmployeeError,
    refetch: refetchPlanEmployee,
  } = Digit.Hooks.microplanv1.usePlanSearchEmployeeWithTagging({
    tenantId: tenantId,
    body: {
      PlanEmployeeAssignmentSearchCriteria: {
        tenantId: tenantId,
        active: true,
        planConfigurationId: url?.microplanId,
        role: ["PLAN_ESTIMATION_APPROVER", "ROOT_PLAN_ESTIMATION_APPROVER"],
        employeeId: [user?.info?.uuid],
      },
    },
    config: {
      enabled: true,
    },
  });

  useEffect(() => {
    if (planEmployee?.planData) {
      setjurisdiction(planEmployee?.planData?.[0]?.jurisdiction);
      setHierarchyLevel(planEmployee?.planData?.[0]?.hierarchyLevel);
    }
  }, [planEmployee]);

  const onClear = () => {
    setjurisdiction(planEmployee?.planData?.[0]?.jurisdiction);
  };

  const { isLoading: isWorkflowLoading, data: workflowData, revalidate, refetch: refetchBussinessService } = Digit.Hooks.useCustomAPIHook({
    url: "/egov-workflow-v2/egov-wf/businessservice/_search",
    params: {
      tenantId: tenantId,
      businessServices: "PLAN_ESTIMATION",
    },
    config: {
      enabled: selectedFilter ? true : false,
      select: (data) => {
        return data.BusinessServices?.[0];
      },
    },
  });

  useEffect(() => {
    if (workflowData) {
      // Assume selectedFilter maps to applicationStatus or state
      const selectedState = workflowData?.states?.find((state) => state.state === selectedFilter);

      // Filter actions based on the selected state
      const availableActions = selectedState?.actions?.filter((action) => action.roles.some((role) => userRoles.includes(role)));

      // Update the available actions state
      setAvailableActionsForUser(availableActions || []);
    }
  }, [workflowData, selectedFilter]);

  // if availableActionsForUser is defined and is an array
  const actionsMain = availableActionsForUser?.length > 0 ? availableActionsForUser : [];

  // actionsToHide array by checking for "EDIT" in the actionMap
  const actionsToHide = actionsMain?.filter((action) => action?.action?.includes("EDIT"))?.map((action) => action?.action);

  useEffect(() => {
    if (planWithCensus) {
      setCensusData(planWithCensus?.censusData);
      setTotalRows(planWithCensus?.TotalCount);
      const reorderedStatusCount = Object.fromEntries(
        Object.entries(planWithCensus?.StatusCount || {}).sort(([keyA], [keyB]) => {
          if (keyA === "PENDING_FOR_VALIDATION") return -1;
          if (keyB === "PENDING_FOR_VALIDATION") return 1;
          return 0;
        })
      );
      setActiveFilter(reorderedStatusCount);
      const activeFilterKeys = Object.keys(reorderedStatusCount || {});
      if (selectedFilter === null || selectedFilter === undefined || selectedFilter === "" || !activeFilterKeys.includes(selectedFilter)) {
        setSelectedFilter(activeFilterKeys[0]);
      }
      setVillagesSelected(0);
      setSelectedRows([]);
    }
  }, [planWithCensus, selectedFilter, activeLink]);

  useEffect(() => {
    if (jurisdiction?.length > 0) {
      refetchPlanEmployee(); // Trigger the API call again after activeFilter changes
    }
  }, [selectedFilter, activeLink, jurisdiction, limitAndOffset]);

  useEffect(() => {
    if (selectedFilter === "PENDING_FOR_VALIDATION") {
      setActiveLink({ code: "", name: "" });
      setShowTab(false);
    }
  }, [selectedFilter]);

  const onFilter = (selectedStatus) => {
    setSelectedFilter(selectedStatus?.code);
  };

  const clearFilters = () => {
    if (selectedFilter !== Object.entries(planWithCensus?.StatusCount)?.[0]?.[0]) {
      setSelectedFilter(Object.entries(planWithCensus?.StatusCount)?.[0]?.[0]);
    }
  };

  const handleActionClick = (action) => {
    setworkFlowPopUp(action);
  };

  const resources = planWithCensus?.planData?.[0]?.resources || []; // Resources array
  const resourceColumns = resources.map((resource) => ({
    name: t(`RESOURCE_TYPE_${resource.resourceType}`), // Dynamic column name for each resourceType
    cell: (row) => {
      return resource.estimatedNumber ? resource.estimatedNumber : "NA"; // Return estimatedNumber if exists
    },
    sortable: true,
  }));

  const columns = [
    {
      name: t(`INBOX_VILLAGE`),
      cell: (row) => row?.village || "NA",
      sortable: true,
    },
    {
      name: t(`VILLAGE_ROAD_CONDITION`),
      cell: (row) => row?.villageRoadCondition || "NA",
      sortable: true,
    },
    {
      name: t(`VILLAGE_TERRAIN`),
      cell: (row) => row?.villageTerrain || "NA",
      sortable: true,
    },
    {
      name: t(`VILLAGE_TARNSPORTATION_MODE`),
      cell: (row) => row?.villageTransportMode || "NA",
      sortable: true,
    },
    {
      name: t(`TOTAL_POPULATION`),
      cell: (row) => row?.totalPop || "NA",
      sortable: true,
    },
    {
      name: t(`TARGET_POPULATION`),
      cell: (row) => row?.targetPop || "NA",
      sortable: true,
    },
    ...resourceColumns,
  ];

  // // Always return an array for `securityColumns`, even if it's empty
  // const sampleSecurityData = planWithCensus?.censusData?.[0]?.additionalDetails?.securityDetails || {};
  // const securityColumns = Object.keys(sampleSecurityData).map((key) => ({
  //   name: t(`SECURITY_DETAIL_${key}`),
  //   cell: (row) => row[`securityDetail_${key}`],
  //   sortable: true,
  // }));

  // Combine base columns and security columns
  // This function will update the workflow action for every selected row
  const updateWorkflowForSelectedRows = () => {
    const updatedRows = selectedRows?.map(({ original }) => ({
      ...original,
      workflow: {
        ...original.workflow, // Keep existing workflow properties if any
        action: workFlowPopUp,
      },
    }));

    return updatedRows;
  };

  // Function to check the status count condition
  const isStatusConditionMet = (statusCount) => {
    // Extract all keys and values from statusCount object
    const statusValues = Object.keys(statusCount).map((key) => statusCount[key]);

    // Check if all statuses except "VALIDATED" are 0, and "VALIDATED" is more than 0
    return Object.keys(statusCount).every((key) => (key === "VALIDATED" ? statusCount[key] > 0 : statusCount[key] === 0));
  };

  const updateWorkflowForFooterAction = () => {
    const updatedPlanConfig = {
      ...planObject,
      workflow: {
        ...planObject?.workflow, // Keep existing workflow properties if any
        action: "APPROVE_ESTIMATIONS",
      },
    };

    return updatedPlanConfig;
  };

  const closePopUp = () => {
    setworkFlowPopUp("");
  };

  const handleActionBarClick = () => {
    setactionBarPopUp(true);
  };

  const closeActionBarPopUp = () => {
    setactionBarPopUp(false);
  };

  if (isPlanEmpSearchLoading || isLoadingCampaignObject || isWorkflowLoading) {
    return <Loader />;
  }

  return (
    <div className="pop-inbox-wrapper">
      <SearchJurisdiction
        boundaries={boundaries}
        jurisdiction={{
          boundaryType: hierarchyLevel,
          boundaryCodes: jurisdiction,
        }}
        onSubmit={onSearch}
        onClear={onClear}
      />

      <div className="pop-inbox-wrapper-filter-table-wrapper">
        <InboxFilterWrapper
          options={activeFilter}
          onApplyFilters={onFilter}
          clearFilters={clearFilters}
          defaultValue={
            selectedFilter === Object.entries(activeFilter)?.[0]?.[0]
              ? { [Object.entries(activeFilter)?.[0]?.[0]]: Object.entries(activeFilter)?.[0]?.[1] }
              : null
          }
        ></InboxFilterWrapper>

        <div className={"pop-inbox-table-wrapper"}>
          {showTab && (
            <Tab
              activeLink={activeLink?.code}
              configItemKey="code"
              itemStyle={{ width: "unset !important" }}
              configNavItems={[
                {
                  code: "ASSIGNED_TO_ME",
                  name: "ASSIGNED_TO_ME",
                },
                {
                  code: "ASSIGNED_TO_ALL",
                  name: "ASSIGNED_TO_ALL",
                },
              ]}
              navStyles={{}}
              onTabClick={(e) => {
                setActiveLink(e);
              }}
              setActiveLink={setActiveLink}
              showNav
              style={{}}
            />
          )}
          <Card className="microPlanBulkTable" type={"primary"}>
            {villagesSlected !== 0 && (
              <div className="selection-state-wrapper">
                <div className="svg-state-wrapper">
                  <SVG.DoneAll width={"1.5rem"} height={"1.5rem"} fill={"#C84C0E"}></SVG.DoneAll>
                  <div className={"selected-state"}>{`${villagesSlected} ${t("MICROPLAN_VILLAGES_SELECTED")}`}</div>
                </div>

                <div className={`table-actions-wrapper`}>
                  {actionsMain
                    ?.filter((action) => !actionsToHide.includes(action.action))
                    ?.map((action, index) => (
                      <Button
                        key={index}
                        variation="secondary"
                        label={t(action.action)}
                        type="button"
                        onClick={(action) => handleActionClick(action?.target?.textContent)}
                        size={"large"}
                      />
                    ))}
                </div>

                {workFlowPopUp !== "" && (
                  <WorkflowCommentPopUp
                    onClose={closePopUp}
                    heading={t(`SEND_FOR_${workFlowPopUp}`)}
                    submitLabel={t(`SEND_FOR_${workFlowPopUp}`)}
                    url="/plan-service/plan/bulk/_update"
                    requestPayload={{ Plans: updateWorkflowForSelectedRows() }}
                    commentPath="workflow.comments"
                    onSuccess={(data) => {
                      closePopUp();
                      setShowToast({ key: "success", label: t("WORKFLOW_UPDATE_SUCCESS"), transitionTime: 5000 });
                      refetchPlanWithCensus();
                    }}
                    onError={(data) => {
                      closePopUp();
                      setShowToast({ key: "error", label: t(error?.response?.data?.Errors?.[0]?.code) });
                    }}
                  />
                )}
              </div>
            )}
            {isPlanWithCensusLoading ? <Loader /> : null}
            <DataTable
              columns={columns}
              data={planWithCensus?.tableData}
              pagination
              paginationServer
              selectableRows
              selectableRowsHighlight
              onChangeRowsPerPage={handlePerRowsChange}
              onChangePage={handlePageChange}
              noContextMenu
              onSelectedRowsChange={handleRowSelect}
              selectableRowsComponentProps={selectProps}
              selectableRowsComponent={CheckBox}
              customStyles={tableCustomStyle}
              paginationTotalRows={totalRows}
              paginationPerPage={rowsPerPage}
              paginationRowsPerPageOptions={[10, 20, 50, 100]}
              // selectableRowsComponent={SimpleCheckbox}
              // selectableRowsComponent={SimpleCheckbox}
            />
          </Card>
        </div>
      </div>

      {isRootApprover && isStatusConditionMet(activeFilter) && (
        <ActionBar
          actionFields={[
            <Button
              icon="CheckCircle"
              label={t(`HCM_MICROPLAN_FINALIZE_MICROPLAN`)}
              onClick={handleActionBarClick}
              type="button"
              variation="primary"
            />,
          ]}
          className=""
          maxActionFieldsAllowed={5}
          setactionFieldsToRight
          sortActionFields
          style={{}}
        />
      )}

      {actionBarPopUp && (
        <WorkflowCommentPopUp
          onClose={closeActionBarPopUp}
          heading={t(`HCM_MICROPLAN_FINALIZE_MICROPLAN`)}
          submitLabel={t(`HCM_MICROPLAN_FINALIZE_MICROPLAN`)}
          url="/plan-service/config/_update"
          requestPayload={{ PlanConfiguration: updateWorkflowForFooterAction() }}
          commentPath="workflow.comments"
          onSuccess={(data) => {
            history.push(`/${window.contextPath}/employee/microplan/microplan-success`, {
              fileName: "filename", // need to update when api is success
              message: "FINALISE_MICROPLAN_SUCCESSFUL",
              back: "GO_BACK_TO_HOME",
              backlink: "/employee",
            });
          }}
          onError={(data) => {
            setShowToast({ key: "error", label: t(error?.response?.data?.Errors?.[0]?.code) });
          }}
        />
      )}
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
    </div>
  );
};

export default PlanInbox;
