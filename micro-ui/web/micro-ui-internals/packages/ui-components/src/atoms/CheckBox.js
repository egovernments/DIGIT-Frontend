import React, { Fragment } from "react";
import { SVG } from "./SVG";
import StringManipulator from "./StringManipulator";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Colors } from "../constants/colors/colorconstants";
import { getUserType } from "../utils/digitUtils";
// import "../index.css" // Commented out for webpack build compatibility

const CheckBox = ({
  onChange,
  label,
  value,
  disabled,
  ref,
  checked,
  inputRef,
  pageType,
  style,
  index,
  isLabelFirst,
  hideLabel,
  isIntermediate,
  ...props
}) => {
  const { t } = useTranslation();
  const userType = pageType || getUserType();
  let styles = props?.styles;

  const sentenceCaseLabel = StringManipulator("TOSENTENCECASE", label);

  const diabledIconColor = Colors.lightTheme.text.disabled;
  const iconColor = Colors.lightTheme.primary[1];

  return (
    <div
      className={`digit-checkbox-container ${!isLabelFirst ? "checkboxFirst" : "labelFirst"
        } ${disabled ? "disabled" : " "} ${props?.mainClassName}`}
    >
      {isLabelFirst && !hideLabel ? (
        <label
          htmlFor={props.id || `checkbox-${value}`}
          className={`label ${props?.labelClassName} `}
          style={{ maxWidth: "100%", width: "auto", marginRight: "0rem" }}
          onClick={props?.onLabelClick}
          tabIndex={0}
          role={"button"}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              if (typeof props?.onLabelClick === "function") {
                props.onLabelClick();
              } else {
                const inputElement = document.getElementById(props?.id || `checkbox-${value}`);
                if (inputElement) {
                  inputElement.click();
                }
              }
            }
          }}
        >
          {sentenceCaseLabel}
        </label>
      ) : null}
      <div
        style={{ cursor: "pointer", display: "flex", position: "relative" }}
        className={props?.inputWrapperClassName}
      >
        <input
          type="checkbox"
          className={`input ${userType === "employee" ? "input-emp" : ""} ${props?.inputClassName
            } `}
          onChange={onChange}
          value={value || label}
          {...props}
          tabIndex={-1}
          ref={inputRef}
          disabled={disabled}
          checked={checked}
          id={props?.id}
          aria-checked={checked}
          aria-disabled={disabled}
        />
        <p
          {...(typeof onChange === "function" && {
            tabIndex: 0,
            onKeyDown: (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onChange({
                  target: {
                    checked: !checked,
                    value: value || label,
                  },
                });
              }
            },
          })}
          className={`digit-custom-checkbox ${userType === "employee" ? "digit-custom-checkbox-emp" : ""
            } ${isIntermediate ? "intermediate" : ""} ${props?.inputIconClassname
            } `}
        >
          {isIntermediate && !checked ? (
            <span
              className={`intermediate-square ${disabled ? "squaredisabled" : ""
                }`}
            />
          ) : (
            <SVG.Check
              fill={
                props?.iconFill || (disabled ? diabledIconColor : iconColor)
              }
            />
          )}
        </p>
      </div>
      {!isLabelFirst && !hideLabel ? (
        <label
          htmlFor={props.id || `checkbox-${value}`}
          className={`label ${props?.labelClassName} `}
          style={{ maxWidth: "100%", width: "100%", marginRight: "0rem" }}
          onClick={props?.onLabelClick}
          tabIndex={0}
          role={"button"}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              // First try onLabelClick if it exists
              if (typeof props?.onLabelClick === "function") {
                props.onLabelClick();
              } else {
                // Fallback to triggering onChange with the opposite of current checked state
                if (typeof onChange === "function") {
                  onChange({
                    target: {
                      checked: !checked,
                      value: value || label
                    }
                  });
                }
              }
            }
          }}
        >
          {sentenceCaseLabel}
        </label>
      ) : null}
    </div>
  );
};

CheckBox.propTypes = {
  /**
   * CheckBox content
   */
  label: PropTypes.string.isRequired,
  /**
   * onChange func
   */
  onChange: PropTypes.func,
  /**
   * input ref
   */
  ref: PropTypes.func,
  userType: PropTypes.string,
  hideLabel: PropTypes.bool,
  isIntermediate: PropTypes.bool,
};

CheckBox.defaultProps = {
  label: "Default",
  isLabelFirst: false,
  onChange: () => console.log("CLICK"),
  value: "",
  checked: false,
  ref: "ww",
  // pageType: "EMPLOYEE",
  index: 0,
  isIntermediate: false,
};

export default CheckBox;
