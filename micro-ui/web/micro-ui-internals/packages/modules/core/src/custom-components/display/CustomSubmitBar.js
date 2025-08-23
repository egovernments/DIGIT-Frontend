import React from 'react';
import { Button } from '@egovernments/digit-ui-components';

const CustomSubmitBar = ({ 
  label = 'Submit',
  onSubmit,
  disabled = false,
  submit = false,
  submitAction,
  style,
  className,
  children,
  ...props 
}) => {
  const handleClick = () => {
    if (submitAction) {
      submitAction();
    } else if (onSubmit) {
      onSubmit();
    }
  };
  
  return (
    <div 
      className={`custom-submit-bar ${className || ''}`}
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem 0',
        borderTop: '1px solid #E5E5E5',
        marginTop: '1.5rem',
        ...style
      }}
      {...props}
    >
      {children}
      
      <Button
        variant="primary"
        size="medium"
        label={label}
        onButtonClick={handleClick}
        isDisabled={disabled}
        type={submit ? 'submit' : 'button'}
        customStyle={{
          minWidth: '120px'
        }}
      />
    </div>
  );
};

export default CustomSubmitBar;