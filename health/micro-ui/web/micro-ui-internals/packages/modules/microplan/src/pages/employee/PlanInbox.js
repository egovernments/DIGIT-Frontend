import React, { Fragment, useState, useEffect, useMemo } from "react";
import SearchJurisdiction from "../../components/SearchJurisdiction";
import { useHistory } from "react-router-dom";
import { Card, Tab, Button, SVG, Loader, ActionBar, Toast, ButtonsGroup, NoResultsFound } from "@egovernments/digit-ui-components";
import { Header } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import InboxFilterWrapper from "../../components/InboxFilterWrapper";
import DataTable from "react-data-table-component";
import { CheckBox } from "@egovernments/digit-ui-components";
import WorkflowCommentPopUp from "../../components/WorkflowCommentPopUp";
import { tableCustomStyle } from "../../components/tableCustomStyle";
import { CustomSVG } from "@egovernments/digit-ui-components";
import { useMyContext } from "../../utils/context";
import ConfirmationPopUp from "../../components/ConfirmationPopUp";
import VillageHierarchyTooltipWrapper from "../../components/VillageHierarchyTooltipWrapper";

const PlanInbox = () => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { state } = useMyContext();
  const url = Digit.Hooks.useQueryParams();
  const microplanId = url?.microplanId;
  const campaignId = url?.campaignId;
  const history = useHistory();
  const [villagesSlected, setVillagesSelected] = useState(0);
  const [showTab, setShowTab] = useState(true);
  const user = Digit.UserService.getUser();
  const [jurisdiction, setjurisdiction] = useState([]);
  const [censusJurisdiction, setCensusJurisdiction] = useState([]);
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
  const [assignedToMeCount, setAssignedToMeCount] = useState(0);
  const [assignedToAllCount, setAssignedToAllCount] = useState(0);
  const [showToast, setShowToast] = useState(null);
  const [disabledAction, setDisabledAction] = useState(false);
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
    if (selectedFilter === "VALIDATED") {
      setActiveLink({ code: "", name: "" });
      setShowTab(false);
    } else {
      if (!showTab) {
        setActiveLink({
          code: "ASSIGNED_TO_ME",
          name: "ASSIGNED_TO_ME",
        });
        setShowTab(true);
      }
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
        jurisdiction: censusJurisdiction,
        status: selectedFilter !== null && selectedFilter !== undefined ? selectedFilter : "",
        ...(activeLink.code == "ASSIGNED_TO_ALL" || selectedFilter == "VALIDATED" ? {} : { assignee: user.info.uuid }),
        planConfigurationId: microplanId, //list of plan ids
        limit: limitAndOffset?.limit,
        offset: limitAndOffset?.offset,
      },
    },
    config: {
      enabled: censusJurisdiction?.length > 0 ? true : false,
      select: (data) => {
        const tableData = data?.planData?.map((item, index) => {
          const filteredCensus = data?.censusData?.find((d) => d?.boundaryCode === item?.locality);
          const dynamicSecurityData = Object.keys(filteredCensus?.additionalDetails?.securityDetails || {}).reduce((acc, key) => {
            acc[`securityDetail_${key}`] = filteredCensus?.additionalDetails?.securityDetails[key]?.code || "NA"; // Correctly referencing securityDetails
            return acc;
          }, {});

          const dynamicResource = item?.resources?.reduce((acc, item) => {
            if (item?.resourceType && item?.estimatedNumber !== undefined) {
              acc[item?.resourceType] = item?.estimatedNumber;
            }
            return acc;
          }, {});

          const dynamicAdditionalFields = filteredCensus?.additionalFields
            ?.filter((field) => field.editable === false) // Filter fields where `editable` is `false`
            ?.sort((a, b) => a.order - b.order) // Sort by `order`
            ?.reduce((acc, field) => {
              acc[field.key] = field.value; // Set `key` as property name and `value` as property value
              return acc;
            }, {});

          return {
            original: item,
            censusOriginal: filteredCensus,
            village: filteredCensus?.boundaryCode || "NA",
            villageRoadCondition: filteredCensus?.additionalDetails?.accessibilityDetails?.roadCondition?.code || "NA",
            villageTerrain: filteredCensus?.additionalDetails?.accessibilityDetails?.terrain?.code || "NA",
           // villageTransportMode: filteredCensus?.additionalDetails?.accessibilityDetails?.transportationMode?.code || "NA",
            totalPop: filteredCensus?.additionalDetails?.totalPopulation || "NA",
            targetPop: filteredCensus?.additionalDetails?.targetPopulation || "NA",
            ...dynamicSecurityData,
            ...dynamicResource,
            ...dynamicAdditionalFields,
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
    if (selectedBoundaries.length === 0) {
      setShowToast({ key: "warning", label: t("MICROPLAN_BOUNDARY_IS_EMPTY_WARNING"), transitionTime: 5000 });
    } else {

      setActiveLink({
        code: "ASSIGNED_TO_ME",
        name: "ASSIGNED_TO_ME"
      });

      // Extract the list of codes from the selectedBoundaries array
      const boundaryCodes = selectedBoundaries.map((boundary) => boundary.code);

      // Set census jurisdiction with the list of boundary codes
      setCensusJurisdiction(boundaryCodes);
    }
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
      setCensusJurisdiction(planEmployee?.planData?.[0]?.jurisdiction);
      setHierarchyLevel(planEmployee?.planData?.[0]?.hierarchyLevel);
    }
  }, [planEmployee]);

  const onClear = () => {
    setCensusJurisdiction(planEmployee?.planData?.[0]?.jurisdiction);
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
      if (activeLink.code === "ASSIGNED_TO_ME") {
        setAssignedToMeCount(planWithCensus?.TotalCount);
        setAssignedToAllCount(planWithCensus?.StatusCount[selectedFilter] || 0)
      } else {
        setAssignedToAllCount(planWithCensus?.TotalCount);
      }

    }
  }, [planWithCensus, selectedFilter, activeLink]);

  useEffect(() => {
    if (censusJurisdiction?.length > 0) {
      refetchPlanWithCensus(); // Trigger the API call again after activeFilter changes
    }
  }, [selectedFilter, activeLink, censusJurisdiction, limitAndOffset]);


  // fetch the process instance for the current microplan to check if we need to disabled actions or not  
  const { isLoading:isProcessLoading, data: processData, } = Digit.Hooks.useCustomAPIHook({
    url: "/egov-workflow-v2/egov-wf/process/_search",
    params: {
       tenantId: tenantId,
       history: true,
        businessIds: microplanId,
   },
    config: {
        enabled: true,
        select: (data) => {
          return data?.ProcessInstances;
     },
    },
  });

  useEffect(() => {
    if (processData && processData.some((instance) => instance.action === "APPROVE_ESTIMATIONS")) {
      setDisabledAction(true);
    }
  }, [processData]);

  useEffect(() => {
    if (selectedFilter === "VALIDATED") {
      setActiveLink({ code: "", name: "" });
      setShowTab(false);
    } else {
      if (!showTab) {
        setActiveLink({
          code: "ASSIGNED_TO_ME",
          name: "ASSIGNED_TO_ME",
        });
        setShowTab(true);
      }
    }
  }, [selectedFilter]);

  const onFilter = (selectedStatus) => {
    setSelectedFilter(selectedStatus?.code);
    setActiveLink({
      code: "ASSIGNED_TO_ME",
      name: "ASSIGNED_TO_ME"
    });
  };

  const clearFilters = () => {
    if (selectedFilter !== Object.entries(activeFilter)?.[0]?.[0]) {
      setSelectedFilter(Object.entries(activeFilter)?.[0]?.[0]);
    }
  };

  const handleActionClick = (action) => {
    setworkFlowPopUp(action);
  };

  const getResourceColumns = () => {
    const resources = planWithCensus?.planData?.[0]?.resources || []; // Resources array
    return (resources || []).map((resource) => ({
      name: t(resource.resourceType), // Dynamic column name for each resourceType
      cell: (row) => {
        return row?.[resource?.resourceType] || "NA"; // Return estimatedNumber if exists
      },
      sortable: true,
      width: "180px",
    }));
  };

  const getAdditionalFieldsColumns = () => {
    return (planWithCensus?.censusData?.[0]?.additionalFields || [])
      .filter((field) => !field?.editable)
      .sort((a, b) => a?.order - b?.order)
      .map((field) => ({
        name: t(field?.key),
        selector: (row) => {
          return row?.[field?.key] || t("ES_COMMON_NA");
        },
        sortable: true,
        width: "180px",
      }));
  };

  const getSecurityDetailsColumns = () => {
    // const sampleSecurityData = planWithCensus?.censusData?.[0]?.additionalDetails?.securityDetails || {};
    const securityColumns = state?.securityQuestions?.map((i) => {
      return {
        name: t(i?.question),
        cell: (row) => row?.[`securityDetail_${i?.question}`] || t("ES_COMMON_NA"),
        sortable: true,
        width: "180px",
      };
    });
    // const securityColumns = Object.keys(sampleSecurityData).map((key) => ({
    //   name: t(`${key}`),
    //   cell: (row) => row[`securityDetail_${key}`],
    //   sortable: true,
    //   width: "180px",
    // }));
    return securityColumns;
  };
  const columns = [
    {
      name: t(`INBOX_VILLAGE`),
      cell: (row) => (
        <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
          <span>{t(`${row?.village}`)}</span>
          <VillageHierarchyTooltipWrapper boundaryCode={row?.village} />
        </div>
      ),
      // cell: (row) => t(row?.village) || "NA",
      sortable: true,
      width: "180px",
    },
    {
      name: t(`HCM_MICROPLAN_VILLAGE_ROAD_CONDITION_LABEL`),
      cell: (row) => t(row?.villageRoadCondition) || "NA",
      sortable: true,
      width: "180px",
    },
    {
      name: t(`HCM_MICROPLAN_VILLAGE_TERRAIN_LABEL`),
      cell: (row) => t(row?.villageTerrain) || "NA",
      sortable: true,
      width: "180px",
    },
    // {
    //   name: t(`HCM_MICROPLAN_VILLAGE_TRANSPORTATION_MODE_LABEL`),
    //   cell: (row) => t(row?.villageTransportMode) || "NA",
    //   sortable: true,
    //   width: "180px",
    // },
    ...getSecurityDetailsColumns(),
    ...getAdditionalFieldsColumns(),
    ...getResourceColumns(),
    // {
    //   name: t(`TOTAL_POPULATION`),
    //   cell: (row) => t(row?.totalPop) || "NA",
    //   sortable: true,
    // },
    // {
    //   name: t(`TARGET_POPULATION`),
    //   cell: (row) => t(row?.targetPop) || "NA",
    //   sortable: true,
    // },
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

  const conditionalRowStyles = [
    {
      when: (row) => selectedRows.some((selectedRow) => selectedRow?.original?.id === row?.original?.id),
      style: {
        backgroundColor: "#FBEEE8",
      },
      classNames: ["selectedRow"],
    },
  ];

  const actionIconMap = {
    VALIDATE: { isSuffix: false, icon: "CheckCircle" },
    EDIT_AND_SEND_FOR_APPROVAL: { isSuffix: false, icon: "Edit" },
    APPROVE: { isSuffix: false, icon: "CheckCircle" },
    ROOT_APPROVE: { isSuffix: false, icon: "CheckCircle" },
    SEND_BACK_FOR_CORRECTION: { isSuffix: true, icon: "ArrowForward" },
  };

  const getButtonState = (action) => {
    
    if (selectedFilter === "PENDING_FOR_VALIDATION" && action === "VALIDATE") {
      return true;
    }
    if (selectedFilter === "PENDING_FOR_APPROVAL" && (action === "APPROVE" || action === "ROOT_APPROVE")) {
      return true;
    }
    if (selectedFilter === "VALIDATED" && action === "SEND_BACK_FOR_CORRECTION") {
      return true;
    }
    return false;
  };

  if (isPlanEmpSearchLoading || isLoadingCampaignObject || isWorkflowLoading || isProcessLoading) {
    return <Loader />;
  }
  // campaignObject?.campaignName 
   //role and name of User extracted

   const roles=Digit.UserService.getUser().info.roles;
   const userName=Digit.UserService.getUser().info.userName;
   let userRole = "";
 
   roles.forEach(role => {
     if (role.code === "ROOT_PLAN_ESTIMATION_APPROVER") {
       userRole = "ROOT_PLAN_ESTIMATION_APPROVER";
     } else if (userRole!== "ROOT_PLAN_ESTIMATION_APPROVER" && role.code === "PLAN_ESTIMATION_APPROVER") {
       userRole = "PLAN_ESTIMATION_APPROVER";
     
   }});
  return (
    <div className="pop-inbox-wrapper">
       <div>
      <Header styles={{marginBottom:"1rem"}} className="pop-inbox-header">{t(`HCM_MICROPLAN_VALIDATE_AND_APPROVE_MICROPLAN_ESTIMATIONS`)}</Header>
      <div className="role-summary-sub-heading">
          <div>
          {`${t("HCM_MICROPLAN_MICROPLAN_NAME_LABEL")}: ${campaignObject?.campaignName  || t("NO_NAME_AVAILABLE")}`}
          </div>
          <div>
          {`Logged in as ${t(userName)} - ${t(userRole)}`}
          </div>
          
        </div>
    </div>
      <SearchJurisdiction
        boundaries={boundaries}
        jurisdiction={{
          boundaryType: hierarchyLevel,
          boundaryCodes: jurisdiction,
        }}
        onSubmit={onSearch}
        onClear={onClear}
      />

      <div className="pop-inbox-wrapper-filter-table-wrapper" style={{ marginBottom: (isRootApprover && isStatusConditionMet(activeFilter) && planObject?.status === "RESOURCE_ESTIMATION_IN_PROGRESS") || (!isRootApprover && isStatusConditionMet(activeFilter) && planObject?.status === "RESOURCE_ESTIMATION_IN_PROGRESS") || disabledAction? "2.5rem" : "0rem" }}>
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
              configDisplayKey="name"
              itemStyle={{ width: "290px" }}
              configNavItems={[
                {
                    code: "ASSIGNED_TO_ME",
                    name: `${`${t(`ASSIGNED_TO_ME`)} (${assignedToMeCount})`}`,
                  },
                  {
                    code: "ASSIGNED_TO_ALL",
                    name: `${`${t(`ASSIGNED_TO_ALL`)} (${assignedToAllCount})`}`,
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
                  {actionsMain?.filter((action) => !actionsToHide.includes(action.action)).length > 1 ? (
                    <ButtonsGroup
                      buttonsArray={actionsMain
                        ?.filter((action) => !actionsToHide.includes(action.action))
                        ?.map((action, index) => {

                          const isPrimary = getButtonState(action.action);

                          return(
                          <Button
                            key={index}
                            variation={isPrimary ? "primary" : "secondary"}
                            label={t(action.action)}
                            type="button"
                            onClick={(curr) => handleActionClick(action?.action)}
                            size="large"
                            icon={actionIconMap[action.action]?.icon}
                            isSuffix={actionIconMap[action.action]?.isSuffix}
                          />
                        );
                      })}
                    />
                  ) : (
                    actionsMain
                      ?.filter((action) => !actionsToHide.includes(action.action))
                      ?.map((action, index) => {

                        const isPrimary = getButtonState(action.action);

                        return(
                        <Button
                          key={index}
                          variation={isPrimary ? "primary" : "secondary"}
                          label={t(action.action)}
                          type="button"
                          onClick={(curr) => handleActionClick(action?.action)}
                          size="large"
                          icon={actionIconMap[action.action]?.icon}
                          isSuffix={actionIconMap[action.action]?.isSuffix}
                        />
                      );
                    })
                  )}
                </div>

                {workFlowPopUp !== "" && (
                  <WorkflowCommentPopUp
                    onClose={closePopUp}
                    heading={t(`PLAN_INBOX_SEND_FOR_${workFlowPopUp}_HEADING_LABEL`)}
                    submitLabel={t(`PLAN_INBOX_SEND_FOR_${workFlowPopUp}_SUBMIT_LABEL`)}
                    url="/plan-service/plan/bulk/_update"
                    requestPayload={{ Plans: updateWorkflowForSelectedRows() }}
                    commentPath="workflow.comments"
                    onSuccess={(data) => {
                      closePopUp();
                      setShowToast({ key: "success", label: t(`PLAN_INBOX_WORKFLOW_FOR_${workFlowPopUp}_UPDATE_SUCCESS`), transitionTime: 5000 });
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
            {isPlanWithCensusLoading ? (
              <Loader />
            ) : planWithCensus?.tableData?.length===0 ? <NoResultsFound style={{height:selectedFilter === "VALIDATED" ? "472px" : "408px"}} text={t(`HCM_MICROPLAN_NO_DATA_FOUND_FOR_PLAN_INBOX_PLAN`)} /> : (
              <DataTable
                columns={columns}
                data={planWithCensus?.tableData}
                pagination
                paginationServer
                selectableRows={!disabledAction}
                selectableRowsHighlight
                onChangeRowsPerPage={handlePerRowsChange}
                onChangePage={handlePageChange}
                noContextMenu
                onSelectedRowsChange={handleRowSelect}
                selectableRowsComponentProps={selectProps}
                selectableRowsComponent={CheckBox}
                customStyles={tableCustomStyle}
                paginationTotalRows={totalRows}
                conditionalRowStyles={conditionalRowStyles}
                paginationPerPage={rowsPerPage}
                paginationRowsPerPageOptions={[10, 20, 50, 100]}
                sortIcon={<CustomSVG.SortUp width={"16px"} height={"16px"} fill={"#0b4b66"} />}
              />
            )}
          </Card>
        </div>
      </div>

      {isRootApprover && isStatusConditionMet(activeFilter) && planObject?.status === "RESOURCE_ESTIMATION_IN_PROGRESS" && (
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

{(!isRootApprover && isStatusConditionMet(activeFilter) && planObject?.status === "RESOURCE_ESTIMATION_IN_PROGRESS") || disabledAction && (
        <ActionBar
          actionFields={[
            <Button label={t(`HCM_MICROPLAN_PLAN_INBOX_BACK_BUTTON`)} onClick={()=> {
              history.push(`/${window.contextPath}/employee/microplan/select-activity?microplanId=${url?.microplanId}&campaignId=${url?.campaignId}`);
            }} type="button" variation="primary" />,
          ]}
          className=""
          maxActionFieldsAllowed={5}
          setactionFieldsToRight
          sortActionFields
          style={{}}
        />
      )}

      {actionBarPopUp && (
        <ConfirmationPopUp
          onClose={closeActionBarPopUp}
          alertHeading={t(`HCM_MICROPLAN_FINALIZE_MICROPLAN_ALERT_HEADING`)}
          alertMessage={t(`HCM_MICROPLAN_FINALIZE_MICROPLAN_ALERT_MESSAGE`)}
          submitLabel={t(`HCM_MICROPLAN_FINALIZE_MICROPLAN_SUBMIT_LABEL`)}
          cancelLabel={t(`HCM_MICROPLAN_FINALIZE_MICROPLAN_CANCEL_ACTION`)}
          url="/plan-service/config/_update"
          requestPayload={{ PlanConfiguration: updateWorkflowForFooterAction() }}
          onSuccess={(data) => {
            history.push(`/${window.contextPath}/employee/microplan/microplan-success`, {
              responseId: data?.PlanConfiguration?.[0]?.name,
              message: t(`FINALISED_MICROPLAN_SUCCESSFUL`),
              back: t(`GO_BACK_TO_HOME`),
              backlink: `/${window.contextPath}/employee`,
            });
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
