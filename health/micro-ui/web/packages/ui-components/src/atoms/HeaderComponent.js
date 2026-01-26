import React from "react";
import PropTypes from "prop-types";

const HeaderComponent = (props) => {
  return (
    <header className={`digit-header-content ${props?.className || ""}`} style={props?.styles || {}}>
      {props.children}
    </header>
  );
};

HeaderComponent.propTypes = {
  className: PropTypes.string,
  styles: PropTypes.object,
  children: PropTypes.node,
};

export default HeaderComponent;
