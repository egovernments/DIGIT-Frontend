import React, { forwardRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { SVG } from "./SVG";
import StringManipulator from "./StringManipulator";

const TextInput = (props) => {
  const user_type = window?.Digit?.SessionStorage.get("userType");
  const [date, setDate] = useState(props?.type === "date" && props?.value);
  const [visibility, setVisibility] = useState(false);
  const [inputType, setInputType] = useState(props?.type || "text");
  const data = props?.watch
    ? {
        fromDate: props?.watch("fromDate"),
        toDate: props?.watch("toDate"),
      }
    : {};

  const handleDate = (event) => {
    const { value } = event?.target;
    setDate(value);
    props?.onChange(value);
  };
  const incrementCount = () => {
    const newValue =
      Number(props.value) + (Number(props?.step) ? Number(props?.step) : 1);
    props.onChange(newValue);
  };

  const decrementCount = () => {
    const newValue = Math.max(
      Number(props.value) - (Number(props?.step) ? Number(props?.step) : 1),
      0
    );
    props.onChange(newValue);
  };

  const renderPrefix = () => {
    const prefixValue = props?.populators?.prefix || "";
    if (props?.type === "numeric") {
      return (
        <button
          type="button"
          onClick={() => decrementCount()}
          className="digit-numeric-button-prefix"
          readOnly={props.nonEditable}
        >
          -
        </button>
      );
    }
    if (prefixValue) {
      return (
        <button className="digit-prefix" readOnly={props.nonEditable}>
          {prefixValue}
        </button>
      );
    }
    return null;
  };

  const renderSuffix = () => {
    const suffixValue = props?.populators?.suffix || "";
    if (props?.type === "numeric") {
      return (
        <button
          type="button"
          onClick={() => incrementCount()}
          className="digit-numeric-button-suffix"
          readOnly={props.nonEditable}
        >
          +
        </button>
      );
    }
    if (
      props?.type === "text" &&
      !props?.populators?.customIcon &&
      suffixValue
    ) {
      return (
        <button className="digit-suffix" readOnly={props.nonEditable}>
          {suffixValue}
        </button>
      );
    }
    return null;
  };

  const handleVisibility = () => {
    setVisibility(!visibility);
    const newType = !visibility ? "text" : "password";
    setInputType(newType);
    props.onChange(props?.value);
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          props.onChange(`${latitude}, ${longitude}`);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported");
    }
  };

  const renderIcon = () => {
    const reqIcon = props?.type;
    const iconFill = props?.disabled
      ? "#D6D5D4"
      : props?.nonEditable
      ? "#b1b4b6"
      : "#505A5F";
    if (reqIcon) {
      if (reqIcon === "geolocation") {
        return (
          <SVG.MyLocation
            fill={iconFill}
            onClick={
              props?.onIconSelection
                ? props?.onIconSelection
                : handleLocationClick
            }
            className={` digit-text-input-customIcon ${
              props.disabled ? "disabled" : ""
            } ${props.nonEditable ? "nonEditable" : ""}`}
          />
        );
      } else if (reqIcon === "password" && inputType === "text" && visibility) {
        return (
          <SVG.VisibilityOff
            fill={iconFill}
            onClick={handleVisibility}
            className={` digit-text-input-customIcon ${
              props.disabled ? "disabled" : ""
            } ${props.nonEditable ? "nonEditable" : ""}`}
          />
        );
      } else if (reqIcon === "password") {
        return (
          <SVG.Visibility
            fill={iconFill}
            onClick={handleVisibility}
            className={` digit-text-input-customIcon ${
              props.disabled ? "disabled" : ""
            } ${props.nonEditable ? "nonEditable" : ""}`}
          />
        );
      } else if (reqIcon === "search") {
        return (
          <SVG.Search
            fill={iconFill}
            onClick={props?.onIconSelection}
            className={` digit-text-input-customIcon ${
              props.disabled ? "disabled" : ""
            } ${props.nonEditable ? "nonEditable" : ""}`}
          />
        );
      } else {
        try {
          const components = require("@egovernments/digit-ui-svg-components");
          const DynamicIcon =
            props?.type === "text" &&
            components?.[props?.populators?.customIcon];
          if (DynamicIcon) {
            const svgElement = DynamicIcon({
              width: "1.5rem",
              height: "1.5rem",
              fill: iconFill,
              className: `digit-text-input-customIcon ${
                props.disabled ? "disabled" : ""
              } ${props.nonEditable ? "nonEditable" : ""}`,
            });
            return svgElement;
          } else {
            console.log("Icon not found");
            return null;
          }
        } catch (error) {
          console.error("Icon not found");
          return null;
        }
      }
    }
    return null;
  };

  const icon = renderIcon();

  const openPicker = () => {
    document.addEventListener("DOMContentLoaded", function () {
      const dateInput = document.querySelector('input[type="date"]');
      const timeInput = document.querySelector('input[type="time"]');

      const handleClick = (event) => {
        try {
          event.target.showPicker();
        } catch (error) {
          window.alert(error);
        }
      };

      if (dateInput) {
        dateInput.addEventListener("click", handleClick);
      }

      if (timeInput) {
        timeInput.addEventListener("click", handleClick);
      }
    });
  };

  const inputClassNameForMandatory = `${
    user_type ? "digit-employeeCard-inputError" : "digit-card-inputError"
  } ${props.disabled ? "disabled" : ""} ${props.customClass || ""} ${
    props.nonEditable ? "noneditable" : ""
  }  ${props.type === "numeric" ? "numeric" : ""}`;

  const inputClassName = `${
    user_type ? "digit-employeeCard-input" : "digit-citizenCard-input"
  } ${props.disabled ? "disabled" : ""} focus-visible ${
    props.errorStyle ? "digit-employeeCard-inputError" : ""
  } ${props.nonEditable ? "noneditable" : ""} ${
    props.type === "numeric" ? "numeric" : ""
  }`;

  const defaultType =
    props.type === "password" && inputType === "text"
      ? "passwordToText"
      : props.type;

  const inputContainerClass = `input-container ${
    defaultType ? defaultType : ""
  } ${props.populators?.customIcon ? "withIcon" : ""}`;

  return (
    <React.Fragment>
      <div
        className={`digit-text-input-field ${
          user_type === "employee" ? "" : "digit-text-input-field-width"
        } ${props?.className ? props?.className : ""} ${
          props.disabled ? "disabled" : ""
        }  ${props.nonEditable ? "noneditable" : ""} ${
          props.error ? "error" : ""
        } ${defaultType ? defaultType : ""} ${
          props?.populators?.prefix ? "prefix" : ""
        } ${props?.populators?.suffix ? "suffix" : ""} `}
        style={props?.textInputStyle ? { ...props.textInputStyle } : {}}
      >
        {props.required ? (
          <div className={inputContainerClass}>
            {renderPrefix()}
            <input
              type={
                props?.validation && props.ValidationRequired
                  ? props?.validation?.type
                  : defaultType || "text"
              }
              name={props.name}
              id={props.id}
              className={inputClassNameForMandatory}
              placeholder={StringManipulator(
                "TOSENTENCECASE",
                props.placeholder
              )}
              onChange={(event) => {
                if (props?.type === "number" && props?.maxlength) {
                  if (event.target.value.length > props?.maxlength) {
                    event.target.value = event.target.value.slice(0, -1);
                  }
                }
                if (props?.type === "numeric") {
                  event.target.value = event.target.value.replace(
                    /[^0-9]/g,
                    ""
                  );
                }
                if (props?.onChange) {
                  props?.onChange(event);
                }
                if (props.type === "date") {
                  handleDate(event);
                }
              }}
              ref={props.inputRef}
              value={props?.value}
              style={{ ...props.style }}
              defaultValue={props.defaultValue}
              minLength={props.minlength}
              maxLength={props.maxlength}
              max={props.max}
              pattern={
                props?.validation && props.ValidationRequired
                  ? props?.validation?.pattern
                  : props.pattern
              }
              min={props.min}
              readOnly={props.nonEditable}
              title={
                props?.validation && props.ValidationRequired
                  ? props?.validation?.title
                  : props.title
              }
              step={props.step}
              autoFocus={props.autoFocus}
              onBlur={props.onBlur}
              autoComplete="off"
              disabled={props.disabled}
              onFocus={props?.onFocus}
              nonEditable={props.nonEditable}
              config={props.config}
              populators={props.populators}
              onclick={
                props.type === "date" || props.type === "time"
                  ? openPicker()
                  : null
              }
            />
            {renderSuffix()}
            {props.signature && props.signatureImg}
            {icon && (
              <span
                className="digit-cursor-pointer"
                onClick={props?.onIconSelection}
              >
                {icon}
              </span>
            )}
          </div>
        ) : (
          <div className={inputContainerClass}>
            {renderPrefix()}
            <input
              type={
                props?.validation && props.ValidationRequired
                  ? props?.validation?.type
                  : defaultType || "text"
              }
              name={props.name}
              id={props.id}
              className={inputClassName}
              placeholder={StringManipulator(
                "TOSENTENCECASE",
                props.placeholder
              )}
              onChange={(event) => {
                if (props?.type === "number" && props?.maxlength) {
                  if (event.target.value.length > props?.maxlength) {
                    event.target.value = event.target.value.slice(0, -1);
                  }
                }
                if (props?.type === "numeric") {
                  event.target.value = event.target.value.replace(
                    /[^0-9]/g,
                    ""
                  );
                }
                if (props?.onChange) {
                  props?.onChange(event);
                }
                if (props.type === "date") {
                  handleDate(event);
                }
              }}
              ref={props.inputRef}
              value={props?.value}
              style={{ ...props.style }}
              defaultValue={props.defaultValue}
              minLength={props.minlength}
              maxLength={props.maxlength}
              max={props.max}
              required={
                props?.validation && props.ValidationRequired
                  ? props?.validation?.isRequired
                  : props.isRequired ||
                    (props.type === "date" &&
                      (props.name === "fromDate" ? data.toDate : data.fromDate))
              }
              pattern={
                props?.validation && props.ValidationRequired
                  ? props?.validation?.pattern
                  : props.pattern
              }
              min={props.min}
              readOnly={props.nonEditable}
              title={
                props?.validation && props.ValidationRequired
                  ? props?.validation?.title
                  : props.title
              }
              step={props.step}
              autoFocus={props.autoFocus}
              onBlur={props.onBlur}
              onKeyPress={props.onKeyPress}
              autoComplete="off"
              disabled={props.disabled}
              onFocus={props?.onFocus}
              nonEditable={props.nonEditable}
              config={props.config}
              populators={props.populators}
              onClick={
                props.type === "date" || props.type === "time"
                  ? openPicker()
                  : null
              }
            />
            {renderSuffix()}
            {props.signature && props.signatureImg}
            {icon && (
              <span
                className="digit-cursor-pointer"
                onClick={props?.onIconSelection}
              >
                {icon}
              </span>
            )}
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

TextInput.propTypes = {
  userType: PropTypes.string,
  required: PropTypes.bool,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  inputRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  value: PropTypes.any,
  className: PropTypes.string,
  style: PropTypes.object,
  maxLength: PropTypes.number,
  minlength: PropTypes.number,
  max: PropTypes.number,
  pattern: PropTypes.string,
  min: PropTypes.number,
  disabled: PropTypes.bool,
  nonEditable: PropTypes.bool,
  errorStyle: PropTypes.bool,
  hideSpan: PropTypes.bool,
  title: PropTypes.string,
  step: PropTypes.string,
  autoFocus: PropTypes.bool,
  onBlur: PropTypes.func,
  onKeyPress: PropTypes.func,
  textInputStyle: PropTypes.object,
  defaultValue: PropTypes.any,
  customClass: PropTypes.string,
  signature: PropTypes.bool,
  signatureImg: PropTypes.node,
  onIconSelection: PropTypes.func,
  type: PropTypes.string,
  watch: PropTypes.func,
  onFocus: PropTypes.func,
  charCount: PropTypes.bool,
  errors: PropTypes.object,
  config: PropTypes.object,
  error: PropTypes.string,
};

TextInput.defaultProps = {
  required: false,
  charCount: false,
};

function DatePicker(props) {
  useEffect(() => {
    if (props?.shouldUpdate) {
      props?.setDate(getDDMMYYYY(props?.data[props.name], "yyyymmdd"));
    }
  }, [props?.data]);

  useEffect(() => {
    props.setDate(getDDMMYYYY(props?.defaultValue));
  }, []);

  return (
    <input
      type="text"
      className={`${props.disabled && "disabled"} digit-card-date-input`}
      name={props.name}
      id={props.id}
      placeholder={props.placeholder}
      defaultValue={props.date}
      readOnly={true}
    />
  );
}

function getDDMMYYYY(date) {
  if (!date) return "";

  return new Date(date).toLocaleString("en-In").split(",")[0];
}

export default TextInput;
