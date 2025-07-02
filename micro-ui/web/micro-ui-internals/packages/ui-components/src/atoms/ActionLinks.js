import React from "react";
import PropTypes from "prop-types";

const ActionLinks = (props) => (
  <span className={`digit-action-links ${props?.className ? props?.className : ""}`} style={props?.style} onClick={props?.onClick}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        props?.onClick?.(e);
      }
    }}
    aria-label={props?.ariaLabel || "Action link"}
  >
    {props.children}
  </span>
);

ActionLinks.propTypes = {
  /** custom class of the svg icon */
  className: PropTypes.string,
  /** custom style of the svg icon */
  style: PropTypes.object,
  /** Click Event handler when icon is clicked */
  children: PropTypes.node,
};

export default ActionLinks;
