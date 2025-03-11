import React from 'react';
import PropTypes from "prop-types";

const TableFooter = ({ children ,className,style}) => {
  return (
    <tfoot className={className} style={style}>
      {children}
    </tfoot>
  );
};

TableFooter.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node
};

TableFooter.defaultProps = {
  className: "",
  style: {},
  children: []
};

export default TableFooter;