import { Card, BioMetricIcon } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const InboxLinks = ({ parentRoute, businessService }) => {
  const { t } = useTranslation();

  const allLinks = [
    {
      text: t("WORKS_ENROLL_WAGE_SEEKER"), 
      link: `/${window?.contextPath}/employee/contracts/create-contract`,
      businessService: "WORKS",
      roles: [],
    }
  ];

  const [links, setLinks] = useState([]);

  const { roles: userRoles } = Digit.UserService.getUser().info;

  useEffect(() => {
    let linksToShow = allLinks
      .filter((e) => e.businessService === businessService)
      .filter(({ roles }) => roles.some((e) => userRoles.map(({ code }) => code).includes(e)) || !roles?.length);
    setLinks(linksToShow);
  }, []);

  const GetLogo = () => (
    <div className="header">
      <span className="logo">
        <BioMetricIcon />
      </span>{" "}
      <span className="text">{t("ATM_ATTENDANCE_MANAGEMENT")}</span>
    </div>
  );

  return (
    // <Card style={{ paddingRight: 0, marginTop: 0 }} className="employeeCard filter inboxLinks">
    <Card className="employeeCard filter inboxLinks">
      <div className="complaint-links-container">
        {GetLogo()}
        {/* <div style={{ marginLeft: "unset", paddingLeft: "0px" }} className="body"> */}
        <div className="body">
          {allLinks.map(({ link, text, hyperlink = false, roles = [] }, index) => {
            return (
              <span className="link" key={index}>
                {hyperlink ? <a href={link}>{text}</a> : <Link to={link}>{t(text)}</Link>}
              </span>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default InboxLinks;