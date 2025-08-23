import React from 'react';
import { Button } from '@egovernments/digit-ui-components';

const CustomLinkButton = ({ children, onClick, href, style, className, ...props }) => {
  const handleClick = (e) => {
    if (href) {
      window.open(href, '_blank');
    } else if (onClick) {
      onClick(e);
    }
  };

  return (
    <Button
      variation="link"
      onClick={handleClick}
      className={`custom-link-button ${className || ''}`}
      style={{
        padding: '0',
        textDecoration: 'underline',
        color: '#0B4B66',
        fontSize: 'inherit',
        ...style
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default CustomLinkButton;