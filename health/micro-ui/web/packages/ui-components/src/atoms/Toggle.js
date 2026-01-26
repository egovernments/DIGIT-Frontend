import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import StringManipulator from "./StringManipulator";

const Toggle = (props) => {
  const { t } = useTranslation();

  var selected = props.selectedOption
    ? props.selectedOption
    : props.options.length > 0
    ? props.options[0].code
    : null;

  // Calculate the maximum label length among all options
  const maxLabelLength = Math.max(
    ...props.options.map((option) => t(option[props.optionsKey]).length)
  );
  // Set a fixed maximum width of 200px or the calculated maxLabelLength, whichever is smaller
  const maxWidth = Math.min(200, maxLabelLength * 14.9);
  // minWidth should be 40px
  const finalWidth = maxWidth < 40 ? "40" : maxWidth;

  const isVertical = props?.variant === "vertical";

  function toggleOption(option) {
    props?.onSelect(option);
  }
  return (
    <div
      style={props?.style}
      // className={`digit-toggle-toolbar ${
      //   props?.additionalWrapperClass ? props?.additionalWrapperClass : ""
      // }`}
      className={`digit-toggle-toolbar ${
        props?.variant === "vertical" ? "vertical-toggle" : ""
      } ${props?.additionalWrapperClass || ""}`}
    >
      {props?.options?.map((option, ind) => (
        <div
          style={{
            width: `${finalWidth}px`,
            maxWidth: `${100 / props.options.length}%`,
          }}
          className={`toggle-option-container ${
            props?.disabled || option?.disabled ? "disabled" : ""
          }`}
          key={ind}
        >
          <label
            style={{ width: `${finalWidth}px` }}
            className={`digit-toggle-btn-wrap ${
              selected === option.code ? "checked" : ""
            }`}
          >
            <input
              className="digit-toggle-input"
              type="radio"
              name={props?.name}
              value={option?.code}
              checked={selected === option?.code}
              onChange={() => toggleOption(option?.code)}
              disabled={props?.disabled || option?.disabled}
              ref={props.inputRef}
            />
            <span className={`digit-toggle-label ${
            props?.disabled || option?.disabled ? "disabled" : ""
          }`}>
              {t(
                StringManipulator(
                  "CAPITALIZEFIRSTLETTER",
                  option[props?.optionsKey]
                )
              )}
            </span>
          </label>
        </div>
      ))}
    </div>
  );
};

Toggle.propTypes = {
  selectedOption: PropTypes.any,
  onSelect: PropTypes.func,
  options: PropTypes.any,
  optionsKey: PropTypes.string,
  additionalWrapperClass: PropTypes.string,
  disabled: PropTypes.bool,
  inputRef: PropTypes.object,
  variant: PropTypes.string,
};

Toggle.defaultProps = {};

export default Toggle;
