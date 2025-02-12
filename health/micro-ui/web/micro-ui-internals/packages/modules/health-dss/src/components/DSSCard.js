import { EmployeeModuleCard, SVG } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

const ROLES = {
  ATTENDANCE: ["PROXIMITY_SUPERVISOR"],
  BILLS: ["CAMPAIGN_SUPERVISOR"],
  DASHBOARD_USERS: ["DISTRICT_SUPERVISOR", "NATIONAL_SUPERVISOR", "PROVINCIAL_SUPERVISOR"]
};

const DSSCard = () => {

  const projectTypes = Digit.SessionStorage.get("projectTypes");
  const campaignData = Digit.SessionStorage.get("campaigns-info");
  const assignedProjects = Digit.SessionStorage.get("currentProject");

  console.log(projectTypes, 'projectTypes');
  console.log(campaignData, 'campaignData');
  console.log(assignedProjects, 'assignedProjects');

  const { t } = useTranslation();
  const userInfo = Digit.UserService.getUser();
  const userRoles = userInfo?.info?.roles?.map((roleData) => roleData?.code);
  const generateLink = (labelKey, pathSuffix, roles = ROLES.DASHBOARD_USERS) => {
    return {
      label: t(labelKey),
      link: `/${window?.contextPath}/employee/dss/${pathSuffix}`,
      roles: roles,
    };
  };

  if (!Digit.Utils.didEmployeeHasAtleastOneRole(Object.values(ROLES).flatMap((e) => e))) {
    return null;
  }

  let links = [
    generateLink("ATTENDANCE_REGISTERS", "fdssssssssssss"),
    generateLink("CS_COMMON_INBOX", "pro-selection", ROLES.DASHBOARD_USERS),
    generateLink("CS_TITLE_MY_BILLS", "myls", ROLES.DASHBOARD_USERS),
  ];
  const hasRequiredRoles = (link) => {
    if (!link?.roles?.length) return true;
    return Digit.Utils.didEmployeeHasAtleastOneRole(link.roles);
  };
  links = links.filter(hasRequiredRoles);

  const propsForModuleCard = {
    Icon: "Dashboard",
    moduleName: t("DSS_CARD_HEADER_DASHBOARD"),
    kpis: [],
    links: links,
    className: "microplan-employee-module-card",
  };
  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default DSSCard;
