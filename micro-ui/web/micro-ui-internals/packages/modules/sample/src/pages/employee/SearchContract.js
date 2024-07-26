import {
    Header,
    InboxSearchComposer
  } from "@egovernments/digit-ui-react-components";
  import React, { useState, useEffect } from "react";
  import { useTranslation } from "react-i18next";
  import { searchconfig } from "../../configs/SearchContractConfig";
  import { useHistory } from 'react-router-dom';



const defaultSearchValues = {
    Field: { label: "Name", opt: "name" }, // Default selection for the dropdown
    Value: "", // Default value for the input field
  };

  const SearchContract = () => {
    const { t } = useTranslation();
    const history = useHistory(); // Get history object for navigation
    const [defaultValues, setDefaultValues] = useState(defaultSearchValues); // State to hold default values for search fields
    const indConfigs = searchconfig();

    //   console.log(data);
    const onClickRow = (row) =>{
        //debugger;
    console.log(row);
    history.push(`view-contract?id=${row.original.data.name}`);
  }

    useEffect(() => {
      // Set default values when component mounts
      setDefaultValues(defaultSearchValues);
    }, []);


    return (
      <React.Fragment>
        <Header styles={{ fontSize: "32px" }}>{t(indConfigs?.label)}</Header> 
        <div className="inbox-search-wrapper">
          {/* Pass defaultValues as props to InboxSearchComposer */}
          <InboxSearchComposer configs={indConfigs} defaultValues={defaultValues} additionalConfig={{
            resultsTable: {
              onClickRow,
            },
          }}></InboxSearchComposer>
        </div>
      </React.Fragment>
    );
  };
  export default SearchContract;

