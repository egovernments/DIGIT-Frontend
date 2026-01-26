import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

const Switch = ({
  isLabelFirst = false,
  label = "",
  shapeOnOff = false,
  isCheckedInitially = false,
  onToggle = () => {},
  className,
  style,
  disable = false,
  switchStyle
}) => {
  const [isChecked, setIsChecked] = useState(isCheckedInitially);
  useEffect(() => {
    setIsChecked(isCheckedInitially);
  }, [isCheckedInitially]);

  const handleToggle = () => {
    if (!disable) {
      setIsChecked(!isChecked);
      onToggle(!isChecked);
    }
  };

  return (
    <div
      className={`digit-switch-container ${className || ""} ${
        disable ? "switch-disabled" : ""
      }`}
      style={style || {}}
    >
      {isLabelFirst && (
        <span className={`digit-switch-label ${"labelFirst"}`}>{label}</span>
      )}
      <div
        className={`digit-switch ${isChecked ? "checked" : ""} ${
          shapeOnOff ? "shape-onoff" : ""
        } ${disable ? "switch-disabled" : ""}`}
        onClick={handleToggle}
        tabIndex={0}
        style={switchStyle || {}}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleToggle();
          }
        }}
      >
        {shapeOnOff && isChecked && (
          <div className="digit-switch-shape-on"></div>
        )}
        <div className="digit-switch-toggle"></div>
        {shapeOnOff && !isChecked && (
          <div className="digit-switch-shape-off"></div>
        )}
      </div>
      {!isLabelFirst && (
        <span className={`digit-switch-label ${"labelLast"}`}>{label}</span>
      )}
    </div>
  );
};

export default Switch;

Switch.propTypes = {
  isLabelFirst: PropTypes.bool,
  label: PropTypes.string,
  shapeOnOff: PropTypes.bool,
  isCheckedInitially: PropTypes.bool,
  onToggle: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
  switchStyle: PropTypes.object,
  disable: PropTypes.bool,
};
