import React from "react";
import PropTypes from "prop-types";

const Tooltip = ({ tooltipRef, title, placement, arrow, style, className }) => {
  return (
    <div
      className={`tooltip-content tooltip-${placement} ${
        arrow ? "with-arrow" : ""
      } ${className || ""}`}
      style={style}
      ref={tooltipRef}
    >
      {title}
    </div>
  );
};

Tooltip.propTypes = {
  title: PropTypes.node.isRequired,
  placement: PropTypes.oneOf([
    "bottom",
    "bottom-end",
    "bottom-start",
    "left",
    "right",
    "top",
    "top-end",
    "top-start",
    "left-end",
    "left-start",
    "right-end",
    "right-start",
  ]),
  arrow: PropTypes.bool,
  style: PropTypes.object,
  className: PropTypes.string,
};

Tooltip.defaultProps = {
  arrow: true,
  placement: "bottom",
};

export default Tooltip;