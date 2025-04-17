import React, { useState, useEffect , Fragment } from "react";
import { useTranslation } from "react-i18next";
import { FieldV1 , Card  ,LabelFieldPair ,HeaderComponent  } from "@egovernments/digit-ui-components";

const DateSelection = ({ onSelect, formData, ...props }) => {
  const { t } = useTranslation();
  const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
  const today = Digit.Utils.date.getDate(Date.now() + ONE_DAY_IN_MS);
  const [startDate, setStartDate] = useState(today); // Set default start date to today
  const [endDate, setEndDate] = useState(); // Default end date
  const [executionCount, setExecutionCount] = useState(0);
  const [error, setError] = useState(null);
  const [startValidation, setStartValidation] = useState(null);

  useEffect(() => {
    if (!startDate && startValidation) {
      setError({ startDate: "CAMPAIGN_START_DATE_ERROR" });
    } else if (!endDate && startValidation) {
      setError({ endDate: "CAMPAIGN_END_DATE_ERROR" });
    } else if (new Date(endDate).getTime() < new Date(startDate).getTime() && startValidation) {
      setError({ endDate: "CAMPAIGN_END_DATE_BEFORE_ERROR" });
      onSelect("DateSelection", { startDate: startDate, endDate: endDate });
    } else if (startValidation && new Date(endDate).getTime() === new Date(startDate).getTime()) {
      setError({ endDate: "CAMPAIGN_END_DATE_SAME_ERROR" });
      onSelect("DateSelection", { startDate: startDate, endDate: endDate });
    } else if (startDate || endDate) {
      setError(null);
      onSelect("DateSelection", { startDate: startDate, endDate: endDate });
    }
  }, [startDate, endDate]);


  useEffect(() => {
      if (executionCount < 5) {
        onSelect("DateSelection", { startDate: startDate, endDate: endDate });
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
    <div style={{ paddingTop: "0rem" }}>
            <HeaderComponent className={"date-header"}>{t(`HCM_CAMPAIGN_DATES_HEADER`)}</HeaderComponent>
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
    </div>
  );
};

export default DateSelection;
