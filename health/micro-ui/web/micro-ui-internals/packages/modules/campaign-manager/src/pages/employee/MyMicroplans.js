import { Header, InboxSearchComposer } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { MicroplanCampaignSearchConfig } from "../../configs/myMicroplanConfig";

// export const  updateUrlParams=(params) =>{
//   const url = new URL(window.location.href);
//   Object.entries(params).forEach(([key, value]) => {
//     url.searchParams.set(key, value);
//   });
//   window.history.replaceState({}, "", url);
// }

const MyMicroplans = () => {
  const { t } = useTranslation();
  const history = useHistory(); 
  // const userId = Digit.UserService.getUser().info.uuid;
  // const microplanStatus =  "RESOURCE_ESTIMATIONS_APPROVED"
  
  // useEffect(() =>{
  //   updateUrlParams({ userId: userId, status: microplanStatus });
  // },[])
  const onClickRow = ({ original: row }) => {
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