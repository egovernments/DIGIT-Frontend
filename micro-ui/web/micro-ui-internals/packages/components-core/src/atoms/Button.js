import React from "react";
import PropTypes from "prop-types";

const Button = (props) => {
  const IconRender = () => {
    const iconFill = props?.variation === "primary" ? "#FFFFFF" : (props?.isDisabled ? "#B1B4B6":"#F47738");
    const iconReq = props?.icon;
    try {
      const components = require("@egovernments/digit-ui-react-components");
      const DynamicIcon = components?.SVG[iconReq] || components?.[iconReq];
      if (DynamicIcon) {
        const svgElement = DynamicIcon({
          width: "1.5rem",
          height: "1.5rem",
          fill: iconFill,
          className: "digit-button-customIcon",
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

  return (
    <button
      ref={props?.ref}
      className={`digit-button-${props?.variation ? props?.variation : ""} ${props?.className ? props?.className : ""} ${
        props?.isDisabled ? "disabled" : ""
      }`}
      type={props?.submit ? "submit" : props.type || "button"}
      form={props.formId}
      onClick={props.onClick}
      disabled={props?.isDisabled || null}
      style={props.style ? props.style : null}
    >
      <div className="icon-label-container">
        {!props?.isSuffix && props?.icon && icon}
        <h2 style={{ ...props?.textStyles }} className="digit-button-label">
          {props.label}
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
};

Button.defaultProps = {
  label: "TEST",
  variation: "primary",
  onClick: () => {},
};

export default Button;
