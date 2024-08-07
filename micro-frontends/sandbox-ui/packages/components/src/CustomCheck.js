import React from 'react';

const CustomDatePicker = ({ value, onChange, label }) => {
  const handleChange = (event) => {
    const date = event.target.value;
    onChange(date ? new Date(date).toISOString() : '');
  };

  return (
    <div style={{ marginBottom: '10px' }}>
      {label && <label style={{ display: 'block', marginBottom: '5px' }}>{label}</label>}
      <input
        type='date'
        value={value ? value.split('T')[0] : ''}
        onChange={handleChange}
        style={{ width: '100%' }}
      />
    </div>
  );
};

export default CustomDatePicker;
