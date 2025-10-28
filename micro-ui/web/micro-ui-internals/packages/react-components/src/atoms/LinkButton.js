import React from "react";
import PropTypes from "prop-types";

const LinkButton = (props) => {
  const fieldId = props?.id||Digit?.Utils?.getFieldIdName?.( props?.label || props?.className || "button")||"NA";
  return (
    <span className={`card-link cp ${props.className}`} onClick={props.onClick} style={props.style}       id={fieldId} >
      {props.label}
    </span>
  );
};

LinkButton.propTypes = {
  /**
   * LinkButton contents
   */
  label: PropTypes.any,
  /**
   * Optional click handler
   */
  onClick: PropTypes.func,
};

LinkButton.defaultProps = {};

export default LinkButton;
