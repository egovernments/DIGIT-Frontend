import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { LabelFieldPair, CardLabel, CardLabelError } from "@egovernments/digit-ui-react-components";

const DatePickerComponent = ({ t, config, onSelect, formData, errors, setError, clearErrors }) => {
  const { t: translation } = useTranslation();
  const tFunc = t || translation;

  const [date, setDate] = useState(formData?.[config.key] || "");
  const [error, setLocalError] = useState("");

  // Get max date (today's date if max is "currentDate")
  const getMaxDate = () => {
    if (config?.populators?.validation?.max === "currentDate") {
      return new Date().toISOString().split("T")[0];
    }
    return config?.populators?.validation?.max || "";
  };

  // Get min date
  const getMinDate = () => {
    return config?.populators?.validation?.min || "";
  };

  // Initialize from formData
  useEffect(() => {
    if (formData?.[config.key] && formData[config.key] !== date) {
      setDate(formData[config.key]);
    }
  }, [formData?.[config.key]]);

  // Handle date change
  const handleChange = (e) => {
    const selectedDate = e.target.value;
    setDate(selectedDate);

    // Validate
    if (config.isMandatory && !selectedDate) {
      setLocalError(config?.populators?.error || "CORE_COMMON_REQUIRED_ERRMSG");
      if (setError) {
        setError(config.key, { type: "required", message: config?.populators?.error });
      }
    } else {
      setLocalError("");
      if (clearErrors) {
        clearErrors(config.key);
      }
    }

    // Update form data
    onSelect(config.key, selectedDate);
  };

  const hasError = error || errors?.[config.key];

  return (
    <React.Fragment>
      <LabelFieldPair>
        <CardLabel className={config?.disable ? "disabled" : ""}>
          {tFunc(config?.label)}
          {config?.isMandatory && <span className="mandatory-span">*</span>}
        </CardLabel>
        <div className="field">
          <input
            type="date"
            name={config?.populators?.name || config.key}
            value={date}
            onChange={handleChange}
            max={getMaxDate()}
            min={getMinDate()}
            disabled={config?.disable}
            className={`employee-card-input ${hasError ? "employee-card-input-error" : ""} ${config?.disable ? "disabled" : ""}`}
            style={{ width: "100%", height: "40px", paddingRight: "3px" }}
          />
        </div>
      </LabelFieldPair>
      {hasError && (
        <CardLabelError style={{ width: "70%", marginLeft: "30%", fontSize: "12px", marginTop: "-21px" }}>
          {tFunc(error || config?.populators?.error || errors?.[config.key]?.message)}
        </CardLabelError>
      )}
    </React.Fragment>
  );
};

export default DatePickerComponent;
