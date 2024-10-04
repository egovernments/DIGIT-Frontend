import React from "react";
import PropTypes from "prop-types";
import { COLOR_FILL } from "./constants";

export const ContractIcon = ({
  className = "",
  height = "27",
  width = "24",
  style = {},
  fill = COLOR_FILL,
  onClick = null,
}) => {
  return (
    <svg
      width={width}
      height={height}
      onClick={onClick}
      className={className}
      style={style}
      viewBox="0 0 24 27"
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21.3333 3.00065H15.76C15.2 1.45398 13.7333 0.333984 12 0.333984C10.2667 0.333984 8.8 1.45398 8.24 3.00065H2.66667C1.2 3.00065 0 4.20065 0 5.66732V24.334C0 25.8007 1.2 27.0007 2.66667 27.0007H21.3333C22.8 27.0007 24 25.8007 24 24.334V5.66732C24 4.20065 22.8 3.00065 21.3333 3.00065ZM12 3.00065C12.7333 3.00065 13.3333 3.60065 13.3333 4.33398C13.3333 5.06732 12.7333 5.66732 12 5.66732C11.2667 5.66732 10.6667 5.06732 10.6667 4.33398C10.6667 3.60065 11.2667 3.00065 12 3.00065Z"
        fill={fill}
      />
      <g clipPath="url(#clip0_1_3)">
        <path d="M14.9269 16.7879L13.3359 18.3789L17.8331 22.8761L19.4241 21.2851L14.9269 16.7879Z" fill="#0B4B66" />
        <path
          d="M16.1242 14.4996C17.5717 14.4996 18.7492 13.3221 18.7492 11.8746C18.7492 11.4396 18.6292 11.0346 18.4417 10.6746L16.4167 12.6996L15.2992 11.5821L17.3242 9.55711C16.9642 9.36961 16.5592 9.24961 16.1242 9.24961C14.6767 9.24961 13.4992 10.4271 13.4992 11.8746C13.4992 12.1821 13.5592 12.4746 13.6567 12.7446L12.2692 14.1321L10.9342 12.7971L11.4667 12.2646L10.4092 11.2071L11.9992 9.61711C11.1217 8.73961 9.69672 8.73961 8.81922 9.61711L6.16422 12.2721L7.22172 13.3296H5.10672L4.57422 13.8621L7.22922 16.5171L7.76172 15.9846V13.8621L8.81922 14.9196L9.35172 14.3871L10.6867 15.7221L5.12922 21.2796L6.71922 22.8696L15.2542 14.3421C15.5242 14.4396 15.8167 14.4996 16.1242 14.4996Z"
          fill="#0B4B66"
        />
      </g>
      <defs>
        <clipPath id="clip0_1_3">
          <rect width="18" height="18" fill="white" transform="translate(3 7)" />
        </clipPath>
      </defs>
    </svg>
  );
};

ContractIcon.propTypes = {
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

ContractIcon.defaultProps = {
  fill: COLOR_FILL,
};
