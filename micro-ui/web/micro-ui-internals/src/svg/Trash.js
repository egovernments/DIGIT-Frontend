import React from "react";
import PropTypes from "prop-types";
import { COLOR_FILL } from "./constants";

export const Trash = ({ className, height = "24", width = "24", style = {}, fill = COLOR_FILL, onClick = null }) => {
  return (
    <svg width={width} height={height} className={className} onClick={onClick} style={style} viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path 
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.43049 16C1.43049 17.1 2.37121 18 3.52097 18H11.8829C13.0327 18 13.9734 17.1 13.9734 16V4H1.43049V16ZM15.0186 1H11.3603L10.315 0H5.08884L4.04359 1H0.385254V3H15.0186V1Z"
        fill={fill}
      />
    </svg>
  );
};


Trash.propTypes = {
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
