import React from "react";
import { useTranslation } from "react-i18next";
import { EmployeeModuleCard } from "@egovernments/digit-ui-react-components";

const WSCard = () => {
  const { t } = useTranslation();

  const links = [
    {
      label: t("Water and Sewerage"),
      link: `https://sdc-uat.lgpunjab.gov.in/employee/wns/search`,
      hyperlink:true
    },
  ];

  const propsForModuleCard = {
    Icon: "PropertyHouse",
    moduleName: t("Water and Sewerage"),
    links: links,
  };

  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default WSCard;
