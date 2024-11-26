import React, { useEffect, useState, Fragment } from "react";
import { CheckCircle } from "@egovernments/digit-ui-svg-components";
import { useHistory, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Header } from "@egovernments/digit-ui-react-components";
import { Toast } from "@egovernments/digit-ui-components";

const DummyLoaderScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const history = useHistory();
  const location = useLocation();
  const { t } = useTranslation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const planConfigurationId = searchParams.get("planConfigurationId");
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const [showToast, setShowToast] = useState(null);
  const { isLoading, data, error } = Digit.Hooks.campaign.useFetchFromMicroplan(tenantId, id, planConfigurationId);
  console.log(data);

  const steps = [
    "FETCHING_CAMPAIGN_DATA_FROM_MICROPLAN",
    "FETCHING_CAMPAIGN_TYPE_FROM_MICROPLAN",
    "FETCHING_CAMPAIGN_TARGET_FROM_MICROPLAN",
    "FILLING_CAMPAIGN_TARGET_DATA_FROM_MICROPLAN",
    "FETCHING_CAMPAIGN_FACILITY_FROM_MICROPLAN",
    "FILLING_CAMPAIGN_FACILITY_DATA_FROM_MICROPLAN",
    "FETCHING_CAMPAIGN_USER_FROM_MICROPLAN",
    "FILLING_CAMPAIGN_USER_DATA_FROM_MICROPLAN",
    "UPDATED_CAMPAIGN_WITH_UPLODAED_DATA",
    "CMN_ALL_DATA_FETCH_DONE",
  ];
  useEffect(() => {
    if (showToast?.key == "error") {
      const navigateTimeout = setTimeout(() => {
        history.push(`/${window?.contextPath}/employee/`);
      }, 3000);
      return () => clearTimeout(navigateTimeout); // Cleanup timeout
    }
  }, [showToast]);
  useEffect(() => {
    const navigateTimeout = setTimeout(() => {
      setShowToast({ key: "info", label: t("PLS_WAIT_UNTIL_PAGE_REDIRECTS") });
    }, 3000);
    return () => clearTimeout(navigateTimeout); // Cleanup timeout
  }, []);

  useEffect(() => {
    if (showToast?.key != "error" && error) {
      setShowToast({ key: "error", label: t("SOME_ERROR_OCCURED_IN_FETCH") });
    }
  }, [error]);

  // Handle progress through steps
  useEffect(() => {
    if ((data?.campaignData && currentStep < 2) || (data?.newCampaignId && currentStep < 4) || (data?.fetchedCampaign && currentStep < 15)) {
      const interval = setInterval(() => {
        if (currentStep < steps.length) {
          setCurrentStep((prev) => prev + 1);
        }
        if (currentStep === steps.length) {
          clearInterval(interval); // Clear the interval to stop further updates
          const navigateTimeout = setTimeout(() => {
            searchParams?.set("id", data?.newCampaignId);
            history.push(`/${window?.contextPath}/employee/campaign/setup-campaign?${searchParams?.toString()}`);
          }, 1500);

          return () => clearTimeout(navigateTimeout); // Cleanup timeout
        }
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [currentStep, data]);

  const closeToast = () => {
    setShowToast(null);
  };
  return (
    <>
      <Header styles={{ fontSize: "32px" }}>{t("MY_FETCH_FROM_MICROPLAN_HEADING")}</Header>
      <div className="sandbox-loader-screen" style={{ height: "100%" }}>
        {showToast?.key != "error" && id?.key?.length > 0 && <div className="sandbox-loader"></div>}
        <ul className="sandbox-installation-steps">
          {steps.map((step, index) => (
            <li key={index} className={`sandbox-step ${index < currentStep ? "sandbox-visible" : ""}`}>
              <span className="sandbox-step-text">{t(step)}</span>
              {index < currentStep && <CheckCircle fill="#00703C" />}
            </li>
          ))}
        </ul>
      </div>
      {showToast && <Toast type={showToast?.key} label={t(showToast?.label)} onClose={closeToast} />}
    </>
  );
};

export default DummyLoaderScreen;
