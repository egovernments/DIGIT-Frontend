import React from 'react';
import { TextInput, RadioButton } from '@egovernments/digit-ui-components';

const CustomPageBasedInput = ({ 
  type = 'text',
  options = [],
  value,
  onChange,
  placeholder,
  disabled,
  error,
  errorMessage,
  style,
  className,
  ...props 
}) => {
  if (type === 'radio' && options.length > 0) {
    return (
      <div className={`custom-page-based-input radio-group ${className || ''}`} style={style}>
        {options.map((option, index) => (
          <RadioButton
            key={option.code || option.value || index}
            value={option.code || option.value}
            label={option.name || option.label || option}
            checked={value === (option.code || option.value)}
            onChange={(e) => onChange && onChange(e.target.value)}
            disabled={disabled}
            error={error}
            style={{ marginBottom: '0.5rem' }}
            {...props}
          />
        ))}
        {errorMessage && (
          <div style={{ color: '#E54D2E', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            {errorMessage}
          </div>
        )}
      </div>
    );
  }

  return (
    <TextInput
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      error={error || !!errorMessage}
      errorMessage={errorMessage}
      style={style}
      className={`custom-page-based-input ${className || ''}`}
      {...props}
    />
  );
};

export default CustomPageBasedInput;