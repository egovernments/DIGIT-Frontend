import React from "react";
import { InboxSearchComposer } from "@egovernments/digit-ui-components";
import { inboxConfig } from "../../../configs/uiComponentsConfigs/inboxConfig";

const SampleInbox = () => {
  return (
    <div className="digit-inbox-search-wrapper">
      <InboxSearchComposer configs={inboxConfig}></InboxSearchComposer>
    </div>
  );
};

export default SampleInbox;
