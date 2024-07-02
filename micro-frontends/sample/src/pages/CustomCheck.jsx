import React from 'react';

const CustomDatePicker = ({ value, onChange }) => {
    return (
      <input type='dates' value={value ? new Date(value) : null} onChange={date => onChange(date ? date.toISOString() : '')} />
    );
  };
  
  export default CustomDatePicker;