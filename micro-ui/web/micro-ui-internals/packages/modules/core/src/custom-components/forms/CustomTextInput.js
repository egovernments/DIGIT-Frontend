import React from 'react';
import { TextInput } from '@egovernments/digit-ui-components';

const CustomTextInput = (props) => {
  const {
    value,
    onChange,
    placeholder,
    disabled,
    error,
    errorMessage,
    validation,
    type = 'text',
    className,
    style,
    ...rest
  } = props;

  return (
    <TextInput
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      error={error || !!errorMessage}
      errorMessage={errorMessage}
      validation={validation}
      type={type}
      className={className}
      style={style}
      {...rest}
    />
  );
};

export default CustomTextInput;