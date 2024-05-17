import React from "react";
import PropTypes from "prop-types";
import { COLOR_FILL } from "./constants";

export const HealthFacility = ({ className = "", fill = COLOR_FILL, fillBackground = "#FF7B42", style = {}, width = "1.5rem", height = "1.5rem" , onClick=null}) => {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={style} className={className} onClick={onClick}>
      <rect x="0.5" y="0.5" width={width} height={height} rx="3.5" fill={fillBackground} stroke="#D6D5D4" />
      <g clip-path="url(#clip0_6393_89340)">
        <path
          d="M12.6667 2H3.33333C2.6 2 2.00667 2.6 2.00667 3.33333L2 12.6667C2 13.4 2.6 14 3.33333 14H12.6667C13.4 14 14 13.4 14 12.6667V3.33333C14 2.6 13.4 2 12.6667 2ZM12 9.33333H9.33333V12H6.66667V9.33333H4V6.66667H6.66667V4H9.33333V6.66667H12V9.33333Z"
          fill={fill}
        />
      </g>
      <defs>
        <clipPath id="clip0_6393_89340">
          <rect width="16" height="16" fill={fill} transform="translate(4 4)" />
        </clipPath>
      </defs>
    </svg>
  );
};


HealthFacility.propTypes = {
  /** custom width of the svg icon */
  width: PropTypes.string,
  /** custom height of the svg icon */
  height: PropTypes.string,
  /** custom colour of the svg icon */
  fill: PropTypes.string,
  /** custom colour of the svg icon */
  fillBackground: PropTypes.string,
  /** custom class of the svg icon */
  className: PropTypes.string,
  /** custom style of the svg icon */
  style: PropTypes.object,
  /** Click Event handler when icon is clicked */
  onClick: PropTypes.func,
};
