import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { I18N_KEYS } from "../../../utils/i18nKeyConstants";
import { Card, HeaderComponent, Paragraph, CardText, Tab, Toggle } from "@egovernments/digit-ui-components";
import { useDeliveryRules } from "./useDeliveryRules";
import AddDeliveryRuleWrapper from "./AddDeliverycontext";
import TagComponent from "../../../components/TagComponent";
import { convertEpochToNewDateFormat } from "../../../utils/convertEpochToNewDateFormat";
import useCampaignStore from "../../../hooks/useCampaignStore";

const Tabs = React.memo(() => {
  const { campaignData, activeTabIndex, changeTab } = useDeliveryRules();
  const { t } = useTranslation();

  if (campaignData.length <= 1) return null;

  const tabItems = campaignData.map((cycle, index) => ({
    code: String(index),
    name: `${t(I18N_KEYS.PAGES.CAMPAIGN_CYCLE)} ${index + 1}`,
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

const SubTabs = React.memo(({ deliveryMethods }) => {
  const { activeCycle, activeSubTabIndex, changeSubTab } = useDeliveryRules();
  const { t } = useTranslation();

  const deliveries = activeCycle?.deliveries || [];
  if (deliveries.length <= 1) {
    return null;
  }

  // A delivery carrying a strategy code represents a delivery strategy rather than a dose, so it
  // is labelled with the strategy name. Labels come from each strategy's own i18nKey in MDMS
  // rather than a key built from the code, so a strategy added in MDMS needs no frontend change.
  const isMethodMode = deliveries.some((delivery) => delivery?.deliveryMethod);

  const options = deliveries.map((delivery, index) => {
    const meta = deliveryMethods?.find((m) => m?.code === delivery?.deliveryMethod);
    return {
      code: String(index),
      name: delivery?.deliveryMethod
        ? t(meta?.i18nKey || delivery.deliveryMethod)
        : `${t(I18N_KEYS.COMPONENTS.CAMPAIGN_DELIVERY)} ${index + 1}`,
    };
  });

  if (isMethodMode) {
    return (
      <Tab
        activeLink={String(activeSubTabIndex)}
        configItemKey="code"
        configDisplayKey="name"
        configNavItems={options}
        setActiveLink={(code) => {
          changeSubTab(Number(code));
        }}
        showNav={true}
        style={{}}
      />
    );
  }

  return (
    <Toggle
      options={options}
      optionsKey="name"
      selectedOption={String(activeSubTabIndex)}
      onSelect={(code) => {
        changeSubTab(Number(code));
      }}
      style={{}}
    />
  );
});

const TabContent = React.memo(({ project, deliveryMethods }) => {
  const { activeCycle, campaignData } = useDeliveryRules();
  const { t } = useTranslation();

  const hasMultipleCycles = campaignData?.length > 1;
  const hasMultipleDeliveries = activeCycle?.deliveries?.length > 1;

  if (!hasMultipleCycles && !hasMultipleDeliveries) return null;

  // The sub-text explains what a delivery within a cycle is. It adds nothing when the tabs are
  // delivery strategies, because the tab label already says what each one is.
  const isMethodMode = (activeCycle?.deliveries || []).some((delivery) => delivery?.deliveryMethod);

  // Strategy tabs are rendered without a card of their own so that the delivery condition card
  // attaches directly beneath them. Cycle tabs keep their card and its sub-text.
  if (isMethodMode) {
    return <SubTabs deliveryMethods={deliveryMethods} />;
  }

  return (
    <Card className="sub-tab-container">
      <SubTabs deliveryMethods={deliveryMethods} />
      <div>
        <CardText>{t(`CAMPAIGN_DELIVERY_TAB_SUB_TEXT_${project?.code ? project.code.toUpperCase() : project?.toUpperCase()}`)}</CardText>
      </div>
    </Card>
  );
});

const MultiTab = React.memo(({ projectConfig, attributeConfig, operatorConfig, deliveryTypeConfig }) => {
  const { t } = useTranslation();
  const [formStorageData] = useCampaignStore("HCM_CAMPAIGN_MANAGER_FORM_DATA", null);

  // Get session data for display
  const tempSession = useMemo(() => formStorageData || {}, [formStorageData, projectConfig]);

  const projectType = tempSession?.HCM_CAMPAIGN_TYPE?.projectType || projectConfig?.code;
  const campaignDates = tempSession?.HCM_CAMPAIGN_DATE?.campaignDates;

  // Memoize date formatting
  const formattedDates = useMemo(() => {
    if (!campaignDates?.startDate || !campaignDates?.endDate) {
      return "";
    }

    const startDate = convertEpochToNewDateFormat(campaignDates.startDate);
    const endDate = convertEpochToNewDateFormat(campaignDates.endDate);
    if (!startDate || !endDate) return "";
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
        {formattedDates && <TagComponent campaignName={formattedDates} />}

        {projectTitle && (
          <HeaderComponent styles={{ marginTop: "1.5rem",marginBottom: "1.5rem" }} className="select-boundary-screen-heading">
            {t(projectTitle)}
          </HeaderComponent>
        )}

        <div className="campaign-cycle-container">
          <div className="campaign-tabs-container">
            <Tabs />
          </div>

          <TabContent project={projectType} deliveryMethods={projectConfig?.deliveryMethods} />

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
