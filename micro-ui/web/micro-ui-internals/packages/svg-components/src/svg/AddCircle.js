import React from "react";
import PropTypes from "prop-types";

export const AddCircle = ({ className = "", width = "24", height = "24", style = {}, fill = "#e8eaed", onClick = null, ...props }) => {
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
        d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"
        fill={fill}
      />
    </svg>
  );
};

AddCircle.propTypes = {
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
