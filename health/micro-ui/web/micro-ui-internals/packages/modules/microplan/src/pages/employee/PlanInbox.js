import React, { Fragment, useState, useEffect } from "react";
import SearchJurisdiction from "../../components/SearchJurisdiction";
import { boundaries } from "../../components/boundaries";
import PopInboxTable from "../../components/PopInboxTable";
import { Card, Tab, Button, SVG, Loader } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import InboxFilterWrapper from "../../components/InboxFilterWrapper";

const PlanInbox = () => {
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
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [activeFilter, setActiveFilter] = useState({});
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

  console.log("user", user);
  const {
    isLoading: isPlanEmpSearchLoading,
    data: planEmployee,
    error: planEmployeeError,
    refetch: refetchPlanEmployee,
  } = Digit.Hooks.microplanv1.usePlanSearchEmployeeWithTagging({
    tenantId: tenantId,
    body: {
      PlanEmployeeAssignmentSearchCriteria: {
        // tenantId: tenantId,
        // planConfigurationId: url?.microplanId,
        // active: true,
        // employeeId: [user?.info?.uuid],
        // role: ["POPULATION_DATA_APPROVER", "ROOT_POPULATION_DATA_APPROVER"],

        tenantId: "mz",
        active: true,
        planConfigurationId: url?.microplanId,
        role: ["POPULATION_DATA_APPROVER"],
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
      setActiveFilter(data?.StatusCount);
      if ((selectedFilter === null || selectedFilter === undefined) && selectedFilter !== "") {
        setSelectedFilter(Object.entries(data?.StatusCount)?.[0]?.[0]);
      }
    }
  }, [data, selectedFilter]);

  useEffect(() => {
    if (jurisdiction.length > 0) {
      refetch(); // Trigger the API call again after activeFilter changes
    }
  }, [selectedFilter, activeLink, jurisdiction]);

  useEffect(() => {}, [selectedFilter]);

  const onFilter = (selectedStatus) => {
    setSelectedFilter(selectedStatus?.code);
  };

  const clearFilters = () => {
    setSelectedFilter("");
  };

  const handleActionClick = (action) => {
    console.log("clicked action");
  };

  const onRowSelect = (event) => {
    console.log(event, "clicked action");
    setVillagesSelected(event?.selectedCount);
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
            selectedFilter !== "" && activeFilter ? { [Object.entries(activeFilter)?.[0]?.[0]]: Object.entries(activeFilter)?.[0]?.[1] } : null
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
          <Card type={"primary"}>
            {villagesSlected !== 0 && (
              <div className="selection-state-wrapper">
                <div className="svg-state-wrapper">
                  <SVG.DoneAll width={"1.5rem"} height={"1.5rem"} fill={"#C84C0E"}></SVG.DoneAll>
                  <div className={"selected-state"}>{`${villagesSlected} ${t("MICROPLAN_VILLAGES_SELECTED")}`}</div>
                </div>

                <div className={`table-actions-wrapper`}>
                  {actionsMain?.map((action, index) => (
                    <Button
                      key={index}
                      variation="secondary"
                      label={t(action.action)}
                      type="button"
                      onClick={(action) => handleActionClick(action)}
                      size={"large"}
                    />
                  ))}
                </div>
              </div>
            )}
            <PopInboxTable onRowSelect={onRowSelect} censusData={censusData} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PlanInbox;
