import { EmployeeModuleCard, SVG } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

const DSSCard = () => {
  const { t } = useTranslation();

  const generateLink = (labelKey, pathSuffix) => {
    return {
      label: t(labelKey),
      link: `/${window?.contextPath}/employee/dss/${pathSuffix}`,
    };
  };
  
  let links = [
    // generateLink("LIVE_CAMPAIGNS","live-campaigns"),
    // generateLink("PAST_CAMPAIGNS","past-campaigns"),
    // generateLink("L1Charts","landing"),
    generateLink("ACTION_TEST_MY_CAMPAIGNS","my-campaigns"),
  ];

  const propsForModuleCard = {
    Icon: "Dashboard",
    moduleName: t("Dashboard"),
    kpis: [],
    links: links,
    className: "microplan-employee-module-card",
  };

  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default DSSCard;