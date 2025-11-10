import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { InboxSearchComposer, Loader } from "@egovernments/digit-ui-components";
import { SearchConfig } from "../../configs/employee/SearchConfig";

const PropertySearch = ({initialActiveIndex =0}) => {
  const { t } = useTranslation();
  const [config, setConfig] = useState(SearchConfig?.SearchConfig?.[0]);
  const [selectedTabIndex, setSelectedTabIndex] = useState(null);
  const [isConfigReady, setIsConfigReady] = useState(false);
  const [clearSearchTrigger, setClearSearchTrigger] = useState(0);
  const [tabData, setTabData] = useState(
    SearchConfig?.SearchConfig?.map((configItem, index) => ({
      key: index,
      label: configItem.label,
      active: index === initialActiveIndex,
    }))
  );

  useEffect(() => {
    const savedIndex = initialActiveIndex;
    const configList = SearchConfig?.SearchConfig || [];
    setSelectedTabIndex(savedIndex);
    setConfig(configList[savedIndex]);
    setTabData(
      configList.map((item, idx) => ({
        key: idx,
        label: item.label,
        active: idx === initialActiveIndex,
      }))
    );
    setIsConfigReady(true);
  }, [initialActiveIndex]);

  const onTabChange = (n) => {
    Digit.SessionStorage.set("PT_SEARCH_SCREEN_SELECTED_TAB_INDEX", n);
    setSelectedTabIndex(n);
    setTabData((prev) => prev?.map((i, c) => ({ ...i, active: c === n })));
    setConfig(SearchConfig?.SearchConfig?.[n]);
    // Also trigger clear when changing tabs to reset results
    setClearSearchTrigger(prev => prev + 1);
  };

  if (!isConfigReady || !config) {
    return <Loader page={true} variant={"PageLoader"} />;
  }

  return (
    <React.Fragment>
      <div className="digit-inbox-search-wrapper">
        <InboxSearchComposer
          key={`pt-search-tab-${selectedTabIndex}-clear-${clearSearchTrigger}`}
          configs={config}
          showTab={true}
          tabData={tabData}
          onTabChange={onTabChange}
        />
      </div>
    </React.Fragment>
  );
};

export default PropertySearch;