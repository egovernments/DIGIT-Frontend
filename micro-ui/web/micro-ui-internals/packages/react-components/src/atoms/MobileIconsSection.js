import React from 'react';
import { PTIcon } from './svgindex';

export const MobileIconsSection = ({ hierarchy, selectedIcon, setSelectedIcon }) => {
    return (
        <div className='employee-mobile'>
            {Object.keys(hierarchy).map((key, index) => (
                <div
                    className='employee-mobile-icons'
                    key={index}
                    onClick={() => {
                        if (selectedIcon === key) {
                            setSelectedIcon(null);
                        } else {
                            setSelectedIcon(key);
                        }
                    }}
                >
                    <PTIcon fill="#fe7a51" height="100" style={{ marginRight: "10px" }} />
                    <span style={{ margin: "5px" }}>{key.replace(/^\d+/, '')}</span>
                </div>
            ))}
        </div>
    );
};
