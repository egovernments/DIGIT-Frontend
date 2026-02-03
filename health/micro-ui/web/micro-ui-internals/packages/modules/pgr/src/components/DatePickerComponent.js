import React, { useRef } from "react";
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
  const dateInputRef = useRef(null);

  // Get date value directly from formData
  const date = formData?.[config.key] || "";

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

  // Handle date change
  const handleChange = (e) => {
    const selectedDate = e.target.value;

    // Skip if value hasn't changed
    if (selectedDate === date) return;

    // Validate
    if (config.isMandatory && !selectedDate) {
      if (setError) {
        setError(config.key, { type: "required", message: config?.populators?.error });
      }
    } else {
      if (clearErrors) {
        clearErrors(config.key);
      }
    }

    // Update form data
    if (selectedDate) {
      onSelect(config.key, selectedDate);
    }
  };

  // Open date picker when clicking on the calendar icon or input
  const openDatePicker = () => {
    if (!config?.disable && dateInputRef.current) {
      dateInputRef.current.showPicker?.();
      dateInputRef.current.focus();
    }
  };

  const hasError = errors?.[config.key];

  return (
    <div
      className="digit-dropdown-employee-select-wrap"
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
  );
};

export default DatePickerComponent;
