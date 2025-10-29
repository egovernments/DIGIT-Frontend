import React from "react";
import PropTypes from "prop-types";
import { COLOR_FILL } from "./constants";

export const HealthFacility = ({ className = "", fill = COLOR_FILL, fillBackground = "#0C9219", style = {}, width = "1.5rem", height = "1.5rem" , onClick=null}) => {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={style} className={className} onClick={onClick}>
      <rect x="0.5" y="0.5" width={width} height={height} rx="3.5" fill={fillBackground} stroke="#D6D5D4"/>
      <g clip-path="url(#clip0_7657_78223)">
      <path d="M16.6667 6H7.33333C6.6 6 6.00667 6.6 6.00667 7.33333L6 16.6667C6 17.4 6.6 18 7.33333 18H16.6667C17.4 18 18 17.4 18 16.6667V7.33333C18 6.6 17.4 6 16.6667 6ZM16 13.3333H13.3333V16H10.6667V13.3333H8V10.6667H10.6667V8H13.3333V10.6667H16V13.3333Z" 
      fill={fill}/>
      </g>
      <defs>
      <clipPath id="clip0_7657_78223">
      <rect width="16" height="16" fill={fill} transform="translate(4 4)"/>
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
