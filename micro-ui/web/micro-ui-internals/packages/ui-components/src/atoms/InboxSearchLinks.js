import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { iconRender } from "../utils/iconRender";

const InboxSearchLinks = ({
  headerText,
  links,
  businessService,
  customClass = "",
  logoIcon,
}) => {
  const { t } = useTranslation();
  const { roles: userRoles } = Digit.UserService.getUser().info;
  const [linksToShow, setLinksToShow] = useState([]);

  useEffect(() => {
    let linksToShow = links.filter(
      ({ roles }) =>
        roles.some((role) =>
          userRoles.map(({ code }) => code).includes(role)
        ) || !roles?.length
    );
    setLinksToShow(linksToShow);
  }, [links,userRoles]);

  const renderHeader = () => (
    <div className="digit-inbox-search-links-header">
      <span className="digit-inbox-search-links-header-logo">
        {logoIcon?.component &&
          iconRender(
            logoIcon?.component,
            "#C84C0E",
            "2rem",
            "2rem",
            logoIcon?.customClass
          )}
      </span>
      <span className="digit-inbox-search-links-header-text">{t(headerText)}</span>
    </div>
  );
  return (
    <div className={`digit-inbox-search-links-container ${customClass}`}>
      {renderHeader()}
      <div className="digit-inbox-search-links-contents">
        {linksToShow.map(({ url, text, hyperlink = false }, index) => {
          return (
            <span className="digit-inbox-search-link" key={index}>
              { hyperlink ? (
                <a href={`/${window?.contextPath}${url}`}>{t(text)}</a>
              ) : (
                <Link to={`/${window?.contextPath}${url}`}>{t(text)}</Link>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default InboxSearchLinks;