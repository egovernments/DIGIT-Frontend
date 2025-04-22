import { InboxSearchComposer } from "@egovernments/digit-ui-components";
import React from "react";
import { searchConfig } from "../../../configs/uiComponentsConfigs/searchConfig";

const SampleSearch = () => {
  return (
    <div className="digit-inbox-search-wrapper">
      <InboxSearchComposer configs={searchConfig}></InboxSearchComposer>
    </div>
  );
};
export default SampleSearch;
