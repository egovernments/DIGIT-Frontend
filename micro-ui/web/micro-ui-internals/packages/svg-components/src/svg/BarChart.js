import React from "react";
import PropTypes from "prop-types";
import { COLOR_FILL } from "./constants";

export const BarChart = ({ className, width = "24", height = "24", style = {}, fill = COLOR_FILL, onClick = null }) => {
  return (
    <svg width={width} height={height} className={className} onClick={onClick} style={style} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.375 30.625H2.5V13.125H9.375V30.625ZM18.4375 4.375H11.5625V30.625H18.4375V4.375ZM27.5 16.0417H20.625V30.625H27.5V16.0417Z"
        fill={fill}
      />
    </svg>
  );
};



BarChart.propTypes = {
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
