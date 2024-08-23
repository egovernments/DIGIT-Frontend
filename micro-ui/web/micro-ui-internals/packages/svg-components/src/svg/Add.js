import React from "react";
import PropTypes from "prop-types";

export const Add = ({
  className = "",
  width = "24",
  height = "24",
  style = {},
  fill = "#0B0C0C",
  onClick = null,
  ...props
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      className={className}
      style={style}
      onClick={onClick}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24ZM10.7368 10.7368V4H13.2632V10.7368H20V13.2632H13.2632V20H10.7368V13.2632H4V10.7368H10.7368Z"
        fill={fill}
      />
    </svg>
  );
};

Add.propTypes = {
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
