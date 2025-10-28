import React from "react";
import PropTypes from "prop-types";
import { COLOR_FILL } from "./constants";

export const Warehouse = ({ className = "", fill = COLOR_FILL, fillBackground = "#42BBFF", style = {}, width = "1.5rem", height = "1.5rem", onClick=null}) => {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={style} className={className} onClick={onClick}>
      <rect x="0.5" y="0.5" width="23" height="23" rx="3.5" fill={fillBackground} stroke="#D6D5D4" />
      <g clipPath="url(#clip0_6391_89286)">
        <path d="M12.0001 6L6.66675 10V18H10.0001V13.3333H14.0001V18H17.3334V10L12.0001 6Z" fill={fill} />
      </g>
      <defs>
        <clipPath id="clip0_6391_89286">
          <rect width="16" height="16" fill={fill} transform="translate(4 4)" />
        </clipPath>
      </defs>
    </svg>
  );
};


Warehouse.propTypes = {
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
