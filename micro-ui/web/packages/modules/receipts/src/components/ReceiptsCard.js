import React from "react";
import { useTranslation } from "react-i18next";
import { EmployeeModuleCard } from "@egovernments/digit-ui-react-components";

const ReceiptsCard = () => {
  const { t } = useTranslation();

  const links = [
    {
      label: t("RECEIPTS"),
      link: `https://sdc-uat.lgpunjab.gov.in/employee/receipts/search`,
      hyperlink:true
    },
  ];

  const propsForModuleCard = {
    Icon: "ReceiptIcon",
    moduleName: t("RECEIPTS"),
    links: links,
  };

  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default ReceiptsCard;
