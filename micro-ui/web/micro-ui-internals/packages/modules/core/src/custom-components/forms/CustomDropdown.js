import React from 'react';
import { DropdownSkeleton } from '@egovernments/digit-ui-components';

const CustomDropdown = (props) => {
  const {
    option,
    options,
    selected,
    select,
    onBlur,
    placeholder,
    disabled,
    errorMessage,
    style,
    className,
    optionsKey,
    ...rest
  } = props;

  // Transform legacy options format to new format if needed
  const transformedOptions = options?.map(opt => ({
    value: opt.code || opt.value || opt,
    label: opt.name || opt.label || opt.i18nKey || opt,
    code: opt.code || opt.value || opt
  })) || [];

  const selectedValue = selected?.code || selected?.value || selected;

  const handleSelect = (selectedOption) => {
    if (select) {
      // Legacy format - pass the full option object
      select(selectedOption);
    }
  };

  return (
    <DropdownSkeleton
      option={transformedOptions}
      selected={transformedOptions.find(opt => opt.value === selectedValue)}
      select={handleSelect}
      onBlur={onBlur}
      placeholder={placeholder}
      disabled={disabled}
      errorMessage={errorMessage}
      style={style}
      className={className}
      {...rest}
    />
  );
};

export default CustomDropdown;