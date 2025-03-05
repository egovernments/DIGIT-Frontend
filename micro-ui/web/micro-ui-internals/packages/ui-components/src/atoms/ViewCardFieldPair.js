import React from "react";
import PropTypes from "prop-types";

const ViewCardFieldPair = ({ label, value, inline, className, style }) => {
    return (
      <div style={style} className={`digit-viewcard-field-pair ${className || ""} ${inline ? "inline" : ""}`}>
        <div className="digit-viewcard-label">{label}</div>
        <div className="digit-viewcard-value">{value}</div>
      </div>
    );
  };

  ViewCardFieldPair.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,  
    inline: PropTypes.bool,
    className: PropTypes.string, 
    style: PropTypes.object, 
};

export default ViewCardFieldPair;
