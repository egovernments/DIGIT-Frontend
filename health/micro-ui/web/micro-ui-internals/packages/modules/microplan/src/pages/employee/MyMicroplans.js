import { Header, InboxSearchComposer } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { TabSearchconfig } from "../../configs/MyMicroplanSearchConfig";



const defaultSearchValues = {

};

const MyMicroplans = () => {
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
  const [key,setKey] = useState(0);
  const onTabChange = (n) => {
    
    setTabData((prev) => prev.map((i, c) => ({ ...i, active: c === n ? true : false }))); //setting tab enable which is being clicked
    // setConfig(TabSearchconfig?.TabSearchconfig?.[n]);// as per tab number filtering the config
    const url = new URL(window.location.href);
    url.searchParams.set("tabId", `${n}`);
    window.history.replaceState({}, "", url);
    setKey((prev)=>prev+1);
  };
  return (
    <React.Fragment key={key}>

      <Header styles={{ fontSize: "32px" }}>{t("MY_MICROPLANS_HEADING")}</Header>
      <div className="inbox-search-wrapper">
        {/* Pass defaultValues as props to InboxSearchComposer */}
        <InboxSearchComposer
          configs={config}
          defaultValues={defaultValues}
          showTab={true}
          tabData={tabData}
          onTabChange={onTabChange} //!activated ion tabChange
        ></InboxSearchComposer>
      </div>
    </React.Fragment>
  );
};
export default MyMicroplans;