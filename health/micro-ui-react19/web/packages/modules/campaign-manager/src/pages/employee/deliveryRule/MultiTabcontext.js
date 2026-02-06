import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Card, HeaderComponent, Paragraph, CardText, Tab, Toggle } from "@egovernments/digit-ui-components";
import { useDeliveryRules } from "./useDeliveryRules";
import AddDeliveryRuleWrapper from "./AddDeliverycontext";
import TagComponent from "../../../components/TagComponent";
import { convertEpochToNewDateFormat } from "../../../utils/convertEpochToNewDateFormat";

const Tabs = React.memo(() => {
  const { campaignData, activeTabIndex, changeTab } = useDeliveryRules();
  const { t } = useTranslation();

  const tabItems = campaignData.map((cycle, index) => ({
    code: String(index),
    name: `${t("CAMPAIGN_CYCLE")} ${index + 1}`,
  }));

  return (
    <Tab
      activeLink={String(activeTabIndex)}
      configItemKey="code"
      configDisplayKey="name"
      configNavItems={tabItems}
      setActiveLink={(code) => {
        changeTab(Number(code));
      }}
      showNav={true}
      style={{}}
    />
  );
});

const SubTabs = React.memo(() => {
  const { activeCycle, activeSubTabIndex, changeSubTab } = useDeliveryRules();
  const { t } = useTranslation();

  if (!activeCycle?.deliveries) {
    return null;
  }

  const toggleOptions = activeCycle.deliveries.map((delivery, index) => ({
    code: String(index),
    name: `${t("CAMPAIGN_DELIVERY")} ${index + 1}`,
  }));

  return (
    <Toggle
      options={toggleOptions}
      optionsKey="name"
      selectedOption={String(activeSubTabIndex)}
      onSelect={(code) => {
        changeSubTab(Number(code));
      }}
      style={{}}
    />
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
