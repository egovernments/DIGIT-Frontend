import { EmployeeModuleCard } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

const DSSCard = () => {
  const { t } = useTranslation();

  const ROLES = {
    HEALTH_DSS: ["NATIONAL_SUPERVISOR", "DASHBOARD_VIEWER"],
  };

  const generateLink = (labelKey, pathSuffix) => {
    return {
      label: t(labelKey),
      link: `/${window?.contextPath}/employee/dss/${pathSuffix}`,
    };
  };
  
  let links = [
    generateLink("ACTION_TEST_MY_CAMPAIGNS","my-campaigns"),
  ];
 
  if (!Digit.Utils.didEmployeeHasAtleastOneRole(Object.values(ROLES).flatMap((e) => e))) {
    return null;
  }

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