import React from "react";
import PropTypes from "prop-types";

export const OpenMicroplanSvg = ({
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
        d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H600v-80h160v-480H200v480h160v80H200Zm240 0v-246l-64 64-56-58 160-160 160 160-56 58-64-64v246h-80Z"
        fill={fill}
      />
    </svg>
  );
};

OpenMicroplanSvg.propTypes = {
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
