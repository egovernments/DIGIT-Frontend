import React from "react";
import PropTypes from "prop-types";
import { COLOR_FILL } from "./constants";

export const ListAltCheck = ({ className, height = "34", width = "32", style = {}, fill = COLOR_FILL, onClick = null }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      className={className}
      onClick={onClick}
      style={style}
      viewBox="0 0 34 32"
      fill="none"
    >
      <path
        d="M3.33333 26.6667V3.33333V22.25V18.7083V26.6667ZM3.33333 30C2.41667 30 1.63194 29.6736 0.979167 29.0208C0.326389 28.3681 0 27.5833 0 26.6667V3.33333C0 2.41667 0.326389 1.63194 0.979167 0.979167C1.63194 0.326389 2.41667 0 3.33333 0H26.6667C27.5833 0 28.3681 0.326389 29.0208 0.979167C29.6736 1.63194 30 2.41667 30 3.33333V16.6667H26.6667V3.33333H3.33333V26.6667H15V30H3.33333ZM23.9167 31.6667L18 25.75L20.375 23.4167L23.9167 26.9583L31 19.875L33.3333 22.25L23.9167 31.6667ZM8.33333 16.6667C8.80556 16.6667 9.20139 16.5069 9.52083 16.1875C9.84028 15.8681 10 15.4722 10 15C10 14.5278 9.84028 14.1319 9.52083 13.8125C9.20139 13.4931 8.80556 13.3333 8.33333 13.3333C7.86111 13.3333 7.46528 13.4931 7.14583 13.8125C6.82639 14.1319 6.66667 14.5278 6.66667 15C6.66667 15.4722 6.82639 15.8681 7.14583 16.1875C7.46528 16.5069 7.86111 16.6667 8.33333 16.6667ZM8.33333 10C8.80556 10 9.20139 9.84028 9.52083 9.52083C9.84028 9.20139 10 8.80556 10 8.33333C10 7.86111 9.84028 7.46528 9.52083 7.14583C9.20139 6.82639 8.80556 6.66667 8.33333 6.66667C7.86111 6.66667 7.46528 6.82639 7.14583 7.14583C6.82639 7.46528 6.66667 7.86111 6.66667 8.33333C6.66667 8.80556 6.82639 9.20139 7.14583 9.52083C7.46528 9.84028 7.86111 10 8.33333 10ZM13.3333 16.6667H23.3333V13.3333H13.3333V16.6667ZM13.3333 10H23.3333V6.66667H13.3333V10Z"
        fill={fill}
      />
    </svg>
  );
};

ListAltCheck.propTypes = {
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
