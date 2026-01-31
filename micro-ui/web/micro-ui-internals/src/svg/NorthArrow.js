import React from "react";
import PropTypes from "prop-types";

export const NorthArrow = ({ className, width = "40", height = "40", style = {}, fill = "white", onClick = null }) => {
  return (
    <svg
      width={width}
      height={height}
      className={className}
      onClick={onClick}
      style={style}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path fillRule="evenodd" clipRule="evenodd" d="M20.5 25.1992L27 31.4492L20.5 6.44922V25.1992Z" fill={fill} />
      <path fillRule="evenodd" clipRule="evenodd" d="M20.5 6.44922L14 31.4492L20.5 25.1992V6.44922Z" fill={fill} />
      <circle cx="20" cy="20" r="19.5" stroke="white" />
    </svg>
  );
};

NorthArrow.propTypes = {
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
