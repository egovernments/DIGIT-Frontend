import React from "react";
import { useTranslation } from "react-i18next";
import { EmployeeModuleCard } from "@egovernments/digit-ui-react-components";

const WSCard = () => {
  const { t } = useTranslation();

  const links = [
    {
      label: t("WATER_AND_SEWAGE"),
      link: `https://sdc-uat.lgpunjab.gov.in/employee/wns/search`,
      hyperlink: true
    },
    {
      label: t("WS_INBOX"),
      link: `https://sdc-uat.lgpunjab.gov.in/employee/water-sewage/inbox`,
      hyperlink: true
    },
    {
      label: t("SW_INBOX"),
      link: `https://sdc-uat.lgpunjab.gov.in/employee/sewage/inbox`,
      hyperlink: true
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
