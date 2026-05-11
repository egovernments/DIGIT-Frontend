import { Card, PersonIcon } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const InboxLinks = ({ parentRoute, businessService, allLinks, headerText }) => {
  const { t } = useTranslation();
  const [links, setLinks] = useState([]);
  const { roles: userRoles } = Digit.UserService.getUser().info;
  useEffect(() => {
    let linksToShow = allLinks
      .filter((e) => e.businessService === businessService)
      .filter(({ roles }) => roles.some((e) => userRoles.map(({ code }) => code).includes(e)) || !roles.length);
    setLinks(linksToShow);
  }, []);

  const GetLogo = () => (
    <div
      className="header"
      style={{
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        alignItems: "center",
        gap: "0.75rem",
        width: "100%",
      }}
    >
      <span
        className="logo"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          lineHeight: 0,
        }}
      >
        
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            transform: "scale(1.4)",
            transformOrigin: "center center",
          }}
        >
      <div 
        style={{
            marginTop: "1rem",
            marginLeft: "1rem",
          }}>

          <PersonIcon />
          </div>
        </span>
      </span>
      <span className="text" style={{ minWidth: 0 }}>
        {t(headerText)}
      </span>
    </div>
  );
  return (
    <Card className="employeeCard filter inboxLinks">
      <div className="complaint-links-container">
        {GetLogo()}
        <div className="body">
          {links.map(({ link, text, hyperlink = false, accessTo = [] }, index) => {
            return (
              <span className="link" key={index}>
                {hyperlink ? <a href={link}>{t(text)}</a> : <Link to={link}>{t(text)}</Link>}
              </span>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default InboxLinks;