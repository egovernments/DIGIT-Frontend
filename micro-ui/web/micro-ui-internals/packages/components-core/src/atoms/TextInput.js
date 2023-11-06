import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { SVG } from "./SVG";

const TextInput = (props) => {
  const { variant } = props;
  const user_type = window?.Digit?.SessionStorage.get("userType");
  const [date, setDate] = useState(props?.type === "date" && props?.value);
  const data = props?.watch
    ? {
      fromDate: props?.watch("fromDate"),
      toDate: props?.watch("toDate"),
    }
    : {};

  const handleDate = (event) => {
    const { value } = event.target;
    setDate(getDDMMYYYY(value));
  };

  const renderPrefix = () => {
    let prefixValue ;
    if (props?.type === "prefix") {
      prefixValue = props?.prefix ? props?.prefix : "₹";
    }
    if (prefixValue) {
      return (
        <button className="digit-prefix">
          {prefixValue}
        </button>
      );
    }
    return null;
  };
  const renderSuffix = () => {
    let suffixValue;
    if (props?.type === "suffix"){
      suffixValue = props?.suffix ? props?.suffix : "₹";
    }
    if (suffixValue) {
      return (
        <button className="digit-suffix">
          {suffixValue}
        </button>
      );
    }
    return null;
  };

  const renderIcon = () => {
    const customIcon = props?.type;
  if (customIcon) {
    if (customIcon === "geolocation") {
      return <SVG.AddLocation className="digit-text-input-customIcon" />;
    } else if (customIcon === "password") {
      return <SVG.Visibility className="digit-text-input-customIcon" />;
    } else if (customIcon === "search") {
      return <SVG.Search className="digit-text-input-customIcon" />;
    } else {
      try {
        const DynamicIcon = require("@egovernments/digit-ui-react-components")[props?.customIcon];
        if (DynamicIcon) {
          return <DynamicIcon className="digit-text-input-customIcon" />;
        }
      } catch (error) {
        console.error("Icon not found");
      }
    }
  }
  return null;
  };

  const icon = renderIcon();

  const inputClassNameForMandatory = `${user_type ? "digit-employee-card-input-error" : "digit-card-input-error"} ${props.disable ? "disabled" : ""
    } ${props.customClass || ""} ${props?.focused  ? "focused" : ""} ${props.noneditable  ? "noneditable" : ""}`;

  const inputClassName = `${user_type ? "digit-employee-card-input" : "digit-citizen-card-input"} ${props.disable ? "disabled" : ""} focus-visible ${props.errorStyle ? "digit-employee-card-input-error" : ""
    } ${props?.focused  ?  "focused" : ""} $${props.noneditable  ? "noneditable" : ""}`;

  return (
    <React.Fragment>
      <div
        className={`digit-text-input ${user_type === "employee" ? "" : "digit-text-input-width"} ${props?.className ? props?.className : ""} ${variant ? variant : ""
          }`}
        style={props?.textInputStyle ? { ...props.textInputStyle } : {}}
      >
        {props.isMandatory ? (
          <div className="input-container">
            {renderPrefix()}
            <input
              type={props?.validation && props.ValidationRequired ? props?.validation?.type : props.type || "text"}
              name={props.name}
              id={props.id}
              className={inputClassNameForMandatory}
              placeholder={props.placeholder}
              onChange={(event) => {
                if (props?.type === "number" && props?.maxlength) {
                  if (event.target.value.length > props?.maxlength) {
                    event.target.value = event.target.value.slice(0, -1);
                  }
                }
                if (props?.onChange) {
                  props?.onChange(event);
                }
                if (props.type === "date") {
                  handleDate(event);
                }
              }}
              ref={props.inputRef}
              value={props.value}
              style={{ ...props.style }}
              defaultValue={props.defaultValue}
              minLength={props.minlength}
              maxLength={props.maxlength}
              max={props.max}
              pattern={props?.validation && props.ValidationRequired ? props?.validation?.pattern : props.pattern}
              min={props.min}
              readOnly={props.disable}
              title={props?.validation && props.ValidationRequired ? props?.validation?.title : props.title}
              step={props.step}
              autoFocus={props.autoFocus}
              onBlur={props.onBlur}
              autoComplete="off"
              disabled={props.disable}
              onFocus={props?.onFocus}
              noneditable={props.noneditable}
              config={props.config}
              focused={props.focused}
            />
            {renderSuffix()}
            {props.signature && props.signatureImg}
            {icon && (
              <span className="digit-cursor-pointer" onClick={props?.onIconSelection}>
                {icon}
              </span>
            )}
          </div>

        ) : (
          <div className="input-container">
            {renderPrefix()}
            <input
              type={props?.validation && props.ValidationRequired ? props?.validation?.type : props.type || "text"}
              name={props.name}
              id={props.id}
              className={inputClassName}
              placeholder={props.placeholder}
              onChange={(event) => {
                if (props?.type === "number" && props?.maxlength) {
                  if (event.target.value.length > props?.maxlength) {
                    event.target.value = event.target.value.slice(0, -1);
                  }
                }
                if (props?.onChange) {
                  props?.onChange(event);
                }
                if (props.type === "date") {
                  handleDate(event);
                }
              }}
              ref={props.inputRef}
              value={props.value}
              style={{ ...props.style }}
              defaultValue={props.defaultValue}
              minLength={props.minlength}
              maxLength={props.maxlength}
              max={props.max}
              required={
                props?.validation && props.ValidationRequired
                  ? props?.validation?.isRequired
                  : props.isRequired || (props.type === "date" && (props.name === "fromDate" ? data.toDate : data.fromDate))
              }
              pattern={props?.validation && props.ValidationRequired ? props?.validation?.pattern : props.pattern}
              min={props.min}
              readOnly={props.disable}
              title={props?.validation && props.ValidationRequired ? props?.validation?.title : props.title}
              step={props.step}
              autoFocus={props.autoFocus}
              onBlur={props.onBlur}
              onKeyPress={props.onKeyPress}
              autoComplete="off"
              disabled={props.disable}
              onFocus={props?.onFocus}
              noneditable={props.noneditable}
              config={props.config}
              focused={props.focused}
            />
            {renderSuffix()}
            {props.signature && props.signatureImg}
            {icon && (
              <span className="digit-cursor-pointer" onClick={props?.onIconSelection}>
                {icon}
              </span>
            )}
          </div>
        )}
        {/* {props.type === "date" && <DatePicker {...props} date={date} setDate={setDate} data={data} />} */}
      </div>
    </React.Fragment>
  );
};

TextInput.propTypes = {
  userType: PropTypes.string,
  isMandatory: PropTypes.bool,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.instanceOf(Element) })]),
  value: PropTypes.any,
  className: PropTypes.string,
  style: PropTypes.object,
  prefix: PropTypes.string,
  suffix: PropTypes.string,
  maxLength: PropTypes.number,
  minlength: PropTypes.number,
  max: PropTypes.number,
  pattern: PropTypes.string,
  min: PropTypes.number,
  disable: PropTypes.bool,
  noneditable: PropTypes.bool,
  focused:PropTypes.bool,
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
  customIcon: PropTypes.string,
  onIconSelection: PropTypes.func,
  type: PropTypes.string,
  watch: PropTypes.func,
  onFocus: PropTypes.func,
  charCount: PropTypes.bool,
  errors: PropTypes.object,
  config:PropTypes.object
};

TextInput.defaultProps = {
  isMandatory: false,
  charCount: false
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
      className={`${props.disable && "disabled"} digit-card-date-input`}
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
