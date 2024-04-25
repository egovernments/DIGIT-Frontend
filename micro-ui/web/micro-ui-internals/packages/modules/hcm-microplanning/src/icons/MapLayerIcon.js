import React from "react";
import PropTypes from "prop-types";

export const MapLayerIcon = ({ className, width = "24", height = "27", style = {}, fill = "white", onClick = null }) => {
  return (
    <svg
      width={width}
      height={height}
      className={className}
      onClick={onClick}
      style={style}
      viewBox="0 0 22 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.9867 22.7213L2.16 15.0813L0 16.7613L12 26.0946L24 16.7613L21.8267 15.068L11.9867 22.7213ZM12 19.3346L21.8133 11.6946L24 10.0013L12 0.667969L0 10.0013L2.17333 11.6946L12 19.3346Z"
        fill={fill}
      />
    </svg>
  );
};


MapLayerIcon.propTypes = {
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
