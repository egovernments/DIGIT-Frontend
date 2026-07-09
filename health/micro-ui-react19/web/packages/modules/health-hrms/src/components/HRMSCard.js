import { EmployeeModuleCard } from "@egovernments/digit-ui-react-components";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { I18N_KEYS } from "../utils/i18nKeyConstants";

const ROLES = {
  HRMS: ["HRMS_ADMIN"],
};

const HRMSCard = () => {

  const { t } = useTranslation();
  const userInfo = Digit.UserService.getUser();
  const userRoles = userInfo?.info?.roles?.map((roleData) => roleData?.code);
  const generateLink = (labelKey, pathSuffix, roles = ROLES.HRMS) => {
    return {
      label: t(labelKey),
      link: `/${window?.contextPath}/employee/hrms/${pathSuffix}`,
      roles: roles,
    };
  };

  if (!Digit.Utils.didEmployeeHasAtleastOneRole(Object.values(ROLES).flatMap((e) => e))) {
    return null;
  }

  let links = [
    generateLink(I18N_KEYS.HRMS_CARD.SEARCH_EMPLOYEE, "inbox"),
    generateLink(I18N_KEYS.HRMS_CARD.CREATE_EMPLOYEE, "create",),
  ];
  const hasRequiredRoles = (link) => {
    if (!link?.roles?.length) return true;
    return Digit.Utils.didEmployeeHasAtleastOneRole(link.roles);
  };
  links = links.filter(hasRequiredRoles);

  const propsForModuleCard = {
    Icon: "UpdateExpense",
    moduleName: t(I18N_KEYS.HRMS_CARD.HRMS),
    kpis: [],
    links: links,
    className: "microplan-employee-module-card",
  };
  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default HRMSCard;
