import React from "react";
import PropTypes from "prop-types";
import { COLOR_FILL } from "./constants";

export const OutpatientMed = ({ className, height = "30", width = "38", style = {}, fill = COLOR_FILL, onClick = null }) => {
  return (
    <svg
      width={width}
      height={height}
      className={className}
      onClick={onClick}
      style={style}
      viewBox="0 0 38 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M31.5001 20.8333L29.1251 18.5L30.9584 16.6667H25.6667V13.3333H30.9167L29.1251 11.5417L31.5001 9.16667L37.3334 15L31.5001 20.8333ZM2.33341 3.33333V0H22.3334V3.33333H2.33341ZM9.83342 24.1667H14.8334V20H19.0001V15H14.8334V10.8333H9.83342V15H5.66675V20H9.83342V24.1667ZM4.00008 30C3.08341 30 2.29869 29.6736 1.64591 29.0208C0.993137 28.3681 0.666748 27.5833 0.666748 26.6667V8.33333C0.666748 7.41667 0.993137 6.63194 1.64591 5.97917C2.29869 5.32639 3.08341 5 4.00008 5H20.6667C21.5834 5 22.3681 5.32639 23.0209 5.97917C23.6737 6.63194 24.0001 7.41667 24.0001 8.33333V26.6667C24.0001 27.5833 23.6737 28.3681 23.0209 29.0208C22.3681 29.6736 21.5834 30 20.6667 30H4.00008ZM4.00008 26.6667H20.6667V8.33333H4.00008V26.6667Z"
        fill={fill}
      />
    </svg>
  );
};

OutpatientMed.propTypes = {
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
