import { Card, HeaderComponent } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { SVG } from "@egovernments/digit-ui-components";
import { NewWindow } from "@egovernments/digit-ui-svg-components";

const CampaignHome = () => {
  const { t } = useTranslation();
  const history = useHistory();

  useEffect(() => {
    window.Digit.SessionStorage.del("HCM_ADMIN_CONSOLE_DATA");
    window.Digit.SessionStorage.del("SelectedFeaturesByModule");

  }, []);

  return (
    <Card>
      <HeaderComponent className="campaign-header-style">{t(`HCM_HOW_DO_YOU_WANT_TO_CREATE`)}</HeaderComponent>
      <p className="name-description">{t(`HCM_CREATE_CAMPAIGN_DESCRIPTION`)}</p>
      <div className={"containerStyle"}>
        <div
          className={"cardStyle"}
          onClick={() => {
            // Add functionality for importing existing campaign
          }}
        >
          <SVG.SystemUpdateAlt width="40" height="40" />
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
