import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { InboxSearchComposer, Loader } from "@egovernments/digit-ui-components";
import { commodityCampaignConfig } from "../../configs/commodityCampaignConfig";

const CommodityCampaigns = () => {
  const { t } = useTranslation();
  const [config, setConfig] = useState(null);
  const [selectedTabIndex, setSelectedTabIndex] = useState(null);
  const [tabData, setTabData] = useState(
    commodityCampaignConfig?.commodityCampaignConfig?.map((configItem, index) => ({
      key: index,
      label: configItem.label,
      active: index === 0,
    }))
  );
  const [isConfigReady, setIsConfigReady] = useState(false);

  useEffect(() => {
    const savedIndex = parseInt(sessionStorage.getItem("HCM_COMMODITY_TAB_INDEX")) || 0;

    const configList = commodityCampaignConfig?.commodityCampaignConfig || [];
    setSelectedTabIndex(savedIndex);
    setConfig(configList[savedIndex]);
    setTabData(
      configList.map((item, idx) => ({
        key: idx,
        label: item.label,
        active: idx === savedIndex,
      }))
    );
    setIsConfigReady(true);
  }, []);

  const onTabChange = (n) => {
    const isAlreadyActive = tabData?.find((tab) => tab.key === n)?.active;
    if (isAlreadyActive) {
      return;
    }
    sessionStorage.setItem("HCM_COMMODITY_TAB_INDEX", n);
    setSelectedTabIndex(n);
    setTabData((prev) => prev?.map((i, c) => ({ ...i, active: c === n })));
    setConfig(commodityCampaignConfig?.commodityCampaignConfig?.[n]);
  };

  if (!isConfigReady || !config) {
    return <Loader page={true} variant={"PageLoader"} />;
  }

  return (
    <React.Fragment>
      <div className="digit-inbox-search-wrapper">
        <InboxSearchComposer configs={config} showTab={true} tabData={tabData} onTabChange={onTabChange} />
      </div>
    </React.Fragment>
  );
};

export default CommodityCampaigns;
