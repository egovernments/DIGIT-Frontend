import React from "react";
import PropTypes from "prop-types";
import { SVG } from "./SVG";
import StringManipulator from "./StringManipulator";
import { getUserType } from "../utils/digitUtils";

const TextArea = (props) => {
  const user_type = getUserType();

  // Generate unique ID for tracking (single source of truth)
  // ID Pattern: screenPath + composerType + composerId + sectionId + name + type
  const fieldId = Digit?.Utils?.generateUniqueId?.({
    screenPath: props?.screenPath || "",
    composerType: props?.composerType || "standalone",
    composerId: props?.composerId || "",
    sectionId: props?.sectionId || "",
    name: props?.name || "textarea",
    type: "textarea",
    id: props?.id
  }) || props?.id || props?.name;

  function textAreaAdjust(event) {
    const element = event.target;
    const initialHeight = 6.25 * parseFloat(getComputedStyle(element).fontSize);
  
    element.style.height = "auto"; // Setting height to auto to get the natural height
    const contentHeight = element.scrollHeight;
    // Set the height only if the content height exceeds the initial height
    if (contentHeight > initialHeight) {
      element.style.height = `${contentHeight}px`;
    } else {
      element.style.height = `${initialHeight}px`;
    }
  }

  return (
    <React.Fragment>
      <textarea
        onInput={props.populators?.resizeSmart && textAreaAdjust}
        placeholder={StringManipulator("TOSENTENCECASE", props.placeholder)}
        name={props.name}
        ref={props.inputRef}
        style={props.style}
        id={fieldId}
        value={props.value}
        onChange={(event) => {
          if (props?.onChange) {
            props?.onChange(event);
          }
        }}
        className={`${
          user_type !== "citizen"
            ? "digit-employee-card-textarea-field"
            : "digit-card-textarea-field"
        } ${props?.className ? props?.className : ""} ${
          props.disabled ? "disabled" : ""
        } ${props.nonEditable ? "noneditable" : ""} ${
          props.error ? "error" : ""
        } ${props.populators?.resizeSmart ? "resize-smart" : ""}`}
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
  error: PropTypes.string,
  resizeSmart: PropTypes.bool,
};

TextArea.defaultProps = {
  inputRef: undefined,
  onChange: undefined,
  resizeSmart: false,
};

export default TextArea;
