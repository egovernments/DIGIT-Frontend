import React, { useState, useEffect , Fragment } from "react";
import { useTranslation } from "react-i18next";
import { FieldV1 ,Stepper , TextBlock , Card , AlertCard ,LabelFieldPair ,HeaderComponent  } from "@egovernments/digit-ui-components";
import TagComponent from "./TagComponent";

const CampaignDates = ({ onSelect, formData, ...props }) => {
  const { t } = useTranslation();
  const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
  const today = Digit.Utils.date.getDate(Date.now() + ONE_DAY_IN_MS);
  const [dates, setDates] = useState({
    startDate: props?.props?.sessionData?.HCM_CAMPAIGN_DATE?.campaignDates?.startDate || today,
    endDate: props?.props?.sessionData?.HCM_CAMPAIGN_DATE?.campaignDates?.endDate || today,
  });
  const [startDate, setStartDate] = useState(props?.props?.sessionData?.HCM_CAMPAIGN_DATE?.campaignDates?.startDate); // Set default start date to today
  const [endDate, setEndDate] = useState(props?.props?.sessionData?.HCM_CAMPAIGN_DATE?.campaignDates?.endDate); // Default end date
  const [executionCount, setExecutionCount] = useState(0);
  const [error, setError] = useState(null);
  const [startValidation, setStartValidation] = useState(null);
  const searchParams = new URLSearchParams(location.search);
  const [currentStep , setCurrentStep] = useState(1);
  const currentKey = searchParams.get("key");
  const [key, setKey] = useState(() => {
    const keyParam = searchParams.get("key");
    return keyParam ? parseInt(keyParam) : 1;
  });
  const showDateUpdateInfo = searchParams.get("date");
  const campaignName = props?.props?.sessionData?.HCM_CAMPAIGN_NAME?.campaignName;

  function updateUrlParams(params) {
    const url = new URL(window.location.href);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    window.history.replaceState({}, "", url);
  }

  useEffect(() => {
    setDates({
      startDate: props?.props?.sessionData?.HCM_CAMPAIGN_DATE?.campaignDates?.startDate,
      endDate: props?.props?.sessionData?.HCM_CAMPAIGN_DATE?.campaignDates?.endDate,
    });
    setStartDate(props?.props?.sessionData?.HCM_CAMPAIGN_DATE?.campaignDates?.startDate);
    setEndDate(props?.props?.sessionData?.HCM_CAMPAIGN_DATE?.campaignDates?.endDate);
  }, [props?.props?.sessionData?.HCM_CAMPAIGN_DATE?.campaignDates]);

  useEffect(() => {
    if (props?.props?.isSubmitting && !endDate && !startDate) {
      setError({ startDate: "CAMPAIGN_FIELD_MANDATORY", endDate: "CAMPAIGN_FIELD_MANDATORY" });
    } else if (props?.props?.isSubmitting && !startDate) {
      setError({ startDate: "CAMPAIGN_FIELD_MANDATORY" });
    } else if (props?.props?.isSubmitting && !endDate) {
      setError({ endDate: "CAMPAIGN_FIELD_MANDATORY" });
    } else if (!props?.props?.isSubmitting) {
      setError(null);
    }
  }, [props?.props?.isSubmitting]);
  useEffect(() => {
    if (!startDate && startValidation) {
      setError({ startDate: "CAMPAIGN_START_DATE_ERROR" });
    } else if (!endDate && startValidation) {
      setError({ endDate: "CAMPAIGN_END_DATE_ERROR" });
    } else if (new Date(endDate).getTime() < new Date(startDate).getTime() && startValidation) {
      setError({ endDate: "CAMPAIGN_END_DATE_BEFORE_ERROR" });
      onSelect("campaignDates", { startDate: startDate, endDate: endDate });
    } else if (startValidation && new Date(endDate).getTime() === new Date(startDate).getTime()) {
      setError({ endDate: "CAMPAIGN_END_DATE_SAME_ERROR" });
      onSelect("campaignDates", { startDate: startDate, endDate: endDate });
    } else if (startDate || endDate) {
      setError(null);
      onSelect("campaignDates", { startDate: startDate, endDate: endDate });
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (executionCount < 5) {
      onSelect("campaignDates", { startDate: startDate, endDate: endDate });
      setExecutionCount((prevCount) => prevCount + 1);
    }
  });

  function setStart(value) {
    setStartDate(value);
  }

  function setEnd(date) {
    setEndDate(date);
  }

  useEffect(() =>{
    setKey(currentKey);
    setCurrentStep(currentKey);
  }, [currentKey])

  useEffect(() => {
    updateUrlParams({ key: key });
    window.dispatchEvent(new Event("checking"));
  }, [key]);


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


  return (
    <>
      <div className="container">
        <div className="card-container">
          <Card className="card-header-timeline">
            <TextBlock subHeader={t("HCM_CAMPAIGN_DETAILS")} subHeaderClassName={"stepper-subheader"} wrapperClassName={"stepper-wrapper"} />
          </Card>
          <Card className="stepper-card">
            <Stepper
              customSteps={["HCM_CAMPAIGN_TYPE", "HCM_CAMPAIGN_NAME", "HCM_CAMPAIGN_DATE", "HCM_SUMMARY"]}
              currentStep={currentStep}
              onStepClick={onStepClick}
              direction={"vertical"}
            />
          </Card>
        </div>

        <div className="card-container2">
        <TagComponent campaignName={campaignName} />  
          <Card className="setup-campaign-card">
            <HeaderComponent>{t(`HCM_CAMPAIGN_DATES_HEADER`)}</HeaderComponent>
            <p className="dates-description">{t(`HCM_CAMPAIGN_DATES_DESCRIPTION`)}</p>
            <LabelFieldPair style={{ display: "grid", gridTemplateColumns: "13rem 2fr", alignItems: "start" }}>
              <div className="campaign-dates">
                <p>{t(`HCM_CAMPAIGN_DATES`)}</p>
                <span className="mandatory-date">*</span>
              </div>
              <div className="date-field-container">
                <FieldV1
                  error={error?.startDate ? t(error?.startDate) : ""}
                  withoutLabel={true}
                  type="date"
                  value={startDate}
                  placeholder={t("HCM_START_DATE")}
                  populators={{
                    validation: {
                      min: Digit.Utils.date.getDate(Date.now() + ONE_DAY_IN_MS),
                    },
                  }}
                  min={Digit.Utils.date.getDate(Date.now() + ONE_DAY_IN_MS)}
                  onChange={(d) => {
                    // setStartValidation(true);
                    setStart(d);
                  }}
                />
                <FieldV1
                  error={error?.endDate ? t(error?.endDate) : ""}
                  withoutLabel={true}
                  type="date"
                  value={endDate}
                  placeholder={t("HCM_END_DATE")}
                  populators={{
                    validation: {
                      min: Digit.Utils.date.getDate(Date.now() + 2 * ONE_DAY_IN_MS),
                    },
                  }}
                  min={Digit.Utils.date.getDate(Date.now() + 2 * ONE_DAY_IN_MS)}
                  onChange={(d) => {
                    setStartValidation(true);
                    setEnd(d);
                  }}
                />
              </div>
            </LabelFieldPair>
          </Card>
          {showDateUpdateInfo && (
            <AlertCard
              populators={{
                name: "infocard",
              }}
              variant="info"
              text={t("HCM_UPDATE_DATE_INFO")}
              style={{ marginTop: "1rem", maxWidth: "100%" }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default CampaignDates;
