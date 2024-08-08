import React from 'react';
import Select from 'react-select';


export const EnumBasedDropdown = ({ options, value, onChange }) => {
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

    // Convert enum values to the format expected by react-select
    const formattedOptions = options.map(option => ({
        value: option,
        label: option
    }));

    // Find the currently selected option
    const selectedValue = formattedOptions.find(option => option.value === value);

    return (
        <div style={{ marginBottom: '1rem' }}>
            <Select
                value={selectedValue}
                onChange={handleChange}
                options={formattedOptions}
                styles={customStyles} // Apply the custom styles
            />
        </div>
    );
};