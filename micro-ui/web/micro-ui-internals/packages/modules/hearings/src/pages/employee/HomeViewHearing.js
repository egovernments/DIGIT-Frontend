import { useTranslation } from "react-i18next";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Header, InboxSearchComposer ,FormComposerV2} from "@egovernments/digit-ui-react-components";
import { TabSearchconfig } from "../../configs/HearingsHomeConfig"; 

const fieldStyle={ marginRight: 0 };


const defaultSearchValues = {
    individualName: "",
    mobileNumber: "",
    IndividualID: "",
  };

const HomeViewHearing = () => {

  const history = useHistory();
  const { t } = useTranslation();
  const [defaultValues, setDefaultValues] = useState(defaultSearchValues); // State to hold default values for search fields
  const [config, setConfig] = useState(TabSearchconfig?.TabSearchconfig?.[0]); // initially setting first index config as default from jsonarray
  const [tabData, setTabData] = useState(
    TabSearchconfig?.TabSearchconfig?.map((configItem, index) => ({ key: index, label: configItem.label, active: index === 0 ? true : false }))
  ); // setting number of tab component and making first index enable as default
  useEffect(() => {
    // Set default values when component mounts
    setDefaultValues(defaultSearchValues);
  }, []);
  
  const onTabChange = (n) => {
    setTabData((prev) => prev.map((i, c) => ({ ...i, active: c === n ? true : false }))); //setting tab enable which is being clicked
    setConfig(TabSearchconfig?.TabSearchconfig?.[n]);// as per tab number filtering the config
  };
  

  const handleNavigate = () => {
    const contextPath = window?.contextPath || ''; // Adjust as per your context path logic
    history.push(`/${contextPath}/employee/hearings/view-hearing`);
  };

  return (
    <div>
    <button className="redirect-button" onClick={handleNavigate} 
            style={{
              backgroundColor: 'blue',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '5px',
              border: 'none',
              cursor: 'pointer',
              margin:'2px'
    
          }}>
      
      View Hearing
    </button>
    <React.Fragment>
    <Header styles={{ fontSize: "32px" }}>{t(config?.label)}</Header>
    <div className="inbox-search-wrapper">
      {/* Pass defaultValues as props to InboxSearchComposer */}
      <InboxSearchComposer
        configs={config}
        defaultValues={defaultValues}
        showTab={true}
        tabData={tabData}
        onTabChange={onTabChange}
      ></InboxSearchComposer>
    </div>
  </React.Fragment>


    </div>
  );
};

export default HomeViewHearing;
