import React from "react";
import PropTypes from "prop-types";

const Tooltip = ({ tooltipRef, content, placement, arrow, style, className,header ,description,theme}) => {
  return (
    <div
      role="tooltip"
      aria-live="polite"
      tabIndex={0}
      className={`tooltip-content tooltip-${placement} ${
        arrow ? "with-arrow" : ""
      } ${theme || ""} ${className || ""}`}
      style={style}
      ref={tooltipRef}
    >
      {header && <div className={`tooltip-header ${theme || ""}`}>{header}</div>}
      {content && <div className={`tooltip-data ${theme || ""}`}>{content}</div>}
      {description && <div className={`tooltip-description ${theme || ""}`}>{description}</div>}
    </div>
  );
};

Tooltip.propTypes = {
  header:PropTypes.string,
  content: PropTypes.node.isRequired,
  description:PropTypes.string,
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
  theme: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
};

Tooltip.defaultProps = {
  arrow: true,
  placement: "bottom",
  theme:"dark"
};

export default Tooltip;
