import React from "react";
import PropTypes from "prop-types";

export const FeatureSearch = ({ className, width = "21", height = "20", style = {}, fill = "#E65006", onClick = null }) => (
    <svg width={width} height={height} className={className} onClick={onClick} style={style} viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 11.25L18 13.25V18C18 18.55 17.8042 19.0208 17.4125 19.4125C17.0208 19.8042 16.55 20 16 20H2C1.45 20 0.979167 19.8042 0.5875 19.4125C0.195833 19.0208 0 18.55 0 18V4C0 3.45 0.195833 2.97917 0.5875 2.5875C0.979167 2.19583 1.45 2 2 2H7.5C7.36667 2.3 7.26667 2.62083 7.2 2.9625C7.13333 3.30417 7.08333 3.65 7.05 4H2V18H16V11.25ZM17.3 6.9L20.5 10.1L19.1 11.5L15.9 8.3C15.55 8.5 15.175 8.66667 14.775 8.8C14.375 8.93333 13.95 9 13.5 9C12.25 9 11.1875 8.5625 10.3125 7.6875C9.4375 6.8125 9 5.75 9 4.5C9 3.25 9.4375 2.1875 10.3125 1.3125C11.1875 0.4375 12.25 0 13.5 0C14.75 0 15.8125 0.4375 16.6875 1.3125C17.5625 2.1875 18 3.25 18 4.5C18 4.95 17.9333 5.375 17.8 5.775C17.6667 6.175 17.5 6.55 17.3 6.9ZM13.5 7C14.2 7 14.7917 6.75833 15.275 6.275C15.7583 5.79167 16 5.2 16 4.5C16 3.8 15.7583 3.20833 15.275 2.725C14.7917 2.24167 14.2 2 13.5 2C12.8 2 12.2083 2.24167 11.725 2.725C11.2417 3.20833 11 3.8 11 4.5C11 5.2 11.2417 5.79167 11.725 6.275C12.2083 6.75833 12.8 7 13.5 7Z" fill={fill}/>
    </svg>
);

FeatureSearch.propTypes = {
    width: PropTypes.string,
    height: PropTypes.string,
    fill: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    onClick: PropTypes.func,
};
