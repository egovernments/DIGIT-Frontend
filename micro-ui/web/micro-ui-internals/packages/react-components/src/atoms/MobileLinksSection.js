import React from 'react';
import { AddIcon, ArrowBack, ArrowDirection, DashboardIcon } from './svgindex';
import { useHistory, Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';


export const MobileLinksSection = ({ hierarchy, selectedIcon, setSelectedIcon }) => {
    const history = useHistory();
    const { t } = useTranslation();


    return (
        <div className="mobile-links">
            <div
                onClick={() => setSelectedIcon(null)}
                className="back-button"
            >
                <ArrowBack />
                <div>{t("WORKBENCH_LABEL_BACK")}</div>
            </div>
            {hierarchy[selectedIcon].employeeModuleCardProps.kpis.length > 0 && (
                <div className='mobile-details'>
                    {hierarchy[selectedIcon].employeeModuleCardProps.kpis.length !== 0 && (
                        <div className="kpis-container">
                            {hierarchy[selectedIcon].employeeModuleCardProps.kpis.map(({ count, label, link }, index) => (
                                <div key={index} className="kpi-item">
                                    <span>{count || "-"}</span> {link ? <span className="link" onClick={() => history.push(`${link}`, { count })}>{label}</span> : null}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
            <ul className='mobile-links-ul'>
                {hierarchy[selectedIcon].employeeModuleCardProps.links.map((link, index) => (
                    <li key={index} className='mobile-links-li'>
                        <AddIcon fill='orangered' className="add-icon" />
                        <span
                            onClick={() => history.push(link.link)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="li-link-label"
                        >
                            {link.label}
                        </span>
                        <div className="arrow-direction-container">
                            <ArrowDirection className="arrow-icon" />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};
