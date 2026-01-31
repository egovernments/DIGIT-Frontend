import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Header, InboxSearchComposer } from "@egovernments/digit-ui-react-components";
import { useNavigate } from "react-router-dom";
import { myCampaignConfig } from "../../configs/myCampaignConfig";

/**
 * The `MyCampaign` function is a React component that displays a header with a campaign search title
 * and an inbox search composer with tabs for different configurations.
 * @returns The `MyCampaign` component is returning a React fragment containing a Header component with
 * a title fetched using the `useTranslation` hook, and a div with a className of
 * "inbox-search-wrapper" that contains an `InboxSearchComposer` component. The `InboxSearchComposer`
 * component is being passed props such as `configs`, `showTab`, `tabData`, and `onTabChange
 */
const MyCampaign = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [config, setConfig] = useState(myCampaignConfig?.myCampaignConfig?.[0]);
  const [tabData, setTabData] = useState(
    myCampaignConfig?.myCampaignConfig?.map((configItem, index) => ({ key: index, label: configItem.label, active: index === 0 ? true : false }))
  );

  const onTabChange = (n) => {
    setTabData((prev) => prev.map((i, c) => ({ ...i, active: c === n ? true : false })));
    setConfig(myCampaignConfig?.myCampaignConfig?.[n]);
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

  const onClickRow = ({ original: row }) => {
    const currentTab = tabData?.find((i) => i?.active === true)?.label;
    const currentDate = new Date().getTime();
    switch (currentTab) {
      case "CAMPAIGN_ONGOING":
        navigate(`/${window.contextPath}/employee/campaign/setup-campaign?id=${row.id}&preview=${true}&action=${false}&actionBar=${true}`);
        break;
      case "CAMPAIGN_COMPLETED":
        navigate(`/${window.contextPath}/employee/campaign/setup-campaign?id=${row.id}&preview=${true}&action=${false}`);
        break;
      case "CAMPAIGN_UPCOMING":
        navigate(`/${window.contextPath}/employee/campaign/setup-campaign?id=${row.id}&preview=${true}&action=${false}&actionBar=${true}`);
        break;
      case "CAMPAIGN_DRAFTS":
        if (row?.parentId) {
          navigate(
            `/${window.contextPath}/employee/campaign/update-campaign?parentId=${row.parentId}&id=${row.id}&draft=${true}&campaignName=${
              row.campaignName
            }`
          );
        } else {
          const baseUrl = `/${window.contextPath}/employee/campaign/setup-campaign?id=${row.id}&draft=true&fetchBoundary=true&draftBoundary=true`;
          const hasPassedDates = row.startDate <= currentDate || row.endDate <= currentDate;
          const finalUrl = hasPassedDates ? `${baseUrl}&date=true` : baseUrl;
          navigate(finalUrl);
        }
        break;
      case "CAMPAIGN_FAILED":
        navigate(`/${window.contextPath}/employee/campaign/setup-campaign?id=${row.id}&preview=${true}&action=${false}`);
        break;
      default:
        break;
    }
  };

  return (
    <React.Fragment>
      <Header styles={{ fontSize: "32px" }}>{t("CAMPAIGN_SEARCH_TITLE")}</Header>
      <div className="inbox-search-wrapper">
        <InboxSearchComposer
          configs={config}
          showTab={true}
          tabData={tabData}
          onTabChange={onTabChange}
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

export default MyCampaign;
