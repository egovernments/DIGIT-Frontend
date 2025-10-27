import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import {  EditIcon, LoaderWithGap, ViewComposer } from "@egovernments/digit-ui-react-components";
import { Toast , Stepper , TextBlock ,Card , Loader ,HeaderComponent} from "@egovernments/digit-ui-components";
import TagComponent from "./TagComponent";

const CampaignDetailsSummary = (props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const noAction = searchParams.get("action");
  const [showToast, setShowToast] = useState(null);
  const [currentStep, setCurrentStep] = useState(2);
  const currentKey = searchParams.get("key");
  const [key, setKey] = useState(() => {
    const keyParam = searchParams.get("key");
    return keyParam ? parseInt(keyParam) : 1;
  });
  const campaignName = window.Digit.SessionStorage.get("HCM_CAMPAIGN_MANAGER_FORM_DATA")?.HCM_CAMPAIGN_NAME?.campaignName;
  const handleRedirect = (step, activeCycle) => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    urlParams.set("key", step);
    urlParams.set("preview", false);
    if (activeCycle) {
      urlParams.set("activeCycle", activeCycle);
    }
    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    history.push(newUrl);
  };

  function updateUrlParams(params) {
    const url = new URL(window.location.href);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    window.history.replaceState({}, "", url);
  }

  useEffect(() => {
    setKey(currentKey);
    setCurrentStep(currentKey);
  }, [currentKey]);


  useEffect(() => {
    updateUrlParams({ key: key });
    window.dispatchEvent(new Event("checking"));
  }, [key]);

  const { isLoading, data, error, refetch ,isFetching} = Digit.Hooks.campaign.useSearchCampaign({
    tenantId: tenantId,
    filter: {
      ids: [id],
    },
    config: {
      select: (data) => {
        return {
          cards: [
            {
                sections: [
                  {
                    type: "DATA",
                    cardHeader: { value: t("CAMPAIGN_DETAILS"), inlineStyles: { marginTop: 0, fontSize: "1.5rem" } },
                    cardSecondaryAction: noAction !== "false" && (
                      <div className="campaign-preview-edit-container" onClick={() => handleRedirect(1)}>
                        <span>{t(`CAMPAIGN_EDIT`)}</span>
                        <EditIcon />
                      </div>
                    ),
                    values: [
                      {
                        key: "CAMPAIGN_TYPE",
                        value: data?.[0]?.projectType ? t(`CAMPAIGN_PROJECT_${data?.[0]?.projectType?.toUpperCase()}`) : t("CAMPAIGN_SUMMARY_NA"),
                      },
                      {
                        key: "CAMPAIGN_NAME",
                        value: data?.[0]?.campaignName || t("CAMPAIGN_SUMMARY_NA"),
                      },
                      {
                        key: "CAMPAIGN_START_DATE",
                        value: Digit.Utils.date.convertEpochToDate(data?.[0]?.startDate) || t("CAMPAIGN_SUMMARY_NA"),
                      },
                      {
                        key: "CAMPAIGN_END_DATE",
                        value: Digit.Utils.date.convertEpochToDate(data?.[0]?.endDate) || t("CAMPAIGN_SUMMARY_NA"),
                      },
                    ],
                  },
                ],
              },
          ],
          
          error: data?.[0]?.additionalDetails?.error,
          data: data?.[0],
          status: data?.[0]?.status,
        };
      },
      enabled: id ? true : false,
      staleTime: 0,
      cacheTime: 0,
    },
  });

  const closeToast = () => {
    setShowToast(null);
  };
  useEffect(() => {
    if (showToast) {
      setTimeout(closeToast, 5000);
    }
  }, [showToast]);
  useEffect(() => {
    if (data?.status === "failed" && data?.error) {
      setShowToast({ label: data?.error, key: "error" });
    }
    if (data?.status === "creating") {
      setShowToast({ label: "CAMPAIGN_STATUS_CREATING_MESSAGE", key: "info" });
    }
    if (data?.status === "created" && data?.userGenerationSuccess?.length > 0) {
      setShowToast({ label: "CAMPAIGN_USER_GENERATION_SUCCESS", key: "success" });
    }
  }, [data]);

  const updatedObject = { ...data };

  const onStepClick = (currentStep) => {
    if (!props?.props?.sessionData?.HCM_CAMPAIGN_NAME || !props?.props?.sessionData?.HCM_CAMPAIGN_TYPE) return;
    if(currentStep === 0){
      setKey(1);
    }
    else if(currentStep === 1){
      setKey(2);
    }
    else if(currentStep === 3){
      if (!props?.props?.sessionData?.HCM_CAMPAIGN_DATE) return;
      else setKey(4);
    }
    else setKey(3);
  };
  if (isLoading) {
    return <Loader page={true} variant={"PageLoader"}/>;
  }

  return (
    <>
    {(isLoading || (!data && !error) || isFetching) && <Loader page={true} variant={"PageLoader"} loaderText={t("DATA_SYNC_WITH_SERVER")}/>}
    <div className="container-full">
        {/* <div className="card-container">
          <Card className="card-header-timeline">
            <TextBlock subHeader={t("HCM_CAMPAIGN_DETAILS")} subHeaderClassName={"stepper-subheader"} wrapperClassName={"stepper-wrapper"} />
          </Card>
          <Card className="stepper-card">
            <Stepper customSteps={["HCM_CAMPAIGN_TYPE","HCM_CAMPAIGN_NAME", "HCM_CAMPAIGN_DATE" , "HCM_SUMMARY"]} currentStep={4} onStepClick={onStepClick} direction={"vertical"} />
          </Card>
        </div> */}

        <div className="card-container-delivery">
        <TagComponent campaignName={campaignName} />        
        <div style={{ display: "flex", justifyContent: "space-between" }}>
        <HeaderComponent className="summary-header">{t("HCM_CAMPAIGN_DETAILS_SUMMARY")}</HeaderComponent>
      </div>
      <div className="campaign-summary-container">
        <ViewComposer data={updatedObject}  />
        {showToast && (
          <Toast
            type={showToast?.key === "error" ? "error" : showToast?.key === "info" ? "info" : "success"}
            label={t(showToast?.label)}
            onClose={closeToast}
          />
        )}
      </div>
      </div>
      </div>
    </>
  );
};

export default CampaignDetailsSummary;
