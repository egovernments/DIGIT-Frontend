import { Header, InboxSearchComposer } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { TabSearchconfig } from '../../configs/MicroplanSearchConfig'



const defaultSearchValues = {
  individualName: "",

};

const MicroplanSearch = () => {
  const { t } = useTranslation();
  const [defaultValues, setDefaultValues] = useState(defaultSearchValues); // State to hold default values for search fields
  const [config, setConfig] = useState(TabSearchconfig?.TabSearchconfig?.[0]); // initially setting first index config as default from jsonarray
  const [tabData, setTabData] = useState(
    TabSearchconfig?.TabSearchconfig?.map((configItem, index) => ({ key: index, label: configItem.label, active: index === 0 ? true : false }))
  ); // setting number of tab component and making first index enable as default
  useEffect(() => {
    // Set default values when component mounts
    console.log("hihihiijjiji");
    setDefaultValues(defaultSearchValues);
  }, []);

  const onTabChange = (n) => {
    debugger
    setTabData((prev) => prev.map((i, c) => ({ ...i, active: c === n ? true : false }))); //setting tab enable which is being clicked
    // setConfig(TabSearchconfig?.TabSearchconfig?.[n]);// as per tab number filtering the config
    const url = new URL(window.location.href);
    url.searchParams.set("tabId", `${n}`);
    window.history.replaceState({}, "", url);

  };
  return (
    <React.Fragment>

      <Header styles={{ fontSize: "32px" }}>{t(config?.label)}</Header>
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
export default MicroplanSearch;
