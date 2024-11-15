import { Header, InboxSearchComposer } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { MicroplanCampaignSearchConfig } from "../../configs/myMicroplanConfig";

const MyMicroplans = () => {
  const { t } = useTranslation();
  const history = useHistory(); 
  const onClickRow = ({ original: row }) => {
    console.log("row" , row);
    const updatedName = row.name.replace(/&/g, "and");
    history.push(`/${window.contextPath}/employee/campaign/setup-campaign?id=${row.campaignId}&draft=true&fetchBoundary=true&draftBoundary=true&source=microplan&microName=${updatedName}`);
  };
  return (
    <React.Fragment>

      <Header styles={{ fontSize: "32px" }}>{t("MY_MICROPLANS_HEADING")}</Header>
      <div className="inbox-search-wrapper">
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