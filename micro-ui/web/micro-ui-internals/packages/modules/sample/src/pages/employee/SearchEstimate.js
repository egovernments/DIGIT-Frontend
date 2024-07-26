import { Header, InboxSearchComposer } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import SearchEstimateConfig from "../../configs/SearchEstimateConfig";

import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import reactRouterDom from "react-router-dom";

const defaultSearchValues = {
  id: "",
  tenantId: "",
  schemaCode: "",
};

const SearchEstimate = () => {
  const history = useHistory();

  const onClickRow = (row) => {
    console.log(row);
    const data = row.original.data;
    console.log(data, "data");
    history.push(`view?name=${data.name}`);
  };

  const { t } = useTranslation();
  const [defaultValues, setDefaultValues] = useState(defaultSearchValues); // State to hold default values for search fields
  const indConfigs = SearchEstimateConfig();

  useEffect(() => {
    // Set default values when component mounts
    setDefaultValues(defaultSearchValues);
  }, []);

  return (
    <React.Fragment>
      <Header styles={{ fontSize: "32px" }}>{t(indConfigs?.label)}</Header>
      <div className="inbox-search-wrapper">
        {/* Pass defaultValues as props to InboxSearchComposer */}
        <InboxSearchComposer
          configs={indConfigs}
          defaultValues={defaultValues}
          additionalConfig={{
            resultsTable: {
              onClickRow,
            },
          }}
        ></InboxSearchComposer>
      </div>
    </React.Fragment>
  );
};
export default SearchEstimate;
