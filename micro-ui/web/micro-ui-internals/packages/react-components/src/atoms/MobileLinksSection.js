import React from 'react';
import { AddIcon, ArrowBack, ArrowDirection, DashboardIcon } from './svgindex';
import { useHistory, Link } from "react-router-dom";


export const MobileLinksSection = ({ hierarchy, selectedIcon, setSelectedIcon }) => {
    const history = useHistory();

    return (
        <div className="mobile-links">
            <div
                onClick={() => setSelectedIcon(null)}
                style={{ display: "flex", flexDirection: "row", alignSelf: "flex-start", color: "black", cursor: "pointer" }}
            >
                <ArrowBack />
                <div>Back</div>
            </div>
            {(hierarchy[selectedIcon].employeeModuleCardProps.kpis.length > 0) &&
                <div className='mobile-details' style={{ marginTop: "20px", padding: "10px", paddingBottom: "5px", width: "90%", backgroundColor: "white" }}>
                    {hierarchy[selectedIcon].employeeModuleCardProps.kpis.length !== 0 && (
                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
                            {hierarchy[selectedIcon].employeeModuleCardProps.kpis.map(({ count, label, link }, index) => (
                                <div key={index} style={{ marginBottom: "10px" }}>
                                    <span>{count || "-"}</span> {link ? <span className="link" onClick={() => history.push(`${link}`, { count })}>{label}</span> : null}
                                </div>
                            ))}
                        </div>
                    )}
                </div>}
            <ul className='mobile-links-ul'>
                {hierarchy[selectedIcon].employeeModuleCardProps.links.map((link, index) => (
                    <li key={index} className='mobile-links-li'>
                        <AddIcon fill='orangered' styles={{ height: "20px", width: "20px" }} />
                        <span
                            onClick={() => history.push(link.link)}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ flex: "1", marginLeft: "10px" }}
                        >
                            {link.label}
                        </span>
                        <div className="arrow-direction-container">
                            <ArrowDirection styles={{ height: "20px", width: "20px", fill: "white" }} />
                        </div>
                    </li>
                ))}
            </ul>

        </div>
    );
};
