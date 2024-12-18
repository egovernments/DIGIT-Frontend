import { EmployeeModuleCard, SVG } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

const ROLES = {
  ATTENDANCE: ["PROXIMITY_SUPERVISOR"],
  BILLS: ["PROXIMITY_SUPERVISOR"],
};

const PaymentsCard = () => {
  const { t } = useTranslation();
  const userInfo = Digit.UserService.getUser();
  const userRoles = userInfo?.info?.roles?.map((roleData) => roleData?.code);
  const generateLink = (labelKey, pathSuffix,roles=ROLES.ATTENDANCE) => {
    return {
      label: t(labelKey),
      link: `/${window?.contextPath}/employee/payments/${pathSuffix}`,
      roles: roles,
    };
  };
  
  if (!Digit.Utils.didEmployeeHasAtleastOneRole(Object.values(ROLES).flatMap((e) => e))) {
    return null;
  }

  let links = [
    generateLink("ATTENDANCE_REGISTERS","registers-inbox"),
    generateLink("CS_COMMON_INBOX","generate-bill", ROLES.BILLS),
    generateLink("CS_TITLE_MY_BILLS","my-bills", ROLES.BILLS),
  ];
  links = links.filter((link) => (link?.roles && link?.roles?.length > 0 ? Digit.Utils.didEmployeeHasAtleastOneRole(link?.roles) : true));

  const propsForModuleCard = {
    Icon: "UpdateExpense",
    moduleName: t("MICROPLAN_MODULE_SETUP"),
    kpis: [],
    links: links,
    className:"microplan-employee-module-card"
  };
  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default PaymentsCard;