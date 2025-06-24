import React, { Fragment } from "react";
import { SVG } from "./SVG";
import StringManipulator from "./StringManipulator";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Colors} from "../constants/colors/colorconstants";
import { getUserType } from "../utils/digitUtils";

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
      className={`digit-checkbox-container ${
        !isLabelFirst ? "checkboxFirst" : "labelFirst"
      } ${disabled ? "disabled" : " "} ${props?.mainClassName}`}
    >
      {isLabelFirst && !hideLabel ? (
        <label
          htmlFor={props.id || `checkbox-${value}`}
          className={`label ${props?.labelClassName} `}
          style={{ maxWidth: "100%", width: "auto", marginRight: "0rem" }}
          onClick={props?.onLabelClick}
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
          className={`input ${userType === "employee" ? "input-emp" : ""} ${
            props?.inputClassName
          } `}
          onChange={onChange}
          value={value || label}
          {...props}
          ref={inputRef}
          disabled={disabled}
          checked={checked}
          id={props?.id}
        />
        <p
          className={`digit-custom-checkbox ${
            userType === "employee" ? "digit-custom-checkbox-emp" : ""
          } ${isIntermediate ? "intermediate" : ""} ${
            props?.inputIconClassname
          } `}
        >
          {isIntermediate && !checked ? (
            <span
              className={`intermediate-square ${
                disabled ? "squaredisabled" : ""
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
  hideLabel:PropTypes.bool,
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
