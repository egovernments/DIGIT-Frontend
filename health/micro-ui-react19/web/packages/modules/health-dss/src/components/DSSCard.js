import { EmployeeModuleCard } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { I18N_KEYS } from "../utils/i18nKeyConstants";

const DSSCard = () => {
  const { t } = useTranslation();
  const userInfo = Digit.UserService.getUser();
  const userRoles = userInfo?.info?.roles?.map((roleData) => roleData?.code);

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
    generateLink(I18N_KEYS.COMPONENTS.ACTION_TEST_MY_CAMPAIGNS,"my-campaigns"),
  ];
 
  if (!userRoles?.some((role) => ROLES.HEALTH_DSS.includes(role))) {
    return null;
  }

  const propsForModuleCard = {
    Icon: "Dashboard",
    moduleName: t(I18N_KEYS.COMPONENTS.DASHBOARD),
    kpis: [],
    links: links,
    className: "microplan-employee-module-card",
  };

  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default DSSCard;