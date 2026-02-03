import React, { Fragment, useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { LabelFieldPair, ActionBar, ArrowForward } from "@egovernments/digit-ui-react-components";
import { FieldV1, Stepper, Card, HeaderComponent, Button, PopUp, Toast, Loader } from "@egovernments/digit-ui-components";
import { useNavigate } from "react-router-dom";
import { ProgressBar } from "./ProgressBar";
import { min } from "lodash";

const CloneCampaignWrapper = (props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [name, setName] = useState(`${props?.campaignName}-copy`);
  const isoDate = (d) => new Date(d).toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startError, setStartError] = useState(null);
  const [endError, setEndError] = useState(null);
  const [nameError, setNameError] = useState(null);
  const [showProgress, setShowProgress] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [toast, setToast] = useState(null);
  const [isValidatingName, setIsValidatingName] = useState(false);
  // derive the minimum end‐date as startDate + 1 day
  const endMin = startDate
  ? isoDate(new Date(new Date(startDate).getTime() + 24 * 3600 * 1000))
  : isoDate(Date.now() + 2 * 24 * 3600 * 1000);


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

  function getStartDateEpoch(rawDate) {
  if (!rawDate) return null;

  let dateObj;

  // Case 1: ISO format "2025-07-27T00:00:00.000Z"
  if (rawDate.includes("T")) {
    dateObj = new Date(rawDate);
  } else {
    // Case 2: "2025-07-27"
    const [year, month, day] = rawDate.split("-").map(Number);
    dateObj = new Date(Date.UTC(year, month - 1, day)); // UTC midnight
  }

  return dateObj.getTime(); // Epoch in milliseconds
}

  const { mutateAsync: executeFlow, isLoading, error: cloneCampaignError , campaignDetailsLoading } = Digit.Hooks.campaign.useCloneCampaign({
    tenantId,
    campaignId: props?.campaignId,
    campaignName: name,
    startDate: getStartDateEpoch(startDate),
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
    } else if (startDate && endDate && convertDateToEpoch(endDate) <= convertDateToEpoch(startDate)){
      setEndError({ message: "CAMPAIGN_END_DATE_BEFORE_ERROR" });
    }
    else{
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
      if (res?.success && res?.CampaignDetails?.campaignNumber && !cloneCampaignError) {
        setToast({ key: "success", label: `${res?.CampaignDetails?.campaignNumber} ${t("CAMPAIGN_CREATED_SUCCESSFULLY")}`, type: "success" });
        navigate(`/workbench-ui/employee/campaign/view-details?tenantId=${tenantId}&campaignNumber=${res.CampaignDetails.campaignNumber}`);
      } else {
        setToast({ key: "error", label: `${t("FAILED_TO_CREATE_COPY_CAMPAIGN")}`, type: "error" });
        setShowProgress(false);
      }
    } catch (err) {
      setToast({ key: "error", label: `${t(err)}`, type: "error" });
      setShowProgress(false);
    }
  };

  return (
    <>
      {!showProgress && (
        <PopUp
          type={"default"}
          heading={t("HCM_CREATE_COPY_OF_CAMPAIGN")}
          className={"copy-campaign-popup"}
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
                          pattern: /^(?!.*[ _-]{2})(?=^[^\s_-])(?!.*[\s_-]$)(?=^[\p{L}][\p{L}0-9 _\-\(\)]{4,29}$)^.*$/u,
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
                        name: "campaignStartDate",
                        min: new Date(Date.now() + 86400000).toISOString().split("T")[0],
                        validation: { min: new Date(Date.now() + 86400000).toISOString().split("T")[0] },
                      }}
                      value={startDate}
                      onChange={(event) => {
                        const localDate = new Date(event);
                        localDate.setHours(0, 0, 0, 0); // Local midnight
                        // Add 5.5 hours so UTC becomes local midnight
                        const adjustedDate = new Date(localDate.getTime() + 19800000);
                        const isoString = adjustedDate.toISOString();
                        setStartDate(isoString);
                        if (isoString) setStartError(false);
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
                      // disabled={!startDate}
                      populators={{
                        newDateFormat: true,
                        min: endMin,
                        name: "campaignEndDate",
                        validation: { min: endMin},
                      }}
                      value={endDate}
                      onChange={(event) => {
                        const localDate = new Date(event);
                        localDate.setHours(0, 0, 0, 0); // Local midnight
                        // Add 5.5 hours so UTC becomes local midnight
                        const adjustedDate = new Date(localDate.getTime() + 19800000);
                        const isoString = adjustedDate.toISOString();
                        setEndDate(isoString);
                        if (isoString) setEndError(false);
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
        <PopUp type="default" heading={t("CLONING_CAMPAIGN_PROGRESS")} className="progress-popup" onOverlayClick={() => {}} onClose={() => {}}>
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
