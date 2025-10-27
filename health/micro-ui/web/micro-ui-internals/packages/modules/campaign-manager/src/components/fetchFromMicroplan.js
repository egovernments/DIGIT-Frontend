import React, { useEffect, useState } from "react";
import { CheckCircle } from "@egovernments/digit-ui-svg-components";
import { useHistory, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LoaderWithGap } from "@egovernments/digit-ui-react-components";
import { AlertCard, Toast ,HeaderComponent, Loader } from "@egovernments/digit-ui-components";
import { callTemplateDownloadByUntilCompleted } from "../utils/pollUtils";
import { fetchFromMicroplan, searchCampaign, waitForSomeTime } from "../hooks/useFetchFromMicroplan";

const TEMPLATE_GENERATION_STEP = 5;
const FACILITY_DATA_STEP = 6;
const MICROPLAN_FETCH_STEP = 7;
const MICROPLAN_STOP_STEP = 9;
const MICROPLAN_FETCH_TIMEOUT = 8000;

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
  const [aleastOneTemplateFilled, setAleastOneTemplateFilled] = useState(false);

  const [completed, setCompleted] = useState(null);
  const [showToast, setShowToast] = useState(null);
  const { isLoading, data, error } = Digit.Hooks.campaign.useFetchFromMicroplan(tenantId, id, planConfigurationId);

  const steps = [
    "FETCHING_CAMPAIGN_DATA_FROM_MICROPLAN",
    "FETCHING_CAMPAIGN_TYPE_FROM_MICROPLAN",
    "FETCHING_CAMPAIGN_BOUNDARIRES_FROM_MICROPLAN",
    "CREATING_CAMPAIGN_BASED_ON_MICROPLAN",
    "GENERATING_ALL_THE_TEMPLATES",
    "FETCHING_CAMPAIGN_TARGET_FROM_MICROPLAN",
    "FETCHING_CAMPAIGN_FACILITY_FROM_MICROPLAN",
    "FETCHING_CAMPAIGN_USER_FROM_MICROPLAN",
    "FETCHED_ALLMAPPING_DATA_FROM_MICROPLAN",
    "DOWNLOAD_THE_FACILITY_TEMPLATE",
    "FILLING_CAMPAIGN_FACILITY_DATA_FROM_MICROPLAN",
    "DOWNLOAD_THE_TARGET_TEMPLATE",
    "FILLING_CAMPAIGN_TARGET_DATA_FROM_MICROPLAN",
    "DOWNLOAD_THE_USER_TEMPLATE",
    "FILLING_CAMPAIGN_USER_DATA_FROM_MICROPLAN",
    "VALIDATING_THE_USER_TEMPLATE",
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
          await waitForSomeTime(3000);
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
          setCurrentStep((prev) => TEMPLATE_GENERATION_STEP);
        } catch (error) {
          console.error("Error fetching templates:", error);
          setShowToast({ key: "warning", label: t("EMPTY_TEMPLATE_GENERTAION_NOTCOMPLETED_STILL_PROCEEDING") });
          setCurrentStep((prev) => TEMPLATE_GENERATION_STEP);
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

        // Show loading state

        setTimeout(() => {
          // Ensure progressive updates
          setCurrentStep((prev) => MICROPLAN_FETCH_STEP);
          setShowToast({ key: "info", label: t("FETCHING_MICROPLAN_DATA") });
        }, MICROPLAN_FETCH_TIMEOUT);
      } catch (error) {
        console.error("Error fetching microplan data:", error);
        setShowToast({ key: "error", label: t("ERROR_FETCHING_MICROPLAN") });
      }
    };
    if (templates?.completed) {
      if (currentStep === TEMPLATE_GENERATION_STEP) {
        setCurrentStep((prev) => prev + 1);
        fetchMicroplanData();
      }
    }
  }, [templates, currentStep]);

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
        // Step constants for template generation and facility data

        // Skip template generation and facility data steps as they're handled separately
        if (
          currentStep < steps.length &&
          currentStep !== TEMPLATE_GENERATION_STEP &&
          currentStep !== FACILITY_DATA_STEP &&
          currentStep !== MICROPLAN_STOP_STEP
        ) {
          setCurrentStep((prev) => prev + 1);
        }
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [currentStep, data]);

  useEffect(() => {
    const fetchCampaign = async () => {
      if (currentStep === MICROPLAN_STOP_STEP && completed == null) {
        try {
          const response = await searchCampaign(data?.updatedCampaignData?.id, data?.updatedCampaignData?.tenantId);
          if (response?.resources && response?.resources?.length == 3) {
            setCompleted({ ...response });
            setCurrentStep((curr) => curr + 1);
          } else {
            setShowToast({ key: "warning", label: t("SOME_ERROR_OCCURED_IN_FETCH_RETRYING") });
            setCurrentStep(TEMPLATE_GENERATION_STEP);
          }
          if (response?.resources && response?.resources?.length > 0) {
            setAleastOneTemplateFilled(true);
          }
        } catch (error) {
          console.error("Error fetching campaign:", error);
          setShowToast({ key: "error", label: t("ERROR_FETCHING_CAMPAIGN") });
        }
      }
    };
    fetchCampaign();
  }, [currentStep, completed]);

  useEffect(async () => {
    if (currentStep === steps.length && microplan) {
      setShowToast({ key: "success", label: t("CMN_ALL_DATA_FETCH_DONE") });

      const navigateTimeout = setTimeout(() => {
        searchParams?.set("id", data?.updatedCampaignData?.id);
        searchParams?.set("microName", data?.updatedCampaignData?.campaignName);
        history.push(`/${window?.contextPath}/employee/campaign/setup-campaign?${searchParams?.toString()}`);
      }, 1500);

      return () => clearTimeout(navigateTimeout); // Cleanup timeout
    }
  }, [currentStep, microplan]);

  const closeToast = () => {
    setShowToast(null);
  };
  return (
    <span className="fetch-from-microplan">
      <HeaderComponent>{t("MY_FETCH_FROM_MICROPLAN_HEADING")}</HeaderComponent>
      <AlertCard
        populators={{
          name: "infocard",
        }}
        variant="info"
        text={t("HCM_FETCH_FROM_PLAN_INFO")}
      />

      <div className="sandbox-loader-screen ">
        {showToast?.key != "error" && <Loader page={true} variant={"PageLoader"} loaderText={t(" ")}/>}
        <ul className="sandbox-installation-steps">
          {steps.map((step, index) => (
            <li key={index} className={`sandbox-step ${index < currentStep ? "sandbox-visible" : ""}`}>
              <span className="sandbox-step-text">{t(step)}</span>
              {index + 1 < currentStep && (aleastOneTemplateFilled || index < TEMPLATE_GENERATION_STEP) && <CheckCircle fill="#00703C" />}
            </li>
          ))}
          <li key={currentStep + 1} className={`sandbox-step ${0 < currentStep ? "sandbox-visible" : ""}`}>
            <span className="sandbox-step-text">
              {t("MP_COMPELTED_STEPS")} - {currentStep} {t("MP_OUT_OFF")} - {steps?.length}
            </span>
          </li>
        </ul>
      </div>
      {showToast && <Toast type={showToast?.key} label={t(showToast?.label)} onClose={closeToast} />}
    </span>
  );
};

export default FetchFromMicroplanScreen;
