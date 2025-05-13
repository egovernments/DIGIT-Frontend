import React from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { InboxSearchComposer, Loader } from "@egovernments/digit-ui-components";
import { CampaignsInboxConfig } from "../../configs/CampaignsInboxConfig";

const CampaignsInbox = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const pastCampaignsInbox = pathname.includes("past-campaigns");
  const config = pastCampaignsInbox
    ? CampaignsInboxConfig({ headerLabel: t("PAST_CAMPAIGNS") })?.CampaignsInboxConfig?.[1]
    : CampaignsInboxConfig({ headerLabel: t("LIVE_CAMPAIGNS") })?.CampaignsInboxConfig?.[0];
  if (!config) {
    return <Loader />;
  }
  return (
    <React.Fragment>
      <div className="digit-inbox-search-wrapper">
        <InboxSearchComposer configs={config}></InboxSearchComposer>
      </div>
    </React.Fragment>
  );
};

export default CampaignsInbox;
