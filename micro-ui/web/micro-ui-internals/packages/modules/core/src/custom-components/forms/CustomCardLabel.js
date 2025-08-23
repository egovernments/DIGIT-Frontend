import React from 'react';
import { TextBlock } from '@egovernments/digit-ui-components';

const CustomCardLabel = ({ children, style, className, ...props }) => {
  return (
    <TextBlock
      variant="h3"
      subVariant="primary"
      customStyle={{
        margin: '0',
        fontWeight: '600',
        fontSize: '1rem',
        lineHeight: '1.5',
        color: '#0B4B66',
        ...style
      }}
      className={`card-label ${className || ''}`}
      {...props}
    >
      {children}
    </TextBlock>
  );
};

export default CustomCardLabel;