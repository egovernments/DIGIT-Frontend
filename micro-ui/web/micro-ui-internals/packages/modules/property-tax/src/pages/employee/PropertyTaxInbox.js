import React from "react";
import { InboxSearchComposer } from "@egovernments/digit-ui-components";
import { InboxConfig } from "../../configs/employee/InboxConfig";

const PropertyTaxInbox = () => {
  return (
    <div className="digit-inbox-search-wrapper">
      <InboxSearchComposer configs={InboxConfig}>
      </InboxSearchComposer>
    </div>
  );
};

export default PropertyTaxInbox;