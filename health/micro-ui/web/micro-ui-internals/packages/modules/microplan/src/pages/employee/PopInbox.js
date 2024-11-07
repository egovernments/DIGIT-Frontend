import React, { Fragment, useState, useEffect } from "react";
import SearchJurisdiction from "../../components/SearchJurisdiction";
import { useHistory } from "react-router-dom";
import PopInboxTable from "../../components/PopInboxTable";
import { Card, Tab, Button, SVG, Loader, ActionBar, Toast, ButtonsGroup } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import InboxFilterWrapper from "../../components/InboxFilterWrapper";
import WorkflowCommentPopUp from "../../components/WorkflowCommentPopUp";
import { Header } from "@egovernments/digit-ui-react-components";

const PopInbox = () => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const history = useHistory();
  const url = Digit.Hooks.useQueryParams();
  const microplanId = url?.microplanId;
  const [villagesSlected, setVillagesSelected] = useState(0);
  const [showTab, setShowTab] = useState(true);
  const user = Digit.UserService.getUser();
  const [jurisdiction, setjurisdiction] = useState([]);
  const [hierarchyLevel, setHierarchyLevel] = useState("");
  const [censusData, setCensusData] = useState([]);
  const [boundaries, setBoundaries] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [workFlowPopUp, setworkFlowPopUp] = useState('');
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [actionBarPopUp, setactionBarPopUp] = useState(false);
  const [activeFilter, setActiveFilter] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [assigneeUuids, setAssigneeUuids] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [showToast, setShowToast] = useState(null);
  const [allowAction, setAllowAction] = useState(true);
  const [employeeNameMap, setEmployeeNameMap] = useState({});
  const [availableActionsForUser, setAvailableActionsForUser] = useState([]);
  const [assignedToMeCount, setAssignedToMeCount] = useState(0);
  const [assignedToAllCount, setAssignedToAllCount] = useState(0);
  const [limitAndOffset, setLimitAndOffset] = useState({ limit: rowsPerPage, offset: (currentPage - 1) * rowsPerPage });
  const [activeLink, setActiveLink] = useState({
    code: "ASSIGNED_TO_ME",
    name: "ASSIGNED_TO_ME",
  });


  const userInfo = Digit.UserService.getUser();
  const userRoles = userInfo?.info?.roles?.map((roleData) => roleData?.code);

  // Check if the user has the 'rootapprover' role
  const isRootApprover = userRoles?.includes("ROOT_POPULATION_DATA_APPROVER");


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


  const handleActionBarClick = () => {
    setactionBarPopUp(true);
  };

  const onSearch = (selectedBoundaries) => {
    // Extract the list of codes from the selectedBoundaries array
    const boundaryCodes = selectedBoundaries.map((boundary) => boundary.code);

    // Set jurisdiction with the list of boundary codes
    setjurisdiction(boundaryCodes);

    if (selectedBoundaries.length === 0) {
      setShowToast({ key: "warning", label: t("MICROPLAN_BOUNDARY_IS_EMPTY_WARNING"), transitionTime: 5000 });
    } else {
      // Extract the list of codes from the selectedBoundaries array
      const boundaryCodes = selectedBoundaries.map((boundary) => boundary.code);

      // Set jurisdiction with the list of boundary codes
      setjurisdiction(boundaryCodes);
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
        ids: [url?.campaignId],
      },
    },
    {
      enabled: url?.campaignId ? true : false,
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
        role: ["POPULATION_DATA_APPROVER", "ROOT_POPULATION_DATA_APPROVER"],
        employeeId: [user?.info?.uuid],
      },
    },
    config: {
      enabled: true,
    },
  });

  const closePopUp = () => {
    setworkFlowPopUp('');
  };

  const closeActionBarPopUp = () => {
    setactionBarPopUp(false);
  };

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
      businessServices: "CENSUS",
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
      const selectedState = workflowData?.states?.find(
        (state) => state.state === selectedFilter
      );

      // Filter actions based on the selected state
      const availableActions = selectedState?.actions?.filter((action) =>
        action.roles.some((role) => userRoles.includes(role))
      );

      // Update the available actions state
      setAvailableActionsForUser(availableActions || []);

    }
  }, [workflowData, selectedFilter]);


  // if availableActionsForUser is defined and is an array
  const actionsMain = availableActionsForUser?.length > 0
    ? availableActionsForUser
    : [];


  // actionsToHide array by checking for "EDIT" in the actionMap
  const actionsToHide = actionsMain?.filter(action => action?.action?.includes("EDIT"))?.map(action => action?.action);


  // Custom hook to fetch census data based on microplanId and boundaryCode
  const reqCriteriaResource = {
    url: `/census-service/_search`,
    body: {
      CensusSearchCriteria: {
        tenantId: tenantId,
        source: microplanId,
        status: selectedFilter !== null && selectedFilter !== undefined ? selectedFilter : "",
        ...(activeLink.code == "ASSIGNED_TO_ALL" || selectedFilter == "VALIDATED"
          ? {}
          : { assignee: user.info.uuid }),
        jurisdiction: jurisdiction,
        limit: limitAndOffset?.limit,
        offset: limitAndOffset?.offset
      },
    },
    config: {
      enabled: jurisdiction?.length > 0 ? true : false,
    },
  };

  const { isLoading, data, isFetching, refetch } = Digit.Hooks.useCustomAPIHook(reqCriteriaResource);

  // // Extract assignee IDs in order, including null values
  // useEffect(() => {
  //   if (data?.Census) {
  //    // Join with commas
  //   }
  // }, [data]);
  // Custom hook to fetch census data based on microplanId and boundaryCode
  const reqCri = {
    url: `/health-hrms/employees/_search`,
    params: {
      tenantId: tenantId,
      userServiceUuids: assigneeUuids,
    },
    config: {
      enabled: assigneeUuids?.length > 0 ? true : false,
    },
  };

  const { isLoading: isEmployeeLoading, data: employeeData, refetch: refetchHrms } = Digit.Hooks.useCustomAPIHook(reqCri);


  useEffect(() => {
    // Create a map of assignee IDs to names for easy lookup
    const nameMap = employeeData?.Employees?.reduce((acc, emp) => {
      acc[emp?.user?.userServiceUuid] = emp.user?.name || "NA"; // Map UUID to name
      return acc;
    }, {});

    setEmployeeNameMap(nameMap);
  }, [employeeData]);

  useEffect(() => {
    if (assigneeUuids?.length > 0) {
      refetchHrms();
    }
  }, [assigneeUuids]);

  useEffect(() => {
    if (data) {
      setCensusData(data?.Census);
      setTotalRows(data?.TotalCount)
      // reorder the status count to show pending for validation on top
      const reorderedStatusCount = Object.fromEntries(
        Object.entries(data?.StatusCount || {}).sort(([keyA], [keyB]) => {
          if (keyA === "PENDING_FOR_VALIDATION") return -1;
          if (keyB === "PENDING_FOR_VALIDATION") return 1;
          return 0;
        })
      );


      // Set reordered data to active filter
      setActiveFilter(reorderedStatusCount);

      const uniqueAssignees = [...new Set(data.Census.map(item => item.assignee).filter(Boolean))];
      setAssigneeUuids(uniqueAssignees.join(","));



      const activeFilterKeys = Object.keys(reorderedStatusCount || {});

      if (
        (selectedFilter === null || selectedFilter === undefined || selectedFilter === "") ||
        !activeFilterKeys.includes(selectedFilter)
      ) {
        setSelectedFilter(activeFilterKeys[0]);
      }
      setVillagesSelected(0);
      setSelectedRows([]);

      // Calculate counts for each tab based on the 'assignee' field or any other criteria
      const assignedToMeCount = data?.Census?.filter(
        (item) => item.assignee === user.info.uuid // or the condition for "ASSIGNED_TO_ME"
      ).length;

      const assignedToAllCount = data?.Census?.length;

      if (activeLink.code === "ASSIGNED_TO_ALL") {
        setAssignedToAllCount(assignedToAllCount);
      } else {
        if (assignedToAllCount <= assignedToMeCount) {
          setAssignedToAllCount(assignedToMeCount);
        }
        // Update state with these counts
        setAssignedToMeCount(assignedToMeCount);
      }
    }
  }, [data]);

  useEffect(() => {
    if (jurisdiction?.length > 0) {
      refetch(); // Trigger the API call again after activeFilter changes
    }
  }, [selectedFilter, jurisdiction, limitAndOffset, activeLink]);

  useEffect(() => {
    if (selectedFilter === "VALIDATED") {
      setActiveLink({ code: "", name: "" });
      setShowTab(false);
    } else {
      if (!showTab) {
        setActiveLink({
          code: "ASSIGNED_TO_ME",
          name: "ASSIGNED_TO_ME"
        });
        setShowTab(true);
      }
    }
  }, [selectedFilter]);


  useEffect(() => {
    if (selectedFilter !== "VALIDATED" && activeLink.code === "ASSIGNED_TO_ALL") {
      setAllowAction(false);
    } else {
      setAllowAction(true);
    }
  }, [selectedFilter, activeLink]);

  const onFilter = (selectedStatus) => {
    setSelectedFilter(selectedStatus?.code);
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

  const clearFilters = () => {
    if (selectedFilter !== Object.entries(activeFilter)?.[0]?.[0]) {
      setSelectedFilter(Object.entries(activeFilter)?.[0]?.[0]);
    }
  };

  const handleActionClick = (action) => {
    setworkFlowPopUp(action);
  };

  const onRowSelect = (event) => {
    setSelectedRows(event?.selectedRows);
    setVillagesSelected(event?.selectedCount);
  };


  // Function to check the status count condition
  const isStatusConditionMet = (statusCount) => {
    // Extract all keys and values from statusCount object
    const statusValues = Object.keys(statusCount).map((key) => statusCount[key]);

    // Check if all statuses except "VALIDATED" are 0, and "VALIDATED" is more than 0
    return Object.keys(statusCount).every(
      (key) => (key === "VALIDATED" ? statusCount[key] > 0 : statusCount[key] === 0)
    );
  };


  // This function will update the workflow action for every selected row
  const updateWorkflowForSelectedRows = () => {
    const updatedRows = selectedRows?.map((census) => ({
      ...census,
      workflow: {
        ...census.workflow,  // Keep existing workflow properties if any
        action: workFlowPopUp,
      },
    }));

    return updatedRows;
  };


  const updateWorkflowForFooterAction = () => {
    const updatedPlanConfig = {
      ...planObject,
      workflow: {
        ...planObject?.workflow,  // Keep existing workflow properties if any
        action: "APPROVE_CENSUS_DATA",
      },
    };

    return updatedPlanConfig;
  };


  const actionIconMap = {
    "VALIDATE": { isSuffix: false, icon: "CheckCircle" },
    "EDIT_AND_SEND_FOR_APPROVAL": { isSuffix: false, icon: "Edit" },
    "APPROVE": { isSuffix: false, icon: "CheckCircle" },
    "SEND_BACK_FOR_CORRECTION": { isSuffix: true, icon: "ArrowForward" },
  }

  const conditionalRowStyles = [
    {
      when: row => selectedRows.some(selectedRow => selectedRow.id === row.id),
      style: {
        backgroundColor: '#FBEEE8',
      },
      classNames: ['selectedRow'],
    },
  ];

  if (isPlanEmpSearchLoading || isLoadingCampaignObject || isLoading || isWorkflowLoading || isEmployeeLoading) {
    return <Loader />;
  }


  return (
    <div className="pop-inbox-wrapper">
      <Header className="pop-inbox-header">{t(`VALIDATE_APPROVE_POPULATIONDATA`)}</Header>
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
            selectedFilter === Object.entries(activeFilter)?.[0]?.[0] ? { [Object.entries(activeFilter)?.[0]?.[0]]: Object.entries(activeFilter)?.[0]?.[1] } : null
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
              showNav={showTab}
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
                        ?.map((action, index) => (
                          <Button
                            key={index}
                            variation="secondary"
                            label={t(action.action)}
                            type="button"
                            onClick={() => handleActionClick(action.action)}
                            size="large"
                            icon={actionIconMap[action.action]?.icon}
                            isSuffix={actionIconMap[action.action]?.isSuffix}
                          />
                        ))
                      }
                    />
                  ) : (
                    actionsMain
                      ?.filter((action) => !actionsToHide.includes(action.action))
                      ?.map((action, index) => (
                        <Button
                          key={index}
                          variation="secondary"
                          label={t(action.action)}
                          type="button"
                          onClick={() => handleActionClick(action.action)}
                          size="large"
                          icon={actionIconMap[action.action]?.icon}
                          isSuffix={actionIconMap[action.action]?.isSuffix}
                        />
                      ))
                  )}
                </div>

                {workFlowPopUp !== '' && (
                  <WorkflowCommentPopUp
                    onClose={closePopUp}
                    heading={t(`SEND_FOR_${workFlowPopUp}`)}
                    submitLabel={t(`SEND_FOR_${workFlowPopUp}`)}
                    url="/census-service/bulk/_update"
                    requestPayload={{ Census: updateWorkflowForSelectedRows() }}
                    commentPath="workflow.comments"
                    onSuccess={(data) => {
                      closePopUp();
                      setShowToast({ key: "success", label: t("WORKFLOW_UPDATE_SUCCESS"), transitionTime: 5000 });
                      refetch();
                    }}
                    onError={(data) => {
                      setShowToast({ key: "error", label: t(error?.response?.data?.Errors?.[0]?.code) });
                    }}
                  />
                )}
              </div>
            )}
            {isLoading || isFetching ? <Loader /> : <PopInboxTable currentPage={currentPage} rowsPerPage={rowsPerPage} totalRows={totalRows} handlePageChange={handlePageChange} handlePerRowsChange={handlePerRowsChange} onRowSelect={onRowSelect} censusData={censusData} showEditColumn={actionsToHide?.length > 0} employeeNameData={employeeNameMap} onSuccessEdit={() => refetch()} conditionalRowStyles={conditionalRowStyles} allowAction={allowAction} />}
          </Card>
        </div>
      </div>

      {/* <ActionBar
        actionFields={[
          <Button label={t(`HCM_MICROPLAN_VIEW_VILLAGE_BACK`)} onClick={function noRefCheck() { }} type="button" variation="primary" />,
        ]}
        className=""
        maxActionFieldsAllowed={5}
        setactionFieldsToRight
        sortActionFields
        style={{}}
      /> */}

      {isRootApprover && isStatusConditionMet(activeFilter) && planObject?.status === "CENSUS_DATA_APPROVAL_IN_PROGRESS" &&
        <ActionBar
          actionFields={[
            <Button icon="CheckCircle" label={t(`HCM_MICROPLAN_FINALIZE_POPULATION_DATA`)} onClick={handleActionBarClick} type="button" variation="primary" />,
          ]}
          className=""
          maxActionFieldsAllowed={5}
          setactionFieldsToRight
          sortActionFields
          style={{}}
        />}

      {actionBarPopUp && (
        <WorkflowCommentPopUp
          onClose={closeActionBarPopUp}
          heading={t(`HCM_MICROPLAN_FINALIZE_POPULATION_DATA`)}
          submitLabel={t(`HCM_MICROPLAN_FINALIZE_POPULATION_DATA`)}
          url="/plan-service/config/_update"
          requestPayload={{ PlanConfiguration: updateWorkflowForFooterAction() }}
          commentPath="workflow.comments"
          onSuccess={(data) => {
            history.push(`/${window.contextPath}/employee/microplan/population-finalise-success`, {
              fileName: data?.PlanConfiguration?.[0]?.name,
              message: t(`POPULATION_FINALISED_SUCCESSFUL`),
              back: t(`GO_BACK_TO_HOME`),
              backlink: `/${window.contextPath}/employee`
            });
          }}
          onError={(data) => {
            setShowToast({ key: "error", label: t(error?.response?.data?.Errors?.[0]?.code) });
          }}
        />
      )}

      {showToast && (
        <Toast style={{ zIndex: 10001 }}
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

export default PopInbox;
