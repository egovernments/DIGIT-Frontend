import { Header, InboxSearchComposer } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { MicroplanCampaignSearchConfig } from "../../configs/myMicroplanConfig";



const defaultSearchValues = {

};

const MyMicroplans = () => {
  const { t } = useTranslation();
  const [defaultValues, setDefaultValues] = useState(defaultSearchValues); // State to hold default values for search fields
  const history = useHistory(); 
  useEffect(() => {
    // Set default values when component mounts
    setDefaultValues(defaultSearchValues);
  }, []);

  const onTabChange = (n) => {
    
    setTabData((prev) => prev.map((i, c) => ({ ...i, active: c === n ? true : false }))); //setting tab enable which is being clicked
    // setConfig(TabSearchconfig?.TabSearchconfig?.[n]);// as per tab number filtering the config
    const url = new URL(window.location.href);
    url.searchParams.set("tabId", `${n}`);
    window.history.replaceState({}, "", url);

  };
  const onClickRow = ({ original: row }) => {
    history.push(`/${window.contextPath}/employee/campaign/setup-campaign?id=${row.campaignId}&draft=true&fetchBoundary=true&draftBoundary=true&type=microplan`);
  };
  return (
    <React.Fragment>

      <Header styles={{ fontSize: "32px" }}>{t("MY_MICROPLANS_HEADING")}</Header>
      <div className="inbox-search-wrapper">
        {/* Pass defaultValues as props to InboxSearchComposer */}
        <InboxSearchComposer
        configs={MicroplanCampaignSearchConfig?.[0]}
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
export default MyMicroplans;