import React from "react";
import PropTypes from "prop-types";

const LinkButton = (props) => {

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      props.onClick && props.onClick(e);
    }
  };

  return (
    <span role="button" tabIndex={0} className={`card-link cp ${props.className}`} onClick={props.onClick} onKeyDown={(e)=>handleKeyDown(e)} style={props.style}>
      {props.label}
    </span>
  );
};

LinkButton.propTypes = {
  /**
   * LinkButton contents
   */
  label: PropTypes.any,
  /**
   * Optional click handler
   */
  onClick: PropTypes.func,
};

LinkButton.defaultProps = {};

export default LinkButton;
