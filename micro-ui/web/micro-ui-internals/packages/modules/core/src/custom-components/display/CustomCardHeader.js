import React from 'react';
import { TextBlock } from '@egovernments/digit-ui-components';

const CustomCardHeader = ({ children, style, className, ...props }) => {
  return (
    <TextBlock
      variant="h2"
      subVariant="primary"
      className={`custom-card-header ${className || ''}`}
      customStyle={{
        fontSize: '1.25rem',
        fontWeight: '600',
        color: '#0B4B66',
        marginBottom: '1rem',
        lineHeight: '1.4',
        ...style
      }}
      {...props}
    >
      {children}
    </TextBlock>
  );
};

export default CustomCardHeader;