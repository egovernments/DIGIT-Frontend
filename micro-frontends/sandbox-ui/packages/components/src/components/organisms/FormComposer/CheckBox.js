import React from 'react';

export const CheckBox = ({ checked, onChange, label }) => {
    return (
        <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
            {label}
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                style={{ width: '2vh', height: '2vw' }}
            />
        </label>
    );
};