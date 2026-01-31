import React from "react";
import PropTypes from "prop-types";

export const Employee = ({ className, width = "25", height = "26", style = {}, fill = "#D4351C", onClick = null }) => (
    <svg width={width} height={height} className={className} onClick={onClick} style={style} viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.5 16.6758C8.32812 16.6758 0 18.6464 0 22.5581V25.4993H25V22.5581C25 18.6464 16.6719 16.6758 12.5 16.6758Z" fill={fill} />
        <path d="M5.84375 7.85294H19.1719C19.5938 7.85294 19.9375 7.52941 19.9375 7.13235V7.10294C19.9375 6.70588 19.5938 6.38235 19.1719 6.38235H18.75C18.75 4.20588 17.4844 2.33824 15.625 1.30882V2.70588C15.625 3.11765 15.2813 3.44118 14.8438 3.44118C14.4063 3.44118 14.0625 3.11765 14.0625 2.70588V0.705882C13.5625 0.588235 13.0469 0.5 12.5 0.5C11.9531 0.5 11.4375 0.588235 10.9375 0.705882V2.70588C10.9375 3.11765 10.5938 3.44118 10.1563 3.44118C9.71875 3.44118 9.375 3.11765 9.375 2.70588V1.30882C7.51562 2.33824 6.25 4.20588 6.25 6.38235H5.84375C5.42187 6.38235 5.07812 6.70588 5.07812 7.10294V7.14706C5.07812 7.52941 5.42187 7.85294 5.84375 7.85294Z" fill={fill} />
        <path d="M12.5 13.736C15.4062 13.736 17.8281 11.8536 18.5312 9.32422H6.46875C7.17188 11.8536 9.59375 13.736 12.5 13.736Z" fill={fill} />
    </svg>
);

Employee.propTypes = {
    width: PropTypes.string,
    height: PropTypes.string,
    fill: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    onClick: PropTypes.func,
};
