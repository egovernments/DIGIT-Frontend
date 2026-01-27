import React from "react";
import PropTypes from "prop-types";
import { useButtonId } from "../hoc/ButtonIdentificationContext";

const ButtonSelector = (props) => {
  // Generate unique button ID using context-aware hook
  const { id: generatedId, dataAttributes } = useButtonId({
    explicitId: props?.id,
    buttonType: props?.type || "submit",
    buttonName: props?.name || "selector",
  });

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
      id={generatedId}
      className={props.isDisabled ? "digit-selector-button-primary-disabled" : theme}
      type={props.type || "submit"}
      form={props.formId}
      onClick={props.onSubmit}
      disabled={props.isDisabled}
      style={props.style ? props.style : null}
      {...dataAttributes}
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
  /**
   * Explicit ID for the button (optional - auto-generated if not provided)
   */
  id: PropTypes.string,
  /**
   * Semantic name for the button (used in auto-ID generation, not localized)
   */
  name: PropTypes.string,
};

ButtonSelector.defaultProps = {
  label: "",
  theme: "",
  onSubmit: undefined,
};

export default ButtonSelector;
