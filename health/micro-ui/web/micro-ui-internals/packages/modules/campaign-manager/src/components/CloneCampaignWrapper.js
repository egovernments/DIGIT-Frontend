import React, { Fragment, useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { LabelFieldPair, ActionBar, ArrowForward } from "@egovernments/digit-ui-react-components";
import { FieldV1, Stepper, Card, HeaderComponent, Button, PopUp, Toast, Loader } from "@egovernments/digit-ui-components";
import { useHistory } from "react-router-dom";
import { ProgressBar } from "./ProgressBar";
import { min } from "lodash";

const CloneCampaignWrapper = (props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [name, setName] = useState(`${props?.campaignName}-copy`);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startError, setStartError] = useState(null);
  const [endError, setEndError] = useState(null);
  const [nameError, setNameError] = useState(null);
  const [showProgress, setShowProgress] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [toast, setToast] = useState(null);
  const [isValidatingName, setIsValidatingName] = useState(false);

  const steps = [
    "SEARCHING_CAMPAIGN_DETAILS",
    "CREATING_DRAFT_CAMPAIGN",
    "CREATING_MDMS_RECORDS_AND_CHECKLISTS",
    "FETCHING_LOCALIZATION",
    "ADDING_CAMPAIGN_LOCALIZATION",
  ];

  const convertDateToEpoch = (dateString) => {
    // Create a Date object from the input date string
    const date = new Date(dateString);

    // Convert the date to epoch time (seconds)
    return Math.floor(date.getTime());
  };

  const { mutateAsync: executeFlow, isLoading, campaignDetailsLoading } = Digit.Hooks.campaign.useCloneCampaign({
    tenantId,
    campaignId: props?.campaignId,
    campaignName: name,
    startDate: convertDateToEpoch(startDate),
    endDate: convertDateToEpoch(endDate),
    setStep: useCallback((step) => setCurrentStep(step), []),
  });

  const handleToastClose = () => {
    setToast(null);
  };

  const fetchValidCampaignName = async (tenantId, name) => {
    const res = await Digit.CustomService.getResponse({
      url: `/project-factory/v1/project-type/search`,
      body: {
        CampaignDetails: {
          tenantId: tenantId,
          campaignName: name,
        },
      },
    });
    return res?.CampaignDetails;
  };

  const onNextClick = async () => {
    let hasError = false;

    // Name validation
    if (!name?.trim()) {
      setNameError({ message: "CAMPAIGN_FIELD_ERROR_MANDATORY" });
      hasError = true;
    } else if (name.length > 30) {
      setNameError({ message: "CAMPAIGN_NAME_GREATER" });
      hasError = true;
    } else {
      setNameError(null);
    }

    // Start date validation
    if (!startDate) {
      setStartError({ message: "CAMPAIGN_FIELD_ERROR_MANDATORY" });
      hasError = true;
    } else {
      setStartError(null);
    }

    // End date validation
    if (!endDate) {
      setEndError({ message: "CAMPAIGN_FIELD_ERROR_MANDATORY" });
      hasError = true;
    } else {
      setEndError(null);
    }

    if (hasError) return;
    setIsValidatingName(true);
    let temp = await fetchValidCampaignName(tenantId, name);
    if (temp.length != 0) {
      setToast({ key: "error", label: t("CAMPAIGN_NAME_ALREADY_EXIST") });
      setIsValidatingName(false);
      return;
    }
    setIsValidatingName(false);

    setShowProgress(true);
    // setError(null);

    try {
      const res = await executeFlow();
      if (res?.success && res?.CampaignDetails?.campaignNumber) {
        setToast({ key: false, label: `${res?.CampaignDetails?.campaignNumber} ${t("CAMPAIGN_CREATED_SUCCESSFULLY")}`, type: "success" });
        history.push(`/workbench-ui/employee/campaign/view-details?tenantId=${tenantId}&campaignNumber=${res.CampaignDetails.campaignNumber}`);
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
    {!showProgress && (
      <PopUp
        type={"default"}
        heading={t("HCM_CREATE_COPY_OF_CAMPAIGN")}
        className = {"copy-campaign-popup"}
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
        {campaignDetailsLoading && <Loader />}
        {/* {showProgress && <ProgressBar steps={steps} currentStep={currentStep} />} */}
        {!showProgress && !campaignDetailsLoading && (
          <div className="container">
            <div className="card-container2">
              <div>
                {/* <HeaderComponent className={"popUp-header"}>{t("HCM_CAMPAIGN_NAME_HEADER")}</HeaderComponent> */}
                <p className="name-description">{t("HCM_CAMPAIGN_NAME_DESCRIPTION")}</p>
                <LabelFieldPair className="pop-display">
                  <div className="name-container-popUp">
                    <span>{t("HCM_CAMPAIGN_NAME")}</span>
                    <span className="mandatory-span">*</span>
                  </div>
                  <FieldV1
                    type="text"
                    style={{ width: "-webkit-fill-available", marginBottom: "0" }}
                    error={nameError?.message ? t(nameError.message) : ""}
                    populators={{
                      name: "campaignName",
                      error: "ES__REQUIRED_NAME_AND_LENGTH",
                      validation: {
                        pattern: /^(?=.*[A-Za-z]).{1,40}$/,
                      },
                    }}
                    placeholder={t("HCM_CAMPAIGN_NAME_EXAMPLE")}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                </LabelFieldPair>
                <LabelFieldPair className="pop-display">
                  <div className="date-container-popUp">
                    <span>{t("CAMPAIGN_START_DATE")}</span>
                    <span className="mandatory-span">*</span>
                  </div>
                  <FieldV1
                    type="date"
                    error={startError?.message ? t(startError.message) : ""}
                    style={{ width: "-webkit-fill-available", marginBottom: "0" }}
                    populators={{ 
                      newDateFormat: true,
                      name: "campaignStartDate", validation: { min: new Date(Date.now() + 86400000).toISOString().split("T")[0] } }}
                    value={startDate}
                    onChange={(event) => {
                      const value = event.target.value;
                      setStartDate(value);
                      if (value) setStartError(false);
                    }}
                  />
                </LabelFieldPair>
                <LabelFieldPair className="pop-display">
                  <div className="end-date-container-popUp">
                    <span>{t("CAMPAIGN_END_DATE")}</span>
                    <span className="mandatory-span">*</span>
                  </div>
                  <FieldV1
                    type="date"
                    error={endError?.message ? t(endError.message) : ""}
                    style={{ width: "-webkit-fill-available", marginBottom: "0" }}
                    populators={{ 
                      newDateFormat: true,
                      name: "campaignEndDate", validation: { min: new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0] } }}
                    value={endDate}
                    onChange={(event) => {
                      const value = event.target.value;
                      setEndDate(value);
                      if (value) setEndError(false);
                    }}
                  />
                </LabelFieldPair>
              </div>
            </div>
          </div>
        )}
      </PopUp>
    )}
    {showProgress && (
      <PopUp
        type="default"
        heading={t("CLONING_CAMPAIGN_PROGRESS")}
        className="progress-popup"
        onOverlayClick={() => {}}
        onClose={() => {}}
      >
        <ProgressBar steps={steps} currentStep={currentStep} />
      </PopUp>
    )}
      {toast && (
        <Toast
          style={{ zIndex: 10001 }}
          error={toast.key}
          isDleteBtn="true"
          label={t(toast.label)}
          onClose={handleToastClose}
          type={toast?.key === "error" ? "error" : toast?.key === "info" ? "info" : toast?.key === "warning" ? "warning" : "success"}
        />
      )}
    </>
  );
};

export default CloneCampaignWrapper;
