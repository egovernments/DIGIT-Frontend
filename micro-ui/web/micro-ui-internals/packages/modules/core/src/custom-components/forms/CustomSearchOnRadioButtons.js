import React from 'react';
import { RadioButton, TextInput } from '@egovernments/digit-ui-components';

const CustomSearchOnRadioButtons = ({
  options = [],
  selectedOption,
  onSelect,
  searchValue = '',
  onSearchChange,
  placeholder = 'Search...',
  disabled = false,
  error = false,
  style,
  className,
  ...props
}) => {
  const filteredOptions = options.filter(option => {
    const label = option.name || option.label || option;
    return label.toLowerCase().includes(searchValue.toLowerCase());
  });

  return (
    <div className={`custom-search-radio ${className || ''}`} style={style} {...props}>
      <TextInput
        value={searchValue}
        onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        error={error}
        style={{ marginBottom: '1rem' }}
      />
      
      <div className="radio-options" style={{ maxHeight: '200px', overflowY: 'auto' }}>
        {filteredOptions.map((option, index) => (
          <RadioButton
            key={option.code || option.value || index}
            value={option.code || option.value}
            label={option.name || option.label || option}
            checked={selectedOption === (option.code || option.value)}
            onChange={(e) => onSelect && onSelect(option)}
            disabled={disabled}
            error={error}
            style={{ marginBottom: '0.5rem' }}
          />
        ))}
        
        {filteredOptions.length === 0 && searchValue && (
          <div style={{ 
            padding: '1rem', 
            textAlign: 'center', 
            color: '#666',
            fontStyle: 'italic'
          }}>
            No options found
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomSearchOnRadioButtons;