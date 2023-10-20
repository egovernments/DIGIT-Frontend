import React from 'react';
import { EmployeeModuleCard } from './EmployeeModuleCard';
export const EmployeeModuleCardSection = ({ hierarchy }) => {
    return (
        <div className='employee-web'>
            {Object.keys(hierarchy).map((key, index) => {
                const item = hierarchy[key];
                return <EmployeeModuleCard key={index} {...item?.employeeModuleCardProps} />;
            })}
        </div>
    );
};