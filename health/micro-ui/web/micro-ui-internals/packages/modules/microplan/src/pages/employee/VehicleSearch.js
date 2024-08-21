import {
    Header,
    InboxSearchComposer
  } from "@egovernments/digit-ui-react-components";
  import React, { useState, useEffect } from "react";
  import { useTranslation } from "react-i18next";
  import { vehiclesearchconfig } from "../../configs/VehicleSearchConfig";
  import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
  
  const defaultSearchValues = {
    tenantId: "",
    schemaCode: ""
  };
  
  
  
  const VehicleSearch = () => {
    const { t } = useTranslation();
    const [defaultValues, setDefaultValues] = useState(defaultSearchValues); // State to hold default values for search fields
    const vehicleConfigs = vehiclesearchconfig();
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
        <Header styles={{ fontSize: "32px" }}>{t(vehicleConfigs?.label)}</Header>
        <div className="inbox-search-wrapper">
          {/* Pass defaultValues as props to InboxSearchComposer */}
          <InboxSearchComposer
            configs={vehicleConfigs}
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
  export default VehicleSearch;