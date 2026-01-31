import React from "react";
import PropTypes from "prop-types";
import { COLOR_FILL } from "./constants";

export const BarsChart = ({ className, width = "24", height = "24", style = {}, fill = COLOR_FILL, onClick = null }) => {
    return (
        <svg width={width} height={height} className={className} onClick={onClick} style={style} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 18V16H20V18H0ZM1 15V8H4V15H1ZM6 15V3H9V15H6ZM11 15V6H14V15H11ZM16 15V0H19V15H16Z" fill={fill}/>
        </svg>
    );
};



BarsChart.propTypes = {
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
