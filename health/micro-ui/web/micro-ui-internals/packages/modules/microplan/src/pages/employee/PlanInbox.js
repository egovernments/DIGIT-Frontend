import React, { Fragment, useState, useEffect, useMemo ,useRef} from "react";
import SearchJurisdiction from "../../components/SearchJurisdiction";
import { useHistory } from "react-router-dom";
import { Card, Tab, Button, SVG, Loader, ActionBar, Toast, ButtonGroup, NoResultsFound } from "@egovernments/digit-ui-components";
import { Header } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import InboxFilterWrapper from "../../components/InboxFilterWrapper";
import DataTable from "react-data-table-component";
import { CheckBox } from "@egovernments/digit-ui-components";
import WorkflowCommentPopUp from "../../components/WorkflowCommentPopUp";
import { getTableCustomStyle, tableCustomStyle } from "../../components/tableCustomStyle";
import { CustomSVG } from "@egovernments/digit-ui-components";
import { useMyContext } from "../../utils/context";
import ConfirmationPopUp from "../../components/ConfirmationPopUp";
import VillageHierarchyTooltipWrapper from "../../components/VillageHierarchyTooltipWrapper";
import TimelinePopUpWrapper from "../../components/timelinePopUpWrapper";
import AssigneeChips from "../../components/AssigneeChips";
import GenericKpiFromDSS from "../../components/GenericKpiFromDSS";

const PlanInbox = () => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { state } = useMyContext();
  const config=state?.PlanInboxConfiguration?.[0];
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
  const [selectedFilter, setSelectedFilter] = useState(config?.filterConfig?.defaultActiveFilter);
  const [activeFilter, setActiveFilter] = useState({});
  const [actionBarPopUp, setactionBarPopUp] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [workFlowPopUp, setworkFlowPopUp] = useState("");
  const [currentPage, setCurrentPage] = useState(config?.tableConfig?.currentPage);
  const [rowsPerPage, setRowsPerPage] = useState(config?.tableConfig?.initialRowsPerPage);
  const [totalRows, setTotalRows] = useState(0);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [assignedToMeCount, setAssignedToMeCount] = useState(0);
  const [assignedToAllCount, setAssignedToAllCount] = useState(0);
  const [showToast, setShowToast] = useState(null);
  const [disabledAction, setDisabledAction] = useState(false);
  const [availableActionsForUser, setAvailableActionsForUser] = useState([]);
  const [limitAndOffset, setLimitAndOffset] = useState({ limit: rowsPerPage, offset: (currentPage - 1) * rowsPerPage });
  const [activeLink, setActiveLink] = useState(config?.tabConfig?.defaultActiveTab);
  const [showTimelinePopup, setShowTimelinePopup] = useState(false);
  const [selectedBoundaryCode, setSelectedBoundaryCode] = useState(null);
  const [selectedBusinessId, setSelectedBusinessId] = useState(null);
  const [assigneeUuids, setAssigneeUuids] = useState([]);
  const [totalStatusCount, setTotalStatusCount] = useState({});
  const [totalCount, setTotalCount] = useState(null);
  const [employeeNameMap, setEmployeeNameMap] = useState({});
  const [defaultHierarchy, setDefaultSelectedHierarchy] = useState(null);
  const [defaultBoundaries, setDefaultBoundaries] = useState([]);
  const userRoles =  user?.info?.roles?.map((roleData) => roleData?.code);
  const hrms_context_path = window?.globalConfigs?.getConfig("HRMS_CONTEXT_PATH") || 'health-hrms';
  const tableRef = useRef(null);
  const [tableHeight, setTableHeight] = useState(33);
 
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
      enabled: true,
      //   queryKey: currentKey,
    }
  );

  const mutation = Digit.Hooks.useCustomAPIMutationHook({
    url: "/plan-service/plan/_search",
  });

  useEffect(() => {
    fetchStatusCount();
  }, [planObject]);

  const fetchStatusCount = async () => {
 
    if (planObject) {
      try {
        await mutation.mutateAsync(
          {
            body: {
              PlanSearchCriteria: {
                tenantId: tenantId,
                planConfigurationId: microplanId,
                ...(isRootApprover ? {} : { assignee: user.info.uuid }),
              },
            },
          },
          {
            onSuccess: (data) => {
              setTotalStatusCount(data?.StatusCount);
              setTotalCount(data?.TotalCount);
            },
            onError: (error) => {
              setShowToast({ key: "error", label: t(error?.response?.data?.Errors?.[0]?.code) });
            },
          }
        );
      } catch (error) {
        setShowToast({ key: "error", label: t(error?.response?.data?.Errors?.[0]?.code) });
      }
    }
  };

  useEffect(() => {
    if (selectedFilter?.status === config?.tabConfig?.disabledTabStatus) {
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
  }, [selectedFilter?.status]);

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

  // Custom hook to fetch assign to me count when workflow data is updated in assign to all case
  const {
    isLoading: isCountPlanWithCensusLoading,
    data: planWithCensusCount,
    error: planWithCensusCountError,
    refetch: refetchPlanWithCensusCount,
    isFetching: isFetchingCount,
  } = Digit.Hooks.microplanv1.usePlanSearchWithCensus({
    tenantId: tenantId,
    microplanId: microplanId,
    body: {
      PlanSearchCriteria: {
        tenantId: tenantId,
        active: true,
        jurisdiction: censusJurisdiction,
        status: selectedFilter?.status !== null && selectedFilter?.status !== undefined ? selectedFilter?.status : null,
        ...(selectedFilter?.onRoadCondition != null && { onRoadCondition: selectedFilter.onRoadCondition }),
        ...(selectedFilter?.terrain != null && { terrain: selectedFilter.terrain }),
        ...(selectedFilter?.securityQ1 != null && { securityQ1: selectedFilter.securityQ1 }),
        ...(selectedFilter?.securityQ2 != null && { securityQ2: selectedFilter.securityQ2 }),
        ...(selectedFilter?.facilityId && {
          facilityIds: selectedFilter?.facilityId?.map((item) => item.id),
        }),
        assignee: user.info.uuid,
        planConfigurationId: microplanId, 
        limit: limitAndOffset?.limit,
        offset: limitAndOffset?.offset,
      },
    },
    config: {
      enabled: censusJurisdiction?.length > 0 ? true : false,
    },
    changeQueryName:"count"
  });
 
 
  
  
  const {
    isLoading: isPlanWithCensusLoading,
    data: planWithCensus,
    error: planWithCensusError,
    refetch: refetchPlanWithCensus,
    isFetching,
  } = Digit.Hooks.microplanv1.usePlanSearchWithCensus({
    tenantId: tenantId,
    microplanId: microplanId,
    body: {
      PlanSearchCriteria: {
        tenantId: tenantId,
        active: true,
        jurisdiction: censusJurisdiction,
        status: selectedFilter?.status !== null && selectedFilter?.status !== undefined ? selectedFilter?.status : "",
        ...(activeLink.code == "ASSIGNED_TO_ALL" || selectedFilter?.status == "VALIDATED" ? {} : { assignee: user.info.uuid }),
        ...(selectedFilter?.terrain != null && { terrain: selectedFilter.terrain }),
        ...(selectedFilter?.onRoadCondition != null && { onRoadCondition: selectedFilter.onRoadCondition }),
        ...(selectedFilter?.securityQ1 != null && { securityQ1: selectedFilter.securityQ1 }),
        ...(selectedFilter?.securityQ2 != null && { securityQ2: selectedFilter.securityQ2 }),
        ...(selectedFilter?.facilityId && {
          facilityIds: selectedFilter?.facilityId?.map((item) => item.id),
        }),
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
            acc[`securityDetail_SECURITY_LEVEL_Q${key}`] = filteredCensus?.additionalDetails?.securityDetails[key]?.code || "NA"; // Correctly referencing securityDetails
            return acc;
          }, {});

          const dynamicResource = item?.resources?.reduce((acc, item) => {
            if (item?.resourceType && item?.estimatedNumber !== undefined) {
              acc[item?.resourceType] = item?.estimatedNumber;
            }
            return acc;
          }, {});

          const dynamicAdditionalFields = filteredCensus?.additionalFields
            ?.filter((field) => field?.editable === true) // Filter fields where `editable` is `false`
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
            servingFacility: filteredCensus?.additionalDetails?.facilityName || "NA",
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




  const {
    isLoading: isPlanWithToAllCensusLoading,
    data: planWithCensusToAll,
    error: planWithCensusToAllError,
    refetch: refetchPlanWithCensusToAll,
    isFetchingToALL,
  } = Digit.Hooks.microplanv1.usePlanSearchWithCensus({
    tenantId: tenantId,
    microplanId: microplanId,
    body: {
      PlanSearchCriteria: {
        tenantId: tenantId,
        active: true,
        jurisdiction: censusJurisdiction,
        status: selectedFilter?.status !== null && selectedFilter?.status !== undefined ? selectedFilter?.status : "",
        ...(selectedFilter?.terrain != null && { terrain: selectedFilter.terrain }),
        ...(selectedFilter?.onRoadCondition != null && { onRoadCondition: selectedFilter.onRoadCondition }),
        ...(selectedFilter?.securityQ1 != null && { securityQ1: selectedFilter.securityQ1 }),
        ...(selectedFilter?.securityQ2 != null && { securityQ2: selectedFilter.securityQ2 }),
        ...(selectedFilter?.facilityId && {
          facilityIds: selectedFilter?.facilityId?.map((item) => item.id),
        }),
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
            acc[`securityDetail_SECURITY_LEVEL_Q${key}`] = filteredCensus?.additionalDetails?.securityDetails[key]?.code || "NA"; // Correctly referencing securityDetails
            return acc;
          }, {});

          const dynamicResource = item?.resources?.reduce((acc, item) => {
            if (item?.resourceType && item?.estimatedNumber !== undefined) {
              acc[item?.resourceType] = item?.estimatedNumber;
            }
            return acc;
          }, {});

          const dynamicAdditionalFields = filteredCensus?.additionalFields
            ?.filter((field) => field?.editable === true) // Filter fields where `editable` is `false`
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
            servingFacility: filteredCensus?.additionalDetails?.facilityName || "NA",
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


      useEffect(() => {
        if (tableRef.current) {
          // Get full rendered height including borders/padding
          const height = tableRef.current.offsetHeight;
          setTableHeight(height / 16 + 7.25);
        }else{
          setTableHeight(33);
        }
      }, [planWithCensus,planWithCensusToAll, activeLink]); 


  const onSearch = (selectedBoundaries, selectedHierarchy) => {
    if (selectedBoundaries.length === 0) {
      setShowToast({ key: "warning", label: t("MICROPLAN_BOUNDARY_IS_EMPTY_WARNING"), transitionTime: 5000 });
    } else {
      setActiveLink({
        code: "ASSIGNED_TO_ME",
        name: "ASSIGNED_TO_ME",
      });
      setCurrentPage(1);
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
        role: config?.roles,
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
    setDefaultBoundaries([]);
    setDefaultSelectedHierarchy(null);
    setCurrentPage(1);
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
      businessServices: "PLAN_ESTIMATION",
    },
    config: {
      enabled: selectedFilter?.status ? true : false,
      select: (data) => {
        return data.BusinessServices?.[0];
      },
    },
  });

  useEffect(() => {
    if (workflowData && workflowData.businessService==="PLAN_ESTIMATION") {
      // Assume selectedFilter.filterValue maps to applicationStatus or state
      const selectedState = workflowData?.states?.find((state) => state.state === selectedFilter?.status);
      
      // Filter actions based on the selected state
      const availableActions = selectedState?.actions?.filter((action) => action.roles.some((role) => userRoles.includes(role)));

      // Update the available actions state
      setAvailableActionsForUser(availableActions || []);
    }else{
      refetchBussinessService();
    }
  }, [workflowData, selectedFilter?.status,selectedRows,villagesSlected]);

  // if availableActionsForUser is defined and is an array
  const actionsMain = availableActionsForUser?.length > 0 ? availableActionsForUser : [];

  // actionsToHide array by checking for "EDIT" in the actionMap
  const actionsToHide = config?.actionsConfig?.actionsToHide;

  useEffect(() => {
    if (planWithCensus) {
      setCensusData(planWithCensus?.censusData);
      setTotalRows(planWithCensus?.TotalCount);
      const statusOrderMap = config?.filterConfig.filterOptions.reduce((acc, { status, order }) => {
        acc[status] = order;
        return acc;
      }, {});
      
      const reorderedStatusCount = Object.fromEntries(
        Object.entries(planWithCensus?.StatusCount || {})
          // Filter out PENDING_FOR_APPROVAL (if needed, can be removed later)
          .filter(([key]) => key !== "PENDING_FOR_APPROVAL")
          // Sort based on the order defined in filterConfig
          .sort(([keyA], [keyB]) => {
            return (statusOrderMap[keyA] || Infinity) - (statusOrderMap[keyB] || Infinity);
          })
      );

      
      setActiveFilter(reorderedStatusCount);
      const activeFilterKeys = Object.keys(reorderedStatusCount || {});
      if (selectedFilter?.filterValue === null || selectedFilter?.status=== undefined || selectedFilter?.status === "") {
        setSelectedFilter((prev) => ({
          ...prev, // Spread the previous state to retain other attributes
        }));
        
      }
      setVillagesSelected(0);

      setSelectedRows([]);
      if (activeLink.code === "ASSIGNED_TO_ME") {
        setAssignedToMeCount(planWithCensus?.TotalCount);
        setAssignedToAllCount(planWithCensusToAll?.TotalCount || 0);
      } else {
        setAssignedToAllCount(planWithCensusToAll?.TotalCount);
      }

      const uniqueAssignees = [...new Set(planWithCensus?.planData?.flatMap((item) => item.assignee || []))];
      setAssigneeUuids(uniqueAssignees.join(","));
    }
  }, [planWithCensus, selectedFilter, activeLink,planWithCensusToAll]);

  useEffect(() => {
    if (censusJurisdiction?.length > 0) {
      refetchPlanWithCensus(); // Trigger the API call again after activeFilter changes
      refetchPlanWithCensusToAll();
    }
  }, [selectedFilter, activeLink, censusJurisdiction, limitAndOffset]);
  
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
  
  useEffect(() => {
    if (planWithCensusCount) {
      setAssignedToMeCount(planWithCensusCount?.TotalCount);
      setAssignedToAllCount(planWithCensusToAll?.TotalCount);
    }
  }, [planWithCensusCount,planWithCensusToAll]);

  const { isLoading: isEmployeeLoading, data: employeeData, refetch: refetchHrms } = Digit.Hooks.useCustomAPIHook(reqCri);

  useEffect(() => {
    if (assigneeUuids?.length > 0) {
      refetchHrms();
    }
  }, [assigneeUuids]);

  useEffect(() => {
    // Create a map of assignee IDs to names for easy lookup
    const nameMap = employeeData?.Employees?.reduce((acc, emp) => {
      acc[emp?.user?.userServiceUuid] = emp.user?.name || "NA"; // Map UUID to name
      return acc;
    }, {});

    setEmployeeNameMap(nameMap);
  }, [employeeData]);
  // fetch the process instance for the current microplan to check if we need to disabled actions or not
  const { isLoading: isProcessLoading, data: processData } = Digit.Hooks.useCustomAPIHook({
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
    if (processData && processData.some((instance) => instance.action === config?.disableInstanceAction)) {
      setDisabledAction(true);
    }
  }, [processData]);

  useEffect(() => {
    if (selectedFilter?.status === config?.tabConfig?.disabledTabStatus) {
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
  }, [selectedFilter?.status]);

  const onFilter = (filterValue) => {
    setSelectedFilter((prev)=>(
      {
        ...prev,
        ...filterValue
      }
    ));
    setCurrentPage(1);
    setLimitAndOffset((prev)=>{
      return {
        limit: prev.limit,
        offset: 0
      }
    });
    setActiveLink({
      code: "ASSIGNED_TO_ME",
      name: "ASSIGNED_TO_ME",
    });
  };

  const clearFilters = () => {    
      setSelectedFilter((prev)=>({
        status:Object.entries(activeFilter)?.[0]?.[0]
      }));
    setCurrentPage(1);
    setLimitAndOffset((prev)=>{
      return {
        limit: prev.limit,
        offset: 0
      }
    });
  };

  const handleActionClick = (action) => {
    setworkFlowPopUp(action);
  };

  const getResourceColumns = () => {
    const operationArr = planObject?.operations?.filter(operation => operation.showOnEstimationDashboard)?.sort((a, b) => a.executionOrder - b.executionOrder).map((item) => t(item.output));
    
    const resources = planWithCensus?.planData?.[0]?.resources || []; // Resources array
    const resourceArr = (resources || []).map((resource) => ({
      name: t(resource.resourceType), // Dynamic column name for each resourceType
      cell: (row) => {
        return row?.[resource?.resourceType] === null ? t("NA") : row?.[resource?.resourceType]; // Return NA only if null, not for 0 or falsy values
      },
      sortable: true,
      width: "180px",
      sortFunction: (rowA, rowB) => {
        const fieldA = rowA?.[resource?.resourceType];
        const fieldB = rowB?.[resource?.resourceType];
        const valueA = parseFloat(fieldA || 0); 
        const valueB = parseFloat(fieldB || 0);
        return valueA - valueB;
      },
    }));

    return (operationArr || [])
      ?.map((output) => {
        // Find the corresponding field based on its name matching the `output`
        const field = resourceArr.find((f) => f.name === output);
        return field || null; // If no matching field is found, return null
      })
      ?.filter(Boolean);
  };

  const getAdditionalFieldsColumns = () => {
    return (planWithCensus?.censusData?.[0]?.additionalFields || [])
      .filter((field) => field?.editable)
      .sort((a, b) => a?.order - b?.order)
      .map((field) => ({
        name: t(`INBOX_${field?.key}`),
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
        sortable: true,
        cell: (row) => {
          return row?.[`securityDetail_${i?.question}`] ? t(`${row?.[`securityDetail_${i?.question}`]}`) : t("ES_COMMON_NA")},
        width: "180px",
        sortFunction: (rowA, rowB) => {
          const valueA = (rowA?.[`securityDetail_${i?.question}`] || t("ES_COMMON_NA")).toLowerCase();
          const valueB = (rowB?.[`securityDetail_${i?.question}`] || t("ES_COMMON_NA")).toLowerCase();
          if (valueA < valueB) return -1;
          if (valueA > valueB) return 1;
          return 0;
        },
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
          <VillageHierarchyTooltipWrapper boundaryCode={row?.village} wrapperClassName={"village-hierarchy-tooltip-wrapper-class"} />
        </div>
      ),
      // cell: (row) => t(row?.village) || "NA",
      sortable: true,
      sortFunction: (rowA, rowB) => {
        const villageA = t(rowA?.village).toLowerCase();
        const villageB = t(rowB?.village).toLowerCase();
        if (villageA < villageB) return -1;
        if (villageA > villageB) return 1;
        return 0;
      },
      width: "180px",
    },
    {
      name: t("INBOX_STATUSLOGS"),
      cell: (row, index, column, id) => (
        <Button
          label={t(`VIEW_LOGS`)}
          title={t(`VIEW_LOGS`)}
          onClick={() => {
            setSelectedBusinessId(row?.original?.id); // Set the row.id to state
            setSelectedBoundaryCode(row?.original?.locality);
            setShowTimelinePopup(true);
          }}
          variation="link"
          style={{}}
          size={"medium"}
        />
      ),
      sortable: false,
      width: "180px",
    },
    {
      name: t("INBOX_ASSIGNEE"),
      selector: (row, index) =>
        row?.original?.assignee?.length > 0 ? (
          <AssigneeChips
            assignees={row?.original?.assignee}
            assigneeNames={employeeNameMap}
            heading={t("HCM_MICROPLAN_PLAN_INBOX_TOTAL_ASSIGNEES")}
          />
        ) : (
          t("ES_COMMON_NA")
        ),
      sortable: false,
    },
    {
      name: t(`HCM_MICROPLAN_SERVING_FACILITY`),
      cell: (row) => t(row?.servingFacility) || "NA",
      sortFunction: (rowA, rowB) => {
        const facilityA = t(rowA?.servingFacility).toLowerCase();
        const facilityB = t(rowB?.servingFacility).toLowerCase();
        if (facilityA < facilityB) return -1;
        if (facilityA > facilityB) return 1;
        return 0;
      },
      sortable: true,
      width: "180px",
    },
    {
      name: t(`HCM_MICROPLAN_VILLAGE_ROAD_CONDITION_LABEL`),
      cell: (row) => t(row?.villageRoadCondition) || "NA",
      sortFunction: (rowA, rowB) => {
        const villageRoadConditionA = t(rowA?.villageRoadCondition).toLowerCase();
        const villageRoadConditionB = t(rowB?.villageRoadCondition).toLowerCase();
        if (villageRoadConditionA < villageRoadConditionB) return -1;
        if (villageRoadConditionA > villageRoadConditionB) return 1;
        return 0;
      },
      sortable: true,
      width: "180px",
    },
    {
      name: t(`HCM_MICROPLAN_VILLAGE_TERRAIN_LABEL`),
      cell: (row) => t(row?.villageTerrain) || "NA",
      sortFunction: (rowA, rowB) => {
        const villageTerrainA = t(rowA?.villageTerrain).toLowerCase();
        const villageTerrainB = t(rowB?.villageTerrain).toLowerCase();
        if (villageTerrainA < villageTerrainB) return -1;
        if (villageTerrainA > villageTerrainB) return 1;
        return 0;
      },
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

  const actionIconMap = config.actionsConfig?.actionIconMap;

  const getButtonState = (action) => {
  return config?.actionsConfig?.primaryButtonStates.some(
    (item) => item.status === selectedFilter?.status && item.actions.includes(action)
  );
};


  if (
    isLoadingPlanObject ||
    isPlanEmpSearchLoading ||
    isLoadingCampaignObject ||
    isWorkflowLoading ||
    isProcessLoading ||
    mutation.isLoading ||
    isPlanWithCensusLoading ||
    isCountPlanWithCensusLoading
  ) {
    return <Loader />;
  }
  // campaignObject?.campaignName
  //role and name of User extracted

  const roles = Digit.UserService.getUser().info.roles;
  const userName = Digit.UserService.getUser().info.name;
  let userRole = "";

  roles.forEach((role) => {
    if (role.code === "ROOT_PLAN_ESTIMATION_APPROVER") {
      userRole = "ROOT_PLAN_ESTIMATION_APPROVER";
    } else if (userRole !== "ROOT_PLAN_ESTIMATION_APPROVER" && role.code === "PLAN_ESTIMATION_APPROVER") {
      userRole = "PLAN_ESTIMATION_APPROVER";
    }
  });


  

  return (
    <div className="pop-inbox-wrapper">
      <div>
        <Header styles={{ marginBottom: "1rem" }} className="pop-inbox-header">
          {t(`HCM_MICROPLAN_VALIDATE_AND_APPROVE_MICROPLAN_ESTIMATIONS`)}
        </Header>
        <div className="role-summary-sub-heading">
          <div className="mp-heading-bold">
            {`${t("HCM_MICROPLAN_MICROPLAN_NAME_LABEL")}: ${campaignObject?.campaignName || t("NO_NAME_AVAILABLE")}`}
          </div>
          <div>{`${t("LOGGED_IN_AS")} ${userName} - ${t(userRole)}${planEmployee?.planData?.[0]?.hierarchyLevel ? 
            ` (${t(planEmployee.planData[0].hierarchyLevel.toUpperCase())})` : ""}`}
          </div>
        </div>
      </div>
      <GenericKpiFromDSS module="MICROPLAN" status={selectedFilter?.status} planId={microplanId} refetchTrigger={refetchTrigger} campaignType={campaignObject?.projectType} planEmployee={planEmployee} boundariesForKpi={defaultBoundaries}/>
      <SearchJurisdiction
        boundaries={boundaries}
        defaultHierarchy={defaultHierarchy}
        defaultBoundaries={defaultBoundaries}
        jurisdiction={{
          boundaryType: hierarchyLevel,
          boundaryCodes: jurisdiction,
        }}
        onSubmit={onSearch}
        onClear={onClear}
      />

      <div
        className="pop-inbox-wrapper-filter-table-wrapper planInbox-filtercard-table-wrapper"
        style={{
          marginBottom:
            (isRootApprover && isStatusConditionMet(totalStatusCount) && planObject?.status === "RESOURCE_ESTIMATION_IN_PROGRESS") ||
            (!isRootApprover && totalCount===0) ||
            disabledAction
              ? "2.5rem"
              : "0rem",
        }}
      >
        <InboxFilterWrapper
          isPlanInbox={true}
          options={activeFilter}
          onApplyFilters={onFilter}
          clearFilters={clearFilters}
          defaultValue={selectedFilter}
          tableHeight={tableHeight}
          filterConfig={config?.filterConfig}
        ></InboxFilterWrapper>

        <div className={"pop-inbox-table-wrapper"}>
          {showTab && !isFetchingCount && (
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
                setCurrentPage(1);
                setLimitAndOffset((prev)=>{
                  return {
                    limit: prev.limit,
                    offset: 0
                  }
                });
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

                        return (
                          <Button
                            key={index}
                            variation={isPrimary ? "primary" : "secondary"}
                            label={t(action.action)}
                            title={t(action.action)}
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
                    onSuccess={async (data) => {
                      closePopUp();
                      setShowToast({ key: "success", label: t(`PLAN_INBOX_WORKFLOW_FOR_${workFlowPopUp}_UPDATE_SUCCESS`), transitionTime: 5000 });
                      setCurrentPage(1);
                      setLimitAndOffset((prev)=>{
                        return {
                          limit: prev.limit,
                          offset: 0
                        }
                      });
                      refetchPlanWithCensusCount();
                      refetchPlanWithCensusToAll();
                      refetchPlanWithCensus();
                      fetchStatusCount();
                      // wait for 5 seconds
                      await new Promise((resolve) => setTimeout(resolve, 5000));
                      setRefetchTrigger(prev => prev + 1);
                    }}
                    onError={(data) => {
                      closePopUp();
                      setShowToast({ key: "error", label: t(error?.response?.data?.Errors?.[0]?.code) });
                    }}
                  />
                )}
              </div>
            )}
            {isFetching ? (
              <Loader />
            ) : planWithCensus?.tableData?.length === 0 ? (
              <NoResultsFound
                style={{ height: selectedFilter?.status === config?.tabConfig?.disabledTabStatus ? "472px" : "408px" }}
                text={t(`HCM_MICROPLAN_NO_DATA_FOUND_FOR_PLAN_INBOX_PLAN`)}
              />
            ) : (<div ref={tableRef}>
              <DataTable
                columns={columns}
                data={planWithCensus?.tableData}
                pagination
                paginationServer
                selectableRows={!disabledAction}
                className={`data-table ${!disabledAction ? "selectable" : "unselectable"}`}
                selectableRowsHighlight
                onChangeRowsPerPage={handlePerRowsChange}
                onChangePage={handlePageChange}
                noContextMenu
                onSelectedRowsChange={handleRowSelect}
                selectableRowsComponentProps={selectProps}
                paginationDefaultPage={currentPage}
                selectableRowsComponent={CheckBox}
                customStyles={tableCustomStyle}
                paginationTotalRows={totalRows}
                conditionalRowStyles={conditionalRowStyles}
                paginationPerPage={rowsPerPage}
                paginationRowsPerPageOptions={config?.tableConfig?.paginationRowsPerPageOptions}
                sortIcon={<CustomSVG.SortUp width={"16px"} height={"16px"} fill={"#0b4b66"} />}
                fixedHeader={true}
                fixedHeaderScrollHeight={"100vh"}
                paginationComponentOptions={{ rowsPerPageText:t("ROWS_PER_PAGE") }}
              />
              </div>
            )}
          </Card>
        </div>
      </div>

      {
showTimelinePopup && <TimelinePopUpWrapper
key={`${selectedBusinessId}-${Date.now()}`}
onClose={() => {
  setShowTimelinePopup(false);
  setSelectedBoundaryCode(null);
  setSelectedBusinessId(null); // Reset the selectedBusinessId when popup is closed
}}
businessId={selectedBusinessId} // Pass selectedBusinessId as businessId
heading={`${t("HCM_MICROPLAN_STATUS_LOG_FOR_LABEL")} ${t(selectedBoundaryCode)}`}
labelPrefix={"PLAN_ACTIONS_"}
/>
      }

      {isRootApprover && isStatusConditionMet(totalStatusCount) && planObject?.status === "RESOURCE_ESTIMATION_IN_PROGRESS" && (
        <ActionBar
          actionFields={[
            <Button
              icon="CheckCircle"
              label={t(`HCM_MICROPLAN_FINALIZE_MICROPLAN`)}
              title={t(`HCM_MICROPLAN_FINALIZE_MICROPLAN`)}
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

      {((!isRootApprover && totalCount===0 ) || disabledAction) && (
          <ActionBar
            actionFields={[
              <Button
                label={t(`HCM_MICROPLAN_PLAN_INBOX_BACK_BUTTON`)}
                title={t(`HCM_MICROPLAN_PLAN_INBOX_BACK_BUTTON`)}
                onClick={() => {
                  history.push(`/${window.contextPath}/employee`);
                }}
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
        <ConfirmationPopUp
          onClose={closeActionBarPopUp}
          alertHeading={t(`HCM_MICROPLAN_FINALIZE_MICROPLAN_ALERT_HEADING`)}
          alertMessage={`${t("HCM_MICROPLAN_FINALIZE_MICROPLAN_ALERT_PREFIX_MESSAGE")} ${totalStatusCount?.["VALIDATED"]} ${t(
            "HCM_MICROPLAN_FINALIZE_MICROPLAN_ALERT_SUFFIX_MESSAGE"
          )}`}
          submitLabel={t(`HCM_MICROPLAN_FINALIZE_MICROPLAN_SUBMIT_LABEL`)}
          cancelLabel={t(`HCM_MICROPLAN_FINALIZE_MICROPLAN_CANCEL_ACTION`)}
          url="/plan-service/config/_update"
          requestPayload={{ PlanConfiguration: updateWorkflowForFooterAction() }}
          onSuccess={(data) => {
            history.push(`/${window.contextPath}/employee/microplan/microplan-success`, {
              info: "MP_PLAN_MICROPLAN_NAME",
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