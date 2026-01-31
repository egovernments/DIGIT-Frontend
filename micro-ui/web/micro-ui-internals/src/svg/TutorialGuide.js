import React from "react";
import PropTypes from "prop-types";
import { COLOR_FILL } from "./constants";

export const TutorialGuide = ({ className, height = "24", width = "24", style = {}, fill = COLOR_FILL, onClick = null }) => {
  return (
   <svg width={width} height={height} viewBox="0 0 21 20" fill="none" className={className} style={style} onClick={onClick} xmlns="http://www.w3.org/2000/svg">
<path d="M10.6661 11.1833L16.1994 7.5L10.6661 3.81675V11.1833ZM14.1161 17.0333H18.0326C17.9938 17.4111 17.841 17.725 17.5744 17.975C17.3077 18.225 16.9772 18.3722 16.5829 18.4167L3.94938 19.9417C3.48821 20.0028 3.07571 19.8958 2.71188 19.6208C2.34805 19.3458 2.1383 18.9778 2.08263 18.5168L0.57438 6.575C0.51888 6.11383 0.63038 5.70017 0.90888 5.334C1.18738 4.96767 1.55646 4.75633 2.01613 4.7L3.46613 4.53325V6.21675L2.21613 6.35825L3.74938 18.3L14.1161 17.0333ZM6.79938 15.3668C6.34938 15.3668 5.95913 15.2014 5.62863 14.8707C5.29797 14.5402 5.13263 14.15 5.13263 13.7V1.66675C5.13263 1.21675 5.29797 0.826417 5.62863 0.49575C5.95913 0.16525 6.34938 0 6.79938 0H18.8326C19.2826 0 19.673 0.16525 20.0036 0.49575C20.3341 0.826417 20.4994 1.21675 20.4994 1.66675V13.7C20.4994 14.15 20.3341 14.5402 20.0036 14.8707C19.673 15.2014 19.2826 15.3668 18.8326 15.3668H6.79938ZM6.79938 13.7H18.8326V1.66675H6.79938V13.7Z" fill={fill}/>
</svg>

  );
};


TutorialGuide.propTypes = {
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
