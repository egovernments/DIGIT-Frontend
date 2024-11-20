import React, { useEffect, useState } from "react";
import { CheckCircle } from "@egovernments/digit-ui-svg-components";
import { useHistory, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const DummyLoaderScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const history = useHistory();
  const location = useLocation();
  const { t } = useTranslation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const planConfigurationId = searchParams.get("planConfigurationId");

  const steps = [
    "FETCHING_CAMPAIGN_DATA_FROM_MICROPLAN",
    "FETCHING_CAMPAIGN_TYPE_FROM_MICROPLAN",
    "FETCHING_CAMPAIGN_TARGET_FROM_MICROPLAN",
    "FILLING_CAMPAIGN_TARGET_DATA_FROM_MICROPLAN",
    "FETCHING_CAMPAIGN_FACILITY_FROM_MICROPLAN",
    "FILLING_CAMPAIGN_FACILITY_DATA_FROM_MICROPLAN",
    "FETCHING_CAMPAIGN_USER_FROM_MICROPLAN",
    "FILLING_CAMPAIGN_USER_DATA_FROM_MICROPLAN",
    "CMN_ALL_DATA_FETCH_DONE",
  ];
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const reqCriteriaResource = {
    url: `/project-factory/v1/project-type/fetch-from-microplan`,
    body: {
      MicroplanDetails: {
        tenantId: tenantId,
        campaignId: id,
        planConfigurationId: planConfigurationId,
        resourceId: "filestoreid",
      },
    },
    config: {
      enabled: true,
      select: (data) => {
        return data?.CampaignDetails;
      },
    },
  };

  const { isLoading, data: resourceData, isFetching } = Digit.Hooks.useCustomAPIHook(reqCriteriaResource);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      if (currentStep < steps.length) {
        setCurrentStep((prev) => prev + 1);
      }
    }, 2500); // 1 second delay for each step

    if (currentStep === steps.length) {
      clearInterval(stepInterval); // Clear the interval to stop further updates
      const navigateTimeout = setTimeout(() => {
        history.push({
          pathname: `/${window?.contextPath}/employee/campaign/setup-campaign?${searchParams?.toString()}`,
        });
      }, 1000);

      return () => clearTimeout(navigateTimeout); // Cleanup timeout
    }

    return () => {
      clearInterval(stepInterval);
    };
  }, [currentStep]);

  return (
    <React.Fragment>
      <Header styles={{ fontSize: "32px" }}>{t("MY_MICROPLANS_HEADING")}</Header>
      <div className="sandbox-loader-screen" style={{ height: "100%" }}>
        <div className="sandbox-loader"></div>
        <ul className="sandbox-installation-steps">
          {steps.map((step, index) => (
            <li key={index} className={`sandbox-step ${index < currentStep ? "sandbox-visible" : ""}`}>
              <span className="sandbox-step-text">{t(step)}</span>
              {index < currentStep && <CheckCircle fill="#00703C" />}
            </li>
          ))}
        </ul>
      </div>
    </React.Fragment>
  );
};

export default DummyLoaderScreen;