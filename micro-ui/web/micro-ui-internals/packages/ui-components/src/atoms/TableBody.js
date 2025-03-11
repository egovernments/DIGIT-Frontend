import React from 'react';
import PropTypes from "prop-types";

const TableBody = ({ children,style,className }) => {
  return (
    <tbody className={className} style={style}>
      {children}
    </tbody>
  );
};

TableBody.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node
};

TableBody.defaultProps = {
  className: "",
  style: {},
  children: []
};

export default TableBody;
