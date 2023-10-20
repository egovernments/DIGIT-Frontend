import React, { useState } from 'react';
import { PTIcon } from './svgindex';
import { EmployeeModuleCardSection } from './EmployeeModuleCardSection';
import { MobileIconsSection } from './MobileIconsSection';
import { MobileLinksSection } from './MobileLinksSection';
import { Loader } from './Loader';
import { useTranslation } from 'react-i18next';

const apiDetailsConfig = {
    "HRMS": {
        "url": "/egov-hrms/employees/_count",
        "params": { "tenantId": "pg.citya" },
        "viewDetails": {
            "key": {
                "selectedPaths": "EmployeCount.totalEmployee",
                "detailsUrls": "/employee/hrms/inbox",
                "kpisLabels": "TOTAL_EMPLOYEES"
            },
            "key1": {
                "selectedPaths": "EmployeCount.activeEmployee",
                "detailsUrls": "/employee/hrms/inbox",
                "kpisLabels": "ACTIVE_EMPLOYEES"
            }
        }
    }
}
export const HierarchyCards = () => {
    const { isLoading, data } = Digit.Hooks.useAccessControl();
    const { t } = useTranslation();
    var { isLoading: isDetailsLoading, data: Details } = Digit.Hooks.useCustomAPIHook(apiDetailsConfig["HRMS"]);
    function resolveObjectRoute(obj, route) {
        if (!obj) {
            return obj
        }
        if (route.includes('.')) {
            const parts = route.split('.');
            const start = parts.shift();
            obj = obj[start];
            return resolveObjectRoute(obj, parts.join('.'));
        } else {
            return obj[route];
        }
    }
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
                                moduleName: (pathParts[0].replace(/^\d+/, '')).toUpperCase(),
                                kpis: [], // Initialize kpis as an empty array
                                links: [],
                            },
                        };
                    }
                    groupedData[groupKey].employeeModuleCardProps.links.push({
                        label: pathParts[pathParts.length - 1].charAt(0).toUpperCase() + pathParts[pathParts.length - 1].slice(1),
                        link: item.navigationURL,
                    });

                    if (Details && (groupedData[groupKey].employeeModuleCardProps.moduleName == "HRMS")) {
                        var kpis = [];
                        Object.keys(apiDetailsConfig[groupedData[groupKey].employeeModuleCardProps.moduleName].viewDetails)
                            .slice(0, 2) // This limits the processing to the first 2 keys
                            .map((key) => {
                                const viewDetail = apiDetailsConfig[groupedData[groupKey].employeeModuleCardProps.moduleName].viewDetails[key];
                                kpis.push({
                                    count: isDetailsLoading ? "-" : resolveObjectRoute(Details, viewDetail.selectedPaths),
                                    label: t(viewDetail.kpisLabels),
                                    link: "/" + window.contextPath + viewDetail.detailsUrls,
                                });
                            });
                        groupedData[groupKey].employeeModuleCardProps.kpis = kpis;
                    }
                }
            } else {
                if (item.navigationURL && item.navigationURL.length > 0) {
                    if (!groupedData[groupKey]) {
                        groupedData[groupKey] = {
                            employeeModuleCardProps: {
                                Icon: <PTIcon />, // Replace with your icon component
                                moduleName: (pathParts[0].replace(/^\d+/, '')).toUpperCase(),
                                kpis: [], // Initialize kpis as an empty array
                                links: [],
                            },
                        };
                    }
                    const labelWithoutDigit = pathParts[0].slice(1);
                    groupedData[groupKey].employeeModuleCardProps.links.push({
                        label: labelWithoutDigit.charAt(0).toUpperCase() + labelWithoutDigit.slice(1),
                        link: item.navigationURL,
                    });

                    if (Details && (groupedData[groupKey].employeeModuleCardProps.moduleName == "HRMS")) {
                        var kpis = [];
                        Object.keys(apiDetailsConfig[groupedData[groupKey].employeeModuleCardProps.moduleName].viewDetails)
                            .slice(0, 2) // This limits the processing to the first 2 keys
                            .map((key) => {
                                const viewDetail = apiDetailsConfig[groupedData[groupKey].employeeModuleCardProps.moduleName].viewDetails[key];
                                kpis.push({
                                    count: isDetailsLoading ? "-" : resolveObjectRoute(Details, viewDetail.selectedPaths),
                                    label: t(viewDetail.kpisLabels),
                                    link: "/" + window.contextPath + viewDetail.detailsUrls,
                                });
                            });
                        groupedData[groupKey].employeeModuleCardProps.kpis = kpis;
                    }
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
