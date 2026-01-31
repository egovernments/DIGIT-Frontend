import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Card, HeaderComponent, Paragraph, CardText } from "@egovernments/digit-ui-components";
import { useDeliveryRules } from "./useDeliveryRules";
import AddDeliveryRuleWrapper from "./AddDeliverycontext";
import TagComponent from "../../../components/TagComponent";
import { convertEpochToNewDateFormat } from "../../../utils/convertEpochToNewDateFormat";

const Tabs = React.memo(() => {
  const { campaignData, activeTabIndex, changeTab } = useDeliveryRules();
  const { t } = useTranslation();

  const handleTabChange = (cycleIndex, tabIndex) => {
    changeTab(tabIndex);
  };

  return (
    <div className="campaign-tabs">
      {campaignData.map((cycle, index) => (
        <button
          key={cycle.cycleIndex}
          type="button"
          className={`campaign-tab-head ${index === activeTabIndex ? "active" : ""} hover`}
          onClick={() => handleTabChange(cycle.cycleIndex, index)}
        >
          <p style={{ margin: 0, position: "relative", top: "-0.1rem" }}>
            {t(`CAMPAIGN_CYCLE`)} {index + 1}
          </p>
        </button>
      ))}
    </div>
  );
});

const SubTabs = React.memo(() => {
  const { activeCycle, activeSubTabIndex, changeSubTab } = useDeliveryRules();
  const { t } = useTranslation();

  const handleSubTabChange = (deliveryIndex, subTabIndex) => {
    changeSubTab(subTabIndex);
  };

  if (!activeCycle?.deliveries) {
    return null;
  }

  return (
    <div>
      {activeCycle.deliveries.map((delivery, index) => (
        <button
          key={delivery.deliveryIndex}
          type="button"
          className={`campaign-sub-tab-head ${index === activeSubTabIndex ? "active" : ""} hover`}
          onClick={() => handleSubTabChange(delivery.deliveryIndex, index)}
        >
          {t(`CAMPAIGN_DELIVERY`)} {index + 1}
        </button>
      ))}
    </div>
  );
});

const TabContent = React.memo(({ project }) => {
  const { t } = useTranslation();

  return (
    <Card className="sub-tab-container">
      <SubTabs />
      <div>
        <CardText>{t(`CAMPAIGN_DELIVERY_TAB_SUB_TEXT_${project?.code ? project.code.toUpperCase() : project?.toUpperCase()}`)}</CardText>
      </div>
    </Card>
  );
});

const MultiTab = React.memo(({ projectConfig, attributeConfig, operatorConfig, deliveryTypeConfig }) => {
  const { t } = useTranslation();

  // Get session data for display
  const tempSession = useMemo(() => Digit.SessionStorage.get("HCM_CAMPAIGN_MANAGER_FORM_DATA") || {}, [projectConfig]);

  const campaignName = tempSession?.HCM_CAMPAIGN_NAME?.campaignName;
  const projectType = tempSession?.HCM_CAMPAIGN_TYPE?.projectType || projectConfig?.code;
  const campaignDates = tempSession?.HCM_CAMPAIGN_DATE?.campaignDates;

  // Memoize date formatting
  const formattedDates = useMemo(() => {
    if (!campaignDates?.startDate || !campaignDates?.endDate) {
      return "";
    }

    const startDate = convertEpochToNewDateFormat(campaignDates.startDate);
    const endDate = convertEpochToNewDateFormat(campaignDates.endDate);
    return `${startDate} - ${endDate}`;
  }, [campaignDates]);

  // Memoize project title
  const projectTitle = useMemo(() => {
    const code = projectType?.code || projectType;
    return code ? `CAMPAIGN_PROJECT_${code.toUpperCase()}` : "";
  }, [projectType]);

  return (
    <div className="container-full">
      <div className="card-container-delivery">
        {campaignName && <TagComponent campaignName={campaignName} />}

        {projectTitle && (
          <HeaderComponent styles={{ marginTop: "1.5rem" }} className="select-boundary-screen-heading">
            {t(projectTitle)}
          </HeaderComponent>
        )}

        {formattedDates && <Paragraph customClassName="cycle-paragraph" value={formattedDates} />}

        <div className="campaign-cycle-container">
          <div className="campaign-tabs-container">
            <Tabs />
          </div>

          <TabContent project={projectType} />

          <AddDeliveryRuleWrapper
            projectConfig={projectConfig}
            attributeConfig={attributeConfig}
            operatorConfig={operatorConfig}
            deliveryTypeConfig={deliveryTypeConfig}
          />
        </div>
      </div>
    </div>
  );
});

export default MultiTab;
