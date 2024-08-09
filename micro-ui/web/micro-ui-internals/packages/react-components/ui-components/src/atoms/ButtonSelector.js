import React from "react";
import PropTypes from "prop-types";

const ButtonSelector = (props) => {
  let theme = "digit-selector-button-primary";
  switch (props.theme) {
    case "border":
      theme = "digit-selector-button-border";
      break;
    default:
      theme = "digit-selector-button-primary";
      break;
  }
  return (
    <button
      className={props.isDisabled ? "digit-selector-button-primary-disabled" : theme}
      type={props.type || "submit"}
      form={props.formId}
      onClick={props.onSubmit}
      disabled={props.isDisabled}
      style={props.style ? props.style : null}
    >
      <h2 style={{ ...props?.textStyles, ...{ width: "100%" } }}>{props.label}</h2>
    </button>
  );
};

ButtonSelector.propTypes = {
  /**
   * ButtonSelector content
   */
  label: PropTypes.string.isRequired,
  /**
   * button border theme
   */
  theme: PropTypes.string,
  /**
   * click handler
   */
  onSubmit: PropTypes.func,
};

ButtonSelector.defaultProps = {
  label: "",
  theme: "",
  onSubmit: undefined,
};

export default ButtonSelector;
