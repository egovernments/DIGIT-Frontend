import { Button, Card, HeaderComponent } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import React from "react";
import { useHistory } from "react-router-dom";
import { NewWindow } from "../../../components/icons/NewWindow";
import { System_update_alt } from "../../../components/icons/System_update_alt";

const CampaignHome = () => {
  const { t } = useTranslation();
  const history = useHistory();

  return (
    <Card>
      <HeaderComponent className="header-style">{t(`HCM_HOW_DO_YOU_WANT_TO_CREATE`)}</HeaderComponent>
      <p className="name-description">{t(`HCM_CREATE_CAMPAIGN_DESCRIPTION`)}</p>
      <div className={"containerStyle"}>
        <div
          className={"cardStyle"}
          onClick={() => {
            // Add functionality for importing existing campaign
          }}
        >
          <System_update_alt /> 
          <div className={"descStyle"}>{t("HCM_IMPORT_EXISTING_CAMPAIGN")}</div>
        </div>

        <div
          className={"cardStyle"}
          onClick={() => {
            history.push(`/${window.contextPath}/employee/campaign/create-campaign`);
          }}
        >
          <NewWindow />
          <div className={"descStyle"}>{t("HCM_CREATE_NEW_CAMPAIGN")}</div>
        </div>
      </div>
    </Card>
  );
};

export default CampaignHome;
