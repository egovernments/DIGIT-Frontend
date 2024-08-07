import React from 'react';

export const CustomDatePicker = ({ value, onChange, label }) => {
  const handleChange = (event) => {
    const date = event.target.value;
    onChange(date ? new Date(date).toISOString() : '');
  };

  return (
    <div style={{ marginBottom: '10px' }}>
      {label && <label style={{ display: 'block', marginBottom: '5px' }}>{label}</label>}
      <input
        className='digit-citizenCard-input'
        type='date'
        value={value ? value.split('T')[0] : ''}
        onChange={handleChange}
      />
    </div>
  );
};


export const CustomDropdown = ({ options, value, onChange, label }) => {

  console.log(options, value, onChange, label)
  const handleChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <div style={{ marginBottom: '10px' }}>
      {label && <label style={{ display: 'block', marginBottom: '5px' }}>{label}</label>}
      <select
        className='digit-citizenCard-input'
        value={value}
        onChange={handleChange}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};