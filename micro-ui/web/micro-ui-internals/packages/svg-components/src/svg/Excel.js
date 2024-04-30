import React from "react";
import PropTypes from "prop-types";
import { COLOR_FILL } from "./constants";

export const Excel = ({ className, width = "24", height = "24", style = {}, fill = COLOR_FILL, onClick = null }) => {
  return (
    <svg width={width} height={height} className={className} onClick={onClick} style={style} viewBox="0 0 63 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.5 0V14H0.5V50H10.5V60H62.5V0H10.5ZM10.5 24H15.8L18.5 28L21.2 24H26.5L21.2 32L26.5 40H21.2L18.5 36L15.8 40H10.5L15.8 32L10.5 24ZM58.5 56H14.5V50H36.5V38H52.5V34H36.5V30H52.5V26H36.5V22H52.5V18H36.5V14H14.5V4H58.5V56Z"
        fill={fill}
      />
    </svg>
  );
};


Excel.propTypes = {
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
