import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { InboxSearchComposer, Loader } from "@egovernments/digit-ui-components";
import { campaignTemplateConfig } from "./campaignTemplateConfig";
import { I18N_KEYS } from "../../../utils/i18nKeyConstants";

const srOnlyStyle = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
};

const CampaignTemplates = () => {
  const { t } = useTranslation();
  const [config, setConfig] = useState(null);
  const [isConfigReady, setIsConfigReady] = useState(false);

  useEffect(() => {
    setConfig(campaignTemplateConfig?.campaignTemplateConfig?.[0]);
    setIsConfigReady(true);
  }, []);

  if (!isConfigReady || !config) {
    // The loading state carries the same landmark and heading as the loaded one. Without them a
    // slow load leaves a screen reader with no main region and no heading to navigate to, and the
    // page momentarily fails axe landmark-one-main / page-has-heading-one.
    return (
      <main style={{ display: "contents" }}>
        <h1 style={srOnlyStyle}>{t(I18N_KEYS.COMMON.CAMPAIGN_TEMPLATES)}</h1>
        <Loader page={true} variant={"PageLoader"} />
      </main>
    );
  }

  return (
    // <main> with display: contents: the employee layout has no main landmark (axe landmark-one-main /
    // region). The page has no visible title, so expose a screen-reader-only h1 (page-has-heading-one).
    <main style={{ display: "contents" }}>
      <h1 style={srOnlyStyle}>{t(I18N_KEYS.COMMON.CAMPAIGN_TEMPLATES)}</h1>
      <div className="digit-inbox-search-wrapper">
        <InboxSearchComposer configs={config} showTab={false} />
      </div>
    </main>
  );
};

export default CampaignTemplates;
