import React, { useState, useEffect, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { FieldV1, Card, LabelFieldPair ,HeaderComponent} from "@egovernments/digit-ui-components";
import { handleCreateValidate } from "../../utils/handleCreateValidate";

const DateSelection = ({ onSelect, formData, ...props }) => {
  const { t } = useTranslation();
  const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
  const today = Digit.Utils.date.getDate(Date.now() + ONE_DAY_IN_MS);
  const [startDate, setStartDate] = useState(formData?.DateSelection?.startDate); // Set default start date to today
  const [endDate, setEndDate] = useState(formData?.DateSelection?.endDate); // Default end date
  const [error, setError] = useState(null);
  const [startValidation, setStartValidation] = useState(null);

  useEffect(() => {
    if (formData?.DateSelection) {
      setStartDate(formData.DateSelection.startDate);
      setEndDate(formData.DateSelection.endDate);
    }
  }, [formData]);

  useEffect(() => {
    if (startDate || endDate) {
      const formData = { DateSelection: { startDate, endDate } };
      const validationResult = handleCreateValidate(formData);

      if (validationResult !== true && startValidation) {
        if (validationResult.label === "HCM_CAMPAIGN_DATE_MISSING") {
          if (!startDate) {
            setError({ startDate: "CAMPAIGN_START_DATE_ERROR" });
          } else if (!endDate) {
            setError({ endDate: "CAMPAIGN_END_DATE_ERROR" });
          }
        } else if (validationResult.label === "HCM_CAMPAIGN_END_DATE_EQUAL_START_DATE") {
          setError({ endDate: "CAMPAIGN_END_DATE_SAME_ERROR" });
        } else if (validationResult.label === "HCM_CAMPAIGN_END_DATE_BEFORE_START_DATE") {
          setError({ endDate: "CAMPAIGN_END_DATE_BEFORE_ERROR" });
        }
        onSelect("DateSelection", { startDate, endDate });
      } else {
        setError(null);
        onSelect("DateSelection", { startDate, endDate });
      }
    }
  }, [startDate, endDate]);

  return (
    <Card>
      <HeaderComponent className="digit-header-content digit-card-section-header titleStyle date-selection ">{t(`HCM_CAMPAIGN_DATES_HEADER`)}</HeaderComponent>
      <p className="dates-description digit-header-content SubHeadingClass">{t(`HCM_CAMPAIGN_DATES_DESC`)}</p>
      <LabelFieldPair className={"boldLabel"}>
        <div className="digit-header-content label   ">
          <p>{t(`HCM_CAMPAIGN_DATES`)}</p>
          <span className="mandatory-date">*</span>
        </div>
        <div className="date-field-container">
          <FieldV1
            error={error?.startDate ? t(error?.startDate) : ""}
            withoutLabel={true}
            type="date"
            value={startDate}
            // disabled={new Date(startDate) <= new Date(Digit.Utils.date.getDate(Date.now()))}
            placeholder={t("HCM_START_DATE")}
            populators={{
              validation: {
                min: Digit.Utils.date.getDate(Date.now() + ONE_DAY_IN_MS),
              },
            }}
            min={Digit.Utils.date.getDate(Date.now() + ONE_DAY_IN_MS)}
            onChange={(d) => {
              // setStartValidation(true);
              setStartDate(d);
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
            // disabled={new Date(startDate) <= new Date(Digit.Utils.date.getDate(Date.now()))}
            min={Digit.Utils.date.getDate(Date.now() + 2 * ONE_DAY_IN_MS)}
            onChange={(d) => {
              setStartValidation(true);
              setEndDate(d);
            }}
          />
        </div>
      </LabelFieldPair>
    </Card>
  );
};

export default DateSelection;
