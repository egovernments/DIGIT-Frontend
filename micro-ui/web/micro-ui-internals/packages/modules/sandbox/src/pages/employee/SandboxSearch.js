import {
    Header,
    InboxSearchComposer
  } from "@egovernments/digit-ui-react-components";
  import React, { useState, useEffect } from "react";
  import { useTranslation } from "react-i18next";
  import {tenantSearchConfig } from "../../configs/tenantSearchConfig";
  
  const defaultSearchValues = {
    tenantName: "",
    tenantCode: ""
  };

 

  const TenantSearch = () => {
    const { t } = useTranslation();
    const [defaultValues, setDefaultValues] = useState(defaultSearchValues); // State to hold default values for search fields
    const indConfigs = tenantSearchConfig();

    useEffect(() => {
      // Set default values when component mounts
      setDefaultValues(defaultSearchValues);
    }, []);

    return (
      <React.Fragment>
        <Header >{t(indConfigs?.label)}</Header> 
        <div className="inbox-search-wrapper">
          {/* Pass defaultValues as props to InboxSearchComposer */}
          <InboxSearchComposer configs={indConfigs} defaultValues={defaultValues}></InboxSearchComposer>
        </div>
      </React.Fragment>
    );
  };
  export default TenantSearch;