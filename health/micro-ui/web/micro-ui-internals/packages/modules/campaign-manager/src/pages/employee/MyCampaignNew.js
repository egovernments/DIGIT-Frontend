import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { InboxSearchComposer } from "@egovernments/digit-ui-components";
import { myCampaignConfigNew } from "../../configs/myCampaignConfigNew";

/**
 * The `MyCampaignNew` function is a React component that displays a header with a campaign search title
 * and an inbox search composer with tabs for different configurations.
 * @returns The `MyCampaignNew` component is returning a React fragment containing a Header component with
 * a title fetched using the `useTranslation` hook, and a div with a className of
 * "digit-inbox-search-wrapper" that contains an `InboxSearchComposer` component. The `InboxSearchComposer`
 * component is being passed props such as `configs`, `showTab`, `tabData`, and `onTabChange
 */
const MyCampaignNew = () => {
  const { t } = useTranslation();
  const [config, setConfig] = useState(myCampaignConfigNew?.myCampaignConfigNew?.[0]);
  const [tabData, setTabData] = useState(
    myCampaignConfigNew?.myCampaignConfigNew?.map((configItem, index) => ({
      key: index,
      label: configItem.label,
      active: index === 0,
    }))
  );

  const onTabChange = (n) => {
    setTabData((prev) => prev.map((i, c) => ({ ...i, active: c === n  })));
    setConfig(myCampaignConfigNew?.myCampaignConfigNew?.[n]);
  };

  useEffect(() => {
    window.Digit.SessionStorage.del("HCM_CAMPAIGN_MANAGER_FORM_DATA");
    window.Digit.SessionStorage.del("HCM_CAMPAIGN_MANAGER_UPLOAD_ID");
    window.Digit.SessionStorage.del("HCM_CAMPAIGN_UPDATE_FORM_DATA");
    window.Digit.SessionStorage.del("HCM_ADMIN_CONSOLE_DATA");
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const newSession = Digit.SessionStorage.get("HCM_TIMELINE_POPUP");
      setSession(newSession);
      setTimeLine(newSession);
    };

    window.addEventListener("HCM_TIMELINE_POPUP_CHANGE", handleStorageChange);

    return () => {
      window.removeEventListener("HCM_TIMELINE_POPUP_CHANGE", handleStorageChange);
    };
  }, [Digit.SessionStorage.get("HCM_TIMELINE_POPUP")]);

  return (
    <React.Fragment>
      <div className="digit-inbox-search-wrapper">
        <InboxSearchComposer configs={config} showTab={true} tabData={tabData} onTabChange={onTabChange} />
      </div>
    </React.Fragment>
  );
};

export default MyCampaignNew;
