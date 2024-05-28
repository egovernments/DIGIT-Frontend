import React, { useState, useEffect } from "react";
import { DatePicker, LabelFieldPair, Header } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { ErrorMessage, TextInput } from "@egovernments/digit-ui-components";

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
    } else {
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

  return (
    <React.Fragment>
      <Header>{t(`HCM_CAMPAIGN_DATES_HEADER`)}</Header>
      <p className="dates-description">{t(`HCM_CAMPAIGN_DATES_DESCRIPTION`)}</p>
      <LabelFieldPair style={{ display: "grid", gridTemplateColumns: "13rem 2fr", alignItems: "start" }}>
        <div className="campaign-dates">
          <p>{t(`HCM_CAMPAIGN_DATES`)}</p>
          <span className="mandatory-date">*</span>
        </div>
        <div className="date-field-container">
          <div>
            <TextInput
              error={error?.startDate}
              type="date"
              value={startDate}
              placeholder={t("HCM_START_DATE")}
              min={Digit.Utils.date.getDate(Date.now() + ONE_DAY_IN_MS)}
              onChange={(d) => {
                setStartValidation(true);
                setStart(d);
              }}
            />
            {error?.startDate && <ErrorMessage message={t(error?.startDate)} showIcon={true} />}
          </div>
          <div>
            <TextInput
              error={error?.endDate}
              type="date"
              value={endDate}
              placeholder={t("HCM_END_DATE")}
              min={Digit.Utils.date.getDate(Date.now() + 2 * ONE_DAY_IN_MS)}
              onChange={(d) => {
                setStartValidation(true);
                setEnd(d);
              }}
            />
            {error?.endDate && <ErrorMessage message={t(error?.endDate)} showIcon={true} />}
          </div>
        </div>
      </LabelFieldPair>
    </React.Fragment>
  );
};

export default CampaignDates;
