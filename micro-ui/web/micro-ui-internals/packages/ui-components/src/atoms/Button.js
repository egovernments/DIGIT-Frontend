import React from "react";
import PropTypes from "prop-types";
import StringManipulator from "./StringManipulator";

const Button = (props) => {
  
  //To render the icon
  const IconRender = () => {
    const iconFill =
      props?.variation === "primary"
        ? "#FFFFFF"
        : props?.isDisabled
        ? "#C5C5C5"
        : "#C84C0E";
    const iconReq = props?.icon;
    let width, height;

    if (props.size === "large") {
        width = props.variation === "link" ? "1.25rem" : "1.5rem";
        height = props.variation === "link" ? "1.25rem" : "1.5rem";
    } else if (props.size === "medium") {
        width = "1.25rem";
        height = "1.25rem";
    } else if (props.size === "small") {
        width = "0.875rem";
        height = "0.875rem";
    }else{
      width = "1.5rem";
      height ="1.5rem";
    }
    
    try {
      const components = require("@egovernments/digit-ui-svg-components");
      const DynamicIcon = components?.[iconReq];
      if (DynamicIcon) {
        const svgElement = DynamicIcon({
          width: width,
          height: height,
          fill: iconFill,
          className: `digit-button-customIcon ${props?.size ? props?.size : ""} ${props?.variation ? props?.variation : ""} `
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
  };

  const icon = IconRender();

  const formattedLabel =
    props?.variation === "link"
      ? props?.label
      : StringManipulator(
          "CAPITALIZEFIRSTLETTER",
          StringManipulator("TRUNCATESTRING", props?.label, {
            maxLength: 64,
          })
        );

  return (
    <button
      ref={props?.ref}
      className={`digit-button-${
        props?.variation ? props?.variation : "default"
      } ${props?.size ? props?.size : "large"} ${props?.className ? props?.className : ""} ${
        props?.isDisabled ? "disabled" : ""
      }`}
      type={props?.submit ? "submit" : props.type || "button"}
      form={props.formId}
      onClick={props.onClick}
      disabled={props?.isDisabled || null}
      style={props.style ? props.style : null}
    >
      <div
        className={`icon-label-container ${
          props?.variation ? props?.variation : ""
        } ${
          props?.size ? props?.size : ""
        }`}
      >
        {!props?.isSuffix && props?.icon && icon}
        <h2 style={{ ...props?.textStyles }} className="digit-button-label">
          {formattedLabel}
        </h2>
        {props?.isSuffix && props?.icon && icon}
      </div>
    </button>
  );
};

Button.propTypes = {
  isDisabled: PropTypes.bool,
  /**
   * ButtonSelector content
   */
  label: PropTypes.string.isRequired,
  /**
   * button border theme
   */
  variation: PropTypes.string,
  /**
   * button icon if any
   */
  icon: PropTypes.string,
  /**
   * click handler
   */
  onClick: PropTypes.func.isRequired,
  /**
   * Custom classname
   */
  className: PropTypes.string,
  /**
   * Custom styles
   */
  style: PropTypes.object,
  /**
   * Custom label style or h2 style
   */
  textStyles: PropTypes.object,
  /**
   * button icon position
   */
  isSuffix: PropTypes.bool,
      /**
   * button size 
   */
  size: PropTypes.string,
};

Button.defaultProps = {
  label: "TEST",
  variation: "primary",
  onClick: () => {},
  size:"large"
};

export default Button;
