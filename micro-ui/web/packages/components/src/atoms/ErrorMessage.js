import React from "react";
import PropTypes from "prop-types";
import { SVG } from "./SVG";
import StringManipulator from "./StringManipulator";

const ErrorMessage = ({
  wrapperClassName = "",
  wrapperStyles = {},
  showIcon,
  iconStyles = {},
  message,
  className = "",
  style = {},
  truncateMessage,
  maxLength,
}) => {
  return (
    <div
      className={`digit-error-icon-message-wrap ${
        wrapperClassName ? wrapperClassName : ""
      }`}
      style={wrapperStyles}
    >
      {showIcon && (
        <div className="digit-error-icon" style={iconStyles}>
          <SVG.Info width="1rem" height="1rem" fill="#B91900" />
        </div>
      )}
      <div className={`digit-error-message ${className}`} style={style}>
        {truncateMessage
          ? StringManipulator(
              "TOSENTENCECASE",
              StringManipulator("TRUNCATESTRING", message, {
                maxLength: maxLength || 256,
              })
            )
          : StringManipulator("TOSENTENCECASE", message)}
      </div>
    </div>
  );
};

ErrorMessage.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  message: PropTypes.string,
  showIcon: PropTypes.bool,
  truncateMessage: PropTypes.bool,
};

export default ErrorMessage;
