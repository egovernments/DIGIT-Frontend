import React from 'react';
import { Button } from '@egovernments/digit-ui-components';

const CustomButton = (props) => {
  const {
    children,
    onClick,
    disabled,
    type = 'button',
    variation = 'primary',
    className,
    style,
    size = 'medium',
    ...rest
  } = props;

  // Map legacy variation names to new ui-components variations
  const getVariation = (legacyVariation) => {
    const variations = {
      'primary': 'primary',
      'secondary': 'secondary', 
      'teritiary': 'tertiary',
      'tertiary': 'tertiary',
      'outline': 'outline',
      'link': 'link',
      'text': 'text'
    };
    return variations[legacyVariation] || 'primary';
  };

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      type={type}
      variation={getVariation(variation)}
      size={size}
      className={`custom-button ${className || ''}`}
      style={style}
      {...rest}
    >
      {children}
    </Button>
  );
};

export default CustomButton;