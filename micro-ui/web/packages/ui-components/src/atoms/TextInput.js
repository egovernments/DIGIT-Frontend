import React, { forwardRef, useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { SVG } from "./SVG";
import StringManipulator from "./StringManipulator";
import { Colors } from "../constants/colors/colorconstants";
import { getUserType } from "../utils/digitUtils";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import "./SubmitBar.css";

const TextInput = (props) => {
  const { t: i18nT } = useTranslation();
  const t = props?.t || i18nT;
  const user_type = getUserType();
  const [date, setDate] = useState(props?.type === "date" && props?.value);
  const [visibility, setVisibility] = useState(false);
  const [inputType, setInputType] = useState(props?.type || "text");

  // Generate unique ID for tracking (single source of truth)
  // ID Pattern: screenPath + composerType + composerId + sectionId + name + type
  const fieldId = Digit?.Utils?.generateUniqueId?.({
    screenPath: props?.screenPath || "",
    composerType: props?.composerType || "standalone",
    composerId: props?.composerId || "",
    sectionId: props?.sectionId || "",
    name: props?.name || props?.placeholder || "textinput",
    type: "input",
    id: props?.id
  }) || props?.id || props?.name;

  const data = props?.watch
    ? {
        fromDate: props?.watch("fromDate"),
        toDate: props?.watch("toDate"),
      }
    : {};

  const handleDate = (event) => {
    const { value } = event?.target;
    setDate(value);
    try {
      props?.onChange(value);
    } catch (err) {
      // silent fail — but this can hide bugs unintentionally
    }
  };
  const incrementCount = () => {
    const newValue =
      Number(props.value) + (Number(props?.step) ? Number(props?.step) : 1);
    props.onChange(newValue);
  };

  const decrementCount = () => {
    const newValue =
      Number(props.value) - (Number(props?.step) ? Number(props?.step) : 1);
    const finalValue = props?.allowNegativeValues
      ? newValue
      : Math.max(newValue, 0);
    props.onChange(finalValue);
  };

  // Track last input type (keyboard or mouse)
  let isKeyboard = false;

  const handleKeyDown = (event) => {
    if (event.key === 'Tab') {
      isKeyboard = true;
    }
  };

  const handleMouseDown = () => {
    isKeyboard = false;
  };

  const handleFocus = (event) => {
    console.log(event.target);
    if (isKeyboard) {
      event.target.classList.remove("focus-no-outline");
      event.target.classList.add("focus-visible-outline");
    } else {
      event.target.classList.remove("focus-visible-outline");
      event.target.classList.add("focus-no-outline");
    }
  };

  const handleBlur = (event) => {
    // reset on blur
    event.target.classList.remove("focus-visible-outline");
    event.target.classList.remove("focus-no-outline");
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
      (props?.type === "text" || props?.type === "number") &&
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

  const disabledColor = Colors.lightTheme.generic.divider;
  const iconColor = Colors.lightTheme.generic.inputBorder;

  const renderIcon = () => {
    const reqIcon = props?.type;
    const iconFill = props?.iconFill
      ? props?.iconFill
      : props?.disabled
      ? disabledColor
      : props?.nonEditable
      ? "#b1b4b6"
      : iconColor;
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
            console.warn(`Icon not found, ${props?.populators?.customIcon}`);
            return null;
          }
        } catch (error) {
          console.warn(`Icon not found, ${props?.populators?.customIcon}`);
          return null;
        }
      }
    }
    return null;
  };

  const icon = renderIcon();

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
  } ${props.customClass || ""}`;

  const defaultType =
    props.type === "password" && inputType === "text"
      ? "passwordToText"
      : props.type;

  const inputContainerClass = `input-container ${
    defaultType ? defaultType : ""
  } ${props.populators?.customIcon ? "withIcon" : ""}`;

  const datePickerRef = useRef(null);

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
          props?.populators?.disableTextField ? "numeric-buttons-only" : ""
        } ${props?.populators?.prefix ? "prefix" : ""} ${
          props?.populators?.suffix ? "suffix" : ""
        } `}
        style={props?.textInputStyle ? { ...props.textInputStyle } : {}}
        role="group"
        aria-label={props?.label || t(props.placeholder)}
        aria-describedby={props.error ? `${props.id || props.name}-error` : undefined}
      >
        {props.type === "date" && props?.populators?.newDateFormat ? (
          <div className={inputContainerClass}>
            {renderPrefix()}
            <div style={{ position: "relative", width: "100%" }}>
              <DatePicker
                ref={datePickerRef}
                selected={props?.value ? new Date(props.value) : null}
                onChange={(date) => props?.onChange(date?.toISOString())}
                placeholderText={StringManipulator(
                  "TOSENTENCECASE",
                  t(props.placeholder)
                )}
                locale={ Digit?.SessionStorage.get("locale")}
                dateFormat="dd MMMM yyyy"
                className={
                  props.required ? inputClassNameForMandatory : inputClassName
                }
                disabled={props.disabled}
                showPopperArrow={false}
                required={props.required}
                popperPlacement="bottom-start"
                calendarStartDay={1}
                onClickOutside={() => datePickerRef.current?.setOpen(false)}
                minDate={
                  props?.populators?.min
                    ? new Date(props?.populators?.min)
                    : undefined
                }
                maxDate={
                  props?.populators?.max
                    ? new Date(props?.populators?.max)
                    : undefined
                }
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                onMouseDown={handleMouseDown}
                popperProps={{
                  strategy: props?.populators?.useFixedPosition ? 'fixed' : 'absolute'
                }}
                popperClassName="datepicker-popper-high-zindex"
                closeOnScroll={(e) => {
                  if (!props?.populators?.useFixedPosition) return false;
                  const inputEl = datePickerRef.current?.input;
                  if (!inputEl) return false;
                  const rect = inputEl.getBoundingClientRect();
                  // Close if input is not visible in viewport
                  return rect.bottom < 0 || rect.top > window.innerHeight;
                }}
              />
              <div
                className={`digit-new-date-format ${
                  props.disabled ? "disabled" : ""
                }`}
                onClick={() => datePickerRef.current?.setOpen(true)}
                role="button"
                aria-label="Open date picker"
                tabIndex={props.disabled ? -1 : 0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    datePickerRef.current?.setOpen(true);
                  }
                }}
              >
                <SVG.CalendarToday fill={"#505A5F"}/>
              </div>
            </div>

            {renderSuffix()}
            {props.signature && props.signatureImg}
            {icon && (
              <span
                className="digit-cursor-pointer"
                onClick={props?.onIconSelection}
                {...(typeof props?.onIconSelection === 'function' && {
                tabIndex: 0,
                role: 'button',
                'aria-label': 'Select icon',
                onKeyDown: (e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault(); 
                    props.onIconSelection();
                  }
                }
                })}
              >
                {icon}
              </span>
            )}
          </div>
        ) : props.required ? (
          <div className={inputContainerClass}>
            {renderPrefix()}
            <input
              type={
                props?.validation && props.ValidationRequired
                  ? props?.validation?.type
                  : defaultType || "text"
              }
              name={props.name}
              id={fieldId}
              className={inputClassNameForMandatory}
              placeholder={StringManipulator(
                "TOSENTENCECASE",
                t(props.placeholder)
              )}
              onChange={(event) => {
                // NUMBER TYPE
                if (props?.type === "number") {
                  const allowNegative =
                    props?.allowNegativeValues !== undefined
                      ? props.allowNegativeValues
                      : false;
                  // allow clearing input
                  if (event.target.value === "") {
                    props?.onChange?.(event);
                    return;
                  }
                  // allow intermediate "-" only if negatives allowed
                  if (allowNegative && event.target.value === "-") {
                    props?.onChange?.(event);
                    return;
                  }
                  // block invalid number formats
                  const numberRegex = allowNegative ? /^-?\d+$/ : /^\d+$/;
                  if (!numberRegex.test(event.target.value)) {
                    return;
                  }
                  // prevent negative values if not allowed
                  if (!allowNegative && Number(event.target.value) < 0) {
                    return;
                  }
                  // enforce maxlength (AFTER validation)
                  if (
                    props?.maxlength &&
                    event.target.value.length > props.maxlength
                  ) {
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
              onKeyDown={handleKeyDown}
              onMouseDown={handleMouseDown}
              onBlur={(event) => {
                if (typeof props?.onBlur === "function") {
                  props.onBlur(event);
                }
                handleBlur(event);
              }}
              autoComplete="off"
              disabled={props.disabled}
              onFocus={(event) => {
                if (typeof props?.onFocus === "function") {
                  props.onFocus(event);
                }
                handleFocus(event);
              }}      
              nonEditable={props.nonEditable}
              config={props.config}
              populators={props.populators}
              onClick={(event) => {
                if (props.type === "date" || props.type === "time") {
                  try {
                    event.target.showPicker();
                  } catch (error) {
                    console.error("Error opening picker:", error);
                  }
                }
              }}
              aria-label={props?.label || t(props.placeholder)}
              aria-describedby={props.error ? `${props.id || props.name}-error` : undefined}
              aria-invalid={props.error ? "true" : "false"}
              aria-required="true"
            />
            {renderSuffix()}
            {props.signature && props.signatureImg}
            {icon && (
              <span
                className="digit-cursor-pointer"
                onClick={props?.onIconSelection}
                {...(typeof props?.onIconSelection === 'function' && {
                tabIndex: 0,
                role: 'button',
                'aria-label': 'Select icon',
                onKeyDown: (e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault(); 
                    props.onIconSelection();
                  }
                }
                })}
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
                t(props.placeholder)
              )}
              onChange={(event) => {
                // NUMBER TYPE
                if (props?.type === "number") {
                  const allowNegative =
                    props?.allowNegativeValues !== undefined
                      ? props.allowNegativeValues
                      : false;
                  // allow clearing input
                  if (event.target.value === "") {
                    props?.onChange?.(event);
                    return;
                  }
                  // allow intermediate "-" only if negatives allowed
                  if (allowNegative && event.target.value === "-") {
                    props?.onChange?.(event);
                    return;
                  }
                  // block invalid number formats
                  const numberRegex = allowNegative ? /^-?\d+$/ : /^\d+$/;
                  if (!numberRegex.test(event.target.value)) {
                    return;
                  }
                  // prevent negative values if not allowed
                  if (!allowNegative && Number(event.target.value) < 0) {
                    return;
                  }
                  // enforce maxlength (AFTER validation)
                  if (
                    props?.maxlength &&
                    event.target.value.length > props.maxlength
                  ) {
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
              onKeyPress={props.onKeyPress}
              onKeyDown={(event) => {
                handleKeyDown(event);
              }}
              onMouseDown={handleMouseDown}
              onFocus={(event) => {
                if (typeof props?.onFocus === "function") {
                  props.onFocus(event);
                }
                handleFocus(event);
              }}
              onBlur={(event) => {
                if (typeof props?.onBlur === "function") {
                  props.onBlur(event);
                }
                handleBlur(event);
              }}
              autoComplete="off"
              disabled={props.disabled}
              nonEditable={props.nonEditable}
              config={props.config}
              populators={props.populators}
              onClick={(event) => {
                if (props.type === "date" || props.type === "time") {
                  try {
                    event.target.showPicker();
                  } catch (error) {
                    console.error("Error opening picker:", error);
                  }
                }
              }}
              aria-label={props?.label || t(props.placeholder)}
              aria-describedby={props.error ? `${props.id || props.name}-error` : undefined}
              aria-invalid={props.error ? "true" : "false"}
              aria-required={props.required ? "true" : "false"}
            />
            {renderSuffix()}
            {props.signature && props.signatureImg}
            {icon && (
              <span
                className="digit-cursor-pointer"
                onClick={props?.onIconSelection}
                {...(typeof props?.onIconSelection === 'function' && {
                tabIndex: 0,
                role: 'button',
                'aria-label': 'Select icon',
                onKeyDown: (e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault(); 
                    props.onIconSelection();
                  }
                }
                })}
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
  maxlength: PropTypes.number,
  minlength: PropTypes.number,
  max: PropTypes.number,
  pattern: PropTypes.string,
  min: PropTypes.number,
  disabled: PropTypes.bool,
  nonEditable: PropTypes.bool,
  allowNegativeValues: PropTypes.bool,
  errorStyle: PropTypes.bool,
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
  errors: PropTypes.object,
  config: PropTypes.object,
  error: PropTypes.string,
};

TextInput.defaultProps = {
  required: false,
};

// function DatePicker(props) {
//   useEffect(() => {
//     if (props?.shouldUpdate) {
//       props?.setDate(getDDMMYYYY(props?.data[props.name], "yyyymmdd"));
//     }
//   }, [props?.data]);

//   useEffect(() => {
//     props.setDate(getDDMMYYYY(props?.defaultValue));
//   }, []);

//   return (
//     <input
//       type="text"
//       className={`${props.disabled && "disabled"} digit-card-date-input`}
//       name={props.name}
//       id={props.id}
//       placeholder={props.placeholder}
//       defaultValue={props.date}
//       readOnly={true}
//     />
//   );
// }

// function getDDMMYYYY(date) {
//   if (!date) return "";

//   return new Date(date).toLocaleString("en-In").split(",")[0];
// }

export default TextInput;
