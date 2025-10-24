import React from "react";
import { useTranslation } from "react-i18next";
import { EmployeeModuleCard } from "@egovernments/digit-ui-react-components";

const HRMSCard = () => {
  const { t } = useTranslation();

  const links = [
    {
      label: t("HRMS"),
      link: `https://sdc-uat.lgpunjab.gov.in/employee/hrms/search`,
      hyperlink:true
    },
  ];

  const propsForModuleCard = {
    Icon: "PropertyHouse",
    moduleName: t("HRMS"),
    links: links,
  };

  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default HRMSCard;
