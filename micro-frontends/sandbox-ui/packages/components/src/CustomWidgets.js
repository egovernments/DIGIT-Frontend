import React from 'react';
import Select from 'react-select';

export const CustomDatePicker = ({ value, onChange, label }) => {
    const handleChange = (event) => {
        const date = event.target.value;
        onChange(date ? new Date(date).toISOString() : '');
    };

    const inputStyle = {
        width: '100%',
        boxSizing: 'border-box',
        paddingRight: '0.75rem', // Add padding to create space for the date icon
        outline: '0.125rem solid transparent',
        outlineOffset: '0.125rem',
        height: '2.5rem',
        backgroundColor: '#fff',
        fontStyle: 'normal',
        fontFamily: 'Roboto',
        fontSize: '1rem',
        border: '0.063rem solid #787878',
        color: '#363636',
        lineHeight: '1.5rem'
    };

    return (
        <div style={{ marginBottom: '1rem' }}>
            {label && <label style={{ display: 'block', marginBottom: '0.5rem' }}>{label}</label>}
            <input
                className='digit-citizenCard-input'
                type='date'
                value={value ? value.split('T')[0] : ''}
                onChange={handleChange}
                style={inputStyle} // Apply the custom style
            />
        </div>
    );
};


export const CustomDropdown = ({ options, value, onChange, label }) => {

    const handleChange = (selectedOption) => {
        onChange(selectedOption.value);
    };

    const customStyles = {
        control: (base) => ({
            ...base,
            width: '100%',
            boxSizing: 'border-box',
            paddingLeft: 0,
            outline: '0.125rem solid transparent',
            outlineOffset: '0.125rem',
            height: '2.5rem',
            backgroundColor: '#fff',
            fontStyle: 'normal',
            fontFamily: 'Roboto',
            fontSize: '1rem',
            border: '0.063rem solid #787878',
            color: '#363636',
            lineHeight: '1.5rem',
            borderRadius: 0,
        }),
        valueContainer: (base) => ({
            ...base
        })
    };

    // Convert options to the format expected by react-select
    const formattedOptions = options.map(option => ({
        value: option.value,
        label: option.label
    }));

    // Find the currently selected option
    const selectedValue = formattedOptions.find(option => option.value === value);

    return (
        <div style={{ marginBottom: '1rem' }}>
            {label && <label style={{ display: 'block', marginBottom: '0.5rem' }}>{label}</label>}
            <Select
                // className='digit-citizenCard-input'
                value={selectedValue}
                onChange={handleChange}
                options={formattedOptions}
                styles={customStyles} // Apply the custom styles
            />
        </div>
    );
};
