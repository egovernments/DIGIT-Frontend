import React from 'react';
import { OTPInput } from '@egovernments/digit-ui-components';

const CustomOTPInput = (props) => {
  const {
    length = 6,
    onChange,
    value,
    disabled,
    error,
    className,
    style,
    ...rest
  } = props;

  return (
    <div className={`custom-otp-input ${className || ''}`} style={style}>
      <OTPInput
        length={length}
        onChange={onChange}
        value={value}
        disabled={disabled}
        error={error}
        {...rest}
      />
    </div>
  );
};

export default CustomOTPInput;