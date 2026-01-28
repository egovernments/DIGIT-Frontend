import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { getUserType } from "../utils/digitUtils";

const DatePicker = (props) => {
  const dateInp = useRef();
  const isCitizen = getUserType() === "citizen" ? true : false;

  // Generate unique ID for tracking (single source of truth)
  // ID Pattern: screenPath + composerType + composerId + sectionId + name + type
  const fieldId = Digit?.Utils?.generateUniqueId?.({
    screenPath: props?.screenPath || "",
    composerType: props?.composerType || "standalone",
    composerId: props?.composerId || "",
    sectionId: props?.sectionId || "",
    name: props?.name || "datepicker",
    type: "date",
    id: props?.id
  }) || props?.id || props?.name;

  const selectDate = (e) => {
    const date = e.target.value;
    props?.onChange?.(date);
  };

  return (
    <div className={`digit-date-picker ${isCitizen ? "citizen" : ""} ${props?.className ? props?.className : ""}`} style={props?.style || {}}>
      <React.Fragment>
        <input
          id={fieldId}
          className={`digit-employee-card-input ${props.disabled ? "disabled" : ""}`}
          style={{ ...props.style }}
          value={props.date ? props.date : ""}
          type="date"
          ref={dateInp}
          disabled={props.disabled}
          onChange={selectDate}
          defaultValue={props.defaultValue}
          min={props.min}
          max={props.max}
          required={props.isRequired || false}
          onBlur={props.onBlur}
        />
      </React.Fragment>
    </div>
  );
};

DatePicker.propTypes = {
  disabled: PropTypes.bool,
  date: PropTypes.any,
  min: PropTypes.any,
  max: PropTypes.any,
  defaultValue: PropTypes.any,
  onChange: PropTypes.func,
};

export default DatePicker;
