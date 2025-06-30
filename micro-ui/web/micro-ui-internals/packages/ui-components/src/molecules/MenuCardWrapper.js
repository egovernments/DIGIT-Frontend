import React from "react";
import PropTypes from "prop-types";

const MenuCardWrapper = ({ children, className, styles }) => {
  return (
    <div className={`digit-menu-card-wrapper ${className}`} style={styles}>
      {children}
    </div>
  );
};

MenuCardWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  styles: PropTypes.object,
};

MenuCardWrapper.defaultProps = {
  className: "",
  styles: {
  },
};

export default MenuCardWrapper;
