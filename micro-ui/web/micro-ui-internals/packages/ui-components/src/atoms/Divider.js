import React from "react";
import PropTypes from 'prop-types';

const Divider = ({ className = "", style = {}, variant}) => {
  return <hr className={`digit-divider ${variant || ""} ${className || ""}`} style={style}></hr>;
};

Divider.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
};

export default Divider;
