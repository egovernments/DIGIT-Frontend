import React from 'react';
import PropTypes from "prop-types";

const TableRow = ({ children ,className,onClick}) => {
  return (
    <tr className={className} onClick={onClick}>
      {children}
    </tr>
  );
};

TableRow.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node
};

TableRow.defaultProps = {
  className: "",
  style: {},
  children: []
};

export default TableRow;