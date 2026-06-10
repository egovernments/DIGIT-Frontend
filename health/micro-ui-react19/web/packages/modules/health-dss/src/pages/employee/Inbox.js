import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { InboxSearchComposer, Loader } from "@egovernments/digit-ui-components";
import { InboxConfig } from "../../configs/InboxConfig";

const Inbox = ({}) => {
  const { t } = useTranslation();
  const [config, setConfig] = useState(InboxConfig?.InboxConfig?.[0]);
  const [selectedTabIndex, setSelectedTabIndex] = useState(null);
  const [isConfigReady, setIsConfigReady] = useState(false);
  const [tabData, setTabData] = useState(
    InboxConfig?.InboxConfig?.map((configItem, index) => ({
      key: index,
      label: configItem.label,
      active: index === 0,
    }))
  );

  useEffect(() => {
    let savedIndex = Digit.SessionStorage.get("HCM_SELECTED_TAB_INDEX");

    // If not set, default to 0 and save it in sessionStorage
    if (savedIndex === null || isNaN(parseInt(savedIndex))) {
      savedIndex = 0;
      Digit.SessionStorage.set("HCM_SELECTED_TAB_INDEX", savedIndex);
    } else {
      savedIndex = parseInt(savedIndex);
    }

    const configList = InboxConfig?.InboxConfig || [];
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
    Digit.SessionStorage.set("HCM_SELECTED_TAB_INDEX", n);
    setSelectedTabIndex(n);
    setTabData((prev) => prev?.map((i, c) => ({ ...i, active: c === n })));
    setConfig(InboxConfig?.InboxConfig?.[n]);
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

export default Inbox;
