import React from "react";
import PropTypes from "prop-types";
import { COLOR_FILL } from "./constants";

export const UploadCloud = ({ className, height = "40", width = "40", style = {}, fill = COLOR_FILL, onClick = null }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      className={className}
      onClick={onClick}
      style={style}
      viewBox="0 0 40 40"
      fill="none"
    >
      <mask id="mask0_353_14553" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="40" height="40">
        <rect width="40" height="40" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_353_14553)">
        <path
          d="M10.8334 33.3337C8.30564 33.3337 6.14592 32.4587 4.35425 30.7087C2.56258 28.9587 1.66675 26.8198 1.66675 24.292C1.66675 22.1253 2.31953 20.1948 3.62508 18.5003C4.93064 16.8059 6.63897 15.7225 8.75008 15.2503C9.44453 12.6948 10.8334 10.6253 12.9167 9.04199C15.0001 7.45866 17.3612 6.66699 20.0001 6.66699C23.2501 6.66699 26.007 7.79894 28.2709 10.0628C30.5348 12.3267 31.6667 15.0837 31.6667 18.3337C33.5834 18.5559 35.1737 19.3823 36.4376 20.8128C37.7015 22.2434 38.3334 23.917 38.3334 25.8337C38.3334 27.917 37.6042 29.6878 36.1459 31.1462C34.6876 32.6045 32.9167 33.3337 30.8334 33.3337H21.6667C20.7501 33.3337 19.9654 33.0073 19.3126 32.3545C18.6598 31.7017 18.3334 30.917 18.3334 30.0003V21.417L15.6667 24.0003L13.3334 21.667L20.0001 15.0003L26.6667 21.667L24.3334 24.0003L21.6667 21.417V30.0003H30.8334C32.0001 30.0003 32.9862 29.5975 33.7917 28.792C34.5973 27.9864 35.0001 27.0003 35.0001 25.8337C35.0001 24.667 34.5973 23.6809 33.7917 22.8753C32.9862 22.0698 32.0001 21.667 30.8334 21.667H28.3334V18.3337C28.3334 16.0281 27.5209 14.0628 25.8959 12.4378C24.2709 10.8128 22.3056 10.0003 20.0001 10.0003C17.6945 10.0003 15.7292 10.8128 14.1042 12.4378C12.4792 14.0628 11.6667 16.0281 11.6667 18.3337H10.8334C9.2223 18.3337 7.8473 18.9031 6.70842 20.042C5.56953 21.1809 5.00008 22.5559 5.00008 24.167C5.00008 25.7781 5.56953 27.1531 6.70842 28.292C7.8473 29.4309 9.2223 30.0003 10.8334 30.0003H15.0001V33.3337H10.8334Z"
          fill={fill}
        />
      </g>
    </svg>
  );
};

UploadCloud.propTypes = {
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
