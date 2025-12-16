import React, { useEffect, useState, useRef } from "react";
import { InboxSearchComposer } from "@egovernments/digit-ui-components";
import { boundarySearchConfig } from "../../configs/boundarySearchConfig";

const ViewBoundary = () => {
  return (
    <div className="digit-inbox-search-wrapper" style={{ marginTop: '1.5rem' }}>
      <InboxSearchComposer
        configs={boundarySearchConfig?.[0]}
      ></InboxSearchComposer>
    </div>
  );
};

export default ViewBoundary;
