import React from "react";
import PropTypes from "prop-types";
import { useState } from "react";
import { SVG } from "./SVG";

const TextArea = (props) => {
  const user_type = window?.Digit?.SessionStorage.get("userType");


  const textareaClass = `${user_type !== "citizen" ? "digit-employee-card-textarea" : "digit-card-textarea"} ${props?.className ? props?.className : ""
    } ${props.disable ? "disabled" : ""
  }  ${props?.focused  ? "focused" : ""} ${props.noneditable  ? "noneditable" : ""} ${props?.errors?.errorMessage  ? "error" : ""}`

  return (
    <React.Fragment>
      <textarea
        placeholder={props.placeholder}
        name={props.name}
        ref={props.inputRef}
        style={props.style}
        id={props.id}
        value={props.value}
        onChange={(event) => {
        }}
        className={textareaClass}
        minLength={props.minlength}
        maxLength={props.maxlength}
        autoComplete="off"
        disabled={props.disable}
        focused={props.focused}
        noneditable={props.noneditable}
        pattern={props?.validation && props.ValidationRequired ? props?.validation?.pattern : props.pattern}
      ></textarea>
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
  noneditable: PropTypes.bool,
  focused:PropTypes.bool,
  minlength: PropTypes.number,
  maxlength: PropTypes.number,
  autoComplete: PropTypes.string,
  disabled: PropTypes.bool,
  pattern: PropTypes.string,
  validation: PropTypes.object,
  ValidationRequired: PropTypes.bool,
  hintText: PropTypes.string,
  charCount: PropTypes.bool,
  errors: PropTypes.object,
};

TextArea.defaultProps = {
  inputRef: undefined,
  onChange: undefined,
};

export default TextArea;
