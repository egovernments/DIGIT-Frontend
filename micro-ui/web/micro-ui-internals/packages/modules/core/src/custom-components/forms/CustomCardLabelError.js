import React from 'react';
import { ErrorMessage } from '@egovernments/digit-ui-components';

const CustomCardLabelError = ({ children, style, className, ...props }) => {
  return (
    <ErrorMessage
      message={children}
      customStyle={{
        margin: '0.25rem 0 0 0',
        fontSize: '0.875rem',
        fontWeight: '400',
        ...style
      }}
      className={`card-label-error ${className || ''}`}
      {...props}
    />
  );
};

export default CustomCardLabelError;