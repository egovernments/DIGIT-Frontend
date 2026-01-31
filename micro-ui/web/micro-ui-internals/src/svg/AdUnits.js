import React from "react";
import PropTypes from "prop-types";
import { COLOR_FILL } from "./constants";

export const AdUnits = ({ className, height = "38", width = "24", style = {}, fill = COLOR_FILL, onClick = null }) => {
  return (
    <svg
      width={width}
      height={height}
      className={className}
      onClick={onClick}
      style={style}
      viewBox="0 0 24 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.33325 14.0003V10.667H18.6666V14.0003H5.33325ZM3.66659 37.3337C2.74992 37.3337 1.9652 37.0073 1.31242 36.3545C0.659641 35.7017 0.333252 34.917 0.333252 34.0003V4.00033C0.333252 3.08366 0.659641 2.29894 1.31242 1.64616C1.9652 0.993381 2.74992 0.666992 3.66659 0.666992H20.3333C21.2499 0.666992 22.0346 0.993381 22.6874 1.64616C23.3402 2.29894 23.6666 3.08366 23.6666 4.00033V34.0003C23.6666 34.917 23.3402 35.7017 22.6874 36.3545C22.0346 37.0073 21.2499 37.3337 20.3333 37.3337H3.66659ZM3.66659 32.3337V34.0003H20.3333V32.3337H3.66659ZM3.66659 29.0003H20.3333V9.00033H3.66659V29.0003ZM3.66659 5.66699H20.3333V4.00033H3.66659V5.66699Z"
        fill={fill}
      />
    </svg>
  );
};

AdUnits.propTypes = {
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
