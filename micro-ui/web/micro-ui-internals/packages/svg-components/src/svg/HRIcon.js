import React from "react";
import PropTypes from "prop-types";
import { COLOR_FILL } from "./constants";

export const HRIcon = ({
  className = "",
  height = "28",
  width = "28",
  style = {},
  fill = COLOR_FILL,
  onClick = null,
}) => {
  return (
    <svg
      width={width}
      height={height}
      onClick={onClick}
      className={className}
      style={style}
      viewBox="0 0 28 28"
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.33464 6.00033H0.667969V24.667C0.667969 26.1337 1.86797 27.3337 3.33464 27.3337H22.0013V24.667H3.33464V6.00033ZM24.668 0.666992H8.66797C7.2013 0.666992 6.0013 1.86699 6.0013 3.33366V19.3337C6.0013 20.8003 7.2013 22.0003 8.66797 22.0003H24.668C26.1346 22.0003 27.3346 20.8003 27.3346 19.3337V3.33366C27.3346 1.86699 26.1346 0.666992 24.668 0.666992ZM16.668 3.33366C18.8813 3.33366 20.668 5.12033 20.668 7.33366C20.668 9.54699 18.8813 11.3337 16.668 11.3337C14.4546 11.3337 12.668 9.54699 12.668 7.33366C12.668 5.12033 14.4546 3.33366 16.668 3.33366ZM24.668 19.3337H8.66797V17.3337C8.66797 14.6803 14.0013 13.3337 16.668 13.3337C19.3346 13.3337 24.668 14.6803 24.668 17.3337V19.3337Z"
        fill={fill}
      />
    </svg>
  );
};

HRIcon.propTypes = {
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

HRIcon.defaultProps = {
  fill: COLOR_FILL,
};
