import React, {Fragment, useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  LabelFieldPair,
  ActionBar,
  ArrowForward
} from "@egovernments/digit-ui-react-components";
import {
  FieldV1,
  Stepper,
  Card,
  HeaderComponent,
  Button,
  PopUp,
  Toast,
  Loader
} from "@egovernments/digit-ui-components";
import { useHistory } from "react-router-dom";
import { ProgressBar } from "./ProgressBar";
import { min } from "lodash";

const CloneCampaignWrapper = (props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [name, setName] = useState(`${props?.campaignName}-copy-${Date.now()}`);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [error, setError] = useState(null);
  const [showProgress, setShowProgress] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [toast, setToast] = useState(null);
  const steps = [
    "SEARCHING_CAMPAIGN_DETAILS",
    "CREATING_DRAFT_CAMPAIGN",
    "CREATING_MDMS_RECORDS",
    "CREATING_CHECKLISTS",
    "FETCHING_LOCALIZATION",
    "ADDING_CAMPAIGN_LOCALIZATION"
  ];

  const convertDateToEpoch= (dateString) => {
    // Create a Date object from the input date string
    const date = new Date(dateString);
  
    // Convert the date to epoch time (seconds)
    return Math.floor(date.getTime());
  }

  const {
    mutateAsync: executeFlow,
    isLoading,
    error: hookError,
    campaignDetailsLoading,
  } = Digit.Hooks.campaign.useCloneCampaign({
    tenantId,
    campaignId: props?.campaignId,
    campaignName: name,
    startDate: convertDateToEpoch(startDate),
    endDate: convertDateToEpoch(endDate),
    setStep: useCallback((step) => setCurrentStep(step), [])
  });

  const handleToastClose = () => {
    setToast(null);
  };

  const onNextClick = async () => {
    if (!name || !startDate || !endDate) {
      setError({ message: "CAMPAIGN_FIELD_ERROR_MANDATORY" });
      return;
    }
  
    setShowProgress(true);
    setError(null);
  
    try {
      const res = await executeFlow();
      if (res?.success && res?.CampaignDetails?.campaignNumber) {
        setToast({ key: false, label: `${res?.CampaignDetails?.campaignNumber} ${t("CAMPAIGN_CREATED_SUCCESSFULLY")}`, type: "success" });
        history.push(
          `/workbench-ui/employee/campaign/view-details?tenantId=${tenantId}&campaignNumber=${res.CampaignDetails.campaignNumber}`
        );
      } else {
        setToast({ key: true, label: `${t("FAILED_TO_CREATE_COPY_CAMPAIGN")}`, type: "error" });
        props.setCampaignCopying(false);
        setShowProgress(false);
      }
    } catch (err) {
      setToast({ key: true, label: `${t(err)}`, type: "error" });
      setShowProgress(false);
      props.setCampaignCopying(false);
    }
  };


  return (
    <>
    <PopUp
        type={"default"}
        heading={t("Create Copy of Campaign")}  
        onOverlayClick={() => props.setCampaignCopying(false)}
        onClose={() => props.setCampaignCopying(false)}
        footerChildren={[
            <Button
                className={"campaign-type-alert-button"}
                type={"button"}
                size={"large"}
                variation={"primary"}
                label={t("SUBMIT")}
                onClick={onNextClick}
            />,
        ]}
    >
    {
        campaignDetailsLoading && (
            <Loader />
        )
    }
    {
        showProgress && (
            <ProgressBar steps={steps} currentStep={currentStep} />
        )
    }
    {!showProgress && !campaignDetailsLoading && (<div className="container">
      <div className="card-container2">
        <Card className="setup-campaign-card">
          <HeaderComponent>{t("HCM_CAMPAIGN_NAME_HEADER")}</HeaderComponent>
          <p className="name-description">{t("HCM_CAMPAIGN_NAME_DESCRIPTION")}</p>
          <LabelFieldPair>
            <div className="name-container">
              <span>{t("HCM_CAMPAIGN_NAME")}</span>
              <span className="mandatory-span">*</span>
            </div>
            <FieldV1
              type="text"
              error={error?.message ? t(error.message) : ""}
              style={{ width: "-webkit-fill-available", marginBottom: "0" }}
              populators={{ name: "campaignName" }}
              placeholder={t("HCM_CAMPAIGN_NAME_EXAMPLE")}
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </LabelFieldPair>
          <LabelFieldPair>
            <div className="name-container">
              <span>{t("CAMPAIGN_START_DATE")}</span>
              <span className="mandatory-span">*</span>
            </div>
            <FieldV1
              type="date"
              error={error?.message ? t(error.message) : ""}
              style={{ width: "-webkit-fill-available", marginBottom: "0" }}
              populators={{ name: "campaignStartDate", validation: {min: new Date(Date.now() + 86400000).toISOString().split("T")[0]} }}
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
            />
          </LabelFieldPair>
          <LabelFieldPair>
            <div className="name-container">
              <span>{t("CAMPAIGN_END_DATE")}</span>
              <span className="mandatory-span">*</span>
            </div>
            <FieldV1
              type="date"
              error={error?.message ? t(error.message) : ""}
              style={{ width: "-webkit-fill-available", marginBottom: "0" }}
              populators={{ name: "campaignEndDate", validation: {min: new Date(Date.now() + (2 * 86400000)).toISOString().split("T")[0]} }}
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
            />
          </LabelFieldPair>
        </Card>
      </div>
    </div>)}
    </PopUp>
    {toast && (
        <Toast
        error={toast.key}
        isDleteBtn="true"
        label={t(toast.label)}
        onClose={handleToastClose}
        type={toast.type}
     />
    )}
    </>
  );
};

export default CloneCampaignWrapper;
