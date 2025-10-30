import React from "react";
import { useTranslation } from "react-i18next";
import { EmployeeModuleCard } from "@egovernments/digit-ui-react-components";

const PGRCard = () => {
  const { t } = useTranslation();

  const links = [
    {
      label: t("PGR"),
      link: `https://sdc-uat.lgpunjab.gov.in/employee/create-complaint`,
      hyperlink:true
    },
    {
      label: t("PGR_INBOX"),
      link: `https://sdc-uat.lgpunjab.gov.in/employee/pgr/inbox`,
      hyperlink:true
    },
  ];

  const propsForModuleCard = {
    Icon: "ComplaintIcon",
    moduleName: t("PGR"),
    links: links,
  };

  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default PGRCard;
