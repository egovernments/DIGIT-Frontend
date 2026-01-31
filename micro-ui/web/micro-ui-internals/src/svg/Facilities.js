import React from "react";
import PropTypes from "prop-types";
import { COLOR_FILL } from "./constants";

export const Facilities = ({ className, width = "20", height = "27", style = {}, fill = COLOR_FILL, onClick = null }) => {
  return (
    <svg width={width} height={height} className={className} onClick={onClick} style={style} viewBox="0 0 20 27" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 0.375L0 9.125V26.625H6.25V16.4167H13.75V26.625H20V9.125L10 0.375Z"
        fill={fill}
      />
    </svg>
  );
};

Facilities.propTypes = {
  /** custom width of the svg icon */
  width: PropTypes.string,
  /** custom height of the svg icon */
  height: PropTypes.string,
  /** custom colour of the svg icon */
  fill: PropTypes.string,
  /** custom class of the svg icon */
  className: PropTypes.string,
  /** custom style of the svg icon */
  style: PropTypes.object,
  /** Click Event handler when icon is clicked */
  onClick: PropTypes.func,
};
