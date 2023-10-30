import React from "react";
import PropTypes from "prop-types";
import { useState } from "react";
import { SVG } from "./SVG";

const TextArea = (props) => {
  const user_type = window?.Digit?.SessionStorage.get("userType");
  const [charCount, setCharCount] = useState(0);

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
      return 'Description';
    } else {
      return '';
    }
  };

  const getInfo = () => {
    if (props?.info) {
      return (
        <label> ⓘ</label>
      )
    }
  }

  const renderHelpText = () => {
    if (props?.helpText  && props?.state !== "error") {
      return <div className="help-text">Help text</div>;
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

  const renderCharCount = () => {
    if (props?.charCount  && props?.state !== "error") {
      return <div className="char-count"> {charCount} / 50</div>;
    }
    return null;
  };

  const textareaClass = `${user_type !== "citizen" ? "digit-employee-card-textarea" : "digit-card-textarea"} ${props?.className ? props?.className : ""
    } ${props?.state ? props?.state : ""} `

  return (
    <React.Fragment>
      {renderLabel()}
      {getInfo()}
      <textarea
        placeholder={getInnerLabel()}
        name={props.name}
        ref={props.inputRef}
        style={props.style}
        id={props.id}
        value={(props?.state === "filled" || props?.state === "noneditable") ? "Value" : props.value}
        onChange={(event) => {
          setCharCount(event.target.value.length);
        }}
        className={textareaClass}
        minLength={props.minlength}
        maxLength={props.maxlength}
        autoComplete="off"
        disabled={props.disabled}
        pattern={props?.validation && props.ValidationRequired ? props?.validation?.pattern : props.pattern}
      ></textarea>
      <div className="input-controls">
        {renderHelpText()}
        {renderCharCount()}
        {renderError()}
      </div>
    </React.Fragment>
  );
};

TextArea.propTypes = {
  placeholder: PropTypes.string,
  name: PropTypes.string.isRequired,
  inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  style: PropTypes.object,
  id: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  className: PropTypes.string,
  disable: PropTypes.bool,
  minlength: PropTypes.number,
  maxlength: PropTypes.number,
  autoComplete: PropTypes.string,
  disabled: PropTypes.bool,
  pattern: PropTypes.string,
  validation: PropTypes.object,
  ValidationRequired: PropTypes.bool,
  hintText: PropTypes.string,
  label: PropTypes.bool,
  info: PropTypes.bool,
  charCount: PropTypes.bool,
  innerLabel: PropTypes.bool,
  helpText: PropTypes.bool,
};

TextArea.defaultProps = {
  inputRef: undefined,
  onChange: undefined,
};

export default TextArea;
