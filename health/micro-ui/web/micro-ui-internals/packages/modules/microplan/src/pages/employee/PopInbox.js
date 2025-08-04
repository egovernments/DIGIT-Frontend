import React, { Fragment, useState, useEffect,useRef, useContext } from "react";
import SearchJurisdiction from "../../components/SearchJurisdiction";
import { useHistory } from "react-router-dom";
import PopInboxTable from "../../components/PopInboxTable";
import { Card, Tab, Button, SVG, Loader, ActionBar, Toast, ButtonGroup, NoResultsFound } from "@egovernments/digit-ui-components";
import { useMyContext } from "../../utils/context";
import { useTranslation } from "react-i18next";
import InboxFilterWrapper from "../../components/InboxFilterWrapper";
import WorkflowCommentPopUp from "../../components/WorkflowCommentPopUp";
import { Header } from "@egovernments/digit-ui-react-components";
import ConfirmationPopUp from "../../components/ConfirmationPopUp";
import GenericKpiFromDSS from "../../components/GenericKpiFromDSS";

const PopInbox = () => {
  const {state}=useMyContext();
  const config=state?.PopConfig?.[0];
  const [activeLink, setActiveLink] = useState(config?.tabConfig?.defaultActiveTab);
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const history = useHistory();
  const url = Digit.Hooks.useQueryParams();
  const microplanId = url?.microplanId;
  const [villagesSlected, setVillagesSelected] = useState(0);
  const [showTab, setShowTab] = useState(true);
  const user = Digit.UserService.getUser();
  const [jurisdiction, setjurisdiction] = useState([]);
  const [censusJurisdiction, setCensusJurisdiction] = useState([]);
  const [hierarchyLevel, setHierarchyLevel] = useState("");
  const [censusData, setCensusData] = useState([]);
  const [boundaries, setBoundaries] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [workFlowPopUp, setworkFlowPopUp] = useState('');
  const [selectedFilter, setSelectedFilter] = useState(config?.filterConfig?.defaultActiveFilter);
  const [actionBarPopUp, setactionBarPopUp] = useState(false);
  const [activeFilter, setActiveFilter] = useState({});
  const [currentPage, setCurrentPage] = useState(config?.tableConfig?.initialCurrentPage);
  const [rowsPerPage, setRowsPerPage] = useState(config?.tableConfig?.initialRowsPerPage);
  const [assigneeUuids, setAssigneeUuids] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [showToast, setShowToast] = useState(null);
  const [showComment, setShowComment] = useState(false);
  const [employeeNameMap, setEmployeeNameMap] = useState({});
  const [availableActionsForUser, setAvailableActionsForUser] = useState([]);
  const [assignedToMeCount, setAssignedToMeCount] = useState(0);
  const [disabledAction, setDisabledAction] = useState(false);
  const [assignedToAllCount, setAssignedToAllCount] = useState(0);
  const [updatedCensus, setUpdatedCensus] = useState(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const [triggerTotalCensus, setTriggerTotalCensus] = useState(false);
  const [totalStatusCount, setTotalStatusCount] = useState({});
  const [totalcount, setTotalCount] = useState(null);
  const [defaultHierarchy, setDefaultSelectedHierarchy] = useState(null);
  const [defaultBoundaries, setDefaultBoundaries] = useState([]);
  const [limitAndOffset, setLimitAndOffset] = useState({ limit: rowsPerPage, offset: (currentPage - 1) * rowsPerPage });
  
  const hrms_context_path = window?.globalConfigs?.getConfig("HRMS_CONTEXT_PATH") || 'health-hrms';
  const userRoles = user?.info?.roles?.map((roleData) => roleData?.code);
  const tableRef = useRef(null);
  const [tableHeight, setTableHeight] = useState(33);

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
      enabled: true,
      changeQueryName: "planObject",
      //   queryKey: currentKey,
    }
  );

  useEffect(() => {
    refetchPlan();
  }, []);

  useEffect(() => {
    fetchStatusCount();
  }, [planObject]);

  const fetchStatusCount = async () => {
    if (planObject) {
      try {
        await mutation.mutateAsync(
          {
            body: {
              CensusSearchCriteria: {
                tenantId: tenantId,
                source: microplanId,
                ...(isRootApprover
                  ? {}
                  : { assignee: user.info.uuid }),
              },
            }
          },
          {
            onSuccess: (data) => {
              setTotalStatusCount(data?.StatusCount);
              setTotalCount(data?.TotalCount);
            },
            onError: (error) => {
              setShowToast({ key: "error", label: t(error?.response?.data?.Errors?.[0]?.code) });
            }
          }
        );
      } catch (error) {
        setShowToast({ key: "error", label: t(error?.response?.data?.Errors?.[0]?.code) });
      }
    }
  };


  const mutation = Digit.Hooks.useCustomAPIMutationHook({
    url: "/census-service/_search",
  });

  // // fetch the total census data for showing footer action
  // const { isLoading:isLoadingTotalCensus, data: totalCensusData, } = Digit.Hooks.useCustomAPIHook({
  //   url: `/census-service/_search`,
  //     body: {
  //       CensusSearchCriteria: {
  //         tenantId: tenantId,
  //         source: microplanId,
  //       },
  //     },
  //     config: {
  //       enabled: triggerTotalCensus,
  //     },
  //     queryKey: 'totalData'
  // });


  // fetch the process instance for the current microplan to check if we need to disabled actions or not
  const { isLoading: isProcessLoading, data: processData, } = Digit.Hooks.useCustomAPIHook({
    url: "/egov-workflow-v2/egov-wf/process/_search",
    params: {
      tenantId: tenantId,
      history: true,
      businessIds: microplanId,
    },
    config: {
        cacheTime:Infinity,
        enabled: true,
        select: (data) => {
          return data?.ProcessInstances;
      },
    },
  });


  useEffect(() => {
    if (processData && processData.some((instance) => instance.action === config?.disableInstanceAction)) {
      setDisabledAction(true);
    }
  }, [processData]);


  const handleActionBarClick = () => {
    setactionBarPopUp(true);
  };

  const onSearch = (selectedBoundaries, selectedHierarchy) => {

    if (selectedBoundaries.length === 0) {
      setShowToast({ key: "warning", label: t("MICROPLAN_BOUNDARY_IS_EMPTY_WARNING"), transitionTime: 5000 });
    } else {
      setActiveLink({
        code: "ASSIGNED_TO_ME",
        name: "ASSIGNED_TO_ME"
      });
      setLimitAndOffset((prev)=>{
        return {
          limit: prev.limit,
          offset: 0
        }
      });

      setDefaultSelectedHierarchy(selectedHierarchy);
      setDefaultBoundaries(selectedBoundaries);
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
        role:config?.roles,
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
      setCensusJurisdiction(planEmployee?.planData?.[0]?.jurisdiction);
      setHierarchyLevel(planEmployee?.planData?.[0]?.hierarchyLevel);
    }
  }, [planEmployee]);

  const onClear = () => {
    setDefaultBoundaries([]);
    setDefaultSelectedHierarchy(null);
    setLimitAndOffset((prev)=>{
      return {
        limit: prev.limit,
        offset: 0
      }
    });
    setCensusJurisdiction(planEmployee?.planData?.[0]?.jurisdiction);
  };

  const { isLoading: isWorkflowLoading, data: workflowData, revalidate, refetch: refetchBussinessService } = Digit.Hooks.useCustomAPIHook({
    url: "/egov-workflow-v2/egov-wf/businessservice/_search",
    params: {
      tenantId: tenantId,
      businessServices: "CENSUS",
    },
    config: {
      enabled: selectedFilter?.status ? true : false,
      select: (data) => {
        return data.BusinessServices?.[0];
      },
    },
  });

  useEffect(() => {
    if (workflowData && workflowData.businessService==="CENSUS") {

      // Assume selectedFilter maps to applicationStatus or state
      const selectedState = workflowData?.states?.find(
        (state) => state.state === selectedFilter?.status
      );

      // Filter actions based on the selected state
      const availableActions = selectedState?.actions?.filter((action) =>
        action.roles.some((role) => userRoles.includes(role))
      );

      // Update the available actions state
      setAvailableActionsForUser(availableActions || []);

    }else{
      refetchBussinessService();
    }
  }, [workflowData, selectedFilter?.status,villagesSlected,selectedRows]);


  // if availableActionsForUser is defined and is an array
  const actionsMain = availableActionsForUser?.length > 0
    ? availableActionsForUser
    : [];


  // actionsToHide array by checking for "EDIT" in the actionMap
  const actionsToHide = config?.actionsConfig?.actionsToHide;


   // Custom hook to fetch assign to me count when workflow data is updated in assign to all case
   const reqCriteriaResourceCount = {
    url: `/census-service/_search`,
    body: {
      CensusSearchCriteria: {
        tenantId: tenantId,
        source: microplanId,
        status: selectedFilter?.status !== null && selectedFilter?.status !== undefined ? selectedFilter?.status : "",
        assignee: user.info.uuid,
        jurisdiction: censusJurisdiction,
        limit: limitAndOffset?.limit,
        offset: limitAndOffset?.offset
      },
    },
    config: {
      enabled: censusJurisdiction?.length > 0 ? true : false,
    },
    changeQueryName: "count"
  };

  const { isLoading:isCountLoading, data:countData, isFetching:isCountFetching, refetch:refetchCount } = Digit.Hooks.useCustomAPIHook(reqCriteriaResourceCount);

  useEffect(() => {
  
    if (countData) {
      setAssignedToMeCount(countData?.TotalCount);
    }
   
  }, [countData]);


  // Custom hook to fetch census data based on microplanId and boundaryCode
  const reqCriteriaResource = {
    url: `/census-service/_search`,
    body: {
      CensusSearchCriteria: {
        tenantId: tenantId,
        source: microplanId,
        status: selectedFilter?.status !== null && selectedFilter?.status !== undefined ? selectedFilter?.status : "",
        ...(activeLink.code == "ASSIGNED_TO_ALL" || selectedFilter?.status == "VALIDATED"
          ? {}
          : { assignee: user.info.uuid }),
        jurisdiction: censusJurisdiction,
        limit: limitAndOffset?.limit,
        offset: limitAndOffset?.offset
      },
    },
    config: {
      enabled: censusJurisdiction?.length > 0 ? true : false,
    },
  };

  const { isLoading, data, isFetching, refetch:refetchCensus } = Digit.Hooks.useCustomAPIHook(reqCriteriaResource);


  // // Extract assignee IDs in order, including null values
  // useEffect(() => {
  //   if (data?.Census) {
  //    // Join with commas
  //   }
  // }, [data]);
  // Custom hook to fetch census data based on microplanId and boundaryCode
  const reqCri = {
    url: `/${hrms_context_path}/employees/_search`,
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
      const statusOrderMap = Object.fromEntries(
        config.filterConfig.filterOptions.map(option => [option.status, option.order])
      );
  
      // Reorder the status count based on `order` from filterConfig
      const reorderedStatusCount = Object.fromEntries(
        Object.entries(data?.StatusCount || {}).sort(([keyA], [keyB]) => {
          return (statusOrderMap[keyA] || Infinity) - (statusOrderMap[keyB] || Infinity);
        })
      );

      setActiveFilter(reorderedStatusCount);

      const uniqueAssignees = [...new Set(data?.Census?.flatMap(item => item.assignee || []))];

      setAssigneeUuids(uniqueAssignees.join(","));


      const activeFilterKeys = Object.keys(reorderedStatusCount || {});

      if (
        (selectedFilter?.status === null || selectedFilter?.status === undefined || selectedFilter?.status === "")
      ) {
        setSelectedFilter((prev) => ({
          ...prev, // Spread the previous state to retain other attributes
        }));
      }
      setVillagesSelected(0);
      setSelectedRows([]);

      if (activeLink.code === "ASSIGNED_TO_ME") {
        setAssignedToMeCount(data?.TotalCount);
        setAssignedToAllCount(data?.StatusCount[selectedFilter?.status] || 0)
      } else {
        setAssignedToAllCount(data?.TotalCount);
      }
    }
  }, [data]);

  useEffect(() => {
    if (censusJurisdiction?.length > 0) {
      refetchCensus(); // Trigger the API call again after activeFilter changes
    }
  }, [selectedFilter?.status, censusJurisdiction, limitAndOffset, activeLink]);

  useEffect(() => {
    if (selectedFilter?.status === "VALIDATED") {
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
  }, [selectedFilter?.status]);

  const onFilter = (filterValue) => {
    setLimitAndOffset((prev)=>{
      return {
        limit: prev.limit,
        offset: 0
      }
    });
    setCurrentPage(1);
    setSelectedFilter((prev)=>(
      {
        ...prev,
        ...filterValue
      }
    ));
    setActiveLink({
      code: "ASSIGNED_TO_ME",
      name: "ASSIGNED_TO_ME"
    });
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
    setSelectedFilter((prev)=>({
      status:Object.entries(activeFilter)?.[0]?.[0]
    }));
    setLimitAndOffset((prev)=>{
      return {
        limit: prev.limit,
        offset: 0
      }
    });
    setCurrentPage(1);
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
    // Return false if statusCount is null or an empty object
    if (!statusCount || Object.keys(statusCount).length === 0) return false;

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


  const actionIconMap =  config?.actionsConfig?.actionIconMap;

  const getButtonState = (action) => {
  return config.actionsConfig.primaryButtonStates.some(
    (state) => state.status === selectedFilter?.status && state.actions.includes(action)
  );
};



  const onCommentLogClose = () => {
    setShowComment(false);
  };

  const conditionalRowStyles = [
    {
      when: row => selectedRows.some(selectedRow => selectedRow.id === row.id),
      style: {
        backgroundColor: '#FBEEE8',
      },
      classNames: ['selectedRow'],
    },
  ];

  if (isPlanEmpSearchLoading || isLoadingCampaignObject || isLoading || isWorkflowLoading || isEmployeeLoading || mutation.isLoading || isCountLoading) {
    return <Loader />;
  }

  const roles = Digit.UserService.getUser().info.roles;
  const userName = Digit.UserService.getUser().info.name;
  let userRole = "";

  roles.forEach(role => {
    if (role.code === "ROOT_POPULATION_DATA_APPROVER") {
      userRole = "ROOT_POPULATION_DATA_APPROVER";
    } else if (userRole !== "ROOT_POPULATION_DATA_APPROVER" && role.code === "POPULATION_DATA_APPROVER") {
      userRole = "POPULATION_DATA_APPROVER";

    }
  });

  
  return (
    <div className="pop-inbox-wrapper">
      <div>
        <Header styles={{ marginBottom: "1rem" }} className="pop-inbox-header">{t(`VALIDATE_APPROVE_POPULATIONDATA`)}</Header>
        <div className="role-summary-sub-heading">
          <div className="mp-heading-bold">
          {`${t("HCM_MICROPLAN_MICROPLAN_NAME_LABEL")}: ${planObject?.name || t("NO_NAME_AVAILABLE")}`}
          </div>
          <div>
          {`${t("LOGGED_IN_AS")} ${userName} - ${t(userRole)}${planEmployee?.planData 
            ? ` (${t(planEmployee.planData[0].hierarchyLevel.toUpperCase())})` : ""}`
          }

          </div>
          
        </div>
      </div>
      <GenericKpiFromDSS module="CENSUS" status={selectedFilter?.status} planId={microplanId} refetchTrigger={refetchTrigger} campaignType={campaignObject?.projectType} planEmployee={planEmployee} boundariesForKpi={defaultBoundaries}/>
      <SearchJurisdiction
        boundaries={boundaries}
        defaultHierarchy={defaultHierarchy}
        jurisdiction={{
          boundaryType: hierarchyLevel,
          boundaryCodes: jurisdiction,
        }}
        defaultBoundaries={defaultBoundaries}
        onSubmit={onSearch}
        onClear={onClear}
      />

        <div className="pop-inbox-wrapper-filter-table-wrapper" style={{ marginBottom: (isRootApprover && isStatusConditionMet(totalStatusCount) && planObject?.status === "CENSUS_DATA_APPROVAL_IN_PROGRESS") || (!isRootApprover && totalcount===0) || disabledAction ? "2.5rem" : "0rem" }}>
          <InboxFilterWrapper
            isPlanInbox={false}
            options={activeFilter}
            onApplyFilters={onFilter}
            clearFilters={clearFilters}
            defaultValue={selectedFilter} 
            tableHeight={tableHeight}
          ></InboxFilterWrapper>

          <div className={"pop-inbox-table-wrapper"}>
            {showTab && !isCountFetching && (
              <Tab
                activeLink={activeLink?.code}
                configItemKey="code"
                configDisplayKey="name"
                itemStyle={{ width: "290px" }}
                configNavItems={[          
                  {
                    code: `${config?.tabConfig?.tabOptions[0]?.code}`,
                    name: `${t(config?.tabConfig?.tabOptions[0]?.name)} (${assignedToMeCount})`,
                  },
                  {
                    code: `${config?.tabConfig?.tabOptions[1]?.code}`,
                    name: `${t(config?.tabConfig?.tabOptions[1]?.name)} (${assignedToAllCount})`,
                  }
                ]}
                navStyles={{}}
                onTabClick={(e) => {
                  setLimitAndOffset((prev)=>{
                    return {
                      limit: prev.limit,
                      offset: 0
                    }
                  });
                  setCurrentPage(1);
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
                      <ButtonGroup
                        buttonsArray={actionsMain
                          ?.filter((action) => !actionsToHide.includes(action.action))
                          ?.map((action, index) => {

                            const isPrimary = getButtonState(action.action);

                            return (
                            <Button
                              key={index}
                              variation={isPrimary ? "primary" : "secondary"}
                              label={t(action.action)}
                              title={t(action.action)}
                              type="button"
                              onClick={() => handleActionClick(action.action)}
                              size="large"
                              icon={actionIconMap[action.action]?.icon}
                              isSuffix={actionIconMap[action.action]?.isSuffix}
                            />
                          );
                        })
                      }
                    />
                  ) : (
                    actionsMain
                      ?.filter((action) => !actionsToHide.includes(action.action))
                      ?.map((action, index) => {
                        const isPrimary = getButtonState(action.action);

                        return (
                          <Button
                            key={index}
                            variation={isPrimary ? "primary" : "secondary"}
                            label={t(action.action)}
                            title={t(action.action)}
                            type="button"
                            onClick={() => handleActionClick(action.action)}
                            size="large"
                            icon={actionIconMap[action.action]?.icon}
                            isSuffix={actionIconMap[action.action]?.isSuffix}
                          />
                        );
                      })
                  )}
                </div>

                {workFlowPopUp !== '' && (
                  <WorkflowCommentPopUp
                    onClose={closePopUp}
                    heading={t(`POP_INBOX_SEND_FOR_${workFlowPopUp}_HEADING_LABEL`)}
                    submitLabel={t(`POP_INBOX_SEND_FOR_${workFlowPopUp}_SUBMIT_LABEL`)}
                    url="/census-service/bulk/_update"
                    requestPayload={{ Census: updateWorkflowForSelectedRows() }}
                    commentPath="workflow.comments"
                    onSuccess={async (data) => {
                      closePopUp();
                      setShowToast({ key: "success", label: t(`POP_INBOX_WORKFLOW_FOR_${workFlowPopUp}_UPDATE_SUCCESS`), transitionTime: 5000 });
                      setLimitAndOffset((prev)=>{
                        return {
                          limit: prev.limit,
                          offset: 0
                        }
                      });
                      setCurrentPage(1);
                      refetchCount();
                      refetchCensus();
                      refetchPlan();
                      fetchStatusCount();
                      // wait for 5 seconds
                      await new Promise((resolve) => setTimeout(resolve, 5000));
                      setRefetchTrigger(prev => prev + 1);
                    }}
                    onError={(data) => {
                      setShowToast({ key: "error", label: t(error?.response?.data?.Errors?.[0]?.code) });
                    }}
                  />
                )}
              </div>
            )}
            {isLoading || isFetching ? <Loader /> : censusData.length === 0 ? <NoResultsFound style={{ height: selectedFilter?.status === "VALIDATED" ? "472px" : "408px" }} text={t(`HCM_MICROPLAN_NO_DATA_FOUND_FOR_CENSUS`)} /> : 
            <div ref={tableRef}>
              <PopInboxTable currentPage={currentPage} rowsPerPage={rowsPerPage} totalRows={totalRows} handlePageChange={handlePageChange} handlePerRowsChange={handlePerRowsChange} onRowSelect={onRowSelect} censusData={censusData} showEditColumn={actionsToHide?.length > 0} employeeNameData={employeeNameMap}
              paginationRowsPerPageOptions={config?.tableConfig?.paginationRowsPerPageOptions}
              onSuccessEdit={(data) => {
                setUpdatedCensus(data);
                setShowComment(true); 
              }}
              conditionalRowStyles={conditionalRowStyles} disabledAction={disabledAction} />
              </div>}
          </Card>
          {showComment && (
            <WorkflowCommentPopUp
              onClose={onCommentLogClose}
                heading={t(`${isRootApprover ? 'ROOT_' : ''}POP_INBOX_HCM_MICROPLAN_EDIT_POPULATION_COMMENT_HEADING_LABEL`)}
                submitLabel={t(`${isRootApprover ? 'ROOT_' : ''}POP_INBOX_HCM_MICROPLAN_EDIT_POPULATION_COMMENT_SUBMIT_LABEL`)}
                url="/census-service/_update"
                requestPayload={{ Census: updatedCensus }}
                commentPath="workflow.comments"
                onSuccess={ async (data)=> {
                  setShowToast({ key: "success", label: t(`${isRootApprover ? 'ROOT_' : ''}POP_INBOX_HCM_MICROPLAN_EDIT_WORKFLOW_UPDATED_SUCCESSFULLY`), transitionTime: 5000 });
                onCommentLogClose();
                refetchCount();
                refetchCensus();
                fetchStatusCount();
                // wait for 5 seconds
                await new Promise((resolve) => setTimeout(resolve, 5000));
                setRefetchTrigger(prev => prev + 1);
              }}
              onError={(error) => {
                setShowToast({ key: "error", label: t(error?.response?.data?.Errors?.[0]?.code) });
              }}
            />
          )}
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

      {isRootApprover && isStatusConditionMet(totalStatusCount) && planObject?.status === "CENSUS_DATA_APPROVAL_IN_PROGRESS" &&
        <ActionBar
          actionFields={[
            <Button icon="CheckCircle" label={t(`HCM_MICROPLAN_FINALIZE_POPULATION_DATA`)} title={t(`HCM_MICROPLAN_FINALIZE_POPULATION_DATA`)} onClick={handleActionBarClick} type="button" variation="primary" />,
          ]}
          className=""
          maxActionFieldsAllowed={5}
          setactionFieldsToRight
          sortActionFields
          style={{}}
        />}

      {((!isRootApprover && totalcount===0) || disabledAction) &&
        <ActionBar
          actionFields={[
            <Button label={t(`HCM_MICROPLAN_POP_INBOX_BACK_BUTTON`)} title={t(`HCM_MICROPLAN_POP_INBOX_BACK_BUTTON`)} onClick={()=> {
              history.push(`/${window.contextPath}/employee`);
            }} type="button" variation="primary" icon={"ArrowBack"}/>,
          ]}
          className=""
          maxActionFieldsAllowed={5}
          setactionFieldsToRight
          sortActionFields
          style={{}}
        />}

      {actionBarPopUp && (
        <ConfirmationPopUp
          onClose={closeActionBarPopUp}
          alertHeading={t(`HCM_MICROPLAN_FINALIZE_POPULATION_ALERT_HEADING_MESSAGE`)}
          alertMessage={`${t("HCM_MICROPLAN_FINALIZE_POPULATION_ALERT_DESCRIPTION_PREFIX_MESSAGE")} ${totalStatusCount?.["VALIDATED"]} ${t("HCM_MICROPLAN_FINALIZE_POPULATION_ALERT_DESCRIPTION_SUFFIX_MESSAGE")}`}
          submitLabel={t(`HCM_MICROPLAN_FINALIZE_POPULATION_DATA_SUBMIT_ACTION`)}
          cancelLabel={t(`HCM_MICROPLAN_FINALIZE_POPULATION_DATA_CANCEL_ACTION`)}
          url="/plan-service/config/_update"
          requestPayload={{ PlanConfiguration: updateWorkflowForFooterAction() }}
          onSuccess={(data) => {
            history.push(`/${window.contextPath}/employee/microplan/population-finalise-success`, {
              info: "MP_PLAN_MICROPLAN_NAME",
              fileName: data?.PlanConfiguration?.[0]?.name,
              message: t(`POPULATION_FINALISED_SUCCESSFUL`),
              back: t(`GO_BACK_TO_HOME`),
              backlink: `/${window.contextPath}/employee`
            });
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