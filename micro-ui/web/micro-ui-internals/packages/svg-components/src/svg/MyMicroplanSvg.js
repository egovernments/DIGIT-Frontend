import React from "react";
import PropTypes from "prop-types";

export const MyMicroplanSvg = ({ className = "", width = "24", height = "24", style = {}, fill = "#e8eaed", onClick = null, ...props }) => {
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
        d="M80-160v-160h160v160H80Zm240 0v-160h560v160H320ZM80-400v-160h160v160H80Zm240 0v-160h560v160H320ZM80-640v-160h160v160H80Zm240 0v-160h560v160H320Z"
        fill={fill}
      />
    </svg>
  );
};

MyMicroplanSvg.propTypes = {
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
