import React from "react";
import { useTranslation } from "react-i18next";
import { EmployeeModuleCard } from "@egovernments/digit-ui-react-components";

const FirenocCard = () => {
  const { t } = useTranslation();

  const links = [
    {
      label: t("FIRENOC"),
      link: "https://sdc-uat.lgpunjab.gov.in/employee/fire-noc/search",
      hyperlink:true
    },
    {
      label: t("FIRENOC_INBOX"),
      link: "https://sdc-uat.lgpunjab.gov.in/employee/firenoc/inbox",
      hyperlink:true
    },
  ];

  const propsForModuleCard = {
    Icon: "PropertyHouse",
    moduleName: t("Fire NOC"),
    links: links,
  };

  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default FirenocCard;
