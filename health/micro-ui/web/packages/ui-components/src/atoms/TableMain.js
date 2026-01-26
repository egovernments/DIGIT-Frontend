import React from 'react';
import PropTypes from "prop-types";

const TableMain = ({ children,className,style}) => {
  return (
    <table className={className} style={style}>
      {children}
    </table>
  );
};

TableMain.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node
};

TableMain.defaultProps = {
  className: "",
  style: {},
  children: []
};
export default TableMain;
