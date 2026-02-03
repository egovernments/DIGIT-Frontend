import React from "react";
import PropTypes from "prop-types";
import { COLOR_FILL } from "./constants";

export const Population = ({ className, width = "40", height = "46", style = {}, fill = COLOR_FILL, onClick = null }) => {
  return (
    <svg width={width} height={height} className={className} onClick={onClick} style={style} viewBox="0 0 32 27" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.9997 0.5C18.0699 0.5 19.7467 2.1356 19.7467 4.15442C19.7467 6.17349 18.0702 7.80883 15.9997 7.80883C13.9298 7.80883 12.2533 6.17373 12.2533 4.15442C12.2533 2.1356 13.9298 0.5 15.9997 0.5ZM6.36438 0.5C8.43458 0.5 10.1113 2.1356 10.1113 4.15442C10.1113 6.17349 8.43483 7.80883 6.36438 7.80883C4.29444 7.80883 2.61793 6.17373 2.61793 4.15442C2.61793 2.1356 4.29444 0.5 6.36438 0.5ZM10.178 17.5607V26.4994H2.55385V16.4281H0.5V13.0096C0.5 10.651 2.47417 8.72564 4.89249 8.72564H7.83697C8.75633 8.72564 9.61452 9.00528 10.3214 9.47954C9.48153 10.4281 8.97394 11.6619 8.97394 13.0096V17.5602H10.178L10.178 17.5607ZM25.6354 0.5C27.7053 0.5 29.3818 2.1356 29.3818 4.15442C29.3818 6.17349 27.7053 7.80883 25.6354 7.80883C23.5652 7.80883 21.8884 6.17373 21.8884 4.15442C21.8884 2.1356 23.5649 0.5 25.6354 0.5ZM29.4484 16.4288V26.5H21.825V17.5613H23.0261V13.0107C23.0261 11.663 22.5182 10.4295 21.6786 9.48065C22.3855 9.00637 23.2437 8.72675 24.163 8.72675H27.1075C29.5258 8.72675 31.5 10.6522 31.5 13.0107V16.4293H29.4486L29.4484 16.4288ZM19.8131 16.4288V26.5H12.1896V16.4288H10.1352V13.0103C10.1352 10.6517 12.1094 8.72626 14.5277 8.72626H17.4722C19.8905 8.72626 21.8647 10.6517 21.8647 13.0103V16.4288H19.8131Z"
        fill={fill}
      />
    </svg>
  );
};



Population.propTypes = {
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
