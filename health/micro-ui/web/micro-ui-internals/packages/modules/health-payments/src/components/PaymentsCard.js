import { EmployeeModuleCard, SVG } from "@egovernments/digit-ui-react-components";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

const ROLES = {
  ATTENDANCE: ["PROXIMITY_SUPERVISOR"],
  BILLS: ["CAMPAIGN_SUPERVISOR"],
  PAYMENT_SETUP: ["CAMPAIGN_MANAGER"],
  EDIT_BILLS: ["PAYMENT_EDITOR"],
};

const PaymentsCard = () => {
  // Reset session storage
  useEffect(() => {
    Digit.SessionStorage.del("paymentInbox");
    Digit.SessionStorage.del("selectedValues");
    Digit.SessionStorage.del("selectedLevel");
    Digit.SessionStorage.del("selectedProject");
    Digit.SessionStorage.del("selectedBoundaryCode");
    Digit.SessionStorage.del("boundary");
  }, []);

  const { t } = useTranslation();
  const userInfo = Digit.UserService.getUser();
  const userRoles = userInfo?.info?.roles?.map((roleData) => roleData?.code);
  const generateLink = (labelKey, pathSuffix, roles = ROLES.ATTENDANCE) => {
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
    generateLink("ATTENDANCE_SETUP_PAYMENT_ATTRIBUTES", "payment-setup",ROLES.PAYMENT_SETUP),
    generateLink("ATTENDANCE_REGISTERS", "project-selection"),
    generateLink("CS_COMMON_INBOX", "project-and-aggregation-selection", ROLES.BILLS),
    generateLink("CS_TITLE_MY_BILLS", "my-bills", ROLES.BILLS),
    generateLink("CS_TITLE_VERIFY_AND_GENERATE_PAYMENTS", "verify-bills", ROLES.BILLS),
    generateLink("CS_TITLE_EDIT_BILLS", "edit-bills", ROLES.EDIT_BILLS),
  ];
  const hasRequiredRoles = (link) => {
    if (!link?.roles?.length) return true;
    return Digit.Utils.didEmployeeHasAtleastOneRole(link.roles);
  };
  links = links.filter(hasRequiredRoles);

  const propsForModuleCard = {
    Icon: "UpdateExpense",
    moduleName: t("HCM_PAYMENTS"),
    kpis: [],
    links: links,
    className: "microplan-employee-module-card",
  };
  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default PaymentsCard;
