import React from 'react';
import { TextBlock } from '@egovernments/digit-ui-components';

const CustomCardText = ({ children, style, className, ...props }) => {
  return (
    <TextBlock
      variant="p"
      subVariant="primary"
      className={`custom-card-text ${className || ''}`}
      customStyle={{
        fontSize: '1rem',
        fontWeight: '400',
        color: '#373737',
        marginBottom: '0.5rem',
        lineHeight: '1.5',
        ...style
      }}
      {...props}
    >
      {children}
    </TextBlock>
  );
};

export default CustomCardText;