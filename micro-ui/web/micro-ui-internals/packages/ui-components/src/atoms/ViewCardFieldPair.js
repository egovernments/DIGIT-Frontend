import React from "react";
import PropTypes from "prop-types";

const ViewCardFieldPair = ({ label, value, inline, className, style }) => {
  const labelId = React.useId();
  const valueId = React.useId();

  return (
    <div
      tabIndex={0}
      style={style}
      className={`digit-viewcard-field-pair ${className || ""} ${inline ? "inline" : ""}`}
      role="group"
      aria-labelledby={`${labelId} ${valueId}`} // references both label and value
    >
      <div id={labelId} className="digit-viewcard-label">
        {label}
      </div>
      <div id={valueId} className="digit-viewcard-value">
        {value}
      </div>
    </div>
  );
};

ViewCardFieldPair.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  inline: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default ViewCardFieldPair;
