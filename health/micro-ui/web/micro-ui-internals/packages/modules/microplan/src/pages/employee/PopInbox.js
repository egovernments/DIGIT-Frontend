import React, { Fragment, useState, useEffect } from "react";
import SearchJurisdiction from "../../components/SearchJurisdiction";
import { boundaries } from "../../components/boundaries";
import PopInboxTable from "../../components/PopInboxTable";
import { Card, Tab, Button, SVG } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import InboxFilterWrapper from "../../components/InboxFilterWrapper";

const jurisdiction = {
  boundaryType: "District",
  boundaryCodes: [
    // "MICROPLAN_MO_05_05_GREENVILLE",
    // "MICROPLAN_MO_05_04_GBLONEE",
    // "MICROPLAN_MO_04_06_KUNGBOR"
    // "MICROPLAN_MO"
    // "MICROPLAN_MO_05_06_JEADE",
    "MICROPLAN_MO_05_07_JEDEPO"
  ],
};

const statusMap = {
  PENDING_FOR_APPROVAL: 4,
  PENDING_FOR_VALIDATION: 4,
  APPROVED: 6,
  VALIDATED: 3,
};

const PopInbox = () => {
  const { t } = useTranslation();
  const url = Digit.Hooks.useQueryParams();
  const [villagesSlected, setVillagesSelected] = useState(0);
  const [showTab, setShowTab] = useState(true);
  const [activeLink, setActiveLink] = useState({
    code: "ASSIGNED_TO_ME",
    name: "ASSIGNED_TO_ME",
  });
  const onSearch = (selectedBoundaries) => {
    console.log(selectedBoundaries);
  };
  const onFilter = (selectedStatus) => {
    console.log(selectedStatus);
  };
  // need to add table and filter card

  const { isLoading: isUserLoading, data: workflowData, revalidate } = Digit.Hooks.useCustomAPIHook({
    url: "/egov-workflow-v2/egov-wf/businessservice/_search",
    params: {
      tenantId: Digit.ULBService.getCurrentTenantId(),
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

  const reqCriteriaResource = {
    url: `/census-service/_search`,
    body: {
      CensusSearchCriteria: {
        tenantId: Digit.ULBService.getCurrentTenantId(),
        // source: microplanId,
        areaCodes: [jurisdiction.boundaryCodes[0]],
      },
    },
    config: {
      enabled: true,
      select: (data) => {
        return data?.Census;
      },
    },
  };
  const { isLoading, censusdata, isFetching, refetch } = Digit.Hooks.useCustomAPIHook(reqCriteriaResource);

  console.log(censusdata, "censusdata");

  const handleActionClick = (action) => {
    console.log("clicked action");
  };

  const onRowSelect = (event) => {
    console.log(event, "clicked action");
    setVillagesSelected(event?.selectedCount);
  };

  return (
    <div className="pop-inbox-wrapper">
      <SearchJurisdiction boundaries={boundaries()} jurisdiction={jurisdiction} onSubmit={onSearch} />

      <div className="pop-inbox-wrapper-filter-table-wrapper">
        <InboxFilterWrapper
          options={{
            PENDING_FOR_APPROVAL: 4,
            PENDING_FOR_VALIDATION: 4,
            APPROVED: 6,
            VALIDATED: 3,
          }}
          onApplyFilters={(filterData) => console.log("Applied Filters:", filterData)}
          defaultValue={{ PENDING_FOR_VALIDATION: 4 }}
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
            <div className="selection-state-wrapper">
              {villagesSlected !== 0 && (
                <div className="svg-state-wrapper">
                  <SVG.DoneAll width={"1.5rem"} height={"1.5rem"} fill={"#C84C0E"}></SVG.DoneAll>
                  <div className={"selected-state"}>{`${villagesSlected} ${t("MICROPLAN_VILLAGES_SELECTED")}`}</div>
                </div>
              )}
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
            <PopInboxTable onRowSelect={onRowSelect} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PopInbox;
