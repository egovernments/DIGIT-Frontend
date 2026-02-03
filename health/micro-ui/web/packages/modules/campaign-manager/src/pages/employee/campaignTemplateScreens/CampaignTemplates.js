import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { InboxSearchComposer, Loader } from "@egovernments/digit-ui-components";
import { campaignTemplateConfig } from "./campaignTemplateConfig";

const CampaignTemplates = () => {
  const { t } = useTranslation();
  const [config, setConfig] = useState(null);
  const [isConfigReady, setIsConfigReady] = useState(false);

  useEffect(() => {
    setConfig(campaignTemplateConfig?.campaignTemplateConfig?.[0]);
    setIsConfigReady(true);
  }, []);

  if (!isConfigReady || !config) {
    return <Loader page={true} variant={"PageLoader"} />;
  }

  return (
    <React.Fragment>
      <div className="digit-inbox-search-wrapper">
        <InboxSearchComposer configs={config} showTab={false} />
      </div>
    </React.Fragment>
  );
};

export default CampaignTemplates;
