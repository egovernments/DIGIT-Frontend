import React from 'react';
import PropTypes from "prop-types";

const TableHeader = ({ children,className,style }) => {
  return (
    <thead className={className} style={style}>
      {children}
    </thead>
  );
};

TableHeader.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node
};

TableHeader.defaultProps = {
  className: "",
  style: {},
  children: []
};

export default TableHeader;