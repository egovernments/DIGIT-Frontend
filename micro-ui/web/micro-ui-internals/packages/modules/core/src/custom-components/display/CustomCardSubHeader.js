import React from 'react';
import { TextBlock } from '@egovernments/digit-ui-components';

const CustomCardSubHeader = ({ children, style, className, ...props }) => {
  return (
    <TextBlock
      variant="h3"
      subVariant="secondary"
      className={`custom-card-subheader ${className || ''}`}
      customStyle={{
        fontSize: '1.125rem',
        fontWeight: '500',
        color: '#505A5F',
        marginBottom: '0.75rem',
        lineHeight: '1.4',
        ...style
      }}
      {...props}
    >
      {children}
    </TextBlock>
  );
};

export default CustomCardSubHeader;