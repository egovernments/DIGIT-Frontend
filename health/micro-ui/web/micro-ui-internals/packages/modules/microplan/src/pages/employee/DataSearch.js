import {
    Header,
    InboxSearchComposer
  } from "@egovernments/digit-ui-react-components";
  import React, { useState, useEffect } from "react";
  import { useTranslation } from "react-i18next";
  import { datasearchconfig} from "../../configs/DataSearchConfig";
  import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
  
  const defaultSearchValues = {
    tenantId: "",
    schemaCode: ""
  };
  
  
  
  const DataSearch = () => {
    const { t } = useTranslation();
    const [defaultValues, setDefaultValues] = useState(defaultSearchValues); // State to hold default values for search fields
    const dataConfigs=datasearchconfig();
    const history = useHistory();
  
    useEffect(() => {
      
      setDefaultValues(defaultSearchValues);
    }, []);

    const onClickRow = (data) => {
      console.log(data);
      const row = data.original.data.name;
      console.log(row);
      
  
    }
  
    
  
    return (
      <React.Fragment>
        <Header styles={{ fontSize: "32px" }}>{t(dataConfigs?.label)}</Header>
        <div className="inbox-search-wrapper">
          {/* Pass defaultValues as props to InboxSearchComposer */}
          <InboxSearchComposer
            configs={dataConfigs}
            defaultValues={defaultValues}
            additionalConfig={{
              resultsTable: {
                onClickRow
              }
            }}
           >
  
          </InboxSearchComposer>
        </div>
      </React.Fragment>
    );
  };
  export default DataSearch;