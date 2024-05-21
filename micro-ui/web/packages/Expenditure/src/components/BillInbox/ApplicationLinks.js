import { Card, PropertyHouse, ShippingTruck } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom"; 

const ApplicationLinks = ({ linkPrefix, classNameForMobileView="" }) => {
  const { t } = useTranslation();

  const allLinks = [
    {
      text: t("WORKS_CREATE_NEW_BILL"),
      link: `/${window?.contextPath}/employee/contracts/search-contract`,
      businessService: "WORKS",
      roles: [],
    },
    // {
    //   text: t("WORKS_SEARCH_BILLS"),
    //   link: `/${window?.contextPath}/employee/contracts/search-bills`,
    //   businessService: "WORKS",
    //   roles: [],
    // },
    {
      text: t("COMMON_VIEW_BILLS"),
      link: `/${window?.contextPath}/employee/expenditure/view-bills/menu`,
      businessService: "WORKS",
      roles: ["EST_CREATOR", "EST_CHECKER", "EST_TECH_SANC", "EST_FIN_SANC", "EMPLOYEE"],
    }
  ];

  const [links, setLinks] = useState([]);

  const { roles } = Digit.UserService.getUser().info;

  const hasAccess = (accessTo) => {
    return roles.filter((role) => accessTo.includes(role.code)).length;
  };

  useEffect(() => {
    let linksToShow = [];
    allLinks.forEach((link) => {
      if (link.accessTo) {
        if (hasAccess(link.accessTo)) {
          linksToShow.push(link);
        }
      } else {
        linksToShow.push(link);
      }
    });
    setLinks(linksToShow);
  }, []);

  const GetLogo = () => (
    <div className="header">
      <span className="logo">
        <PropertyHouse />
      </span>
      <span className="text">{t("WORKS_MGMT")}</span>
    </div>
  );

  return (
    <Card className="employeeCard filter">
      <div className={`complaint-links-container ${classNameForMobileView}`}>
        {GetLogo()}
        <div className="body">
          {links.map(({ link, text }, index) => (
            <span className="link" key={index}>
              <Link to={link}>{text}</Link>
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ApplicationLinks;