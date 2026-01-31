import React from "react";
import PropTypes from "prop-types";

export const MeasurementMuktaIcon = ({
  className = "",
  height = "40",
  width = "40",
  style = {},
  fill = "#FFFFFF",
  onClick = null,
}) => {
  return (
    <svg
      width={width}
      height={height}
      onClick={onClick}
      className={className}
      style={style}
      viewBox="0 0 40 40"
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_9180_23766)">
        <path
          d="M35.0013 8.33333C33.1513 7.75 31.118 7.5 29.168 7.5C25.918 7.5 22.418 8.16667 20.0013 10C17.5846 8.16667 14.0846 7.5 10.8346 7.5C7.58463 7.5 4.08464 8.16667 1.66797 10V34.4167C1.66797 34.8333 2.08464 35.25 2.5013 35.25C2.66797 35.25 2.7513 35.1667 2.91797 35.1667C5.16797 34.0833 8.41797 33.3333 10.8346 33.3333C14.0846 33.3333 17.5846 34 20.0013 35.8333C22.2513 34.4167 26.3346 33.3333 29.168 33.3333C31.918 33.3333 34.7513 33.8333 37.0846 35.0833C37.2513 35.1667 37.3346 35.1667 37.5013 35.1667C37.918 35.1667 38.3346 34.75 38.3346 34.3333V10C37.3346 9.25 36.2513 8.75 35.0013 8.33333ZM35.0013 30.8333C33.168 30.25 31.168 30 29.168 30C26.3346 30 22.2513 31.0833 20.0013 32.5V13.3333C22.2513 11.9167 26.3346 10.8333 29.168 10.8333C31.168 10.8333 33.168 11.0833 35.0013 11.6667V30.8333Z"
          fill={fill}
        />
        <path
          d="M29.168 17.5C30.6346 17.5 32.0513 17.65 33.3346 17.9333V15.4C32.018 15.15 30.6013 15 29.168 15C26.3346 15 23.768 15.4833 21.668 16.3833V19.15C23.5513 18.0833 26.168 17.5 29.168 17.5Z"
          fill={fill}
        />
      </g>
      <defs>
        <clipPath id="clip0_9180_23766">
          <rect width="40" height="40" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

MeasurementMuktaIcon.propTypes = {
  /** Custom width of the svg icon */
  width: PropTypes.string,
  /** Custom height of the svg icon */
  height: PropTypes.string,
  /** Custom color of the svg icon */
  fill: PropTypes.string,
  /** Custom class of the svg icon */
  className: PropTypes.string,
  /** Custom style of the svg icon */
  style: PropTypes.object,
  /** Click event handler for the icon */
  onClick: PropTypes.func,
};

MeasurementMuktaIcon.defaultProps = {
  fill: "#FFFFFF",
};
