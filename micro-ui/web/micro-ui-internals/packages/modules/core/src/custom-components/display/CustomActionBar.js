import React from 'react';
import { Button } from '@egovernments/digit-ui-components';

const CustomActionBar = ({ 
  children, 
  style, 
  className,
  actionFields = [],
  maxActionFieldsAllowed = 5,
  sortActionFields = false,
  setactionFieldsToRight = false,
  ...props 
}) => {
  // Sort action fields if required
  const sortedActionFields = sortActionFields 
    ? [...actionFields].sort((a, b) => (a.orderNumber || 0) - (b.orderNumber || 0))
    : actionFields;
  
  // Limit action fields
  const limitedActionFields = sortedActionFields.slice(0, maxActionFieldsAllowed);
  
  return (
    <div 
      className={`custom-action-bar ${className || ''}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem 0',
        borderTop: '1px solid #E5E5E5',
        justifyContent: setactionFieldsToRight ? 'flex-end' : 'flex-start',
        ...style
      }}
      {...props}
    >
      {limitedActionFields.map((field, index) => {
        if (field.componentInFront) {
          return <div key={index}>{field.componentInFront}</div>;
        }
        
        return (
          <Button
            key={field.label || index}
            variant={field.variation || 'primary'}
            size="medium"
            label={field.label}
            onButtonClick={field.action}
            isDisabled={field.isDisabled}
            customStyle={field.style}
            icon={field.icon}
            iconPosition={field.iconPosition}
          />
        );
      })}
      
      {children}
    </div>
  );
};

export default CustomActionBar;