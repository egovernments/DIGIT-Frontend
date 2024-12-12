import React from "react";
import PropTypes from "prop-types";

export const SetUpMicroplanSvg = ({
  className = "",
  width = "24",
  height = "24",
  style = {},
  fill = "#e8eaed",
  onClick = null,
  ...props
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 -960 960 960"
      className={className}
      style={style}
      onClick={onClick}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h240v80H200v560h560v-240h80v240q0 33-23.5 56.5T760-120H200Zm440-400v-120H520v-80h120v-120h80v120h120v80H720v120h-80Z"
        fill={fill}
      />
    </svg>
  );
};

SetUpMicroplanSvg.propTypes = {
  /** Custom width of the SVG icon */
  width: PropTypes.string,
  /** Custom height of the SVG icon */
  height: PropTypes.string,
  /** Custom color of the SVG icon */
  fill: PropTypes.string,
  /** Custom class of the SVG icon */
  className: PropTypes.string,
  /** Custom style of the SVG icon */
  style: PropTypes.object,
  /** Click event handler when icon is clicked */
  onClick: PropTypes.func,
};