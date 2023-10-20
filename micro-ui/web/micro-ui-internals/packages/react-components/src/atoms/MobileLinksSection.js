import React from 'react';
import { AddIcon, ArrowBack, ArrowDirection, DashboardIcon } from './svgindex';
import { useHistory } from 'react-router-dom';

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
