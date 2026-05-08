import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card } from "@egovernments/digit-ui-react-components";

const ComplaintsLink = ({ isMobile }) => {
  const { t } = useTranslation();

  const allLinks = [
    { text: "ES_PGR_NEW_COMPLAINT", link: `/${window?.contextPath}/employee/pgr/complaint/create`, accessTo: ["CSR"] },
  ];

  const [links, setLinks] = useState([]);

  useEffect(() => {
    const linksToShow = allLinks.filter((link) =>
      link.accessTo ? Digit.UserService.hasAccess(link.accessTo) : true
    );
    setLinks(linksToShow);
  }, []);

  return (
    <Card className="employeeCard filter inboxLinks">
      <div className="complaint-links-container">
        <div className="header">
          <span className="logo">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
              <path d="M0 0h24v24H0z" fill="white" />
              <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z" fill="#c84c0e" />
            </svg>
          </span>
          <span className="text">{t("ES_PGR_HEADER_COMPLAINT")}</span>
        </div>
        <div className="body">
          {links.map(({ link, text }, index) => (
            <span className="link" key={index}>
              <Link to={link}>{t(text)}</Link>
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ComplaintsLink;
