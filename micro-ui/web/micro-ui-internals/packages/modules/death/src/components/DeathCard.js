import React from "react";
import { useTranslation } from "react-i18next";
import { EmployeeModuleCard } from "@egovernments/digit-ui-react-components";

const DeathCard = () => {
  const { t } = useTranslation();

  const links = [
    {
      label: t("Death Certificate"),
      link: "https://sdc-uat.lgpunjab.gov.in/digit-ui/citizen/login",
    },
  ];

  const propsForModuleCard = {
    Icon: "PropertyHouse",
    moduleName: t("Death Registration"),
    links: links,
  };

  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default DeathCard;
