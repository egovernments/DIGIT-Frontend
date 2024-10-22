import React, { Fragment, useState, useEffect } from "react";
import SearchJurisdiction from "../../components/SearchJurisdiction";
import { boundaries } from "../../components/boundaries";
import PopInboxTable from "../../components/PopInboxTable";
import { Card, Tab, Button, SVG, Loader } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import InboxFilterWrapper from "../../components/InboxFilterWrapper";
import WorkflowCommentPopUp from "../../components/WorkflowCommentPopUp";

const PopInbox = () => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();

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
  const [activeFilter, setActiveFilter] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);
  const [limitAndOffset, setLimitAndOffset] = useState({ limit: rowsPerPage, offset: (currentPage - 1) * rowsPerPage });
  const [activeLink, setActiveLink] = useState({
    code: "ASSIGNED_TO_ME",
    name: "ASSIGNED_TO_ME",
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
        ids: ["3c4f50b4-07ed-4b64-a9aa-079ab433dac9"],
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

  useEffect(() => {
    if (planEmployee?.planData) {
      setjurisdiction(planEmployee?.planData?.[0]?.jurisdiction);
      setHierarchyLevel(planEmployee?.planData?.[0]?.hierarchyLevel);
    }
  }, [planEmployee]);

  const onClear = () => {
    setjurisdiction(planEmployee?.planData?.[0]?.jurisdiction);
  };

  const { isLoading: isUserLoading, data: workflowData, revalidate } = Digit.Hooks.useCustomAPIHook({
    url: "/egov-workflow-v2/egov-wf/businessservice/_search",
    params: {
      tenantId: tenantId,
      businessServices: "PLAN_ESTIMATION",
    },
    config: {
      select: (data) => {
        const service = data.BusinessServices?.[0];
        const matchingState = service?.states.find((state) => state.applicationStatus === "PENDING_FOR_VALIDATION");
        return matchingState || null;
      },
    },
  });

  const actionsMain = workflowData?.actions;

  // actionsToHide array by checking for "EDIT" in the actionMap
  const actionsToHide = actionsMain?.filter(action => action.action.includes("EDIT"))?.map(action => action.action);


  // Custom hook to fetch census data based on microplanId and boundaryCode
  const reqCriteriaResource = {
    url: `/census-service/_search`,
    body: {
      CensusSearchCriteria: {
        tenantId: tenantId,
        source: microplanId,
        status: selectedFilter !== null && selectedFilter !== undefined ? selectedFilter : "",
        assignee: activeLink.code === "ASSIGNED_TO_ME" ? user?.info?.uuid : "",
        jurisdiction: jurisdiction,
        limit: limitAndOffset?.limit,
        offset: limitAndOffset?.offset
      },
    },
    config: {
      enabled: jurisdiction.length > 0 ? true : false,
    },
  };

  const { isLoading, data, isFetching, refetch } = Digit.Hooks.useCustomAPIHook(reqCriteriaResource);

  useEffect(() => {
    if (data) {
      setCensusData(data?.Census);
      setTotalRows(data?.TotalCount)
      setActiveFilter(data?.StatusCount);
      if ((selectedFilter === null || selectedFilter === undefined) && selectedFilter !== "") {
        setSelectedFilter(Object.entries(data?.StatusCount)?.[0]?.[0]);
      }
      setVillagesSelected(0);
      setSelectedRows([]);
    }
  }, [data, selectedFilter]);

  useEffect(() => {
    if (jurisdiction.length > 0) {
      refetch(); // Trigger the API call again after activeFilter changes
    }
  }, [selectedFilter, activeLink, jurisdiction,limitAndOffset]);

  useEffect(() => {
    if (selectedFilter === "PENDING_FOR_VERIFICATION") {
      setActiveLink({ code: "", name: "" });
      setShowTab(false);
    }
  }, [selectedFilter]);

  useEffect(() => {
  }, [showTab]);


  const onFilter = (selectedStatus) => {
    setSelectedFilter(selectedStatus?.code);
  };

  const handlePageChange = (page,totalRows) =>{
    setCurrentPage(page);
    setLimitAndOffset({...limitAndOffset,offset: (page - 1) * 5})
  }

  const handlePerRowsChange = (currentRowsPerPage, currentPage) =>{
    setRowsPerPage(currentRowsPerPage);
    setCurrentPage(currentPage);
    setLimitAndOffset({limit:currentRowsPerPage,offset: (currentPage - 1) * currentRowsPerPage})
  }

  const clearFilters = () => {
    if (selectedFilter !== Object.entries(data?.StatusCount)?.[0]?.[0])
      setSelectedFilter(Object.entries(data?.StatusCount)?.[0]?.[0]);
  };

  const handleActionClick = (action) => {

    setworkFlowPopUp(action);
  };

  const onRowSelect = (event) => {
    setSelectedRows(event?.selectedRows);
    setVillagesSelected(event?.selectedCount);
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


  if (isPlanEmpSearchLoading || isLoadingCampaignObject || isLoading) {
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
            selectedFilter === Object.entries(activeFilter)?.[0]?.[0] ? { [Object.entries(activeFilter)?.[0]?.[0]]: Object.entries(activeFilter)?.[0]?.[1] } : null
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
              showNav={showTab}
              style={{}}
            />
          )}
          <Card type={"primary"}>
            {villagesSlected !== 0 && (
              <div className="selection-state-wrapper">
                <div className="svg-state-wrapper">
                  <SVG.DoneAll width={"1.5rem"} height={"1.5rem"} fill={"#C84C0E"}></SVG.DoneAll>
                  <div className={"selected-state"}>{`${villagesSlected} ${t("MICROPLAN_VILLAGES_SELECTED")}`}</div>
                </div>

                <div className={`table-actions-wrapper`}>
                  {actionsMain?.filter(action => !actionsToHide.includes(action.action))?.map((action, index) => (
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

                {workFlowPopUp !== '' && (
                  <WorkflowCommentPopUp
                    onClose={closePopUp}
                    heading={t(`SEND_FOR_${workFlowPopUp}`)}
                    submitLabel={t(`SEND_FOR_${workFlowPopUp}`)}
                    url="/census-service/bulk/_update"
                    requestPayload={{ Census: updateWorkflowForSelectedRows() }}
                    commentPath="workflow.comment"
                  />
                )}
              </div>
            )}
            {isFetching ? <Loader /> : <PopInboxTable currentPage={currentPage}  rowsPerPage={rowsPerPage} totalRows={totalRows} handlePageChange={handlePageChange} handlePerRowsChange={handlePerRowsChange} onRowSelect={onRowSelect} censusData={censusData} />}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PopInbox;
