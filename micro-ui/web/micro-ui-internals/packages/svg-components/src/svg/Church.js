import React from "react";
import PropTypes from "prop-types";
import { COLOR_FILL } from "./constants";

export const Church = ({ className = "", fill = COLOR_FILL, fillBackground = "#064466", style = {}, width = "1.5rem", height = "1.5rem", onClick=null}) => {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={style} className={className} onClick={onClick}>
      <rect x="0.5" y="0.5" width={width} height={height} rx="3.5" fill={fillBackground} stroke="#D6D5D4" />
      <g clipPath="url(#clip0_6391_89292)">
        <path
          d="M12.0942 10.9979C12.3785 10.9984 12.6549 11.0897 12.8813 11.2578L15.0118 12.847V11.217C15.0118 11.084 14.961 10.9559 14.8694 10.8577L12.6443 8.4715V6.52864H14.1296V5.4525H12.6443V4H11.544V5.4525H10.0588V6.52864H11.544V8.4715L9.3189 10.8577C9.22729 10.9559 9.17651 11.084 9.17651 11.217V12.8471L11.307 11.2579C11.5334 11.0897 11.8098 10.9984 12.0942 10.9979Z"
          fill={fill}
        />
        <path
          d="M18.3674 13.4594L12.1162 8.69158C12.0828 8.66613 12.042 8.65234 12 8.65234C11.9581 8.65234 11.9172 8.66613 11.8839 8.69158L5.63265 13.4594C5.60929 13.4772 5.59211 13.5019 5.58353 13.53C5.57494 13.5581 5.57538 13.5881 5.58478 13.616C5.59418 13.6438 5.61207 13.668 5.63593 13.6851C5.65979 13.7022 5.68842 13.7114 5.71779 13.7114H6.84855V20.0009H10.1185V16.0352C10.1185 15.2027 10.9609 14.3397 12 14.3397C13.0391 14.3397 13.8815 15.2028 13.8815 16.0352V20.0009H17.1515V13.7114H18.2822C18.3116 13.7114 18.3402 13.7022 18.3641 13.6851C18.388 13.668 18.4059 13.6438 18.4153 13.616C18.4247 13.5881 18.4251 13.5581 18.4165 13.53C18.4079 13.5019 18.3907 13.4772 18.3674 13.4594Z"
          fill={fill}
        />
      </g>
      <defs>
        <clipPath id="clip0_6391_89292">
          <rect width="16" height="16" fill={fill} transform="translate(4 4)" />
        </clipPath>
      </defs>
    </svg>
  );
};

Church.propTypes = {
  /** custom width of the svg icon */
  width: PropTypes.string,
  /** custom height of the svg icon */
  height: PropTypes.string,
  /** custom colour of the svg icon */
  fill: PropTypes.string,
  /** custom colour of the svg icon */
  fillBackground: PropTypes.string,
  /** custom class of the svg icon */
  className: PropTypes.string,
  /** custom style of the svg icon */
  style: PropTypes.object,
  /** Click Event handler when icon is clicked */
  onClick: PropTypes.func,
};
