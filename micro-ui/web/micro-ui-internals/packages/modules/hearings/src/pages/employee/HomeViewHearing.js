import { useTranslation } from "react-i18next";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Header, InboxSearchComposer, FormComposerV2 } from "@egovernments/digit-ui-react-components";
import { TabSearchconfig } from "../../configs/HearingsHomeConfig";
import UpcomingHearings from "../../components/UpComingHearing";
import TasksComponent from "../../components/TaskComponent";
const fieldStyle = { marginRight: 0 };
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
    <div className="home-view-hearing-container">
      <div className="left-side">
        <UpcomingHearings handleNavigate={handleNavigate} />
        <div className="content-wrapper">
          <Header styles={{ fontSize: "32px", paddingTop: "16px" }}>{t(config?.label)}</Header>
          <div className="inbox-search-wrapper pucar-hearing-home">
            <InboxSearchComposer
              configs={config}
              defaultValues={defaultValues}
              showTab={true}
              tabData={tabData}
              onTabChange={onTabChange}
            />
          </div>
        </div>
      </div>
      <div className="right-side">
        <TasksComponent />
      </div>
    </div>
  );
};
export default HomeViewHearing;