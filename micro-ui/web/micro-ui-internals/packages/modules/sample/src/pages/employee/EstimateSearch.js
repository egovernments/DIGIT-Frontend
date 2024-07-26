import {
  Header,
  InboxSearchComposer
} from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { searchconfig } from "../../configs/EstimateSearchConfig";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const defaultSearchValues = {
  tenantId: "",
  schemaCode:""
};

const EstimateSearch = () => {
  const { t } = useTranslation();
  const [defaultValues, setDefaultValues] = useState(defaultSearchValues); // State to hold default values for search fields
  const estimateConfigs = searchconfig();
  const history = useHistory();

  useEffect(() => {
    // Set default values when component mounts
    setDefaultValues(defaultSearchValues);
  }, []);

  const onClickRow = (data) => {
    console.log(data)
    const name = data.original.data.name;
    console.log(name)
    history.push(`/microplan-ui/employee/sample/estimate-details-view/${name}`);
  }

  return (
    <React.Fragment>
    <Header styles={{ fontSize: "32px" }}>{t(estimateConfigs?.label)}</Header> 
    <div className="inbox-search-wrapper">
      {/* Pass defaultValues as props to InboxSearchComposer */}
      <InboxSearchComposer
        configs={estimateConfigs} 
        defaultValues={defaultValues}
        additionalConfig={{
          resultsTable: {
            onClickRow,
          },
        }}
      >
      </InboxSearchComposer>
    </div>
  </React.Fragment>
  )
}

export default EstimateSearch