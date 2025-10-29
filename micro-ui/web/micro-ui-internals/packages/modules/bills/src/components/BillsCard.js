import React from "react";
import { useTranslation } from "react-i18next";
import { EmployeeModuleCard } from "@egovernments/digit-ui-react-components";

const BillsCard = () => {
  const { t } = useTranslation();

  const links = [
    {
      label: t("Bills Search"),
      link: "https://sdc-uat.lgpunjab.gov.in/employee/bill-amend/search",
    },
  ];

  const propsForModuleCard = {
    Icon: "CollectionIcon",
    moduleName: t("Bills"),
    links: links,
  };

  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default BillsCard;
