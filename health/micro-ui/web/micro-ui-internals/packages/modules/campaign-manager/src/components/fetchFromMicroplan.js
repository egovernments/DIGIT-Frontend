import React, { useEffect, useState, Fragment } from "react";
import { CheckCircle } from "@egovernments/digit-ui-svg-components";
import { useHistory, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Header } from "@egovernments/digit-ui-react-components";
import { InfoCard, Toast } from "@egovernments/digit-ui-components";
import { callTemplateDownloadByUntilCompleted } from "../utils/pollUtils";
import { fetchFromMicroplan } from "../hooks/useFetchFromMicroplan";

const FetchFromMicroplanScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const history = useHistory();
  const location = useLocation();
  const { t } = useTranslation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const planConfigurationId = searchParams.get("planConfigurationId");
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [templates, setTemplates] = useState(null);
  const [microplan, setMicroplan] = useState(null);
  const [showToast, setShowToast] = useState(null);
  const { isLoading, data, error } = Digit.Hooks.campaign.useFetchFromMicroplan(tenantId, id, planConfigurationId);

  const steps = [
    "FETCHING_CAMPAIGN_DATA_FROM_MICROPLAN",
    "FETCHING_CAMPAIGN_TYPE_FROM_MICROPLAN",
    "FETCHING_CAMPAIGN_TARGET_FROM_MICROPLAN",
    "GENERATING_ALL_THE_TEMPLATES",
    "DOWNLOAD_THE_TARGET_TEMPLATE",
    "FILLING_CAMPAIGN_TARGET_DATA_FROM_MICROPLAN",
    "FETCHING_CAMPAIGN_FACILITY_FROM_MICROPLAN",
    "DOWNLOAD_THE_FACILITY_TEMPLATE",
    "FILLING_CAMPAIGN_FACILITY_DATA_FROM_MICROPLAN",
    "DOWNLOAD_THE_USER_TEMPLATE",
    "FETCHING_CAMPAIGN_USER_FROM_MICROPLAN",
    "FILLING_CAMPAIGN_USER_DATA_FROM_MICROPLAN",
    "UPDATED_CAMPAIGN_WITH_UPLODAED_DATA",
    "CMN_ALL_DATA_FETCH_DONE",
  ];

  useEffect(() => {
    const fetchTemplates = async () => {
      if (data && data?.updatedCampaignData) {
        if (currentStep === 0) {
          setCurrentStep((prev) => prev + 1);
        }

        try {
          const { hierarchyType, id, tenantId } = data?.updatedCampaignData;

          // Execute all API calls in parallel
          const [facilityFile, targetFile, userFile] = await Promise.all([
            callTemplateDownloadByUntilCompleted(hierarchyType, id, tenantId, "facility"),
            callTemplateDownloadByUntilCompleted(hierarchyType, id, tenantId, "boundary"),
            callTemplateDownloadByUntilCompleted(hierarchyType, id, tenantId, "user"),
          ]);

          // Update state with the fetched templates
          setTemplates({
            facilityFile,
            targetFile,
            userFile,
            completed: "yes",
          });
        } catch (error) {
          console.error("Error fetching templates:", error);
          setCurrentStep((prev) => prev + 1);
          setTemplates({
            facilityFile: null,
            targetFile: null,
            userFile: null,
            completed: "yes",
          });
        }
      }
    };
    const navigateTimeout = setTimeout(() => {
      fetchTemplates();
    }, 3000);
    return () => clearTimeout(navigateTimeout); // Cleanup timeout
  }, [data]);

  useEffect(async () => {
    if (templates && templates?.completed) {
      if (currentStep == 4) {
        setCurrentStep((prev) => prev + 1);
      }
      const fetchFromMicroplanResponse = await fetchFromMicroplan(
        data?.updatedCampaignData?.id,
        data?.updatedCampaignData?.tenantId,
        planConfigurationId
      );

      setMicroplan({
        ...fetchFromMicroplanResponse,
      });
    }
  }, [templates]);
  useEffect(() => {
    const fetchMicroplanData = async () => {
      try {
        const { id, tenantId } = data?.updatedCampaignData;

        // Execute the fetchFromMicroplan API call
        const fetchFromMicroplanResponse = await fetchFromMicroplan(id, tenantId, planConfigurationId);

        // Update the microplan state with the response
        setMicroplan({
          ...fetchFromMicroplanResponse,
        });
        setTimeout(() => {
          setCurrentStep((prev) => 7);
        }, 8000);
      } catch (error) {
        console.error("Error fetching microplan data:", error);
      }
    };
    if (templates && templates?.completed) {
      if (currentStep === 4) {
        setCurrentStep((prev) => prev + 1);
      }
      fetchMicroplanData();
    }
  }, [templates]);

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
    if (data?.campaignData && data?.updatedCampaignData && currentStep > 0) {
      const interval = setInterval(() => {
        if (currentStep < steps.length && currentStep != 4 && currentStep != 6) {
          setCurrentStep((prev) => prev + 1);
        }
        if (currentStep === steps.length) {
          setShowToast({ key: "success", label: t("CMN_ALL_DATA_FETCH_DONE") });

          clearInterval(interval); // Clear the interval to stop further updates
          const navigateTimeout = setTimeout(() => {
            searchParams?.set("id", data?.updatedCampaignData?.id);
            searchParams?.set("microName", data?.updatedCampaignData?.campaignName);
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
      <InfoCard
        populators={{
          name: "infocard",
        }}
        variant="info"
        text={t("HCM_FETCH_FROM_PLAN_INFO")}
        style={{ marginTop: "1rem", maxWidth: "100%" }}
      />

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

export default FetchFromMicroplanScreen;
