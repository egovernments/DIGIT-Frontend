import React from "react";
import { useTranslation } from "react-i18next";
import { EmployeeModuleCard } from "@egovernments/digit-ui-react-components";

const TLCard = () => {
  const { t } = useTranslation();

  const links = [
    {
      label: t("Trade License"),
      link: `https://sdc-uat.lgpunjab.gov.in/employee/report/rainmaker-tl/StateLevelTradeLicenseRegistryReport`,
      hyperlink:true
    },
  ];

  const propsForModuleCard = {
    Icon: "PropertyHouse",
    moduleName: t("Trade License"),
    links: links,
  };

  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default TLCard;
