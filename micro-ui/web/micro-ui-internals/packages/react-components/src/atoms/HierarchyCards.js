import React, { useState } from 'react';
import { PTIcon } from './svgindex';
import { EmployeeModuleCardSection } from './EmployeeModuleCardSection';
import { MobileIconsSection } from './MobileIconsSection';
import { MobileLinksSection } from './MobileLinksSection';
import { Loader } from './Loader';

export const HierarchyCards = () => {
    const { isLoading, data } = Digit.Hooks.useAccessControl();

    function convertToHierarchy(data) {
        const groupedData = {};

        data.forEach((item) => {
            const pathParts = item.path.split('.');
            const groupKey = pathParts[0];
            if (pathParts.length > 1) {
                if (item.navigationURL && item.navigationURL.length > 0) {
                    if (!groupedData[groupKey]) {
                        groupedData[groupKey] = {
                            employeeModuleCardProps: {
                                Icon: <PTIcon />, // Replace with your icon component
                                moduleName: pathParts[0].replace(/^\d+/, ''), // Remove starting digits from pathParts[0]
                                kpis: [], // Add any KPIs you want to include
                                links: [],
                            },
                        };
                    }
                    groupedData[groupKey].employeeModuleCardProps.links.push({
                        label: pathParts[pathParts.length - 1],
                        link: item.navigationURL,
                    });
                }
            }
        });
        return groupedData;
    }

    const [selectedIcon, setSelectedIcon] = useState(null);

    if (isLoading) {
        return <Loader />;
    }

    if (data?.actions) {
        const hierarchy = convertToHierarchy(data.actions);

        return (
            <div style={{ marginTop: "40px" }}>
                <EmployeeModuleCardSection hierarchy={hierarchy} />
                {!selectedIcon ? (
                    <MobileIconsSection hierarchy={hierarchy} selectedIcon={selectedIcon} setSelectedIcon={setSelectedIcon} />
                ) : (
                    <MobileLinksSection hierarchy={hierarchy} selectedIcon={selectedIcon} setSelectedIcon={setSelectedIcon} />
                )}
            </div>
        );
    }

    return null;
};
