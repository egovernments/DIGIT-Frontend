import React from "react";
import PropTypes from "prop-types";

export const Trash = ({ className, height = "24", width = "24", style = {}, fill = "#F47738", onClick = null }) => {
  return (
    <svg width={width} height={height} className={className} onClick={onClick} style={style} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_3587_31269)">
        <path
          d="M6.43049 19C6.43049 20.1 7.37121 21 8.52097 21H16.8829C18.0327 21 18.9734 20.1 18.9734 19V7H6.43049V19ZM20.0186 4H16.3603L15.315 3H10.0888L9.04359 4H5.38525V6H20.0186V4Z"
          fill={fill}
        />
      </g>
      <defs>
        <clipPath id="clip0_3587_31269">
          <rect width="24" height="24" fill="white" transform="translate(0.15918)"/>
        </clipPath>
      </defs>
    </svg>
  );
};



Trash.propTypes = {
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
