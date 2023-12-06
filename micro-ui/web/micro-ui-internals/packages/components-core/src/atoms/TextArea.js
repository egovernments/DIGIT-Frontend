import React from "react";
import PropTypes from "prop-types";
import { SVG } from "./SVG";

const TextArea = (props) => {
  const user_type = window?.Digit?.SessionStorage.get("userType");


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
          if (props?.onChange) {
            props?.onChange(event);
          }
        }}
        className={`${user_type !== "citizen" ? "digit-employee-card-textarea" : "digit-card-textarea"} ${props?.className ? props?.className : ""
          } ${props.disabled ? "disabled" : ""
          } ${props.nonEditable ? "noneditable" : ""} ${props.error ? "error" : ""}`}
        minLength={props.minlength}
        maxLength={props.maxlength}
        autoComplete="off"
        disabled={props.disabled}
        nonEditable={props.nonEditable}
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
  nonEditable: PropTypes.bool,
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
  error:PropTypes.string
};

TextArea.defaultProps = {
  inputRef: undefined,
  onChange: undefined,
};

export default TextArea;
