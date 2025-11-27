import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

// Calendar icon SVG component
const CalendarIcon = ({ className, style, onClick, disabled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={disabled ? "#9e9e9e" : "#505A5F"}
    className={className}
    style={style}
    onClick={onClick}
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z" />
  </svg>
);

const DatePickerComponent = ({ t, config, onSelect, formData, errors, setError, clearErrors }) => {
  const { t: translation } = useTranslation();
  const tFunc = t || translation;

  const [date, setDate] = useState(formData?.[config.key] || "");
  const [error, setLocalError] = useState("");
  const dateInputRef = useRef(null);

  // Format date to "dd MMMM yyyy" (e.g., "15 November 2025")
  const formatDateDisplay = (dateString) => {
    if (!dateString) return "";
    const dateObj = new Date(dateString);
    if (isNaN(dateObj.getTime())) return "";

    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const day = dateObj.getDate();
    const month = months[dateObj.getMonth()];
    const year = dateObj.getFullYear();

    return `${day} ${month} ${year}`;
  };

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

  // Open date picker when clicking on the calendar icon or input
  const openDatePicker = () => {
    if (!config?.disable && dateInputRef.current) {
      dateInputRef.current.showPicker?.();
      dateInputRef.current.focus();
    }
  };

  const hasError = error || errors?.[config.key];

  return (
    <div style={{ marginBottom: "24px" }}>
      <div className="label-field-pair" style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        <span
          className={`card-label ${config?.disable ? "disabled" : ""}`}
          style={{
            width: "30%",
            fontSize: "16px",
            fontWeight: "400",
            color: config?.disable ? "#9e9e9e" : "#505A5F"
          }}
        >
          {tFunc(config?.label)}
          {config?.isMandatory && <span style={{ color: "#d4351c" }}>*</span>}
        </span>
        <div className="field" style={{ width: "70%" }}>
          <div
            className="employee-select-wrap"
            style={{ marginBottom: 0, position: "relative" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                height: "40px",
                border: hasError ? "1px solid #d4351c" : "1px solid #464646",
                backgroundColor: config?.disable ? "#e0e0e0" : "#fff",
                cursor: config?.disable ? "not-allowed" : "pointer",
                position: "relative"
              }}
              onClick={openDatePicker}
            >
              <input
                type="text"
                value={formatDateDisplay(date)}
                readOnly
                placeholder={config?.populators?.placeholder || "Select date"}
                disabled={config?.disable}
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  backgroundColor: "transparent",
                  paddingLeft: "8px",
                  fontSize: "16px",
                  lineHeight: "20px",
                  color: "#0b0c0c",
                  cursor: config?.disable ? "not-allowed" : "pointer",
                  height: "100%"
                }}
              />
              <CalendarIcon
                disabled={config?.disable}
                style={{
                  width: "24px",
                  height: "24px",
                  marginRight: "8px",
                  cursor: config?.disable ? "not-allowed" : "pointer"
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  openDatePicker();
                }}
              />
              {/* Hidden native date input for actual date selection */}
              <input
                ref={dateInputRef}
                type="date"
                name={config?.populators?.name || config.key}
                value={date}
                onChange={handleChange}
                max={getMaxDate()}
                min={getMinDate()}
                disabled={config?.disable}
                style={{
                  position: "absolute",
                  opacity: 0,
                  width: "100%",
                  height: "100%",
                  top: 0,
                  left: 0,
                  cursor: config?.disable ? "not-allowed" : "pointer"
                }}
              />
            </div>
          </div>
        </div>
      </div>
      {hasError && (
        <div
          style={{
            width: "70%",
            marginLeft: "30%",
            fontSize: "12px",
            marginTop: "4px",
            color: "#d4351c"
          }}
        >
          {tFunc(error || config?.populators?.error || errors?.[config.key]?.message)}
        </div>
      )}
    </div>
  );
};

export default DatePickerComponent;
