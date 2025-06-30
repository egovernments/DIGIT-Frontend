import React from "react";
import PropTypes from "prop-types";
import { COLOR_FILL } from "./constants";

export const MobileWrench = ({ className, height = "24", width = "24", style = {}, fill = COLOR_FILL, onClick = null }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      className={className}
      onClick={onClick}
      style={style}
      viewBox="0 0 24 24"
      fill= {fill}
    >
      <path
        d="M7 23C6.45 23 5.97917 22.8042 5.5875 22.4125C5.19583 22.0208 5 21.55 5 21V3C5 2.45 5.19583 1.97917 5.5875 1.5875C5.97917 1.19583 6.45 1 7 1H17C17.55 1 18.0208 1.19583 18.4125 1.5875C18.8042 1.97917 19 2.45 19 3V6.1C19.3 6.21667 19.5417 6.4 19.725 6.65C19.9083 6.9 20 7.18333 20 7.5V9.5C20 9.81667 19.9083 10.1 19.725 10.35C19.5417 10.6 19.3 10.7833 19 10.9V12H17V3H7V21H12V23H7ZM19.875 23L17.675 20.8C17.4917 20.8833 17.3 20.9375 17.1 20.9625C16.9 20.9875 16.7 21 16.5 21C15.5167 21 14.6875 20.6625 14.0125 19.9875C13.3375 19.3125 13 18.4917 13 17.525C13 17.225 13.0375 16.9333 13.1125 16.65C13.1875 16.3667 13.2917 16.1 13.425 15.85L15.8 18.225L17.2 16.8L14.825 14.45C15.075 14.3167 15.3417 14.2125 15.625 14.1375C15.9083 14.0625 16.2 14.025 16.5 14.025C17.4667 14.025 18.2917 14.3625 18.975 15.0375C19.6583 15.7125 20 16.5417 20 17.525C20 17.725 19.9833 17.925 19.95 18.125C19.9167 18.325 19.8583 18.5167 19.775 18.7L22 20.9L19.875 23ZM12 6C12.2833 6 12.5208 5.90417 12.7125 5.7125C12.9042 5.52083 13 5.28333 13 5C13 4.71667 12.9042 4.47917 12.7125 4.2875C12.5208 4.09583 12.2833 4 12 4C11.7167 4 11.4792 4.09583 11.2875 4.2875C11.0958 4.47917 11 4.71667 11 5C11 5.28333 11.0958 5.52083 11.2875 5.7125C11.4792 5.90417 11.7167 6 12 6Z"
        fill={fill}
      />
    </svg>
  );
};

MobileWrench.propTypes = {
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
