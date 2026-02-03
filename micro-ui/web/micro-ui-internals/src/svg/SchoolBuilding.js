import React from "react";
import PropTypes from "prop-types";
import { COLOR_FILL } from "./constants";

export const SchoolBuilding = ({ className = "", fill = COLOR_FILL, fillBackground = "#FF7B42", style = {}, width = "1.5rem", height = "1.5rem", onClick=null }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={style} className={className} onClick={onClick}>
      <rect x="0.5" y="0.5" width={width} height={height} rx="3.5" fill={fillBackground} stroke="#D6D5D4" />
      <g clipPath="url(#clip0_6393_89315)">
        <g clip-path="url(#clip1_6393_89315)">
          <path
            d="M14 11.332V7.33203L12 5.33203L10 7.33203V8.66536H6V17.9987H18V11.332H14ZM8.66667 16.6654H7.33333V15.332H8.66667V16.6654ZM8.66667 13.9987H7.33333V12.6654H8.66667V13.9987ZM8.66667 11.332H7.33333V9.9987H8.66667V11.332ZM12.6667 16.6654H11.3333V15.332H12.6667V16.6654ZM12.6667 13.9987H11.3333V12.6654H12.6667V13.9987ZM12.6667 11.332H11.3333V9.9987H12.6667V11.332ZM12.6667 8.66536H11.3333V7.33203H12.6667V8.66536ZM16.6667 16.6654H15.3333V15.332H16.6667V16.6654ZM16.6667 13.9987H15.3333V12.6654H16.6667V13.9987Z"
            fill={fill}
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_6393_89315">
          <rect width="16" height="16" fill="white" transform="translate(4 4)" />
        </clipPath>
        <clipPath id="clip1_6393_89315">
          <rect width="16" height="16" fill={fill} transform="translate(4 4)" />
        </clipPath>
      </defs>
    </svg>
  );
};


SchoolBuilding.propTypes = {
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
