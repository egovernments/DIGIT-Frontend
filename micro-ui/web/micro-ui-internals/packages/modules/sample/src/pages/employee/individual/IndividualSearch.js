import { InboxSearchComposer } from "@egovernments/digit-ui-components";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { searchconfig } from "../../../configs/IndividualSearchConfig";

const defaultSearchValues = {
  individualName: "",
  mobileNumber: "",
  IndividualID: ""
};



const IndividualSearch = () => {
  const { t } = useTranslation();
  const [defaultValues, setDefaultValues] = useState(defaultSearchValues); // State to hold default values for search fields
  const indConfigs = searchconfig();

  useEffect(() => {
    // Set default values when component mounts
    setDefaultValues(defaultSearchValues);
  }, []);

  return (
    <React.Fragment>
      <div className="digit-inbox-search-wrapper">
        {/* Pass defaultValues as props to InboxSearchComposer */}
        <InboxSearchComposer configs={indConfigs} defaultValues={defaultValues}></InboxSearchComposer>
      </div>
    </React.Fragment>
  );
};
export default IndividualSearch;