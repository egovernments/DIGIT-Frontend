import React, { Fragment, useContext, useState , useEffect } from "react";
import { Card, Header, Paragraph, CardHeader, CardSubHeader, CardText } from "@egovernments/digit-ui-react-components";
import AddDeliveryRuleWrapper from "./AddDeliverycontext";
import { CycleContext } from ".";
import { useTranslation } from "react-i18next";
import { InfoCard  , Stepper ,TextBlock , Tag} from "@egovernments/digit-ui-components";

const Tabs = ({ onTabChange }) => {
  const { campaignData, dispatchCampaignData } = useContext(CycleContext);
  const { t } = useTranslation();

  return (
    <div className="campaign-tabs">
      {campaignData.map((_, index) => (
        <button
          key={index}
          type="button"
          className={`campaign-tab-head ${_.active === true ? "active" : ""} hover`}
          onClick={() => onTabChange(_.cycleIndex, index)}
        >
          <p style={{ margin: 0, position: "relative", top: "-0.1rem" }}>
            {t(`CAMPAIGN_CYCLE`)} {index + 1}
          </p>
        </button>
      ))}
    </div>
  );
};

const TabContent = ({ activeSubTab, subTabCount = 3, onSubTabChange, project }) => {
  const { campaignData, dispatchCampaignData } = useContext(CycleContext);
  const { t } = useTranslation();

  return (
    <Card className="sub-tab-container">
      <SubTabs campaignData={campaignData} subTabCount={subTabCount} activeSubTab={activeSubTab} onSubTabChange={onSubTabChange} />
      <div>
        {/* <CardSubHeader className="tab-content-header">{t(`CAMPAIGN_TAB_TEXT`)}</CardSubHeader> */}
        <CardText>{t(`CAMPAIGN_DELIVERY_TAB_SUB_TEXT_${project?.code ? project?.code?.toUpperCase() : project?.toUpperCase()}`)} </CardText>
      </div>
      {/* Add content specific to each tab as needed */}
      {/* <InfoCard
        populators={{
          name: "infocard",
        }}
        variant="default"
        style={{ marginTop: "1.5rem", marginLeft: "0rem" , marginBottom: "0rem", maxWidth: "100%" }}
        className= {"infoClass"}
        headerWrapperClassName = {"headerWrapperClassName"}
        additionalElements={[
          <img className="whoLogo"
            // style="display: block;-webkit-user-select: none;margin: auto;cursor: zoom-in;background-color: hsl(0, 0%, 90%);transition: background-color 300ms;"
            src="https://cdn.worldvectorlogo.com/logos/world-health-organization-logo-1.svg"
            alt="WHO Logo"
            width="164"
            height="90"
          ></img>,
          <span style={{ color: "#505A5F" }}>
            {t(`CAMPAIGN_TAB_INFO_TEXT_${project?.code ? project?.code?.toUpperCase() : project?.toUpperCase()}`)}
          </span>
        ]}
        label={"Info"}
      /> */}
    </Card>
  );
};

const SubTabs = ({ onSubTabChange }) => {
  const { campaignData, dispatchCampaignData } = useContext(CycleContext);
  const { t } = useTranslation();

  return (
    <div>
      {campaignData
        ?.find((i) => i?.active === true)
        ?.deliveries.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`campaign-sub-tab-head ${_.active === true ? "active" : ""} hover`}
            onClick={() => onSubTabChange(_.deliveryIndex, index)}
          >
            {t(`CAMPAIGN_DELIVERY`)} {index + 1}
          </button>
        ))}
    </div>
  );
};

const MultiTab = ({ tabCount = 3, subTabCount = 2 }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [activeSubTab, setActiveSubTab] = useState(0);
  const { campaignData, dispatchCampaignData } = useContext(CycleContext);
  const { t } = useTranslation();
  const tempSession = Digit.SessionStorage.get("HCM_CAMPAIGN_MANAGER_FORM_DATA");
  const searchParams = new URLSearchParams(location.search);
  const [currentStep , setCurrentStep] = useState(1);
  const currentKey = searchParams.get("key");
  const campaignName = tempSession?.HCM_CAMPAIGN_NAME?.campaignName;
  const [key, setKey] = useState(() => {
    const keyParam = searchParams.get("key");
    return keyParam ? parseInt(keyParam) : 1;
  });

  function updateUrlParams(params) {
    const url = new URL(window.location.href);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    window.history.replaceState({}, "", url);
  }
  const handleTabChange = (tabIndex, index) => {
    dispatchCampaignData({
      type: "TAB_CHANGE_UPDATE",
      payload: { tabIndex: tabIndex, index: index }, // Your updated campaign data
    });
    setActiveTab(index);
    setActiveSubTab(0); // Reset sub-tab when changing the main tab
  };

  const handleSubTabChange = (subTabIndex, itemIndex) => {
    dispatchCampaignData({
      type: "SUBTAB_CHANGE_UPDATE",
      payload: { subTabIndex: subTabIndex }, // Your updated campaign data
    });
  };

  useEffect(() =>{
    setKey(currentKey);
    setCurrentStep(currentKey);
  }, [currentKey])

  useEffect(() => {
    updateUrlParams({ key: key });
    window.dispatchEvent(new Event("checking"));
  }, [key]);

  const onStepClick = (currentStep) => {
    if(currentStep === 0){
      setKey(7);
    }
    else if(currentStep === 2) setKey(9);
    else setKey(8);
  };

  return (
    <>
    <div className="container-full">
        <div className="card-container">
          <Card className="card-header-timeline">
            <TextBlock subHeader={t("HCM_DELIVERY_DETAILS")} subHeaderClassName={"stepper-subheader"} wrapperClassName={"stepper-wrapper"} />
          </Card>
          <Card className="stepper-card">
            <Stepper
              customSteps={["HCM_CYCLES","HCM_DELIVERY_RULES" ,"HCM_SUMMARY"]}
              currentStep={2}
              onStepClick={onStepClick}
              direction={"vertical"}
            />
          </Card>
        </div>
        <div className="card-container-delivery">
        <Tag icon="" label={campaignName} labelStyle={{}} showIcon={false} className={"campaign-tag"} />
      <Header>
        {t(
          `CAMPAIGN_PROJECT_${
            tempSession?.HCM_CAMPAIGN_TYPE?.projectType?.code
              ? tempSession?.HCM_CAMPAIGN_TYPE?.projectType?.code?.toUpperCase()
              : tempSession?.HCM_CAMPAIGN_TYPE?.projectType?.toUpperCase()
          }`
        )}
      </Header>
      <Paragraph
        customClassName="cycle-paragraph"
        value={`(${tempSession?.HCM_CAMPAIGN_DATE?.campaignDates?.startDate
          ?.split("-")
          ?.reverse()
          ?.join("/")} - ${tempSession?.HCM_CAMPAIGN_DATE?.campaignDates?.endDate?.split("-")?.reverse()?.join("/")})`}
      />
      <div className="campaign-cycle-container">
        <div className="campaign-tabs-container">
          <Tabs tabCount={tabCount} activeTab={activeTab} onTabChange={handleTabChange} />
        </div>
        <TabContent
          activeTab={activeTab}
          project={tempSession?.HCM_CAMPAIGN_TYPE?.projectType}
          activeSubTab={activeSubTab}
          onSubTabChange={handleSubTabChange}
        />
        <AddDeliveryRuleWrapper />
      </div>
      </div>
      </div>
    </>
  );
};

export default MultiTab;
