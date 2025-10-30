import React from "react";
import { useTranslation } from "react-i18next";
import { EmployeeModuleCard } from "@egovernments/digit-ui-react-components";

const TLCard = () => {
  const { t } = useTranslation();

  const links = [
    {
      label: t("TRADE_LICENCE"),
      link: `https://sdc-uat.lgpunjab.gov.in/employee/report/rainmaker-tl/StateLevelTradeLicenseRegistryReport`,
      hyperlink:true
    },
    {
      label: t("TL_INBOX"),
      link: `https://sdc-uat.lgpunjab.gov.in/employee/tl/inbox`,
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
