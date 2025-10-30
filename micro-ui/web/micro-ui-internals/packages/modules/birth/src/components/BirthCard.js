import React from "react";
import { useTranslation } from "react-i18next";
import { EmployeeModuleCard } from "@egovernments/digit-ui-react-components";

const BirthCard = () => {
  const { t } = useTranslation();

  const links = [
    {
      label: t("Birth_Certificate"),
      link: "https://sdc-uat.lgpunjab.gov.in/employee/user/login",
      hyperlink:true
    },
  ];

  const propsForModuleCard = {
    Icon: "PropertyHouse",
    moduleName: t("Birth Registration"),
    links: links,
  };

  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default BirthCard;
