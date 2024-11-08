import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";


const getIconComponent = (iconName = "") => {
    // Trying to get the icon from "digit-ui-react-components"
    let IconComponent = require("@egovernments/digit-ui-react-components")?.[iconName];
    // If the icon is not found, trying to get it from "digit-ui-svg-components"
    if (!IconComponent) {
      IconComponent = require("@egovernments/digit-ui-svg-components")?.[iconName];
    }
    return IconComponent;
};
  

const InboxSearchLinks = ({headerText, links, businessService, customClass="", logoIcon}) => {
  
    const { t } = useTranslation();
    const { roles: userRoles } = Digit.UserService.getUser().info;
    const [linksToShow, setLinksToShow] = useState([]);
    const IconComponent=getIconComponent(logoIcon?.component);
    useEffect(() => {
      let linksToShow = links.filter(({ roles }) => roles.some((role) => userRoles.map(({ code }) => code).includes(role)) || !roles?.length);
        setLinksToShow(linksToShow);
    }, []);
    const renderHeader = () => <div className="header">
        <span className="logo">
           {logoIcon?.component && IconComponent && <IconComponent className={logoIcon?.customClass} />}
        </span>
        <span className="text">{t(headerText)}</span>
    </div>
    return (
        <div className={`inbox-search-links-container ${customClass}`}>
            {renderHeader()}
            <div className="contents">
                {linksToShow.map(({ url, text, hyperlink = false}, index) => {
                    return (
                    <span className="link" key={index}>
                        {hyperlink ? <a href={`/${window?.contextPath}${url}`}>{t(text)}</a> : <Link to={`/${window?.contextPath}${url}`}>{t(text)}</Link>}
                    </span>
                    );
                })}
            </div>
        </div>
    )
   
}

export default InboxSearchLinks;