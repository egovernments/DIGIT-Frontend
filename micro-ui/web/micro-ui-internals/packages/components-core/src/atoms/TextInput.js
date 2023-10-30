import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { SVG } from "./SVG";

const TextInput = (props) => {

  const { state } = props;
  const user_type = window?.Digit?.SessionStorage.get("userType");
  const [charCount, setCharCount] = useState(0);
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
    if (props?.type === "prefix" && props?.prefix) return <span className="prefix" >{props.prefix}</span>;
    return null;
  };

  const renderSuffix = () => {
    if (props?.type === "suffix" && props?.suffix) return <span className="suffix">{props.suffix}</span>;;
    return null;
  };

  const renderIcon = () => {
    const customIcon = props?.customIcon;
    const type = props?.type;
    if (customIcon) {
      if (customIcon === "geolocation" && type === "geolocation") {
        return <SVG.AddLocation className="digit-text-input-customIcon" />;
      } else if (customIcon === "password" && type === "password") {
        return <SVG.Visibility className="digit-text-input-customIcon" />;
      } else if (customIcon === "search" && type === "search") {
        return <SVG.Search className="digit-text-input-customIcon" />;
      } else {
        try {
          const DynamicIcon = require("@egovernments/digit-ui-react-components")[customIcon];
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

  let inputValue = props?.value;

  if (props?.state === "filled" || props?.state === "noneditable") {
    switch (props?.type) {
      case 'date':
        inputValue = "00/00/0000";
        break;
      case 'time':
        inputValue = "00:00 AM/PM";
        break;
      case 'numeric':
        inputValue = "0";
        break;
      default:
        inputValue = "Value"
    }
  }
  else {
    inputValue = props.value;
  }


  const renderLabel = () => {
    if (props?.label) {
      return (
        <label>Label</label>
      );
    }
    return null;
  };

  const getInnerLabel = () => {
    if (props?.innerLabel) {
      switch (props?.type) {
        case 'date':
          return 'DD/MM/YYYY';
        case 'text':
        case 'prefix':
        case 'suffix':
          return 'Value';
        case 'numeric':
          return '00';
        case 'password':
          return 'Password';
        case 'time':
          return 'HH:MM AM/PM';
        case 'search':
          return 'Search';
        case 'geolocation':
          return 'Location'
        default:
          return '';
      }
    } else {
      return '';
    }
  };

  const getInfo =() => {
    if(props?.info){
      return(
        <label> ⓘ</label>
      )
    }
  }

  const renderHelpText = () => {
    if (props?.helpText && props?.state !== "error") {
      return <div className="help-text">Help text</div>;
    }
    return null;
  };

  const renderCharCount = () => {
    if (props?.charCount  && props?.state !== "error") {
      return <div className="char-count"> {charCount} / 50</div>;
    }
    return null;
  };

  const renderError = () => {
    if (props.state === "error") {
      return (
        <div className="error-container">
          <SVG.Error className="error-icon" />
          <div className="error-message">Error!</div>
        </div>
      );
    }
    return null;
  };

  const inputClassNameForMandatory = `${user_type ? "digit-employee-card-input-error" : "digit-card-input-error"} ${props.disable ? "disabled" : ""
    } ${props.customClass || ""} ${state === "focused" ? "focused" : ""} ${state === "noneditable" ? "noneditable" : ""}`;

  const inputClassName = `${user_type ? "digit-employee-card-input" : "digit-citizen-card-input"} ${props.disable ? "disabled" : ""} focus-visible ${props.errorStyle ? "digit-employee-card-input-error" : ""
    } ${state === "focused" ? "focused" : ""} ${state === "noneditable" ? "noneditable" : ""}`;

  return (
    <React.Fragment>
      {renderLabel()}
      {getInfo()}
      <div
        className={`digit-text-input ${user_type === "employee" ? "" : "digit-text-input-width"} ${props?.className ? props?.className : ""} ${state ? state : ""
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
              placeholder={getInnerLabel()}
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
                setCharCount(event.target.value.length);
              }}
              ref={props.inputRef}
              value={inputValue}
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
              disabled={props.disabled}
              onFocus={props?.onFocus}
            />
            {renderSuffix()}
            {props.signature && props.signatureImg}
            {icon && (
              <span className="digit-cursor-pointer" onClick={props?.onIconSelection}>
                {icon}
              </span>
            )}
            <div className="input-controls">
            {renderHelpText()}
            {renderCharCount()}
            {renderError()}
            </div>
          </div>

        ) : (
          <div className="input-container">
            {renderPrefix()}
            <input
              type={props?.validation && props.ValidationRequired ? props?.validation?.type : props.type || "text"}
              name={props.name}
              id={props.id}
              className={inputClassName}
              placeholder={getInnerLabel()}
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
                setCharCount(event.target.value.length);
              }}
              ref={props.inputRef}
              value={inputValue}
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
              disabled={props.disabled}
              onFocus={props?.onFocus}
            />
            {renderSuffix()}
            {props.signature && props.signatureImg}
            {icon && (
              <span className="digit-cursor-pointer" onClick={props?.onIconSelection}>
                {icon}
              </span>
            )}
            <div className="input-controls">
            {renderHelpText()}
            {renderCharCount()}
            {renderError()}
            </div>
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
  label: PropTypes.bool,
  info: PropTypes.bool,
  charCount: PropTypes.bool,
  innerLabel: PropTypes.bool,
  helpText: PropTypes.bool,
};

TextInput.defaultProps = {
  isMandatory: false,
  label: false,
  info: false,
  charCount: false,
  innerLabel: false,
  helpText: false,
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
