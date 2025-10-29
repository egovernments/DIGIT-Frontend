import React from "react";
import { useTranslation } from "react-i18next";
import { EmployeeModuleCard } from "@egovernments/digit-ui-react-components";

const FinanceCard = () => {
  const { t } = useTranslation();

  const links = [
    {
      label: t("Finance"),
      link: "https://sdc-uat.lgpunjab.gov.in/employee/services/EGF/inbox",
    },
  ];

  const propsForModuleCard = {
    Icon: "PropertyHouse",
    moduleName: t("Finance"),
    links: links,
  };

  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default FinanceCard;
