import { Header, InboxSearchComposer } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { MicroplanCampaignSearchConfig } from "../../configs/myMicroplanConfig";

const ApprovedMicroplans = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onClickRow = ({ original: row }) => {
    const updatedName = row.name.replace(/&/g, "and");
    navigate(
      `/${window.contextPath}/employee/campaign/fetch-from-microplan?id=${row.campaignId}&draft=true&fetchBoundary=true&draftBoundary=true&source=microplan&microName=${updatedName}&planConfigurationId=${row.id}`
    );
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
export default ApprovedMicroplans;
