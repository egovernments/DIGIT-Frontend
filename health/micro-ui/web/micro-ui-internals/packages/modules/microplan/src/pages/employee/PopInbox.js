import React, { Fragment, useState, useEffect } from "react";
import SearchJurisdiction from "../../components/SearchJurisdiction";
import { boundaries } from "../../components/boundaries";
import PopInboxTable from "../../components/PopInboxTable";
import { Card, Tab } from "@egovernments/digit-ui-components";
const jurisdiction = {
  boundaryType: "District",
  boundaryCodes: [
    // "MICROPLAN_MO_05_05_GREENVILLE",
    // "MICROPLAN_MO_05_04_GBLONEE",
    // "MICROPLAN_MO_04_06_KUNGBOR"
    // "MICROPLAN_MO"
    "MICROPLAN_MO_05_06_JEADE",
  ],
};

const statusMap = {
  PENDING_FOR_APPROVAL: 4,
  PENDING_FOR_VALIDATION: 4,
  APPROVED: 6,
  VALIDATED: 3,
};

const PopInbox = () => {
  const [showTab, setShowTab] = useState(true);
  const [activeLink,setActiveLink] = useState({
    code: "ASSIGNED_TO_ME",
    name: "ASSIGNED_TO_ME",
  })
  const onSearch = (selectedBoundaries) => {
    console.log(selectedBoundaries);
  };
  const onFilter = (selectedStatus) => {
    console.log(selectedStatus);
  }
  // need to add table and filter card

  return (
    <div className="pop-inbox-wrapper">
      <SearchJurisdiction boundaries={boundaries()} jurisdiction={jurisdiction} onSubmit={onSearch} />

      <div className={"pop-inbox-table-wrapper"}>
        {showTab && (
          <Tab
            activeLink={activeLink.code}
            configItemKey="code"
            configNavItems={[
              {
                code: "ASSIGNED_TO_ME",
                name: "ASSIGNED_TO_ME",
              },
              {
                code: "ASSIGNED_TO_ALL",
                name: "ASSIGNED_TO_ALL",
              }
            ]}
            itemStyle={{}}
            navStyles={{}}
            onTabClick={(e)=>{
              setActiveLink(e)
              
            }}
            setActiveLink={setActiveLink}
            showNav
            style={{}}
          />
        )}
        <Card>
          <PopInboxTable />
        </Card>
      </div>
    </div>
  );
};

export default PopInbox;
